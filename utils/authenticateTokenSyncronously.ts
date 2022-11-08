import jwt from 'jsonwebtoken';
import EnvConfig from '../modules/EnvConfig';
import type { NextApiRequest } from "next";

export const authenticateTokenSyncronously = (req: NextApiRequest) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return false;
    return jwt.verify(token, EnvConfig.getJwtAccessToken());
}