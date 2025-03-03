import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Filter, ChevronDown, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { DocumentFilter, DocumentMainCategory, DocumentSubCategory, DocumentFileType } from '@/types/document';
import { useDocumentStore } from '@/store/document-store';

const mainCategories: DocumentMainCategory[] = ['comptabilite', 'juridique', 'social'];

const subCategoriesByMain: Record<DocumentMainCategory, DocumentSubCategory[]> = {
  comptabilite: ['achat', 'ventes', 'banque', 'fiscal', 'divers'],
  juridique: ['contrats', 'statuts', 'assemblees', 'divers'],
  social: ['paie', 'conges', 'formation', 'divers'],
};

const fileTypes: DocumentFileType[] = ['image', 'pdf', 'xls', 'doc', 'other'];

export default function FilterBar() {
  const [showFilters, setShowFilters] = useState(false);
  const filter = useDocumentStore(state => state.filter);
  const setFilter = useDocumentStore(state => state.setFilter);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleMainCategorySelect = (category: DocumentMainCategory | undefined) => {
    // If selecting a new main category, reset subcategory
    setFilter({ 
      ...filter, 
      mainCategory: category,
      subCategory: undefined
    });
  };
  
  const handleSubCategorySelect = (subCategory: DocumentSubCategory | undefined) => {
    setFilter({ ...filter, subCategory });
  };
  
  const handleFileTypeSelect = (fileType: DocumentFileType | undefined) => {
    setFilter({ ...filter, fileType });
  };
  
  const handleSortSelect = (sortBy: 'date' | 'title' | 'amount') => {
    setFilter({ 
      ...filter, 
      sortBy,
      sortOrder: filter.sortBy === sortBy && filter.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };
  
  const handleFavoriteToggle = () => {
    setFilter({ 
      ...filter, 
      favorite: filter.favorite === undefined ? true : filter.favorite ? false : undefined 
    });
  };
  
  const clearFilters = () => {
    setFilter({
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };
  
  const hasActiveFilters = 
    filter.mainCategory !== undefined || 
    filter.subCategory !== undefined || 
    filter.fileType !== undefined || 
    filter.favorite !== undefined;
  
  const getMainCategoryLabel = (category: DocumentMainCategory): string => {
    switch (category) {
      case 'comptabilite': return 'Comptabilité';
      case 'juridique': return 'Juridique';
      case 'social': return 'Social';
      default: return category;
    }
  };
  
  const getSubCategoryLabel = (category: DocumentSubCategory): string => {
    switch (category) {
      case 'achat': return 'Achat';
      case 'ventes': return 'Ventes';
      case 'banque': return 'Banque';
      case 'fiscal': return 'Fiscal';
      case 'divers': return 'Divers';
      case 'contrats': return 'Contrats';
      case 'statuts': return 'Statuts';
      case 'assemblees': return 'Assemblées';
      case 'paie': return 'Paie';
      case 'conges': return 'Congés';
      case 'formation': return 'Formation';
      default: return category;
    }
  };
  
  const getFileTypeLabel = (type: DocumentFileType): string => {
    switch (type) {
      case 'image': return 'Image';
      case 'pdf': return 'PDF';
      case 'xls': return 'Excel';
      case 'doc': return 'Word';
      case 'other': return 'Other';
      default: return type;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.filterButton} 
          onPress={toggleFilters}
          android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
        >
          <Filter size={18} color={hasActiveFilters ? colors.dark.primary : colors.dark.text} />
          <Text style={[styles.filterText, hasActiveFilters && styles.activeFilterText]}>
            Filter
          </Text>
          <ChevronDown 
            size={16} 
            color={colors.dark.text} 
            style={[styles.chevron, showFilters && styles.chevronUp]} 
          />
        </Pressable>
        
        {hasActiveFilters && (
          <Pressable 
            style={styles.clearButton} 
            onPress={clearFilters}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
          >
            <X size={16} color={colors.dark.text} />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Main Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <Pressable
              style={[
                styles.categoryChip,
                filter.mainCategory === undefined && styles.activeCategoryChip
              ]}
              onPress={() => handleMainCategorySelect(undefined)}
            >
              <Text style={[
                styles.categoryText,
                filter.mainCategory === undefined && styles.activeCategoryText
              ]}>All</Text>
            </Pressable>
            
            {mainCategories.map(category => (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  filter.mainCategory === category && styles.activeCategoryChip
                ]}
                onPress={() => handleMainCategorySelect(category)}
              >
                <Text style={[
                  styles.categoryText,
                  filter.mainCategory === category && styles.activeCategoryText
                ]}>{getMainCategoryLabel(category)}</Text>
              </Pressable>
            ))}
          </ScrollView>
          
          {filter.mainCategory && (
            <>
              <Text style={styles.sectionTitle}>Subcategory</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <Pressable
                  style={[
                    styles.categoryChip,
                    filter.subCategory === undefined && styles.activeCategoryChip
                  ]}
                  onPress={() => handleSubCategorySelect(undefined)}
                >
                  <Text style={[
                    styles.categoryText,
                    filter.subCategory === undefined && styles.activeCategoryText
                  ]}>All</Text>
                </Pressable>
                
                {subCategoriesByMain[filter.mainCategory].map(subCategory => (
                  <Pressable
                    key={subCategory}
                    style={[
                      styles.categoryChip,
                      filter.subCategory === subCategory && styles.activeCategoryChip
                    ]}
                    onPress={() => handleSubCategorySelect(subCategory)}
                  >
                    <Text style={[
                      styles.categoryText,
                      filter.subCategory === subCategory && styles.activeCategoryText
                    ]}>{getSubCategoryLabel(subCategory)}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
          
          <Text style={styles.sectionTitle}>File Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <Pressable
              style={[
                styles.categoryChip,
                filter.fileType === undefined && styles.activeCategoryChip
              ]}
              onPress={() => handleFileTypeSelect(undefined)}
            >
              <Text style={[
                styles.categoryText,
                filter.fileType === undefined && styles.activeCategoryText
              ]}>All</Text>
            </Pressable>
            
            {fileTypes.map(type => (
              <Pressable
                key={type}
                style={[
                  styles.categoryChip,
                  filter.fileType === type && styles.activeCategoryChip
                ]}
                onPress={() => handleFileTypeSelect(type)}
              >
                <Text style={[
                  styles.categoryText,
                  filter.fileType === type && styles.activeCategoryText
                ]}>{getFileTypeLabel(type)}</Text>
              </Pressable>
            ))}
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortContainer}>
            <Pressable
              style={[
                styles.sortChip,
                filter.sortBy === 'date' && styles.activeSortChip
              ]}
              onPress={() => handleSortSelect('date')}
            >
              <Text style={[
                styles.sortText,
                filter.sortBy === 'date' && styles.activeSortText
              ]}>Date {filter.sortBy === 'date' && (filter.sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.sortChip,
                filter.sortBy === 'title' && styles.activeSortChip
              ]}
              onPress={() => handleSortSelect('title')}
            >
              <Text style={[
                styles.sortText,
                filter.sortBy === 'title' && styles.activeSortText
              ]}>Name {filter.sortBy === 'title' && (filter.sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.sortChip,
                filter.sortBy === 'amount' && styles.activeSortChip
              ]}
              onPress={() => handleSortSelect('amount')}
            >
              <Text style={[
                styles.sortText,
                filter.sortBy === 'amount' && styles.activeSortText
              ]}>Amount {filter.sortBy === 'amount' && (filter.sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </Pressable>
          </View>
          
          <Text style={styles.sectionTitle}>Other</Text>
          <Pressable
            style={[
              styles.favoriteChip,
              filter.favorite !== undefined && styles.activeFavoriteChip
            ]}
            onPress={handleFavoriteToggle}
          >
            <Text style={[
              styles.favoriteText,
              filter.favorite !== undefined && styles.activeFavoriteText
            ]}>
              {filter.favorite === undefined ? 'All Documents' : 
               filter.favorite ? 'Favorites Only' : 'Non-Favorites Only'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  activeFilterText: {
    color: colors.dark.primary,
  },
  chevron: {
    marginLeft: 4,
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clearText: {
    color: colors.dark.text,
    fontSize: 14,
    marginLeft: 4,
  },
  filtersContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  sectionTitle: {
    color: colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: colors.dark.primary,
  },
  categoryText: {
    color: colors.dark.text,
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sortChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeSortChip: {
    backgroundColor: colors.dark.primary,
  },
  sortText: {
    color: colors.dark.text,
    fontSize: 14,
  },
  activeSortText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  favoriteChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  activeFavoriteChip: {
    backgroundColor: colors.dark.primary,
  },
  favoriteText: {
    color: colors.dark.text,
    fontSize: 14,
  },
  activeFavoriteText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});