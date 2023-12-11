import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    profile: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    lastLogin: {
        type: Number,
        required: true,
        unique: false,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    sharedTugas: {
        type: [String],  // Array of strings
        required: false, // Modify as needed
        unique: false,
        default: []      // Default value is an empty array
    }
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;