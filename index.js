const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b96xw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 5054;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const trainingCollection = client.db("bdDriving").collection("traning");
  const adminCollection = client.db("bdDriving").collection("admins");
  const reviewCollection = client.db("bdDriving").collection("reviews");
  
  console.log("Database connected successfully");


  // inserting review to database
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  });

  // inserting admin to database
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  });


  // getting trainings from database
  app.get('/training', (req, res) => {
    trainingCollection.find({})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  // getting reviews from database
  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, docs) => {
      console.log("reviews", docs);
      res.send(docs);
    })
  });

  // getting reviews from database
  app.get('/admins', (req, res) => {
    adminCollection.find({})
    .toArray((err, docs) => {
      console.log("admins", docs);
      console.log(req.body);
      res.send(docs);
    })
  });

  // find a single training via ObjectId
  app.get('/training/:id', (req, res) => {
    trainingCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  // delete a training from database
  app.delete('/deleteTraining/:id', (req, res) => {
    trainingCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    });
  });


});


app.get('/', (req, res) => {
  res.send('Hello Shahadat!');
})

app.listen(port);