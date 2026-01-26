import express from 'express';

const app = express();

// app.use(cors({
//   origin: process.env.APP_URL || "http://localhost:3000", // client side url
//   credentials: true,   
// }));

// app.use(express.json());



app.get("/", (req, res) => {
    res.send('Hello, World!');
});
export default app;