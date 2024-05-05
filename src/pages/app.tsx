import React,  { useState, useEffect } from 'react';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import WelcomeDescr from '../components/WelcomeDescr';
import Image from '../components/Image';
import { Paper } from '@mui/material';

export default function App() {
    const [img, setImg] = useState("");
    
    return (
        <>
            <GlobalCss />
            <NavBar></NavBar>
            <Image setImg={setImg} />
            <Paper sx={{
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
            }}>
                <WelcomeDescr></WelcomeDescr>
            </Paper>
        </>

    );



}