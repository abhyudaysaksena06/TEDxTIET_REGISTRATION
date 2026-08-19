import React, { useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../lib/supabaseClient";
import "./RegisterNow.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  admissionNumber: "",
  website: "", // honeypot — real users never see or fill this
};

export default function RegisterNow() {
  const [form, setForm] = useState(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!/^[0-9]{10}$/.test(form.phone)) next.phone = "Please enter a valid 10-digit phone number.";
    if (!form.admissionNumber.trim()) next.admissionNumber = "Please enter your admission number.";
    if (!agreed) next.agreed = "You must agree to the terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Posts to the Edge Function, not straight to the table — the rate
      // limit and honeypot checks run server-side where they can't be edited.
      const res = await fetch(`${SUPABASE_URL}/functions/v1/event-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          admissionNumber: form.admissionNumber.trim(),
          website: form.website,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rn-page">
      <div className="rn-card">
        <div className="rn-header">
          <h1>
            REGISTER <span>NOW</span>
          </h1>
          <div className="rn-divider" />
        </div>

        {submitted ? (
          <div className="rn-success">
            <h2>You&apos;re registered!</h2>
            <p>
              Thank you, {form.name}. A confirmation will be sent to {form.email}.
            </p>
          </div>
        ) : (
          <form className="rn-form" onSubmit={handleSubmit} noValidate>
            <Field
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Field
              label="Admission Number"
              name="admissionNumber"
              placeholder="Enter your admission number"
              value={form.admissionNumber}
              onChange={handleChange}
              error={errors.admissionNumber}
            />

            {/* Honeypot: hidden from real users via CSS, bots fill every field */}
            <div className="rn-honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange}
              />
            </div>

            <label className="rn-consent">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setErrors((prev) => ({ ...prev, agreed: "" }));
                }}
              />
              <span>
                I agree to the <a href="#terms">terms and conditions</a> and consent to receive
                updates from TEDxTIET.
              </span>
            </label>
            {errors.agreed && <div className="rn-error-msg">{errors.agreed}</div>}

            {submitError && <div className="rn-error-msg rn-submit-error">{submitError}</div>}

            <button type="submit" className="rn-submit" disabled={submitting}>
              {submitting ? "REGISTERING…" : "REGISTER & JOIN THE JOURNEY"}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="rn-field">
      <label htmlFor={name}>
        {label} <span className="rn-req">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="rn-error-msg">{error}</div>
    </div>
  );
}
