import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { TodoService } from "./todos.service";
import { CreateTodoDto, UpdateTodoDto } from "src/auth/dto/todo.dto";
import { Request } from "express";
import { User } from "src/users/schemas/user.schema";

interface RequestWithUser extends Request {
  user: User;
}

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    return this.todosService.createTodo(createTodoDto, userId);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    return this.todosService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id.toString();
    return this.todosService.remove(id, userId);
  }
}