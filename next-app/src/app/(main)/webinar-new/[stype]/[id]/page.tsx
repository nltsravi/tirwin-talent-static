"use client";


import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WebinarService } from "@/services/webinar.service";
import "./webinar-new-details.css";

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

export default function WebinarNewDetailsPage() {
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

    // Load static JSON data
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
      // In Next.js App Router, public assets are in public/ folder.
      // So /assets/webinar_data.json should be accessible but let's assume it was moved or is available.
      // Easiest is to fetch it from /assets/webinar_data.json
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

  const getDisplayPrice = () => {
    const price = parseFloat(webinar?.price || fallbackData?.priceINR?.toString() || "99");
    if (price === 0 || price === 0.0) {
      return "Free";
    }
    return `₹\${price}`;
  };

  const formatTrainerName = (firstName: string, lastName: string) => {
    if ((!firstName || firstName === "TBD") && (!lastName || lastName === "TBD")) {
      return "TBD";
    }
    if (!firstName || firstName === "TBD") {
      return lastName || "TBD";
    }
    if (!lastName || lastName === "TBD") {
      return firstName || "TBD";
    }
    return `\${firstName} \${lastName}`;
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
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } else if (format === "time") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    return date.toString();
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
      router.push(`/auth/register/\${pageType || "masterclass"}/\${webinarId}`);
      return;
    }
    router.push(`/auth/register/\${pageType || "masterclass"}/\${webinarId}`);
  };

  const socialLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("returnUrl", window.location.pathname);
    }
    router.push(`/auth/register/\${pageType || "masterclass"}/\${webinarId}`);
  };

  if (isLoading) {
    return (
      <div className="text-center min-vh-100 d-flex justify-content-center align-items-center" style={{ paddingTop: "80px" }}>
        <div>
          <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
          <p>Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container py-5 min-vh-100" style={{ paddingTop: "80px" }}>
        <div className="alert alert-danger text-center">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="inspiro-theme min-vh-100" style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <section
        className="hero-section text-light py-5"
        style={{ background: "linear-gradient(to right, #2563eb, #1e40af)" }}
      >
        <div className="container text-left">
          <span className="badge badge-no-outline me-2">{webinar?.category?.name || "Category"}</span>
          <h1 className="display-4 fw-bold">{webinar?.title || fallbackData?.title}</h1>
        </div>
      </section>

      {/* Webinar Details */}
      <section className="container py-5">
        <div className="row">
          {/* Main Info */}
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 mb-4">
              <h2 className="h3 fw-bold mb-4">About this {currentPageType}</h2>

              {currentPageType !== "Training" ? (
                <div className="row text-center">
                  <div className="col-6 col-md-3 mb-3 text-start text-md-center">
                    <i className="fas fa-calendar-alt text-primary mb-2"></i>
                    <div>{formatDisplayDate(webinar?.start_time, "date")}</div>
                  </div>
                  <div className="col-6 col-md-3 mb-3 text-start text-md-center">
                    <i className="fas fa-clock text-primary mb-2"></i>
                    <div>
                      {formatDisplayDate(webinar?.start_time, "time")} -{" "}
                      {formatDisplayDate(webinar?.end_time, "time")}
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3 text-start text-md-center">
                    <i className="fas fa-user text-primary mb-2"></i>
                    <div>
                      {webinar?.trainers
                        ? webinar.trainers.map((t: any, idx: number) => (
                          <span key={t.id || idx}>
                            {formatTrainerName(t.user.first_name, t.user.last_name)}
                            <br />
                          </span>
                        ))
                        : formatTrainerName(
                          webinar?.trainer?.user?.first_name,
                          webinar?.trainer?.user?.last_name
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-6 col-md-4 mb-3">
                    <i className="fas fa-calendar-alt text-primary me-2"></i>
                    {webinar?.additional_info?.aboutTraining?.start_date} -{" "}
                    {webinar?.additional_info?.aboutTraining?.end_date}
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    {webinar?.additional_info?.aboutTraining?.location}
                  </div>
                  <div className="col-6 col-md-4 mb-3">
                    <i className="fas fa-user text-primary me-2"></i>
                    {webinar?.additional_info?.aboutTraining?.training_type}
                  </div>
                </div>
              )}
            </div>

            {/* Course Objectives */}
            {webinar?.additional_info?.course_objectives && (
              <div className="card mb-3">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0 fw-bold">Course Objective</h2>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {webinar.additional_info.course_objectives.map((obj: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        {obj.Title && <strong className="me-2">{obj.Title}</strong>}
                        {containsHtml(obj.Description) ? (
                          <span dangerouslySetInnerHTML={{ __html: obj.Description }} />
                        ) : (
                          <span>{obj.Description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Details/Structure */}
            <div className="card mb-3">
              <div className="card-header bg-white">
                <h2 className="h5 mb-0 fw-bold">{currentPageType} Details</h2>
              </div>
              <div className="card-body">
                <p>{webinar?.description || fallbackData?.tagline}</p>
                {webinar?.additional_info?.course_structure && (
                  <ul className="list-unstyled mt-3">
                    {webinar.additional_info.course_structure.map((struct: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        <strong>{struct.Title}</strong> {struct.Description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Key Takeaways */}
            {webinar?.additional_info?.key_take_aways && (
              <div className="card mb-3">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0 fw-bold">Key Takeaways</h2>
                </div>
                <div className="card-body">
                  <ul className="key-takeaways-list list-unstyled m-0 p-0">
                    {webinar.additional_info.key_take_aways.map((takeaway: any, idx: number) => (
                      <li key={idx}>
                        {takeaway.Title && <strong>{takeaway.Title}</strong>}
                        {containsHtml(takeaway.Description) ? (
                          <span dangerouslySetInnerHTML={{ __html: takeaway.Description }} />
                        ) : (
                          <span>{takeaway.Description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {webinar?.additional_info?.target_audience && (
              <div className="card mb-3">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0 fw-bold">Target Audience</h2>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {webinar.additional_info.target_audience.map((aud: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        {aud.Title && <strong className="me-2">{aud.Title}</strong>}
                        {containsHtml(aud.Description) ? (
                          <span dangerouslySetInnerHTML={{ __html: aud.Description }} />
                        ) : (
                          <span>{aud.Description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Benefits */}
            {webinar?.additional_info?.benefits && (
              <div className="card mb-3">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0 fw-bold">Benefits</h2>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {webinar.additional_info.benefits.map((ben: any, idx: number) => (
                      <li key={idx} className="mb-2">
                        {ben.Title && <strong className="me-2">{ben.Title}</strong>}
                        {containsHtml(ben.Description) ? (
                          <span dangerouslySetInnerHTML={{ __html: ben.Description }} />
                        ) : (
                          <span>{ben.Description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-4 sticky-top" style={{ top: "100px", zIndex: 10 }}>
              {!webinar?.registrationClosed ? (
                <div className="text-center">
                  {!webinar?.isUserRegistered && (
                    <h2 className="h3 fw-bold text-dark">
                      {getDisplayPrice()}
                    </h2>
                  )}
                  {currentPageType === "Training" && webinar?.is_paid && !webinar?.isUserRegistered && (
                    <span className="text-muted d-block mb-2">(excluding GST)</span>
                  )}

                  {/* Enrolled Button */}
                  {webinar?.isUserRegistered && currentPageType !== "Event" && (
                    <button className="btn btn-success btn-lg w-100 mt-3" disabled>
                      Enrolled
                    </button>
                  )}

                  {/* Event Join */}
                  {webinar?.isUserRegistered && currentPageType === "Event" && (
                    <div>
                      {!joinNow ? (
                        <button className="btn btn-success btn-lg w-100 mt-3 font-btn" disabled>
                          Starts in {timeLeft}
                        </button>
                      ) : (
                        <a
                          className="btn btn-success btn-lg w-100 mt-3"
                          href="https://zoom.us/j/2024140404?pwd=3GmvlEVQ8myG0L87peGTc1KCepLb2T.1&omn=95727757611"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Join Now
                        </a>
                      )}
                    </div>
                  )}

                  {/* Show Register Now if logged in or allow login */}
                  {!webinar?.isUserRegistered && isLoggedIn && (
                    <>
                      <button
                        className="btn btn-primary btn-lg w-100 mt-3"
                        disabled={!webinar?.start_time}
                        onClick={openConfirmationModal}
                      >
                        {fallbackData?.ctaPrimaryLabel || "Register Now"}
                      </button>
                      {!joinNow && currentPageType === "Event" && (
                        <div className="mt-2 text-muted">Starts in {timeLeft}</div>
                      )}
                    </>
                  )}

                  {/* Login prompt if not logged in */}
                  {!isLoggedIn && (
                    <div className="login-box mt-4">
                      <h4 className="text-center mb-3 fw-bold">Sign up to Complete Registration</h4>
                      <button className="btn btn-primary w-100" onClick={socialLogin}>
                        Sign Up / Login
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-secondary btn-lg w-100 mt-3"
                  disabled
                >
                  Registration Closed
                </button>
              )}
            </div>

            {/* Trainer Profile Section */}
            {webinar?.trainers && webinar.trainers.length > 0 ? (
              <div className="mt-4">
                <h2 className="h4 fw-bold text-left mb-3">Trainer Profile(s)</h2>
                <ul className="list-unstyled mb-4">
                  {webinar.trainers.map((trainer: any, idx: number) => (
                    <li key={idx} className="d-flex align-items-center mb-3">
                      {trainer.profile_image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={trainer.profile_image}
                          alt={trainer.user.first_name}
                          className="rounded-circle me-3"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle me-3 bg-secondary d-flex justify-content-center align-items-center text-white fw-bold"
                          style={{ width: "60px", height: "60px" }}
                        >
                          {trainer.user.first_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold">
                          {formatTrainerName(trainer.user.first_name, trainer.user.last_name)}
                        </div>
                        {trainer.organization && (
                          <div className="text-muted small">{trainer.organization}</div>
                        )}
                        {trainer.title && (
                          <div className="text-muted small">{trainer.title}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : webinar?.trainer ? (
              <div className="card trainer-profile-card shadow-sm p-4 mt-4 text-center">
                <h2 className="h4 fw-bold text-left mb-3">Trainer Profile</h2>
                <div className="d-flex justify-content-center mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={webinar?.trainer?.profile_image || "https://via.placeholder.com/100"}
                    className="trainer-profile-img border"
                    alt="Trainer"
                  />
                </div>
                <div className="trainer-info">
                  <h5 className="mb-1 fw-bold text-dark">
                    {formatTrainerName(
                      webinar?.trainer?.user?.first_name,
                      webinar?.trainer?.user?.last_name
                    )}
                  </h5>
                  <p className="text-muted mb-2 small">
                    {webinar?.trainer?.organization || "FedEx Logistics"}
                  </p>
                  <div className="trainer-stats d-flex justify-content-center mb-3">
                    <span className="badge bg-light text-dark me-2">
                      <i className="fas fa-chalkboard-teacher text-primary me-1"></i>
                      {webinar?.trainer?.experience || "5"}+ years
                    </span>
                  </div>
                  <p className="text-muted trainer-bio m-0" style={{ fontSize: "0.9rem" }}>
                    {webinar?.trainer?.bio}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

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
