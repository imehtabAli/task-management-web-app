import { useState } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: "", password: "" });
    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", user);
            localStorage.setItem("Token", res.data.token);
            toast.success(res.data.message);
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    }
    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" name="email" value={user.email} onChange={handleChange} />
                <input type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} />
                <p>
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>
                <button>Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login;