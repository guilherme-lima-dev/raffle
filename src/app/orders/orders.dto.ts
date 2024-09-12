import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    IsArray,
    ArrayNotEmpty, IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IOrdersQueryDTO, IOrdersPersistDTO } from './orders.interface';

/**
 * Data Transfer Object for Orders (Query).
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class OrdersQueryDTO {
    @ApiProperty({
        example: 'exemplo',
        description: 'Nome do cliente.',
    })
    customer_name: string;

    @ApiProperty({
        example: '61993248349',
        description: 'Telefone do cliente.',
    })
    customer_phone: string;

    @ApiProperty({
        example: 'paid',
        description: 'Status da ordem.',
    })
    status: string;

    @ApiProperty({
        example: '2024-09-11T21:08:18.000Z',
        description: 'Data da ordem.',
    })
    order_date: string;

    @ApiProperty({
        example: 'f824c9be-7081-11ef-adb4-028b968b3f3d',
        description: 'ID externo da ordem.',
    })
    external_id: string;

    // Adiciona a contagem de números comprados
    @ApiProperty({
        example: 5,
        description: 'Quantidade de números comprados na ordem.',
    })
    numbers_count: number;
}


/**
 * Data Transfer Object for Orders (Persist).
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle
 * no momento de criação ou atualização de uma ordem.
 */
export class OrdersPersistDTO implements IOrdersPersistDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'John Doe',
        description: 'Nome do cliente que está fazendo o pedido.',
    })
    customer_name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'NULL',
        description: 'Telefone do cliente. Opcional.',
    })
    customer_phone: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com a rifa (raffles).',
    })
    raffle_eid: string;

    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty({
        example: [8, 12, 13, 18],
        description: 'Números selecionados para a ordem.',
    })
    numbers: number[];

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: "'pending'",
        description: 'Status inicial da ordem. Padrão é "pending".',
    })
    status: string;

    @IsOptional()
    @ApiProperty({
        example: '2024-01-01T00:00:00Z',
        description: 'Data de criação da ordem. Gerada automaticamente.',
    })
    order_date: string;

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Identificador externo da ordem. Gerado automaticamente.',
    })
    external_id: string;
}
