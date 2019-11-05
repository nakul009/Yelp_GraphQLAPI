const { gql } = require('apollo-server');
const { YelpUser, YelpUserTip } = require('../data');
const logger = require('../helpers/loggers');

const userTypeDefs = gql`
type YelpUser  {
    user_id: String!
    name: String
    review_count: Int
    yelping_since: String
    useful: Int
    funny: Int
    cool: Int
    elite: String
    fans: Int
    average_stars:Int
    compliment_cool: Int
    compliment_cute: Int
    compliment_funny: Int
    compliment_hot: Int
    compliment_list: Int
    compliment_more: Int
    compliment_note: Int
    compliment_photos: Int
    compliment_plain: Int
    compliment_profile: Int
    compliment_writer: Int
    yelpUserTip: YelpUserTip
}
input UserInput {
    name: String
    review_count: Int
    yelping_since: String
    useful: Int
    funny: Int
    cool: Int
    elite: String
    fans: Int
    average_stars:Int
    compliment_cool: Int
    compliment_cute: Int
    compliment_funny: Int
    compliment_hot: Int
    compliment_list: Int
    compliment_more: Int
    compliment_note: Int
    compliment_photos: Int
    compliment_plain: Int
    compliment_profile: Int
    compliment_writer: Int
}

extend type Query {
    Yelpusers(filter: Pagination): [YelpUser]
    Yelpuser(user_id: String!): YelpUser
  }
  extend type Mutation {
    addUser(input: UserInput!): YelpUser
    editUser(user_id: String!, input: UserInput!): YelpUser
    deleteUser(user_id: String): YelpUser
  }

`;

const YelpUserResolvers = {
  Query: {
    Yelpusers: async (_, { filter = {} }) => {
      const limit = filter.limit || 20;
      const offset = filter.offset || 0;

      const users = await YelpUser.find({})
        .sort({ yelping_since: 'desc' })
        .skip(offset)
        .limit(limit);

      return users;
    },

    Yelpuser: async (_, { user_id }) => {
      const user = await YelpUser.findOne({ user_id: user_id });
      return user;
    },
  },

  Mutation: {
    addUser: async (_, { input }) => {
      try {
        const user = await YelpUser.insert(input);

        return user;
      } catch (error) {
        logger.error('add pet err:', error);
        return error;
      }
    },

    editUser: async (_, { user_id, input }) => {
      try {
        await YelpUser.update({ user_id: user_id }, { $set: input });
        const user = await YelpUser.findOne({ user_id: user_id });

        return user;
      } catch (error) {
        logger.error('edit pet err:', error);
        return error;
      }
    },

    deleteUser: async (_, { user_id }) => {
      try {
        const user = await YelpUser.findOne({ user_id: user_id });
        await YelpUser.remove({ user_id: user_id });

        return user || null;
      } catch (error) {
        logger.error('delete pet err:', error);
        return error;
      }
    },
  },

  YelpUser: {
    async yelpUserTip(user) {
      const yelpUserTip = await YelpUserTip.findOne({ user_id: user.user_id });
      if (yelpUserTip) return yelpUserTip;
      return null;
    },
  },
};

module.exports = { userTypeDefs, YelpUserResolvers };


