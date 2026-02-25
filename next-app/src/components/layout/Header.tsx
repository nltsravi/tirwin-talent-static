"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isTrainerOrAdmin, setIsTrainerOrAdmin] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isAdminMobileMenuOpen, setIsAdminMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Simulated auth check based on Angular logic
        const userData = sessionStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsAuthenticated(true);
                setUserName(`${user.first_name || ""} ${user.last_name || ""}`.trim());
                setIsAdmin(user.user_type === "admin");
                setIsTrainerOrAdmin(
                    user.user_type === "admin" || user.user_type === "trainer"
                );
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const logout = (e: React.MouseEvent) => {
        e.preventDefault();
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
        router.push("/auth/login");
        setTimeout(() => window.location.reload(), 100);
    };

    const isActive = (path: string) => pathname?.startsWith(path) ? "active" : "";

    return (
        <header id="header" data-fullwidth="true">
            <div className="header-inner">
                <div className="container">
                    <div id="logo">
                        <Link href="/home">
                            <img
                                src="https://tirwin.in/images/pages/tirwin/tirwin-talent.jpg"
                                alt="Tirwin Logo"
                                className="logo-img"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div id="mainMenu" className="desktop-menu">
                        <nav>
                            <ul>
                                <li className={isActive("/home")}>
                                    <Link href="/home">Home</Link>
                                </li>
                                <li className={isActive("/webinar/masterclass")}>
                                    <Link href="/webinar/masterclass">Master Classes</Link>
                                </li>
                                <li className={isActive("/webinar/events")}>
                                    <Link href="/webinar/events">Tirwin Talks</Link>
                                </li>
                                <li className={isActive("/webinar/training")}>
                                    <Link href="/webinar/training">Training</Link>
                                </li>

                                {isAdmin && (
                                    <li
                                        className={`dropdown ${isAdminMenuOpen ? "show" : ""}`}
                                        onMouseEnter={() => setIsAdminMenuOpen(true)}
                                        onMouseLeave={() => setIsAdminMenuOpen(false)}
                                    >
                                        <a href="#" className="dropdown-toggle" aria-expanded={isAdminMenuOpen ? "true" : "false"} onClick={(e) => e.preventDefault()}>
                                            Admin <i className="fas fa-caret-down"></i>
                                        </a>
                                        <ul
                                            className={`dropdown-menu ${isAdminMenuOpen ? "d-block" : "d-none"}`}
                                        >
                                            <li>
                                                <Link href="/admin/webinar-management" className="dropdown-item">Webinar</Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/user" className="dropdown-item">User</Link>
                                            </li>
                                        </ul>
                                    </li>
                                )}

                                {!isAuthenticated && (
                                    <li className={isActive("/auth/login")}>
                                        <Link href="/auth/login">Login</Link>
                                    </li>
                                )}

                                {isAuthenticated && (
                                    <li className="dropdown">
                                        <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
                                            {userName} <i className="fas fa-user"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li className={isActive("/profile/user")}>
                                                <Link href="/profile/user" className="dropdown-item">Profile</Link>
                                            </li>
                                            <li>
                                                <Link href="/myregistration" className="dropdown-item">My Courses</Link>
                                            </li>
                                            {!isTrainerOrAdmin && (
                                                <li>
                                                    <a href="#" className="dropdown-item">Become a Trainer</a>
                                                </li>
                                            )}
                                            <li>
                                                <a href="#" onClick={logout} className="dropdown-item text-danger">Logout</a>
                                            </li>
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div id="mainMenu-trigger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <a className="menu-icon">
                            {!isMobileMenuOpen ? <span>&#9776;</span> : <span className="close-icon">&times;</span>}
                        </a>
                    </div>

                    {/* Mobile Navigation */}
                    <div id="mobileMenu" className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                        <ul>
                            <li><Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                            <li><Link href="/webinar/masterclass" onClick={() => setIsMobileMenuOpen(false)}>Master Classes</Link></li>
                            <li><Link href="/webinar/events" onClick={() => setIsMobileMenuOpen(false)}>Tirwin Talks</Link></li>
                            <li><Link href="/webinar/training" onClick={() => setIsMobileMenuOpen(false)}>Training</Link></li>

                            {isAdmin && (
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsAdminMobileMenuOpen(!isAdminMobileMenuOpen); }}>
                                        Admin <i className="fas fa-caret-down"></i>
                                    </a>
                                    {isAdminMobileMenuOpen && (
                                        <ul className="dropdown-menu show bg-transparent shadow-none position-static d-block">
                                            <li><Link href="/admin/webinar-management" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Webinar</Link></li>
                                            <li><Link href="/admin/user" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>User</Link></li>
                                        </ul>
                                    )}
                                </li>
                            )}

                            {!isAuthenticated && (
                                <li><Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link></li>
                            )}
                            {isAuthenticated && (
                                <>
                                    <li><Link href="/profile/user" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link></li>
                                    <li><Link href="/myregistration" className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>My Courses</Link></li>
                                    <li><a href="#" onClick={logout}>Logout</a></li>
                                    <li className="dropdown">
                                        <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
                                            {userName} <i className="fas fa-user"></i>
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}
