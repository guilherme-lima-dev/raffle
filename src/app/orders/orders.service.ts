import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSourceService } from '../config/datasource.service';
import { OrdersEntity } from '@app/entities/orders';
import { OrdersQueryDTO, OrdersPersistDTO } from './orders.dto';
import { RafflesEntity } from '@app/entities/raffles';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(private dataSourceService: DataSourceService) {}

    async create(dto: OrdersPersistDTO): Promise<OrdersQueryDTO> {
        this.logger.log(`Creating orders`);
        const newEntity = new OrdersEntity();
        newEntity.customer_name = dto.customer_name;
        newEntity.customer_phone = dto.customer_phone;
        newEntity.status = dto.status;
        newEntity.order_date = dto.order_date;
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
            .getRepository(OrdersEntity)
            .save(newEntity);

        return this.toDTO(savedEntity);
    }

    async findByExternalId(external_id: string): Promise<OrdersQueryDTO> {
        this.logger.log(`Finding orders with External ID: ${external_id}`);
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .findOne({
                where: { external_id },
            });

        if (!entity) {
            throw new NotFoundException('Orders not found');
        }

        return this.toDTO(entity);
    }

    async findAll(): Promise<OrdersQueryDTO[]> {
        this.logger.log('Finding all orderss');
        const entities = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .find();
        return entities.map((entity: OrdersEntity) => this.toDTO(entity));
    }

    async updateByExternalId(
        external_id: string,
        dto: OrdersPersistDTO
    ): Promise<OrdersQueryDTO> {
        this.logger.log(`Updating orders with External ID: ${external_id}`);
        let entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('Orders not found');
        }
        entity.customer_name = dto.customer_name;
        entity.customer_phone = dto.customer_phone;
        entity.status = dto.status;
        entity.order_date = dto.order_date;
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
            .getRepository(OrdersEntity)
            .save(entity);

        return this.toDTO(updatedEntity);
    }

    async deleteByExternalId(external_id: string): Promise<void> {
        this.logger.log(`Deleting orders with External ID: ${external_id}`);
        const entity = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .findOne({ where: { external_id } });

        if (!entity) {
            throw new NotFoundException('Orders not found');
        }

        await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .softDelete({ external_id: entity.external_id });
    }

    private toDTO(entity: OrdersEntity): OrdersQueryDTO {
        this.logger.log(`Mapping entity to DTO: ${entity.external_id}`);
        const dto = new OrdersQueryDTO();
        dto.customer_name = entity.customer_name;
        dto.customer_phone = entity.customer_phone;
        dto.status = entity.status;
        dto.order_date = entity.order_date;
        dto.external_id = entity.external_id;
        dto.raffle_eid = entity.raffle.external_id;
        dto.external_id = entity.external_id;
        return dto;
    }
}
