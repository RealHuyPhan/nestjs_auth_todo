import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(userData: Partial<User>): Promise<User> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).select('-password').exec();
    }
}
