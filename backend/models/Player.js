import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
    score: {
        type: Number,
        default: 0,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    badge: {
        type: String,
        default: '',
    },
    completedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;