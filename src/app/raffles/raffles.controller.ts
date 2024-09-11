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
import {ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint} from '@nestjs/swagger';
import { RafflesService } from './raffles.service';
import { RafflesQueryDTO, RafflesPersistDTO } from './raffles.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('raffles')
@Controller('raffles')
export class RafflesController {
    constructor(private readonly rafflesService: RafflesService) {}

    @Post()
    @ApiOperation({
        summary: 'Criação de um novo Raffles.',
        description:
            'Este endpoint cria um novo Raffles no sistema com as informações fornecidas.',
    })
    @ApiResponse({
        status: 201,
        description: 'O Raffles foi criado com sucesso.',
        type: RafflesQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'Raffles já existe' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async create(@Body() dto: RafflesPersistDTO): Promise<RafflesQueryDTO> {
        try {
            return await this.rafflesService.create(dto);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Raffles já existe');
            }
            console.log(error.message);
            throw new InternalServerErrorException('Erro ao criar Raffles');
        }
    }

    @Get(':external_id')
    @ApiOperation({
        summary: 'Busca um Raffles pelo External ID.',
        description:
            'Este endpoint busca um Raffles no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O Raffles foi encontrado.',
        type: RafflesQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'Raffles não encontrado' })
    async findByExternalId(
        @Param('external_id') external_id: string
    ): Promise<RafflesQueryDTO> {
        try {
            return await this.rafflesService.findByExternalId(external_id);
        } catch (error) {
            throw new NotFoundException('Raffles não encontrado');
        }
    }

    @Get()
    @ApiExcludeEndpoint()
    @ApiOperation({
        summary: 'Busca todos os Raffless.',
        description:
            'Este endpoint busca todos os Raffless cadastrados no sistema.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de Raffless.',
        type: [RafflesQueryDTO],
    })
    async findAll(): Promise<RafflesQueryDTO[]> {
        return await this.rafflesService.findAll();
    }

    @Put(':external_id')
    @ApiExcludeEndpoint()
    @ApiOperation({
        summary: 'Atualiza um Raffles pelo External ID.',
        description:
            'Este endpoint atualiza os detalhes de um Raffles no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O Raffles foi atualizado com sucesso.',
        type: RafflesQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Raffles não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async updateByExternalId(
        @Param('external_id') external_id: string,
        @Body() dto: RafflesPersistDTO
    ): Promise<RafflesQueryDTO> {
        try {
            return await this.rafflesService.updateByExternalId(
                external_id,
                dto
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Raffles não encontrado');
            }
            throw new InternalServerErrorException('Erro ao atualizar Raffles');
        }
    }

    @Delete(':external_id')
    @ApiExcludeEndpoint()
    @ApiOperation({
        summary: 'Deleta um Raffles pelo External ID.',
        description:
            'Este endpoint deleta um Raffles no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 204,
        description: 'O Raffles foi deletado com sucesso.',
    })
    @ApiResponse({ status: 404, description: 'Raffles não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async deleteByExternalId(
        @Param('external_id') external_id: string
    ): Promise<void> {
        try {
            await this.rafflesService.deleteByExternalId(external_id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Raffles não encontrado');
            }
            throw new InternalServerErrorException('Erro ao deletar Raffles');
        }
    }
}
