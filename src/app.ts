import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import tutorRoutes from "./modules/tutor/tutor.route";
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import bookingRoutes from "./modules/bookings/booking.route";
import reviewRoutes from "./modules/reviews/review.routes"
import categoryRoutes from "./modules/categories/category.routes";
import adminRoutes from "./modules/admin/admin.routes";



const app = express();


app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000", // client side url
  credentials: true,   
}));

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/tutor", tutorRoutes);
app.use("/api/tutors", tutorRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler)
app.get("/", (req, res) => {
    res.send('Hello, World!');
});

export default app;