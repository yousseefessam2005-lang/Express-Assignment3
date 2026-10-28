
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const file = __dirname + "/users.json";


/*####################################################################################*/
app.post("/user", (req, res) => {

    const user = req.body;

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    if (!user || !user.id || !user.name || !user.email || user.age === undefined) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

    if (users[user.id]) {
        return res.status(409).json({
            message: "ID already exists"
        });
    }

    for (let id in users) {
        if (users[id].email === user.email) {
            return res.status(409).json({
                message: "Email already exists."
            });
        }
    }

    users[user.id] = user;

    fs.writeFileSync(file, JSON.stringify(users, null, 2));

    res.status(201).json({
        message: "User added successfully."
    });

});


/*####################################################################################*/

app.patch("/user/:id", (req, res) => {

    const id = req.params.id;

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    if (!Object.hasOwn(users, id)) {
        return res.status(404).json({
            message: "User ID not found."
        });
    }

    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
            message: "Invalid data"
        });
    }

    if (req.body.email !== undefined) {
        for (let x in users) {
            if (x !== id && users[x].email === req.body.email) {
                return res.status(409).json({
                    message: "Email already exists."
                });
            }
        }
    }

    if (req.body.name !== undefined) {
        users[id].name = req.body.name;
    }

    if (req.body.age !== undefined) {
        users[id].age = req.body.age;
    }

    if (req.body.email !== undefined) {
        users[id].email = req.body.email;
    }

    fs.writeFileSync(file, JSON.stringify(users, null, 2));

    res.json({
        message: "User updated successfully."
    });

});


/*####################################################################################*/

app.delete("/user/:id", (req, res) => {

    const id = req.params.id;

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    if (!Object.hasOwn(users, id)) {
        return res.status(404).json({
            message: "User ID not found."
        });
    }

    delete users[id];

    fs.writeFileSync(file, JSON.stringify(users, null, 2));

    res.json({
        message: "User deleted successfully."
    });

});


/*####################################################################################*/

app.get("/user/getByName", (req, res) => {

    const name = req.query.name;

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    for (let id in users) {

        if (users[id].name === name) {
            return res.json(users[id]);
        }

    }

    res.status(404).json({
        message: "User name not found."
    });

});


/*####################################################################################*/

app.get("/user", (req, res) => {

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    res.json(users);

});

/*####################################################################################*/

app.get("/user/filter", (req, res) => {

    const minAge = Number(req.query.minAge);

    if (!Number.isFinite(minAge) || req.query.minAge === undefined || req.query.minAge === "") {
        return res.status(400).json({
            message: "Invalid minimum age"
        });
    }

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    const result = {};
    let count = 0;

    for (let id in users) {

        if (users[id].age >= minAge) {
            result[id] = users[id];
            count++;
        }

    }

    if (count === 0) {
        return res.json({
            message: "no user found"
        });
    }

    res.json(result);

});

/*####################################################################################*/

app.get("/user/:id", (req, res) => {

    const id = req.params.id;

    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    if (!Object.hasOwn(users, id)) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    res.json(users[id]);

});



















app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
