const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage: GET all Animals custom object records
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-63078715?properties=name,pet_type,owner_name';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Animals | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Form page: GET the form to add a new Animal record
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - Form submit: POST new Animal record then redirect to homepage
app.post('/update-cobj', async (req, res) => {
    const newAnimal = {
        properties: {
            name: req.body.name,
            pet_type: req.body.pet_type,
            owner_name: req.body.owner_name
        }
    };
    const url = 'https://api.hubapi.com/crm/v3/objects/2-63078715';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, newAnimal, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));