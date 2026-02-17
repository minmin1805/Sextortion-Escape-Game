import crypto from 'crypto';
import Player from '../models/Player.js';

export const createPlayer = async (req, res) => {
    try {
        
        const {username} = req.body;

        if(!username || username.trim() === '' || typeof username !== 'string') {
            return res.status(400).json({error: 'Username is required and must be a string'});

        }

        const sessionId = crypto.randomUUID();

        const createdPlayer = await Player.create({sessionId: sessionId, name: username});

        if(!createdPlayer) {
            return res.status(500).json({error: 'Failed to create player'});
        }

        res.status(201).json({
            id: createdPlayer._id,
            name: createdPlayer.name,
            sessionId: createdPlayer.sessionId,
        })
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}


export const updatePlayer = async (req, res) => {
    try {
        

        const {id} = req.params;

        const {score, correctAnswers, badge, completedAt} = req.body;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'Invalid player ID'});
        }

        const updateData = {};

        if(typeof score === 'number') {
            updateData.score = score;
        }

        if(typeof correctAnswers === 'number') {
            updateData.correctAnswers = correctAnswers;
        }
        
        if(typeof badge === 'string') {
            updateData.badge = badge;
        }

        if(completedAt && typeof completedAt === 'string') {
            updateData.completedAt = new Date(completedAt);
        }

        // now update
        const updatedPlayer = await Player.findByIdAndUpdate(id, 
            {
                $set: updateData,
            },
            {new: true, runValidators: true}
        );

        if(!updatedPlayer) {
            return res.status(404).json({error: 'Player not found'});
        }

        res.status(200).json({updatedPlayer
        })
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}