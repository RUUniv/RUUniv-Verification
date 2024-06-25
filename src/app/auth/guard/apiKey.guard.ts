import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const header = context.switchToHttp().getRequest().headers.apikey;

    const apiKey = await this.dataBaseService.apiKey.findUnique({
      where: { apiKey: header },
    });

    if (apiKey != null) {
      return true;
    }

    throw new Error('Unauthorized');
  }
}
