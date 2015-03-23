#!/usr/bin/env node

var express = require("express"),
    http = require("http"),
    currUsr,
    twixer = require("./voting.js"),
    bodyParser = require("body-parser"),
    twitter = require("simple-twitter"),
    twitAuth = require("./twitterauth.json"),
    app = express();

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(bodyParser());
twitter = new twitter(
    twitAuth.consumer_key, 
    twitAuth.consumer_secret,
    twitAuth.access_token_key,
    twitAuth.access_token_secret
);


app.post("/user/:acct",function(req,res){
    currUsr = req.params.acct;
    console.log("Current user is: "+currUsr);
    res.send("user.html");
});

app.post("/user", function(req,res){
    res.send(currUsr);
});

app.post("/submit", function(req,res){
    var submit = req.body.tweet;
    twixer.createTweet(submit);
});

app.post("/votes", function(req,res){
    var votes = twixer.getTweetsForAcct(currUsr);
    res.json(votes);
});

app.post("/yes",function(req,res){
    var usrVote = { user: currUsr, vote: 1, tweet: req.body.tweet };
    twixer.processVote(usrVote);
});

app.post("/no",function(req,res){
    var usrVote = { user: currUsr, vote: 0, tweet: req.body.tweet };
    twixer.processVote(usrVote);
});

app.post("/tally", function(req,res){
    res.json(twixer.getTally());
});

app.post("/post", function(req,res){
    console.log(twitAuth.consumer_key);
    twitter.post('status/update',
            {"status": req.body.tweet},
            function(error,data){
                console.dir(data);
            }
        );
});

console.log("Server listening on http://localhost:3000");