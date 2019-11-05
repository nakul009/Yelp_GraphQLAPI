const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const logger = require('./helpers/loggers');
const { userTypeDefs, YelpUserResolvers } = require('./YelpUser/schema');
const { userTipTypeDefs, YelpUserTipResolvers } = require('./YelpUserTip/schema');

const rootTypeDefs = gql`
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, userTipTypeDefs, userTypeDefs],
    resolvers: {
        Query: {
            ...YelpUserResolvers.Query,
            ...YelpUserTipResolvers.Query,
        },
        Mutation: {
            ...YelpUserResolvers.Mutation,
            ...YelpUserTipResolvers.Mutation,
        },
        YelpUser: YelpUserResolvers.YelpUser,
        YelpUserTip: YelpUserTipResolvers.YelpUserTip,
    },
});

const server = new ApolloServer({
    schema,
    formatError(error) {
        logger.info('server error:', error);
        return error;
    },
    introspection: true,
    playground: true,
});

const port = process.env.PORT || 4300;

server.listen({ port }).then(({ url }) => {
    logger.info(`🚀  Server ready at ${url}`);
});

module.exports = server;