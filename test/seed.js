const { YelpUser, YelpUserTip } = require('../data');
const { yelpUser, yelpUserTip } = require('./fixtures');

const run = async () => {
    // clean previous records and insert owners
    await YelpUser.remove({}, { multi: true });
    await YelpUser.insert(yelpUser);

    // clean previous records and insert pets
    await YelpUserTip.remove({}, { multi: true });
    await YelpUserTip.insert(yelpUserTip);
};

run();
