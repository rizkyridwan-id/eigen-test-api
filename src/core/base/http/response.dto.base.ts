import { IsNumber, IsObject, IsString } from 'class-validator';

interface IResponseDto<T = { [k: string]: any }> {
  status: number;
  data?: T;
  message?: string;
  count?: number;
}

export class ResponseDto<T = { [k: string]: any }> implements IResponseDto<T> {
  constructor({ status, data, message = '', count = 0 }: IResponseDto<T>) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.count = count;
  }

  @IsNumber()
  status: number;

  @IsObject()
  data?: T;

  @IsString()
  message?: string;

  @IsNumber()
  count?: number;
}
