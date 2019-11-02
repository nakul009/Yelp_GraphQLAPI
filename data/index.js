const DataStore = require('nedb-promises');

const db = {};

db.YelpUser = DataStore.create({
    autoload: true,
    timestampData: true,
    filename: '../data/Yelp_User.db',
});

db.YelpUserTip = DataStore.create({
    autoload: true,
    timestampData: true,
    filename: '../data/Yelp_User_Tip.db',
});

module.exports = db;
