const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const detectDiseases=require('./detect.routes')
const supportTips=require('./support.routes');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: ['https://plant-model.vercel.app'],  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization']  
}));

app.use(bodyParser.json());

const dbURI = 'mongodb+srv://amky40011:%40Arch1103y@cluster0.u5hxehe.mongodb.net/plant?retryWrites=true&w=majority';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/detect',detectDiseases);
app.use('/api/support',supportTips);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});