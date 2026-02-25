"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const navigateToTermsAndConditions = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/terms-conditions");
        scrollToTop();
    };

    const navigateToPrivacyPolicy = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/privacy-policy");
        scrollToTop();
    };

    const navigateToPricingPolicy = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/pricing-policy");
        scrollToTop();
    };

    return (
        <footer id="footer">
            <div className="footer-content">
                <div className="container">
                    <div className="row gap-y">
                        <div className="col-md-6 col-xl-4">
                            <p>
                                <a href="https://tirwin.in" target="_blank" rel="noopener noreferrer">
                                    <img
                                        className="footer-logo"
                                        src="https://www.tirwin.in/images/tirwin-logo.png"
                                        alt="logo"
                                    />
                                </a>
                            </p>
                            <p>
                                <b>Tirwin Talent</b> – A specialized webinar platform by{" "}
                                <a href="https://www.tirwin.in/" target="_blank" rel="noopener noreferrer">
                                    <b>TIRWIN Management PVT. LTD</b>
                                </a>
                                , designed to empower logistics professionals.
                            </p>
                        </div>
                        <div className="col-md-6 col-xl-4">
                            <p>
                                <a href="https://neolumina.in" target="_blank" rel="noopener noreferrer">
                                    <img
                                        className="footer-logo"
                                        src="/assets/images/nts-logo.png"
                                        alt="logo"
                                    />
                                </a>
                            </p>
                            <p>
                                In collaboration with{" "}
                                <a href="https://neolumina.in" target="_blank" rel="noopener noreferrer">
                                    <b>Neolumina Technology Solutions</b>
                                </a>{" "}
                                – Illuminating the Future.
                            </p>
                        </div>

                        <div className="col-6 col-md-3 col-xl-2">
                            <div className="widget">
                                <h4>TIRWIN</h4>
                                <ul className="list">
                                    <li>
                                        <Link href="/about-us">About Us</Link>
                                    </li>
                                    <li>
                                        <Link href="/brand-awareness">Branding</Link>
                                    </li>
                                    <li>
                                        <a href="#">What we Offer</a>
                                    </li>
                                    <li>
                                        <Link href="/leadership">Leadership</Link>
                                    </li>
                                    <li>
                                        <a href="#">Careers</a>
                                    </li>
                                    <li>
                                        <Link href="/contact-us">Contact Us</Link>
                                    </li>
                                    <li>
                                        <a href="#" onClick={navigateToTermsAndConditions}>
                                            Terms & Conditions
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={navigateToPrivacyPolicy}>
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={navigateToPricingPolicy}>
                                            Pricing Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-6 col-md-6 col-xl-2">
                            <h5>FOLLOW US</h5>
                            <div className="social-icons social-icons-colored social-icons-rounded float-left">
                                <ul>
                                    <li className="social-facebook">
                                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                    </li>
                                    <li className="social-linkedin">
                                        <a href="https://www.linkedin.com/in/tirwin-talent-0a90aa31a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                    </li>
                                    <li className="social-instagram">
                                        <a href="https://www.instagram.com/tirwin.management/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-content">
                <div className="container">
                    <div className="copyright-text text-center">
                        &copy; 2025 TIRWIN Management PVT. LTD All Rights Reserved.{" "}
                        <a href="https://www.tirwin.in/" target="_blank" rel="noopener noreferrer">
                            TIRWIN
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
