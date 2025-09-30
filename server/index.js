const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/predict', (req, res) => {
    const pythonScriptPath = path.join(__dirname, '..', 'ML', 'predict.py');
    const inputData = JSON.stringify(req.body);

    const pythonProcess = spawn('python', [pythonScriptPath, inputData]);

    let predictionData = '';
    pythonProcess.stdout.on('data', (data) => {
        predictionData += data.toString();
    });

    let errorData = '';
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log('Input to python script:', inputData);
        console.log('Python script stdout:', predictionData);
        console.error('Python script stderr:', errorData);
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(errorData);
            return res.status(500).json({ error: 'Error making prediction', details: errorData });
        }
        try {
            const prediction = JSON.parse(predictionData);
            res.json({ prediction: prediction });
        } catch (e) {
            console.error('Error parsing prediction JSON:', e);
            console.error('Prediction data received:', predictionData);
            res.status(500).json({ error: 'Error parsing prediction from model' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});