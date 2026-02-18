import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        max: 50
    },
    last_name: {
        type: String,
        required: true,
        minLength: [3, 'Minimum 3 characters'],
        maxLength: [50, 'Maximum 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    age: {
        type: Number,
        min: [0, 'Age must be positive'],
        max: [100, 'Age seems invalid']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Minimum 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    tone: {
        type: String,
        required: true,
        maxlength: 10
    },
})

export const UserModel = model('users', userSchema);
