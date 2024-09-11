import {ConflictException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { DataSourceService } from '../config/datasource.service';
import { OrdersEntity } from '@app/entities/orders';
import { OrdersQueryDTO, OrdersPersistDTO } from './orders.dto';
import { RafflesEntity } from '@app/entities/raffles';
import {RaffleNumbersEntity} from "@app/entities/raffle_numbers";
import {In} from "typeorm";
import {OrderNumbersEntity} from "@app/entities/order_numbers";

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(private dataSourceService: DataSourceService) {}

    async create(dto: OrdersPersistDTO): Promise<OrdersQueryDTO> {
        this.logger.log(`Creating order for customer: ${dto.customer_name}`);

        // Busca a rifa pelo external_id
        const raffle = await this.dataSourceService
            .getDataSource()
            .getRepository(RafflesEntity)
            .findOne({ where: { external_id: dto.raffle_eid } });

        if (!raffle) {
            throw new NotFoundException('Raffle not found');
        }

        // Verifica se os números selecionados já estão associados a alguma ordem
        const orderNumbersRepository = this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity);

        const existingOrderNumbers = await orderNumbersRepository.find({
            where: {
                number: In(dto.numbers), // Verifica os números fornecidos no DTO
            },
            relations: ['number', 'order'],
        });

        if (existingOrderNumbers.length > 0) {
            const usedNumbers = existingOrderNumbers.map((orderNumber) => orderNumber.number.number);
            throw new ConflictException(`Os seguintes numeros já foram comprados: ${usedNumbers.join(', ')}`);
        }

        // Cria a nova ordem
        const newOrder = new OrdersEntity();
        newOrder.customer_name = dto.customer_name;
        newOrder.customer_phone = dto.customer_phone;
        newOrder.status = 'pending';
        newOrder.order_date = new Date();
        newOrder.external_id = dto.external_id;
        newOrder.raffle = raffle;

        // Salva a nova ordem
        const savedOrder = await this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity)
            .save(newOrder);

        // Busca os números disponíveis na tabela raffle_numbers
        const raffleNumbersRepository = this.dataSourceService
            .getDataSource()
            .getRepository(RaffleNumbersEntity);

        const selectedNumbers = await raffleNumbersRepository.find({
            where: {
                number: In(dto.numbers), // Busca os números informados no DTO
                raffle: raffle,          // Associa a rifa
                status: 'available',     // Apenas números disponíveis
            },
        });

        if (selectedNumbers.length !== dto.numbers.length) {
            throw new NotFoundException('Some numbers are not available');
        }

        // Cria os registros em order_numbers
        const orderNumbers = selectedNumbers.map((raffleNumber) => {
            const orderNumber = new OrderNumbersEntity();
            orderNumber.order = savedOrder;
            orderNumber.number = raffleNumber;
            return orderNumber;
        });

        // Salva todos os registros de order_numbers
        await orderNumbersRepository.save(orderNumbers);

        // Atualiza o status dos números para "sold"
        selectedNumbers.forEach((raffleNumber) => {
            raffleNumber.status = 'sold';
        });

        await raffleNumbersRepository.save(selectedNumbers);

        return this.toDTO(savedOrder);
    }

    async approveOrder(orderId: number): Promise<OrdersQueryDTO> {
        // Busca a ordem pelo ID
        const orderRepository = this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity);

        const order = await orderRepository.findOne({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Atualiza o status da ordem para "approved"
        order.status = 'paid';

        // Salva a alteração
        const updatedOrder = await orderRepository.save(order);

        this.logger.log(`Order ${orderId} approved.`);
        console.log(updatedOrder);


        return this.toDTO(updatedOrder);
    }

    async rejectOrder(orderId: number): Promise<OrdersQueryDTO> {
        // Busca a ordem pelo ID
        const orderRepository = this.dataSourceService
            .getDataSource()
            .getRepository(OrdersEntity);

        const order = await orderRepository.findOne({
            where: { id: orderId },
            relations: ['raffle', 'raffle.raffleNumbers'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Verifica se existem números associados a essa ordem
        const orderNumbersRepository = this.dataSourceService
            .getDataSource()
            .getRepository(OrderNumbersEntity);

        const orderNumbers = await orderNumbersRepository.find({
            where: { order },
            relations: ['number'],
        });

        console.log(orderNumbers);

        if (orderNumbers.length > 0) {
            // Atualiza o status dos números para "available"
            const raffleNumbersRepository = this.dataSourceService
                .getDataSource()
                .getRepository(RaffleNumbersEntity);

            orderNumbers.forEach((orderNumber) => {
                orderNumber.number.status = 'available';
            });

            // Salva a atualização dos números
            await raffleNumbersRepository.save(orderNumbers.map((orderNumber) => orderNumber.number));

            // Deleta os registros de order_numbers
            await orderNumbersRepository.delete({ order });
        }

        // Atualiza o status da ordem para "rejected"
        order.status = 'rejected';

        // Salva a alteração da ordem
        const updatedOrder = await orderRepository.save(order);

        this.logger.log(`Order ${orderId} rejected and numbers set back to available.`);

        return this.toDTO(updatedOrder);
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
        dto.id = entity.id;
        dto.customer_name = entity.customer_name;
        dto.customer_phone = entity.customer_phone;
        dto.status = entity.status;
        dto.order_date = entity.order_date;
        dto.external_id = entity.external_id;
        dto.external_id = entity.external_id;
        return dto;
    }
}
