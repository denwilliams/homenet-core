import * as express from 'express';
const { makeExecutableSchema } = require('graphql-tools');
const graphqlHTTP = require('express-graphql');
import fs = require('fs');
import path = require('path');
import { root } from './resolvers';
import { SCHEMA } from './schema';

const schema = makeExecutableSchema({typeDefs: SCHEMA, resolvers: root});

export function handler(webApiDependencies: Homenet.IWebDependencies) {
  return graphqlHTTP(req => {
    return {
      schema: schema,
      context: webApiDependencies,
      graphiql: true
    };
  });
};
