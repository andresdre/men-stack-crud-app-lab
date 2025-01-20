// load our environment variables
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const methodOverride = require('method-override')
const Car = require('./models/car')

const app = express()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', function(){
	console.log('Express has establised a connection with MongoDB')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));


app.get('/cars/new', function(req, res){
	res.render('cars/new');
})

app.post('/cars', async function(req, res){
    try {
        const {make, model, year, price} = req.body;
        await Car.create({make, model, year, price});
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        res.redirect('/cars/new');
    }
})

app.get('/cars/index', async function(req, res){
	const cars = await Car.find();
	res.render('cars/index', {cars});
});

app.get('/cars/:id/edit', async function(req, res){
    const car = await Car.findById(req.params.id);
        res.render('edit', {car});
});

app.put("/cars/:id", async (req, res) => {
    try {
        const {make, model, year, price} = req.body;
        await Car.findByIdAndUpdate(req.params.id, {make, model, year, price});
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        res.redirect(`/cars/${req.params.id}/edit`);
    }
  });

app.delete("/cars/:id", async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.redirect('/cars');
    } catch (error) {
        console.error(error);
        res.redirect('/cars');
    }
});

app.listen(3000, function(){
	console.log('Listening on Port 3000')
})


