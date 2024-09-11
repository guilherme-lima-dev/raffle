import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    IsNumber,
    IsUUID,
    IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IOrdersQueryDTO, IOrdersPersistDTO } from './orders.interface';

/**
 * Data Transfer Object for Orders.
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class OrdersQueryDTO implements IOrdersQueryDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    customer_name: any;
    @IsOptional()
    @ApiProperty({
        example: 'NULL',
        description: 'Descrição do campo.',
    })
    customer_phone: any;
    @IsOptional()
    @ApiProperty({
        example: "'pending'",
        description: 'Descrição do campo.',
    })
    status: any;
    @IsOptional()
    @ApiProperty({
        example: '2024-01-01T00:00:00Z',
        description: 'Descrição do campo.',
    })
    order_date: any;
    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Descrição do campo.',
    })
    external_id: any;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com raffles.',
    })
    raffle_eid: string;
}

export class OrdersPersistDTO implements IOrdersPersistDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    customer_name: any;
    @IsOptional()
    @ApiProperty({
        example: 'NULL',
        description: 'Descrição do campo.',
    })
    customer_phone: any;
    @IsOptional()
    @ApiProperty({
        example: "'pending'",
        description: 'Descrição do campo.',
    })
    status: any;
    @IsOptional()
    @ApiProperty({
        example: '2024-01-01T00:00:00Z',
        description: 'Descrição do campo.',
    })
    order_date: any;
    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Descrição do campo.',
    })
    external_id: any;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com raffles.',
    })
    raffle_eid: string;
}
