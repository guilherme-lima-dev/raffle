import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersService } from './orders.service';
import { EnvironmentModule } from '../config/environment.module';
import { OrdersController } from './orders.controller';
import { JwtAuthGuardModule } from '../middleware/jwt-auth.guard.module';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Module({
    imports: [
        HttpModule,
        EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
        JwtAuthGuardModule, // Importa o JwtAuthGuardModule para usar o JwtAuthGuard
    ],
    providers: [OrdersService, JwtAuthGuard], // Registra-os como um provedores para ser utilizado por este módulo
    exports: [OrdersService], // Exporta o OrdersService para que possa ser injetado em outros módulos
    controllers: [OrdersController],
})
export class OrdersModule {}
