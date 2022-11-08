import User from '../data/model/User';
import { compare } from 'bcrypt';
import type { User as UserSchema } from '../types/User';

export const authByDb = async (input: string, field: string, password: string) => {
    let result, isCorrect, user, cleanedUser: any;
    user = await User.findOne({
        [field]: input,
    }).select({
        __v: 0
    });
    if (user && user.activation.isActivated) {
        isCorrect = await compare(password, user.password)
        cleanedUser = { ...user.toObject() };
        delete cleanedUser.password;
        delete cleanedUser.activation;
        result = isCorrect ? cleanedUser as Omit<UserSchema, 'password' | "activation.activationToken"> : undefined;
    }
    return result;
};