import { DB_NAME, client } from './database.mjs';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});

//Collections
const usersCollection = client.db(DB_NAME).collection('users');

// Probar la conexión con una consulta
const documents = await usersCollection.find({}).toArray();
console.log('Documentos en la colección Users:', documents);

// UserRegister
