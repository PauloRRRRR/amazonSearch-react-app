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

        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
        });
        
        const $ = cheerio.load(html);

        // Assuming each product is contained within a div with class '.s-result-item'
        $('.sg-col-inner').each((i, product) => {
            const rawTitle = $(product).find('.a-size-base-plus.a-color-base.a-text-normal').text();
            const title = truncateTitle(rawTitle, 40);
            var rating = $(product).find('span[aria-label="1.205"] a span.a-size-base.s-underline-text').text().trim(); // Adjust this based on the actual structure
            const imageUrl = $(product).find('.s-image').attr('src');
            const stars = $(product).find('i.a-icon.a-icon-star-small.a-star-small-5.aok-align-bottom span.a-icon-alt').text();

            // Store product data in the local array
            productsData.push({ title, rating, imageUrl, stars });
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
