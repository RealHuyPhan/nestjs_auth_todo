import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosController } from './todos.controller';
import { Todo, TodoSchema } from 'src/users/schemas/todo.schema';
import { TodoService } from './todos.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  controllers: [TodosController],
  providers: [TodoService],
})
export class TodosModule {}