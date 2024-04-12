import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button, Box } from '@mui/material';

function Banner() {
    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen! Probably the most random thing you have ever seen! Probably the most random thing you have ever seen!",
            image: "https://picsum.photos/200?random=1"
        },
        {
            name: "Random Name #2",
            description: "Hello World!",
            image: "https://picsum.photos/200?random=2"
        }
    ]

    return (
        <Carousel>
            {
                items.map((item, i) => <Item key={i} item={item} />)
            }
        </Carousel>
    )
}

function Item(props) {
    return (
        <Paper
            sx={{
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                backgroundColor: 'rgba(253, 249, 235, 0.8)'
            }}>
            <Box
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    borderRadius: "20px",
                    margin: "10px",
                    fontSize: "15px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >{props.item.name}
                <Box sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    margin: "10px 0",
                    fontSize: "10px",
                    fontFamily: "Georgia, serif",
                    height: "3em",
                    overflow: "hidden",
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{props.item.description}</Box>
                <Box
                    component="img"
                    src={props.item.image}
                    sx={{
                        width: "100%",
                        height: "200px"
                    }}
                ></Box>
            </Box>
        </Paper>
    )
}

export default Banner;