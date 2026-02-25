export const environment = {
    api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
};

export const AuthService = {
    isUserLoggedIn: (): boolean => {
        if (typeof window !== "undefined") {
            return !!sessionStorage.getItem("authToken");
        }
        return false;
    },

    sendOtp: async (email: string) => {
        const res = await fetch(`${environment.api}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to send OTP");
        return res.json();
    },

    verifyEmail: async (userData: any) => {
        const res = await fetch(`${environment.api}/users/validate-trainer-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!res.ok) throw new Error("Failed to verify email");
        return res.json();
    },

    verifyUserEmail: async (userData: any) => {
        const res = await fetch(`${environment.api}/users/validate-users-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!res.ok) throw new Error("Failed to verify user email");
        return res.json();
    },

    validateUsersOtp: async (email: string, otpCode: string) => {
        const res = await fetch(`${environment.api}/auth/validate-user-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otpCode }),
        });
        if (!res.ok) throw new Error("Failed to validate user OTP");
        return res.json();
    },

    validateOtp: async (email: string, otpCode: string) => {
        const res = await fetch(`${environment.api}/auth/validate-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otpCode }),
        });
        if (!res.ok) throw new Error("Failed to validate OTP");
        return res.json();
    },

    validateTrainerOtp: async (email: string, otpCode: string) => {
        const res = await fetch(`${environment.api}/auth/validate-trainer-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otpCode }),
        });
        if (!res.ok) throw new Error("Failed to validate trainer OTP");
        return res.json();
    },

    registerTrainee: async (registrationData: any) => {
        const res = await fetch(`${environment.api}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registrationData),
        });
        if (!res.ok) throw new Error("Failed to register trainee");
        return res.json();
    },

    registerWebinarWithUser: async (registrationData: any) => {
        const res = await fetch(`${environment.api}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registrationData),
        });
        if (!res.ok) throw new Error("Failed to register webinar with user");
        return res.json();
    },

    checkIfUserExists: async (email: string) => {
        const res = await fetch(`${environment.api}/users/is-user-exists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to check if user exists");
        return res.json();
    },

    subscribeToWebinar: async (subscriptionData: any) => {
        const res = await fetch(`${environment.api}/webinar-subscriptions/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscriptionData),
        });
        if (!res.ok) throw new Error("Failed to subscribe to webinar");
        return res.json();
    },

    getProfile: async () => {
        const token = sessionStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const res = await fetch(`${environment.api}/profile/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
    },

    logout: () => {
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("user");
        }
    },
};
