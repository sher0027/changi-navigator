import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from '@mui/material';

const CLIENT_ID =  process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISCOVERY_DOC = process.env.NEXT_PUBLIC_DISCOVERY_DOC;
const SCOPES = process.env.NEXT_PUBLIC_SCOPES;

function Calendar() {
    const router = useRouter();

    // Add useState hooks for controlling visibility of buttons
    const [authorizeButtonVisible, setAuthorizeButtonVisible] = useState(false);
    const [signoutButtonVisible, setSignoutButtonVisible] = useState(false);
    const [addEventButtonVisible, setAddEventButtonVisible] = useState(false);

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    useEffect(() => {
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
                router.push('/home');
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
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
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

    const addEvent = () => {
        const event = {
            summary: 'Flight from Singapore to Langkawi',
            start: {
                dateTime: '2024-03-15T20:30:00+08:00',
            },
            end: {
                dateTime: '2024-03-15T21:00:00+08:00',
            },
        };

        const request = window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        request.execute(function (event) {
            alert('Event created: ' + event.htmlLink);
            listUpcomingEvents(); // Refresh the events list
        });
    };

    // Updated listUpcomingEvents function
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


    return (
        <>
            {/* {authorizeButtonVisible && (
                
            )} */}
            <Button onClick={handleAuthClick} sx={{ display: 'block', margin: '0 auto' }}>
                Get Started!
            </Button>
            {signoutButtonVisible && (
                <Button onClick={handleSignoutClick}>Sign Out</Button>
            )}
            {addEventButtonVisible && (
                <Button onClick={addEvent}>Add Event</Button>
            )}
        </>
    )
}

export default Calendar;
