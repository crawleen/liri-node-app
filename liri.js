
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

var userCommand = process.argv[2];
console.log(userCommand);

switch(userCommand) {
    case "my-tweets":
        runTwitter();
        break;
    case "spotify-this-song":
        runSpotify();
        break;
    case "movie-this":
    	runOMDbAPI();
    	break;
    case "do-what-it-says":
    	console.log("do-what-it-says");
    	break;
    default:
        break;
}
// var client = new Twitter({
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });

function runTwitter(){
	var client = new Twitter({
	  consumer_key: 'ZjsOzqupyqAEfOjclZDPjRbkp',
	  consumer_secret: 'CXVHDGNS9xeBTUv1cnUok6BiAFzzqCbWCqWMT8uhbpVP8Obelg',
	  access_token_key: '955194155726090240-LZYYiJ9tcpUE6LF6efAowWOATyAgGDu',
	  access_token_secret: 'nh2yivZHFbi5f5K5PGLStzOVt59sAJL0xMhs1VsVk3G7e',
	});

	var params = {screen_name: 'crawleen06'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  
	  if (!error) {
	    console.log(tweets);
	  }
	  else {
	    return console.log(error);
	  }
	});
}

function runSpotify(){
	var spotify = new Spotify({
		id: '04d3f9eb25764750adfd16cbd5d936c2',
		secret: 'fda1c8ebe95c4863839ef4077b5fb75b'
	});
	
	spotify.search({ type: 'track', query: 'I saw the sign', limit:10 }, function(err, data) {
		if (err) {
		return console.log('Error occurred: ' + err);
		}

		var songInfo = data.tracks.items[0];
    	var songResult = console.log(songInfo.artists[0].name)
                     console.log(songInfo.name)
                     console.log(songInfo.album.name)
                     console.log(songInfo.preview_url)
    	console.log(songResult);
	});
}

function runOMDbAPI(){
	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
	  }
	});
}