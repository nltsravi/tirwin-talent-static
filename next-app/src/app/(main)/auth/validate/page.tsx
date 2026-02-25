"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import "./validate.css";

export default function ValidateOtpPage() {
    const router = useRouter();

    const [otpCode, setOtpCode] = useState("");
    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertClass, setAlertClass] = useState("");

    useEffect(() => {
        const savedEmail = sessionStorage.getItem("otpEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        } else {
            router.push("/auth/login");
        }
    }, [router]);

    const clearAlert = () => {
        setAlertMessage(null);
        setAlertClass("");
    };

    const showAlert = (message: string, type: string) => {
        setAlertMessage(message);
        setAlertClass(type);
        setTimeout(() => clearAlert(), 5000);
    };

    const validateOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode) {
            showAlert("Please enter the OTP", "alert-danger");
            return;
        }

        try {
            const response = await AuthService.validateOtp(email, otpCode);
            sessionStorage.setItem("authToken", response.token);

            try {
                const userData = await AuthService.getProfile();
                sessionStorage.setItem("user", JSON.stringify(userData));
                showAlert("Login successful", "alert-success");

                setTimeout(() => {
                    const returnUrl = sessionStorage.getItem("otpReturnUrl");
                    if (returnUrl) {
                        sessionStorage.removeItem("otpReturnUrl");
                        sessionStorage.removeItem("otpEmail");
                        router.push(returnUrl);
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    } else {
                        sessionStorage.removeItem("otpEmail");
                        router.push("/webinar");
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                }, 2000);
            } catch (profileError) {
                console.error("Profile fetch error:", profileError);
                showAlert("Failed to fetch user profile.", "alert-danger");
            }
        } catch (error) {
            console.error("OTP validation failed:", error);
            showAlert("Invalid OTP. Please try again.", "alert-danger");
        }
    };

    if (!email) {
        return null; // Don't render if there's no email state yet
    }

    return (
        <div className="body-inner">
            <div className="login-section">
                <div className="container-fluid">
                    <div className="row align-items-center min-vh-100">
                        {/* Left: Placeholder for Carousel */}
                        <div className="col-md-4 d-none d-md-block p-0"></div>

                        {/* Right: OTP Validation Form */}
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
                                        <h3>Two-Factor Authentication</h3>
                                        <p className="text-muted">
                                            Enter the code sent to <strong>{email}</strong>
                                        </p>
                                    </div>

                                    <form onSubmit={validateOtp}>
                                        <div className="form-group">
                                            <label htmlFor="otp">
                                                OTP<span className="req-astrix">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="otp"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                name="otpCode"
                                                placeholder="Enter the OTP"
                                                required
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary btn-block w-100">
                                                Validate
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* End of Right Form */}
                    </div>
                </div>
            </div>
        </div>
    );
}
