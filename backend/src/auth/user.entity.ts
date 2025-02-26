import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from 'typeorm';
import { Task } from "../tasks/tasks.entity";
@Entity({name: 'users'})
export class User  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({unique:true})
    email:string;

    @Column()
    password:string;

    @OneToMany(() => Task , (task)=>task.user, {cascade:true})
    tasks: Task[];
}
