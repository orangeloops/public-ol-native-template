import {InMemoryCache} from "apollo-cache-inmemory/lib/inMemoryCache";
import {ApolloClient} from "apollo-client";
import {SchemaLink} from "apollo-link-schema";
import {makeExecutableSchema} from "graphql-tools";

import {GraphQLAPIClient, GraphQLAPIClientConfigureClientOptions} from "../GraphQLAPIClient";
import {typeDefs} from "../GraphQLAPIClientSchema";
import {authenticationResolvers} from "./Authentication.resolvers";
import {User} from "./User.mock";
import {UserData, userResolvers} from "./User.resolvers";

export const createGraphQLAPIClientMock = (options: Partial<GraphQLAPIClientConfigureClientOptions> & {initialMockedData?: Partial<{users: User[]}>}) => {
  const {initialMockedData} = options;

  if (initialMockedData?.users) UserData.users = initialMockedData.users;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [userResolvers, authenticationResolvers] as any,
  });

  GraphQLAPIClient.client = new ApolloClient({
    cache: new InMemoryCache({addTypename: false}),
    link: new SchemaLink({
      schema,
      context: (operation) => operation.getContext(),
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {};
  GraphQLAPIClient.options = {
    shouldRefreshToken: options.shouldRefreshToken || (() => false),
    onRefreshToken: options.onRefreshToken || noop,
    userAgent: options.userAgent || "",
  };

  return GraphQLAPIClient.client;
};
