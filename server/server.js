import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.log(err));

// Create Mongoose Schema
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  address: { type: String, required: true },
  team: { type: String, required: true },
  mobile: { type: String, required: true, minlength: 10, maxlength: 10 },
  category: { type: String, required: true },
  role: { type: String, required: true },
  battingPosition: { type: String }, 
  battingPlaying: { type: String },  
  bowlingStyle: { type: String },  
  registeredAt: { type: Date, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);

// Registration API Route
app.post('/api/register', async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json({ message: "Registration successful", data: newPlayer });
  } catch (error) {
    res.status(500).json({ message: "Error registering player", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));