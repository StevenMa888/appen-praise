const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const fs = require('fs')

const tokenConfig = fs.readFileSync('token-config.txt', 'utf8')
const tokenConfigMap = {}
const lines = tokenConfig.split('\n').forEach(line => {
    const pair = line.split('=')
    tokenConfigMap[pair[0]] = pair[1]
})
const clientId = tokenConfigMap['clientId']
const clientSecret = tokenConfigMap['clientSecret']
const token = tokenConfigMap['token']

const app = express()
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/appenpraise').then(() => {console.log("Mongoose is up!")})

const AppenPraise = require('./models/appenpraise')

const PORT = 4390

app.use(bodyParser.json())
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

app.post('/appenpraise', async (req, res) => {
    console.log(req.body)
    const {user_name, text} = req.body
    let nominee = ''

    const firstMentionStartIndex = text.indexOf('@')
    let firstMentionEndIndex = text.indexOf(' ', firstMentionStartIndex)
    if (firstMentionStartIndex > -1) {
        if (firstMentionEndIndex < 0) {
            firstMentionEndIndex = text.length - 1
        }
        nominee = text.substring(firstMentionStartIndex + 1, firstMentionEndIndex)
    }

    if (await AppenPraise.findOne({user_name, text})) {
        return res.json({success: false, message: 'The praise already exists!'})
    }

    const appenpraise = new AppenPraise({
        user_name,
        text,
        nominee
    })

    await appenpraise.save(_ => {
        res.json({success: true, message: "Praise has been successfully saved!"})
    }, (err) => {
        res.json({success: false, message: "Praise failed to save!"})
    })
})

app.get('/api/praises', async (req, res) => {
    allPraises = await AppenPraise.find()
    res.json({allPraises})
})

app.get('/api/users', async (req, res) => {
    request({
        url: 'https://slack.com/api/users.list',
        qs: {token},
        method: 'GET',
    }, function (error, response, body) {
        if (error) {
            console.log(error)
        } else {
            console.log(body)
            res.json(JSON.parse(body))
        }
    })
})