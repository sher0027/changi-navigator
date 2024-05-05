import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

const CLIENT_ID =  process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISCOVERY_DOC = process.env.NEXT_PUBLIC_DISCOVERY_DOC;
const SCOPES = process.env.NEXT_PUBLIC_SCOPES;
const PLUGIN_NAME = process.env.NEXT_PUBLIC_ASSISTANT_NAME;

function Calendar() {
    // Add useState hooks for controlling visibility of buttons
    const [authorizeButtonVisible, setAuthorizeButtonVisible] = useState(false);
    const [linkVisible, setLinkVisible] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);
    const [gisInited, setGisInited] = useState(false);
    const [gapiInited, setGapiInited] = useState(false);

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

        // First, ensure GAPI is loaded
        loadGapi.then(() => {
            window.gapi.load('client', () => {
                initializeGapiClient().then(() => {
                    loadGis.then(() => {
                        gisLoaded();
                    }).catch(err => console.error("GIS script failed to load:", err));
                });
            });
        }).catch(err => console.error("GAPI script failed to load:", err));

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
                scope: SCOPES,
                plugin_name: PLUGIN_NAME,
            });
            console.log("Google API Client successfully initialized");
            setGapiInited(true);
            // maybeEnableButtons();
        } catch (error) {
            console.error('Error initializing the Google API client:', error);
            setGapiInited(false);
        }
    };

    const gisLoaded = () => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            console.log("Loading Gis");
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                    console.log("OAuth response:", response);
                    if (response.error) {
                        console.error("OAuth error:", response.error);
                        setGisInited(false);
                    }
                },
            });
            setGisInited(true);
            console.log("Token client is initialized and authenticated successfully.");
            setTokenClient(client);
            maybeEnableButtons();
        } else {
            console.error("Google Identity Services not fully loaded.");
            setGisInited(false);
        }
    };

    const maybeEnableButtons = () => {
        console.log("Enabling Buttons");
        if (!window.gapi.client.getToken()) 
            setAuthorizeButtonVisible(true); 
        else
            setLinkVisible(true);
    };

    const handleAuthClick = () => {
        if(tokenClient){
            tokenClient.requestAccessToken({ prompt: 'consent' });
            setAuthorizeButtonVisible(false); 
            setLinkVisible(true);
        }
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
