const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

mongoose.connect('mongodb://roheemahabo:pEG84fgBRNz85aGb@cluster0-shard-00-00.3sjct.mongodb.net:27017,cluster0-shard-00-01.3sjct.mongodb.net:27017,cluster0-shard-00-02.3sjct.mongodb.net:27017/?replicaSet=atlas-da0teq-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.once('open', () => {
    console.log('Connected to database');
}
);

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4001, () => {
    console.log('Server is running on port 4001');
})