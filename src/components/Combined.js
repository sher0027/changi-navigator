import React, {useState, useEffect} from 'react';
import {Box, Typography, TextField, IconButton, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {OpenAI} from 'openai';

// Calendar part
import {useRouter} from 'next/navigation'

// Dialog part
const GPT_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID;
const ASSISTANT_NAME = process.env.NEXT_PUBLIC_ASSISTANT_NAME;
const openai = new OpenAI({apiKey: GPT_API_KEY, dangerouslyAllowBrowser: true});

// Calendar part
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISCOVERY_DOC = process.env.NEXT_PUBLIC_DISCOVERY_DOC;
const SCOPES = process.env.NEXT_PUBLIC_SCOPES;

function Combined() {
    // Dialog part
    const [threadId, setThreadId] = useState('');
    const [lastRunId, setLastRunId] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    // Todo: Calendar
    const router = useRouter();

    const [authorizeButtonVisible, setAuthorizeButtonVisible] = useState(false);
    const [signoutButtonVisible, setSignoutButtonVisible] = useState(false);
    const [addEventButtonVisible, setAddEventButtonVisible] = useState(false);

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Step 2: Initialise a new thread for each user instance
    useEffect(() => {
        // Dialog part
        // initThread().then()

        // Todo: Calendar
        // Load the Google API and Google Identity Services client libraries
        const loadGapi = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => resolve();
            document.body.appendChild(script);
        });

        const loadGis = new Promise((resolve) => {
            const gsiScript = document.createElement('script');
            gsiScript.src = 'https://accounts.google.com/gsi/client';
            gsiScript.onload = () => resolve();
            document.body.appendChild(gsiScript);
        });

        Promise.all([loadGapi, loadGis]).then(() => {
            window.gapi.load('client', initializeGapiClient);
            gisLoaded();
        });


        return () => {
            // Cleanup script elements if component unmounts
            document.querySelectorAll('script[src*="googleapis"], script[src*="accounts.google"]').forEach((script) => {
                document.body.removeChild(script);
            });
        };

    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function initThread() {
        try {
            const thread = await openai.beta.threads.create();
            setThreadId(thread.id);
            await startRun(thread.id);
        } catch (error) {
            console.error('Error initializing the thread: ', error);
        }
    }

    // Todo: Calendar
    const initializeGapiClient = async () => {
        try {
            await window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOC],
                scope: SCOPES,
            });
            gapiInited = true;
            maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing the Google API client:', error);
        }
    };
    const gisLoaded = () => {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
                if (response.error !== undefined) {
                    throw new Error(response.error);
                }
                setSignoutButtonVisible(true);
                setAuthorizeButtonVisible(false);
                setAddEventButtonVisible(true);
                // Optionally, push to another route after successful authorization
                // router.push('/home');
            },
        });
        gisInited = true;
        maybeEnableButtons();
    };

    const maybeEnableButtons = () => {
        console.log("Enabling Buttons")
        if (gapiInited && gisInited) {
            setAuthorizeButtonVisible(true);
        }
    };

    const handleAuthClick = () => {
        if (!window.gapi.client.getToken()) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
        initThread();
    };

    const handleSignoutClick = () => {
        window.google.accounts.oauth2.revoke(window.gapi.client.getToken().access_token, () => {
            console.log('Token revoked and user signed out');
            window.gapi.client.setToken(null); // Clear the client token
            setSignoutButtonVisible(false);
            setAuthorizeButtonVisible(true);
            setAddEventButtonVisible(false);
            // Optionally, navigate user somewhere else after sign-out
            router.push('/');
        });
    };
    const addEvent = (event) => {
        // const event = {
        //     summary: 'Flight from Singapore to Langkawi',
        //     start: {
        //         dateTime: '2024-03-15T20:30:00+08:00',
        //     },
        //     end: {
        //         dateTime: '2024-03-15T21:00:00+08:00',
        //     },
        // };

        console.log(event)
        const request = window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        request.execute(function (event) {
            alert('Event created: ' + event.htmlLink);
            // listUpcomingEvents(); // Refresh the events list
        });
    };

    const listUpcomingEvents = async () => {
        try {
            const response = await window.gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: 'startTime',
            });
            setEvents(response.result.items);
        } catch (err) {
            console.error('Error listing events:', err.message);
            setEvents([]); // Clear events on error
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    async function startRun(threadId) {
        // Step 3: Initialise a new run
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });
        await waitRunToComplete(threadId, run.id);
        const newMessage = await getNewMessage(threadId);
        setMessages([...messages, {name: ASSISTANT_NAME, text: newMessage}]);
    }

    // Should be correct
    async function waitRunToComplete(thread_id, run_id) {
        let run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
        let new_run_status = run.status;

        //Polling
        while (new_run_status === 'queued' || new_run_status === 'in_progress') {
            run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
            new_run_status = run.status;
            if (new_run_status === "requires_action" && run.required_action.type === "submit_tool_outputs") {
                run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
                let calendar_event = JSON.parse(run.required_action.submit_tool_outputs.tool_calls[0].function.arguments)
                let tool_call_id = run.required_action.submit_tool_outputs.tool_calls[0].id
                await addEvent(calendar_event)
                let tool_output = await openai.beta.threads.runs.submitToolOutputs(
                    thread_id,
                    run_id,
                    {
                        tool_outputs: [
                            {
                                tool_call_id: tool_call_id,
                                output: "Done inserting",
                            },
                        ],
                    }
                );
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    //Should be correct
    async function getNewMessage(thread_id) {
        let newMessageList = await openai.beta.threads.messages.list(thread_id);

        // Waiting GPT to generate new message
        while (newMessageList.data[0].content.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            newMessageList = await openai.beta.threads.messages.list(thread_id);
        }
        return newMessageList.data[0].content[0].text.value;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //When user press send
    async function handleUserInput(event) {
        if (!input.trim()) return; //If empty

        // addEvent();

        let userMessage = {name: 'You', text: input};
        setMessages((currentMessages) => [...currentMessages, userMessage]);

        await openai.beta.threads.messages.create(
            threadId,
            {role: "user", content: userMessage.text}
        );

        let run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });
        setLastRunId(run.id);
        await waitRunToComplete(threadId, run.id);

        // Get response from GPT
        const newMessage = await getNewMessage(threadId);
        setMessages((currentMessages) => [...currentMessages, {name: ASSISTANT_NAME, text: newMessage}]);
        setInput('');
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //When user press 'Enter'
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleUserInput(event);
            event.preventDefault();
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <Box sx={{ margin: 'auto'}}>
                <Box
                    sx={{
                        bgcolor: '#F0F2F6',
                        margin: 'auto',
                        borderRadius: '20px',
                        padding: '20px',
                        maxHeight: '600px',
                        width: '500px',
                        overflowY: 'auto',
                        '::-webkit-scrollbar': {
                            display: 'none'
                        },
                        scrollbarWidth: 'none'
                    }}>

                    {messages.map((msg, index) => (
                        <Typography key={index} gutterBottom>
                            {msg.name === 'You' ? 'You' : 'Assistant'}: {msg.text}
                        </Typography>
                    ))}

                    <Box sx={{display: 'flex'}}>
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Type a message"
                            variant="outlined"
                            size="small"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <IconButton color="primary" aria-label="send" onClick={handleUserInput}>
                            <SendIcon/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            {authorizeButtonVisible && (
                <Button onClick={handleAuthClick} sx={{ display: 'block', margin: '0 auto' }}>
                    Start!
                </Button>
            )}
        </>
    );
}

export default Combined;