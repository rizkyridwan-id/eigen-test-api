import { Types } from 'mongoose';

export const genIdMock = () =>
  Types.ObjectId.createFromTime(Date.now() - Math.floor(Math.random() * 2000));
