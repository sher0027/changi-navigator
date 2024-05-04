import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

const CLIENT_ID =  process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISCOVERY_DOC = process.env.NEXT_PUBLIC_DISCOVERY_DOC;
const SCOPES = process.env.NEXT_PUBLIC_SCOPES;

function Calendar() {
    // Add useState hooks for controlling visibility of buttons
    const [authorizeButtonVisible, setAuthorizeButtonVisible] = useState(false);
    const [linkVisible, setLinkVisible] = useState(false);

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
            document.querySelectorAll('script[src*="googleapis"], script[src*="accounts.google"]').forEach(script => {
                // Ensure the script is still a child of the body before trying to remove it
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            });
        };
    }, []);

    const initializeGapiClient = async () => {
        try {
            await window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: [DISCOVERY_DOC],
                scope: SCOPES
            });
            console.log("Google API Client successfully initialized");
            gapiInited = true;
            maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing the Google API client:', error);
            gapiInited = false; 
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
                setAuthorizeButtonVisible(false);
            },
        });
        gisInited = true;
        maybeEnableButtons();
    };

    const maybeEnableButtons = () => {
        console.log("Enabling Buttons")
        if (gapiInited && gisInited) {
            if (!window.gapi.client.getToken()) 
                setAuthorizeButtonVisible(true); 
            else
                setLinkVisible(true);
        }
    };

    const handleAuthClick = () => {
        tokenClient.requestAccessToken({prompt: 'consent'});
        setLinkVisible(true);
    };

    return (
        <>
            {authorizeButtonVisible && (
                <Button onClick={handleAuthClick} sx={{ display: 'block', margin: '0 auto' }}>Authorize</Button>
            )}
           {linkVisible && (
                <Link href='/home'>Explore Changi Airport with ease!</Link>
            )}
        </>
    )
}

export default Calendar;
