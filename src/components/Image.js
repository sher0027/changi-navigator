import React, { useEffect } from 'react';

const ACCESS_KEY = process.env.NEXT_PUBLIC_IMG_KEY;

function Image({ address, setImg }) {
    useEffect(() => {
        const fetchImages = async () => {
            if (!address || address.trim() === "") {
                console.warn("Invalid address for image query.");
                return;
            }

            try {
                const imagesUrl = `https://api.unsplash.com/search/photos?query=${address}&page=1&per_page=5&client_id=${ACCESS_KEY}`;
                const response = await fetch(imagesUrl);
                if (!response.ok) {
                    throw new Error("Error fetching images");
                }
                const data = await response.json();
                console.log("Fetched image data:", data);
                if (data.results.length > 0) {
                    setImg(data.results.map(result => result.urls.raw));
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, [address, setImg]);

    return null;
}

export default Image;
