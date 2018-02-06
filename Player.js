var Player = function(playerName){
    var self = this;

    self = {
        Name : playerName,
        Power : 100,
        RollForFight : function(){
            return Math.floor(Math.random) * self.Power;
        }
    }
    return self;
}


module.exports = {
    Player :  Player
}