"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, environment } from "@/services/auth.service";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const subscriptionId = "06fff7d5-00b6-4679-afd8-d3dd4ae3beda";

    const registerTrainee = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !jobTitle || !company || !email) {
            setErrorMessage("Please fill all required fields correctly.");
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        const userData = {
            email,
            phone,
            first_name: firstName,
            last_name: lastName,
            organization: company,
            job_title: jobTitle,
            user_type: "trainee",
            is_first_time_login: true,
            subscriptionId,
        };

        try {
            const response = await AuthService.registerTrainee(userData);
            setSuccessMessage(response.message || "Registration successful!");

            // Send OTP after successful registration
            try {
                await AuthService.sendOtp(email);
                sessionStorage.setItem("otpEmail", email);
                router.push("/auth/validate");
            } catch (otpError) {
                console.error("Error sending OTP:", otpError);
                setErrorMessage("Registration successful, but OTP sending failed.");
            }
        } catch (error: any) {
            console.error("Error registering trainee:", error);
            if (error.message) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Failed to register. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialLogin = (social: string) => {
        if (social === "google") {
            window.location.href = `${environment.api}/api/auth/google`;
        }
    };

    return (
        <div className="body-inner">
            <div className="register-section">
                <div className="container-fluid">
                    <div className="row align-items-center min-vh-100" style={{ paddingTop: "50px" }}>
                        {/* Left: Placeholder for Carousel */}
                        <div className="col-md-4 d-none d-md-block p-0"></div>

                        {/* Right: Registration Form */}
                        <div className="col-md-4 d-flex align-items-center justify-content-center">
                            <div className="card register-card" style={{ marginTop: "30px" }}>
                                <div className="card-body">
                                    <div className="mb-3 text-center">
                                        <h3>User Registration</h3>
                                        <p className="text-muted">Fill in your details to register.</p>
                                    </div>

                                    {errorMessage && (
                                        <div className="alert alert-danger mt-3">{errorMessage}</div>
                                    )}
                                    {successMessage && (
                                        <div className="alert alert-success mt-3">{successMessage}</div>
                                    )}

                                    <form onSubmit={registerTrainee} noValidate>
                                        <div className="form-group">
                                            <label htmlFor="firstName">
                                                First Name<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                                maxLength={200}
                                                pattern="^[a-zA-Z\s]+$"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="lastName">
                                                Last Name<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                                maxLength={200}
                                                pattern="^[a-zA-Z\s]+$"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="jobTitle">
                                                Job Title<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="jobTitle"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                required
                                                maxLength={200}
                                                pattern="^[a-zA-Z\s]+$"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="company">
                                                Company<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="company"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                required
                                                maxLength={200}
                                                pattern="^[a-zA-Z\s]+$"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Email Address<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                pattern="^\d{10}$"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block w-100"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Signing up..." : "Sign up"}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Register as Trainer Button */}
                                    <div className="mt-3 text-center">
                                        <p className="text-muted">Want to become a trainer?</p>
                                        <Link
                                            href="/auth/trainer-registration"
                                            className="btn no-bg btn-block w-100"
                                        >
                                            Register as Trainer
                                        </Link>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <small>
                                            Already signed up?{" "}
                                            <Link href="/auth/login" className="text-primary fw-bold">
                                                Click here to login
                                            </Link>
                                        </small>
                                    </div>
                                </div>

                                <div className="mb-3 text-center">
                                    <hr />
                                    <span>or</span>
                                </div>
                                <div className="mt-3 text-center">
                                    <button
                                        onClick={() => socialLogin("google")}
                                        className="btn btn-light btn-google w-100 d-flex align-items-center justify-content-center"
                                        style={{
                                            border: "1px solid #ddd",
                                            padding: "10px",
                                            borderRadius: "5px",
                                        }}
                                        type="button"
                                    >
                                        <img
                                            src="https://developers.google.com/identity/images/g-logo.png"
                                            alt="Google"
                                            style={{ width: "20px", marginRight: "10px" }}
                                        />
                                        <span className="fw-bold">Register with Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
