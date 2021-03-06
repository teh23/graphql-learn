const { ApolloServer, gql } = require("apollo-server");
const { v1: uuid } = require("uuid");
let authors = [
    {
        name: "Robert Martin",
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: "Martin Fowler",
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963,
    },
    {
        name: "Fyodor Dostoevsky",
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821,
    },
    {
        name: "Joshua Kerievsky", // birthyear not known
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: "Sandi Metz", // birthyear not known
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
];

let books = [
    {
        title: "Clean Code",
        published: 2008,
        author: "Robert Martin",
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Agile software development",
        published: 2002,
        author: "Robert Martin",
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ["agile", "patterns", "design"],
    },
    {
        title: "Refactoring, edition 2",
        published: 2018,
        author: "Martin Fowler",
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring"],
    },
    {
        title: "Refactoring to patterns",
        published: 2008,
        author: "Joshua Kerievsky",
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "patterns"],
    },
    {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        author: "Sandi Metz",
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ["refactoring", "design"],
    },
    {
        title: "Crime and punishment",
        published: 1866,
        author: "Fyodor Dostoevsky",
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "crime"],
    },
    {
        title: "The Demon ",
        published: 1872,
        author: "Fyodor Dostoevsky",
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ["classic", "revolution"],
    },
];

const typeDefs = gql`
    type Authors {
        name: String!
        id: String
        born: Int
        bookCount: Int
    }
    type Books {
        title: String!
        published: Int!
        author: String!
        id: String!
        genres: [String]
    }
    type Query {
        bookCount: Int
        authorCount: Int
        allBooks(author: String, genre: String): [Books]
        allAuthors: [Authors!]!
    }
    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            id: String
            genres: [String]
        ): Books
        editAuthor(name: String, setBornTo: Int): Authors
    }
`;

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            if (args.author) {
                return books.filter((book) => args.author === book.author);
            }
            if (args.genre) {
                return books.filter(
                    //
                    (book) =>
                        book.genres.filter((gen) =>
                            args.genre === gen ? gen : false
                        )[0]
                );
            }
            return books;
        },
        allAuthors: () => authors,
    },
    Authors: {
        bookCount: (root) => {
            return books.filter((b) => b.author === root.name).length;
        },
    },

    Mutation: {
        addBook: (root, args) => {
            const book = { ...args, id: uuid() };
            books = books.concat(book);

            if (!authors.find((a) => a.name === args.author)) {
                const author = { name: args.author, id: uuid(), born: null };
                authors = authors.concat(author);
            }
            return book;
        },
        editAuthor: (root, args) => {
            const authorExist = authors.find((a) => a.name === args.name);
            console.log(authorExist);
            if (!authorExist) {
                return null;
            }
            authors = authors.map((a) =>
                a.name === args.name
                    ? { ...a, name: args.name, born: args.setBornTo }
                    : a
            );
            return { name: args.name, born: args.setBornTo };
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
