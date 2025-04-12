const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

// Ensure the connection string is correct
mongoose.connect('mongodb://roheemahabo:pEG84fgBRNz85aGb@cluster0-shard-00-00.3sjct.mongodb.net:27017,cluster0-shard-00-01.3sjct.mongodb.net:27017,cluster0-shard-00-02.3sjct.mongodb.net:27017/?replicaSet=atlas-da0teq-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');

mongoose.connection.once('open', () => {
    console.log('Connected to database');
});

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // Enable GraphiQL interface
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});