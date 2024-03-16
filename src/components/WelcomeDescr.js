import React from 'react';
import { Box, Typography } from '@mui/material';
import '@fontsource/roboto/500.css';

function WelcomeDescr() {
    return (<>
        <Box sx={{ padding: '100px 100px 50px' }}>
            <Typography variant='h5'>Welcome to Changi Navigator</Typography>
            <Typography variant='subtitle2' gutterBottom>Your Personalized Airport Trip Planner</Typography>
            <Typography variant='body2'>Changi Navigator is a web-based application designed to simplify your journey to Changi Airport. Offering tailored travel
                itineraries, real-time assistance via a GPT-powered chatbot, and efficient route planning with Google Maps integration, all based
                on your flight and hotel information.</Typography>

            <Typography>Explore Changi Airport with ease</Typography>
        </Box>
    </>);
}
export default WelcomeDescr;