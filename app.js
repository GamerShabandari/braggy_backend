var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var crypto = require('crypto');
require('dotenv').config();



// var indexRouter = require('./routes/index');

let saltKey = process.env.SECRET_KEY;

var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);





let highscoreArray = [
    {
        username: "kalle",
        highscore: 100,
    },
    {
        username: "musse",
        highscore: 200,
    },
    {
        username: "Janne",
        highscore: 300,
    }
]


let usersArray = [
    {
        username: "kalle",
        password: "anka",
        highscore: 0,
        id: crypto.randomUUID()
    },
    {
        username: "musse",
        password: "pigg",
        highscore: 0,
        id: crypto.randomUUID()
    },
    {
        username: "Janne",
        password: "Långben",
        highscore: 0,
        id: crypto.randomUUID()
    }
]




/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


// get leaderboard
app.get("/leaderboard", (req, res) => {

    let highscoreArray = ["hej", "hejdå", "vi ses"]
    res.json(highscoreArray)
})


// post highscore to leaderboard
app.post("/postHighscore/:id", (req, res) => {

    for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];

        if (user.id === req.params.id) {

            for (let i = 0; i < highscoreArray.length; i++) {
                const highscore = highscoreArray[i];

                if (highscore.username === req.body.username && highscore.highscore < req.body.highscore) {
                    highscore.highscore = req.body.highscore;
                    let status = { success: "new highscore saved" }
                    res.send(status)
                    return
                }
                if (highscore.username === req.body.username && highscore.highscore > req.body.highscore) {
                    let status = { error: "new highscore lower than previously saved" }
                    res.send(status)
                    return
                }
            }

            let newHighscore = {
                username: req.body.username,
                highscore: req.body.highscore,
            }

            highscoreArray.push(newHighscore)

            highscoreArray.sort((h1, h2) => (h1.highscore < h2.highscore) ? 1 : (h1.highscore > h2.highscore) ? -1 : 0);


            let status = {
                success: "new highscore saved",
                leaderboard: highscoreArray
            }
            res.send(status)
            return
        }

    }
    let status = { error: "no user" }
    res.send(status)
})


//create user
app.post("/createUser", (req, res) => {

    for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];

        if (user.username === req.body.username) {
            let status = { error: "username already taken" }
            res.send(status)
            return
        }
    }

    let newUser = {
        username: req.body.username,
        password: req.body.password,
        highscore: 0,
        id: crypto.randomUUID()
    }

    usersArray.push(newUser);
    let status = { success: "user created" }
    res.send(status)

})

//login user
app.post("/login", (req, res) => {

    for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];

        if (user.username === req.body.username && user.password === req.body.password) {
            let status = { loggedIn: true, id: user.id }
            res.send(status)
            return
        }

    }

    res.send("fail")

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



app.listen(process.env.PORT, () => {

    console.log("server är igång på port: 4000");

})


module.exports = app;
