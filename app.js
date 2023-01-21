var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var crypto = require('crypto');
require('dotenv').config();


var indexRouter = require('./routes/index');



let saltKey = process.env.SECRET_KEY;

let test = crypto.randomUUID();

// console.log(test);



var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);




let highscoreArray = ["hej", "hejdå", "vi ses"]
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
    },
]


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


// get leaderboard
app.get("/leaderboard", (req, res) => {

    let highscoreArray = ["hej", "hejdå", "vi ses"]
    res.json(highscoreArray)
})


//login user
app.post("/login", (req, res) => {

    for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];

        if (user.username === req.body.username && user.password === req.body.password) {
            res.send("Hej " + user.username + " här är ditt id: " + user.id)
            return
        }
        
    }

    res.send("no user match")

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT, () => {

    console.log("server är igång på port: 4000");

})


module.exports = app;
