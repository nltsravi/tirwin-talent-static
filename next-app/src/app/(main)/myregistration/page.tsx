"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WebinarService } from "@/services/webinar.service";
import "./myregistration.css";

export default function MyRegistrationPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("masterclass");
    const [webinars, setWebinars] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLoggedIn(!!sessionStorage.getItem("authToken"));
        }
        fetchWebinars(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchWebinars = async (stype: string) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            // Use WebinarService for my-webinars
            const data = await WebinarService.getWebinars(stype, "myWebinars");

            const formattedData = data.map((webinar: any) => ({
                id: webinar.id,
                title: webinar.title,
                description: webinar.description,
                session_type: webinar.session_type,
                session_description: webinar.session_description,
                trainer_ids: webinar.trainer_ids,
                image: webinar.media?.find((m: any) => m.media_type === "banner")?.media_url || "https://via.placeholder.com/300",
                author: activeTab === "events"
                    ? "Panel Members"
                    : webinar.trainer?.user ?`\${webinar.trainer.user.first_name} \${webinar.trainer.user.last_name}` : "TBD",
        start_time: webinar.start_time ? new Date(webinar.start_time).toLocaleDateString() : null,
        end_time: webinar.end_time ? new Date(webinar.end_time).toLocaleTimeString() : null,
        category: webinar.category?.name || "General",
        isNew: new Date(webinar.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }));

      setWebinars(formattedData);
    } catch (error) {
      console.error("Error fetching webinars:", error);
      setErrorMessage("Failed to load your registrations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const viewDetails = (webinar: any) => {
    router.push(`/webinar/\${activeTab}/\${webinar.id}`);
  };

  return (
    <div className="container-fluid min-vh-100" style={{ paddingTop: "100px", paddingBottom: "60px", background: "#f8f9fa" }}>
      <div className="container mt-4">
        
        <h2 className="mb-4 fw-bold">My Courses & Events</h2>

        {/* Tabs Section */}
        <ul className="nav nav-pills mb-4 nav-fill shadow-sm rounded-pill p-1 bg-white" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-bold rounded-pill \${activeTab === "masterclass" ? "active bg-primary text-white" : "text-dark"}`}
              onClick={() => setActiveTab("masterclass")}
            >
              Master Classes
            </button>
          </li>
          {isLoggedIn && (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold rounded-pill \${activeTab === "events" ? "active bg-primary text-white" : "text-dark"}`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link fw-bold rounded-pill \${activeTab === "training" ? "active bg-primary text-white" : "text-dark"}`}
                onClick={() => setActiveTab("training")}
              >
                Training
              </button>
            </li>
          )}
        </ul>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center py-5">
            <i className="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
            <p className="text-muted">Loading your {activeTab}...</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger text-center shadow-sm border-0 rounded-3">
            {errorMessage}
          </div>
        )}

        {/* Tab Content */}
        {!isLoading && !errorMessage && (
          <div className="tab-content" id="myCoursesContent">
            
            {webinars.length > 0 ? (
              <div className="row g-4">
                {webinars.map((webinar: any, index: number) => (
                  <div key={webinar.id || index} className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden webinar-card">
                      {/* Banner Section */}
                      <div className="position-relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={webinar.image}
                          className="card-img-top object-fit-cover"
                          style={{ height: "180px" }}
                          alt={webinar.title}
                        />
                        {webinar.isNew && (
                          <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm">
                            New
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="card-body d-flex flex-column p-4">
                        <h5 className="card-title fw-bold mb-3">{webinar.title}</h5>
                        <p className="card-text text-muted small flex-grow-1 mb-4">
                          {webinar.description?.substring(0, 100)}
                          {webinar.description?.length > 100 ? "..." : ""}
                        </p>
                        
                        <div className="mb-4">
                          <p className="text-muted small mb-2 d-flex align-items-center">
                            <i className="fas fa-user-circle text-primary me-2"></i> 
                            <span className="fw-semibold text-dark">{webinar.author}</span>
                          </p>
                          <p className="text-muted small mb-0 d-flex align-items-start">
                            <i className="fas fa-calendar-alt text-primary me-2 mt-1"></i>
                            <span>
                              {webinar.start_time && webinar.end_time
                                ? activeTab === "masterclass" 
                                  ? `April 10, 2025 4:00 PM - 5:00 PM`
                                  : `\${webinar.start_time} | \${webinar.end_time}`
                                : "TBD"}
                            </span>
                          </p>
                        </div>
                        
                        <button
                          className="btn btn-outline-primary w-100 fw-bold rounded-pill py-2 mt-auto text-uppercase"
                          onClick={() => viewDetails(webinar)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-white shadow-sm rounded-4">
                <i className="fas fa-calendar-times fa-3x text-muted mb-3 opacity-50"></i>
                <h4 className="fw-bold text-dark">No registrations found</h4>
                <p className="text-muted">You haven&#39;t registered for any {activeTab} yet. Browse our events to get started!</p>
                <button 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold mt-2"
                  onClick={() => router.push(`/webinar/\${activeTab}`)}
                >
                  Browse {activeTab}
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
