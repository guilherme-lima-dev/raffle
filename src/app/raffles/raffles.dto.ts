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
import { IRafflesQueryDTO, IRafflesPersistDTO } from './raffles.interface';

/**
 * Data Transfer Object for Raffles.
 *
 * Utilizado para transferir dados entre a camada de persistência e a camada de controle,
 * ocultando chaves primárias e datas automáticas, enquanto expõe os external_id e outras
 * informações de negócio relevantes.
 */
export class RafflesQueryDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'Rifa de Natal',
        description: 'Nome da rifa',
    })
    name: string;

    @IsOptional()
    @ApiProperty({
        example: 'Esta rifa é para ajudar uma instituição de caridade.',
        description: 'Descrição da rifa',
    })
    description: string;

    @IsNotEmpty()
    @ApiProperty({
        example: '49.99',
        description: 'Preço de cada número da rifa',
    })
    price: number;

    @IsNotEmpty()
    @ApiProperty({
        example: 100,
        description: 'Quantidade total de números disponíveis na rifa',
    })
    total_numbers: number;

    @IsOptional()
    @ApiProperty({
        example: 'active',
        description: 'Status da rifa',
    })
    status: string;

    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'ID externo da rifa',
    })
    external_id: string;

    // Adicionando a lista de números
    @IsOptional()
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 1 },
                number: { type: 'integer', example: 7 },
                status: { type: 'string', example: 'available' },
                external_id: { type: 'string', example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b' },
            },
        },
        description: 'Lista de números da rifa',
    })
    numbers: Array<{
        id: number;
        number: number;
        status: string;
        external_id: string;
    }>;
}


export class RafflesPersistDTO implements IRafflesPersistDTO {
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    name: any;
    @IsOptional()
    @ApiProperty({
        example: 'NULL',
        description: 'Descrição do campo.',
    })
    description: any;
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    price: any;
    @IsNotEmpty()
    @ApiProperty({
        example: 'exemplo',
        description: 'Descrição do campo.',
    })
    total_numbers: any;
    @IsOptional()
    @ApiProperty({
        example: "'active'",
        description: 'Descrição do campo.',
    })
    status: any;
    @IsOptional()
    @ApiProperty({
        example: 'b2e293e5-4a4a-4b29-b9a4-4b2b4a4a4b2b',
        description: 'Descrição do campo.',
    })
    external_id: any;
}
