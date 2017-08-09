let config = require('./config.js').get(process.env.NODE_ENV);
const f1_data = require('./f1_2016.json');
const fs = require('fs');
let PlayersLedger = require('./models/players_ledger');

// ======
// MONGO DB
// ======
let mongoose = require('mongoose');
mongoose.connect(config.database);

let races = f1_data[0].MRData.RaceTable.Races;

let results = [];
let player_points = [];

function saveToPlayerLedger(obj) {

    let playersLedger = new PlayersLedger({
        _player: obj.player_id,
        _total_income: obj.income,
    });
    playersLedger.save(function (err) {
        if (err) {
            console.log('ERROR ADDING Income to Player Ledger: ' + err);
        } else {
            console.log('SUCCESS ADDING Income to Player Ledger:: ' + playersLedger);
        }
    });
}

function savetoPlayerPoints(obj) {
    player_points[obj.player_id] = (parseInt(player_points[obj.player_id], 10) || 0) + parseInt(obj.income, 10);
}


races.map((race) => {

        race.Results.map((result) => {
            let obj = new Object();
            obj.income = result.position;
            obj.player_id = result.Driver.driverId;
            savetoPlayerPoints(obj);
        })
    }
);

console.log(player_points);