import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await api.post(
                "/auth/forgot-password",
                { email }
            );

            toast.success(res.data.message);
            setEmail("");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to send reset link"
            );
        }
    }

    return (
        <div className="login forgot-password">

            <h1>Forgot Password</h1>

            <form
                className="forgot-form"
                onSubmit={handleSubmit}
            >
                <p className="info-text">
                    Enter your email and we'll send
                    you a password reset link.
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Send Reset Link
                </button>
            </form>

            <p className="back-text">
                <Link
                    to="/login"
                    className="back-link"
                >
                    Back to Login
                </Link>
            </p>

        </div>
    );
};

export default ForgotPassword;