const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const app = express();
require('dotenv').config();     //dotenv ei tule automaattisesti, vaatii tän

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'   /*,     //vähän epäturvallisempi tapa tehdä tämä
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    } */
}));

app.set('view engine', 'handlebars');


//seuraavassa muut tiedot korvattu, lisäksi lisätty database, koska sitä ei näy
const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'
+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'
+process.env.DB+'?retryWrites=true&w=majority';        





//testataan, toimiiko, onko oikeat tiedot
console.dbURI;

mongoose.connect(dbURI)     //mongoDB:n connect
.then((result) =>
{
    console.log('Connected to DB');
    const PORT = process.env.PORT  ||3000;          //tämäkin kuuluu expressiin
    app.listen(PORT, () => console.log("Listening on" + PORT));
})
.catch((err) =>
{
    console.log(err);
})


const Product = require('./models/Product');

/*   //   NÄIN VOISI LISÄTÄ YKSI KERRALLAAN
const newProduct = new Product({
    name: 'chair',
    price: 100
});

newProduct.save()
.then((result) =>
{
    console.log(result);
})
.catch((err) =>
{
    console.log(err);
})

*/


/*
Product.find()
.then((result) => {
    console.log(result);
})
*/

const getAll = async () => {
    try
    {
        const result = await Product.find();
        console.log(result);
    }
    catch
    {
        console.log(error);
    }
}

 // getAll();

 app.get('/', (req,res) => {
    res.render('index');
 });

/* API
 app.get('/products', async (req,res) => {
    try {
        const result = await Product.find();
        res.json(result);
    }
    catch (error) {
        console.log(error);
    }
})
*/

//Create products webpage and list all the resources
app.get('/products', async (req,res) => {
    try {
        const products = await Product.find();
       // res.json(result);
       res.render('products', {
        title: 'Our products',
        products: products.map(doc=> doc.toJSON())      // <- parempi keino näyttää tiedostot
       })
    }
    catch (error) {
        res.status(404),render('products', {
            title: 'We got an error here'
        })
        console.log(error);
    }
})



app.get('/products/:id', async (req,res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.json(product);
});


//Create a document to mongodb. add to mongodb, submit data from web form

//route for form page

app.get('/add-product', (req,res) => {
    res.render('add-product');
})

