import { prisma } from "../../lib/prisma";

export const upsertTutorProfile = async (userId: string, data: any) => {
  const { bio, hourlyRate, experience, languages, categories } = data;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    throw new Error("At least one category must be provided");
  }

  // 1️⃣ Normalize category names (trim + lowercase)
  const normalizedNames = categories.map((c: string) => c.trim().toLowerCase());

  // 2️⃣ Fetch category records (case-insensitive)
  const categoryRecords = await prisma.category.findMany({
    where: {
      OR: normalizedNames.map((name) => ({
        name: { equals: name, mode: "insensitive" },
      })),
    },
  });

  // 3️⃣ Check for missing categories
  if (categoryRecords.length !== categories.length) {
    const foundNames = categoryRecords.map((c) => c.name.toLowerCase());
    const missing = normalizedNames.filter((n) => !foundNames.includes(n));
    throw new Error(`One or more categories not found: ${missing.join(", ")}`);
  }

  // 4️⃣ Upsert tutor profile
  const profile = await prisma.tutorProfile.upsert({
    where: { userId },
   update: {
  bio,
  hourlyRate,
  experience,
  languages,
  categories: {
    deleteMany: {},
    create: categoryRecords.map((cat) => ({
      category: { connect: { id: cat.id } },
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
        create: categoryRecords.map((cat) => ({
          category: { connect: { id: cat.id } }, // same nested object here
        })),
      },
    },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  return profile;
};

export const updateAvailability = async (userId: string, availability: any[]) => {
  const tutor = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (!tutor) throw new Error("Tutor profile not found");

  // Remove old availability
  await prisma.availability.deleteMany({ where: { tutorId: tutor.id } });

  if (!availability || availability.length === 0) return [];

  // Insert new availability
  return prisma.availability.createMany({
    data: availability.map((slot) => ({
      tutorId: tutor.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });
};


// 🔹 GET /api/tutors (with filters)
export const fetchAllTutors = async (query: any) => {
  const { category, minPrice, maxPrice, minRating } = query;

  // Normalize category (handle string[] | undefined)
  const categoryFilter =
    Array.isArray(category) ? category[0] : category;

  // Build hourlyRate filter dynamically
  const hourlyRateFilter: any = {};
  if (minPrice !== undefined) hourlyRateFilter.gte = Number(minPrice);
  if (maxPrice !== undefined) hourlyRateFilter.lte = Number(maxPrice);

  // Build rating filter dynamically
  const ratingFilter: any = {};
  if (minRating !== undefined) ratingFilter.gte = Number(minRating);

  return prisma.tutorProfile.findMany({
    where: {
      ...(Object.keys(hourlyRateFilter).length && { hourlyRate: hourlyRateFilter }),
      ...(Object.keys(ratingFilter).length && { rating: ratingFilter }),
      ...(categoryFilter && {
        categories: {
          some: {
            category: { name: categoryFilter },
          },
        },
      }),
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      categories: { include: { category: true } },
    },
  });
};


export const fetchTutorById = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true, email: true },
      },
      categories: {
        include: { category: true },
      },
      availability: true,
      reviews: {
        include: {
          student: {
            select: { name: true, avatarUrl: true },
          },
        },
      },
    },
  });
};
