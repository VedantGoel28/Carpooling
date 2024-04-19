import mongoose from 'mongoose';

const OfferRideSchema = new mongoose.Schema({
    metaid: {
        type: String,
        required: true,
        unique: true,
    },
    driver: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    dest: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    contact: {
        type: Number,
        required: true
    }
});

const OfferedRide = mongoose.model('OfferedRide', OfferRideSchema);

export default OfferedRide;