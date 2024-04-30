import React from 'react';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import Dialog from '../components/Dialog';
import Calendar from '../components/Calendar';
import Map from '../components/Map';
import Combined from "@/components/Combined";
import { Paper, Box } from '@mui/material';




export default function Home() {

    return (
        <>
            <GlobalCss />
            <NavBar></NavBar>
            <Paper sx={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(/images/bg.jpg)',
                backgroundSize: 'cover',
                display: 'flex',
                paddingTop: '10px'
            }}>
                {/* <Combined></Combined> */}
                <Dialog></Dialog>
                <Box sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    margin: 'auto',
                }}>
                    <Map></Map>
                    <Calendar></Calendar>
                </Box>
                
            </Paper>

        </>

    );
}