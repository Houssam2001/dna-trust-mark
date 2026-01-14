import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';

const controlSchema = z.object({
    establishmentId: z.string().uuid(),
    result: z.enum(['conforme', 'non_conforme', 'en_attente', 'suspendu']),
    speciesAnalyzed: z.array(z.string()).optional(),
    speciesDetected: z.array(z.string()).optional(),
    anomaliesDetected: z.string().optional(),
    notes: z.string().optional(),
});

export const getControls = async (req: Request, res: Response): Promise<void> => {
    try {
        const controls = await prisma.control.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                establishment: true,
            }
        });
        res.json(controls);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createControl = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = controlSchema.parse(req.body);
        // @ts-ignore
        const agentId = req.user?.userId;

        const control = await prisma.control.create({
            data: {
                ...data,
                agentId,
            },
        });

        // Update establishment Status based on result if needed (business logic)
        // For simplicity, we just save the control

        res.status(201).json(control);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to create control' });
    }
};
