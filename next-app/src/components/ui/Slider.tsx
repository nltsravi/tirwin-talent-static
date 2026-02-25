"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Slider() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!sessionStorage.getItem("authToken") || !!sessionStorage.getItem("user"));
    }, []);

    const slide = {
        title: "Empowering Growth Through Skill-Based Talent Strategies",
        description: "A transformative approach to talent management for the Supply Chain, Logistics, and Cargo industries.",
        image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/banner-image-slider.png",
    };

    return (
        <div className="banner d-flex flex-column flex-md-row align-items-center">
            <div className="banner-content text-md-left">
                <h1 className="animate-title">{slide.title}</h1>
                <p className="animate-description" dangerouslySetInnerHTML={{ __html: slide.description }}></p>

                <div className="button-group">
                    {!isAuthenticated ? (
                        <Link href="/auth/register" className="btn btn-primary">
                            Start your Journey with us
                        </Link>
                    ) : (
                        <>
                            <Link href="/webinar/masterclass" className="btn btn-primary">
                                Master Classes
                            </Link>
                            <Link href="/webinar/events" className="btn btn-primary ms-2">
                                Events
                            </Link>
                            <Link href="/webinar/training" className="btn btn-primary ms-2">
                                Training
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="banner-image">
                <img src={slide.image} alt="Banner Image" className="img-fluid" />
            </div>
        </div>
    );
}
