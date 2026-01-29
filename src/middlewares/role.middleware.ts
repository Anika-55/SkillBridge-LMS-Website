import { NextFunction, Request, Response } from "express";
import { UserRole } from "./auth";



export const authorizeRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:"Unauthorized",
            })
        }
        if (!allowedRoles.includes(req.user.role as UserRole)) {
            return res.status(403).json({
                success: false,
                message:"Forbidden: You don't have permission to access this resource"
            })
        }
        next()
    }
}