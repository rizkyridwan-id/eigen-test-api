import { Entity } from 'src/core/base/domain/entity';
import { MemberCode } from './value-object/member-code.value-object';

export interface MemberProps {
  // put field interface here
  name: string;
  code: MemberCode;
  input_date: Date;
}

export class MemberEntity extends Entity<MemberProps> {
  constructor(props: MemberProps) {
    super(props);
  }
}
