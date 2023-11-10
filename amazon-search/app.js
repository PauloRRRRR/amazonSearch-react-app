const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.amazon.com.br/s?k=notebook&__mk_pt_BR=ÅMÅŽÕÑ&crid=2FX74TPG4WYSI&sprefix=headphone%2Caps%2C179&ref=nb_sb_noss_2';

const productsData = [];

async function getHTML() {
    const { data: html } = await axios.get(url);
    return html;
}

getHTML().then((res) => {
    const $ = cheerio.load(res);

    // Assuming each product is contained within a div with class '.s-result-item'
    $('.sg-col-inner').each((i, product) => {
        const title = $(product).find('.a-size-base-plus.a-color-base.a-text-normal').text();
        const rating = $(product).find('.rating').text(); // Adjust this based on the actual structure
        // Add other data extraction logic here based on the structure of the page

        // Store product data in an array
        productsData.push({ title, rating });
    });

    console.log(productsData);
});
