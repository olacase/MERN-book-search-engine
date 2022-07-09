const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//import apollo server
const { ApolloServer } = require('apollo-server-express');
// import typeDefs and resolvers
const { typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


//middleware parsing


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


app.use(routes);
//get all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


const startApolloServer = async( typeDefs, resolvers)=>{
  await server.start()
//apply apollo server with express app
server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
}
startApolloServer(typeDefs, resolvers)
