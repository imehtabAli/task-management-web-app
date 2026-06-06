const Task = require("../models/task");

exports.createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = new Task({ title, description, status, userId: req.user.id });
        await task.save();
        res.json({task, message: "Task Created."});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const findTask = await Task.findOne({ _id: taskId, userId: req.user.id });
        if (!findTask) return res.status(404).json({ message: "Task not found" });
        res.json(findTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateTask = await Task.findOneAndUpdate({ _id: taskId, userId: req.user.id }, req.body, { new: true });
        if (!updateTask) return res.status(404).json({ message: "Task not found" });
        res.json(updateTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.DeleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const deleteTask = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });
        if (!deleteTask) return res.status(404).json({ message: "Task not found or unauthorized" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
