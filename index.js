const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Routes

app.get('/hello', (req, res) => {
    res.json("Hello")
});

// Users Routes
app.use('/users', require('./routes/users/sign_up'));
app.use('/users', require('./routes/users/login'));
app.use('/users', require('./routes/users/update_user'))

// Moods Routes
app.use('/moods', require('./routes/moods/create_mood'));
app.use('/moods', require('./routes/moods/get_current_mood'));
app.use('/moods', require('./routes/moods/get_mood_history'));
app.use('/moods', require('./routes/moods/mood_during_day'));

// Recommendations Routes
app.use('/recommendations', require('./routes/recommendations/get_user_recommendations'));


//Listen
app.listen(8000, () => console.log("Listening to port 8000..."));
