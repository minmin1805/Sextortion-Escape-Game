import express from 'express';
import {createPlayer, updatePlayer} from "../controllers/playerController.js";

const router = express.Router();

router.post("/", createPlayer);
router.patch("/:id", updatePlayer);

export default router;