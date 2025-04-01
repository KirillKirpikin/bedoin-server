require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const fileUpload = require("express-fileupload");
const cors = require("cors");
const router = require("./routes/index");
const path = require("path");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: ["http://localhost:3000", "https://bedoin.com.ua"], // Указываем точный домен
    credentials: true, // Разрешаем передавать куки
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

const start = async () => {
    try {
        await mongoose
            .connect(process.env.DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log("connect to MongoDB"));
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
