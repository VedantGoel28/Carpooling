import express from 'express';
import mongoose from 'mongoose';
import OfferedRide from './OfferRide.js';
import dotenv from 'dotenv';

dotenv.config();



mongoose.connect(process.env.MONGO_ETHERSHUTTLE_URI).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));
const app = express();
const PORT = 9000;
app.use(express.json());

app.post('/offeredRide/post', (req, res) => {
    const { metaid, driver, source, dest, time, contact } = req.body;
    OfferedRide.create({ metaid: metaid, driver: driver, source: source, dest: dest, time: time, contact: contact }).then((newRide) => {
        res.send(newRide);
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/offeredRide/get', (req, res) => {
    OfferedRide.find({ "active": true }).then((rides) => {
        res.send(rides);
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });