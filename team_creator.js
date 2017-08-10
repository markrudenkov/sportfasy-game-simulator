const f1_data = require('./f1_2016.json');
const f1_data_drivers = require('./f1_2016_driver.json').MRData.DriverTable.Drivers;

module.exports =function(){



    let TeamCreator = function(team_amount){
        this.team_amount = team_amount;
    }


    const players_in_team = 5;

    TeamCreator.prototype.getRandomDriverNumber = function () {
        return Math.floor(Math.random() * (f1_data_drivers.length - 1));
    }

    TeamCreator.prototype.createTeam = function (players_in_team){
        let team = new Object();
        team.players = [];
        for (let  i = 0; i < players_in_team; i++ ) {
            team.players.push(f1_data_drivers[this.getRandomDriverNumber()]);
        }
        return team;
    }

    TeamCreator.prototype.createTeams = function () {
        let arr = [];
        for(let i=0; i< this.team_amount; i++){
            arr.push(this.createTeam(players_in_team))
        }
        // console.log(JSON.stringify(arr,null,2));
        return Promise.resolve(arr);
    }

    return TeamCreator;
}



