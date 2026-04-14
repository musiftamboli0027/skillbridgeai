export interface UserData {
  goal: string;
  level: string;
  intent: string;
  isOnboarded: boolean;
  timestamp?: string;
}

const STORAGE_KEY = 'skillbridge_onboarding';

export const userStorage = {
  getUser: (): UserData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return null;
    }
  },

  setUser: (data: Partial<UserData>) => {
    const current = userStorage.getUser() || { goal: '', level: '', intent: '', isOnboarded: false };
    const updated = { ...current, ...data, isOnboarded: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isOnboarded: (): boolean => {
    const user = userStorage.getUser();
    return !!(user && user.isOnboarded);
  }
};
