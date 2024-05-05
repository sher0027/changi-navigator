import React from 'react';
import { Box, Typography, createTheme, ThemeProvider } from '@mui/material';
import Banner from '../components/Banner';
import Calendar from '../components/Calendar';


const theme = createTheme({
    typography: {
      allVariants: {
        color: 'white', 
        fontFamily: 'Comic Sans MS',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
      },
    },
  });

function WelcomeDescr() {
    return (
    <ThemeProvider theme={theme}>
        <Box sx={{ padding: '70px 150px 50px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{fontSize: '2rem', fontWeight: 'bold'}}>Welcome to Changi Navigator</Typography>
                <Typography sx={{ margin: '10px 20px 0px', fontSize: '0.6rem' }}>Your Personalized Airport Trip Planner</Typography>
            </Box>

            <Banner></Banner>
            <Typography variant='body2' gutterBottom>Changi Navigator is designed to streamline your travel experience to and within Changi Airport.
                It provides customized travel itineraries, real-time GPT-powered chat assistance, and efficient navigation using Google Maps integration.
            </Typography>
            <Box sx={{width: 'max-content', margin: 'auto'}}>
                <Calendar></Calendar>
            </Box>
        </Box>
    </ThemeProvider>
    );
}
export default WelcomeDescr;