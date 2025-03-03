import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Document, DocumentFilter, DocumentMainCategory, DocumentSubCategory, DocumentFileType } from '@/types/document';
import { useAuthStore } from './auth-store';

interface DocumentState {
  documents: Document[];
  filter: DocumentFilter;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setFilter: (filter: DocumentFilter) => void;
  toggleFavorite: (id: string) => void;
  getCompanyDocuments: () => Document[];
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      filter: {
        sortBy: 'date',
        sortOrder: 'desc',
      },
      
      addDocument: (document) => {
        const currentCompany = useAuthStore.getState().currentCompany;
        
        if (!currentCompany) return;
        
        const newDocument: Document = {
          ...document,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          companyId: currentCompany.id,
        };
        
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
      },
      
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) => 
            doc.id === id 
              ? { ...doc, ...updates, updatedAt: Date.now() } 
              : doc
          ),
        }));
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }));
      },
      
      setFilter: (filter) => {
        set({ filter });
      },
      
      toggleFavorite: (id) => {
        set((state) => ({
          documents: state.documents.map((doc) => 
            doc.id === id 
              ? { ...doc, favorite: !doc.favorite, updatedAt: Date.now() } 
              : doc
          ),
        }));
      },
      
      getCompanyDocuments: () => {
        const { documents } = get();
        const currentCompany = useAuthStore.getState().currentCompany;
        
        if (!currentCompany) return [];
        
        return documents.filter(doc => doc.companyId === currentCompany.id);
      },
    }),
    {
      name: 'document-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);