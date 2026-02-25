"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { environment } from "@/services/auth.service";
import "./admin-webinar.css";

type MenuType = "all" | "upcoming" | "past";

export default function AdminWebinarPage() {
    const router = useRouter();

    const [selectedWebinarMenu, setSelectedWebinarMenu] = useState<MenuType>("all");
    const [upcomingWebinars, setUpcomingWebinars] = useState<any[]>([]);
    const [pastWebinars, setPastWebinars] = useState<any[]>([]);
    const [allWebinars, setAllWebinars] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [sortColumn, setSortColumn] = useState("title");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedWebinar, setSelectedWebinar] = useState<any>(null);

    useEffect(() => {
        const userStr = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
        if (!userStr) {
            router.push("/auth/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.user_type !== "admin") {
                router.push("/auth/login");
                return;
            }
        } catch (e) {
            router.push("/auth/login");
            return;
        }

        fetchDataForMenu("all");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAuthHeaders = () => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer \${token}` } : {}),
    };
  };

  const selectWebinarMenu = (menu: MenuType) => {
    setSelectedWebinarMenu(menu);
    setCurrentPage(1);
    fetchDataForMenu(menu);
  };

  const fetchDataForMenu = (menu: MenuType) => {
    if (menu === "all") fetchAllWebinars();
    else if (menu === "upcoming") fetchUpcomingWebinars();
    else if (menu === "past") fetchPastWebinars();
  };

  const isUpcoming = (dateStr: string) => {
    try {
      const webinarDate = new Date(dateStr);
      if (isNaN(webinarDate.getTime())) return false;
      return webinarDate > new Date();
    } catch {
      return false;
    }
  };

  const fetchAllWebinars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/webinars?page=\${currentPage}&limit=\${pageSize}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load webinars");
      const data = await res.json();
      const webinars = (data || []).sort((a: any, b: any) => {
        const aUp = isUpcoming(a.end_time) ? 1 : 0;
        const bUp = isUpcoming(b.end_time) ? 1 : 0;
        if (aUp !== bUp) return bUp - aUp;
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      });
      setAllWebinars(webinars);
      setTotalItems(webinars.length);
      setTotalPages(Math.ceil(webinars.length / pageSize));
    } catch (err) {
      setError("Failed to load webinars.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingWebinars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/webinars/upcoming?page=\${currentPage}&limit=\${pageSize}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load upcoming webinars");
      const data = await res.json();
      setUpcomingWebinars(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (err) {
      setError("Failed to load upcoming webinars.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastWebinars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/webinars/past?page=\${currentPage}&limit=\${pageSize}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load past webinars");
      const data = await res.json();
      setPastWebinars(data.data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (err) {
      setError("Failed to load past webinars.");
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Date not set";
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Date not set";
    }
  };

  const getWebinarStatus = (dateStr: string) => {
    if (!dateStr || dateStr === "Date not set") return "Unknown";
    return isUpcoming(dateStr) ? "Upcoming" : "Completed";
  };

  const statusClass = (dateStr: string) => {
    const s = getWebinarStatus(dateStr);
    return s === "Upcoming" ? "upcoming" : s === "Completed" ? "completed" : "pending";
  };

  const canShowRecording = (dateStr: string, recUrl: string) => {
    try {
      const webinarDate = new Date(dateStr);
      if (isNaN(webinarDate.getTime())) return false;
      return !isUpcoming(dateStr) && !!recUrl;
    } catch {
      return false;
    }
  };

  const truncateTitle = (title: string) => {
    if (!title) return "";
    const words = title.split(" ");
    if (words.length > 5) return words.slice(0, 5).join(" ") + "...";
    return title;
  };

  const confirmDelete = (w: any) => {
    setSelectedWebinar(w);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedWebinar(null);
  };

  const deleteWebinar = async () => {
    if (!selectedWebinar) return;
    try {
      const res = await fetch(`\${environment.api}/admin/webinars/\${selectedWebinar.id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to delete webinar");
      alert("Webinar deleted successfully");
      closeDeleteModal();
      fetchDataForMenu(selectedWebinarMenu);
    } catch (error) {
      console.error(error);
      alert("Failed to delete webinar");
      closeDeleteModal();
    }
  };

  const getSortIcon = (col: string) => sortColumn !== col ? "fa-sort" : sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
  const onSort = (col: string) => { /* Basic sort implementation */ };

  const activeWebinars = selectedWebinarMenu === "all" ? allWebinars : selectedWebinarMenu === "upcoming" ? upcomingWebinars : pastWebinars;

  const getMenuTitle = () => selectedWebinarMenu === "all" ? "All Webinars" : selectedWebinarMenu === "upcoming" ? "Upcoming Webinars" : "Past Webinars";

  return (
    <div className="admin-webinar-container d-flex" style={{ minHeight: "80vh", paddingTop: "80px", backgroundColor: "#f8f9fa" }}>
      <div className="sidebar shadow-sm" style={{ width: "260px", backgroundColor: "#fff", borderRight: "1px solid #e0e0e0" }}>
        <div className="menu-group">
          <div className="menu-title px-4 py-2 text-uppercase fw-bold text-muted" style={{ fontSize: "14px" }}>Webinar Management</div>
          <ul className="submenu list-unstyled m-0">
            <li className={`px-4 py-3 \${selectedWebinarMenu === 'all' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectWebinarMenu("all")} style={{ cursor: "pointer" }}>
              <i className="fas fa-list me-3"></i> Webinars List
            </li>
            <li className={`px-4 py-3 \${selectedWebinarMenu === 'upcoming' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectWebinarMenu("upcoming")} style={{ cursor: "pointer" }}>
              <i className="fas fa-video me-3"></i> Upcoming Webinars
            </li>
            <li className={`px-4 py-3 \${selectedWebinarMenu === 'past' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectWebinarMenu("past")} style={{ cursor: "pointer" }}>
              <i className="fas fa-history me-3"></i> Past Webinars
            </li>
          </ul>
        </div>
      </div>
      
      <div className="content flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0 fw-bold">{getMenuTitle()}</h2>
          <Link href="/admin/webinar-management/create" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm">
            <i className="fas fa-plus me-2"></i> Create Webinar
          </Link>
        </div>

        {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
        
        {loading && <p>Loading webinars...</p>}

        {!loading && activeWebinars.length > 0 && (
          <div className="table-responsive bg-white rounded-3 shadow-sm">
             <table className="table table-hover align-middle mb-0">
               <thead className="table-light">
                 <tr>
                   <th style={{ width: "50px" }}></th>
                   <th className="py-3 cursor-pointer" onClick={() => onSort("title")}>
                     Title <i className={`fas \${getSortIcon("title")} ms-1 text-muted`}></i>
                   </th>
                   <th className="py-3 cursor-pointer" onClick={() => onSort("date")}>
                     Date & Time <i className={`fas \${getSortIcon("date")} ms-1 text-muted`}></i>
                   </th>
                   <th className="py-3">Status</th>
                   <th className="py-3 text-center">Action</th>
                 </tr>
               </thead>
               <tbody>
                 {activeWebinars.map(w => (
                   <tr key={w.id}>
                     <td className="text-center">
                       <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary" style={{ width: "40px", height: "40px" }}>
                         <i className="fas fa-video"></i>
                       </div>
                     </td>
                     <td className="fw-medium">{truncateTitle(w.title)}</td>
                     <td className="text-muted">{formatDate(w.start_time || w.date)}</td>
                     <td>
                       <span className={`badge rounded-pill px-3 py-1 \${
                         statusClass(w.end_time || w.date) === "upcoming" ? "bg-warning text-dark" 
                         : statusClass(w.end_time || w.date) === "completed" ? "bg-success" : "bg-secondary"
                       }`}>
                         {getWebinarStatus(w.end_time || w.date)}
                       </span>
                     </td>
                     <td className="text-center">
                       <Link href={`/webinar/\${(w.session_type || w.type || "events").toLowerCase()}/\${w.id}`} className="btn btn-light btn-sm fw-bold border text-primary rounded-pill me-2 px-3">
                         <i className="fas fa-eye me-1"></i> View
                       </Link>
                       {getWebinarStatus(w.end_time || w.date) === "Upcoming" && (
                         <>
                           <button className="btn btn-light btn-sm fw-bold border text-success rounded-pill me-2 px-3" onClick={() => alert("Edit info coming soon")}>
                             <i className="fas fa-edit me-1"></i> Edit
                           </button>
                           <button className="btn btn-light btn-sm fw-bold border text-danger rounded-pill px-3" onClick={() => confirmDelete(w)}>
                             <i className="fas fa-trash me-1"></i> Delete
                           </button>
                         </>
                       )}
                       {canShowRecording(w.date, w.recording_url) && (
                         <button className="btn btn-info text-white btn-sm fw-bold rounded-pill px-3 ms-2">
                           <i className="fas fa-play me-1"></i> Recording
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
        
        {!loading && activeWebinars.length === 0 && (
          <div className="p-4 text-center text-muted">
            No {selectedWebinarMenu} webinars found.
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body border-0 py-4">
                <p className="m-0 fs-5 text-center">Are you sure you want to delete webinar <br/><strong>&quot;{selectedWebinar?.title}&quot;</strong>?</p>
              </div>
              <div className="modal-footer border-0 pt-0 justify-content-center">
                <button type="button" className="btn btn-light fw-bold rounded-pill px-4" onClick={closeDeleteModal}>Cancel</button>
                <button type="button" className="btn btn-danger fw-bold rounded-pill px-4" onClick={deleteWebinar}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
