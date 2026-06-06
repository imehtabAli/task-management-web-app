const express = require("express");
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, DeleteTask } = require("../controllers/taskController");
const {verifyToken} = require("../middleware/authMiddleware");

router.post("/createTask", verifyToken, createTask);
router.get("/getAllTasks", verifyToken, getAllTasks);
router.get("/getTaskById/:id", verifyToken, getTaskById);
router.put("/updateTask/:id", verifyToken, updateTask);
router.delete("/DeleteTask/:id", verifyToken, DeleteTask);

module.exports = router;