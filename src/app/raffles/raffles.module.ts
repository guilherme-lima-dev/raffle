import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RafflesService } from './raffles.service';
import { EnvironmentModule } from '../config/environment.module';
import { RafflesController } from './raffles.controller';
import { JwtAuthGuardModule } from '../middleware/jwt-auth.guard.module';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Module({
    imports: [
        HttpModule,
        EnvironmentModule, // Importa o EnvironmentModule para usar o EnvironmentService e o DataSourceService
        JwtAuthGuardModule, // Importa o JwtAuthGuardModule para usar o JwtAuthGuard
    ],
    providers: [RafflesService, JwtAuthGuard], // Registra-os como um provedores para ser utilizado por este módulo
    exports: [RafflesService], // Exporta o RafflesService para que possa ser injetado em outros módulos
    controllers: [RafflesController],
})
export class RafflesModule {}
