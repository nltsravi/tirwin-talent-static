import { environment } from "./auth.service";

export class WebinarService {
  /**
   * Fetch webinars based on stype and tabType.
   */
  static async getWebinars(stype: string, tabType: string): Promise<any[]> {
    if (tabType === "allCourses") {
      const url = `${environment.api}/webinars/${stype}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch webinars");
      }
      return response.json();
    } else {
      let user: any = {};
      if (typeof window !== "undefined") {
        user = JSON.parse(sessionStorage.getItem("user") || "{}");
      }
      const url = `${environment.api}/webinars/my-webinars/${stype}/${user?.id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch my webinars");
      }
      return response.json();
    }
  }

  /**
   * Get webinar by ID
   */
  static async getWebinarById(id: string): Promise<any> {
    let token = null;
    let userId = null;
    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("authToken");
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          userId = JSON.parse(userStr)?.id;
        } catch (e) { }
      }
    }

    const headers: any = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = token && userId
      ? `${environment.api}/webinars/${id}/${userId}`
      : `${environment.api}/webinars/get-webinar-public/${id}`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error("Failed to fetch webinar details");
    }
    return response.json();
  }
}
