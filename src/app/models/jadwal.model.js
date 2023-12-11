import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const jadwalSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    judul: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    hari: {
        type: Number,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    mulai: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    selesai: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    lokasi: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    repeat: {
        type: Number,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    deskripsi: {
        type: String,
        required: true,
        unique: false,
        trim: false,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1
    },
    favorite: {
        type: Boolean,
        required: true,
        unique: false,
    }
}, {
    timestamps: true,
});

const Jadwal = mongoose.models.Jadwal || mongoose.model('Jadwal', jadwalSchema);

export default Jadwal;