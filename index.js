const express = require('express');
const jwttoken = require('jsonwebtoken')
const JWT_SECRET = "Secrettokenforauth"
const app = express();
app.use(express.json());

const users = [];

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    });

    console.log(username,password);

    res.json({
        msg: "You are Signed-up"
    })

    console.log(users);
});

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    console.log(username,password);
    
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (username == users[i].username && password == users[i].password) {
            foundUser = users[i];
        }
    }

    if (foundUser) {
        const token = jwttoken.sign({
            username: username,
            password: password,
        }
            , JWT_SECRET);

        foundUser.token = token;
        res.json({
            token: token
        })
    }
    else {
        res.status(403).send({
            msg: "Invalid username or password"
        });
    }
    console.log(users);
});

app.get("/me", function (req, res) {
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        // Verify the JWT token (removing 'Bearer ' prefix)
        const decodedInformation = jwttoken.verify(token.split(" ")[1], JWT_SECRET);
        const username = decodedInformation.username;
        let foundUser = null;

        // Find the user by username
        for (let i = 0; i < users.length; i++) {
            if (username === users[i].username) {
                foundUser = users[i];
            }
        }

        if (foundUser) {
            res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        } else {
            res.status(403).json({
                message: "Token is invalid"
            });
        }
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

app.listen(3000);