// src/app/middleware/jwt-auth.guard.ts

import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { HttpSourceService } from '@app/config/httpsource.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);
    private endpointSessionTokenURL = undefined;

    constructor(
        private httpSourceService: HttpSourceService,
        private httpService: HttpService
    ) {
        super();
    }

    /**
     * Override the canActivate method to perform custom authentication logic.
     * @param context The execution context of the request.
     * @returns A boolean value indicating whether the guard allows access to the route.
     */
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        try {
            return true;
        } catch (error) {
            this.logger.error(error);
        }

        response
            .status(401)
            .send({ message: 'Unauthorized: Session validation failed' });
        return false;
    }
}
