import React from "react";
import "./pricing.css";

export const metadata = {
    title: "Pricing Policy | Tirwin Talent",
};

export default function PricingPolicyPage() {
    return (
        <div className="pricing-policy-page">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="page-header">
                            <h1>Pricing Policy</h1>
                            <p className="last-updated">
                                <strong>Effective Date:</strong> August 4, 2025<br />
                                <strong>Last Updated:</strong> August 4, 2025
                            </p>
                        </div>
                        <div className="pricing-content">
                            <section className="pricing-section">
                                <p>
                                    At <strong>Tirwin Talent</strong>, we believe in transparent and
                                    fair pricing for all our services. This Pricing Policy outlines
                                    our structure, charges, and terms related to our webinar offerings.
                                </p>
                            </section>
                            <section className="pricing-section">
                                <h2>1. Pricing Structure</h2>
                                <ul>
                                    <li>
                                        <strong>Free Webinars:</strong> Access is provided without any
                                        charge unless otherwise stated.
                                    </li>
                                    <li>
                                        <strong>Paid Webinars:</strong> Prices vary based on the event
                                        and are clearly listed on each webinar registration page.
                                    </li>
                                    <li>
                                        <strong>Subscription Plans:</strong> Monthly or yearly plans may
                                        be available for frequent attendees or hosts.
                                    </li>
                                </ul>
                            </section>
                            <section className="pricing-section">
                                <h2>2. Currency and Taxes</h2>
                                <p>
                                    All prices are listed in INR (₹) or USD ($) as applicable. Prices
                                    include applicable GST unless otherwise specified.
                                </p>
                            </section>
                            <section className="pricing-section">
                                <h2>3. Payment Methods</h2>
                                <ul>
                                    <li>Credit/Debit Cards</li>
                                    <li>UPI/Net Banking</li>
                                    <li>Wallets (e.g., Razorpay, Stripe)</li>
                                </ul>
                                <p>
                                    All payments are processed securely via our third-party payment
                                    partners.
                                </p>
                            </section>
                            <section className="pricing-section">
                                <h2>4. Invoicing</h2>
                                <p>
                                    An invoice will be emailed to you automatically upon successful
                                    registration/payment. For bulk or institutional registrations,
                                    contact us for customized invoicing.
                                </p>
                            </section>
                            <section className="pricing-section">
                                <h2>5. Refund and Cancellation</h2>
                                <ul>
                                    <li>
                                        <strong>User Cancellation:</strong>
                                        <ul>
                                            <li>
                                                Kindly contact us at{" "}
                                                <a href="mailto:tirwin.communications@tirwin.in">
                                                    tirwin.communications@tirwin.in
                                                </a>{" "}
                                                for assistance.We will process your refund within 7 working
                                                days.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Host Cancellation or Rescheduling:</strong> Full refund
                                        or alternate date access will be provided.
                                    </li>
                                </ul>
                            </section>
                            <section className="pricing-section">
                                <h2>6. Discounts and Coupons</h2>
                                <p>
                                    Discount codes or seasonal offers may be applied where applicable.
                                    Only one coupon per registration is allowed unless stated.
                                </p>
                            </section>
                            <section className="pricing-section">
                                <h2>7. Dispute Resolution</h2>
                                <div className="contact-info">
                                    <p>
                                        In case of disputes related to charges or refunds, please
                                        contact us at{" "}
                                        <a href="mailto:tirwin.communications@tirwin.in">
                                            tirwin.communications@tirwin.in
                                        </a>{" "}
                                        within 7 days of the transaction.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
