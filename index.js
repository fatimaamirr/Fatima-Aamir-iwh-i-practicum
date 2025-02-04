
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * DO NOT include private app access tokens in your repo
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// Route 1: Homepage - Fetch and display custom object data
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/pets'; // Replace with your custom object API endpoint
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(url, { headers });
        const data = response.data.results;
        res.render('homepage', {
            title: 'Homepage | Custom Objects',
            objects: data,
        });
    } catch (error) {
        console.error('Error fetching custom objects:', error);
        res.status(500).send('Error fetching custom objects.');
    }
});

// Route 2: Form for creating/updating custom object data
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    });
});

// Route 3: Handle form submission to create/update custom objects
app.post('/update-cobj', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/pets'; // Replace with your custom object API endpoint
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    const newCustomObject = {
        properties: {
            property1: req.body.name, // Replace with actual property keys
            property2: req.body.breed,
            property3: req.body.food,
            property4: req.body.owner
        },
    };

    try {
        await axios.post(url, newCustomObject, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating/updating custom object:', error);
        res.status(500).send('Error creating/updating custom object.');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
