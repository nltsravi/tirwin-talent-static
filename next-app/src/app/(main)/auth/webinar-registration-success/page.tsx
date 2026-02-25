"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./webinar-registration-success.css";

export default function WebinarRegistrationSuccessPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/home");
    };

    return (
        <div className="body-inner d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="text-center p-5 bg-white rounded shadow" style={{ maxWidth: "600px" }}>
                <div className="mb-4">
                    <i className="fas fa-check-circle text-success" style={{ fontSize: "80px" }}></i>
                </div>
                <h2 className="mb-3">Registration Successful!</h2>
                <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                    Thank you for registering. We have sent a confirmation email to your
                    provided email address with the webinar details.
                </p>
                <button className="btn btn-primary px-4 py-2" onClick={handleGoHome}>
                    Return to Home
                </button>
            </div>
        </div>
    );
}
