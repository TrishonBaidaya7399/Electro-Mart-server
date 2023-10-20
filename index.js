const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const mongodb = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middlewares 
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ib2nrjf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    const productCollection = client.db("productDB").collection("product");
    const userCollection = client.db("userDB").collection("user");
    const cartCollection = client.db("cartDB").collection("cartItems");
    
    //get all products
    app.get('/product', async(req, res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    //get a product
    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query)
      res.send(result);
    })

    // set product
    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result);
      // console.log(object);
    })

    //update product
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = req.body;
      const productUpdated = {
        $set: {
          name: updatedProduct.name,
          photo: updatedProduct.photo,
          brand: updatedProduct.brand,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
        }
      };
    
      try {
        const result = await productCollection.updateOne(filter, productUpdated);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product');
      }
    });
    


    //get all users
    app.get('/user', async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    // set user
    app.post('/user', async(req, res)=>{
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result);
      // console.log(object);
    })
  
    // set items to cart
    app.post('/cartitems', async(req, res)=>{
      const cartItem = req.body;
      console.log(cartItem);
      const result = await cartCollection.insertOne(cartItem)
      res.send(result);
      // console.log(object);
    })
    
   
     //get all items to cart
     app.get('/cartitems', async(req, res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
   



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Server is Running...')
})
app.listen(port, ()=>{
    console.log(`Listening from PORT: ${port}`);
})