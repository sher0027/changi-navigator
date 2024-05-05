import React, { useState } from 'react';
import GlobalCss from '../components/GlobalCss';
import { Paper, Box, Typography, Button, TextField, IconButton } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [userInfo, setUserInfo] = useState({
        username: '',
        password: ''
    });
    
    const router = useRouter();

    const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, username: event.target.value });
    };
    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, password: event.target.value });
    };

    const handleSubmitUserInfo = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
    
        const responseData = await response.json();
        console.log(responseData);
    
        if (response.ok) {
            // alert(responseData.message || 'Login successful');
            router.push('/app');
        } else {
            alert(responseData.error || 'Login failed');
        }
    };

  return (
    <>
        <GlobalCss />
          <Paper
              sx={{
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'repeating-linear-gradient(290deg, #FFFFFF, #FFFFFF 800px, #22437d 800px, #22437d 100%)'
                }}
            >
              <Box sx={{
                  width: '80%', 
                  height: '85%',
                  display: 'flex',
                  backgroundColor: '#22437d',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
              }}>
                <Box sx={{
                    backgroundImage: 'url("/images/start.jpg")',
                    backgroundSize: 'cover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    borderRadius: '10px',
                    flex: 5,
                }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                        TRAVEL IS THE ONLY THING YOU BUY THAT MAKES YOU RICHER
                    </Typography>
                </Box>
                <Box sx={{ 
                    padding: 4, 
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                      <Box sx={{
                        position: 'relative',
                        border: 'none',
                        padding: '10px 20px',
                        '&::before, &::after': {
                            position: 'absolute',
                            content: '""', 
                            width: '50px',
                            height: '50px',
                        },
                        '&::before': {
                            left: 0,
                            top: 0,
                            borderLeft: '4px solid #FFFFFF',
                            borderTop: '4px solid #FFFFFF'
                        },
                        '&::after': {
                            right: 0,
                            bottom: 0,
                            borderRight: '4px solid #FFFFFF',
                            borderBottom: '4px solid #FFFFFF'
                        }
                      }}>
                        <Typography color="white" sx={{fontFamily: 'Times New Roman', fontSize: '25px', fontWeight: 'bold', '& span': {marginRight: '15px'}}}>
                            CHANGI<span></span>NAVIGATOR
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmitUserInfo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            label="Username"
                            value={userInfo.username}
                            onChange={handleChangeUsername}
                            variant="standard"
                            sx={{
                                '& .MuiInput-underline:before': { borderBottomColor: '#C9C9C9' }, 
                                '& .MuiInput-underline:after': { borderBottomColor: '#FFFFFF' }, 
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#FFFFFF' }, 
                                '& .MuiInputLabel-root': { color: '#C9C9C9' },
                                '& .Mui-focused': { color: '#FFFFFF' },
                                '& .MuiInputBase-input': { color: '#C9C9C9' },
                                width: '250px',
                                fontSize: '20px',
                                color: '#FFFFFF',
                                margin: '50px 0 20px'
                            }}
                            InputProps={{  endAdornment:  <AccountCircle style={{ color: 'white' }}></AccountCircle>}}
                            InputLabelProps={{ style: { color: 'white'} }}
                        />
                        <TextField
                            label="Password"
                            variant="standard"
                            value={userInfo.password}
                            onChange={handleChangePassword}
                            sx={{
                                '& .MuiInput-underline:before': { borderBottomColor: '#C9C9C9' }, 
                                '& .MuiInput-underline:after': { borderBottomColor: '#FFFFFF' }, 
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#FFFFFF' }, 
                                '& .MuiInputLabel-root': { color: '#C9C9C9' },
                                '& .Mui-focused': { color: '#FFFFFF' },
                                '& .MuiInputBase-input': { color: '#C9C9C9' },
                                width: '250px',
                                fontSize: '20px',
                                color: '#C9C9C9',
                                margin: '0 0 60px'
                            }}
                            InputProps={{
                                endAdornment:
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    sx={{ padding: 0 }}
                                >
                                    {showPassword ? <Visibility style={{ color: 'white' }}/> : <VisibilityOff style={{ color: 'white' }}/>} 
                                </IconButton>
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            type={showPassword ? 'text' : 'password'}
                        />
                        <Button 
                            variant="contained"
                            type="submit"
                            sx={{
                                marginY: '15px',
                                backgroundColor: '#FFFFFF',
                                color: '#22437d',
                                width: '270px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                fontFamily: 'Comic Sans MS',
                                borderRadius: '15px',
                                '&:hover': {
                                    backgroundColor: '#C9C9C9',
                                }
                            }}
                        >Login</Button>
                    </form>
                </Box>
            </Box>
        </Paper>
    </>
  );
}
