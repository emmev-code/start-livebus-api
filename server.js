const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

// Permette richieste da qualsiasi origine
app.use(cors());

// Route API che estrae i dati da GridView1
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://infobus.startromagna.it/CapienzaAutobusTempoReale/');
        const $ = cheerio.load(response.data);

        const rows = [];

        $('#GridView1 tr').each((i, row) => {
            const columns = $(row).find('td').map((j, col) => $(col).text().trim()).get();
            if (columns.length > 0) {
                rows.push(columns);
            }
        });

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recupero dei dati');
    }
});

app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});
