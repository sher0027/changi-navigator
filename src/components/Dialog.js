import React, {useState, useEffect} from 'react';
import {Box, Divider, TextField, IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {OpenAI} from 'openai';
import Loading from './Loading';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID;
const ASSISTANT_NAME = process.env.NEXT_PUBLIC_ASSISTANT_NAME;
const openai = new OpenAI({apiKey: API_KEY, dangerouslyAllowBrowser: true});
const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

function Dialog() {
    const [threadId, setThreadId] = useState('');
    const [lastRunId, setLastRunId] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [data, setData] = useState([]);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Step 2: Initialise a new thread for each user instance
    useEffect(() => {
        // Initialise a GPT session
        async function initThread() {
            try {
                const thread = await openai.beta.threads.create();
                setThreadId(thread.id);
                await startRun(thread.id);
            } catch (error) {
                console.error('Error initializing the thread: ', error);
            }
        }

        console.log(new Date())
        initThread();
        getCurrentLocation();

        // fetchData()
        // sendData()

    }, []);


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function fetchData() {
        const response = await fetch('./api/database');
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData)
    }

    async function logChat(newLog) {
        const response = await fetch('/api/database', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLog)
        });

        const responseData = await response.json();
        // alert(JSON.stringify(responseData));
    }

    async function startRun(threadId) {
        // Step 3: Initialise a new run
        let run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });
        await waitRunToComplete(threadId, run.id);
        setIsLoading(true);

        let userMessage = {name: 'You', text: 'Hello'};

        await openai.beta.threads.messages.create(
            threadId,
            {role: "user", content: userMessage.text}
        );

        run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });
        setLastRunId(run.id);
        await waitRunToComplete(threadId, run.id);

        // Get response from GPT
        const newMessage = await getNewMessage(threadId);
        setMessages((currentMessages) => [...currentMessages, {name: ASSISTANT_NAME, text: newMessage}]);
        let newLog = {username: "default", session: "default", timestamp: new Date(), role: "Assistant", message: newMessage}
        logChat(newLog)
        setIsLoading(false);
    }

    //Wait the server to finish generating or finish the input required
    async function waitRunToComplete(thread_id, run_id) {
        let run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
        let new_run_status = run.status;

        //Polling
        while (new_run_status === 'queued' || new_run_status === 'in_progress' || new_run_status === "requires_action") {
            run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
            new_run_status = run.status;
            if (new_run_status === "requires_action" && run.required_action.type === "submit_tool_outputs") {
                run = await openai.beta.threads.runs.retrieve(thread_id, run_id);
                let function_name = run.required_action.submit_tool_outputs.tool_calls[0].function.name
                let tool_call_id = run.required_action.submit_tool_outputs.tool_calls[0].id
                if (function_name === 'insert_event_to_google_calendar') {
                    let calendar_event = JSON.parse(run.required_action.submit_tool_outputs.tool_calls[0].function.arguments)
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
                } else if (function_name === 'get_current_location') {
                    await getCurrentLocation()
                    let currentLocationDescription
                    console.log("current long lat: ", currentLocation)
                    if (currentLocation !== null) {
                        currentLocationDescription = await fetchLocationDescription(currentLocation.lat, currentLocation.lng)
                    } else {
                        currentLocationDescription = 'Location not available, request user to input manually!'
                    }

                    console.log("location description:", currentLocationDescription)

                    let tool_output = await openai.beta.threads.runs.submitToolOutputs(
                        thread_id,
                        run_id,
                        {
                            tool_outputs: [
                                {
                                    tool_call_id: tool_call_id,
                                    output: currentLocationDescription,
                                },
                            ],
                        }
                    );
                }

            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async function getNewMessage(thread_id) {
        let newMessageList = await openai.beta.threads.messages.list(thread_id);

        // Waiting GPT to generate new message
        while (newMessageList.data[0].content.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
            newMessageList = await openai.beta.threads.messages.list(thread_id);
        }
        return newMessageList.data[0].content[0].text.value;
    }

    async function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setCurrentLocation({lat: latitude, lng: longitude});
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    async function fetchLocationDescription(lat, lng) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("data", data);
            if (data.status === 'OK') {
                return data.results[0].formatted_address
            } else {
                return 'Location not available, request user to input manually!'
            }
        } catch (error) {
            console.error('Error fetching geocode data:', error);
        }
    }


    // Execute the SQL query with the provided data
    async function insertData(newData) {
        const sql = 'INSERT INTO logging SET ?';

        connection.query(sql, newData, (err, result) => {
            if (err) {
                console.error('Error inserting data: ', err);
                return;
            }
            console.log('Data inserted successfully');
        });

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //When user press send
    async function handleUserInput(event) {
        if (!input.trim()) return; //If empty
        setIsLoading(true);

        let userMessage = {name: 'You', text: input};
        setMessages((currentMessages) => [...currentMessages, userMessage]);
        let newLog = {username: "default", session: "default", timestamp: new Date(), role: "User", message: input}
        logChat(newLog)
        setInput('');


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
        newLog = {username: "default", session: "default", timestamp: new Date(), role: "Assistant", message: newMessage}
        logChat(newLog)
        setIsLoading(false);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //When user press 'Enter'
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleUserInput(event);
            event.preventDefault();
        }
    };

    const addEvent = (event) => {
        console.log(event)
        const request = window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        request.execute(function (event) {
            alert('Event created: ' + event.htmlLink);
        });
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <Box sx={{margin: 'auto', position: 'relative'}}>
            <Box
                sx={{
                    bgcolor: '#F0F2F6',
                    margin: 'auto',
                    borderRadius: '20px',
                    padding: '20px 20px 65px',
                    maxHeight: '350px',
                    width: '600px',
                    overflowY: 'auto',
                    '::-webkit-scrollbar': {
                        display: 'none'
                    },
                    scrollbarWidth: 'none'
                }}>
                {messages.map((msg, index) => (
                    <Box key={index}>
                        <ReactMarkdown children={msg.name === 'You' ? 'You:' : 'Assistant:'}
                            remarkPlugins={[remarkGfm]} components={{
                                p: ({ node, ...props }) => (
                                    <p style={{ margin: '10px 0', fontWeight: 'bold' }} {...props} />
                                ),
                            }} />
                        <ReactMarkdown children={msg.text} remarkPlugins={[remarkGfm]} components={{
                                p: ({ node, ...props }) => (
                                    <p style={{ margin: '10px 0' }} {...props} />
                                ),
                            }} />
                        <br/>
                        {index !== messages.length - 1 && <Divider />}
                    </Box>

                ))}
                <Loading open={isLoading}/>
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: '#F0F2F6',
                    padding: '10px',
                    borderBottomLeftRadius: '20px',
                    borderBottomRightRadius: '20px',
                    zIndex: 1000
                }}>
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
        </Box>
    );
}

export default Dialog;
