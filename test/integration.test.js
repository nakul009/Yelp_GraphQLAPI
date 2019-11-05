const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const server = require('../server');
const { YelpUser, YelpUserTip } = require('../data');
const { yelpUser, yelpUserTip } = require('./fixtures');

const { query, mutate } = createTestClient(server);

const GET_SINGLE_User = gql`
  query getSingleUser($id: String!) {
    Yelpuser(user_id: $id) {
        user_id
        name
        review_count
        yelping_since
        useful
        funny
        cool
        elite
        fans
        average_stars
        compliment_cool
        compliment_cute
        compliment_funny
        compliment_hot
        compliment_list
        compliment_more
        compliment_note
        compliment_photos
        compliment_plain
        compliment_profile
        compliment_writer
    }
  }
`;

describe('Integration test pet, owner:', () => {
    afterAll(async () => {
        server.stop();

        // clean previous records and insert owners
        await YelpUser.remove({}, { multi: true });
        await YelpUser.insert(yelpUser);

        // clean previous records and insert pets
        await YelpUserTip.remove({}, { multi: true });
        await YelpUserTip.insert(yelpUserTip);
    });

    describe('Queries', () => {
        it('should return all YelpUsersTips', async () => {
            const res = await query({
                query: gql`
              query getSingleUserTip {
                YelpuserTip {
                    user_id
                    business_id
                    text
                    date
                    compliment_count
                }
              }
            `,
            });

            const list = res.data.yelpUserTip;
            expect(list.length).toBeGreaterThan(0);
            expect(Object.keys(list[0])).toEqual(
                expect.arrayContaining(['text', 'date', 'compliment_count']),
            );
        });
    })
});  
