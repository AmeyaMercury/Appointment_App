const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const connectDB = require('./config/database');
const { PORT } = require('./config/env');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { handleError } = require('./utils/errors');

async function startServer() {
  try {
    const app = express();

    // Connect to Database with error handling
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully!');

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
      formatError: (err) => {
        const error = handleError(err);
        return {
          message: error.message,
          statusCode: error.statusCode
        };
      },
      // Recommended: Add health checks and graceful shutdown handling
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                // Add any cleanup logic here
              },
            };
          },
        },
      ],
    });

    await server.start();
    server.applyMiddleware({ app });

    const httpServer = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      httpServer.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit with failure code
  }
}

startServer();