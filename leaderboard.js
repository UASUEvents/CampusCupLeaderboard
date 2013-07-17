

// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".


Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };


  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
    Meteor.startup(function () {
      function addTeamsToLeaderBoard(){
	  var require = __meteor_bootstrap__.require;
	  var fs = Npm.require('fs');
	  var teams = fs.readFile('listOfTeams', Meteor.bindEnvironment(
			      function (err, data){
				  teams = JSON.parse(data).teams;
				  console.log(teams);
				  for (var i = 0; i < teams.length; i++){
				      Players.insert({name: teams[i].name, score: teams[i].score });
				      if (err) {
					  console.log(err);
				      }
				  }
			      },
	      function(e){
		  console.log(e);
	      }
	  ));
      };
      function updateTeamsInLeaderBoard(){
	  var require = __meteor_bootstrap__.require;
	  var fs = Npm.require('fs');
	  var teams = fs.readFile('listOfTeams', Meteor.bindEnvironment(
			      function (err, data){
				  teams = JSON.parse(data).teams;
				  console.log(teams);
				  for (var i = 0; i < teams.length; i++){
				      Players.update(
					  {name: teams[i].name},
					  {
					      $set: {score: teams[i].score },
					  }
					  );
				      if (err) {
					  console.log(err);
				      }
				  }
			      },
	      function(e){
		  console.log(e);
	      }
	  ));
	  console.log('test');
      };
      var tid = Meteor.setInterval(runCode, 5000);
      function runCode(){
      if (Players.find().count() === 0) {
	  addTeamsToLeaderBoard();
	  }
      else{
	  updateTeamsInLeaderBoard();
          }
      };
});
    };
