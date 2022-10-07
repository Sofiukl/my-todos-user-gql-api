export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GetUserResponse = {
  __typename?: 'GetUserResponse';
  createdAt: Scalars['String'];
  createdBy: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Scalars['String'];
  updatedAt: Scalars['String'];
  updatedBy: Scalars['String'];
};

export type LogInResponse = {
  __typename?: 'LogInResponse';
  token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LogInResponse;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<GetUserResponse>;
  users?: Maybe<Array<Maybe<GetUserResponse>>>;
};


export type QueryUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export enum Role {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Unknown = 'UNKNOWN',
  User = 'USER'
}
