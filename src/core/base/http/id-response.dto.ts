import { IId } from 'src/port/interface/id.interface';

export class IdResponseDTO implements IId {
  constructor(id: string) {
    this._id = id;
  }

  _id: string;
}
