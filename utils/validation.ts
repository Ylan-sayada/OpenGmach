import { validationResult } from 'express-validator';
import type { NextApiRequest, NextApiResponse } from "next";

export const validationMiddleware = (req: NextApiRequest, res: NextApiResponse) => {
    const errors = validationResult(req);
    return errors.isEmpty() ? true : res.status(400).json({ errors: errors.array() });
}