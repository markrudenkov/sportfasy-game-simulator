'use strict';
const f1_data = require('./f1_2016.json');
const f1_data_drivers = require('./f1_2016_driver.json').MRData.DriverTable.Drivers;
const fs = require('fs');
const json2csv = require('json2csv');

let races = f1_data[0].MRData.RaceTable.Races;
let results = [];
let player_points = [];

const team_amount = 1000;
const players_in_team = 5;
let TeamCreator = require('./team_creator')(team_amount, players_in_team);
const players_count = 20;
const total_players_sum = 1000000;


let getPlayersPrice = function (players_count,
                                total_players_sum,
                                position) {

    return total_players_sum - (total_players_sum / players_count) * (position - 1);
};

let countIncomesIncludingPreviousPosition = function (players_count,
                                                      total_players_sum,
                                                      position,
                                                      previous_position) {

    return getPlayersPrice(players_count, total_players_sum, position) * 0.1 * (previous_position - position);

};


let savePlayerPoints = function (obj, teams) {

    teams.map((team) => {

        team.players.map(player => {
            if (player.driverId === obj.player_id) {
                player.previous_position = parseInt(obj.position, 10) || 20;
                player.overall_income = (parseInt(player.overall_income, 10) || 0) + parseInt(countIncomesIncludingPreviousPosition(
                        20,
                        1000000,
                        parseInt(obj.position, 10),
                        parseInt(player.previous_position, 10)
                    ), 10);
                // console.log(JSON.stringify(var1, null, 2));
                team.overall_income = (parseInt(team.overall_income, 10) || 0) + parseInt(obj.position, 10);
            }
        });
        console.log(JSON.stringify(team, null, 2));
    });
}
let teams = new TeamCreator(team_amount, players_in_team).createTeams().then(teams => {

        races.map((race) => {

                race.Results.map((result) => {
                    let obj = new Object();
                    obj.position = result.position;
                    obj.player_id = result.Driver.driverId;
                    savePlayerPoints(obj, teams);
                })
            }
        );

        return Promise.resolve(teams);
    }
).then(teams => {
    saveToFile(teams)
});

let saveToFile = function (teams) {
    let team_fields = ['overall_income'];
    let csv = json2csv({data: teams, fields: team_fields});
    fs.writeFile('file.csv', csv, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
}


