var Player = function(playerName){
    var self = this;

    self = {
        Name : playerName,
        Power : 100,
        Kills : 0,
        RollForFight : function(){
            return Math.floor(Math.random() * self.Power);
        }
    }
    return self;
}

module.exports = {
    Player :  Player
}