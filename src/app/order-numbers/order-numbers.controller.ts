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
import { OrderNumbersService } from './order-numbers.service';
import {
    OrderNumbersQueryDTO,
    OrderNumbersPersistDTO,
} from './order-numbers.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('order-numbers')
@Controller('order-numbers')
export class OrderNumbersController {
    constructor(private readonly orderNumbersService: OrderNumbersService) {}

    @Post()
    @ApiOperation({
        summary: 'Criação de um novo OrderNumbers.',
        description:
            'Este endpoint cria um novo OrderNumbers no sistema com as informações fornecidas.',
    })
    @ApiResponse({
        status: 201,
        description: 'O OrderNumbers foi criado com sucesso.',
        type: OrderNumbersQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'OrderNumbers já existe' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async create(
        @Body() dto: OrderNumbersPersistDTO
    ): Promise<OrderNumbersQueryDTO> {
        try {
            return await this.orderNumbersService.create(dto);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('OrderNumbers já existe');
            }
            throw new InternalServerErrorException(
                'Erro ao criar OrderNumbers'
            );
        }
    }

    @Get(':external_id')
    
    @ApiOperation({
        summary: 'Busca um OrderNumbers pelo External ID.',
        description:
            'Este endpoint busca um OrderNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O OrderNumbers foi encontrado.',
        type: OrderNumbersQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'OrderNumbers não encontrado' })
    async findByExternalId(
        @Param('external_id') external_id: string
    ): Promise<OrderNumbersQueryDTO> {
        try {
            return await this.orderNumbersService.findByExternalId(external_id);
        } catch (error) {
            throw new NotFoundException('OrderNumbers não encontrado');
        }
    }

    @Get()
    
    @ApiOperation({
        summary: 'Busca todos os OrderNumberss.',
        description:
            'Este endpoint busca todos os OrderNumberss cadastrados no sistema.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de OrderNumberss.',
        type: [OrderNumbersQueryDTO],
    })
    async findAll(): Promise<OrderNumbersQueryDTO[]> {
        return await this.orderNumbersService.findAll();
    }

    @Put(':external_id')
    
    @ApiOperation({
        summary: 'Atualiza um OrderNumbers pelo External ID.',
        description:
            'Este endpoint atualiza os detalhes de um OrderNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O OrderNumbers foi atualizado com sucesso.',
        type: OrderNumbersQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'OrderNumbers não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async updateByExternalId(
        @Param('external_id') external_id: string,
        @Body() dto: OrderNumbersPersistDTO
    ): Promise<OrderNumbersQueryDTO> {
        try {
            return await this.orderNumbersService.updateByExternalId(
                external_id,
                dto
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('OrderNumbers não encontrado');
            }
            throw new InternalServerErrorException(
                'Erro ao atualizar OrderNumbers'
            );
        }
    }

    @Delete(':external_id')
    
    @ApiOperation({
        summary: 'Deleta um OrderNumbers pelo External ID.',
        description:
            'Este endpoint deleta um OrderNumbers no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 204,
        description: 'O OrderNumbers foi deletado com sucesso.',
    })
    @ApiResponse({ status: 404, description: 'OrderNumbers não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async deleteByExternalId(
        @Param('external_id') external_id: string
    ): Promise<void> {
        try {
            await this.orderNumbersService.deleteByExternalId(external_id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('OrderNumbers não encontrado');
            }
            throw new InternalServerErrorException(
                'Erro ao deletar OrderNumbers'
            );
        }
    }
}
