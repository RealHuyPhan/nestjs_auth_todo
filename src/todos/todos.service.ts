import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { i18nValidationMessage } from "nestjs-i18n";
import { CreateTodoDto, UpdateTodoDto } from "src/auth/dto/todo.dto";
import { Todo } from "src/users/schemas/todo.schema";

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
    

    async createTodo(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
        const newTodo = new this.todoModel({
            ...createTodoDto,
            userId: userId
        });
        return newTodo.save();
    }

    async findAll(userId: string): Promise<Todo[]>{
        return this.todoModel.find({userId}).exec();
    }

    async findOne(id: string, userId: string): Promise<Todo>{
        const todo = await this.todoModel.findOne({_id: id, userId}).exec();
        if(!todo){
            throw new NotFoundException(i18nValidationMessage("todoMessage.todo.todoNotFound"))
        }
        return todo;
    }

   async update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const updatedTodo = await this.todoModel
      .findOneAndUpdate({ _id: id, userId }, updateTodoDto, { new: true })
      .exec();
    if (!updatedTodo) {
      throw new NotFoundException(i18nValidationMessage("todoMessage.todo.todoNotFound"));
    }
    return updatedTodo;
  }
    async remove(id: string, userId: string) {
        const result = await this.todoModel.deleteOne({ _id: id, userId }).exec();
        if (result.deletedCount === 0) {
        throw new NotFoundException(i18nValidationMessage("todoMessage.todo.todoNotFound"));
        }
        return { message: i18nValidationMessage("todoMessage.todo.todoRemoved") };
  }
   
}