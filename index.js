const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';
const url2 = 'https://es.wikipedia.org';

app.get('/', async (req, res) => {
    try {
        // realizo la primera solicitud 
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // obtener enlaces de nw-pages
        const links = [];
        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
            console.log(link);
        });

        // Recorro los enlaces y le paso el enlace a una funcion
        const data = [];
        for (const link of links) {
            const linkData = await obteberLinkData(link);
            data.push(linkData);
        }
        //pintando los links y obteniendo la direccion
        console.log(links);
        res.send(`
            <h1>${h1}</h1>
            <ul>
                ${imagenes.map(img => `<li>${img}</li>`).join('')}
            </ul>
            <ul>
                <li>${parrafos}</li>
            </ul>;
        `)
    } catch (error) {
        console.log('Error al obtener la pagina', error);
        res.status(500).send('Error del servidor');
    }
});
async function obteberLinkData(link) {
    try {
        // realizo la segunada solicitud con los links de lo paperos
        const response = await axios.get(`https://es.wikipedia.org${link}`);
        const html = response.data;
        const $ = cheerio.load(html);

        // obtener cada uno de los datos en funcion del link pasado

        const h1 = $('h1').text();
        const imagenes = [];
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            imagenes.push(src);
        });
        const parrafos = [];
        $('p').each((index, element) => {
            const textoParrafo = $(element).text();
            parrafos.push(textoParrafo);
        });
        return { h1, imagenes, parrafos };
    } catch (error) {
        console.error(`Error obtencion de datos${link}`, error);
        return null;
    }
}

app.listen(3000, () => {
    console.log('express está escuchando en el puerto http://localhost:3000');
});