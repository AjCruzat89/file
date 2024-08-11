//<!--===============================================================================================-->
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); 
//<!--===============================================================================================-->
const app = express();
const port = 3000;
//<!--===============================================================================================-->
app.use(cors());
app.set('trust proxy', true);
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ limit: '10gb', extended: true }));
//<!--===============================================================================================-->
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
//<!--===============================================================================================-->
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 * 1024 },
}).array('myFiles');
//<!--===============================================================================================-->
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
//<!--===============================================================================================-->
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            if (req.files == undefined || req.files.length === 0) {
                res.status(400).json({ message: 'No files selected' });
            } else {
                const fileList = req.files.map(file => `uploads/${file.filename}`);
                res.status(200).json({
                    message: 'Files uploaded successfully',
                    files: fileList
                });
            }
        }
    });
});
//<!--===============================================================================================-->
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages',  'index.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages',  'upload.html'));
});

app.get('/videos', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages',  'videos.html'));
});

app.get('/pictures', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages',  'pictures.html'));
});
//<!--===============================================================================================-->
app.get('/videos_all', (req, res) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
    const protocol = req.secure ? 'https' : 'http';
    // const baseUrl = `${protocol}://${req.get('host')}/uploads/`;
    const baseUrl = `/uploads/`;
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory' });
        }
        const videos = files
            .filter(file => videoExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => `${baseUrl}${file}`);
        res.status(200).json(videos);
    });
});
//<!--===============================================================================================-->
app.get('/pictures_all', (req, res) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    const protocol = req.secure ? 'https' : 'http';
    // const baseUrl = `${protocol}://${req.get('host')}/uploads/`;
    const baseUrl = `/uploads/`;

    fs.readdir('./uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory' });
        }
        const pictures = files
            .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => `${baseUrl}${file}`);
        res.status(200).json(pictures);
    });
});
//<!--===============================================================================================-->
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//<!--===============================================================================================-->