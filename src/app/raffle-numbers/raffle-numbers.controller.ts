import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RaffleNumbersService } from './raffle-numbers.service';
import {
    RaffleNumbersQueryDTO,
    RaffleNumbersPersistDTO,
} from './raffle-numbers.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('raffle-numbers')
@Controller('raffle-numbers')
export class RaffleNumbersController {
    constructor(private readonly raffleNumbersService: RaffleNumbersService) {}

    @Post()
    
    @ApiOperation({
        summary: 'Criação de um novo RaffleNumbers.',
        description:
            'Este endpoint cria um novo RaffleNumbers no sistema com as informações fornecidas.',
    })
    @ApiResponse({
        status: 201,
        description: 'O RaffleNumbers foi criado com sucesso.',
        type: RaffleNumbersQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'RaffleNumbers já existe' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async create(
        @Body() dto: RaffleNumbersPersistDTO
    ): Promise<RaffleNumbersQueryDTO> {
        try {
            return await this.raffleNumbersService.create(dto);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('RaffleNumbers já existe');
            }
            throw new InternalServerErrorException(
                'Erro ao criar RaffleNumbers'
            );
        }
    }

    @Get(':external_id')
    
    @ApiOperation({
        summary: 'Busca um RaffleNumbers pelo External ID.',
        description:
            'Este endpoint busca um RaffleNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O RaffleNumbers foi encontrado.',
        type: RaffleNumbersQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'RaffleNumbers não encontrado' })
    async findByExternalId(
        @Param('external_id') external_id: string
    ): Promise<RaffleNumbersQueryDTO> {
        try {
            return await this.raffleNumbersService.findByExternalId(
                external_id
            );
        } catch (error) {
            throw new NotFoundException('RaffleNumbers não encontrado');
        }
    }

    @Get()
    
    @ApiOperation({
        summary: 'Busca todos os RaffleNumberss.',
        description:
            'Este endpoint busca todos os RaffleNumberss cadastrados no sistema.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de RaffleNumberss.',
        type: [RaffleNumbersQueryDTO],
    })
    async findAll(): Promise<RaffleNumbersQueryDTO[]> {
        return await this.raffleNumbersService.findAll();
    }

    @Put(':external_id')
    
    @ApiOperation({
        summary: 'Atualiza um RaffleNumbers pelo External ID.',
        description:
            'Este endpoint atualiza os detalhes de um RaffleNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O RaffleNumbers foi atualizado com sucesso.',
        type: RaffleNumbersQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'RaffleNumbers não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async updateByExternalId(
        @Param('external_id') external_id: string,
        @Body() dto: RaffleNumbersPersistDTO
    ): Promise<RaffleNumbersQueryDTO> {
        try {
            return await this.raffleNumbersService.updateByExternalId(
                external_id,
                dto
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('RaffleNumbers não encontrado');
            }
            throw new InternalServerErrorException(
                'Erro ao atualizar RaffleNumbers'
            );
        }
    }

    @Delete(':external_id')
    
    @ApiOperation({
        summary: 'Deleta um RaffleNumbers pelo External ID.',
        description:
            'Este endpoint deleta um RaffleNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 204,
        description: 'O RaffleNumbers foi deletado com sucesso.',
    })
    @ApiResponse({ status: 404, description: 'RaffleNumbers não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async deleteByExternalId(
        @Param('external_id') external_id: string
    ): Promise<void> {
        try {
            await this.raffleNumbersService.deleteByExternalId(external_id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('RaffleNumbers não encontrado');
            }
            throw new InternalServerErrorException(
                'Erro ao deletar RaffleNumbers'
            );
        }
    }
}
