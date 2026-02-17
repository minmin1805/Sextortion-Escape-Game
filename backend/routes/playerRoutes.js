import express from 'express';
import {createPlayer, updatePlayer} from "../controllers/playerController.js";

const router = express.Router();

router.route("/", createPlayer);
router.patch("/:id", updatePlayer);