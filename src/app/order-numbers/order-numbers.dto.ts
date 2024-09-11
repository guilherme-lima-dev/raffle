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
import {
    IOrderNumbersQueryDTO,
    IOrderNumbersPersistDTO,
} from './order-numbers.interface';

/**
 * Data Transfer Object for OrderNumbers.
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class OrderNumbersQueryDTO implements IOrderNumbersQueryDTO {
    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Descrição do campo.',
    })
    external_id: any;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com orders.',
    })
    order_eid: string;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com raffle_numbers.',
    })
    number_eid: string;
}

export class OrderNumbersPersistDTO implements IOrderNumbersPersistDTO {
    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Descrição do campo.',
    })
    external_id: any;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com orders.',
    })
    order_eid: string;

    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo relacionado com raffle_numbers.',
    })
    number_eid: string;
}
