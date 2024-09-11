import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSourceService } from '../config/datasource.service';
import { RaffleNumbersEntity } from '@app/entities/raffle_numbers';
import {
    RaffleNumbersQueryDTO,
    RaffleNumbersPersistDTO,
} from './raffle-numbers.dto';
import { RafflesEntity } from '@app/entities/raffles';

@Injectable()
export class RaffleNumbersService {
    private readonly logger = new Logger(RaffleNumbersService.name);

    constructor(private dataSourceService: DataSourceService) {}

    async create(dto: RaffleNumbersPersistDTO): Promise<RaffleNumbersQueryDTO> {
        this.logger.log(`Creating rafflenumbers`);
        const newEntity = new RaffleNumbersEntity();
        newEntity.number = dto.number;
        newEntity.status = dto.status;
        newEntity.external_id = dto.external_id;

        const raffle = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({ where: { external_id: dto.raffle_eid } });

        if (!raffle) {
            throw new NotFoundException('Raffles not found');
        }

        newEntity.raffle = raffle;

        const savedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .save(newEntity);

        return this.toDTO(savedEntity);
    }

    async findByExternalId(
        external_id: string
    ): Promise<RaffleNumbersQueryDTO> {
        this.logger.log(
            `Finding rafflenumbers with External ID: ${external_id}`
        );
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .findOne({
                where: { external_id },
            });

        if (!entity) {
            throw new NotFoundException('RaffleNumbers not found');
        }

        return this.toDTO(entity);
    }

    async findAll(): Promise<RaffleNumbersQueryDTO[]> {
        this.logger.log('Finding all rafflenumberss');
        const entities = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .find();
        return entities.map((entity: RaffleNumbersEntity) =>
            this.toDTO(entity)
        );
    }

    async updateByExternalId(
        external_id: string,
        dto: RaffleNumbersPersistDTO
    ): Promise<RaffleNumbersQueryDTO> {
        this.logger.log(
            `Updating rafflenumbers with External ID: ${external_id}`
        );
        let entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('RaffleNumbers not found');
        }
        entity.number = dto.number;
        entity.status = dto.status;
        entity.external_id = dto.external_id;

        const raffle = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({ where: { external_id: dto.raffle_eid } });

        if (!raffle) {
            throw new NotFoundException('Raffles not found');
        }

        entity.raffle = raffle;

        const updatedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .save(entity);

        return this.toDTO(updatedEntity);
    }

    async deleteByExternalId(external_id: string): Promise<void> {
        this.logger.log(
            `Deleting rafflenumbers with External ID: ${external_id}`
        );
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('RaffleNumbers not found');
        }

        await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .softDelete({ external_id: entity.external_id });
    }

    private toDTO(entity: RaffleNumbersEntity): RaffleNumbersQueryDTO {
        this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
        const dto = new RaffleNumbersQueryDTO();
        dto.number = entity.number;
        dto.status = entity.status;
        dto.external_id = entity.external_id;
        dto.raffle_eid = entity.raffle.external_id;
        dto.external_id = entity.external_id;
        return dto;
    }
}
