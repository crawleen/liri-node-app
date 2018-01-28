
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

var userCommand = process.argv[2];
var reqParm = process.argv[3];
deciferCommand(userCommand, reqParm);

function deciferCommand(userCommand, reqParm){
	switch(userCommand) {
	    case "my-tweets":
	        runTwitter();
	        break;
	    case "spotify-this-song":
	        runSpotify(reqParm);
	        break;
	    case "movie-this":
	    	runOMDbAPI(reqParm);
	    	break;
	    case "do-what-it-says":
	    	runFS();
	    	break;
	    default:
	        break;
	}

	//log command in log.txt file
	if(reqParm === undefined){reqParm = "";}
	var newLog =  "\n" + Date.now() + " " + userCommand + " " + reqParm;	
	fs.appendFile("log.txt", newLog, (error) => { console.log(""); });	
}

function runTwitter(){
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {screen_name: 'crawleen06', count: '20'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  
	  if (!error) {
	  	for (var i = 0; i < tweets.length; i++)
	  	{
		    var result = ("\nTweet: " + tweets[i].text + " Created: "+ tweets[i].created_at);
		    console.log(result);
		    fs.appendFile("log.txt", result, writeFileCallback);		    
		}
	  }
	  else {
	    return console.log(error);
	  }
	});
}

function runSpotify(reqParm){
	var spotify = new Spotify({
		id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
	});

	if(reqParm !== undefined){
		var songName = reqParm;
		var i = 0;
	}
	else{
		songName = "The Sign";
		var i = 5;
	}

	spotify.search({ type: 'track', query: songName, limit:10 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		var songInfo = data.tracks.items[i];
		var result = "\n`````````````````````````````````````````````````````````````````" + 
			"\nArtist: " + songInfo.artists[0].name + 
			"\nTitle: " +songInfo.name + 
			"\nPreview URL: " +songInfo.preview_url + 
	     	"\nAlbum: " +songInfo.album.name + 
	     	"\n`````````````````````````````````````````````````````````````````";
     	console.log(result);
        fs.appendFile("log.txt", result, writeFileCallback);
    });
}

function runOMDbAPI(reqParm){
	var reqParm = reqParm;
	if(reqParm !== undefined){
		var movieName = reqParm;
	}
	else{
		movieName = "Mr Nobody";
	}

	request("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var result = "\n`````````````````````````````````````````````````````````````````" + 
				"\nMovie Title: " + JSON.parse(body).Title + 
				"\nRelease Year: " + JSON.parse(body).Year + 
				"\nIMDB Rating: " + JSON.parse(body).imdbRating + 
				"\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
				"\nCountry Made: " + JSON.parse(body).Country +
				"\nLanguage: " + JSON.parse(body).Language + 
				"\nPlot: " + JSON.parse(body).Plot + 
				"\nActors: " + JSON.parse(body).Actors +
				"\n````````````````````````````````````````````````````````````````";
			console.log(result);
        	fs.appendFile("log.txt", result, writeFileCallback);
		}
	});
}

function runFS(){
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
		return console.log(error);
		}

		var dataArr = data.split(",");
		deciferCommand(dataArr[0],dataArr[1]);
		userCommand = "";
	});
}

var writeFileCallback = function(err) {
  if (err) {
    console.log(err);
  }

  //console.log("File saved!");
};
  
