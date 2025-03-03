export type DocumentMainCategory = 'comptabilite' | 'juridique' | 'social';

export type DocumentSubCategory = 
  | 'achat' 
  | 'ventes' 
  | 'banque' 
  | 'fiscal' 
  | 'divers'
  | 'contrats'
  | 'statuts'
  | 'assemblees'
  | 'paie'
  | 'conges'
  | 'formation';

export type DocumentFileType = 'pdf' | 'image' | 'xls' | 'doc' | 'other';

export interface Document {
  id: string;
  title: string;
  mainCategory: DocumentMainCategory;
  subCategory?: DocumentSubCategory;
  fileType: DocumentFileType;
  imageUri: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  notes?: string;
  amount?: number;
  currency?: string;
  favorite: boolean;
  processed: boolean;
  companyId: string;
}

export interface DocumentFilter {
  mainCategory?: DocumentMainCategory;
  subCategory?: DocumentSubCategory;
  fileType?: DocumentFileType;
  searchQuery?: string;
  tags?: string[];
  favorite?: boolean;
  sortBy?: 'date' | 'title' | 'amount';
  sortOrder?: 'asc' | 'desc';
}