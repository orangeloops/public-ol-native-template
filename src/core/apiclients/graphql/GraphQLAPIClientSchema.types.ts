import {GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig} from "graphql";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {[X in Exclude<keyof T, K>]?: T[X]} & {[P in K]-?: NonNullable<T[P]>};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  Upload: any;
};

export type Query = {
  __typename?: "Query";
  _?: Maybe<Scalars["Boolean"]>;
  version?: Maybe<Scalars["String"]>;
  reset?: Maybe<Scalars["String"]>;
  me?: Maybe<User>;
  user?: Maybe<User>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["Boolean"]>;
  signUp?: Maybe<Void>;
  signIn?: Maybe<AccessToken>;
  refreshTokens?: Maybe<AccessToken>;
  checkEmail?: Maybe<CheckEmail>;
  confirmEmail?: Maybe<Void>;
  resendEmailConfirmation?: Maybe<Void>;
  requestResetPassword?: Maybe<Void>;
  resetPassword?: Maybe<Void>;
  updateUser?: Maybe<User>;
  deleteUser: Scalars["Boolean"];
};

export type MutationSignUpArgs = {
  name: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
  upload?: Maybe<Scalars["Upload"]>;
};

export type MutationSignInArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
  generateRefreshToken?: Maybe<Scalars["Boolean"]>;
};

export type MutationRefreshTokensArgs = {
  token: Scalars["String"];
};

export type MutationCheckEmailArgs = {
  email: Scalars["String"];
};

export type MutationConfirmEmailArgs = {
  token: Scalars["String"];
};

export type MutationResendEmailConfirmationArgs = {
  email: Scalars["String"];
};

export type MutationRequestResetPasswordArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  token: Scalars["String"];
  password: Scalars["String"];
};

export type MutationUpdateUserArgs = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  upload?: Maybe<Scalars["Upload"]>;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"];
};

export type Subscription = {
  __typename?: "Subscription";
  _?: Maybe<Scalars["Boolean"]>;
};

export type Void = {
  __typename?: "Void";
  _?: Maybe<Scalars["Boolean"]>;
};

export type ConnectionPageInfo = {
  __typename?: "ConnectionPageInfo";
  hasNextPage: Scalars["Boolean"];
  endCursor?: Maybe<Scalars["String"]>;
};

export enum ConnectionOrderDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export type CheckEmail = {
  __typename?: "CheckEmail";
  isAvailable?: Maybe<Scalars["Boolean"]>;
  isBlacklisted?: Maybe<Scalars["Boolean"]>;
  isCorporate?: Maybe<Scalars["Boolean"]>;
};

export type AccessToken = {
  __typename?: "AccessToken";
  token: Scalars["String"];
  refreshToken?: Maybe<Scalars["String"]>;
  expiresAt?: Maybe<Scalars["DateTime"]>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name: Scalars["String"];
  email: Scalars["String"];
  status: UserStatus;
  imageUrl?: Maybe<Scalars["String"]>;
  createdDate: Scalars["DateTime"];
  modifiedDate: Scalars["DateTime"];
  deletedDate?: Maybe<Scalars["DateTime"]>;
};

export enum UserStatus {
  Pending = "PENDING",
  Active = "ACTIVE",
  Blocked = "BLOCKED",
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{[key in TKey]: TResult}, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, {[key in TKey]: TResult}, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars["String"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  Void: ResolverTypeWrapper<Void>;
  ConnectionPageInfo: ResolverTypeWrapper<ConnectionPageInfo>;
  ConnectionOrderDirection: ConnectionOrderDirection;
  CheckEmail: ResolverTypeWrapper<CheckEmail>;
  AccessToken: ResolverTypeWrapper<AccessToken>;
  User: ResolverTypeWrapper<User>;
  UserStatus: UserStatus;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars["String"];
  Boolean: Scalars["Boolean"];
  DateTime: Scalars["DateTime"];
  Upload: Scalars["Upload"];
  Query: {};
  ID: Scalars["ID"];
  Mutation: {};
  Subscription: {};
  Void: Void;
  ConnectionPageInfo: ConnectionPageInfo;
  ConnectionOrderDirection: ConnectionOrderDirection;
  CheckEmail: CheckEmail;
  AccessToken: AccessToken;
  User: User;
  UserStatus: UserStatus;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type QueryResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]> = {
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  reset?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType, RequireFields<QueryUserArgs, "id">>;
};

export type MutationResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]> = {
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  signUp?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType, RequireFields<MutationSignUpArgs, "name" | "email" | "password">>;
  signIn?: Resolver<Maybe<ResolversTypes["AccessToken"]>, ParentType, ContextType, RequireFields<MutationSignInArgs, "email" | "password" | "generateRefreshToken">>;
  refreshTokens?: Resolver<Maybe<ResolversTypes["AccessToken"]>, ParentType, ContextType, RequireFields<MutationRefreshTokensArgs, "token">>;
  checkEmail?: Resolver<Maybe<ResolversTypes["CheckEmail"]>, ParentType, ContextType, RequireFields<MutationCheckEmailArgs, "email">>;
  confirmEmail?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType, RequireFields<MutationConfirmEmailArgs, "token">>;
  resendEmailConfirmation?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType, RequireFields<MutationResendEmailConfirmationArgs, "email">>;
  requestResetPassword?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType, RequireFields<MutationRequestResetPasswordArgs, "email">>;
  resetPassword?: Resolver<Maybe<ResolversTypes["Void"]>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, "token" | "password">>;
  updateUser?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, "id">>;
  deleteUser?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, "id">>;
};

export type SubscriptionResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"]> = {
  _?: SubscriptionResolver<Maybe<ResolversTypes["Boolean"]>, "_", ParentType, ContextType>;
};

export type VoidResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["Void"] = ResolversParentTypes["Void"]> = {
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ConnectionPageInfoResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["ConnectionPageInfo"] = ResolversParentTypes["ConnectionPageInfo"]> = {
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type CheckEmailResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["CheckEmail"] = ResolversParentTypes["CheckEmail"]> = {
  isAvailable?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  isBlacklisted?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  isCorporate?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type AccessTokenResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["AccessToken"] = ResolversParentTypes["AccessToken"]> = {
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type UserResolvers<ContextType = {headers?: Record<string, string | undefined>}, ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["UserStatus"], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  modifiedDate?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  deletedDate?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = {headers?: Record<string, string | undefined>}> = {
  DateTime?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Void?: VoidResolvers<ContextType>;
  ConnectionPageInfo?: ConnectionPageInfoResolvers<ContextType>;
  CheckEmail?: CheckEmailResolvers<ContextType>;
  AccessToken?: AccessTokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = {headers?: Record<string, string | undefined>}> = Resolvers<ContextType>;
