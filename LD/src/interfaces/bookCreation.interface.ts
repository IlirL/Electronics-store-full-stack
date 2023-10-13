import {  AuthorCreationAttributes, BookCreationAttributes } from "@models";

export interface IBookCreationData extends BookCreationAttributes {
  authors: AuthorCreationAttributes[];
}