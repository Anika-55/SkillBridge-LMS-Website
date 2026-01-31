import { prisma } from "../../lib/prisma";


// Get all users (students + tutors)
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Ban or unban user
export const updateUserStatus = async (userId: string, status: "ACTIVE" | "BANNED") => {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

// Get all bookings in system
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: { select: { id: true, name: true, email: true } },
      tutor: { select: { id: true, name: true, email: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Create a new category
export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};

// Delete category
export const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
