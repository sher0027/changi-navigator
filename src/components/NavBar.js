import React from 'react';
import { AppBar, Box, Button} from '@mui/material';
import {Home, Logout}  from '@mui/icons-material';
import { useRouter } from 'next/router';


function NavigationBar() {
    const router = useRouter();

    const handleHomeClick = () => {
        router.push('/app');
    };

    const handleLogoutClick = () => {
        router.push('/');
    };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
            <Button
                    onClick={handleHomeClick}
                    color="inherit"
                    startIcon={<Home />}
                >
                    Home
                </Button>
                <Button
                    onClick={handleLogoutClick}
                    color="inherit"
                    startIcon={<Logout />}
                >
                    Log out
                </Button>
            </Box>

        </AppBar >
    )
}

export default NavigationBar;