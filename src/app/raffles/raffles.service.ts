import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSourceService } from '../config/datasource.service';
import { RafflesEntity } from '@app/entities/raffles';
import { RafflesQueryDTO, RafflesPersistDTO } from './raffles.dto';
import {RaffleNumbersEntity} from "@app/entities/raffle_numbers";

@Injectable()
export class RafflesService {
    private readonly logger = new Logger(RafflesService.name);

    constructor(private dataSourceService: DataSourceService) {}

    async create(dto: RafflesPersistDTO): Promise<RafflesQueryDTO> {
        this.logger.log(`Creating raffle with ${dto.total_numbers} numbers`);

        const newEntity = new RafflesEntity();
        newEntity.name = dto.name;
        newEntity.description = dto.description;
        newEntity.price = dto.price;
        newEntity.total_numbers = dto.total_numbers;
        newEntity.status = dto.status;
        newEntity.external_id = dto.external_id;

        // Salva a nova rifa
        const savedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .save(newEntity);

        // Gera e salva os números da rifa
        const raffleNumbers = [];
        for (let i = 1; i <= dto.total_numbers; i++) {
            const raffleNumber = new RaffleNumbersEntity();
            raffleNumber.number = i;
            raffleNumber.raffle = savedEntity; // Relaciona com a rifa recém-criada
            raffleNumbers.push(raffleNumber);
        }

        // Salva todos os números no banco de dados
        await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .save(raffleNumbers);

        return this.toDTO(savedEntity);
    }


    async findByExternalId(external_id: string): Promise<RafflesQueryDTO> {
        this.logger.log(`Finding raffles with External ID: ${external_id}`);

        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({
                where: { external_id },
                relations: ['raffleNumbers'],  // Inclui os números relacionados
            });

        if (!entity) {
            throw new NotFoundException('Raffles not found');
        }

        return this.toDTO(entity);
    }


    async findAll(): Promise<RafflesQueryDTO[]> {
        this.logger.log('Finding all raffless');
        const entities = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .find();
        return entities.map((entity: RafflesEntity) => this.toDTO(entity));
    }

    async updateByExternalId(
        external_id: string,
        dto: RafflesPersistDTO
    ): Promise<RafflesQueryDTO> {
        this.logger.log(`Updating raffles with External ID: ${external_id}`);
        let entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('Raffles not found');
        }
        entity.name = dto.name;
        entity.description = dto.description;
        entity.price = dto.price;
        entity.total_numbers = dto.total_numbers;
        entity.status = dto.status;
        entity.external_id = dto.external_id;

        const updatedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .save(entity);

        return this.toDTO(updatedEntity);
    }

    async deleteByExternalId(external_id: string): Promise<void> {
        this.logger.log(`Deleting raffles with External ID: ${external_id}`);
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('Raffles not found');
        }

        await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .softDelete({ external_id: entity.external_id });
    }

    private toDTO(entity: RafflesEntity): RafflesQueryDTO {
        this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);

        const dto = new RafflesQueryDTO();
        dto.name = entity.name;
        dto.description = entity.description;
        dto.price = entity.price;
        dto.total_numbers = entity.total_numbers;
        dto.status = entity.status;
        dto.external_id = entity.external_id;

        // Mapeia os números da rifa
        dto.numbers = entity.raffleNumbers.map(numberEntity => ({
            id: numberEntity.id,
            number: numberEntity.number,
            status: numberEntity.status,
            external_id: numberEntity.external_id,
        }));

        return dto;
    }

}
