import express from 'express';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb'
import 'dotenv/config';
import  {User}  from './models/UserModel.js'
//import bodyParser from 'body-parser';  deprecated

// Intiate a new express 
const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

/* MONGO DB SETUP */
const client =  new MongoClient(process.env.URL);
const db = client.db('MainDatabase')

client.connect().then( () => {
    console.log('MongoDB Connected!');
});


/* COLLECTIONS */
const Users =  db.collection('Users')



/* Other APIs */
// Method to call the Open Library Search API 
app.get('/search-books', async (req, res) => {
try{
    const query =  req.query.q;
    const respose =  await fetch(`https://openlibrary.org/search.json?q=${query}`)
    const data = await respose.json();
    res.json(data)
}
catch(error){
    console.error('Error fetching data from Open Library API:', error);
    res.status(500).json({ error: 'Failed to fetch data' })
}
})

/* USER REGISTER */
app.post("/register", async (req,res)=>{
try{
    const hashedPassword =  await bcrypt.hash(req.body.password, 10)
    const data =  {
        first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: hashedPassword
    }
    await Users.insertOne(data) // Create the data on the DB
    res.status(200).json("User Created Successfully")
}catch(err){
    console.log(err.message)
    res.status(500).json({Error: err.message})
}
})

/* USER LOGIN */
app.post("/login", async(req,res) =>{
    const email = req.body.email
    const password = req.body.password
    try{
        const user = await User.login(email, password)
        if(user === "incorrect") {
            res.status(401).send({Error : "Incorrect Email"})
        }
        else if(user === "undefined") {
            res.status(401).send({Error : "Incorrect Password"})
        }
        else{
            console.log(user)
        }
    }
    catch(err){
        console.log(err)
    }

})




