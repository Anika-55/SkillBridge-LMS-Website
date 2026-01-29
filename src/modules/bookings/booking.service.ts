import { prisma } from "../../lib/prisma";

// Create a booking
export const createBooking = async (data: {
  studentId: string;
  tutorId: string;
  categoryId: string;
  sessionAt: Date;
  duration: number;
  price: number;
}) => {
  // Optional: check if tutor exists
  const tutor = await prisma.tutorProfile.findUnique({ where: { userId: data.tutorId } });
  if (!tutor) throw new Error("Tutor not found");

  // Optional: check if category is valid for this tutor
  const hasCategory = await prisma.tutorCategory.findFirst({
    where: { tutorId: data.tutorId, categoryId: data.categoryId },
  });
  if (!hasCategory) throw new Error("Tutor does not teach this category");

  return prisma.booking.create({
    data: {
      studentId: data.studentId,
      tutorId: data.tutorId,
      categoryId: data.categoryId,
      sessionAt: data.sessionAt,
      duration: data.duration,
      price: data.price,
      status: "PENDING",
    },
    include: {
      student: { select: { id: true, name: true } },
      tutor: { select: { id: true, name: true } },
      category: true,
    },
  });
};

// Get all bookings for a user (student or tutor)
export const getBookingsByUser = async (userId: string) => {
  return prisma.booking.findMany({
    where: {
      OR: [{ studentId: userId }, { tutorId: userId }],
    },
    include: {
      student: { select: { id: true, name: true } },
      tutor: { select: { id: true, name: true } },
      category: true,
    },
    orderBy: { sessionAt: "desc" },
  });
};

// Get a single booking by ID
export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true } },
      tutor: { select: { id: true, name: true } },
      category: true,
    },
  });
};