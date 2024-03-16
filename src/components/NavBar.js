import React from 'react';
import Link from 'next/link';
import { AppBar, Box, Button } from '@mui/material';


function NavigationBar() {
    return (
        <AppBar position='fixed'
            sx={{
                height: '50px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'transparent'
            }}>
            Changi Navigator
        </AppBar >
    )
}

export default NavigationBar;
