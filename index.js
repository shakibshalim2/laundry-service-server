const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4pw7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const testimonials = client.db("laundry-service").collection("testimonials");
    const services = client.db("laundry-service").collection("service");
    const serviceCollection = client.db("laundry-service").collection("service-collection");
    app.post('/addService', (req, res) => {
        const service = req.body;
        services.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })
    app.post('/addTestimonials', (req, res) => {
        const testimonial = req.body;
        testimonials.insertOne(testimonial)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })


    app.get('/testimonial', (req, res) => {
        testimonials.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })
    app.get('/service', (req, res) => {
        services.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })
    app.get('/service/:id', (req, res) => {
        const id = req.params.id;
        services.find({ _id: ObjectID(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    app.post('/addServices', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })
    app.get('/orderServices', (req, res) => {

        serviceCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)

            })

    })


});


app.listen(process.env.PORT || port)