import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const [deleteBook] = useMutation(DELETE_BOOK);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return false;
  }
  const { data, error, loading } = useQuery(QUERY_ME);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({ variables: { bookId, userId: data.me._id } });
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return (
      <h2>LOADING... please wait...or don't I don't control your life.</h2>
    );
  }

  if (error) {
    throw new Error("didn't load");
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {data.username ? (
            <h1>Viewing {data.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {data.savedBooks.length
            ? `Viewing ${data.savedBooks.length} saved ${
                data.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {data.savedBooks.map((book: any) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
