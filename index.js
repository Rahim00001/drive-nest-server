const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lk92epi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const carCollection = client.db("carDB").collection('car');

        app.get('/car', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query);
            res.send(result);
        })
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query);
            res.send(result);
        })

        app.post('/car', async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        })

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCar = req.body
            const car = {
                $set: {
                    image: updatedCar.image,
                    name: updatedCar.name,
                    price: updatedCar.price,
                    rating: updatedCar.rating,
                    brand: updatedCar.brand,
                    type: updatedCar.type
                }
            }

            const result = await carCollection.updateOne(filter, car, options);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('DriveNest server is running')
})

app.listen(port, () => {
    console.log(`DriveNest server is running on port: ${port}`);
})