import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", mobile: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/register", form);
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Registration failed. Try again!");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Wedding Registration</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="tel" name="mobile" placeholder="Phone Number" onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            </form>
        </div>
    );
}
