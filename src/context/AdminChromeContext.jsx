import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminApi } from '../services/admin.api';

const AdminChromeContext = createContext(null);

export function AdminChromeProvider({ children }) {
  const [analytics, setAnalytics] = useState(null);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [pendingFeedback, setPendingFeedback] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  const refreshBadges = useCallback(async () => {
    try {
      const [analyticsRes, feedbackRes, reviewsRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAdminFeedback({ status: 'pending' }),
        adminApi.getAdminReviews('pending')
      ]);

      if (analyticsRes?.success) {
        setAnalytics(analyticsRes.analytics);
        setPendingSubmissions(analyticsRes.analytics?.activity?.pendingSubmissions || 0);
      }
      if (feedbackRes?.success) {
        setPendingFeedback((feedbackRes.feedback || []).length);
      }
      if (reviewsRes?.success) {
        setPendingReviews((reviewsRes.ratings || reviewsRes.reviews || []).length);
      }
    } catch {
      /* keep last known badges */
    }
  }, []);

  useEffect(() => {
    refreshBadges();
  }, [refreshBadges]);

  return (
    <AdminChromeContext.Provider
      value={{ analytics, pendingSubmissions, pendingFeedback, pendingReviews, refreshBadges }}
    >
      {children}
    </AdminChromeContext.Provider>
  );
}

export function useAdminChrome() {
  const ctx = useContext(AdminChromeContext);
  if (!ctx) {
    return { analytics: null, pendingSubmissions: 0, pendingFeedback: 0, pendingReviews: 0, refreshBadges: () => {} };
  }
  return ctx;
}
