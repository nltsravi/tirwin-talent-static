"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "@/components/ui/Slider";
import "./home.css";

export default function Home() {
    const router = useRouter();

    const courses = [
        {
            id: "cadad5fc-3dc0-4ec7-85dc-07325147025b",
            badge: "Trending in Logistics",
            image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
            title: "Logistics",
            description: "Holistic knowledge dealing with the practical aspects of moving and storing goods...",
            redirect: true,
        },
        {
            id: "7ee7bc4b-c557-43b6-a3da-590abfed4142",
            badge: "Build Your Career",
            image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/cargo.png",
            title: "Freight & Cargo Management",
            description: "Knowledge related to the process of planning, executing, and controlling the transportation...",
            redirect: true,
        },
        {
            id: "32e1f0b3-2268-496d-9e99-453ca2f179ee",
            badge: "New Logistics Skills",
            image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/warehouse.png",
            title: "Warehouse Operations",
            description: "Knowledge related to the operation and management of warehouses...",
            redirect: false,
        },
        {
            id: "0a64c164-d333-49a0-bbe5-ff5ce30d5b0c",
            badge: "Top Logistics Skills",
            image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/green-logistics.png",
            title: "Sustainability & Green Logistics",
            description: "Knowledge of best practices that minimize the environmental impact of logistics activities.",
            redirect: false,
        },
        {
            id: "61477099-485f-4072-83a8-f4b7508ce086",
            badge: "Trending in Logistics",
            image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
            title: "Logistics Technology & Innovation",
            description: "Knowledge related to the application of advanced technologies and innovative solutions...",
            redirect: false,
        },
    ];

    const [showBecomeTrainerSection, setShowBecomeTrainerSection] = useState(true);
    const [trainers, setTrainers] = useState<any[]>([]);
    const [isLoadingTrainers, setIsLoadingTrainers] = useState(false);
    const [trainersError, setTrainersError] = useState("");

    const trainerCardColors = [
        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    ];
    const trainerBannerColors = [
        "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
    ];

    useEffect(() => {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.user_type === "admin" || user.user_type === "trainer") {
                    setShowBecomeTrainerSection(false);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        setIsLoadingTrainers(true);
        setTrainersError("");
        try {
            const response = await fetch(
                `https://api.tirwintalent.com/api/admin/users/by-type?userType=trainer&isVerified=true`
            );
            const res = await response.json();
            let fetchedTrainers = [];
            if (Array.isArray(res)) {
                fetchedTrainers = res;
            } else if (res && Array.isArray(res.data)) {
                fetchedTrainers = res.data;
            }
            fetchedTrainers.sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
                const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
                return dateB - dateA;
            });

            if (fetchedTrainers.length >= 3) {
                setTrainers(fetchedTrainers.slice(0, 5));
            } else {
                setTrainers([]);
            }
        } catch (error) {
            setTrainersError("Failed to load trainers.");
        } finally {
            setIsLoadingTrainers(false);
        }
    };

    const navigateToLogistics = (item: any) => {
        if (item?.redirect) {
            if (item?.title === "Logistics") {
                router.push("/webinar/events?type=logistics");
            } else {
                router.push("/webinar/masterclass?type=freight-cargo-management");
            }
        }
    };

    const navigateToTrainerRegistration = (event: React.MouseEvent) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        router.push("/auth/trainer-registration");
    };

    const navigateToTrainerDetails = (event: React.MouseEvent, trainer: any) => {
        event.preventDefault();
        router.push(`/trainer/details/${trainer.id}`);
    };

    return (
        <>
            <Slider />
            <div className="home-course-content">
                <h2 className="section-title">Explore Our Categories</h2>
                <p className="section-subtitle">
                    Find Sessions that match your interests and career goals.
                </p>

                <div className="card-grid">
                    {courses.map((course) => (
                        <div className="card" key={course.id}>
                            <a onClick={() => navigateToLogistics(course)} href="#" style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="card-banner">
                                    <span className="badge">{course.badge}</span>
                                    <img src={course.image} alt={course.title} className="course-image" />
                                </div>
                                <div className="card-content">
                                    <h3 className="course-title">{course.title}</h3>
                                    <hr />
                                    <p className="course-type">{course.description}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                <div className="expert-trainers-section" style={{ marginTop: "60px" }}>
                    <h2 className="section-title">Our Expert Trainers</h2>
                    <p className="section-subtitle">
                        Meet our verified trainers who are leaders in their fields.
                    </p>

                    {isLoadingTrainers && (
                        <div className="text-center my-4">
                            <i className="fas fa-spinner fa-spin fa-2x"></i>
                            <div>Loading trainers...</div>
                        </div>
                    )}

                    {trainersError && (
                        <div className="alert alert-danger text-center">{trainersError}</div>
                    )}

                    {!isLoadingTrainers && !trainersError && trainers.length > 0 && (
                        <div className="trainer-card-grid">
                            {trainers.map((trainer, i) => (
                                <div
                                    className="trainer-card"
                                    key={trainer.id || i}
                                    onClick={(e) => navigateToTrainerDetails(e, trainer)}
                                    style={{ background: trainerCardColors[0] }}
                                >
                                    <div
                                        className="trainer-card-banner"
                                        style={{ background: trainerBannerColors[0] }}
                                    ></div>
                                    <div className="trainer-avatar center-over-tile">
                                        {trainer.profile_image ? (
                                            <img
                                                src={trainer.profile_image}
                                                alt={`${trainer.first_name} ${trainer.last_name}`}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {(trainer.first_name?.[0] || "") + (trainer.last_name?.[0] || "")}
                                            </div>
                                        )}
                                    </div>
                                    <div className="trainer-info">
                                        <div className="trainer-name">
                                            {`${trainer.first_name} ${trainer.last_name}`.length > 25
                                                ? trainer.first_name
                                                : `${trainer.first_name} ${trainer.last_name}`}
                                        </div>
                                        {trainer.trainer?.experience && (
                                            <div className="trainer-experience">
                                                <i className="fas fa-briefcase"></i> {trainer.trainer.experience}
                                            </div>
                                        )}
                                        {trainer.trainer?.bio && (
                                            <div className="trainer-bio">
                                                {trainer.trainer.bio.split(" ").slice(0, 15).join(" ")}
                                                {trainer.trainer.bio.split(" ").length > 15 && "..."}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoadingTrainers && !trainersError && trainers.length === 0 && (
                        <div className="text-center text-muted my-4">No trainers found.</div>
                    )}
                </div>

                {showBecomeTrainerSection && (
                    <div className="trainer-section">
                        <div className="trainer-content">
                            <div className="trainer-text">
                                <h2>Become a Trainer</h2>
                                <p>
                                    Join our community of expert trainers and share your knowledge with students around the world. Create courses, host webinars, and earn income while making a difference.
                                </p>
                                <button
                                    className="start-teaching-btn"
                                    onClick={navigateToTrainerRegistration}
                                >
                                    Start Training Today
                                </button>
                            </div>
                            <div className="trainer-image">
                                <img
                                    src="/assets/images/instructor-section.jpg"
                                    alt="Professional trainer teaching online"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
