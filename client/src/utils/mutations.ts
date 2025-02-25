import { gql } from '@apollo/client';

export const ADD_USER = gql`mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
  }
}`;

export const LOGIN = gql`mutation Login($password: String!, $username: String, $email: String) {
  login(password: $password, username: $username, email: $email) {
    token
  }
}`;

export const SAVE_BOOK = gql`mutation SaveBook($userId: ID!, $bookData: BookInput!) {
    saveBook(userId: $userId, bookData: $bookData) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
      bookCount
    }
  }`

export const DELETE_BOOK = gql`mutation DeleteBook($userId: ID!, $bookId: ID!) {
  deleteBook(userId: $userId, bookId: $bookId) {
    _id
  }
}`