import { Entity } from 'src/core/base/domain/entity';

export interface MemberProps {
  // put field interface here
  name: string;
}

export class MemberEntity extends Entity<MemberProps> {
  constructor(props: MemberProps) {
    super(props);
  }
}
