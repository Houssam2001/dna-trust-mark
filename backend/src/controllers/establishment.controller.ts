import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';

const establishmentSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['boucherie', 'restaurant', 'usine', 'traiteur', 'autre']),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    siret: z.string().optional(),
});

export const getEstablishments = async (req: Request, res: Response): Promise<void> => {
    try {
        const establishments = await prisma.establishment.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(establishments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createEstablishment = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = establishmentSchema.parse(req.body);
        // Generate simplified ADNGUARD code (example logic)
        const adnguardCode = `ADN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const establishment = await prisma.establishment.create({
            data: {
                ...data,
                adnguardCode,
                status: 'en_attente',
            },
        });
        res.status(201).json(establishment);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to create establishment' });
    }
};

export const updateEstablishment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const { status } = req.body;

        // Update establishment
        const establishment = await prisma.establishment.update({
            where: { id: id as string },
            data: req.body,
        });

        // If status changed to 'conforme', automatically create a certification
        if (status === 'conforme') {
            // Check if active certification exists
            const activeCert = await prisma.certification.findFirst({
                where: { establishmentId: id as string, isActive: true }
            });

            if (!activeCert) {
                const validFrom = new Date();
                const validUntil = new Date();
                validUntil.setFullYear(validUntil.getFullYear() + 1);

                const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
                const qrCodeUrl = `${clientUrl}/verification?code=${establishment.adnguardCode}`;

                await prisma.certification.create({
                    data: {
                        establishmentId: id as string,
                        validFrom,
                        validUntil,
                        qrCode: qrCodeUrl,
                        isActive: true
                    }
                });
            }
        }

        res.json(establishment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const requestEstablishment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, type, address, city, postal_code, phone, email, siret } = req.body;

        const establishment = await prisma.establishment.create({
            data: {
                name,
                type,
                address,
                city,
                postalCode: postal_code,
                phone,
                email,
                siret,
                status: 'en_attente',
                adnguardCode: `REQ-${Date.now().toString().slice(-6)}`, // Temp code
            }
        });

        res.status(201).json(establishment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyEstablishment = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;
    try {
        const establishment = await prisma.establishment.findFirst({
            where: { adnguardCode: code as string },
            include: {
                controls: {
                    orderBy: { controlDate: 'desc' },
                }
            }
        });

        if (!establishment) {
            res.status(404).json({ message: 'Establishment not found' });
            return;
        }

        // Log verifications
        await prisma.qrVerification.create({
            data: {
                establishmentId: establishment.id,
                userAgent: req.headers['user-agent'] || 'unknown',
                ipAddress: req.ip || 'unknown'
            }
        });

        res.json(establishment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEstablishment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await prisma.establishment.delete({ where: { id: id as string } });
        res.json({ message: 'Establishment deleted' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
