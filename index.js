const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Mongodb platform running')
})
// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9y7gcsu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
console.log(uri);

// async await
async function run() {
  try {
    const NewsPost = client.db("socialMedia").collection("post");
    const Comments  = client.db("socialMedia").collection("Comments")
    
    // post api
    app.get('/newsPost', async (req, res) => {
      const query = {};
      const cursor = NewsPost.find(query);
      const category = await cursor.toArray();
      res.send(category);
    })
    app.post('/newsPost', async (req, res) => {
      try {
        const services = await NewsPost.insertOne(req.body)
        if (services.insertedId) {
          res.send({
            success: true,
            message: 'Service created successfully!'
          })
        } else {
          res.send({
            success: false,
            error: "Couldn't create service!"
          })
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message
        })
      }
    })
    app.get('/newsPost/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const user = await NewsPost.findOne(query)
      res.send(user);
    })

    // comments api
    app.get('/message', async (req, res) => {
      let query = {};
      const cursor = Comments.find(query);
      const comment = await cursor.toArray();
      res.send(comment);
    })
    app.post('/message', async (req, res) => {
      const comment = req.body;
      console.log(comment);
      const result = await Comments.insertOne(comment)
      res.send(result);
    })

    // Single comment with id
    app.get("/message/:id", async (req, res) => {
      try {
        const id = req.params.id
        const comment = await Comments.findOne({ _id: new ObjectId(id) })
        res.send({
          success: true,
          message: 'Successfully got the comment data',
          data: comment,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    })
    // Comment Deleted
    app.delete('/message/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await Comments.deleteOne(query);
        if (result.deletedCount) {
          res.send({
            success: true,
            message: 'Successfully deleted the review'
          })
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message
        })
      }



    })

  }
  finally {

  }
}

run().catch(err => console.log(err))

app.listen(port, () => {
  console.log(`simple node server running on port ${port}`);
}) 