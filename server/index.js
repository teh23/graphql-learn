const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        books: [Book]
    }
`;

const books = [
    {
        title: "Test1",
        author: "Jon doe",
    },
    {
        title: "test2",
        author: "Jan Kowalski",
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`server start ${url}`);
});
