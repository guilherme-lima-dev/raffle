import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RaffleNumbersService } from './raffle-numbers.service';
import { EnvironmentModule } from '../config/environment.module';
import { RaffleNumbersController } from './raffle-numbers.controller';
import { JwtAuthGuardModule } from '../middleware/jwt-auth.guard.module';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Module({
    imports: [
        HttpModule,
        EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
        JwtAuthGuardModule, // Importa o JwtAuthGuardModule para usar o JwtAuthGuard
    ],
    providers: [RaffleNumbersService, JwtAuthGuard], // Registra-os como um provedores para ser utilizado por este módulo
    exports: [RaffleNumbersService], // Exporta o RaffleNumbersService para que possa ser injetado em outros módulos
    controllers: [RaffleNumbersController],
})
export class RaffleNumbersModule {}
