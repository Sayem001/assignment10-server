const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.jc66yin.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const carCollecttion = client.db("carsDB").collection("cars");
    const carCart = client.db("carsDB").collection("cart");

    // add element
    app.post("/cart", async (req, res) => {
      const newCar = req.body;
      console.log(newCar);
      console.log();
      const result = await carCart.insertOne(newCar);
      res.send(result);
    });

    // get Element from database
    app.get("/cart", async (req, res) => {
      const cursor = carCart.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete from data base
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req.params);
      const query = { _id: new ObjectId(id) };
      const result = await carCart.deleteOne(query);
      res.send(result);
    });

    // add element
    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      console.log(newCar);
      const result = await carCollecttion.insertOne(newCar);
      res.send(result);
    });

    // get Element from database
    app.get("/cars", async (req, res) => {
      const cursor = carCollecttion.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete from data base
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollecttion.deleteOne(query);
      res.send(result);
    });

    // update from database
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollecttion.findOne(query);
      res.send(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      const car = {
        $set: {
          name: updatedCar.name,
          image: updatedCar.image,
          brand: updatedCar.brand,
          ratings: updatedCar.ratings,
          price: updatedCar.price,
          details: updatedCar.details,
        },
      };
      const result = await carCollecttion.updateOne(filter, car, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 10 is running");
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
