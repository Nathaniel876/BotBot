var request = require('request');
var moment = require('moment');
var dotenv =require("dotenv").config();
var Spotify=require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var media = process.argv.slice(3).join(" ");

if (process.argv[2] == "concert-this") {
    concertThis();
}

function concertThis(){
    console.log(media)
    var urlquery = "https://rest.bandsintown.com/artists/" + media + "/events?app_id=codingbootcamp";

    request(urlquery, function (error, response, body) {
        console.log('error:', error);
        console.log("Upcoming concerts for " + media + ":")
        var obj = JSON.parse(body);
        for (var set in obj) {
            var date = moment(obj[set].datetime).format("YYYY/MM/DD");
            console.log("At " + obj[set].venue.name + " " + obj[set].venue.city + " " + date);
        }
    })
}
if (process.argv[2] == "spotify-this-song") {
    spotifyThisSong();
}


function spotifyThisSong(){
    console.log(media);
    spotify
        .search({ type: 'track', query: media })
        .then(function (response) {
            var items = response.tracks.items
            for (var set in items) {
                console.log("------------------")
                console.log(set)
                console.log("Song by: " + items[set].artists[0].name);
                console.log("Song Name: " + items[set].name);
                console.log("Preview_url: " + items[set].preview_url);
                console.log("Album: " + items[set].album.name);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

if (process.argv[2] == "movie-this") {
    movieThis();
}

function movieThis(){
    console.log(media)
    var queryUrl = "http://www.omdbapi.com/?t=" + media + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("Rated: " + movie.Rated);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log(movie.Ratings[1].Source+":"+movie.Ratings[1].Value);
        }
    });
}

var fs = require("fs");
fs.readFile("random.txt", "UTF-8", function(error, data) {

    if (error) {
      return console.log(error);
    }
  
    var dataList = data.split(",");
  
    console.log(dataList);
  
    media = dataList[1];
    
if (dataList[0]=="spotify-this-song"){
    
    spotifyThisSong();
} else if (dataList[0]=="concert-this"){
  
    concertThis();
} else if (dataList[0]=="movie-this"){
    
    movieThis();
} else {
    console.log("Use one of the commands to get LiRi searching for you!")
}
  });