import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import {
  InvalidApiKeyException,
  NullApiKeyException,
} from 'src/common/errors/apiKey.error';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly dataBaseService: DatabaseService) {}
  private readonly logger = new Logger(ApiKeyAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const header = await context.switchToHttp().getRequest().headers.apikey;

    if (header == null) {
      throw new NullApiKeyException();
    }

    const apiKey = await this.dataBaseService.apiKey.findUnique({
      where: { apiKey: header },
    });

    if (apiKey != null) {
      this.logger.log(`ApiKey Pass : ${apiKey.id}`);
      request.user = apiKey.id;
      return true;
    }

    this.logger.error(`Invalid Api Key`);
    throw new InvalidApiKeyException();
  }
}
