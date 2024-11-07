const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRouter.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);


const mongoDBConnect = () => {
    try {
        mongoose
            .connect(process.env.MONGODB_URL)
            .then(() => console.log("Database connected"))
            .catch((error) => {
                console.log("Database connection error:", error);
                process.exit(1);
            });
    } catch (error) {
        console.log("Database connection error:", error);
        process.exit(1);
    }
};


const startServer = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on http://localhost:${process.env.PORT}`);
    });
};

 
mongoDBConnect();
startServer();
