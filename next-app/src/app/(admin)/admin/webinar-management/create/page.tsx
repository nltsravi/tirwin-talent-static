"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { environment } from "@/services/auth.service";
import "../admin-webinar.css";

export default function CreateWebinarPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        session_description: "",
        type: "",
        session_type: "",
        category: "",
        subcategory: "",
        start_time: "",
        end_time: "",
        price: 0,
        meeting_link: "",
        tags: "",
        trainers: [] as any[]
    });

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const [typeOptions, setTypeOptions] = useState<any[]>([]);
    const [sessionTypeOptions, setSessionTypeOptions] = useState<any[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState<any[]>([]);
    const [trainersOptions, setTrainersOptions] = useState<any[]>([]);

    const [trainerSearch, setTrainerSearch] = useState("");
    const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAuthHeaders = () => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer \${token}` } : {}),
    };
  };

  const fetchOptions = async () => {
    try {
      const hdrs = getAuthHeaders();
      const [typeRes, sessRes, catRes, trainRes] = await Promise.all([
        fetch(`\${environment.api}/admin/webinar-types`, { headers: hdrs }),
        fetch(`\${environment.api}/admin/session-types`, { headers: hdrs }),
        fetch(`\${environment.api}/categories/master/category`, { headers: hdrs }),
        fetch(`\${environment.api}/admin/users/trainers`, { headers: hdrs })
      ]);
      
      if (typeRes.ok) { const d = await typeRes.json(); setTypeOptions(Array.isArray(d) ? d : (d.data || [])); }
      if (sessRes.ok) { const d = await sessRes.json(); setSessionTypeOptions(Array.isArray(d) ? d : (d.data || [])); }
      if (catRes.ok) { const d = await catRes.json(); setCategoryOptions(Array.isArray(d) ? d : (d.data || [])); }
      if (trainRes.ok) { const d = await trainRes.json(); setTrainersOptions(Array.isArray(d) ? d : (d.data || [])); }
    } catch (err) {
      console.error("Failed to load options");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    setFormData(prev => ({ ...prev, category: catId, subcategory: "" }));
    const cat = categoryOptions.find(c => c.id === catId || c._id === catId || c.name === catId);
    if (cat && (cat.subcategories || cat.children)) {
      setSubcategoryOptions(cat.subcategories || cat.children || []);
    } else {
      setSubcategoryOptions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBannerPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getOptionLabel = (opt: any) => typeof opt === "string" ? opt : opt?.name || opt?.label || "";
  const getOptionValue = (opt: any) => opt?.id || opt?._id || opt?.name || opt?.label || opt;

  const filteredTrainers = trainersOptions.filter(t => {
    const s = trainerSearch.toLowerCase();
    const name = (getTrainerName(t)).toLowerCase();
    const email = (t.email || t.user?.email || "").toLowerCase();
    return name.includes(s) || email.includes(s);
  });

  function getTrainerName(t: any) {
    if (!t) return "";
    if (t.name) return t.name;
    const f = t.first_name || t.user?.first_name || "";
    const l = t.last_name || t.user?.last_name || "";
    return `\${f} \${l}`.trim();
  }

  const toggleTrainer = (t: any) => {
    setFormData(prev => {
      const trainers = [...prev.trainers];
      const idx = trainers.findIndex(tr => (tr.id || tr._id) === (t.id || t._id));
      if (idx > -1) trainers.splice(idx, 1);
      else trainers.push(t);
      return { ...prev, trainers };
    });
    setShowTrainerDropdown(false);
    setTrainerSearch("");
  };

  const isTrainerSelected = (t: any) => formData.trainers.some(tr => (tr.id || tr._id) === (t.id || t._id));
  
  const removeTrainer = (t: any) => {
    setFormData(prev => ({ ...prev, trainers: prev.trainers.filter(tr => (tr.id || tr._id) !== (t.id || t._id)) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!formData.title || !formData.type || !formData.session_type || !formData.start_time || !formData.end_time || !formData.description) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    if (formData.trainers.length === 0) {
      setErrorMsg("At least one trainer must be selected.");
      return;
    }

    setLoading(true);

    try {
      const trainerIds = formData.trainers.map(t => t.trainer_id || t.id || t._id);
      
      const reqBody = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        session_type: formData.session_type,
        session_description: formData.session_description,
        start_time: formData.start_time,
        end_time: formData.end_time,
        price: formData.price,
        category_id: formData.category,
        subcategory_id: formData.subcategory,
        trainer_ids: trainerIds,
        trainer_id: trainerIds[0],
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        is_paid: formData.price > 0,
        is_active: true,
        additional_info: {}
      };

      const res = await fetch(`\${environment.api}/admin/webinars`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) throw new Error("Failed to create webinar");
      
      alert("Webinar created successfully!");
      router.push("/admin/webinar-management");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create webinar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100" style={{ paddingTop: "100px" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 mt-5">Create New Webinar</h2>
          <Link href="/admin/webinar-management" className="btn btn-outline-secondary rounded-pill fw-bold mt-5 px-4">
            <i className="fas fa-arrow-left me-2"></i> Back to List
          </Link>
        </div>

        {errorMsg && <div className="alert alert-danger shadow-sm border-0">{errorMsg}</div>}

        <div className="create-webinar-two-col">
          <div className="create-webinar-form-col">
            <h4 className="fw-bold mb-4">Webinar Details</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="Enter webinar title" required />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Description <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={3} name="description" value={formData.description} onChange={handleChange} placeholder="Enter webinar description" required></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Session Description <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={3} name="session_description" value={formData.session_description} onChange={handleChange} placeholder="Enter session description" required></textarea>
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">Banner Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={onBannerChange} />
                {bannerPreview && <div className="mt-2"><img src={bannerPreview} alt="Preview" className="rounded" style={{ maxHeight: "150px" }} /></div>}
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Type <span className="text-danger">*</span></label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Select a type</option>
                    {typeOptions.map((t, i) => <option key={i} value={getOptionValue(t)}>{getOptionLabel(t)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Session Type <span className="text-danger">*</span></label>
                  <select className="form-select" name="session_type" value={formData.session_type} onChange={handleChange} required>
                    <option value="">Select a session type</option>
                    {sessionTypeOptions.map((s, i) => <option key={i} value={getOptionValue(s)}>{getOptionLabel(s)}</option>)}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select className="form-select" name="category" value={formData.category} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    {categoryOptions.map((c, i) => <option key={i} value={getOptionValue(c)}>{getOptionLabel(c)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subcategory</label>
                  <select className="form-select" name="subcategory" value={formData.subcategory} onChange={handleChange}>
                    <option value="">Select a subcategory</option>
                    {subcategoryOptions.map((sc, i) => <option key={i} value={getOptionValue(sc)}>{getOptionLabel(sc)}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Start Time <span className="text-danger">*</span></label>
                  <input type="datetime-local" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">End Time <span className="text-danger">*</span></label>
                  <input type="datetime-local" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Price <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} min="0" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tags (comma separated)</label>
                  <input type="text" className="form-control" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. tech, coding, ai" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Meeting Link</label>
                <input type="url" className="form-control" name="meeting_link" value={formData.meeting_link} onChange={handleChange} placeholder="https://" />
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label fw-semibold">Trainer(s) <span className="text-danger">*</span></label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {formData.trainers.map((t, i) => (
                    <span key={i} className="badge bg-primary d-flex align-items-center rounded-pill py-2 px-3 fw-bold shadow-sm">
                      <i className="fas fa-user-circle me-2"></i> {getTrainerName(t)}
                      <i className="fas fa-times ms-2 cursor-pointer" onClick={() => removeTrainer(t)} style={{ cursor: "pointer" }}></i>
                    </span>
                  ))}
                </div>
                
                <input type="text" className="form-control" placeholder="Search trainers by name or email..." value={trainerSearch} onChange={e => { setTrainerSearch(e.target.value); setShowTrainerDropdown(true); }} onFocus={() => setShowTrainerDropdown(true)} />
                
                {showTrainerDropdown && (
                  <div className="position-absolute w-100 bg-white border rounded shadow-lg z-3 mt-1" style={{ maxHeight: "200px", overflowY: "auto", zIndex: 10 }}>
                    {filteredTrainers.length > 0 ? filteredTrainers.map((t, i) => (
                      <div key={i} className="p-2 border-bottom cursor-pointer hover-bg-light d-flex justify-content-between align-items-center" onClick={() => toggleTrainer(t)} style={{ cursor: "pointer" }}>
                        <div>
                           <div className="fw-semibold">{getTrainerName(t)}</div>
                           <div className="small text-muted">{t.email || t.user?.email}</div>
                        </div>
                        {isTrainerSelected(t) && <i className="fas fa-check text-primary"></i>}
                      </div>
                    )) : (
                      <div className="p-2 text-muted text-center">No trainers found</div>
                    )}
                  </div>
                )}
                
                {showTrainerDropdown && (
                  /* Overlay to close dropdown */
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 5 }} onClick={() => setShowTrainerDropdown(false)}></div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" className="btn btn-light fw-bold rounded-pill px-4" onClick={() => router.push("/admin/webinar-management")}>Cancel</button>
                <button type="button" className="btn btn-secondary fw-bold rounded-pill px-4" onClick={() => alert("Save Draft coming soon")}>Save Draft</button>
                <button type="submit" className="btn btn-primary fw-bold rounded-pill px-5 shadow" disabled={loading}>
                  {loading ? "Creating..." : "Submit Webinar"}
                </button>
              </div>

            </form>
          </div>

          <div className="create-webinar-preview-col">
            <div className="webinar-card-preview border-0 shadow rounded-4 sticky-top" style={{ top: "100px" }}>
              <div className="webinar-card-banner">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                ) : (
                  <div className="bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: "100%", height: "200px" }}>
                    <i className="fas fa-image fa-3x opacity-50"></i>
                  </div>
                )}
              </div>
              <div className="webinar-card-body p-4 bg-white">
                <h4 className="fw-bold mb-3">{formData.title || "Webinar Title"}</h4>
                <p className="text-muted small mb-4">{formData.description || "Webinar description will appear here..."}</p>
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-user text-primary me-2"></i>
                  <span className="fw-medium text-dark">{formData.trainers.length > 0 ? getTrainerName(formData.trainers[0]) : "Trainer Name"}</span>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <i className="fas fa-calendar-alt text-primary me-2"></i>
                  <span className="fw-medium text-dark">{formData.start_time ? new Date(formData.start_time).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute:"2-digit" }) : "TBD"}</span>
                </div>
                <button className="btn btn-primary w-100 py-2 fw-bold text-uppercase rounded-3" disabled>VIEW DETAILS</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
