const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express();

const port = 5000;

//middleware

app.use(cors())
app.use(express.json());    


//username : mydbuser1
//password : xsCZrmIx1MuMhOwp



const uri = "mongodb+srv://mydbuser1:xsCZrmIx1MuMhOwp@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("foodmaster");
      const usersCollection = database.collection("users");

      //get api

      app.get('/users', async(req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);

      })

      // find single user 

      app.get('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const user = {_id:ObjectId(id)}
        const result = await usersCollection.findOne(user)
        console.log("got my id", id);
        res.send(result)
    })
     
      //post api =>

      app.post('/users', async(req, res)=>{
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body)
            console.log('added user', result)
            res.json(result)
      })
      
      //delete api 

      app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await usersCollection.deleteOne(query);
            console.log('deleting user', result);
            res.json(result)
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('runnig my mongo crud server');
});



app.listen(port, ()=>{
    console.log("running port", port);
})