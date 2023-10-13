import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Read routes
router.get("/:id", verifyToken, getUser); // this route gonna be /users/:id 
router.get("/:id/friends", verifyToken, getUserFriends);

// Update Route
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // friendId to add o remove

export default router;