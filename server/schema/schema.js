const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID, GraphQLList} = graphql;

const books = [
    {name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1"},
    {name: "Name of the Wind", genre: "Fantasy", id: "2", authorId: "2"},
    {name: "Name of the Wind", genre: "Fantasy", id: "3", authorId: "3"},
    {name: "Name of the Wind", genre: "Fantasy", id: "4", authorId: "4"},
]

const authors = [
    {name: "Patrick Rothfuss", age: 44, id: "1"},
    {name: "Patrick Rothfuss", age: 44, id: "1"},
    {name: "Patrick Rothfuss", age: 44, id: "1"},
    {name: "Patrick Rothfuss", age: 44, id: "1"},
]
const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authors.find(author => author.id === parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(book => book.authorId === parent.id)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // code to get data from db/other source
                return books.find(book => book.id === args.id
                );
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // code to get data from db/other source
                return authors.find(author => author.id === args.id
                );

            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return authors
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
});