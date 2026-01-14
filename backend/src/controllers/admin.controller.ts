import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { CertificationStatus } from '@prisma/client';

// User Management

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            include: {
                profile: true,
                roles: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Map to simpler structure if needed, or return as is
        // Return structure matching frontend expectation: { ...profile, roles: ['admin', ...] }
        const mappedUsers = users.map(u => ({
            id: u.id,
            user_id: u.id, // For compatibility with frontend
            email: u.email,
            full_name: u.profile?.fullName,
            created_at: u.createdAt,
            roles: u.roles.map(r => r.role),
        }));

        res.json(mappedUsers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addUserRole = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        // Validate role enum
        if (!['admin', 'agent', 'owner'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        // Check if role exists
        const existing = await prisma.userRole.findFirst({
            where: { userId: userId as string, role },
        });

        if (existing) {
            res.status(409).json({ message: 'User already has this role' });
            return;
        }

        await prisma.userRole.create({
            data: { userId: userId as string, role },
        });

        res.json({ message: 'Role added' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const removeUserRole = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.params;

    try {
        // Validate role enum type for Prisma query
        const validRoles = ['admin', 'agent', 'owner'];
        if (!validRoles.includes(role as string)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        await prisma.userRole.deleteMany({
            where: { userId: userId as string, role: role as any },
        });

        res.json({ message: 'Role removed' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Statistics

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Establishments Stats
        const totalEstablishments = await prisma.establishment.count();
        const certifiedEstablishments = await prisma.establishment.count({ where: { status: 'conforme' } });

        // Status Distribution
        const statusGroups = await prisma.establishment.groupBy({
            by: ['status'],
            _count: true,
        });

        const statusCounts: Record<string, number> = {
            conforme: 0,
            non_conforme: 0,
            en_attente: 0,
            suspendu: 0,
        };
        statusGroups.forEach(g => {
            statusCounts[g.status] = g._count;
        });

        const statusDistribution = [
            { name: "Conformes", value: statusCounts.conforme || 0, color: "hsl(152, 69%, 31%)" },
            { name: "Non conformes", value: statusCounts.non_conforme || 0, color: "hsl(0, 84%, 60%)" },
            { name: "En attente", value: statusCounts.en_attente || 0, color: "hsl(43, 96%, 56%)" },
            { name: "Suspendus", value: statusCounts.suspendu || 0, color: "hsl(210, 20%, 45%)" },
        ];

        // 2. Controls Stats
        const totalControls = await prisma.control.count();
        const monthlyControls = await prisma.control.count({
            where: { controlDate: { gte: startOfMonth } },
        });
        const conformeControls = await prisma.control.count({ where: { result: 'conforme' } });
        const complianceRate = totalControls > 0 ? Math.round((conformeControls / totalControls) * 100) : 0;

        // Controls by Month (Last 6 months)
        const controlsByMonth = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthName = date.toLocaleDateString("fr-FR", { month: "short" });
            const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            const count = await prisma.control.count({
                where: { controlDate: { gte: date, lte: monthEnd } }
            });
            const conformeCount = await prisma.control.count({
                where: { controlDate: { gte: date, lte: monthEnd }, result: 'conforme' }
            });

            controlsByMonth.push({
                month: monthLabel,
                controls: count,
                conformes: conformeCount,
            });
        }

        // 3. QR Verifications Stats
        const totalQr = await prisma.qrVerification.count();
        const monthlyQr = await prisma.qrVerification.count({
            where: { verifiedAt: { gte: startOfMonth } }
        });

        // QR by Month
        const qrByMonth = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthName = date.toLocaleDateString("fr-FR", { month: "short" });
            const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            const count = await prisma.qrVerification.count({
                where: { verifiedAt: { gte: date, lte: monthEnd } }
            });

            qrByMonth.push({
                month: monthLabel,
                verifications: count,
            });
        }

        res.json({
            totalEstablishments,
            certifiedEstablishments,
            totalControls,
            monthlyControls,
            complianceRate,
            qrVerifications: totalQr,
            monthlyQrVerifications: monthlyQr,
            statusDistribution,
            controlsByMonth,
            qrByMonth,
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
