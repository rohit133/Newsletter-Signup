// jshint esversion: 6

const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const request  = require('request');
const https = require('https');


const app = express();
app.use(express.static("public"));

var authKey = process.env.API_KEY;
var listId = process.env.LIST_ID;


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, resp){
    resp.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    console.log(fname, lname, email);

    var data = {
        members: [
            {
                email_address :  email,
                status: "subscribed",
                merge_feilds: {
                    FNAME : fname,
                    LNAME : lname,

                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/"+listId;
    const options = {
        method: "POST",
        auth: authKey
    }

    const request = https.request(url, options, function(resp){

        if(resp.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
            // res.send("Success");
        } else {
            res.sendFile(__dirname+"/failure.html");
            // res.send("failed");
        }
        resp.on("data", function(data){
            console.log(JSON.parse(data));
        })
        
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure.html", function(req, res){
    res.redirect("/"); 
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000.");
});



