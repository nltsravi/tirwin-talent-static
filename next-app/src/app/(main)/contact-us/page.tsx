import React from "react";
import "./contact.css";

export const metadata = {
    title: "Contact Us | Tirwin Talent",
};

export default function ContactUsPage() {
    return (
        <div className="contact-us-page">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="page-header">
                            <h1>Contact Us</h1>
                            <p className="tagline">Get in Touch with TIRWIN</p>
                        </div>

                        <div className="contact-content">
                            <div className="row">
                                <div className="col-12">
                                    <section className="contact-section">
                                        <h2>Get in Touch</h2>
                                        <p className="section-description">
                                            We&apos;d love to hear from you. Reach out to us for any
                                            inquiries, partnerships, or support.
                                        </p>

                                        <div className="contact-info">
                                            <div className="contact-item">
                                                <div className="contact-icon">
                                                    <i className="fas fa-map-marker-alt"></i>
                                                </div>
                                                <div className="contact-details">
                                                    <h4>Our Address</h4>
                                                    <p>
                                                        TIRWIN MANAGEMENT SERVICES PRIVATE LIMITED
                                                        <br />
                                                        PNO89, DO 12, THIRUPPANAR STREET
                                                        <br />
                                                        SUNDARAM COLONY, VIJAYARAGHAVAN BASHYAM
                                                        <br />
                                                        TAMBARAM
                                                        <br />
                                                        TAMILNADU, INDIA 600059
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="contact-item">
                                                <div className="contact-icon">
                                                    <i className="fas fa-phone"></i>
                                                </div>
                                                <div className="contact-details">
                                                    <h4>Phone</h4>
                                                    <p>
                                                        <a href="tel:+919841970466">+91 9841970466</a>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="contact-item">
                                                <div className="contact-icon">
                                                    <i className="fas fa-envelope"></i>
                                                </div>
                                                <div className="contact-details">
                                                    <h4>Email</h4>
                                                    <p>
                                                        <a href="mailto:tirwin.communications@tirwin.in">
                                                            tirwin.communications@tirwin.in
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="contact-item">
                                                <div className="contact-icon">
                                                    <i className="fas fa-clock"></i>
                                                </div>
                                                <div className="contact-details">
                                                    <h4>Business Hours</h4>
                                                    <p>
                                                        Monday - Friday: 9:00 AM - 6:00 PM
                                                        <br />
                                                        Saturday: 9:00 AM - 1:00 PM
                                                        <br />
                                                        Sunday: Closed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>

                            {/* Map Section */}
                            <section className="map-section">
                                <h2>Find Us</h2>
                                <div className="map-container">
                                    <div className="map-placeholder">
                                        <i className="fas fa-map"></i>
                                        <h4>Interactive Map</h4>
                                        <p>Map showing our location in Tambaram, Tamil Nadu</p>
                                        <p className="map-coordinates">
                                            Coordinates: 12.9242° N, 80.1275° E
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Additional Information */}
                            <section className="info-section">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <i className="fas fa-users"></i>
                                            </div>
                                            <h4>Customer Support</h4>
                                            <p>
                                                Our dedicated team is here to help you with any questions or
                                                concerns about our services.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <i className="fas fa-handshake"></i>
                                            </div>
                                            <h4>Partnership Inquiries</h4>
                                            <p>
                                                Interested in partnering with TIRWIN? We&apos;d love to explore
                                                collaboration opportunities.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <i className="fas fa-lightbulb"></i>
                                            </div>
                                            <h4>Innovation Hub</h4>
                                            <p>
                                                Connect with our technology team to discuss innovative
                                                solutions for your business needs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
