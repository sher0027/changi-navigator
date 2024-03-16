import React from 'react';
import Link from 'next/link';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import WelcomeDescr from '../components/WelcomeDescr';

import { Paper } from '@mui/material';


export default function Login() {
    return (
        <>
            <GlobalCss />
            <NavBar></NavBar>
            <Paper sx={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url(/images/bg.jpg)',
                backgroundSize: 'cover',
            }}>
                <WelcomeDescr></WelcomeDescr>
                <Calendar></Calendar>
            </Paper>
        </>

    );



}