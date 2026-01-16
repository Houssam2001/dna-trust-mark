import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'agent', 'owner']).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, phone, role } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                profile: {
                    create: {
                        fullName,
                        phone,
                    },
                },
                roles: role ? {
                    create: {
                        role: role as any, // Cast to any or AppRole to avoid strict typing issues if enum isn't perfectly synced yet
                    }
                } : undefined,
            },
            include: {
                profile: true,
                roles: true,
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // @ts-ignore - Prisma types sometimes struggle with includes in automatic inference for response
        res.status(201).json({ token, user: { id: user.id, email: user.email, profile: user.profile, roles: user.roles } });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true, roles: true },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, email: user.email, profile: user.profile, roles: user.roles } });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Login failed' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore - user is attached by middleware
    const userId = req.user?.userId;

    if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, roles: true },
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.json({ user: { id: user.id, email: user.email, profile: user.profile, roles: user.roles } });
};
