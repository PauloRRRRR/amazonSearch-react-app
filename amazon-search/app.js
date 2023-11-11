const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Function to truncate the title
function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...';
    }
    return title;
}

async function scrapeAmazon(url) {
    try {
        const productsData = [];  // Define productsData locally

        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

        // Assuming each product is contained within a div with class '.s-result-item'
        $('.sg-col-inner').each((i, product) => {
            const rawTitle = $(product).find('.a-size-base-plus.a-color-base.a-text-normal').text();
            const title = truncateTitle(rawTitle, 20);
            const rawRating = $(product).find('.a-price-whole').text(); // Adjust this based on the actual structure
            const rating = truncateTitle(rawRating, 7);
            const imageUrl = $(product).find('.s-image').attr('src');
            // Add other data extraction logic here based on the structure of the page

            // Store product data in the local array
            productsData.push({ title, rating, imageUrl });
        });

        return productsData;
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        throw error;
    }
}


app.get('/api/products', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm

        const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(searchTerm)}&crid=Z8EX757SAXN3&sprefix=%2Caps%2C449&ref=nb_sb_ss_recent_1_0_recent`;
        const products = await scrapeAmazon(url);
        console.log('Products:', products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching product data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
