// src/ApolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import React from 'react';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:3000/graphql', 
    }),
    cache: new InMemoryCache()
});

const ApolloWrapper = ({ children }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};

export default ApolloWrapper;
