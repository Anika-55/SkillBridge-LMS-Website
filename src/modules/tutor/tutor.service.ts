import { prisma } from "../../lib/prisma";

export const upsertTutorProfile = async (userId: string, data: any) => {
  const { bio, hourlyRate, experience, languages, categories } = data;

  // ✅ Check categories exist
  const foundCategories = await prisma.category.findMany({
    where: { id: { in: categories } },
    select: { id: true },
  });

  if (foundCategories.length !== categories.length) {
    throw new Error("One or more categories are invalid");
  }

  const profile = await prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio,
      hourlyRate,
      experience,
      languages,
      categories: {
        deleteMany: {},
        create: categories.map((catId: string) => ({
          category: { connect: { id: catId } },
        })),
      },
    },
    create: {
      userId,
      bio,
      hourlyRate,
      experience,
      languages,
      categories: {
        create: categories.map((catId: string) => ({
          category: { connect: { id: catId } },
        })),
      },
    },
  });

  return profile;
};

export const updateAvailability = async (userId: string, availability: any[]) => {
  const tutor = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw new Error("Tutor profile not found");

  await prisma.availability.deleteMany({ where: { tutorId: tutor.id } });

  return prisma.availability.createMany({
    data: availability.map((slot) => ({
      tutorId: tutor.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });
};