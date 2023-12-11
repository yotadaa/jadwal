// utils/auth.js
import { verify } from 'jsonwebtoken';

export const verifyToken = (token) => {
    try {
        // Replace 'your-secret-key' with your actual secret key used for signing the token
        const decoded = verify(token, 'your-secret-key');

        // 'decoded' now contains the payload of the JWT
        return decoded;
    } catch (error) {
        // Handle token verification errors (e.g., expired token, invalid signature)
        console.error('Token verification failed:', error.message);
        return null;
    }
};
