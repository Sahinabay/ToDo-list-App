import { Controller, Get, Post, Body, UseGuards, Req, Put, Delete, Param, Patch } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AuthGuard } from "../auth/auth.guard"; // ✅ `src/auth/auth.guard` yerine doğru import edildi
import { User } from "src/auth/user.entity";
import { register } from "module";

@Controller("tasks")
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private readonly tasksService: TasksService) {} // ✅ Hata düzeltildi

    @Get()
    async getTasks(@Req() req) {
        console.log("📝 Kullanıcının Görevleri Alınıyor:", req.user.id);
        return await this.tasksService.getAllTasks({id: req.user.id} as User); // ✅ req.user.id yerine req.user
    }
    
    @Post()
    async createTask(@Req() req, @Body() body: { title: string }) {
        console.log("📌 Yeni Görev Ekleniyor:", body.title);
        return await this.tasksService.createTask(body.title, req.user);
    }
    @Put(":id")
    async updateTask(@Req() req ,@Param("id") id:number, @Body() body: {completed:boolean}){
        return await this.tasksService.updateTask(id,body.completed, req.user);
    }
    @Delete(":id")
    async deleteTask(@Req() req,@Param("id") id: number){
        return await this.tasksService.deleteTask(id, req.user);
    }
    @Patch(":id")
    async arrangeTask(@Req() req, @Param("id") id:number, @Body() body:{title?:string, completed?:boolean}){
        console.log("Görev yeniden düzenlendi! ");
        return await this.tasksService.arrangeTask(id, body, req.user);
    }

}
