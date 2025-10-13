export class Book {
  private static instance: Book;

  private books: BookType[] = [];

  private constructor() {}

  static getInstance() {
    if (!Book.instance) {
      Book.instance = new Book();
    }
    return Book.instance;
  }

  displayBooks() {
    return this.books;
  }

  findBook(title: string) {
    return this.books.find((book) => book.title === title);
  }

  addBook(newBook: BookType) {
    this.books.push(newBook);
  }

  removeBookByTitle(bookTitle: string) {
    this.books = this.books.filter((book) => book.title != bookTitle);
  }
}
