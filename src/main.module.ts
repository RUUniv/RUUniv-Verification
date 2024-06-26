import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import {} from './infrastructure/database/database.module';
import {} from './infrastructure/database/database.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AppModule,
    InfrastructureModule,
  ],
  providers: [],
})
export class MainModule {}
