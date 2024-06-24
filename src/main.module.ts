import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DatabaseService } from './infrastructure/database/database.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


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
