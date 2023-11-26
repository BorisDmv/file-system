var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const connection = require('./db_config');
const cors = require('cors');

var indexRouter = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });


app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file selected');
    }

    const { originalname, filename } = req.file;

    // Save both filenames to the database
    const sql = 'INSERT INTO files (original_filename, stored_filename) VALUES (?, ?)';
    connection.query(sql, [originalname, filename], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }

        res.json({ message: 'File uploaded successfully' });
    });
});


app.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;

    // Construct the path to the file in the 'uploads' folder
    const filePath = path.join(__dirname, 'uploads', filename);

    // Send the file as a response
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    });
});



// Express server endpoint to get the list of files
app.get('/files', (req, res) => {
    const sql = 'SELECT * FROM files';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }

        res.json(results);
    });
});





const subscribers = [];


app.post('/subscribe', (req, res) => {
    const { webhookUrl } = req.body;
    subscribers.push(webhookUrl);
    res.status(200).send('Subscribed to webhook');
});


app.use('/', indexRouter);
module.exports = app;