"use client";


import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { PaymentService } from "@/services/payment.service";
import "./webinar-register.css";

function WebinarRegisterContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const webinarType = params.webinarType as string;
  const webinarId = params.webinarId as string;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [isFirstNameDisabled, setIsFirstNameDisabled] = useState(false);
  const [isLastNameDisabled, setIsLastNameDisabled] = useState(false);
  const [isJobTitleDisabled, setIsJobTitleDisabled] = useState(false);
  const [isCompanyDisabled, setIsCompanyDisabled] = useState(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);

  const [isExistingUser, setIsExistingUser] = useState(false);
  const [userId, setUserId] = useState("");

  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [webinarDetails, setWebinarDetails] = useState<any>(null);
  const [transactionReference, setTransactionReference] = useState("");

  const [showThankYouPage, setShowThankYouPage] = useState(false);
  const [isForcedFree, setIsForcedFree] = useState(false);

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [iframeMonitorInterval, setIframeMonitorInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (searchParams.get("success") === "true") {
      setShowThankYouPage(true);
    }
    if (searchParams.get("isFree") === "true") {
      setIsForcedFree(true);
    }

    if (webinarType && webinarId) {
      setShowPaymentSection(true);
      loadWebinarDetails(webinarId);
      generatePaymentInfo(webinarType, webinarId);
    }

    const onMessage = (event: MessageEvent) => {
      handlePaymentMessage(event);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (iframeMonitorInterval) clearInterval(iframeMonitorInterval);
      if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webinarType, webinarId, searchParams]);

  const isFreeWebinar = useCallback(() => {
    const price = parseFloat(webinarDetails?.price || "0");
    return price === 0 || price === 0.0;
  }, [webinarDetails]);

  const getDisplayPrice = () => {
    if (isFreeWebinar()) return "FREE";
    return `₹${webinarDetails?.price || 99}`;
  };

  const handlePaymentMessage = (event: MessageEvent) => {
    if (event.data && event.data.status === "success") {
      handlePaymentSuccess(event.data);
    }
  };

  const loadWebinarDetails = async (id: string) => {
    try {
      const data = await PaymentService.getWebinarDetails(id);
      if (searchParams.get("isFree") === "true") {
        data.price = "0";
      }
      setWebinarDetails(data);
    } catch (e) {
      setErrorMessage("Failed to load webinar details. Please try again.");
    }
  };

  const generatePaymentInfo = async (type: string, id: string) => {
    setIsLoadingPayment(true);
    try {
      const info = await PaymentService.generatePaymentInfo(type, id);
      setPaymentInfo(info);
    } catch (e) {
      setErrorMessage("Failed to generate payment information.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const verifyUserEmail = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address first.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setIsVerifyingEmail(true);
    setErrorMessage("");

    const userData = {
      first_name: firstName || " ",
      last_name: lastName || " ",
      email: email,
      user_type: "trainee",
      is_verified: false,
      is_first_time_login: true,
      subscriptionId: "06fff7d5-00b6-4679-afd8-d3dd4ae3beda",
      is_active: true,
    };

    try {
      await AuthService.verifyUserEmail(userData);
      setIsEmailVerified(true);
      setIsOtpVerified(false); // require OTP
      setIsOtpSent(true);

      try {
        const response: any = await AuthService.checkIfUserExists(email.trim());
        handleUserExistenceResponse(response);
      } catch (err) {
        handleUserExistenceResponse(null);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to verify email.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const validateUsersOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otpCode)) {
      setErrorMessage("OTP must be 6 digits.");
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage("");

    try {
      const response: any = await AuthService.validateUsersOtp(email, otpCode);
      setIsOtpVerified(true);

      if (response && response.user) {
        const user = response.user;
        setIsExistingUser(true);
        if (user.id) setUserId(user.id);
        if (user.first_name) {
          setFirstName(user.first_name);
          setIsFirstNameDisabled(true);
        }
        if (user.last_name) {
          setLastName(user.last_name);
          setIsLastNameDisabled(true);
        }
        if (user.job_title) {
          setJobTitle(user.job_title);
          setIsJobTitleDisabled(true);
        }
        if (user.company || user.organization) {
          setCompany(user.company || user.organization);
          setIsCompanyDisabled(true);
        }
        if (user.phone) {
          setPhone(user.phone);
          setIsPhoneDisabled(true);
        }
      } else {
        setIsExistingUser(false);
        setUserId("");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to verify OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleUserExistenceResponse = (response: any) => {
    const user = response?.existingUser || response?.user || response?.data?.user || response?.data || null;
    const exists = response?.exists ?? !!user;

    if (exists && user) {
      setIsExistingUser(true);
      setUserId(user.id || user.userId || user.user_id || "");

      const fName = user.first_name || user.firstName || user.firstname;
      const lName = user.last_name || user.lastName || user.lastname;
      const jTitle = user.job_title || user.jobTitle || user.jobtitle;
      const comp = user.company || user.organization || user.organisation;
      const ph = user.phone || user.phone_number || user.mobile || user.mobileNumber;

      if (fName) {
        setFirstName(fName);
        setIsFirstNameDisabled(true);
      }
      if (lName) {
        setLastName(lName);
        setIsLastNameDisabled(true);
      }
      if (jTitle) {
        setJobTitle(jTitle);
        setIsJobTitleDisabled(true);
      }
      if (comp) {
        setCompany(comp);
        setIsCompanyDisabled(true);
      }
      if (ph) {
        setPhone(ph);
        setIsPhoneDisabled(true);
      }
    } else {
      setIsExistingUser(false);
      setUserId("");
      setIsFirstNameDisabled(false);
      setIsLastNameDisabled(false);
      setIsJobTitleDisabled(false);
      setIsCompanyDisabled(false);
      setIsPhoneDisabled(false);
    }
  };

  const generateRandomTransactionId = () => {
    const now = new Date();
    const timestamp = now.getTime();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FREE_\${dateStr}_\${timestamp}_\${randomSuffix}`;
  };

  const subscribeAndNavigate = async (uId: string, txnId: string) => {
    const subscriptionData = {
      webinarId: webinarId,
      userId: uId,
      transactionId: txnId,
      amount: parseInt(webinarDetails?.price),
    };

    try {
      await AuthService.subscribeToWebinar(subscriptionData);
      router.push(`/auth/register/\${webinarType}/\${webinarId}?success=true&txnId=\${txnId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      router.push("/auth/webinar-registration-success");
    }
  };

  const registerAndSubscribe = async (txnId: string) => {
    const registrationData = {
      first_name: firstName,
      user_type: "trainee",
      is_verified: false,
      is_first_time_login: true,
      subscriptionId: "06fff7d5-00b6-4679-afd8-d3dd4ae3beda",
      is_active: true,
      last_name: lastName,
      email: email,
      phone: phone,
      job_title: jobTitle,
      company: company,
      transactionId: txnId,
    };

    try {
      const response: any = await AuthService.registerWebinarWithUser(registrationData);
      const createdUserId = response?.user?.id;
      if (createdUserId) {
        setUserId(createdUserId);
        subscribeAndNavigate(createdUserId, txnId);
      } else {
        router.push("/auth/webinar-registration-success");
      }
    } catch (error) {
      router.push("/auth/webinar-registration-success");
    }
  };

  const completeRegistrationAfterPayment = async (txnId: string) => {
    if (userId) {
      subscribeAndNavigate(userId, txnId);
      return;
    }
    if (email) {
      try {
        const response = await AuthService.checkIfUserExists(email.trim());
        handleUserExistenceResponse(response);
        if (response?.exists) {
          const userObj = response?.existingUser || response?.user || response?.data?.user || response?.data;
          subscribeAndNavigate(userObj.id, txnId);
        } else {
          registerAndSubscribe(txnId);
        }
      } catch (err) {
        registerAndSubscribe(txnId);
      }
    } else {
      registerAndSubscribe(txnId);
    }
  };

  const completeRegistration = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    const userTransactionId = isFreeWebinar() ? generateRandomTransactionId() : transactionReference.trim();

    try {
      const response = await AuthService.checkIfUserExists(email.trim());
      handleUserExistenceResponse(response);
      finalizeRegistration(userTransactionId);
    } catch (error) {
      setIsExistingUser(false);
      setUserId("");
      finalizeRegistration(userTransactionId);
    }
  };

  const finalizeRegistration = async (userTransactionId: string) => {
    // Note: since states (isExistingUser, userId) might not be updated immediately after handleUserExistenceResponse
    // it's safer to read the values logic again, but here we can just do completeRegistrationAfterPayment logic
    await completeRegistrationAfterPayment(userTransactionId);
    setIsSubmitting(false);
  };

  const registerTrainee = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setErrorMessage("Please verify your email first.");
      return;
    }
    if (!isOtpVerified) {
      setErrorMessage("Please verify your OTP first.");
      return;
    }
    if (!isFreeWebinar() && (!transactionReference || transactionReference.trim() === "")) {
      // It normally starts initiatePayment, but if we're bypassing or already paid we need this.
      // Wait, in the Angular code, the submit button for paid is `initiatePayment()` and free is `registerTrainee()`.
      // So this method is only for free.
    }
    completeRegistration();
  };

  const extractTransactionIdFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const paramNames = [
        "txnId",
        "transactionId",
        "transaction_id",
        "txn_id",
        "orderId",
        "order_id",
        "paymentId",
        "payment_id",
        "refId",
        "ref_id",
        "merchantTxnId",
        "merchant_txn_id",
      ];
      for (const paramName of paramNames) {
        const value = urlObj.searchParams.get(paramName);
        if (value) return value;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handlePaymentSuccess = (data: any) => {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
      setPaymentWindow(null);
    }
    if (iframeMonitorInterval) {
      clearInterval(iframeMonitorInterval);
      setIframeMonitorInterval(null);
    }

    let transactionId = null;
    if (data.url) transactionId = extractTransactionIdFromUrl(data.url);
    if (!transactionId && (data.transactionId || data.txnId)) {
      transactionId = data.transactionId || data.txnId;
    }

    if (transactionId) {
      completeRegistrationAfterPayment(transactionId);
    } else {
      router.push("/auth/webinar-registration-success");
    }
  };

  const isSuccessUrl = (url: string) => {
    const successIndicators = [
      "/auth/register",
      "success=true",
      "/webinar-registration-success",
      "payment-success",
      "registration-success",
    ];
    return successIndicators.some((indicator) => url.toLowerCase().includes(indicator.toLowerCase()));
  };

  const startWindowMonitoring = (win: Window) => {
    if (iframeMonitorInterval) clearInterval(iframeMonitorInterval);

    const interval = setInterval(() => {
      try {
        if (win && win.closed) {
          clearInterval(interval);
          setIsPaymentProcessing(false);
          setPaymentWindow(null);
          return;
        }

        if (win && win.location) {
          const windowUrl = win.location.href;
          if (isSuccessUrl(windowUrl)) {
            clearInterval(interval);
            if (win) {
              win.close();
              setPaymentWindow(null);
            }
            handlePaymentSuccess({ url: windowUrl });
          }
        }
      } catch (error) {
        // Cross-origin restriction
      }
    }, 2000);
    setIframeMonitorInterval(interval);
  };

  const initiatePayment = async () => {
    if (!email || !phone) {
      setErrorMessage("Please fill in all required fields (email, phone)");
      return;
    }
    setIsPaymentProcessing(true);

    const amountValue = parseFloat(webinarDetails?.price || "99");
    const amountInteger = Math.floor(amountValue);

    const paymentRequest = {
      amount: amountInteger,
      currencyCode: "356",
      customerEmailID: email,
      customerMobileNo: phone,
      payType: "0",
    };

    try {
      const response = await PaymentService.initiatePayment(paymentRequest);
      if (response && response.redirectUrl) {
        const windowFeatures = "width=400,height=600,left=100,top=100,resizable=yes,scrollbars=yes";
        const win = window.open(response.redirectUrl, "PaymentGateway", windowFeatures);
        setPaymentWindow(win);
        setIsPaymentProcessing(false);

        if (win) {
          startWindowMonitoring(win);
        }
      } else {
        setErrorMessage("Failed to get payment redirect URL");
        setIsPaymentProcessing(false);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to initiate payment.");
      setIsPaymentProcessing(false);
    }
  };

  const goToHome = () => router.push("/home");

  return (
    <div className="body-inner">
      <div className="register-section">
        <div className="container-fluid">
          <div className="row align-items-center min-vh-100" style={{ paddingTop: "50px" }}>
            {/* Thank You Page */}
            {showThankYouPage && (
              <div className="col-12 d-flex justify-content-center">
                <div className="thank-you-card">
                  <div className="success-animation">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                      <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                  </div>
                  <div className="thank-you-content">
                    <h1 className="thank-you-title">Registration Successful!</h1>
                    <p className="thank-you-message">
                      Thank you for registering for the webinar. You will receive a confirmation email shortly with all the details.
                    </p>
                    <p className="thank-you-submessage">We&apos;re excited to have you join us!</p>
                    <button type="button" className="btn btn-primary btn-home" onClick={goToHome}>
                      <i className="fas fa-home"></i> Go to Home
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Webinar Registration Card */}
            {!showThankYouPage && (
              <div className="col-12 d-flex justify-content-center">
                <div className="webinar-registration-card">
                  {/* Card Banner */}
                  <div className="card-banner">
                    <div className="banner-overlay"></div>
                    <div className="banner-content">
                      <div className="banner-icon">📦</div>
                      <h1 className="banner-title">Webinar Registration</h1>
                      <p className="banner-subtitle">Secure your spot for this exclusive session</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body-content">
                    {showPaymentSection && webinarDetails && (
                      <>
                        <div className="webinar-title-section">
                          <h2 className="webinar-title">{webinarDetails.title}</h2>
                        </div>
                        <div className="datetime-section">
                          <div className="datetime-item">
                            <div className="datetime-icon">
                              <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="datetime-content">
                              <span className="datetime-label">Date</span>
                              <span className="datetime-value">
                                {new Date(webinarDetails.start_time).toDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="datetime-item">
                            <div className="datetime-icon">
                              <i className="fas fa-clock"></i>
                            </div>
                            <div className="datetime-content">
                              <span className="datetime-label">Time</span>
                              <span className="datetime-value">
                                {new Date(webinarDetails.start_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {new Date(webinarDetails.end_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                IST
                              </span>
                            </div>
                          </div>
                          <div className="datetime-item">
                            <div className="datetime-icon">
                              <i className="fas fa-rupee-sign"></i>
                            </div>
                            <div className="datetime-content">
                              <span className="datetime-label">Price</span>
                              <span className="datetime-value price-value">{getDisplayPrice()}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Registration Form */}
                    <div className="registration-form-section">
                      <div className="section-header">
                        <h3 className="section-title">Complete Your Registration</h3>
                        {!isOtpVerified ? (
                          <p className="section-subtitle">Enter your email to get started.</p>
                        ) : (
                          <p className="section-subtitle">Complete your registration details.</p>
                        )}
                      </div>

                      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                      <form onSubmit={registerTrainee} noValidate>
                        <div className="form-group">
                          <label htmlFor="email">
                            Email Address<span className="req-astrix">*</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={verifyUserEmail}
                              disabled={!email || isEmailVerified || isVerifyingEmail}
                            >
                              {isVerifyingEmail
                                ? "Verifying..."
                                : isEmailVerified
                                  ? "Verified"
                                  : "Verify"}
                            </button>
                          </div>
                          {isOtpSent && !isOtpVerified && (
                            <small className="text-success mt-1 d-block">
                              <i className="fas fa-check-circle"></i> OTP sent to your email id.
                            </small>
                          )}
                        </div>

                        {/* OTP Verification */}
                        {isEmailVerified && !isOtpVerified && (
                          <div className="form-group">
                            <label htmlFor="otp">
                              Enter OTP<span className="req-astrix">*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                id="otp"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                disabled={isVerifyingOtp}
                                required
                              />
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={validateUsersOtp}
                                disabled={!otpCode || otpCode.length !== 6 || isVerifyingOtp}
                              >
                                {isVerifyingOtp ? "Verifying..." : "Validate OTP"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Other Form Fields */}
                        {isOtpVerified && (
                          <>
                            <div className="form-group">
                              <label>First Name<span className="req-astrix">*</span></label>
                              <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                disabled={isFirstNameDisabled}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Last Name<span className="req-astrix">*</span></label>
                              <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                disabled={isLastNameDisabled}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Job Title<span className="req-astrix">*</span></label>
                              <input
                                type="text"
                                className="form-control"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Enter your job title"
                                disabled={isJobTitleDisabled}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Company<span className="req-astrix">*</span></label>
                              <input
                                type="text"
                                className="form-control"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Enter your company name"
                                disabled={isCompanyDisabled}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Phone Number<span className="req-astrix">*</span></label>
                              <input
                                type="tel"
                                className="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your 10-digit phone number"
                                disabled={isPhoneDisabled}
                                required
                              />
                            </div>
                          </>
                        )}

                        {/* Action Buttons */}
                        {isOtpVerified && (
                          <div className="form-actions">
                            {!isFreeWebinar() ? (
                              <button
                                type="button"
                                className="btn btn-primary btn-pay-register"
                                onClick={initiatePayment}
                                disabled={isPaymentProcessing}
                              >
                                {isPaymentProcessing
                                  ? "Processing..."
                                  : `Pay Now \${getDisplayPrice()}`}
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-primary btn-register"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Processing..." : "Register"}
                              </button>
                            )}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebinarRegisterPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <WebinarRegisterContent />
    </React.Suspense>
  );
}
