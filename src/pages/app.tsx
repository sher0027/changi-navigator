import React,  { useState, useEffect } from 'react';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import WelcomeDescr from '../components/WelcomeDescr';
import { Paper } from '@mui/material';

const ACCESS_KEY =  process.env.NEXT_PUBLIC_IMG_KEY;

export default function App() {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);

    const fetchRequest = async () => {
        const data = await fetch(
          `https://api.unsplash.com/search/photos?query=travel&page=1&per_page=1&client_id=${ACCESS_KEY}`
        );
        const dataJ = await data.json();
        const result = dataJ.results;
        console.log(result[0].urls);
        setRes(result);
        setImg(result[0].urls.raw);
      };
      useEffect(() => {
        fetchRequest();
      }, []);
    
    return (
        <>
            <GlobalCss />
            <NavBar></NavBar>
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