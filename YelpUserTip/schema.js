const { gql } = require('apollo-server');
const { YelpUser, YelpUserTip } = require('../data');
const logger = require('../helpers/loggers');

const userTipTypeDefs = gql`
type YelpUserTip  {
    user_id: String!
    business_id: String
    text: String
    date: String
    compliment_count: Int
    yelpUser: YelpUser
}
input YelpUserTipInput {
    business_id: String
    text: String
    date: String
    compliment_count: Int
}
input Pagination {
    limit: Int
    offset: Int
}

extend type Query {
    yelpusersTip(filter: Pagination): [YelpUserTip]
    yelpuserTip(user_id: String!): YelpUserTip
  }
  extend type Mutation {
    addUserTip(input: YelpUserTipInput!): YelpUserTip
    editUserTip(user_id: String!, input: YelpUserTipInput!): YelpUserTip
    deleteUserTip(user_id: String): YelpUserTip
  }
`;

const YelpUserTipResolvers = {
    Query: {
        yelpusersTip: async (_, { filter = {} }) => {
            const limit = filter.limit || 20;
            const offset = filter.offset || 0;

            const users = await YelpUserTip.find({})
                .skip(offset)
                .limit(limit);

            return users;
        },

        yelpuserTip: async (_, { id }) => {
            const user = await YelpUserTip.findOne({ user_id: id });
            return user;
        },
    },

    Mutation: {
        addUserTip: async (_, { input }) => {
            try {
                const user = await YelpUserTip.insert(input);

                return user;
            } catch (error) {
                logger.error('add pet err:', error);
                return error;
            }
        },

        editUserTip: async (_, { user_id, input }) => {
            try {
                await YelpUserTip.update({ user_id: user_id }, { $set: input });
                const user = await YelpUserTip.findOne({ user_id: user_id });

                return user;
            } catch (error) {
                logger.error('edit pet err:', error);
                return error;
            }
        },

        deleteUserTip: async (_, { user_id }) => {
            try {
                const user = await YelpUserTip.findOne({ user_id: user_id });
                await YelpUserTip.remove({ user_id: user_id });

                return user || null;
            } catch (error) {
                logger.error('delete pet err:', error);
                return error;
            }
        },
    },

    YelpUserTip: {
        async yelpUser(user) {
            const yelpUser = await YelpUser.findOne({ user_id: user.user_id });
            if (yelpUser) return yelpUser;
            return null;
        },
    },
};

module.exports = { userTipTypeDefs, YelpUserTipResolvers };


