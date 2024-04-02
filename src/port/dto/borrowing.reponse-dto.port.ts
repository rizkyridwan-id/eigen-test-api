export interface IDetailReceiptBorrowBook {
  name: string;
  book_names: string[];
  due_date: string;
  borrowed_date: string;
}

export interface IBorrowBookResponse {
  receipt: IDetailReceiptBorrowBook;
}
