const player = require('./Player');

var LivingPlayerList;
var EncounterThreshold = 75;
var LootThreshold = 30;


var RunSimulation = function(){
    while(LivingPlayerList.length > 1){
        RunGameTurn();
    }
    console.info("Winner Winner Chicken Dinner!\nCongratulations "+ LivingPlayerList[0].Name + "!")
}

var RunGameTurn = function(){
    var unpairedPlayers = LivingPlayerList.slice();
    var possibleEncounterPairs = [];

    for(var i = 0; i <= unpairedPlayers.length / 2; i++){
        var player1 = unpairedPlayers.splice(Math.floor(Math.random()*unpairedPlayers.length), 1)[0];
        var player2 = unpairedPlayers.splice(Math.floor(Math.random()*unpairedPlayers.length), 1)[0];
         
        possibleEncounterPairs.push({
            Player1: player1, 
            Player2: player2
        })
    }

    for(var i = 0; i < possibleEncounterPairs.length; i++){
        var encounterRoll = Math.floor(Math.random()*100)
        var Player1 = possibleEncounterPairs[i].Player1;
        var Player2 = possibleEncounterPairs[i].Player2;
        if(encounterRoll > EncounterThreshold){
            console.info(Player1.Name + " is fighting " + Player2.Name+ "!")
            ProcessEncounter(Player1, Player2)
        }else{
            //Didn't fight. Loot environment
            ProcessPassiveLooting(Player1)
            ProcessPassiveLooting(Player2)
        }
    }

    //Extra unpaired players loot environment
    for(var i = 0; i < unpairedPlayers.length; i++){
        ProcessPassiveLooting(unpairedPlayers[i]);
    }

}

var ProcessEncounter = function(player1, player2){
    var winner;
    var loser;

    var player1FightRoll = player1.RollForFight();
    var player2FightRoll = player2.RollForFight();

    if(player2FightRoll > player1FightRoll){
        winner = player2;
        loser = player1;
    }else{
        winner = player1;
        loser = player2;
    }

    ProcessFightWinner(winner);
    ProcessFightLoser(loser);
}

var ProcessFightWinner = function(winningPlayer){
    winningPlayer.Power += 20; //TODO make this be based on dead player's power
}

var ProcessFightLoser = function(losingPlayer){
    var loserIndex = LivingPlayerList.indexOf(losingPlayer);
    LivingPlayerList.splice(loserIndex, 1);
    console.info(losingPlayer.Name + " is dead!\n Remaining Players:\n" + LivingPlayerList.map(player => " " + player.Name + " Power - " + player.Power))
}

var ProcessPassiveLooting = function(lootingPlayer){
    var playerLootRoll = Math.floor(Math.random() * 100);

    if(playerLootRoll > LootThreshold){
        console.info(lootingPlayer.Name + " got some loot!")
        lootingPlayer.Power += 10;
    }

}



var InitPlayerList = function(){
    LivingPlayerList = [
    new player.Player("Alex"),
    new player.Player("Adam"),
    new player.Player("Dave"),
    new player.Player("Paul"),
    new player.Player("Patrick"),
    new player.Player("YaoZhingPing"),
];
}

InitPlayerList();
RunSimulation();