require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var argumentArr = process.argv.slice(3);
var input = argumentArr.join(" ");

function spotifySearch() {

    spotify.search({
        type: 'track',
        query: input,
        limit: '1'
    }, function (err, data) {
        var result = `Artist: ${data.tracks.items[0].artists[0].name} Song: ${data.tracks.items[0].name}\nAlbum: ${data.tracks.items[0].album.name}\nURL: ${data.tracks.items[0].preview_url}`;
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\n------------------------------------------------------");
        console.log(result);
        console.log("------------------------------------------------------\n");
        var text = "\nResult: " + result + "\n";
        fs.appendFile("log.txt", text, function (err) {

            if (err) {
                console.log(err);
            } else {
                console.log("Logged");
            }

        });
    });
}

function movieSearch() {

    var request = require("request");

    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=bbf8c15", function (error, response, body) {
        var omdb = JSON.parse(body);
        if (omdb.Title === undefined) {
            console.log("\n------------------------");
            console.log("Movie Does Not Exist");
            console.log("------------------------\n");
        } else if (omdb.Ratings.length < 1) {
            var rottenTomato = "";
        }
        if (!error && response.statusCode === 200) {

            var result = `Title: ${omdb.Title}\nYear: ${omdb.Year}\nImdb Rating: ${omdb.imdbRating}\nRotten Tomatoes Rating: ${omdb.Ratings[1].Value}\nCountry: ${omdb.Country}\nPlot: ${omdb.Plot}\nActors: ${omdb.Actors}`;
            console.log("\n------------------------------------------------------");
            console.log(result);
            console.log("------------------------------------------------------\n");
            var text = "\nResult: " + result + "\n";
            fs.appendFile("log.txt", text, function (err) {

                if (err) {
                    console.log(err);
                } else {
                    console.log("Logged");
                }

            });
        }
    });
}


function randomFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        for (var i = 0; i < dataArr.length; i++) {

        }

        if (dataArr[0] === "spotify-this-song") {
            input = dataArr[1];
            spotifySearch();
        }

        if (dataArr[0] === "movie-this") {
            input = dataArr[1];
            movieSearch();
        }



    });
}

if (process.argv[2] === "spotify-this-song" && process.argv[3] == null || process.argv[2] === "spotify-this-song" && process.argv[3] === "") {
    var input = "Ace of Base";
    spotifySearch();

} else if (process.argv[2] === "movie-this" && process.argv[3] == null || process.argv[2] === "movie-this" && process.argv[3] === "") {
    var input = "Mr. Nobody";
    movieSearch();

} else if (process.argv[2] === "spotify-this-song") {
    spotifySearch();

} else if (process.argv[2] === "movie-this") {
    movieSearch();

} else if (process.argv[2] === "do-what-it-says") {
    randomFile();

}
