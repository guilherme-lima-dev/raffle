import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { OrdersEntity } from './orders';
import { RaffleNumbersEntity } from './raffle_numbers';

@Entity('order_numbers')
export class OrderNumbersEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    @ApiProperty({ description: '' })
    id: number;

    @Column({ type: 'char', default: 'uuid()'})
    @ApiProperty({ description: '', nullable: true })
    external_id: string;

    @CreateDateColumn()
    @ApiProperty({ description: '', nullable: true })
    created_at: any;

    @UpdateDateColumn()
    @ApiProperty({ description: '', nullable: true })
    updated_at: any;

    @ManyToOne(() => OrdersEntity)
    @JoinColumn({ name: 'order_id' })
    @ApiProperty({ description: 'Relacionamento com orders.' })
    order: OrdersEntity;

    @ManyToOne(() => RaffleNumbersEntity)
    @JoinColumn({ name: 'number_id' })
    @ApiProperty({ description: 'Relacionamento com raffle_numbers.' })
    number: RaffleNumbersEntity;

    toString() {
        return `${this.external_id} - ${this.order}`;
    }
}
