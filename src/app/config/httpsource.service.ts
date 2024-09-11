// src/app/config/httpsource.service.ts

import 'reflect-metadata';
import { Injectable, Logger } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Injectable()
export class HttpSourceService {
    private readonly logger = new Logger(HttpSourceService.name);

    constructor(private env: EnvironmentService) {
    }
}
