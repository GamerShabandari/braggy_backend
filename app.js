var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var crypto = require('crypto');
require('dotenv').config();

const fs = require('fs');
const { log } = require('console');
const saltKey = process.env.SECRET_KEY;

var app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const userspath = './userslist.json';
const highscorespath = './highscoreslist.json';


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// get leaderboard
app.get("/leaderboard", (req, res) => {

    if (fs.existsSync(highscorespath)) {
        console.log('file exists');

        fs.readFile("./highscoreslist.json", "utf-8", (err, jsonString) => {
            let highscoreArray = JSON.parse(jsonString);
            res.json(highscoreArray)
        })
    } else {
        console.log('file not found! - creating it for first time');
        let array = []
        let highscoreArraySerialized = JSON.stringify(array)

        fs.writeFile("./highscoreslist.json", highscoreArraySerialized, err => {
            if (err) {
                console.log(err);
            } else {
                console.log("file written");
                fs.readFile("./highscoreslist.json", "utf-8", (err, jsonString) => {
                    let highscoreArray = JSON.parse(jsonString);
                    res.json(highscoreArray)
                })
            }
        })
    }
})

// post highscore to leaderboard
app.post("/postHighscore/:id", (req, res) => {

    if (fs.existsSync(userspath)) {
        console.log('file exists');
    } else {
        console.log('file not found! - creating it for first time');
        let array = []
        let usersArraySerialized = JSON.stringify(array)

        fs.writeFile("./userslist.json", usersArraySerialized, err => {
            if (err) {
                console.log(err);
                return
            } else {
                console.log("file written");
            }
        })
    }

    if (fs.existsSync(highscorespath)) {
        console.log('file exists');
    } else {
        console.log('file not found! - creating it for first time');
        let array = []
        let highscoreArraySerialized = JSON.stringify(array)

        fs.writeFile("./highscoreslist.json", highscoreArraySerialized, err => {
            if (err) {
                console.log(err);
                return
            } else {
                console.log("file written");
            }
        })
    }

    let highscoreArray = []

    let usersArray = []

    fs.readFile("./highscoreslist.json", "utf-8", (err, jsonString) => {
        highscoreArray = JSON.parse(jsonString);
        console.log(highscoreArray);

        fs.readFile("./userslist.json", "utf-8", (err, jsonString) => {
            usersArray = JSON.parse(jsonString);
            console.log(usersArray);

            for (let i = 0; i < usersArray.length; i++) {
                const user = usersArray[i];
                console.log(user);

                if (user.id === req.params.id) {

                    for (let i = 0; i < highscoreArray.length; i++) {
                        const highscore = highscoreArray[i];

                        if (highscore.username === req.body.username && Number(highscore.highscore) < Number(req.body.highscore)) {
                            highscore.highscore = req.body.highscore;

                            highscoreArray.sort((h1, h2) => (Number(h1.highscore) < Number(h2.highscore)) ? 1 : (Number(h1.highscore) > Number(h2.highscore)) ? -1 : 0);


                            let highscoreArraySerialized = JSON.stringify(highscoreArray)

                            fs.writeFile("./highscoreslist.json", highscoreArraySerialized, err => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("file written");
                                }
                            })

                            let status = { success: "new highscore saved" }
                            res.send(status)
                            return
                        }
                        if (highscore.username === req.body.username && Number(highscore.highscore) > Number(req.body.highscore)) {
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

                    highscoreArray.sort((h1, h2) => (Number(h1.highscore) < Number(h2.highscore)) ? 1 : (Number(h1.highscore) > Number(h2.highscore)) ? -1 : 0);


                    let highscoreArraySerialized = JSON.stringify(highscoreArray)

                    fs.writeFile("./highscoreslist.json", highscoreArraySerialized, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("file written");
                            let status = {
                                success: "new highscore saved",
                                leaderboard: highscoreArray
                            }
                            res.send(status)
                            return
                        }
                    })
                }
            }
        })
    })
})

//create user
app.post("/createUser", (req, res) => {

    if (fs.existsSync(userspath)) {
        console.log('file exists');
    } else {
        console.log('file not found! - creating it for first time');
        let array = []
        let usersArraySerialized = JSON.stringify(array)

        fs.writeFile("./userslist.json", usersArraySerialized, err => {
            if (err) {
                console.log(err);
                return
            } else {
                console.log("file written");
            }
        })
    }

    let usersArray = []

    fs.readFile("./userslist.json", "utf-8", (err, jsonString) => {
        usersArray = JSON.parse(jsonString);
        console.log(usersArray);

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


        let usersArraySerialized = JSON.stringify(usersArray)

        fs.writeFile("./userslist.json", usersArraySerialized, err => {
            if (err) {
                console.log(err);
            } else {
                console.log("file written");
                let status = { success: "user created" }
                res.send(status)
            }
        })
    })
})

//login user
app.post("/login", (req, res) => {

    if (fs.existsSync(userspath)) {
        console.log('file exists');
    } else {
        console.log('file not found! - creating it for first time');
        let array = []
        let usersArraySerialized = JSON.stringify(array)

        fs.writeFile("./userslist.json", usersArraySerialized, err => {
            if (err) {
                console.log(err);
                return
            } else {
                console.log("file written");
            }
        })
    }

    let usersArray = []

    fs.readFile("./userslist.json", "utf-8", (err, jsonString) => {
        usersArray = JSON.parse(jsonString);
        console.log(usersArray);

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
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT, () => {

    console.log("server är igång på port: 4000");

})


module.exports = app;
