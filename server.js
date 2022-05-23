const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//prepare for deployment by allowing connection information to be linked via MONGODB_URI

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dear-diary', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Allows the server console to log what's going on

mongoose.set('debug', true);

app.use(require('./routes'));

app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));