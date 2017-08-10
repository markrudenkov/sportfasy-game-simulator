'use strict';
const f1_data = require('./f1_2016.json');
const fs = require('fs');
const json2csv = require('json2csv');
let PlayersLedger = require('./models/players_ledger');

let races = f1_data[0].MRData.RaceTable.Races;
let results = [];
let player_points = [];

const team_amount = 10;
let TeamCreator = require('./team_creator')(team_amount);

let savePlayerPoints = function (obj, teams) {

    teams.map((team) => {

        team.players.map(player => {
            if(player.driverId === obj.player_id){
                player.position = parseInt(obj.position, 10);
                player.overall_income = (parseInt(player.overall_income, 10) || 0) + parseInt(obj.position, 10);
                team.overall_income =(parseInt(team.overall_income , 10) || 0) + parseInt(obj.position, 10);
            }
        });
        console.log(JSON.stringify(team, null, 2));
    });
}
let teams = new TeamCreator(team_amount).createTeams().then(teams => {

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
).then(teams => {saveToFile(teams)});

let saveToFile = function (teams) {
    let team_fields = ['overall_income'];
    let csv = json2csv({ data: teams, fields: team_fields });
    fs.writeFile('file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
}


