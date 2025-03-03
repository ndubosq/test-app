import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, Company } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchCompany: (companyId: string) => void;
  addCompany: (company: Omit<Company, 'id'>) => void;
  removeCompany: (companyId: string) => void;
  updateUser: (userData: Partial<User>) => void;
  setOnboardingComplete: (completed: boolean) => void;
}

// Mock user data for demo purposes
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// Mock companies for demo purposes
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Inc.',
    logo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    industry: 'Technology',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Globex Corporation',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    industry: 'Manufacturing',
  },
  {
    id: '3',
    name: 'Soylent Corp',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    industry: 'Food & Beverage',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      companies: [],
      currentCompany: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, accept any email/password
        if (email && password) {
          set({
            user: mockUser,
            companies: mockCompanies,
            currentCompany: mockCompanies.find(c => c.isDefault) || mockCompanies[0],
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          // Keep companies and currentCompany for demo purposes
        });
      },
      
      switchCompany: (companyId) => {
        const { companies } = get();
        const company = companies.find(c => c.id === companyId);
        if (company) {
          set({ currentCompany: company });
        }
      },
      
      addCompany: (companyData) => {
        const newCompany: Company = {
          ...companyData,
          id: Date.now().toString(),
        };
        
        set(state => ({
          companies: [...state.companies, newCompany],
          currentCompany: state.companies.length === 0 ? newCompany : state.currentCompany,
        }));
      },
      
      removeCompany: (companyId) => {
        const { companies, currentCompany } = get();
        const updatedCompanies = companies.filter(c => c.id !== companyId);
        
        set({
          companies: updatedCompanies,
          currentCompany: currentCompany?.id === companyId
            ? (updatedCompanies.length > 0 ? updatedCompanies[0] : null)
            : currentCompany,
        });
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      setOnboardingComplete: (completed) => {
        set({ hasCompletedOnboarding: completed });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);