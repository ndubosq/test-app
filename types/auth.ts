export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  isDefault?: boolean;
}

export interface AuthState {
  user: User | null;
  companies: Company[];
  currentCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}