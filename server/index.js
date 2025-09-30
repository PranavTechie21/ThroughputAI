const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const path = require('path');
const { spawn } = require('child_process');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railway_dashboard';

// MongoDB connection with better options for Atlas
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
}).then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`🔗 Connected to: ${MONGO_URI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'}`);
}).catch((e) => {
  console.error('❌ MongoDB connection error:', e.message);
  if (MONGO_URI.includes('<username>') || MONGO_URI.includes('<password>') || MONGO_URI.includes('<cluster-url>')) {
    console.error('💡 Please update your .env file with actual MongoDB Atlas credentials');
    console.error('📚 See .env.example for setup instructions');
  }
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // demo only; hash in production
});
const User = mongoose.model('User', userSchema);

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, password }); // demo auto-register
  }
  if (user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ uid: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/files/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const filename = req.file.originalname;
  const uploadStream = gfsBucket.openUploadStream(filename, {
    metadata: { uploadedBy: req.user.email, uploadedAt: new Date().toISOString() },
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', (file) => {
    res.json({ fileId: file._id, filename: file.filename });
  });
  uploadStream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ error: 'Upload error' });
  });
});

app.get('/api/files/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = gfsBucket.openDownloadStream(_id);
    downloadStream.on('error', () => res.status(404).end());
    downloadStream.pipe(res);
  } catch {
    res.status(400).json({ error: 'Bad id' });
  }
});

app.post('/api/predict', (req, res) => {
  const pythonProcess = spawn('python', [path.join(__dirname, '..\\', 'ML', 'predict.py'), JSON.stringify(req.body)]);

  let prediction = '';
  pythonProcess.stdout.on('data', (data) => {
    prediction += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Prediction script failed' });
    }
    res.json({ prediction: prediction.trim() });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));


