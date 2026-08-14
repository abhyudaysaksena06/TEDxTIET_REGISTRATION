import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Register.css";

// Supabase setup
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase environment variables are missing!", {
    url: SUPABASE_URL,
    key: !!SUPABASE_ANON_KEY ? "Present" : "Missing"
  });
}

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    email: "",
    phone_no: "",
    year_of_study: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email.endsWith("@thapar.edu")) {
      setMessageType("error");
      setMessage("Please use a valid @thapar.edu email address.");
      return;
    }

    const registrationData = {
      name: formData.name.trim(),
      roll_no: formData.roll_no.trim(),
      email: formData.email.trim(),
      phone_no: formData.phone_no.trim() === "" ? null : formData.phone_no.trim(),
      year_of_study: parseInt(formData.year_of_study),
    };

    try {
      const { error } = await supabase.from("registrations").insert([registrationData]);
      if (error) throw error;

      setMessageType("success");
      setMessage("🎉 Registration successful! Welcome aboard.");
      setFormData({
        name: "",
        roll_no: "",
        email: "",
        phone_no: "",
        year_of_study: "",
      });
    } catch (error) {
      console.error("Supabase error:", error);
      let friendlyMessage = "Registration failed. Please try again.";
      if (error.code === "23505")
        friendlyMessage = "⚠️ This Roll No. or Email is already registered.";
      setMessageType("error");
      setMessage(friendlyMessage);
    }
  };

  return (
    <main className="register-page">
      <h1>Student Registration</h1>

      <form id="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="roll_no">Roll No.</label>
          <input id="roll_no" type="text" value={formData.roll_no} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Thapar Email ID</label>
          <input
            id="email"
            type="email"
            placeholder="example@thapar.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_no">Phone No.</label>
          <input id="phone_no" type="tel" value={formData.phone_no} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="year_of_study">Year of Study</label>
          <select id="year_of_study" value={formData.year_of_study} onChange={handleChange} required>
            <option value="">-- Select your year --</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Register
        </button>
      </form>

      {message && (
        <div
          className={`message-container ${messageType}`}
          style={{ marginTop: "20px", fontWeight: "500" }}
        >
          {message}
        </div>
      )}
    </main>
  );
};

export default Register;
