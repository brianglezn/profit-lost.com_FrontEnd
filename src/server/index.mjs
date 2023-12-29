import { DB_NAME, client } from "./database.mjs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).send("Username, email, and password are required");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Almacenar usuario en MongoDB
    const usersCollection = client.db(DB_NAME).collection("users");
    const result = await usersCollection.insertOne({
      _id: new ObjectId(),
      username,
      email,
      password: hashedPassword,
      categorias: [],
      cuentas: [],
      movimientos: [],
    });

    res.status(201).send(`User created with id ${result.insertedId}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error creating user: " + e.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersCollection = client.db(DB_NAME).collection("users");
    const user = await usersCollection.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Aquí deberías generar un token o iniciar una sesión
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (e) {
    res.status(500).send("Error during login");
  }
});

// Start Express's server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Try a db conecction
async function testDBConnection() {
  try {
    const usersCollection = client.db(DB_NAME).collection("users");
    const documents = await usersCollection.find({}).toArray();
    console.log("Documentos en la colección Users:", documents);
  } catch (e) {
    console.error("Error al obtener documentos:", e);
  }
}
testDBConnection();
