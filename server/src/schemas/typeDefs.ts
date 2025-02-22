const typeDefs = `
    type Book {
        bookId: ID!
        title: String!
        description: String!
        authors: [String]
        image: String
        link: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    input BookInput {
        bookId: ID!
    }
    
    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(username: String, email: String, password: String!): Auth
        saveBook(userId: ID!, bookData: BookInput!): User
        deleteBook(userId: ID!, bookId: ID!): User 
    }

`;
export default typeDefs;