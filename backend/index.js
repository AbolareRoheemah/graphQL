import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";

const resolvers = {
    Query: {
        games () {
            return db.games;
        },
        game (_, args) {
            return db.games.find(game => game.id === args.id);
        },
        authors () {
            return db.authors;
        },
        author (_, args) {
            return db.authors.find(author => author.id === args.id);
        },
        reviews () {
            return db.reviews;
        },
        review (_, args) {
            return db.reviews.find(review => review.id === args.id);
        }
    },
    Game: {
        reviews (game) {
            return db.reviews.filter(review => review.game_id === game.id);
        }
    },
    Author: {
        reviews (author) {
            return db.reviews.filter(review => review.author_id === author.id);
        }
    },
    Review: {
        game (review) {
            return db.games.find(game => game.id === review.game_id);
        },
        author (review) {
            return db.authors.find(author => author.id === review.author_id
            );
        }
    },
    Mutation: {
        deleteGame (_, args) {
            db.games = db.games.filter(game => game.id !== args.id);
            return db.games;
        },
        addGame (_, args) {
            let game = {
                ...args.gameinput,
                id: String(db.games.length + 1)
            }
            db.games.push(game);
            return game;
        },
        updateGame (_, args) {
            let game = db.games.find(game => game.id === args.id)
            if (!game) {
                return null;
            }
            if (args.edits.title) {
                game.title = args.edits.title;
            }
            if (args.edits.platform) {
                game.platform = args.edits.platform;
            }
            return game;
        }
    }
}

// typeDefs - something to define the different datas that can be queried and all the fields under them.
// schema - defines the shape of the graph. Consists of typeDefs and resolvers
// resolvers - functions that are called when a query is made to the server. They return data for the query.
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: {port: 4000}
});

console.log(`Server ready at ${url}`);