import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const FIELDS = [
    { name: "firstName", label: "First name", type: "text", placeholder: "John" },
    { name: "lastName", label: "Last name", type: "text", placeholder: "Doe" },
    { name: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
    { name: "phoneNumber", label: "Phone number", type: "text", placeholder: "+1 234 567 8900" },
    { name: "password", label: "Password", type: "password", placeholder: "Create a password" },
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "" });
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    const handleInputChange = ({ target: { name, value } }) =>
        setFormData((prev) => ({ ...prev, [name]: value }));

    const isFormValid = Object.values(formData).every((f) => f.trim());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setMessage({ type: "error", text: "Please fill in all fields" });
            setTimeout(() => setMessage({}), 5000);
            return;
        }
        try {
            const resp = await ApiService.registerUser(formData);
            if (resp.status === 200) {
                setMessage({ type: "success", text: "Account created! Redirecting to login…" });
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || error.message });
            setTimeout(() => setMessage({}), 5000);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <div className="auth-brand">🏨 StaySync Hotel</div>
                <h2>Create your account</h2>

                {message.text && <p className={`${message.type}-message`}>{message.text}</p>}

                <form onSubmit={handleSubmit}>
                    {FIELDS.map(({ name, label, type, placeholder }) => (
                        <div className="form-group" key={name}>
                            <label>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit">Create account</button>
                </form>

                <div className="auth-divider"><hr /><span>or</span><hr /></div>
                <p className="register-link">Already have an account? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
};

export default RegisterPage;