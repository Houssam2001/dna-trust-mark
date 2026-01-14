import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCertifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const certifications = await prisma.certification.findMany({
            where: { isActive: true },
            include: { establishment: true },
        });
        res.json(certifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
