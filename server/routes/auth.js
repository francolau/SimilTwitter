import express from 'express';
import {login} from '../controllers/auth.js';

const router = express.Router();

router.post("/login", login); // this gonna be /auth/login

export default router;