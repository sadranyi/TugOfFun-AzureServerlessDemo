$( document ).ready(function() {
    // do nothing...
    setGameArea();
    setPlayUrl();
});

var gameAreaWidth = 0;

var Team1Name = "Ducks";
var Team2Name = "Beavers"; 

var Team1Id;
var Team2Id;               

var Team1Score = 0;
var Team2Score = 0;

var siteDomain = "https://" + document.domain;
//var siteDomain = "http://localhost:7071";

var setGameArea = function() {

    gameAreaWidth = $("#gameArea").width();    
    var playerPadding = (gameAreaWidth - 100) / 2;
    $("#ball").css("left",playerPadding); 

};

$("#btnLetsPlay").click(function(){
    
    // set team names
    Team1Name = $("#nameTeam1").val();
    Team2Name = $("#nameTeam2").val();

    // display team names
    $("#team1Display").text(Team1Name);
    $("#team2Display").text(Team2Name);

    // create the teams in the db
    setupTeams();

}); 

var setupTeams = function() {

    var teamsData = 
        {
            "team1" : Team1Name,
            "team2" : Team2Name
        }

    $.ajax({
            url : siteDomain + "/createteams",
            type: "POST",
            data: JSON.stringify(teamsData),
            contentType: "application/json",
            dataType   : "json",
            success    : function(data){
                var Result = data;
                Team1Id = Result.team1Id;
                Team2Id = Result.team2Id;
                console.log("Teams Created");

                // kick off the process
                updateScore();                
            }
        });

};

var updateScore = function() {
    
    console.log("---------------")
    var scoreResult;

    var team1Data = {"teamId" : Team1Id};
    var team2Data = {"teamId" : Team2Id};                

    getScore(team1Data,1);
    getScore(team2Data,2);

    console.log("Team 1: " + Team1Score);
    console.log("Team 2: " + Team2Score);
                
    // Update scores
    refreshScore(Team1Score, Team2Score);

    // move logo based on scores
    moveLogo(Team1Score, Team2Score);

    // check for winner
    if(!isWinningTeam()){

        // repeat if no winner
        rinseRepeat(); 
    }

};

var getScore = function(teamData,teamNum) {

    $.ajax({
            url : siteDomain + "/getscores",
            type: "POST",
            data: JSON.stringify(teamData),
            contentType: "application/json",
            dataType   : "json",
            success    : function(data){
                var Result = data;
                if(teamNum == 1) {
                    Team1Score = Result.Score;
                } else {
                    Team2Score = Result.Score;
                }
            }
        });

};

var refreshScore = function(score1, score2) {
    $("#team1badge").text(score1);
    $("#team2badge").text(score2);
};

var moveLogo = function(score1, score2) {
    
    // do the math
    // we divide to slow down the movement
    var toMove = (parseInt(score1) - parseInt(score2)) / 3;    
    console.log("Moving: " + toMove);
        
    // move logo based on scores
    $("#ball").css({
        left: $("#ball").position().left - toMove + "px"
    });                  

    // $("#ball").animate({left: "-=" + toMove + "px"}, 500);

};

var isWinningTeam = function() {

    // get current position
    var iPos = parseInt($("#ball").css("left").replace("px",""));
    
    // $("#debugPanel").text(iPos);

    // check and display winner
    if (iPos <= 0) {
        // team1 wins
        $("#team1Info").addClass("winner");
        return true;
    } else if (iPos >= (gameAreaWidth - 100)) {
        // team2 wins
        $("#team2Info").addClass("winner");
        return true;
    }

    return false;

};

var rinseRepeat = function() {
    setTimeout(updateScore, 1000);
};

function setPlayUrl() {
    var playLink = document.getElementById('playlink');
    playLink.innerText = playLink.href;
}
