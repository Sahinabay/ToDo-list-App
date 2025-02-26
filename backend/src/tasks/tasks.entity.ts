import { Entity , PrimaryGeneratedColumn, Column,ManyToOne} from "typeorm";

import { User } from "src/auth/user.entity";


@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title:string;

    @Column({default:false})
    completed:boolean;

    @ManyToOne(()=> User , (user)=> user.tasks, {onDelete:"CASCADE"})
    user:User;


}