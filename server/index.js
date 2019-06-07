const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const clientId = '646720763187.657669850772'
const clientSecret = '174322dae7c53ca627f734811d19306e'

const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/appenpraise').then(() => {console.log("Mongoose is up!")})

const AppenPraise = require('./models/appenpraise')

const PORT = 4390

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT, () => console.log("App listening on port " + PORT))

app.get('/', (req, res) => res.send('Ngrok is working! Path Hit: ' + req.url))

app.get('/oauth', (req, res) => {
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
            method: 'GET',
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);
            }
        })
    }
})

app.post('/command', (req, res) => res.send('Your ngrok tunnel is up and running!'))

const fs = require("fs");
app.post('/appenpraise', async (req, res) => {
    const praise = req.body.text
    if (await AppenPraise.findOne({praise})) {
        return res.json({success: false, message: 'The praise already exists!'})
    }
    const appenpraise = new AppenPraise({
        praise
    })
    await appenpraise.save(_ => {
        res.json({success: true, message: "Praise has been successfully saved!"})
    }, (err) => {
        res.json({success: false, message: "Praise failed to save!"})
    })
})