import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { RafflesEntity } from './raffles';

@Entity('raffle_numbers')
export class RaffleNumbersEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    @ApiProperty({ description: 'ID único do número da rifa' })
    id: number;

    @Column({ type: 'int' })
    @ApiProperty({ description: 'Número da rifa' })
    number: number;

    @Column({ type: 'varchar', default: 'available' })
    @ApiProperty({ description: 'Status do número da rifa', nullable: true })
    status: string;

    @Column({ type: 'uuid', default: () => 'uuid()' })
    @ApiProperty({ description: 'ID externo para o número da rifa', nullable: true })
    external_id: string;

    @CreateDateColumn()
    @ApiProperty({ description: 'Data de criação do número', nullable: true })
    created_at: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: 'Data de atualização do número', nullable: true })
    updated_at: Date;

    // Relacionamento com RafflesEntity (Vários números pertencem a uma rifa)
    @ManyToOne(() => RafflesEntity, (raffle) => raffle.raffleNumbers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'raffle_id' }) // Nome claro para a chave estrangeira
    @ApiProperty({ description: 'Relacionamento com a rifa.' })
    raffle: RafflesEntity;

    toString() {
        return `${this.external_id} - ${this.number}`;
    }
}
