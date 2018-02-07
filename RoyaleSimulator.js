const player = require('./Player');

//Combat Constants
const ENCOUNTER_THRESHOLD = 75;
const LIMB = 60;
const BODY = 85;
const HEAD = 100;

//Looting Constants         //30% chance nothing
const LOOT_THRESHOLD = 30;  //10% chance clothes
const MEDS = 40;            //10% chance meds
const WEAPON = 50;          //30% chance weapon
const VEST = 80;            //10% chance vest
const HELMET = 90;          //10% chance weapons

const LEVEL_THREE = 95;     //5% chance Level 3
const LEVEL_TWO = 75        //20% chance level 2

const QUALITY_TEXT = ["worthless", "medicore", "nice", "fantastic"];

//Players
var LivingPlayerList;
var DeadPlayerList;


var RunSimulation = function () {
    while (LivingPlayerList.length > 1) {
        RunGameTurn();
    }
    console.info("Winner Winner Chicken Dinner!\nCongratulations " + LivingPlayerList[0].Name + "!")
    DisplayEndgameStats();
}

var RunGameTurn = function () {
    var unpairedPlayers = LivingPlayerList.slice();
    var possibleEncounterPairs = [];

    for (var i = 0; i <= unpairedPlayers.length / 2; i++) {
        var player1 = unpairedPlayers.splice(Math.floor(Math.random() * unpairedPlayers.length), 1)[0];
        var player2 = unpairedPlayers.splice(Math.floor(Math.random() * unpairedPlayers.length), 1)[0];

        possibleEncounterPairs.push({
            Player1: player1,
            Player2: player2
        })
    }

    for (var i = 0; i < possibleEncounterPairs.length; i++) {
        var encounterRoll = Math.floor(Math.random() * 100);
        var player1 = possibleEncounterPairs[i].Player1;
        var player2 = possibleEncounterPairs[i].Player2;
        if (encounterRoll > ENCOUNTER_THRESHOLD) {
            console.info(player1.Name + " is fighting " + player2.Name + "!")
            ProcessEncounter(player1, player2)
        } else {
            //Didn't fight. Loot environment
            ProcessPassiveLooting(player1)
            ProcessPassiveLooting(player2)
        }
    }

    //Extra unpaired players loot environment
    for (var i = 0; i < unpairedPlayers.length; i++) {
        ProcessPassiveLooting(unpairedPlayers[i]);
    }

}

var ProcessEncounter = function (player1, player2) {
    var winner = null;
    var loser = null;

    encounterCombat:
    while (winner == null) {
        var player1FightRoll = player1.RollForFight();
        var player2FightRoll = player2.RollForFight();

        ProcessCombatRoll(player1, player1FightRoll, player2);
        if (player2.Health <= 0) {
            winner = player1;
            loser = player2;
            break encounterCombat;
        }

        ProcessCombatRoll(player2, player2FightRoll, player1);
        if (player1.Health <= 0) {
            winner = player2;
            loser = player1;
            break encounterCombat;
        }
    }

    winner.Kills += 1; 
    ProcessFightLoser(loser, winner);
    ProcessWinnerLootingLoser(winner, loser);
    winner.TakeMeds();
}

var ProcessCombatRoll = function (shootingPlayer, fightRoll, targetPlayer) {
    if (fightRoll > HEAD) {
        targetPlayer.ProcessHeadshot();
        console.info(" " + shootingPlayer.Name + " shot " + targetPlayer.Name + " in the head!");
    } else if (fightRoll > BODY) {
        targetPlayer.ProcessBodyshot();
        console.info(" " + shootingPlayer.Name + " shot " + targetPlayer.Name + " in the body!");
    } else if (fightRoll > LIMB) {
        targetPlayer.ProcessLimbshot();
        console.info(" " + shootingPlayer.Name + " shot " + targetPlayer.Name + " in the limbs!");
    }
}

var ProcessWinnerLootingLoser = function (winningPlayer, losingPlayer) {
    console.info(winningPlayer.Name + " is looting " + losingPlayer.Name + "!");
    winningPlayer.UpgradeHelmet(losingPlayer.HelmetLevel);
    winningPlayer.UpgradeVest(losingPlayer.VestLevel);
    winningPlayer.Power = Math.max(winningPlayer.Power, losingPlayer.Power);
    winningPlayer.Meds += losingPlayer.Meds;
}

var ProcessFightLoser = function (losingPlayer, killedBy) {
    var loserIndex = LivingPlayerList.indexOf(losingPlayer);
    DeadPlayerList.push(losingPlayer);
    LivingPlayerList.splice(loserIndex, 1);
    console.info(losingPlayer.Name + " was killed by " + killedBy.Name + "!");
    console.info("Remaining Players:" + LivingPlayerList.map(player => "\n " + player.Name + " - Health:" + player.Health + " Power:" + player.Power + " Meds:" + player.Meds));
}

var ProcessPassiveLooting = function (lootingPlayer) {
    var playerLootRoll = Math.floor(Math.random() * 100);

    if (playerLootRoll > LOOT_THRESHOLD) {

        var lootQuality = DetermineLootQuality();
        if (playerLootRoll > HELMET) {
            lootingPlayer.UpgradeHelmet(lootQuality);
        } else if (playerLootRoll > VEST) {
            lootingPlayer.UpgradeVest(lootQuality);
        } else if (playerLootRoll > WEAPON) {
            lootingPlayer.Power += (lootQuality * lootQuality);
            console.info(lootingPlayer.Name + " found a " + QUALITY_TEXT[lootQuality] + " weapon!");
        } else if (playerLootRoll > MEDS) {
            lootingPlayer.Meds += lootQuality;
            console.info(lootingPlayer.Name + " found some " + QUALITY_TEXT[lootQuality] + " meds!");
        } else {
            console.info(lootingPlayer.Name + " found some " + QUALITY_TEXT[lootQuality] + " clothes!");
        }
    }

}

var DetermineLootQuality = function () {
    var qualityRoll = Math.floor(Math.random() * 100);
    if (qualityRoll > LEVEL_THREE) {
        return 3;
    } else if (qualityRoll > LEVEL_TWO) {
        return 2;
    }
    return 1;
}

var InitPlayerList = function () {
    LivingPlayerList = [
        new player.Player("Alex"),
        new player.Player("Adam"),
        new player.Player("Dave"),
        new player.Player("Paul"),
        new player.Player("Patrick"),
        new player.Player("YaoZhingPing"),
    ];
    DeadPlayerList = [];
}

var DisplayEndgameStats = function () {
    console.info("\n-----Kills-----\n" + LivingPlayerList[0].Name + " - " + LivingPlayerList[0].Kills);
    for (var i = 0; i < DeadPlayerList.length; i++) {
        console.info(DeadPlayerList[i].Name + " - " + DeadPlayerList[i].Kills);
    }
}

InitPlayerList();
RunSimulation();