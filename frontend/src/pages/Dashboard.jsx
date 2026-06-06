import { useNavigate } from "react-router-dom";
import api from "../config/Api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 6;

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "pending"
    });

    const [tasks, setTasks] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        status: "pending"
    });

    useEffect(() => {
        showAllTasks();
    }, []);

    async function showAllTasks() {
        try {
            const res = await api.get("/task/getAllTasks");
            setTasks(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function handleEditChange(e) {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await api.post(
                "/task/createTask",
                form
            );

            setTasks([...tasks, res.data.task]);

            toast.success(res.data.message);

            setForm({
                title: "",
                description: "",
                status: "pending"
            });
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to create task."
            );
        }
    }

    async function deleteTask(id) {
        try {
            const res = await api.delete(
                `/task/deleteTask/${id}`
            );

            setTasks(
                tasks.filter(
                    task => task._id !== id
                )
            );

            toast.success(res.data.message);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to delete task."
            );
        }
    }

    function startEdit(task) {
        setEditingId(task._id);

        setEditForm({
            title: task.title,
            description: task.description,
            status: task.status
        });
    }

    async function editTask(id) {
        try {
            const res = await api.put(
                `/task/updateTask/${id}`,
                editForm
            );

            setTasks(
                tasks.map(task =>
                    task._id === id
                        ? res.data
                        : task
                )
            );

            setEditingId(null);

            toast.success("Task updated");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to edit task."
            );
        }
    }


    async function updateStatus(id, status) {
        try {
            const res = await api.put(
                `/task/updateTask/${id}`,
                { status }
            );

            setTasks(
                tasks.map(task =>
                    task._id === id
                        ? res.data
                        : task
                )
            );

            toast.success("Status updated");
        } catch (err) {
            toast.error("Failed to update status");
        }
    }


    function logout() {
        localStorage.removeItem("Token");
        navigate("/login");
    }

    const pendingTasks = tasks.filter(
        task => task?.status === "pending"
    ).length;

    const completedTasks = tasks.filter(
        task => task?.status === "completed"
    ).length;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all"
                ? true
                : task.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const lastTaskIndex =
        currentPage * tasksPerPage;

    const firstTaskIndex =
        lastTaskIndex - tasksPerPage;

    const currentTasks =
        filteredTasks.slice(
            firstTaskIndex,
            lastTaskIndex
        );

    const totalPages = Math.ceil(
        filteredTasks.length / tasksPerPage
    );

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h1>Task Management</h1>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <div className="stats">
                <div className="stat-card total">
                    <p>Total Tasks</p>
                    <h2>{tasks.length}</h2>
                </div>

                <div className="stat-card pending">
                    <p>Pending</p>
                    <h2>{pendingTasks}</h2>
                </div>

                <div className="stat-card completed">
                    <p>Completed</p>
                    <h2>{completedTasks}</h2>
                </div>
            </div>

            <div className="task-form-card">
                <h2>Add New Task</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Task Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <button type="submit">
                        Add Task
                    </button>
                </form>
            </div>


            <div className="filters">

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(e.target.value)
                    }
                >
                    <option value="all">
                        All
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="completed">
                        Completed
                    </option>
                </select>

            </div>

            <div className="all-tasks">
                <h2>Your Tasks ({tasks.length})</h2>

                <div className="task-grid">
                    {currentTasks.map(task => (
                        <div
                            className="task-card"
                            key={task._id}
                        >
                            {editingId === task._id ? (
                                <>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                    />

                                    <input
                                        type="text"
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                    />

                                    <select
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditChange}
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>

                                    <div className="task-actions">
                                        <button
                                            onClick={() =>
                                                editTask(task._id)
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() =>
                                                setEditingId(null)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="task-top">
                                        <h3>{task.title}</h3>

                                        <div className="task-actions">
                                            <button
                                                onClick={() =>
                                                    startEdit(task)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteTask(task._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="description">
                                        {task.description}
                                    </p>
                                    <select
                                        className={`status-select ${task.status}`}
                                        value={task.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                task._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(
                                currentPage - 1
                            )
                        }
                    >
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            setCurrentPage(
                                currentPage + 1
                            )
                        }
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;