const { static } = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("requests");
const https = require("https");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;

    const data = {
        members: [{
            email_address: emailAddress,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        }, ],
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/5d169d1e0d";

    const options = {
        method: "POST",
        auth: "vishal:4715c9857ea559d0097ad2aadad3def7-us6",
    };

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening to port :${port}`);
});

//API Key
// 4715c9857ea559d0097ad2aadad3def7-us6

//List ID
// 5d169d1e0d