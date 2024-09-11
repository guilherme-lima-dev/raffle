import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    JoinColumn,
    ManyToOne, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { RafflesEntity } from './raffles';
import {RaffleNumbersEntity} from "@app/entities/raffle_numbers";
import {OrderNumbersEntity} from "@app/entities/order_numbers";

@Entity('orders')
export class OrdersEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    @ApiProperty({ description: '' })
    id: number;

    @Column({ type: 'varchar'})
    @ApiProperty({ description: '' })
    customer_name: string;

    @Column({ type: 'varchar', default: 'NULL'})
    @ApiProperty({ description: '', nullable: true })
    customer_phone: string;

    @Column({ type: 'varchar', default: "pending"})
    @ApiProperty({ description: '', nullable: true })
    status: string;

    @Column({ type: 'timestamp', default: 'current_timestamp()' })
    @ApiProperty({ description: '', nullable: true })
    order_date: any;

    @Column({ type: 'uuid', default: 'uuid()'})
    @ApiProperty({ description: '', nullable: true })
    external_id: string;

    @CreateDateColumn()
    @ApiProperty({ description: '', nullable: true })
    created_at: any;

    @UpdateDateColumn()
    @ApiProperty({ description: '', nullable: true })
    updated_at: any;

    @ManyToOne(() => RafflesEntity)
    @JoinColumn({ name: 'raffle_id' })
    @ApiProperty({ description: 'Relacionamento com raffles.' })
    raffle: RafflesEntity;

    @OneToMany(() => OrderNumbersEntity, (orderNumber) => orderNumber.order)
    @ApiProperty({ description: 'Números associados à rifa', type: () => OrderNumbersEntity })
    orderNumbers: OrderNumbersEntity[];

    toString() {
        return `${this.external_id} - ${this.customer_name}`;
    }
}
