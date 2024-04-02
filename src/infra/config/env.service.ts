import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from 'src/core/constant/config/env-key.const';

export interface IEnv {
  mode: string;
  port: string;
  dbConnectionUri: string;
}
@Injectable()
export class EnvService {
  private readonly _mode: string;
  private readonly _port: string;

  private readonly _dbConnectionUri: string;

  constructor(private readonly configService: ConfigService) {
    this._mode = this.configService.get<string>(EnvKey.MODE);
    this._port = this.configService.get<string>(EnvKey.PORT);
    this._dbConnectionUri = this.configService.get<string>(
      EnvKey.DB_CONNECTION_URI,
    );
  }

  get variables(): IEnv {
    return {
      mode: this._mode,
      port: this._port,
      dbConnectionUri: this._dbConnectionUri,
    };
  }
}
