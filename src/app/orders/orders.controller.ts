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
import { OrdersService } from './orders.service';
import { OrdersQueryDTO, OrdersPersistDTO } from './orders.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @ApiOperation({
        summary: 'Criação de um novo Orders.',
        description:
            'Este endpoint cria um novo Orders no sistema com as informações fornecidas.',
    })
    @ApiResponse({
        status: 201,
        description: 'O Orders foi criado com sucesso.',
        type: OrdersQueryDTO,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'Orders já existe' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async create(@Body() dto: OrdersPersistDTO): Promise<OrdersQueryDTO> {
        try {
            return await this.ordersService.create(dto);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Orders já existe');
            }
            console.log(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    @Get(':external_id')
    @ApiOperation({
        summary: 'Busca um Orders pelo External ID.',
        description:
            'Este endpoint busca um Orders no sistema pelo External ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'O Orders foi encontrado.',
        type: OrdersQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'Orders não encontrado' })
    async findByExternalId(
        @Param('external_id') external_id: string
    ): Promise<OrdersQueryDTO> {
        try {
            return await this.ordersService.findByExternalId(external_id);
        } catch (error) {
            throw new NotFoundException('Orders não encontrado');
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Busca todos os Orderss.',
        description:
            'Este endpoint busca todos os Orderss cadastrados no sistema.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de Orderss.',
        type: [OrdersQueryDTO],
    })
    async findAll(): Promise<OrdersQueryDTO[]> {
        return await this.ordersService.findAll();
    }

    @Get(':id/approve')
    @ApiOperation({
        summary: 'Aprova uma ordem pelo ID.',
        description: 'Este endpoint aprova uma ordem existente pelo ID fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'A ordem foi aprovada com sucesso.',
        type: OrdersQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'Ordem não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async approveOrder(@Param('id') id: number): Promise<OrdersQueryDTO> {
        try {
            return await this.ordersService.approveOrder(id);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Get(':id/reject')
    @ApiOperation({
        summary: 'Rejeita uma ordem pelo ID.',
        description: 'Este endpoint rejeita uma ordem existente e retorna os números para disponíveis.',
    })
    @ApiResponse({
        status: 200,
        description: 'A ordem foi rejeitada e os números foram disponibilizados novamente.',
        type: OrdersQueryDTO,
    })
    @ApiResponse({ status: 404, description: 'Ordem não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    async rejectOrder(@Param('id') id: number): Promise<OrdersQueryDTO> {
        try {
            return await this.ordersService.rejectOrder(id);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
