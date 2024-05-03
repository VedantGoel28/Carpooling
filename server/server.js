import express from 'express';
import mongoose from 'mongoose';
import OfferedRide from './OfferRide.js';
import User from './user.js'
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

mongoose.connect(process.env.MONGO_ETHERSHUTTLE_URI).then(() => console.log('Connected to MongoDB')).catch((err) => console.log(err));
const PORT = 9000;
function startServer() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected : ${socket.id}`);
        socket.on('join', (metaid) => {
            socket.join(metaid);
            console.log(`User ${socket.id} joined room ${metaid}`);
        });

        socket.on('sendoffer', (data) => {
            console.log(data.driver_id);
            socket.to(data.driver_id).emit(`recieveoffer`, data);
        });

        socket.on('acceptOffer', (data) => {
            console.log(`${data.driver_id} accepted offer from ${data.userid} at ${data.acceptedamt}`);
            socket.to(data.driver_id).emit(`offeraccepted`, data);
        });

        socket.on('negotiateOffer', (data) => {
            console.log(`Negotiating offer with ${data.userid}`);
            socket.to(data.driver_id).emit(`negotiate`, data);
        });
    });

    app.post('/offeredRide/post', (req, res) => {
        const { metaid, driver, source, dest, time, contact, totalSeats, carNumber, carName } = req.body;

        OfferedRide.create({ metaid: metaid, driver: driver, source: source, dest: dest, time: time, contact: contact, availableSeats: totalSeats, totalSeats: totalSeats, carNumber: carNumber, carName: carName }).then((newRide) => {
            res.send("Ride posted successfully!");
        }).catch((err) => {
            res.send("Sorry, a ride with this account already exists!!");
        });
    });

    app.get('/offeredRide/get', (req, res) => {
        OfferedRide.find({ "active": true }).then((rides) => {
            res.send(rides);
        }).catch((err) => {
            res.send(err);
        });
    });

    app.post('/offeredRide/updateOffers', (req, res) => {
        const { metaid, userid, username, contact, offeredamt, usrsrc, usrdst, passengerscnt } = req.body;
        OfferedRide.findOneAndUpdate({ metaid: metaid }, { $push: { offers: { userid: userid, username: username, contact: contact, offeredamt: offeredamt, usrsrc: usrsrc, usrdst: usrdst, passengerCount: parseInt(passengerscnt), accepted: false, paid: false, rejected: false } } }).then((ride) => {
            res.send("Offer added successfully!");
        }).catch((err) => {
            res.send(err);
        });
    });


    app.post('/offeredRide/getOffers', (req, res) => {
        const { metaid } = req.body;
        OfferedRide.findOne({ metaid: metaid }).then((ride) => {
            res.send(ride.offers);
        }).catch((err) => {
            res.send(err);
        });
    });

    app.post('/adduser', async (req, res) => {
        const { metaid, username, contact } = req.body;
        const user = await User.findOne({ metaid: metaid });
        if (user) {
            res.send("User already exists");
        }
        else {
            User.create({ metaid: metaid, username: username, contact: contact }).then(() => {
                res.send("User added successfully!");
            }).catch((err) => {
                res.send(err);
            });
        }
    });

    app.post('/saveRide', async (req, res) => {
        const { metaid, driver, source, dest, amountPaid, passengerCount, carNumber } = req.body;
    });

    app.post('/offeredRide/acceptOffer', (req, res) => {
        const { metaid, userid, passengerCount,acceptedamt } = req.body;
        OfferedRide.findOne({ metaid: metaid })
            .then((ride) => {
                // Find the index of the offer with the given userid in the offers array
                const offerIndex = ride.offers.findIndex((offer) => offer.userid === userid);
                if (offerIndex !== -1) {
                    // Update the accepted field of the offer to true
                    ride.offers[offerIndex].accepted = true;
                    ride.availableSeats -= passengerCount;
                    ride.offers[offerIndex].offeredamt = acceptedamt;
                    // Save the updated document
                    ride.markModified('offers'); // Mark offers array as modified
                    ride.save()
                        .then(() => {
                            res.send("Offer accepted!");
                        })
                        .catch((err) => {
                            res.status(500).send(err);
                        });
                } else {
                    res.status(404).send("Offer not found.");
                }
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    });

    setInterval(() => {
        OfferedRide.deleteMany({ active: false })
            .then((result) => {
                // do nothing
            })
            .catch((err) => {
                console.error(`Failed to delete document: ${err}`);
            });
    }, 30000);

    app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });
    server.listen(9001, () => { console.log('Socket server listening on port 9001') });
}

startServer();

setInterval(() => {
    console.log('Restarting server...');
    process.exit();
}, 3600000);