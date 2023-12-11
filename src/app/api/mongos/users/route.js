import { NextResponse } from "next/server";
import { connectDB } from '../connectDB';
import bcrypt from 'bcrypt';
import User from '../../../models/user.model';
import { setCookie } from 'cookie';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function getCurrentTimeInSeconds() {
    const currentDate = new Date();
    const currentTimestampInSeconds = Math.floor(currentDate.getTime() / 1000);
    return currentTimestampInSeconds;
}

function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    while (result.length < length) {
        const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));

        // Ensure the character is unique in the result
        if (result.indexOf(randomChar) === -1) {
            result += randomChar;
        }
    }

    return result;
}

export async function POST(req) {
    const date = new Date();
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
    const expires = '1y';
    try {
        await connectDB();
        const requestBody = await req.json();
        const { todo } = requestBody;

        if (todo === "login") {
            const { email, password } = requestBody;
            const user = await User.findOne({ email });

            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    console.log('Password tidak valid')
                    return NextResponse.json({ err: 'Password tidak valid' });
                } else {
                    console.log("success");
                    user.lastLogin = getCurrentTimeInSeconds();
                    await user.save();
                    const secretKey = crypto.randomBytes(64).toString('hex');
                    const token = jwt.sign(Object.assign({}, user), secretKey, {
                        expiresIn: expires, // Set the expiration time for the token (e.g., 1 hour)
                    });
                    return NextResponse.json({ success: true, token: token, user: user });
                    // return NextResponse.json({ err: 'Password valid' });
                }
            } else {
                console.log('Akun tidak ditemukan');
                return NextResponse.json({ success: false, err: 'Akun tidak ditemukan' });
            }
        } else if (todo === "daftar") {
            const { email, password, username } = requestBody;

            const user = await User.findOne({ email })
            if (user) {
                return NextResponse.json({ success: false, err: 'Email sudah ada' });
            }

            const profile = 'male1';
            const lastLogin = getCurrentTimeInSeconds();
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            var uniqueId = generateRandomString(30);

            const newUser = new User({
                firstName: username,
                lastName: "lastName",
                password: hashedPassword,
                profile: profile,
                lastLogin: lastLogin,
                uniqueId: uniqueId,
                sharedTugas: [],
                email: email
            });

            try {
                await newUser.save();
                return NextResponse.json({ success: true, err: "" });
            } catch (err) {
                console.log(err["_message"]);
                return NextResponse.json({ success: false, err: err["_message"] });
            }
        } else if (todo === 'ganti-password') {
            const { email, password, passwordLama } = requestBody;
            const user = await User.findOne({ email })
            if (user) {
                const saltRounds = 10;
                const passwordMatch = await bcrypt.compare(passwordLama, user.password);
                const isPasswordStillSame = await bcrypt.compare(password, user.password);
                if (isPasswordStillSame) {
                    return NextResponse.json({ success: false, err: "Password masih sama!" });
                }
                if (passwordMatch) {
                    user.password = await bcrypt.hash(password, saltRounds);
                    try {
                        await user.save();
                        return NextResponse.json({ success: true });
                    } catch (err) {
                        console.log(err["_message"]);
                        return NextResponse.json({ success: false, err: "Gagal mengganti password" });
                    }
                }
            }
            console.log('sampai sini')
            return NextResponse.json({ success: false, err: "Gagal mengganti password" });
        } else if (todo === 'ganti-nama') {
            const { email, username } = requestBody;
            const user = await User.findOne({ email })
            if (user) {
                user.firstName = username;
                try {
                    await user.save();
                    return NextResponse.json({ success: true });
                } catch (err) {
                    console.log(err["_message"]);
                    return NextResponse.json({ success: false, err: err["_message"] });
                }
            }
            return NextResponse.json({ success: false });
        } else if (todo === "relog") {
            const { email, password } = requestBody;
            const user = await User.findOne({ email });

            if (user) {
                const passwordMatch = password === user.password;
                if (!passwordMatch) {
                    console.log('Password tidak valid')
                    return NextResponse.json({ err: 'Password tidak valid' });
                } else {
                    console.log("success");
                    user.lastLogin = getCurrentTimeInSeconds();
                    await user.save();
                    const secretKey = crypto.randomBytes(64).toString('hex');
                    const token = jwt.sign(Object.assign({}, user), secretKey, {
                        expiresIn: expires, // Set the expiration time for the token (e.g., 1 hour)
                    });
                    return NextResponse.json({ success: true, token: token, user: user });
                    // return NextResponse.json({ err: 'Password valid' });
                }
            } else {
                console.log('Akun tidak ditemukan');
                return NextResponse.json({ success: false, err: 'Akun tidak ditemukan' });
            }
        } else if (todo === "ganti-profile") {
            console.log("backend mengganti profile")
            const { email, profile } = requestBody;
            const user = await User.findOne({ email });

            if (user) {
                user.profile = profile;
                try {
                    await user.save();
                    return NextResponse.json({ success: true });
                } catch (err) {
                    console.log(err["_message"]);
                    return NextResponse.json({ success: false, err: "Gagal mengganti profil" });
                }
            }

            return NextResponse.json({ success: false, err: "Gagal mengganti profil" });
        }


    } catch (error) {
        console.log("unexpected error " + error);
        return NextResponse.json({ error: error });
    }

}
