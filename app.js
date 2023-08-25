import knapsackGreedy from "./utils/knapsackGreedy.js";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/knapsack', (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        console.log(data);

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
        console.log("Sack: ", sack);
        res.send(sack);
    });
});

app.listen(3000, () => {
    console.log('listening on 3000');
});



//console.log(knapsackGreedy(items, maxWeight));
