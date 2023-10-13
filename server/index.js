import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { fileURLToPath } from "url";
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"

import User from "./models/User.js"
import Post from "./models/Post.js";

import {users, posts} from './data/index.js'

// Configurations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middlewares

app.use(express.json());
app.use(helmet()); // Middleware for security on http headers
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common")); // Middleware for take information and debug it
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());


app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // Where images are stored

// File Storage

const storage = multer.diskStorage({ // Saving files
    destination: function (req, file, cb){
        cb(null, "public/assets")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage});

// Routes with files

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Routes

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Mongoose setup

const PORT = process.env.PORT || 6001; 
const DB_URL = process.env.MONGO_URL;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {

    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
    /* 
        INICIAR UNA SOLA VEZ CON EL INICIO DEL SERVIDOR PARA AGREGAR USUARIOS Y POSTS
    User.insertMany(users);
    Post.insertMany(posts);
    */
}).catch((err) => console.log(`${err} did not connect`));
