import React from "react";
import Link from "next/link";
import brandAwarenessData from "../../../../public/assets/brand-awareness.json";
import "./brand.css";

export const metadata = {
    title: "Brand Awareness | Tirwin Talent",
};

export default function BrandAwarenessPage() {
    const data = brandAwarenessData as any;

    return (
        <div className="brand-awareness-page">
            {/* Hero Section */}
            <section className="hero-section d-flex align-items-center justify-content-center text-center text-white">
                <div className="container position-relative px-3 px-md-4">
                    <div className="animate__animated animate__fadeInDown">
                        <h1 className="display-3 fw-bold mb-4">{data.programName}</h1>
                        <p className="h3 mb-4 fw-light text-white-50">{data.programSubline}</p>
                    </div>
                    <div className="w-100 d-flex justify-content-center px-2 mt-3">
                        <Link
                            href="/auth/register"
                            className="btn btn-primary btn-lg px-4 px-md-5 py-3 rounded-pill shadow-lg hero-btn animate__animated animate__fadeInUp animate__delay-1s fw-bold"
                            style={{ maxWidth: "280px", minWidth: "240px" }}
                        >
                            Know More <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="section-padding bg-light-gradient">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6 animate__animated animate__fadeInLeft">
                            <h2 className="display-5 fw-bold mb-4 text-dark">
                                {data.introduction.coreMessage}
                            </h2>
                            <p className="lead text-muted mb-4">
                                {data.introduction.description}
                            </p>
                            <ul className="list-unstyled mt-4">
                                {data.introduction.keyDifferentiators.map((diff: string, idx: number) => (
                                    <li key={idx} className="d-flex align-items-start mb-3">
                                        <div className="bg-primary bg-opacity-10 rounded-circle p-1 me-3 flex-shrink-0">
                                            <i className="bi bi-check-lg text-primary fs-5"></i>
                                        </div>
                                        <span className="fs-5 text-dark">{diff}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-6 animate__animated animate__fadeInRight">
                            <div className="shadow-lg rounded-4 overflow-hidden position-relative group">
                                <img
                                    src="/assets/images/logistics-skills.png"
                                    alt="Logistics Career"
                                    className="w-100 d-block"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="section-padding bg-white">
                <div className="container">
                    <div className="text-center mb-5 animate__animated animate__fadeInUp">
                        <h2 className="display-5 fw-bold mb-4 text-uppercase section-title">
                            {data.whoWeAre.title}
                        </h2>
                        <h2 className="display-5 fw-bold mb-4">
                            {data.whoWeAre.platformIdentity}
                        </h2>
                    </div>

                    <div className="glass-card p-5 mt-5 bg-light border-0">
                        <div className="text-center mb-5">
                            <h3 className="h2 fw-bold text-gradient mb-2">
                                {data.whoWeAre.approach.name}
                            </h3>
                            <div
                                className="d-inline-block bg-primary"
                                style={{ height: "4px", width: "60px", borderRadius: "2px" }}
                            ></div>
                        </div>
                        <div className="row justify-content-center g-4">
                            {data.whoWeAre.approach.steps.map((step: string, i: number) => (
                                <div className="col-md-6 col-lg-3" key={i}>
                                    <div className="step-card text-center position-relative">
                                        <div
                                            className="step-number text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                fontSize: "1.5rem",
                                                fontWeight: 800,
                                            }}
                                        >
                                            {i === 0 && <i className="bi bi-bullseye"></i>}
                                            {i === 1 && <i className="bi bi-mortarboard-fill"></i>}
                                            {i === 2 && <i className="bi bi-people-fill"></i>}
                                            {i === 3 && <i className="bi bi-trophy-fill"></i>}
                                        </div>
                                        <p className="fs-5 fw-medium text-dark">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <p className="h4 text-dark fw-bold fst-italic">
                                &quot;{data.whoWeAre.approach.summary}&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="section-padding bg-light-gradient who-we-serve">
                <div className="container">
                    <div className="text-center mb-5 animate__animated animate__fadeInUp">
                        <h2 className="display-5 fw-bold mb-3 section-title">
                            {data.whoWeServe.title}
                        </h2>
                        <p className="lead text-muted">{data.whoWeServe.bottomLine}</p>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {data.whoWeServe.targetSegments.map((segment: any, idx: number) => (
                            <div className="col-md-6 col-lg-4" key={idx}>
                                <div className="card h-100 border-0 shadow-sm hover-card rounded-4 overflow-hidden bg-white">
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="mb-3">
                                            <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold">
                                                {segment.segment}
                                            </span>
                                        </div>
                                        <div className="mb-4 flex-grow-1">
                                            {segment.painPoints.map((pain: string, pIdx: number) => (
                                                <p
                                                    className="text-dark mb-3 d-flex align-items-start fw-medium"
                                                    key={pIdx}
                                                >
                                                    <i className="bi bi-exclamation-circle text-danger me-2 mt-1 fs-5"></i>
                                                    <span>{pain}</span>
                                                </p>
                                            ))}
                                        </div>
                                        <div className="mt-auto p-3 bg-white rounded-3 border border-primary border-2">
                                            <div className="d-flex align-items-start text-primary fw-bold">
                                                <i className="bi bi-lightbulb-fill me-2 mt-1 fs-5"></i>
                                                <span>{segment.valueProp}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-white">
                <div className="container">
                    <h2 className="display-5 fw-bold text-center mb-5 section-title">
                        {data.whyChooseUs.title}
                    </h2>
                    <div className="row g-4">
                        {data.whyChooseUs.reasons.map((reason: any, idx: number) => (
                            <div className="col-lg-6" key={idx}>
                                <div className="h-100 border rounded-4 shadow-sm bg-white hover-card overflow-hidden">
                                    <div className="banner-image-container">
                                        <img
                                            src={reason.image}
                                            alt={reason.heading}
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="h4 fw-bold mb-3">{reason.heading}</h3>
                                        <ul className="list-unstyled text-muted">
                                            {reason.details.map((detail: string, dIdx: number) => (
                                                <li key={dIdx} className="mb-2 d-flex align-items-start">
                                                    <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {reason.trustedBy && (
                                            <div className="mt-3 d-flex flex-wrap gap-2">
                                                {reason.trustedBy.map((company: string, cIdx: number) => (
                                                    <span
                                                        key={cIdx}
                                                        className="badge bg-primary text-white border border-primary fw-medium px-3 py-2"
                                                    >
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Journey */}
            <section className="section-padding bg-light">
                <div className="container">
                    <h2 className="display-5 fw-bold text-center mb-5 section-title">
                        {data.programJourney.title}
                    </h2>
                    <div className="position-relative">
                        {/* Connecting Line (Desktop) */}
                        <div
                            className="d-none d-lg-block position-absolute top-50 start-0 w-100 border-top border-3 border-primary border-opacity-25"
                            style={{ zIndex: 0, transform: "translateY(-50%)" }}
                        ></div>

                        <div className="row text-center g-4 position-relative z-1">
                            {data.programJourney.steps.map((step: any, i: number) => (
                                <div className="col-lg" key={i}>
                                    <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light hover-card d-flex flex-column align-items-center">
                                        <div className="bg-white p-2 rounded-circle mb-3 shadow-sm">
                                            <div
                                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    fontSize: "1.8rem",
                                                }}
                                            >
                                                {i === 0 && <i className="bi bi-compass"></i>}
                                                {i === 1 && <i className="bi bi-book-fill"></i>}
                                                {i === 2 && <i className="bi bi-clipboard-check-fill"></i>}
                                                {i === 3 && <i className="bi bi-briefcase-fill"></i>}
                                                {i === 4 && <i className="bi bi-graph-up-arrow"></i>}
                                            </div>
                                        </div>
                                        <h3 className="h5 fw-bold mb-3 text-uppercase ls-1">
                                            {step.name}
                                        </h3>
                                        <ul className="list-unstyled small text-muted text-start w-100 px-2">
                                            {step.actions.map((action: string, aIdx: number) => (
                                                <li key={aIdx} className="mb-2 d-flex align-items-start">
                                                    <i className="bi bi-caret-right-fill text-primary me-2 mt-1"></i>
                                                    <span>{action}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="section-padding text-center" id="contact">
                <div className="container">
                    <div
                        className="bg-dark text-white p-5 rounded-5 shadow-lg position-relative overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                        }}
                    >
                        <div className="position-absolute top-0 end-0 p-5" style={{ opacity: 0.1 }}>
                            <i
                                className="bi bi-rocket-takeoff-fill"
                                style={{ fontSize: "15rem", transform: "rotate(45deg)" }}
                            ></i>
                        </div>
                        <div className="position-relative z-1">
                            <h2 className="display-4 fw-bold mb-4">
                                {data.callToAction.headline}
                            </h2>
                            <p className="lead mb-5 text-light opacity-75">
                                {data.callToAction.action}
                            </p>
                            <Link
                                href="/auth/register"
                                className="btn btn-success btn-lg px-5 py-4 rounded-pill shadow-lg mb-4 animate__animated animate__pulse animate__infinite fw-bold fs-5 d-none d-md-inline-block"
                            >
                                {data.callToAction.buttonText}{" "}
                                <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                            </Link>
                            <Link
                                href="/auth/register"
                                className="d-inline-block d-md-none text-success fw-bold fs-5 text-decoration-underline mb-4"
                            >
                                {data.callToAction.buttonText} <i className="bi bi-arrow-right"></i>
                            </Link>
                            <p
                                className="text-white-50 fst-italic mt-3"
                                style={{ maxWidth: "600px", margin: "0 auto" }}
                            >
                                {data.callToAction.closingMessage}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
