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
    IRaffleNumbersQueryDTO,
    IRaffleNumbersPersistDTO,
} from './raffle-numbers.interface';

/**
 * Data Transfer Object for RaffleNumbers.
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class RaffleNumbersQueryDTO implements IRaffleNumbersQueryDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    number: any;
    @IsOptional()
    @ApiProperty({
        example: "'available'",
        description: 'Descrição do campo.',
    })
    status: any;
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

export class RaffleNumbersPersistDTO implements IRaffleNumbersPersistDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    number: any;
    @IsOptional()
    @ApiProperty({
        example: "'available'",
        description: 'Descrição do campo.',
    })
    status: any;
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
