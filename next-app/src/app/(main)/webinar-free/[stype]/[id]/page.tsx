"use client";


import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WebinarService } from "@/services/webinar.service";
import "./webinar-free-details.css";

// Interface mimicking the JSON structure
interface WebinarData {
  title: string;
  tagline: string;
  priceINR: number;
  regUrl: string;
  altRegUrl: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  displayDate?: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  platform: string;
  whyAttend: string[];
  learn: string[];
  audience: string[];
  proof: string[];
  careerJourney: { title: string; icon: string; points: string[] }[];
  faqs: { q: string; a: string }[];
  finalCtaText: string;
}

export default function WebinarFreeDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [webinar, setWebinar] = useState<any>(null);
  const [fallbackData, setFallbackData] = useState<WebinarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPageType, setCurrentPageType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [joinNow, setJoinNow] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const webinarId = params.id as string;
  const pageType = params.stype as string;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageType === "masterclass") {
      setCurrentPageType("Master Class");
    } else if (pageType === "events") {
      setCurrentPageType("Event");
    } else {
      setCurrentPageType("Training");
    }

    if (typeof window !== "undefined") {
      setIsLoggedIn(!!sessionStorage.getItem("authToken"));
    }

    loadNewWebinarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webinarId, pageType]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentPageType === "Event" && webinar?.start_time) {
      const checkJoinTime = () => {
        if (!webinar?.start_time) return;
        const eventIST = new Date(webinar.start_time).getTime();
        const joinIST = eventIST - 10 * 60 * 1000;
        const now = new Date().getTime();

        if (now >= joinIST) {
          setJoinNow(true);
          setTimeLeft("");
        } else {
          const diff = joinIST - now;
          const hrs = Math.floor((diff / 1000 / 60 / 60) % 24);
          const mins = Math.floor((diff / 1000 / 60) % 60);
          const secs = Math.floor((diff / 1000) % 60);
          setTimeLeft(
            `\${hrs < 10 ? "0" + hrs : hrs}h \${
              mins < 10 ? "0" + mins : mins
            }m \${secs < 10 ? "0" + secs : secs}s`
          );
        }
      };
      checkJoinTime();
      interval = setInterval(checkJoinTime, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentPageType, webinar]);

  const loadNewWebinarData = async () => {
    try {
      const response = await fetch(`/assets/webinar_data.json?_ts=\${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data: WebinarData = await response.json();

      setFallbackData(data);
      setWebinar({
        id: "new-webinar-001",
        title: data.title,
        description: data.tagline,
        display_date: data.displayDate,
        price: data.priceINR,
        start_time: data.date + "T" + data.startTime + ":00",
        end_time: data.date + "T" + data.endTime + ":00",
        category: { name: "Logistics Leadership" },
        subcategory: { name: "Career Development" },
        is_paid: true,
        isUserRegistered: false,
        registrationClosed: false,
        additional_info: {
          benefits: data.whyAttend.map((item) => ({ Title: "", Description: item })),
          course_objectives: data.learn.map((item) => ({ Title: "", Description: item })),
          target_audience: data.audience.map((item) => ({ Title: "", Description: item })),
          key_take_aways: data.learn.map((item) => ({ Title: "", Description: item })),
        },
        trainer: {
          user: {
            first_name: "Tirwin",
            last_name: "Management",
          },
          organization: "Tirwin Management Services",
          profile_image: "https://via.placeholder.com/100",
          experience: "15+",
          bio: "Leading logistics and supply chain education with 15+ years of industry experience.",
        },
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading new webinar data:", error);
      setErrorMessage("Failed to load webinar details.");
      setIsLoading(false);
    }
  };

  const containsHtml = (content: string) => {
    if (!content) return false;
    return /<[^>]*>/.test(content);
  };

  const isTBDDate = (dateString: string) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date.getFullYear() === 2000 && date.getMonth() === 0 && date.getDate() === 1;
  };

  const formatDisplayDate = (dateString: string, format: string = "date") => {
    if (!dateString || isTBDDate(dateString)) {
      return "TBD";
    }
    const date = new Date(dateString);
    if (format === "date") {
      return date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } else if (format === "time") {
      return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
    }
    return date.toString();
  };

  const formatTime = (timeString: string) => {
    if (!timeString || isTBDDate(timeString)) {
      return "TBD";
    }
    let date: Date;
    if (timeString.includes("T")) {
      const parsedDate = new Date(timeString);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      } else {
        const [hours, minutes] = timeString.split(":");
        date = new Date();
        date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
      }
    } else {
      const [hours, minutes] = timeString.split(":");
      date = new Date();
      date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
    }
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openConfirmationModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegisterAction = () => {
    setShowModal(false);
    if (!isLoggedIn) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("returnUrl", window.location.pathname);
      }
      // Add isFree=true properly
    }
    router.push(`/auth/register/\${pageType || "masterclass"}/\${webinarId}?isFree=true`);
  };

  const socialLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("returnUrl", window.location.pathname);
    }
    router.push(`/auth/register/\${pageType || "masterclass"}/\${webinarId}?isFree=true`);
  };

  const faqs = (fallbackData?.faqs || []).filter(
    (f) => !f.q.toLowerCase().includes("priced at") && !f.q.includes("99")
  );

  if (isLoading) {
    return (
      <div className="container" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <div className="card p-xl text-center py-5">
          <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
          <p>Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <div className="card p-xl text-center">
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ paddingTop: "80px", background: "#f2f4f7" }}>
      {/* Hero Section */}
      <div className="hero-section text-center text-white py-5" style={{ background: "linear-gradient(to right, #2563eb, #1e40af)" }}>
        <div className="container py-4">
          <h1 className="display-5 fw-bold mb-3">{webinar?.title || fallbackData?.title}</h1>
          <p className="lead mb-4">{webinar?.description || fallbackData?.tagline}</p>
          <div
            className="d-inline-block px-4 py-2 rounded-pill shadow-sm"
            style={{ backgroundColor: "#ff5a5f", cursor: "pointer", fontWeight: "bold" }}
            onClick={openConfirmationModal}
          >
            Limited Seats Only
          </div>
        </div>
      </div>

      {/* Main Content with Two Column Layout */}
      <div className="container two-column-layout my-5">
        {/* Left Column - Content */}
        <div className="left-column">
          {/* Why Attend This Webinar Card */}
          <div className="section mb-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h3 className="h4 fw-bold text-center mb-4" style={{ color: "#1e3a8a" }}>Why attend this Webinar?</h3>
              <ul className="list-unstyled mb-4">
                {(webinar?.additional_info?.benefits || []).map((b: any, i: number) => {
                  const title = b.Title ? `\${b.Title} ` : "";
                  const desc = b.Description || "";
                  const content = title + desc;
                  return (
                    <li key={i} className="mb-3 d-flex align-items-start">
                      <span className="me-2 text-primary">✔</span>
                      {containsHtml(content) ? (
                        <span dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <span>{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="text-center mb-4">
                <p className="fst-italic text-muted mb-1">All this for Free!</p>
                <p className="fw-bold text-danger">Seats are limited! Secure your spot now.</p>
              </div>
              <button
                className="btn btn-outline-primary w-100 fw-bold py-2 rounded-3"
                onClick={openConfirmationModal}
              >
                Register Now For Free
              </button>
            </div>
          </div>

          {/* What You'll Learn Section */}
          {webinar?.additional_info?.course_objectives && webinar.additional_info.course_objectives.length > 0 && (
            <div className="section mb-4">
              <h2 className="h4 fw-bold mb-3">What You&#39;ll Learn</h2>
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <ul className="list-unstyled mb-0">
                  {webinar.additional_info.course_objectives.map((item: any, idx: number) => (
                    <li key={idx} className="mb-3">
                      {item.Title && <strong className="me-2">{item.Title}</strong>}
                      {containsHtml(item.Description) ? (
                        <span dangerouslySetInnerHTML={{ __html: item.Description }} />
                      ) : (
                        <span>{item.Description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Who Should Attend Section */}
          {webinar?.additional_info?.target_audience && webinar.additional_info.target_audience.length > 0 && (
            <div className="section mb-4">
              <h2 className="h4 fw-bold mb-3">Who Should Attend?</h2>
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <ul className="list-unstyled mb-0">
                  {webinar.additional_info.target_audience.map((item: any, idx: number) => {
                    const content = (item.Title ? `\${item.Title} ` : "") + (item.Description || "");
                    return (
                      <li key={idx} className="mb-3">
                        {containsHtml(content) ? (
                          <span dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <span>{content}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Career Journey Section */}
          {fallbackData?.careerJourney && fallbackData.careerJourney.length > 0 && (
            <div className="section mb-4">
              <h2 className="h4 fw-bold text-center mb-4">Logistics Career compass - Career journey from Tirwin Talent</h2>
              <div className="row g-4">
                {fallbackData.careerJourney.map((step, idx) => (
                  <div className="col-md-6 col-lg-4 d-flex" key={idx}>
                    <div className="card border-0 shadow-sm rounded-4 w-100 p-4 text-center">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm text-white fs-3"
                        style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #1e3a8a, #7c3aed)" }}
                      >
                        {step.icon === "compass" ? "🧭" :
                          step.icon === "book" ? "📖" :
                            step.icon === "clipboard" ? "📋" :
                              step.icon === "briefcase" ? "💼" :
                                step.icon === "chart" ? "📈" : "⭐"}
                      </div>
                      <h3 className="h6 fw-bold mb-3 text-uppercase" style={{ color: "#1e3a8a" }}>{step.title}</h3>
                      <ul className="list-unstyled text-start m-0">
                        {step.points.map((point, i) => (
                          <li key={i} className="mb-2 small text-muted d-flex align-items-start">
                            <span className="me-2" style={{ color: "#1e3a8a", fontSize: "10px", marginTop: "4px" }}>▶</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proof Points Section */}
          <div className="section mb-4">
            <div className="row g-3">
              <div className="col-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                  <div className="fs-1 fw-bold text-primary mb-1">100+</div>
                  <div className="small text-muted">students trained through Tirwin Talent programs</div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                  <div className="fs-1 fw-bold text-primary mb-1">15+</div>
                  <div className="small text-muted">years of industry experience</div>
                </div>
              </div>
              <div className="col-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                  <div className="fs-1 fw-bold text-primary mb-1">10+</div>
                  <div className="small text-muted">industry experts and mentors</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          {faqs.length > 0 && (
            <div className="section mb-4">
              <h2 className="h4 fw-bold mb-3">FAQs</h2>
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="accordion" id="faqAccordion">
                  {faqs.map((faq, idx) => (
                    <div className="accordion-item border-0 mb-3" key={idx}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed fw-bold rounded bg-light"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faqCollapse\${idx}`}
                          aria-expanded="false"
                        >
                          {faq.q}
                        </button>
                      </h2>
                      <div id={`faqCollapse\${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-muted">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Secure Your Spot Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center">
            <button
              className="btn btn-primary btn-lg w-100 fw-bold rounded-pill mb-3 shadow-sm"
              onClick={openConfirmationModal}
              style={{ background: "linear-gradient(90deg, #1e3a8a, #7c3aed)", border: "none" }}
            >
              Secure Your Spot (Free)
            </button>
            <p className="text-muted small mb-2">Seats are limited! Complete your registration to receive the Zoom link.</p>
            <p className="text-muted small mb-0">
              You&#39;ll receive the confirmation email with joining details immediately after registration.
            </p>
          </div>

          {/* Final CTA Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
            <p className="fw-bold mb-4">{fallbackData?.finalCtaText || "Your career in Logistics starts here. Learn from industry leaders, gain clarity, and take the first step toward your future with Tirwin."}</p>
            <button
              className="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow-sm"
              onClick={openConfirmationModal}
              style={{ background: "linear-gradient(90deg, #1e3a8a, #7c3aed)", border: "none" }}
            >
              Register Now For Free
            </button>
          </div>
        </div>

        {/* Right Column - Registration Card */}
        <div className="right-column d-none d-lg-block">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: "100px", zIndex: 10 }}>
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3 pb-3 border-bottom border-dashed">
                  <span className="me-3 fs-5">📅</span>
                  <span className="small text-muted">{webinar?.display_date || formatDisplayDate(webinar?.start_time || "2025-10-02")}</span>
                </div>
                <div className="d-flex align-items-center mb-3 pb-3 border-bottom border-dashed">
                  <span className="me-3 fs-5">⏰</span>
                  <span className="small text-muted">
                    {formatTime(webinar?.start_time || "16:30")} - {formatTime(webinar?.end_time || "18:30")}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-3 fs-5">💻</span>
                  <span className="small text-muted">{fallbackData?.platform || "Zoom (link will be shared after registration)"}</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn btn-primary w-100 fw-bold py-3 rounded-3 shadow-sm mb-3"
                  onClick={openConfirmationModal}
                  style={{ background: "linear-gradient(135deg, #1e3a8a, #7c3aed)", border: "none" }}
                >
                  Register Now For Free
                </button>
                <p className="small text-muted mb-0">Seats are limited! Complete your registration to receive the Zoom link.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Registration</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to register for &quot;{webinar?.title || fallbackData?.title}&quot;?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleRegisterAction}>
                  Yes, Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
