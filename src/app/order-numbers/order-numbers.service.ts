import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSourceService } from '../config/datasource.service';
import { OrderNumbersEntity } from '@app/entities/order_numbers';
import {
    OrderNumbersQueryDTO,
    OrderNumbersPersistDTO,
} from './order-numbers.dto';
import { OrdersEntity } from '@app/entities/orders';
import { RaffleNumbersEntity } from '@app/entities/raffle_numbers';

@Injectable()
export class OrderNumbersService {
    private readonly logger = new Logger(OrderNumbersService.name);

    constructor(private dataSourceService: DataSourceService) {}

    async create(dto: OrderNumbersPersistDTO): Promise<OrderNumbersQueryDTO> {
        this.logger.log(`Creating ordernumbers`);
        const newEntity = new OrderNumbersEntity();
        newEntity.external_id = dto.external_id;

        const order = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .findOne({ where: { external_id: dto.order_eid } });

        if (!order) {
            throw new NotFoundException('Orders not found');
        }

        newEntity.order = order;

        const number = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .findOne({ where: { external_id: dto.number_eid } });

        if (!number) {
            throw new NotFoundException('RaffleNumbers not found');
        }

        newEntity.number = number;

        const savedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .save(newEntity);

        return this.toDTO(savedEntity);
    }

    async findByExternalId(external_id: string): Promise<OrderNumbersQueryDTO> {
        this.logger.log(
            `Finding ordernumbers with External ID: ${external_id}`
        );
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .findOne({
                where: { external_id },
            });

        if (!entity) {
            throw new NotFoundException('OrderNumbers not found');
        }

        return this.toDTO(entity);
    }

    async findAll(): Promise<OrderNumbersQueryDTO[]> {
        this.logger.log('Finding all ordernumberss');
        const entities = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .find();
        return entities.map((entity: OrderNumbersEntity) => this.toDTO(entity));
    }

    async updateByExternalId(
        external_id: string,
        dto: OrderNumbersPersistDTO
    ): Promise<OrderNumbersQueryDTO> {
        this.logger.log(
            `Updating ordernumbers with External ID: ${external_id}`
        );
        let entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('OrderNumbers not found');
        }
        entity.external_id = dto.external_id;

        const order = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .findOne({ where: { external_id: dto.order_eid } });

        if (!order) {
            throw new NotFoundException('Orders not found');
        }

        entity.order = order;

        const number = await this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity)
            .findOne({ where: { external_id: dto.number_eid } });

        if (!number) {
            throw new NotFoundException('RaffleNumbers not found');
        }

        entity.number = number;

        const updatedEntity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .save(entity);

        return this.toDTO(updatedEntity);
    }

    async deleteByExternalId(external_id: string): Promise<void> {
        this.logger.log(
            `Deleting ordernumbers with External ID: ${external_id}`
        );
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('OrderNumbers not found');
        }

        await this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity)
            .softDelete({ external_id: entity.external_id });
    }

    private toDTO(entity: OrderNumbersEntity): OrderNumbersQueryDTO {
        this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
        const dto = new OrderNumbersQueryDTO();
        dto.external_id = entity.external_id;
        dto.order_eid = entity.order.external_id;
        dto.number_eid = entity.number.external_id;
        dto.external_id = entity.external_id;
        return dto;
    }
}
