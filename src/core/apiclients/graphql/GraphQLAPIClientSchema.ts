import gql from "graphql-tag";

export const typeDefs = gql`
  """
  A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
  """
  scalar DateTime

  scalar Upload

  type Query {
    _: Boolean
    version: String
    reset: String
    me: User
    user(id: ID!): User
  }

  type Mutation {
    _: Boolean
    signUp(name: String!, email: String!, password: String!, upload: Upload): Void
    signIn(email: String!, password: String!, generateRefreshToken: Boolean = false): AccessToken
    refreshTokens(token: String!): AccessToken
    checkEmail(email: String!): CheckEmail
    confirmEmail(token: String!): Void
    resendEmailConfirmation(email: String!): Void
    requestResetPassword(email: String!): Void
    resetPassword(token: String!, password: String!): Void
    updateUser(id: ID!, name: String, upload: Upload): User
    deleteUser(id: ID!): Boolean!
  }

  type Subscription {
    _: Boolean
  }

  type Void {
    _: Boolean
  }

  type ConnectionPageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  enum ConnectionOrderDirection {
    ASC
    DESC
  }

  type CheckEmail {
    isAvailable: Boolean
    isBlacklisted: Boolean
    isCorporate: Boolean
  }

  type AccessToken {
    token: String!
    refreshToken: String
    expiresAt: DateTime
  }

  type User {
    id: ID!
    name: String!
    email: String!
    status: UserStatus!
    imageUrl: String
    createdDate: DateTime!
    modifiedDate: DateTime!
    deletedDate: DateTime
  }

  enum UserStatus {
    PENDING
    ACTIVE
    BLOCKED
  }
`;
