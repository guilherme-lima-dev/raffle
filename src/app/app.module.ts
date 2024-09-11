import { RafflesModule } from './raffles/raffles.module';
import { OrdersModule } from './orders/orders.module';
import { RaffleNumbersModule } from './raffle-numbers/raffle-numbers.module';
import { OrderNumbersModule } from './order-numbers/order-numbers.module';

import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HealthModule } from './health/health.module';
import { VersionModule } from './version/version.module';
import { JwtAuthGuardModule } from './middleware/jwt-auth.guard.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === 'test'
                    ? '.env.test'
                    : ['.env.local', '.env'],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public'),
        }),
        VersionModule,
        JwtAuthGuardModule,
        HealthModule,
        RafflesModule,
        OrdersModule,
        RaffleNumbersModule,
        OrderNumbersModule,
    ],
})
export class AppModule {}
