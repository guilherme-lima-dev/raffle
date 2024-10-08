import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DataSourceService } from './config/datasource.service';
import { EnvironmentService } from './config/environment.service';
import { HealthService } from './health/health.service';
import { AppReadinessService } from './config/app.readiness.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*'// Permitir cookies e outras credenciais
    });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: { retryAttempts: 5, retryDelay: 3000 },
    });

    const isProd = process.env.NODE_ENV === 'production';
    const microserviceName =
        app.get(EnvironmentService).getEnv().get<string>('MICROSERVICE_NAME') ||
        'Microservice';

    const microserviceport = app
        .get(EnvironmentService)
        .getEnv()
        .get<string>('PORT');

    const ds = app.get(DataSourceService).getDataSource();
    ds.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((error: any) => console.log(error));

    if (!isProd) {
        const config = new DocumentBuilder()
            .setTitle(microserviceName)
            .setDescription(`${microserviceName} - documentação`)
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api', app, document);
    }

    app.startAllMicroservices();
    const PORT = process.env.PORT || microserviceport;
    await app.listen(PORT);
    try {
        const appUrl = await app.getUrl();
        console.log(`Application ${microserviceName} is running on: ${appUrl}`);
        const appReadinessService = app.get(AppReadinessService);
        appReadinessService.setAppReady(true);
    } catch (error) {
        console.error('Erro ao obter a URL da aplicação:', error);
    }
} // async function bootstrap()

bootstrap().catch((error) => {
    console.error('Erro na inicialização da aplicação:', error);
});
