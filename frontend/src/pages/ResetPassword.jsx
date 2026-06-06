import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/Api";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error(
                "Passwords do not match"
            );
        }

        try {
            const res = await api.post(
                `/auth/reset-password/${token}`,
                { password }
            );

            toast.success(res.data.message);

            navigate("/login");
        } catch (err) {
            toast.error(
                err.response?.data?.message
            );
        }
    }

    return (
        <div className="login">

            <h1>Reset Password</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                />

                <button>
                    Reset Password
                </button>

            </form>

        </div>
    );
};

export default ResetPassword;