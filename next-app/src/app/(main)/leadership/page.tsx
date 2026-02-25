import React from "react";
import "./leadership.css";

export const metadata = {
    title: "Leadership | Tirwin Talent",
};

export default function LeadershipPage() {
    return (
        <div className="leadership-page">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="page-header">
                            <h1>Our Leadership Team</h1>
                            <p className="tagline">TRAINING - INNOVATION - RESOURCING</p>
                        </div>

                        <div className="leadership-content">
                            {/* Executive Team Section */}
                            <section className="leadership-section">
                                <h2>Executive Team</h2>

                                <div className="team-grid">
                                    {/* Venkatesh Kuppuswamy */}
                                    <div className="team-card">
                                        <div className="team-member">
                                            <div className="member-avatar">
                                                <i className="fas fa-user-tie"></i>
                                            </div>
                                            <div className="member-info">
                                                <h3>Venkatesh Kuppuswamy (Venkat)</h3>
                                                <p className="member-title">Director & Chief Operations Officer</p>
                                                <p className="member-company">TIRWIN Management Services</p>
                                            </div>
                                        </div>
                                        <div className="member-bio">
                                            <p>
                                                As the Director and Chief Operations Officer at TIRWIN Management
                                                Services, Venkatesh Kuppuswamy (Venkat) is at the helm of driving
                                                growth and strategic initiatives. Venkat leverages his extensive
                                                operational expertise to propel TIRWIN towards technology-led
                                                growth, establish strategic partnerships, and foster employee
                                                development, all while maintaining a strong focus on customer
                                                engagement and delivering significant business outcomes.
                                            </p>

                                            <p>
                                                With over three decades of professional experience in consulting,
                                                business transformation, and digital innovation, Venkat brings a
                                                wealth of knowledge to TIRWIN. His background includes leveraging
                                                AI, process automation, and analytics solutions to revolutionize
                                                business operations. Prior to joining TIRWIN, Venkat served as the
                                                Global Head of Digital Transformation for HR services at Tata
                                                Consultancy Services.
                                            </p>

                                            <p>
                                                At the intersection of logistics and technology, Venkat&apos;s role
                                                is pivotal in delivering transformative results for customers through
                                                cutting-edge technology and talent transformation.
                                            </p>

                                            <div className="member-education">
                                                <h4>Education</h4>
                                                <ul>
                                                    <li>Engineering from BITS, Pilani</li>
                                                    <li>MBA from Pondicherry University</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rajesh Vijayaraghavan */}
                                    <div className="team-card">
                                        <div className="team-member">
                                            <div className="member-avatar">
                                                <i className="fas fa-user-tie"></i>
                                            </div>
                                            <div className="member-info">
                                                <h3>Rajesh Vijayaraghavan</h3>
                                                <p className="member-title">Head Technology</p>
                                                <p className="member-company">TIRWIN Management Services</p>
                                            </div>
                                        </div>
                                        <div className="member-bio">
                                            <p>
                                                As Head of Technologies at TIRWIN Management services, Rajesh
                                                Vijayaraghavan (Rajesh) delivering technology-enabled solutions
                                                that streamline operations, reduce waste and enhance productivity
                                                for the Clients.
                                            </p>

                                            <p>
                                                With over two decades of professional experience in Consulting,
                                                Business process Transformation and seasoned Enterprise Solution
                                                Architect, Rajesh brings in innovative technology solutions
                                                accompanied by Industry best practices to create efficient,
                                                scalable, and sustainable processes that deliver tangible business
                                                value. Rajesh expertise lies in understanding intricate processes
                                                and identifying key areas for improvement, driving operational
                                                excellence across various industry sectors.
                                            </p>

                                            <p>
                                                Prior joining TIRWIN, Rajesh&apos;s served as Senior Manager at Hexaware
                                                Technologies and his career spans multiple industries, including
                                                Automobile, Semiconductor, Electronic Components, Distilleries &
                                                Beverages, and Logistics & Warehousing. With the diverse
                                                experience, Rajesh equipped me with a comprehensive understanding
                                                of industry-specific challenges and best practices.
                                            </p>

                                            <div className="member-education">
                                                <h4>Education</h4>
                                                <ul>
                                                    <li>Engineering from Annamalai University</li>
                                                    <li>MBA from ICFAI</li>
                                                    <li>PCP Data Science from IIMK</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Advisors Section */}
                            <section className="leadership-section">
                                <h2>Our Advisors</h2>

                                <div className="advisors-grid">
                                    {/* Mr. J. Krishnan */}
                                    <div className="advisor-card">
                                        <div className="advisor-header">
                                            <div className="advisor-avatar">
                                                <i className="fas fa-user-graduate"></i>
                                            </div>
                                            <div className="advisor-info">
                                                <h3>Mr. J. Krishnan</h3>
                                                <p className="advisor-role">Logistics Industry Expert</p>
                                            </div>
                                        </div>
                                        <div className="advisor-bio">
                                            <p>
                                                Mr. J. Krishnan is a prominent figure in the logistics industry,
                                                associated with S Natesa Iyer Logistics LLP. He actively
                                                participates in discussions on emerging trends and challenges in
                                                logistics, sharing his insights with industry bodies like the
                                                Madras Chamber of Commerce and EXIM India.
                                            </p>

                                            <p>
                                                His views on the impact of geopolitical events on global trade,
                                                especially maritime sector challenges, are shared with the media,
                                                and he regularly advises government bodies on air cargo logistics,
                                                advocating for operational efficiency through talent and technology.
                                            </p>
                                        </div>
                                    </div>

                                    {/* G. Raghu Shankar */}
                                    <div className="advisor-card">
                                        <div className="advisor-header">
                                            <div className="advisor-avatar">
                                                <i className="fas fa-user-graduate"></i>
                                            </div>
                                            <div className="advisor-info">
                                                <h3>G. Raghu Shankar</h3>
                                                <p className="advisor-role">Former Executive Director</p>
                                            </div>
                                        </div>
                                        <div className="advisor-bio">
                                            <p>
                                                Mr. G. Raghu Shankar was the Executive Director at International
                                                Clearing & Shipping Agency (India) Pvt Ltd. He was involved in
                                                various strategic initiatives, particularly in the logistics and
                                                shipping industry.
                                            </p>

                                            <p>
                                                His role included overseeing operations, client acquisition, and
                                                the development of digital value propositions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Company Values Section */}
                            <section className="leadership-section">
                                <h2>Our Leadership Philosophy</h2>
                                <div className="values-content">
                                    <p>
                                        At TIRWIN, our leadership team embodies the core values that drive
                                        our success in the logistics and cargo industry. We believe in:
                                    </p>

                                    <div className="values-grid">
                                        <div className="value-item">
                                            <div className="value-icon">
                                                <i className="fas fa-lightbulb"></i>
                                            </div>
                                            <h4>Innovation</h4>
                                            <p>
                                                Continuously exploring new technologies and methodologies to
                                                transform business operations.
                                            </p>
                                        </div>

                                        <div className="value-item">
                                            <div className="value-icon">
                                                <i className="fas fa-users"></i>
                                            </div>
                                            <h4>Collaboration</h4>
                                            <p>
                                                Building strong partnerships and fostering teamwork to achieve
                                                exceptional results.
                                            </p>
                                        </div>

                                        <div className="value-item">
                                            <div className="value-icon">
                                                <i className="fas fa-chart-line"></i>
                                            </div>
                                            <h4>Excellence</h4>
                                            <p>
                                                Maintaining the highest standards of quality and performance in
                                                everything we do.
                                            </p>
                                        </div>

                                        <div className="value-item">
                                            <div className="value-icon">
                                                <i className="fas fa-graduation-cap"></i>
                                            </div>
                                            <h4>Growth</h4>
                                            <p>
                                                Investing in talent development and continuous learning to drive
                                                sustainable success.
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
