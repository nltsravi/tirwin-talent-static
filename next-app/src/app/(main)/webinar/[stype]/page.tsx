"use client";


import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { WebinarService } from "@/services/webinar.service";
import "./webinar-list.css";

function WebinarListContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const stype = (params.stype as string) || "events";
  const typeQuery = searchParams.get("type");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]);
  const [filteredWebinars, setFilteredWebinars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("allCourses");
  const [tabs, setTabs] = useState<{ id: string; label: string; show: boolean }[]>([]);

  useEffect(() => {
    const loggedIn = !!sessionStorage.getItem("authToken");
    setIsLoggedIn(loggedIn);

    setTabs([
      { id: "allCourses", label: "All Courses", show: true },
      { id: "myCourses", label: "My Courses", show: loggedIn },
    ]);
  }, []);

  useEffect(() => {
    fetchWebinars(stype, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stype, activeTab, typeQuery]);

  useEffect(() => {
    filterWebinars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, webinars]);

  const isTBDDate = (dateString: string) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date.getFullYear() === 2000 && date.getMonth() === 0 && date.getDate() === 1;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString || isTBDDate(dateString)) {
      return "TBD";
    }
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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

  const fetchWebinars = async (currentType: string, tabType: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await WebinarService.getWebinars(currentType, tabType);
      const mappedWebinars = data.map((webinar: any) => ({
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        session_type: webinar.session_type,
        session_description: webinar.session_description,
        trainer_ids: webinar.trainer_ids,
        image:
          webinar.media?.find((m: any) => m.media_type === "banner")?.media_url ||
          "https://via.placeholder.com/300",
        author:
          currentType === "events"
            ? "Panel Members"
            : formatTrainerName(
              webinar.trainer?.user?.first_name,
              webinar.trainer?.user?.last_name
            ),
        start_time: formatDisplayDate(webinar.start_time),
        end_time:
          webinar.end_time && !isTBDDate(webinar.start_time)
            ? new Date(webinar.end_time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : null,
        category: webinar.category?.name,
        isNew:
          new Date(webinar.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Mark as new if created within the last 7 days
      }));

      const uniqueCategories = Array.from(
        new Set(mappedWebinars.map((w: any) => w.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);

      if (typeQuery && uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }

      setWebinars(mappedWebinars);
      setFilteredWebinars(mappedWebinars);
    } catch (error) {
      console.error("Error fetching webinars:", error);
      setErrorMessage("Failed to load webinars. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterWebinars = () => {
    const filtered = webinars.filter((webinar) => {
      const matchesSearch = webinar.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? webinar.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredWebinars(filtered);
  };

  const viewDetails = (webinar: any) => {
    const staticWebinarIds = [
      "4e86e649-bb3c-45c4-a2ff-be4c625e2ac8",
      "87d95e20-2caf-461a-92ce-94ff99d465c6",
    ];

    if (staticWebinarIds.includes(webinar?.id)) {
      router.push(`/webinar-new/\${stype}/\${webinar?.id}`);
    } else {
      router.push(`/webinar/\${stype}/\${webinar?.id}`);
    }
  };

  const handleTabChange = (tabId: string) => {
    setSearchQuery("");
    setSelectedCategory("");
    setActiveTab(tabId);
  };

  return (
    <div className="container-fluid mt-4 min-vh-100" style={{ paddingTop: "80px" }}>
      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search Events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-5">
          <i className="fas fa-spinner fa-spin fa-2x"></i>
          <p className="mt-2">Loading webinars...</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      {/* Tabs Section */}
      <ul className="nav nav-tabs mb-4" id="courseTabs" role="tablist">
        {tabs.map((tab) =>
          tab.show ? (
            <li className="nav-item" role="presentation" key={tab.id}>
              <button
                className={`nav-link \${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                role="tab"
              >
                {tab.label}
              </button>
            </li>
          ) : null
        )}
      </ul>

      {/* Tab Content */}
      <div className="tab-content" id="courseTabsContent">
        <div className="tab-pane fade show active" role="tabpanel">
          {!isLoading && filteredWebinars.length > 0 ? (
            <div className="row">
              {filteredWebinars.map((webinar) => (
                <div key={webinar.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card webinar-card h-100 d-flex flex-column">
                    <div className="card-banner position-relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={webinar.image}
                        className="card-img-top"
                        alt={webinar.title}
                      />
                      {webinar.isNew && (
                        <span className="badge bg-danger webinar-badge">
                          New
                        </span>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{webinar.title}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {webinar.description}
                      </p>
                      <p className="text-muted mb-1">
                        <i className="fas fa-user me-2"></i>
                        {webinar.author}
                      </p>

                      {webinar.session_type === "TRAINING" ? (
                        <p className="text-muted mb-3">
                          <i className="fas fa-calendar me-2"></i>
                          April 21st, 2025 - April 26st, 2025
                        </p>
                      ) : (
                        <p className="text-muted mb-3">
                          <i className="fas fa-calendar me-2"></i>
                          {activeTab === "myCourses" && webinar.start_time && webinar.end_time
                            ? "April 10, 2025 8:00 PM - 9:00 PM"
                            : webinar.start_time}
                        </p>
                      )}

                      <button
                        className="btn btn-primary w-100 mt-auto"
                        onClick={() => viewDetails(webinar)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center p-5">
                <h4>
                  {activeTab === "allCourses"
                    ? "No courses available under All Courses"
                    : "No events you have registered. Please register for an event to get started!"}
                </h4>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function WebinarListPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <WebinarListContent />
    </React.Suspense>
  );
}
