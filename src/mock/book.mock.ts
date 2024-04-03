import { BookMongoEntity } from 'src/module/book/repository/book.mongo-entity';
import { genIdMock } from './gen-id.mock';

export const BookMock: BookMongoEntity[] = [
  {
    code: 'JK-45',
    title: 'Harry Potter',
    author: 'J.K Rowling',
    stock: 1,
    input_date: new Date(),
    _id: genIdMock(),
  },
  {
    code: 'SHR-1',
    title: 'A Study in Scarlet',
    author: 'Arthur Conan Doyle',
    stock: 1,
    input_date: new Date(),
    _id: genIdMock(),
  },
  {
    code: 'TW-11',
    title: 'Twilight',
    author: 'Stephenie Meyer',
    stock: 1,
    input_date: new Date(),
    _id: genIdMock(),
  },
  {
    code: 'HOB-83',
    title: 'The Hobbit, or There and Back Again',
    author: 'J.R.R. Tolkien',
    stock: 1,
    input_date: new Date(),
    _id: genIdMock(),
  },
  {
    code: 'NRN-7',
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    stock: 1,
    input_date: new Date(),
    _id: genIdMock(),
  },
];
