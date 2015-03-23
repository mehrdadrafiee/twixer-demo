function main(){
    "use strict";

    var votes;

    var loadVotes = function(){        
        $(".vote-queue").empty();
        $(".voted").empty();
        $(".tweets").empty();
        $.post("votes", function(res){
            var toVote = res.toVote,
                voted = res.voted;
            toVote.forEach(function(tweet){
                console.log(tweet.text);
                $(".vote-queue").append(createTweetHTML(tweet.text));
            });

            voted.forEach(function(tweet){
                $(".voted").append($("<p>").text(tweet));
            });
        });
        $.post("tally",function(res){
            var tweets = res.tally;
            tweets.forEach(function(tweet){
                $(".tweets").append($("<p>").text("'"+tweet.text+"' Yes: "+tweet.yes+" No: "+tweet.no));
            });
        });
    };

    $.post("user", function(res){
        $("#username").text(res);
    });
    loadVotes();

    $("#submit").on("click", function(){
        var tweetText = $("#tweet").val();
        console.log("submittal");
        $.post("submit",{tweet: tweetText});
        loadVotes();
    });

    //Event handler for yes votes
    var upvoteClick = function(){
        console.log("you hit yes");
        var $tweet = $(this).parent(),
            text = $tweet.find("span").text();

        $.post("yes",{ tweet: text });
        loadVotes();
    };

    // //Event handler for no votes
    var downvoteClick = function(){
        console.log("you hit no");
        var $tweet = $(this).parent(),
            text = $tweet.find("span").text();

        $.post("no",{ tweet: text });
        loadVotes();
    };

    // //Prepares and return a tweet html object
    function createTweetHTML(text){
        var $tweet = $("<div>").addClass("tweet-obj"),
            $text = $("<span>").text(text),
            $upvote = $("<button>Yes</button>"),        
            $downvote = $("<button>No</button>");

        //initialize buttons
        $upvote.click(upvoteClick);
        $downvote.click(downvoteClick);

        //build tweet object
        $tweet.append($text);
        $tweet.append($upvote);
        $tweet.append($downvote);

        return $tweet; 
    }
}

$(document).ready(main);