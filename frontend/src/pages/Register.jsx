import { useState } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const toastId = toast.loading("Registering...");
        try {
            const res = await api.post("/auth/register", form);
            toast.dismiss(toastId);
            toast.success(res.data.message);
            setForm({ name: "", email: "", password: "" });
            navigate("/login");
        } catch (err) {
            toast.dismiss(toastId);
            toast.error("Registration failed");
        }

    } return (
        <div className="register">
            <form onSubmit={handleSubmit} >
                <h1>Register</h1>
                <input type="text" placeholder="Username" name="name" value={form.name} onChange={handleChange} />
                <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
                <button>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Register;