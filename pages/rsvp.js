import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RSVP() {
    const [email, setEmail] = useState("");
    const [attending, setAttending] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/rsvp", { email, attending });
            toast.success(response.data.message);
        } catch (error) {
            toast.error("RSVP failed. Try again!");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Confirm Your Attendance</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
                <select onChange={(e) => setAttending(e.target.value === "yes")}>
                    <option value="yes">Attending</option>
                    <option value="no">Not Attending</option>
                </select>
                <button type="submit" disabled={loading}>{loading ? "Submitting..." : "RSVP"}</button>
            </form>
        </div>
    );
}
