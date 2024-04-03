import { MemberMongoEntity } from 'src/module/member/repository/member.mongo-entity';
import { genIdMock } from './gen-id.mock';

export const MemberMock: MemberMongoEntity[] = [
  {
    code: 'M001',
    name: 'Angga',
    _id: genIdMock(),
  },
  {
    code: 'M002',
    name: 'Ferry',
    _id: genIdMock(),
  },
  {
    code: 'M003',
    name: 'Putri',
    _id: genIdMock(),
  },
];
