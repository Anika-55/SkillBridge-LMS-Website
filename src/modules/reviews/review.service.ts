import { prisma } from "../../lib/prisma";

export const createReview = async (studentId: string, data: {
    bookingId: string;
    rating: number;
    comment?: string;
}) => {
    const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
    });

    if (!booking) throw new Error("Booking not found");

    if (booking.studentId !== studentId)
        throw new Error("You can only review your own bookings");

    if (booking.status !== "COMPLETED")
        throw new Error("You can only review completed sessions");

    const existingReview = await prisma.review.findUnique({
        where: { bookingId: data.bookingId },
    });

    if (existingReview) throw new Error("Review already exists for this booking")
    
     const review = await prisma.review.create({
    data: {
      bookingId: data.bookingId,
      studentId,
      tutorId: booking.tutorId,
      rating: data.rating,
      comment: data.comment,
    },
     });
    
    // ⭐ Update tutor rating
  const reviews = await prisma.review.findMany({
    where: { tutorId: booking.tutorId },
  });

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    

      await prisma.tutorProfile.update({
    where: { userId: booking.tutorId },
    data: {
      rating: avgRating,
      totalReviews: reviews.length,
    },
  });

  return review;
}