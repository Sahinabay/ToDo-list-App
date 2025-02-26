import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./tasks.entity"; 
import { TasksService } from "./tasks.service"; 
import { TaskController } from "./tasks.controller";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [
  TypeOrmModule.forFeature([Task]),
  AuthModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn:"1h"},
  }),
  ], 
  controllers: [TaskController], 
  providers: [TasksService], 
  exports: [TasksService], 
})
export class TasksModule {}
