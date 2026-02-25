"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthService, environment } from "@/services/auth.service";
import "./trainer-registration.css";

interface TrainerData {
    first_name: string;
    last_name: string;
    email: string;
    countryCode: string;
    phone: string;
    job_title: string;
    organization: string;
    experience: string;
    employmentType: string;
    specialties: string[];
    resume_url: string;
    linkedin_profile: string;
    bio: string;
    profile_image: string;
    subscription_id: string;
    public_profile: boolean;
    training_modes: {
        online: boolean;
        offline: boolean;
        hybrid: boolean;
    };
    additional_info: {
        resume_url?: string;
        [key: string]: any;
    };
    doc_urls: string[];
}

export default function TrainerRegistrationPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const steps = ["Personal Info", "Professional Details", "Profile"];
    const progress = (step - 1) * 50;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    const [emailDisabled, setEmailDisabled] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    const [trainer, setTrainer] = useState<TrainerData>({
        first_name: "",
        last_name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        job_title: "",
        organization: "",
        experience: "",
        employmentType: "",
        specialties: [],
        resume_url: "",
        linkedin_profile: "",
        bio: "",
        profile_image: "/assets/default-avatar.png",
        subscription_id: "06fff7d5-00b6-4679-afd8-d3dd4ae3beda",
        public_profile: false,
        training_modes: { online: false, offline: false, hybrid: false },
        additional_info: {},
        doc_urls: [],
    });

    const experienceOptions = [
        "Less than 5 Years",
        "5-10 Years",
        "10-20 Years",
        "20+ Years",
    ];
    const employmentTypeOptions = ["Employed", "Consultant"];
    const specialtiesOptions = [
        "Supply Chain & Logistics Management",
        "Customs compliance & documentation",
        "Dangerous goods handling",
        "Freight rate & cost management",
        "Cargo Sales",
        "Ocean pricing",
        "EXIM operations",
        "Freight forwarding - Customer Service",
        "Custom brokers",
        "CFS operations",
        "Supply Chain Technology",
        "Supply Chain Analytics",
        "Other",
    ];
    const MAX_SPECIALTIES = 3;

    const [showSpecialtiesModal, setShowSpecialtiesModal] = useState(false);
    const [tempSelectedSpecialties, setTempSelectedSpecialties] = useState<string[]>([]);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherExpertise, setOtherExpertise] = useState("");

    const photoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setTrainer((prev) => ({
                    ...prev,
                    first_name: user.first_name || prev.first_name,
                    last_name: user.last_name || prev.last_name,
                    email: user.email || prev.email,
                    profile_image: user.profile_image || prev.profile_image,
                }));
                if (user.email) setEmailDisabled(true);
                if (user.profile_image) setPhotoPreview(user.profile_image);
            } catch (e) { }
        }
    }, []);

    const validateLinkedInUrl = (url: string) => {
        if (!url) return true;
        const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
        return linkedInRegex.test(url);
    };

    const validateStep = () => {
        setErrorMessage("");
        if (step === 1) {
            if (
                !trainer.first_name ||
                !trainer.last_name ||
                !trainer.email ||
                !trainer.phone
            ) {
                setErrorMessage("All fields in Personal Info are required!");
                return false;
            }
            if (!isEmailVerified) {
                setErrorMessage("Please verify your email address first.");
                return false;
            }
            if (!isOtpVerified) {
                setErrorMessage("Please verify your OTP first.");
                return false;
            }
        }
        if (step === 2) {
            if (!trainer.job_title && trainer.employmentType === "Employed") {
                setErrorMessage("Designation is required for Employed!");
                return false;
            }
            if (!trainer.organization && trainer.employmentType === "Employed") {
                setErrorMessage("Organization is required for Employed!");
                return false;
            }
            if (
                !trainer.experience ||
                !trainer.employmentType ||
                trainer.specialties.length === 0
            ) {
                setErrorMessage(
                    "All fields in Professional Details are required, including at least one specialty!"
                );
                return false;
            }
        }
        if (step === 3) {
            if (!trainer.bio) {
                setErrorMessage("Professional Summary is required!");
                return false;
            }
            if (
                trainer.linkedin_profile &&
                !validateLinkedInUrl(trainer.linkedin_profile.trim())
            ) {
                setErrorMessage("Please enter a valid LinkedIn profile URL.");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (!validateStep()) return;
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const verifyEmail = async () => {
        if (!trainer.email) {
            setErrorMessage("Please enter an email address first.");
            return;
        }

        setIsVerifyingEmail(true);
        setErrorMessage("");

        const userData = {
            email: trainer.email,
            first_name: trainer.first_name || "1",
            last_name: trainer.last_name || "2",
            user_type: "trainee",
            is_first_time_login: true,
            is_verified: false,
            is_active: true,
        };

        try {
            await AuthService.verifyEmail(userData);
            setIsEmailVerified(true);
        } catch (error: any) {
            setErrorMessage(
                error.message || "Failed to verify email. Please try again."
            );
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const validateOtp = async () => {
        if (!otpCode || otpCode.length !== 6) {
            setErrorMessage("Please enter a valid 6-digit OTP.");
            return;
        }

        setIsVerifyingOtp(true);
        setErrorMessage("");

        try {
            await AuthService.validateTrainerOtp(trainer.email, otpCode);
            setIsOtpVerified(true);
        } catch (error: any) {
            setErrorMessage(
                error.message || "Failed to verify OTP. Please try again."
            );
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const registerTrainer = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        const payload = { ...trainer, phone: `${trainer.countryCode} ${trainer.phone}` };
        if (payload.employmentType !== "Employed") {
            if (!payload.job_title) payload.job_title = " ";
            if (!payload.organization) payload.organization = " ";
        }

        payload.additional_info = {
            ...payload.additional_info,
            resume_url: payload.resume_url || "",
        };

        try {
            const res = await fetch(`${environment.api}/users/trainer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Registration failed.");
            }

            setSuccessMessage("Your profile has been submitted for verification!");
            setIsFormSubmitted(true);
            setTimeout(() => {
                router.push(`/auth/validate-otp?email=${encodeURIComponent(trainer.email)}`);
            }, 2000);
        } catch (error: any) {
            console.error("Error registering trainer:", error);
            setErrorMessage(error.message || "Failed to register. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setErrorMessage("Only JPG or PNG images are allowed.");
                return;
            }
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            setErrorMessage("");

            setIsUploadingPhoto(true);
            try {
                const res = await fetch(`${environment.api}/users/profile-image/upload-url`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileType: file.type }),
                });
                const { uploadUrl, imageUrl } = await res.json();

                await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                setTrainer((prev) => ({ ...prev, profile_image: imageUrl }));
            } catch (err) {
                console.error("Failed to upload image", err);
                setErrorMessage("Failed to upload image.");
            } finally {
                setIsUploadingPhoto(false);
            }
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        setTrainer((prev) => ({ ...prev, profile_image: "/assets/default-avatar.png" }));
    };

    const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const allowed = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!allowed.includes(file.type)) {
                setErrorMessage("Only PDF, DOC, or DOCX files are allowed.");
                return;
            }
            setSelectedFile(file);
            setSelectedFileName(file.name);
            setErrorMessage("");

            setIsUploadingResume(true);
            try {
                const res = await fetch(`${environment.api}/users/trainer/upload-resume`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: trainer.email, fileType: file.type }),
                });
                const { uploadUrl, resumeUrl } = await res.json();

                await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                setTrainer((prev) => ({ ...prev, doc_urls: [resumeUrl] }));
            } catch (err) {
                console.error("Failed to upload resume", err);
                setErrorMessage("Failed to upload resume.");
            } finally {
                setIsUploadingResume(false);
            }
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setSelectedFileName("");
        setTrainer((prev) => ({ ...prev, resume_url: "", doc_urls: [] }));
    };

    const isSpecialtySelected = (item: string) => tempSelectedSpecialties.includes(item);

    const toggleSpecialty = (item: string) => {
        if (item === "Other") {
            if (tempSelectedSpecialties.includes(item)) {
                setTempSelectedSpecialties((prev) => prev.filter((s) => s !== item && s !== otherExpertise.trim()));
                setShowOtherInput(false);
                setOtherExpertise("");
            } else if (tempSelectedSpecialties.length < MAX_SPECIALTIES) {
                setTempSelectedSpecialties((prev) => [...prev, item]);
                setShowOtherInput(true);
            }
        } else {
            if (tempSelectedSpecialties.includes(item)) {
                setTempSelectedSpecialties((prev) => prev.filter((s) => s !== item));
            } else if (tempSelectedSpecialties.length < MAX_SPECIALTIES) {
                setTempSelectedSpecialties((prev) => [...prev, item]);
            }
        }
    };

    const updateOtherExpertise = (val: string) => {
        setOtherExpertise(val);
        if (tempSelectedSpecialties.includes("Other")) {
            setTempSelectedSpecialties((prev) => [
                ...prev.filter((s) => s !== otherExpertise && s !== "Other"),
                "Other",
                ...(val.trim() ? [val.trim()] : []),
            ]);
        }
    };

    const applySpecialtiesModal = () => {
        if (tempSelectedSpecialties.includes("Other") && !otherExpertise.trim()) {
            setErrorMessage("Please enter your expertise in the text box.");
            return;
        }
        setTrainer((prev) => ({ ...prev, specialties: [...tempSelectedSpecialties] }));
        setShowSpecialtiesModal(false);
    };

    return (
        <div className="body-inner">
            <section className="register-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-12 mx-auto">
                            <div className="text-center mb-4">
                                <h3>Trainer Registration</h3>
                                <p className="text-muted">
                                    Inspire, educate, and earn—start your journey as a trainer!
                                </p>
                            </div>

                            {isFormSubmitted && (
                                <div className="alert alert-success text-center">
                                    <h4>Your profile has been submitted for verification!</h4>
                                    <p>We will notify you once it has been reviewed.</p>
                                </div>
                            )}

                            {!isFormSubmitted && (
                                <div className="card register-card">
                                    <div className="card-body">
                                        {errorMessage && (
                                            <div className="alert alert-danger text-center mb-3">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <div className="stepper mb-3">
                                            {steps.map((s, i) => (
                                                <div key={i} className={`step ${step === i + 1 ? "active" : ""}`}>
                                                    <div className="step-circle">{i + 1}</div>
                                                    <div className="step-title">{s}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="progress mb-4">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>

                                        <div className="carousel-steps">
                                            {step === 1 && (
                                                <div className="step-content step-slide active">
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            First Name <span className="req-astrix">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={trainer.first_name}
                                                                            onChange={(e) =>
                                                                                setTrainer({ ...trainer, first_name: e.target.value })
                                                                            }
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Last Name <span className="req-astrix">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={trainer.last_name}
                                                                            onChange={(e) =>
                                                                                setTrainer({ ...trainer, last_name: e.target.value })
                                                                            }
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <label>
                                                                    Email <span className="req-astrix">*</span>
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        value={trainer.email}
                                                                        onChange={(e) =>
                                                                            setTrainer({ ...trainer, email: e.target.value })
                                                                        }
                                                                        disabled={emailDisabled}
                                                                        required
                                                                    />
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        type="button"
                                                                        onClick={verifyEmail}
                                                                        disabled={
                                                                            !trainer.email ||
                                                                            isEmailVerified ||
                                                                            isVerifyingEmail ||
                                                                            emailDisabled
                                                                        }
                                                                    >
                                                                        {isVerifyingEmail ? "Verifying..." : isEmailVerified ? "Verified" : "Verify"}
                                                                    </button>
                                                                </div>
                                                                {isEmailVerified && !isOtpVerified && (
                                                                    <small className="text-success mt-1 d-block">
                                                                        OTP sent to your email id for validation.
                                                                    </small>
                                                                )}
                                                            </div>

                                                            {isEmailVerified && !isOtpVerified && (
                                                                <div className="form-group">
                                                                    <label>
                                                                        Enter OTP <span className="req-astrix">*</span>
                                                                    </label>
                                                                    <div className="input-group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            value={otpCode}
                                                                            onChange={(e) => setOtpCode(e.target.value)}
                                                                            placeholder="Enter 6-digit OTP"
                                                                            maxLength={6}
                                                                            disabled={isVerifyingOtp}
                                                                        />
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            type="button"
                                                                            onClick={validateOtp}
                                                                            disabled={
                                                                                !otpCode || otpCode.length !== 6 || isVerifyingOtp
                                                                            }
                                                                        >
                                                                            {isVerifyingOtp ? "Verifying..." : "Validate OTP"}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="form-group">
                                                                <label>
                                                                    Phone <span className="req-astrix">*</span>
                                                                </label>
                                                                <div className="input-group" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                                    <select
                                                                        className="form-control"
                                                                        style={{ maxWidth: "160px" }}
                                                                        value={trainer.countryCode}
                                                                        onChange={(e) =>
                                                                            setTrainer({ ...trainer, countryCode: e.target.value })
                                                                        }
                                                                    >
                                                                        <option value="+1">🇺🇸 United States (+1)</option>
                                                                        <option value="+91">🇮🇳 India (+91)</option>
                                                                        <option value="+44">🇬🇧 United Kingdom (+44)</option>
                                                                        {/* More options could be added here */}
                                                                    </select>
                                                                    <input
                                                                        type="tel"
                                                                        className="form-control"
                                                                        style={{ flex: 1 }}
                                                                        value={trainer.phone}
                                                                        onChange={(e) =>
                                                                            setTrainer({ ...trainer, phone: e.target.value })
                                                                        }
                                                                        required
                                                                        placeholder="Phone number"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className="avatar-uploader">
                                                                <div
                                                                    className={`avatar-preview ${!isEmailVerified || !isOtpVerified ? "avatar-disabled" : ""
                                                                        }`}
                                                                    style={{
                                                                        backgroundImage: `url(${photoPreview || trainer.profile_image})`,
                                                                    }}
                                                                    onClick={() => {
                                                                        if (isEmailVerified && isOtpVerified) {
                                                                            photoInputRef.current?.click();
                                                                        }
                                                                    }}
                                                                >
                                                                    {(!photoPreview || !trainer.profile_image) && (
                                                                        <div className="upload-overlay">
                                                                            <span>Upload Photo</span>
                                                                        </div>
                                                                    )}
                                                                    {(photoPreview ||
                                                                        (trainer.profile_image &&
                                                                            trainer.profile_image !== "/assets/default-avatar.png")) && (
                                                                            <div
                                                                                className="remove-photo"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    removePhoto();
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-times"></i>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    ref={photoInputRef}
                                                                    accept="image/*"
                                                                    onChange={onPhotoSelected}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <button
                                                                    className="btn btn-primary mt-2 w-100"
                                                                    onClick={() => photoInputRef.current?.click()}
                                                                    disabled={!isEmailVerified || !isOtpVerified}
                                                                >
                                                                    Upload Photo
                                                                </button>
                                                                {(!isEmailVerified || !isOtpVerified) && (
                                                                    <small className="text-info mt-2 d-block">
                                                                        Photo upload will be enabled after email address is validated
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {step === 2 && (
                                                <div className="step-content step-slide active">
                                                    <h4>Professional Details</h4>
                                                    <div className="form-group">
                                                        <label>
                                                            Years of Experience <span className="req-astrix">*</span>
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            value={trainer.experience}
                                                            onChange={(e) =>
                                                                setTrainer({ ...trainer, experience: e.target.value })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {experienceOptions.map((exp) => (
                                                                <option key={exp} value={exp}>
                                                                    {exp}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>
                                                            Employment Type <span className="req-astrix">*</span>
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            value={trainer.employmentType}
                                                            onChange={(e) =>
                                                                setTrainer({ ...trainer, employmentType: e.target.value })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {employmentTypeOptions.map((type) => (
                                                                <option key={type} value={type}>
                                                                    {type}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>
                                                            Organization{" "}
                                                            {trainer.employmentType === "Employed" && (
                                                                <span className="req-astrix">*</span>
                                                            )}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={trainer.organization}
                                                            onChange={(e) =>
                                                                setTrainer({ ...trainer, organization: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>
                                                            Designation{" "}
                                                            {trainer.employmentType === "Employed" && (
                                                                <span className="req-astrix">*</span>
                                                            )}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={trainer.job_title}
                                                            onChange={(e) =>
                                                                setTrainer({ ...trainer, job_title: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>
                                                            Area of Expertise <span className="req-astrix">*</span>
                                                        </label>
                                                        <div className="selected-specialties">
                                                            {trainer.specialties.map((item) => (
                                                                <span key={item} className="specialty-tag">
                                                                    {item}
                                                                    <i
                                                                        className="fas fa-times"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setTrainer((prev) => ({
                                                                                ...prev,
                                                                                specialties: prev.specialties.filter((s) => s !== item),
                                                                            }));
                                                                        }}
                                                                    ></i>
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="expertise-btn-wrapper mt-2">
                                                            <button
                                                                type="button"
                                                                className="btn expertise-btn"
                                                                onClick={() => {
                                                                    setTempSelectedSpecialties([...trainer.specialties]);
                                                                    setShowSpecialtiesModal(true);
                                                                }}
                                                            >
                                                                {trainer.specialties.length > 0
                                                                    ? "Edit Expertise"
                                                                    : "Select your areas of expertise"}
                                                            </button>
                                                        </div>

                                                        {/* Modal */}
                                                        {showSpecialtiesModal && (
                                                            <div
                                                                className="modal fade show"
                                                                tabIndex={-1}
                                                                style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
                                                            >
                                                                <div className="modal-dialog modal-dialog-centered">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title">Select Areas of Expertise (Max 3)</h5>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                onClick={() => setShowSpecialtiesModal(false)}
                                                                            ></button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            <div className="specialties-list-modal">
                                                                                {specialtiesOptions.map((item) => (
                                                                                    <div
                                                                                        key={item}
                                                                                        className={`specialty-item ${!isSpecialtySelected(item) &&
                                                                                                tempSelectedSpecialties.length >= MAX_SPECIALTIES
                                                                                                ? "disabled"
                                                                                                : ""
                                                                                            }`}
                                                                                        onClick={() => toggleSpecialty(item)}
                                                                                    >
                                                                                        <div className="specialty-checkbox">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="form-check-input"
                                                                                                checked={isSpecialtySelected(item)}
                                                                                                readOnly
                                                                                            />
                                                                                        </div>
                                                                                        <div className="specialty-content">
                                                                                            <span className="specialty-text">{item}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            {showOtherInput && (
                                                                                <div className="other-expertise-input mt-3">
                                                                                    <label className="form-label">Enter your expertise</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={otherExpertise}
                                                                                        onChange={(e) => updateOtherExpertise(e.target.value)}
                                                                                        placeholder="Type your expertise here..."
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-secondary"
                                                                                onClick={() => setShowSpecialtiesModal(false)}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary"
                                                                                onClick={applySpecialtiesModal}
                                                                            >
                                                                                Apply
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {step === 3 && (
                                                <div className="step-content step-slide active">
                                                    <h4>Profile</h4>
                                                    <div className="form-group">
                                                        <label>
                                                            Professional Summary <span className="req-astrix">*</span>
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            value={trainer.bio}
                                                            onChange={(e) => setTrainer({ ...trainer, bio: e.target.value })}
                                                        ></textarea>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>LinkedIn</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={trainer.linkedin_profile}
                                                            onChange={(e) => setTrainer({ ...trainer, linkedin_profile: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Upload Resume</label>
                                                        <div className="resume-upload-container">
                                                            <div className="input-group">
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept=".pdf,.doc,.docx"
                                                                    onChange={onFileSelected}
                                                                    disabled={!!selectedFileName}
                                                                />
                                                                {selectedFileName && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={removeSelectedFile}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {selectedFileName && (
                                                                <div className="mt-2">
                                                                    <div className="d-flex align-items-center">
                                                                        <span className="text-truncate">{selectedFileName}</span>
                                                                        {trainer.doc_urls.length > 0 && (
                                                                            <span className="badge bg-success ms-2">Uploaded</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 text-center">
                                            {step > 1 && (
                                                <button className="btn btn-secondary me-2" onClick={prevStep}>
                                                    Back
                                                </button>
                                            )}
                                            {step < 3 && (
                                                <button className="btn btn-primary" onClick={nextStep}>
                                                    Next
                                                </button>
                                            )}
                                            {step === 3 && (
                                                <button
                                                    className="btn btn-success"
                                                    onClick={registerTrainer}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Registering..." : "Submit"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
