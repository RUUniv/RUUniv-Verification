import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  InvalidApiKeyException,
  NullApiKeyException,
} from 'src/common/errors/apiKey.error';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = await context.switchToHttp().getRequest().headers.apikey;

    if (header == null) {
      console.log(request);
      throw new NullApiKeyException();
    }

    const apiKey = await this.dataBaseService.apiKey.findUnique({
      where: { apiKey: header },
    });

    if (apiKey != null) {
      request.user = apiKey.id;
      return true;
    }

    throw new InvalidApiKeyException();
  }
}
