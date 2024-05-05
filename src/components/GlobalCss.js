import React from 'react';
import { GlobalStyles } from '@mui/material';


function GlobalCss() {
    return (
        <GlobalStyles
            styles={{
                body: {
                    margin: 0,
                    overflow: 'hidden'
                },
            }}
        />
    );
}
export default GlobalCss;