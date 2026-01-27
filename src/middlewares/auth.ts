import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: UserRole;
                emailVerified: boolean;
            };
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as Record<string, string>,
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!",
                });
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verify your email!",
                });
            }

            const role = session.user.role as UserRole | undefined;

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "User role not assigned. Contact support.",
                });
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role,
                emailVerified: session.user.emailVerified,
            };

            if (roles.length && !roles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resource!",
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;
