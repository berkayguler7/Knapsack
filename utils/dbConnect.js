import pkg from 'pg';
const { Client } = pkg;

// Create a new client instance
const client = new Client({
    user: 'wsldev',
    host: '172.20.253.129',
    database: 'knapsack',
    password: '4141',
    port: 5432,
});

// Connect to the database
client.connect();

export default client;