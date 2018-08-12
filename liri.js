require("dotenv").config();
var keys = require("./keys.js"); 
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
const randomEvenNumber = require('random-even-numbers')
var fs = require("fs");



var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// create variables for terminal arguements
var input = process.argv[2];
var input2 = "";

// loop through the the arguemnts from possition 3 to the end to be used for the various function calls
for (var i = 3; i < process.argv.length; i++) {
    input2 += process.argv[i] + " ";
    
}

goToSwitch();

function goToSwitch(){
// used for the to determine which function call to use.
switch (input) {
    case "my-tweets":
        tweetCall();
        break;

    case "spotify-this-song":
        spotifyCall();
        break;

    case "movie-this":
        movieCall(input2);
        break;

    case "do-what-it-says":
        lotto();
        break;
}
}
// the function calling the last 20 tweets 
function tweetCall() {

    var params = { screen_name: 'AndersonRhumel' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //loops through each tweet and prints when it was created and the tweet
            tweets.forEach((tweetEntry, i) => {
                console.log("Tweet Created: " +tweetEntry.created_at);
                console.log("Tweet text: " + tweetEntry.text);
                console.log("\n-------------\n");
            })
        } else {
            console.log(error);
        }
    }
    )
}

//Retrieve song info from Spotify.  If the song arg is left empty it will get info for Purple Rain
function spotifyCall() {
    // verify if input2 is empty
    var newQuery = input2 ? input2 : "purple rain"

    //get song info from Spotify
    spotify.search({ type: 'track', query: newQuery, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //loop through the track info
        data.tracks.items.forEach((record, i) => {
            record.artists.forEach((artist, j) => {
                console.log("Artist: " + artist.name);
            })
            console.log("Album: " + record.album.name);
            console.log("Track name: " + record.name);
            console.log("Spotify track preview: " + record.preview_url);  
            console.log("\n-------------\n");
        })
    });
};

function movieCall(movie){

   //if movie is empty, put Mr Nobody in field

   if (!movie) {
      console.log("\n-------------\n"); 
      console.log(" If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
      console.log("It's on Nextflix!");
      console.log("\n-------------\n");
      return;  
   }
   // var movie = movie ? movie : "Mr. Nobody";

    // build search
    var queryUrl = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=67a0e84a";

    // console.log(queryUrl);
    
    request(queryUrl, function(error, response, body) {
    
      // If the request is successful
      if (!error && response.statusCode === 200) {
    
        // Parse the body of the site and recover just the imdbRating
        // console.log(JSON.parse(body, null,2));
        console.log("\n-------------\n");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: "+ JSON.parse(body).Language);
        console.log("PLot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("\n-------------\n");
      }
    });
};
   

function lotto() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
    
        // Use random even number generator to select the "input" value
        var randNum = randomEvenNumber.create(2, dataArr.length-1);
           
        //Get values from array to put into input and input2 variables to use for switch 
        input= dataArr[randNum];
        input2=dataArr[randNum+1]

        //go to the switch function, use the input value to determine which function should be run.
        goToSwitch();
    });

    }

    













