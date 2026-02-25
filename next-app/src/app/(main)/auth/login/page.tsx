"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService, environment } from "@/services/auth.service";
import Link from "next/link";
import "./login.css";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertClass, setAlertClass] = useState("");

    const clearAlert = () => {
        setAlertMessage(null);
        setAlertClass("");
    };

    const showAlert = (message: string, type: string) => {
        setAlertMessage(message);
        setAlertClass(type);
        setTimeout(() => clearAlert(), 5000);
    };

    useEffect(() => {
        const token = searchParams?.get("token");

        if (token) {
            sessionStorage.setItem("authToken", token);
            window.history.replaceState({}, document.title, window.location.pathname);
            getProfile();
        }
    }, [searchParams]);

    const sendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showAlert("Please enter your email", "alert-danger");
            return;
        }

        try {
            const response = await AuthService.sendOtp(email);
            showAlert(response.message || "OTP sent!", "alert-success");

            const returnUrl = sessionStorage.getItem("returnUrl") || "/webinar";

            setTimeout(() => {
                // Just push to validate, we pass state via query params or session storage
                sessionStorage.setItem("otpEmail", email);
                sessionStorage.setItem("otpReturnUrl", returnUrl);
                router.push("/auth/validate");
            }, 2000);
        } catch (error) {
            console.error("Error sending OTP:", error);
            showAlert("Failed to send OTP. Please try again.", "alert-danger");
        }
    };

    const socialLogin = (social: string) => {
        if (social === "google") {
            window.location.href = `${environment.api}/auth/google`;
        }
    };

    const getProfile = async () => {
        try {
            const userData = await AuthService.getProfile();
            sessionStorage.setItem("user", JSON.stringify(userData));
            showAlert("Login successful", "alert-success");

            setTimeout(() => {
                const returnUrl = sessionStorage.getItem("returnUrl");
                if (returnUrl) {
                    sessionStorage.removeItem("returnUrl");
                    router.push(returnUrl);
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                } else {
                    router.push("/webinar");
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
            }, 2000);
        } catch (error) {
            console.error("Profile fetch error:", error);
            showAlert("Failed to fetch user profile.", "alert-danger");
        }
    };

    return (
        <div className="body-inner">
            <div className="login-section">
                <div className="container-fluid">
                    <div className="row align-items-center min-vh-100">
                        {/* Left: Placeholder for Carousel */}
                        <div className="col-md-4 d-none d-md-block p-0"></div>

                        {/* Right: Login Form */}
                        <div className="col-md-4 d-flex align-items-center justify-content-center">
                            <div className="card login-card">
                                <div className="card-body">
                                    {/* Alert System */}
                                    {alertMessage && (
                                        <div
                                            className={`alert alert-dismissible fade show ${alertClass}`}
                                            role="alert"
                                        >
                                            {alertMessage}
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={clearAlert}
                                            ></button>
                                        </div>
                                    )}

                                    <div className="mb-3 text-center">
                                        <h3>Login with email</h3>
                                        <p className="text-muted">Enter your email to receive an OTP.</p>
                                    </div>

                                    <form onSubmit={sendOtp}>
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
                                                name="email"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary btn-block w-100">
                                                Send OTP
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mb-3 text-center">
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
                                            <span className="fw-bold">Sign in with Google</span>
                                        </button>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <small>Not signed up? </small>
                                        <Link href="/auth/register" className="small fw-bold">
                                            Click here
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </React.Suspense>
    );
}
