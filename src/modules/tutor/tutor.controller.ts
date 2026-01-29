import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as tutorService from "./tutor.service";


export const updateTutorProfile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const profile = await tutorService.upsertTutorProfile(req.user!.id, req.body);
    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTutorAvailability = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await tutorService.updateAvailability(req.user!.id, req.body.availability);
    res.json({ success: true, message: "Availability updated" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutors = await tutorService.fetchAllTutors(req.query);
    res.json({success:true, data:tutors})
  } catch (error) {
    next(error)
  }
}

export const getTutorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

    const tutor = await tutorService.fetchTutorById(id);

    if (!tutor) {
      return res.status(404).json({ success: false, message: "Tutor not found" });
    }

    res.json({ success: true, data: tutor });
  } catch (err) {
    next(err);
  }
};
