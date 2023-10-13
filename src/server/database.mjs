import { MongoClient, ServerApiVersion  } from 'mongodb';

const DB_USER = 'PLAdmin';
const DB_PASS = 'rFP7L9cmIGORk23z';
const DB_NAME = 'Profit-Lost';

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@pruebasbridev.lglillv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export {DB_NAME, client}