/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'university_admin' | 'super_admin' | 'recruiter' | 'instructor';
  avatar?: string;
  githubId?: string;
  enrolledCourses: (string | any)[];
  universityId?: any;
  collegeId?: any;
  year?: string;
  branch?: string;
  careerInterest?: string;
  onboardingComplete?: boolean;
  primaryDomain?: string;
  secondarySkills?: string[];
  domainLevel?: string;
  recruiterProfile?: {
    companyName: string;
    companyWebsite: string;
    companyLogo: string;
    companyDescription: string;
    verificationStatus: 'Pending' | 'Approved' | 'Rejected';
    isVerified: boolean;
  };
  collaborationScore?: number;
  leadershipScore?: number;
  technicalScore?: number;
  totalXp?: number;
  learningStreak?: number;
  rank?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: any) => Promise<boolean>;
  githubLogin: (token: string, user: User) => void;
  logout: () => void;
  setAuth: (token: string, user: User) => void;
  updateProfile: (data: Partial<User>) => void;
  enrollInCourse: (courseId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
    // If we're not already on login, redirect
    if (!window.location.hash.includes('/login')) {
      window.location.href = '/#/login';
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for social login callback in URL
      const hash = window.location.hash;
      const searchPart = hash.includes('?') ? hash.split('?')[1] : window.location.search;
      const params = new URLSearchParams(searchPart);

      const urlToken = params.get('token');
      const userDataStr = params.get('user');
      const githubSuccess = params.get('github') === 'success';

      if (urlToken && userDataStr) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataStr));
          setUser(userData);
          localStorage.setItem('skillbridge_token', urlToken);
          localStorage.setItem('skillbridge_user', JSON.stringify(userData));

          if (githubSuccess) {
            toast.success('GitHub account connected successfully!');
          }

          // Clean URL
          const newUrl = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
          window.history.replaceState({}, '', newUrl);
        } catch (err) {
          console.error('Failed to parse social login user data', err);
        }
      }

      // 2. Load from storage
      const storedToken = localStorage.getItem('skillbridge_token');
      const storedUser = localStorage.getItem('skillbridge_user');

      if (storedToken && storedUser) {
        try {
          // Initialize from localStorage for immediate UI feedback
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Verify token by fetching fresh profile
          const response = await api.getMe();
          if (response) {
            const userData = response.user || response.data;
            if (userData) {
              setUser(userData);
              localStorage.setItem('skillbridge_user', JSON.stringify(userData));
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const data = await api.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('skillbridge_token', data.token);

        // Node.js backend returns user directly in login response
        let userData = data.user;

        if (!userData) {
          // Fallback: Fetch full user profile if not returned
          const userProfile = await api.getMe();
          userData = userProfile.user || userProfile.data || userProfile;
        }

        if (userData) {
          setUser(userData);
          localStorage.setItem('skillbridge_user', JSON.stringify(userData));
        }

        return userData;
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error;
    }
    return null;
  }, []);

  const register = useCallback(async (userData: any): Promise<boolean> => {
    try {
      const data = await api.register(userData);
      // Registrations usually return the user and token directly in many implementations
      // If it only returns the user, we might need to log in after
      if (data) {
        // If the API returns a token on signup, use it
        if (data.token) {
          localStorage.setItem('skillbridge_token', data.token);
          const userData = data.user || data;
          setUser(userData);
          localStorage.setItem('skillbridge_user', JSON.stringify(userData));
        }
        return true;
      }
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      throw error;
    }
    return false;
  }, []);

  const githubLogin = useCallback((token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('skillbridge_token', token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
  }, []);

  const setAuth = useCallback((token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('skillbridge_token', token);
    localStorage.setItem('skillbridge_user', JSON.stringify(userData));
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('skillbridge_user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const enrollInCourse = useCallback(async (courseId: string) => {
    if (user) {
      try {
        await api.enroll(courseId);
        const response = await api.getMe();
        const userData = response.user || response.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem('skillbridge_user', JSON.stringify(userData));
        }
      } catch (error: any) {
        console.error('Enrollment failed:', error.message);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        githubLogin,
        logout,
        setAuth,
        updateProfile,
        enrollInCourse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
