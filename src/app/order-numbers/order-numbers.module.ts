import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderNumbersService } from './order-numbers.service';
import { EnvironmentModule } from '../config/environment.module';
import { OrderNumbersController } from './order-numbers.controller';
import { JwtAuthGuardModule } from '../middleware/jwt-auth.guard.module';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Module({
    imports: [
        HttpModule,
        EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
        JwtAuthGuardModule, // Importa o JwtAuthGuardModule para usar o JwtAuthGuard
    ],
    providers: [OrderNumbersService, JwtAuthGuard], // Registra-os como um provedores para ser utilizado por este módulo
    exports: [OrderNumbersService], // Exporta o OrderNumbersService para que possa ser injetado em outros módulos
    controllers: [OrderNumbersController],
})
export class OrderNumbersModule {}
