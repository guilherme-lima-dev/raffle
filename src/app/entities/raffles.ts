import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';
import { RaffleNumbersEntity } from './raffle_numbers'; // Certifique-se de importar corretamente

@Entity('raffles')
export class RafflesEntity {

    @PrimaryGeneratedColumn({ type: 'int' })
    @ApiProperty({ description: 'ID único da rifa' })
    id: number;

    @Column({ type: 'varchar' })
    @ApiProperty({ description: 'Nome da rifa' })
    name: string;

    @Column({ type: 'text', nullable: true })
    @ApiProperty({ description: 'Descrição da rifa', nullable: true })
    description: string;

    @Column({ type: 'decimal' })
    @ApiProperty({ description: 'Preço da rifa' })
    price: number;

    @Column({ type: 'int' })
    @ApiProperty({ description: 'Total de números disponíveis na rifa' })
    total_numbers: number;

    @Column({ type: 'varchar', default: 'active' })
    @ApiProperty({ description: 'Status da rifa', nullable: true })
    status: string;

    @CreateDateColumn()
    @ApiProperty({ description: 'Data de criação da rifa', nullable: true })
    created_at: Date;

    @Column({ type: 'uuid', default: () => 'uuid()' })
    @ApiProperty({ description: 'ID externo da rifa', nullable: true })
    external_id: string;

    @UpdateDateColumn()
    @ApiProperty({ description: 'Data de última atualização', nullable: true })
    updated_at: Date;

    // Relacionamento com RaffleNumbersEntity (Uma rifa tem vários números)
    @OneToMany(() => RaffleNumbersEntity, (raffleNumber) => raffleNumber.raffle)
    @ApiProperty({ description: 'Números associados à rifa', type: () => RaffleNumbersEntity })
    raffleNumbers: RaffleNumbersEntity[];

    toString() {
        return `${this.external_id} - ${this.name}`;
    }
}
