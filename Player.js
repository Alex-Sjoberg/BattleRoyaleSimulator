const QUALITY_TEXT = ["worthless", "medicore", "nice", "fantastic"];

var Player = function (playerName) {
    var self = this;

    self = {
        Name: playerName,
        Power: 100,
        Health: 100,
        VestLevel: 0,
        HelmetLevel: 0,
        Meds: 0,
        Kills: 0,
        RollForFight: function () {
            return Math.floor(Math.random() * self.Power);
        },
        ProcessHeadshot: function () {
            switch (this.HelmetLevel) {
                case 3:
                    this.Health -= 70;
                    break;
                case 2:
                    this.Health -= 80;
                    break;
                case 1:
                    this.Health -= 90;
                    break;
                default:
                    this.Health -= 100;
            }
        },
        ProcessBodyshot: function () {
            switch (this.VestLevel) {
                case 3:
                    this.Health -= 10;
                    break;
                case 2:
                    this.Health -= 15;
                    break;
                case 1:
                    this.Health -= 20;
                    break;
                default:
                    this.Health -= 25;
            }
        },
        ProcessLimbshot: function () {
            this.Health -= 10;
        },
        UpgradeHelmet: function (newHelmetLevel) {
            if(newHelmetLevel > this.HelmetLevel) {
                this.HelmetLevel = newHelmetLevel;
                console.info(this.Name + " found a " + QUALITY_TEXT[newHelmetLevel] + " helmet!");
            }
        },
        UpgradeVest: function (newVestLevel) {
            if(newVestLevel > this.VestLevel) {
                this.VestLevel = newVestLevel;
                console.info(this.Name + " found a " + QUALITY_TEXT[newVestLevel] + " vest!");
            }
        },
        TakeMeds: function () {
            if (this.Health < 100 && this.Meds > 0) {
                this.Health = 100;
                this.Meds -= 1;
                console.info(this.Name + " took some meds!");
            }
        }
    }
    return self;
}

module.exports = {
    Player: Player
}