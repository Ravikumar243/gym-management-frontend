import React, { useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ownerLogin } from "../../redux/slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        loading,
        error,
        isAuthenticated,
    } = useSelector(
        (state) => state.auth
    );

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,

    });


    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (isSubmitting) return;
        if (!formData.email || !formData.password) {

            return;

        }

        setIsSubmitting(true);
        const result = await dispatch(

            ownerLogin({

                email: formData.email,

                password: formData.password,

            })

        );


        if (
            ownerLogin.fulfilled.match(result)
        ) {

            navigate("/dashboard");

        }
        else {
            setIsSubmitting(false);
        }

    };


    return (
        <div className="fitpulse-login-page">


            <div className="fitpulse-login-overlay"></div>

            <div className="fitpulse-login-card">

                {/* Logo / Brand */}
                <div className="fitpulse-login-brand">
                    <h1>FitPulse Pro</h1>

                    <p>Enterprise Management</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="fitpulse-login-field">

                        <label htmlFor="email">
                            Email or Username
                        </label>

                        <div className="fitpulse-input-wrapper">

                            <i className="bi bi-person"></i>

                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />

                        </div>

                    </div>

                    <div className="fitpulse-login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="fitpulse-input-wrapper">

                            <i className="bi bi-lock"></i>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                className="fitpulse-password-toggle"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                <i
                                    className={`bi ${showPassword
                                        ? "bi-eye"
                                        : "bi-eye-slash"
                                        }`}
                                ></i>
                            </button>

                        </div>

                    </div>


                    <div className="fitpulse-login-options">

                        <label className="fitpulse-remember">

                            <input
                                type="checkbox"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                            />

                            <span>Remember me</span>

                        </label>

                        <button
                            type="button"
                            className="fitpulse-forgot-password"
                        >
                            Forgot password?
                        </button>

                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="fitpulse-login-button"
                        disabled={loading || isSubmitting}
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;