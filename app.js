import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import knapsackGreedy from "./utils/knapsackGreedy.js";
import client from './utils/dbConnect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/knapsack/', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        let fileName = JSON.parse(data.split('\n')[1].split(';')[2].split("=")[1])
        const numWeightItems = data
            .split('\n')
            .filter((input) => input !== '')
            .slice(4, -2) // first 4 lines and last 2 lines are webkit headers and whitespace
            .map((input) => {
                return input.split(' ').map((input) => {
                    return parseFloat(input);
                });
            });
        const [numItems, maxWeight] = numWeightItems[0];
        const rawItems = numWeightItems.slice(1);
        let items = rawItems.map((item, i) => {
            return [item[0], item[1], i];
        }); // convert each item to an array with the format [value, weight, index]
        let sack = knapsackGreedy(items, numItems, maxWeight);
        res.json(sack.errorMessage);

        if(sack.errorMessage) {
            console.log('error: ' + sack.errorMessage);
            return;
        }

        const query = `
            INSERT INTO submissions (value, selected, items, file_name, error_message)
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [sack.totalValue, sack.sackedItems, JSON.stringify(sack.items), fileName, sack.errorMessage];
        console.log(values);
        client.query(query, values, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('inserted into db');
        });
    });
});

app.get('/control/:fileName', (req, res) => {
    console.log("GET /control/:fileName");
    const query = `
    SELECT * FROM public.submissions
    WHERE file_name = $1
    ORDER BY value DESC
    LIMIT 5
`;
    const values = [req.params.fileName];
    client.query(query, values, (err, dbRes) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(dbRes.rows);
    });
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
