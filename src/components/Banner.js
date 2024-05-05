import React, {useState, useEffect} from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box } from '@mui/material';
import Link from 'next/link';

const API_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

function Banner() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const body = {
            includedTypes: ["tourist_attraction"],
            languageCode: 'en',
            maxResultCount: 5,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: 1.3521,
                        longitude: 103.8198
                    },
                    radius: 30000
                }
            }
        };

        fetch(`https://places.googleapis.com/v1/places:searchNearby?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'places.displayName,places.id,places.photos,places.formattedAddress,places.websiteUri'
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            console.log(data.places)
            if (data.places) {
                const formattedPlaces = data.places.map(place => ({
                    name: place.displayName.text,
                    description: place.formattedAddress,
                    web: place.websiteUri,
                    image: `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${API_KEY}`
                }));
                setItems(formattedPlaces);
            } else {
                throw new Error(data.error_message || "Failed to fetch places");
            }
        })
        .catch(error => {
            console.error('Error fetching places:', error);
        });
    }, []);

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
                }}>{props.item.description}
                <br />
                <Link href={props.item.web} target="_blank" style={{ color: 'blue', textDecoration: 'none' }}>
                    {props.item.web}
                </Link>
                </Box>
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