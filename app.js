// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, ApolloLink } from '@apollo/client';
import App from './App'; // Your App component

// Get the auth token (you would likely get this from localStorage or a cookie)
const authToken = "your-auth-token-here";  // Replace with your actual token

// Set up Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([
    new HttpLink({
      uri: "https://charitybase.uk/api/graphql",  // Replace with your GraphQL API URL
    }).concat(
      new ApolloLink((operation, forward) => {
        // Add the Authorization header to each request
        operation.setContext({
          headers: {
            "Authorization": `Apikey c2fa6fe8-e9b9-421a-b9de-37f4a12275da	`
        },
        });
        return forward(operation);
      })
    ),
  ]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
