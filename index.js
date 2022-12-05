const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const config = require('./config/config.json');

app.use(cors());
app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require('./data/models');

db.sequelize.sync();

app.use('/', require('./routes/user'));
app.use('/file', require('./routes/file'));


const PORT = config.port | 3000;

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})
