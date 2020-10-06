const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;


const app = express(); 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmdyz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const eventCollection = client.db("volunteerNetwork").collection("events");
  const RegisteredEventCollection = client.db(dbName).collection('registeredEvent');
    console.log('data conncet');
    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addRegisteredEvent', (req, res) => {
        const registeredEvent = req.body;
        // console.log(registeredEvent);
        RegisteredEventCollection.insertOne(registeredEvent)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/', (req, res) => {
        res.send("Hey, It is created by Roky Vhai.");
    })
    
    app.get('/event', (req, res) => {
        eventCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/registeredEvent', (req, res) => {
        RegisteredEventCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id)
        RegisteredEventCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
          console.log(result);
          res.send(result.deletedCount > 0);
        })
    })

});




app.listen(process.env.PORT || 5000); 
