import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "./tasks.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService{
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository:Repository<Task>
    ){}


    async createTask(title: string , user:User): Promise <Task>
{
    const task= this.tasksRepository.create({title, completed:false,user:{id: user.id}});
    return await this.tasksRepository.save(task);
} 


async getAllTasks(user:User): Promise<Task[]>{
        return this.tasksRepository.find({where:{user: {id:user.id}},
            relations:["user"],
        });
    }
    async getTaskByUser(user:User):Promise<Task[]>{
        return await this.tasksRepository.find({where:{user},});
    }
    async updateTask (id: number, completed: boolean, user: User): Promise<Task>{
        const task= await this.tasksRepository.findOne({where: {id,user:{id: user.id}}});
        if(!task) throw new Error(`Görev bulunamadı! ID: ${id} ` );
        task.completed=completed;
        return await this.tasksRepository.save(task);

    }
    async deleteTask(id: number, user:User):Promise<void>{
        const task= await this.tasksRepository.findOne({where:{id,user:{id:user.id}}})
        
        if(!task){
            throw new NotFoundException("silinecek görev bulunamadı");
        }
        await this.tasksRepository.remove(task);
    }
    
    async arrangeTask(id:number, updateData:{title?:string, completed?:boolean}, user:User): Promise <Task>{
        const task= await this.tasksRepository.findOne({where: {id,user:{id:user.id}}});
        if(!task) throw new Error(`Görev bulunamadı! ID: ${id}`);

        if(updateData.title!==undefined){
            task.title=updateData.title;
        }
        if(updateData.completed!==undefined){
            task.completed=updateData.completed;
        }
        return await this.tasksRepository.save(task);
    }
    



}
