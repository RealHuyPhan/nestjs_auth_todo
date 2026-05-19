import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./user.schema";

@Schema({timestamps: true})
export class Todo extends Document {
    @Prop({required: true, trim: true})
    title: string;

    @Prop({trim: true})
    description: string;

    @Prop({default: false})
    isCompleted: boolean;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    userId: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo)