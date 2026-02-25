"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./admin-user.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { environment } from "@/services/auth.service";

type MenuType = "trainer" | "trainee" | "admin" | "webinar-subscriptions";

export default function AdminUserPage() {
    const router = useRouter();

    const [selectedUserMenu, setSelectedUserMenu] = useState<MenuType>("trainer");
    const [trainers, setTrainers] = useState<any[]>([]);
    const [trainees, setTrainees] = useState<any[]>([]);
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [webinars, setWebinars] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [selectedWebinar, setSelectedWebinar] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [approvingTrainers, setApprovingTrainers] = useState<{ [key: string]: boolean }>({});

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [sortColumn, setSortColumn] = useState("start_time");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [selectedTrainerFilter, setSelectedTrainerFilter] = useState<"all" | "approved" | "pending">("pending");

    const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});
    const [sendingNotifications, setSendingNotifications] = useState<{ [key: string]: boolean }>({});

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

        fetchDataForMenu("trainer");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getMenuTitle = () => {
        switch (selectedUserMenu) {
            case "trainer": return "Trainers";
            case "trainee": return "Trainees";
            case "admin": return "Admin Users";
            case "webinar-subscriptions": return "Webinar Subscriptions";
            default: return "User Management";
        }
    };

    const selectUserMenu = (menu: MenuType) => {
        setSelectedUserMenu(menu);
        setCurrentPage(1);
        setSelectedWebinar(null);
        setSubscribers([]);
        fetchDataForMenu(menu);
    };

    const fetchDataForMenu = (menu: MenuType = selectedUserMenu) => {
        if (menu === "trainer") fetchTrainers();
        else if (menu === "trainee") fetchTrainees();
        else if (menu === "admin") fetchAdminUsers();
        else if (menu === "webinar-subscriptions") fetchWebinars();
    };

    const getAuthHeaders = () => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer \${token}` } : {}),
    };
  };

  const fetchTrainers = async () => {
    setLoading(true);
    setError("");
    let url = `\${environment.api}/admin/users/by-type?userType=trainer`;
    if (selectedTrainerFilter === "approved") url += "&isVerified=true";
    else if (selectedTrainerFilter === "pending") url += "&isVerified=false";

    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load trainers");
      const data = await res.json();
      setTrainers(data);
    } catch (err) {
      setError("Failed to load trainers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/users/by-type?userType=trainee&isVerified=true&page=\${currentPage}&limit=\${pageSize}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load trainees");
      const data = await res.json();
      setTrainees(data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (err) {
      setError("Failed to load trainees.");
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/users/by-type?userType=admin&isVerified=true&page=\${currentPage}&limit=\${pageSize}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load admin users");
      const data = await res.json();
      setAdminUsers(data || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (err) {
      setError("Failed to load admin users.");
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const fetchWebinars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/webinars`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load webinars");
      const data = await res.json();
      const sorted = (data || []).sort((a: any, b: any) => {
        const dateA = new Date(a.start_time || 0);
        const dateB = new Date(b.start_time || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setWebinars(sorted);
    } catch (err) {
      setError("Failed to load webinars.");
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const onTrainerFilterChange = (filter: "all" | "approved" | "pending") => {
    setSelectedTrainerFilter(filter);
    // setTimeout to allow state update or change logic to depend on the new value directly
    setLoading(true);
    let url = `\${environment.api}/admin/users/by-type?userType=trainer`;
    if (filter === "approved") url += "&isVerified=true";
    else if (filter === "pending") url += "&isVerified=false";
    
    fetch(url, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load trainers.");
        setLoading(false);
      });
  };

  const selectWebinar = (webinar: any) => {
    setSelectedWebinar(webinar);
    fetchSubscribers(webinar.id);
  };

  const fetchSubscribers = async (webinarId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`\${environment.api}/admin/webinars/\${webinarId}/enrolled-users`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load enrolled users");
      const data = await res.json();
      setSubscribers(data && data.enrolled_users ? data.enrolled_users : []);
    } catch (err) {
      setError("Failed to load enrolled users.");
      console.error(err);
      alert("Failed to load enrolled users. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const newSelected: { [key: string]: boolean } = {};
    subscribers.forEach((sub, idx) => {
      newSelected[sub.id || idx.toString()] = isChecked;
    });
    setSelectedUsers(newSelected);
  };

  const toggleUserSelection = (sub: any, idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = sub.id || idx.toString();
    setSelectedUsers((prev) => ({ ...prev, [key]: e.target.checked }));
  };

  const isAllSelected = () => {
    if (subscribers.length === 0) return false;
    return subscribers.every((sub, idx) => selectedUsers[sub.id || idx.toString()]);
  };

  const getSelectedCount = () => Object.values(selectedUsers).filter(Boolean).length;

  const exportToExcel = () => {
    if (!selectedWebinar || subscribers.length === 0) {
      alert("No data available to export.");
      return;
    }
    try {
      const exportData = subscribers.map((sub, idx) => ({
        "S.No": idx + 1,
        "User Name": getUserName(sub),
        "Email ID": getUserEmail(sub),
        "Registered Date": formatDate(getUserDate(sub)),
        "Transaction ID": getUserTransactionId(sub),
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [{ wch: 8 }, { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 25 }];
      
      const safeTitle = (selectedWebinar.title || "Webinar").replace(/[^\\w\\s-]/g, "").substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle);
      
      const date = new Date().toISOString().split("T")[0];
      const filename = `enrolled_users_\${safeTitle}_\${date}.xlsx`;
      
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, filename);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  const sendEmailToSelected = async () => {
    const currentSelectedUsers = subscribers.filter((sub, idx) => selectedUsers[sub.id || idx.toString()]);
    if (currentSelectedUsers.length === 0) {
      alert("Please select at least one user to send email.");
      return;
    }
    if (!selectedWebinar?.id) {
      alert("No webinar selected.");
      return;
    }
    const userIds = currentSelectedUsers.map(u => u.user_id || u.userId || u.id || u.user?.id).filter(Boolean);
    if (userIds.length === 0) {
      alert("No valid user IDs found for selected users.");
      return;
    }

    try {
      const res = await fetch(`\${environment.api}/admin/users/send-webinar-meeting-notification`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ webinarId: selectedWebinar.id, userIds }),
      });
      if (!res.ok) throw new Error("Failed to send notification");
      alert(`Webinar meeting notification sent to \${userIds.length} users successfully.`);
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("Failed to send webinar meeting notification. Please try again.");
    }
  };

  const sendNotification = async (sub: any, idx: number) => {
    const key = sub.id || idx.toString();
    setSendingNotifications((prev) => ({ ...prev, [key]: true }));
    try {
      const userId = sub.user_id || sub.userId || sub.id || sub.user?.id;
      if (!userId || !selectedWebinar?.id) throw new Error("Missing ID");
      const res = await fetch(`\${environment.api}/admin/users/send-webinar-meeting-notification`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ webinarId: selectedWebinar.id, userIds: [userId] }),
      });
      if (!res.ok) throw new Error("Failed to send");
      alert(`Notification sent to \${getUserName(sub)}`);
    } catch (error) {
      alert("Failed to send notification.");
    } finally {
      setSendingNotifications((prev) => ({ ...prev, [key]: false }));
    }
  };

  const onApproveTrainer = async (trainer: any) => {
    if (!trainer.trainer?.id) return;
    setApprovingTrainers((prev) => ({ ...prev, [trainer.trainer.id]: true }));
    try {
      const res = await fetch(`\${environment.api}/users/trainer/\${trainer.trainer.id}/verify-profile`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to approve");
      setTrainers((prev) => prev.filter(t => t.trainer.id !== trainer.trainer.id));
      alert("Trainer approved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to approve trainer.");
    } finally {
      setApprovingTrainers((prev) => ({ ...prev, [trainer.trainer.id]: false }));
    }
  };

  // formatting
  const formatDate = (ds: string) => ds ? new Date(ds).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
  const formatTime = (ds: string) => ds ? new Date(ds).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A";
  const getUserName = (sub: any) => sub.user_name || sub.name || (sub.user ? `\${sub.user.first_name || ''} \${sub.user.last_name || ''}`.trim() : "") || `\${sub.first_name || ''} \${sub.last_name || ''}`.trim() || "N/A";
  const getUserEmail = (sub: any) => sub.email_id || sub.user?.email || sub.email || "N/A";
  const getUserDate = (sub: any) => sub.subscription_date || "";
  const getUserTransactionId = (sub: any) => sub.transaction_id || sub.transactionId || sub.payment_id || sub.paymentId || "N/A";
  
  const getWebinarStatus = (w: any) => {
    if (!w.start_time) return "Unknown";
    const now = new Date();
    const st = new Date(w.start_time);
    const et = w.end_time ? new Date(w.end_time) : null;
    if (et && now > et) return "Completed";
    if (now >= st && (!et || now <= et)) return "Live";
    if (now < st) return "Upcoming";
    return "Unknown";
  };
  const getWebinarStatusClass = (w: any) => {
    const s = getWebinarStatus(w);
    return s === "Live" ? "live" : s === "Completed" ? "completed" : s === "Upcoming" ? "upcoming" : "unknown";
  };

  const getSortIcon = (col: string) => sortColumn !== col ? "fa-sort" : sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
  const onSort = (col: string) => { /* Minimal sort logic implementation if needed */ };

  return (
    <div className="admin-user-container d-flex" style={{ minHeight: "80vh", paddingTop: "80px", backgroundColor: "#f8f9fa" }}>
      <div className="sidebar shadow-sm" style={{ width: "260px", backgroundColor: "#fff", borderRight: "1px solid #e0e0e0" }}>
        <div className="menu-group">
          <div className="menu-title px-4 py-2 text-uppercase fw-bold text-muted" style={{ fontSize: "14px" }}>User Management</div>
          <ul className="submenu list-unstyled m-0">
            <li className={`px-4 py-3 \${selectedUserMenu === 'trainee' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectUserMenu('trainee')} style={{ cursor: "pointer" }}>
              <i className="fas fa-user-graduate me-3"></i> Trainees
            </li>
            <li className={`px-4 py-3 \${selectedUserMenu === 'trainer' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectUserMenu('trainer')} style={{ cursor: "pointer" }}>
              <i className="fas fa-chalkboard-teacher me-3"></i> Trainers
            </li>
            <li className={`px-4 py-3 \${selectedUserMenu === 'admin' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectUserMenu('admin')} style={{ cursor: "pointer" }}>
              <i className="fas fa-user-shield me-3"></i> Admin Users
            </li>
            <li className={`px-4 py-3 \${selectedUserMenu === 'webinar-subscriptions' ? 'active-menu bg-light text-primary fw-bold' : 'text-secondary'}`} onClick={() => selectUserMenu('webinar-subscriptions')} style={{ cursor: "pointer" }}>
              <i className="fas fa-video me-3"></i> Webinar Subscriptions
            </li>
          </ul>
        </div>
      </div>
      
      <div className="content flex-grow-1 p-4">
        <h2 className="mb-4 fw-bold">{getMenuTitle()}</h2>
        {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

        {/* Webinar Subscriptions */}
        {selectedUserMenu === "webinar-subscriptions" && (
          <div>
            {!selectedWebinar ? (
               <div className="webinar-list-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="h4 fw-bold m-0">Available Webinars</h3>
                  <div className="badge bg-info text-dark px-3 py-2 rounded-pill"><i className="fas fa-filter me-2"></i>Showing paid webinars only</div>
                </div>
                {loading && <p>Loading webinars...</p>}
                {!loading && webinars.length > 0 && (
                  <div className="table-responsive bg-white rounded-3 shadow-sm">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th></th>
                          <th className="py-3" style={{ cursor: "pointer" }} onClick={() => onSort("title")}>Title <i className={`fas \${getSortIcon("title")} ms-1 text-muted`}></i></th>
                          <th className="py-3">Type</th>
                          <th className="py-3">Price</th>
                          <th className="py-3">Start Date</th>
                          <th className="py-3">Status</th>
                          <th className="py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {webinars.map(w => (
                          <tr key={w.id}>
                            <td className="text-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={w.media?.[0]?.media_url || "https://via.placeholder.com/50"} alt={w.title} className="rounded" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                            </td>
                            <td>
                              <div className="fw-semibold text-dark">{w.title}</div>
                              <div className="text-muted small">{w.description?.substring(0, 60)}{w.description?.length > 60 ? "..." : ""}</div>
                            </td>
                            <td><span className="badge bg-light text-primary rounded-pill px-3 py-1">{w.type}</span></td>
                            <td className="fw-bold text-success">₹{w.price}</td>
                            <td>
                              <div className="fw-medium text-dark">{formatDate(w.start_time)}</div>
                              <div className="text-muted small">{formatTime(w.start_time)}</div>
                            </td>
                            <td>
                              <span className={`badge rounded-pill px-3 py-1 \${getWebinarStatusClass(w) === "live" ? "bg-success" : getWebinarStatusClass(w) === "completed" ? "bg-secondary" : "bg-warning text-dark"}`}>
                                {getWebinarStatus(w)}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold" onClick={() => selectWebinar(w)}>
                                <i className="fas fa-users me-2"></i> Subscribers
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!loading && webinars.length === 0 && <p className="text-muted mt-3">No webinars found.</p>}
               </div>
            ) : (
              <div className="subscribers-section">
                <div className="d-flex align-items-center mb-4 gap-3">
                  <button className="btn btn-light border fw-bold rounded-pill" onClick={() => { setSelectedWebinar(null); setSubscribers([]); }}>
                    <i className="fas fa-arrow-left me-2"></i> Back
                  </button>
                  <h3 className="h4 fw-bold m-0">Enrolled Users: <span className="text-primary">{selectedWebinar.title}</span></h3>
                </div>

                {loading && <p>Loading enrolled users...</p>}
                
                {!loading && subscribers.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mb-3">
                      <div className="form-check m-0">
                        <input className="form-check-input" type="checkbox" checked={isAllSelected()} onChange={toggleSelectAll} id="selectAll" />
                        <label className="form-check-label fw-bold" htmlFor="selectAll">Select All {getSelectedCount() > 0 && <span className="text-muted">({getSelectedCount()})</span>}</label>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm fw-bold rounded-pill px-3" disabled={getSelectedCount() === 0} onClick={sendEmailToSelected}>
                          <i className="fas fa-envelope me-2"></i> Send Email
                        </button>
                        <button className="btn btn-success btn-sm fw-bold rounded-pill px-3" onClick={exportToExcel}>
                          <i className="fas fa-file-excel me-2"></i> Export
                        </button>
                      </div>
                    </div>

                    <div className="table-responsive bg-white rounded-3 shadow-sm">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center" style={{ width: "40px" }}></th>
                            <th style={{ width: "50px" }}></th>
                            <th>User Name</th>
                            <th>Email ID</th>
                            <th>Registered Date</th>
                            <th>Transaction ID</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((sub, idx) => (
                            <tr key={sub.id || idx}>
                              <td className="text-center">
                                <input className="form-check-input" type="checkbox" checked={selectedUsers[sub.id || idx.toString()] || false} onChange={(e) => toggleUserSelection(sub, idx, e)} />
                              </td>
                              <td className="text-center">
                                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary" style={{ width: "35px", height: "35px" }}>
                                  <i className="fas fa-user"></i>
                                </div>
                              </td>
                              <td className="fw-medium">{getUserName(sub)}</td>
                              <td className="text-muted">{getUserEmail(sub)}</td>
                              <td>{formatDate(getUserDate(sub))}</td>
                              <td className="text-muted small font-monospace">{getUserTransactionId(sub)}</td>
                              <td className="text-center">
                                <button className="btn btn-info text-white btn-sm rounded-pill fw-bold" disabled={sendingNotifications[sub.id || idx.toString()]} onClick={() => sendNotification(sub, idx)}>
                                  <i className="fas fa-bell me-1"></i> Send Remainder
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                {!loading && subscribers.length === 0 && <p className="text-muted mt-3">No enrolled users found.</p>}
              </div>
            )}
          </div>
        )}

        {/* Trainer Filters */}
        {selectedUserMenu === "trainer" && (
           <div className="row g-3 mb-4">
             <div className="col-md-4">
               <div className={`card text-center py-3 cursor-pointer shadow-sm border-0 \${selectedTrainerFilter === "all" ? "bg-primary text-white" : "bg-light"}`} onClick={() => onTrainerFilterChange("all")}>
                 <i className="fas fa-users fs-4 mb-2"></i><span className="fw-bold">All Trainers</span>
               </div>
             </div>
             <div className="col-md-4">
               <div className={`card text-center py-3 cursor-pointer shadow-sm border-0 \${selectedTrainerFilter === "approved" ? "bg-primary text-white" : "bg-light"}`} onClick={() => onTrainerFilterChange("approved")}>
                 <i className="fas fa-check-circle fs-4 mb-2"></i><span className="fw-bold">Approved</span>
               </div>
             </div>
             <div className="col-md-4">
               <div className={`card text-center py-3 cursor-pointer shadow-sm border-0 \${selectedTrainerFilter === "pending" ? "bg-primary text-white" : "bg-light"}`} onClick={() => onTrainerFilterChange("pending")}>
                 <i className="fas fa-clock fs-4 mb-2"></i><span className="fw-bold">Pending Approval</span>
               </div>
             </div>
           </div>
        )}

        {/* General User Tables (Trainer, Trainee, Admin) */}
        {selectedUserMenu !== "webinar-subscriptions" && (
          <div className="table-responsive bg-white rounded-3 shadow-sm mt-3">
             {loading && <div className="p-4 text-center">Loading...</div>}
             {!loading && (selectedUserMenu === 'trainer' ? trainers : selectedUserMenu === 'trainee' ? trainees : adminUsers).length === 0 && <div className="p-4 text-center text-muted">No {selectedUserMenu} found.</div>}
             
             {!loading && (selectedUserMenu === 'trainer' ? trainers : selectedUserMenu === 'trainee' ? trainees : adminUsers).length > 0 && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "50px" }}></th>
                      <th>Name</th>
                      <th>Email</th>
                      {selectedUserMenu === "trainer" && <><th>Verified</th><th>Active</th></>}
                      {selectedUserMenu !== "trainer" && <th>Phone</th>}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedUserMenu === 'trainer' ? trainers : selectedUserMenu === 'trainee' ? trainees : adminUsers).map((u, i) => (
                      <tr key={u.id || i}>
                        <td>
                          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary" style={{ width: "35px", height: "35px" }}>
                            <i className={`fas \${selectedUserMenu === "trainer" ? "fa-chalkboard-teacher" : selectedUserMenu === "admin" ? "fa-user-shield" : "fa-user-graduate"}`}></i>
                          </div>
                        </td>
                        <td className="fw-medium">{u.first_name} {u.last_name}</td>
                        <td className="text-muted">{u.email}</td>
                        
                        {selectedUserMenu === "trainer" && (
                          <>
                            <td className="text-center"><i className={`fas fs-5 \${u.is_verified ? "fa-check-circle text-success" : "fa-times-circle text-danger"}`}></i></td>
                            <td className="text-center"><i className={`fas fs-5 \${u.is_active ? "fa-check-circle text-success" : "fa-times-circle text-danger"}`}></i></td>
                          </>
                        )}
                        {selectedUserMenu !== "trainer" && <td>{u.phone || "N/A"}</td>}
                        
                        <td>
                          <button className="btn btn-light btn-sm fw-bold border text-primary rounded-pill me-2 px-3">
                            View
                          </button>
                          {selectedUserMenu === "trainer" && selectedTrainerFilter !== "approved" && !u.is_verified && (
                            <button className="btn btn-success btn-sm fw-bold rounded-pill px-3" disabled={approvingTrainers[u.id]} onClick={() => onApproveTrainer(u)}>
                              {approvingTrainers[u.id] ? "Approving..." : "Approve"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
