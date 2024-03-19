import React, {useState, useEffect} from 'react';
import {Box, Typography, TextField, IconButton} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {OpenAI} from 'openai';

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID;
const ASSISTANT_NAME = process.env.NEXT_PUBLIC_ASSISTANT_NAME;
const openai = new OpenAI({apiKey: API_KEY, dangerouslyAllowBrowser: true});


function Dialog() {
    const [threadId, setThreadId] = useState('');
    const [lastRunId, setLastRunId] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Step 2: Initialise a new thread for each user instance
    useEffect(() => {
        async function initThread() {
            try {
                const thread = await openai.beta.threads.create();
                setThreadId(thread.id);
                await startRun(thread.id);
            } catch (error) {
                console.error('Error initializing the thread: ', error);
            }
        }

        initThread();
    }, []);

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
        <Box sx={{padding: '100px 100px 50px'}}>
            <Box
                sx={{
                    bgcolor: '#F0F2F6',
                    margin: 'auto',
                    borderRadius: '20px',
                    padding: '20px',
                    maxHeight: '300px',
                    maxWidth: '800px',
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
    );
}

export default Dialog;