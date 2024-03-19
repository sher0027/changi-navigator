import React from 'react';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import Dialog from '../components/Dialog';
import { Paper } from '@mui/material';




export default function Home() {

    return (
        <>
            <GlobalCss />
            <NavBar></NavBar>
            <Paper sx={{
                width: '100vw',
                height: '200vh',
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(/images/bg.jpg)',
                backgroundSize: 'cover',
            }}>
                <Dialog></Dialog>
            </Paper>

        </>

    );
}