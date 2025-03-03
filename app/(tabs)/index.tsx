import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDocumentStore } from '@/store/document-store';
import DocumentCard from '@/components/DocumentCard';
import EmptyState from '@/components/EmptyState';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import { Grid, List } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

export default function DocumentsScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const documents = useDocumentStore(state => state.getCompanyDocuments());
  const filter = useDocumentStore(state => state.filter);
  const currentCompany = useAuthStore(state => state.currentCompany);
  
  // Apply filters manually here instead of calling a method that might cause re-renders
  const getFilteredDocuments = () => {
    let filtered = [...documents];
    
    // Apply main category filter
    if (filter.mainCategory) {
      filtered = filtered.filter((doc) => doc.mainCategory === filter.mainCategory);
    }
    
    // Apply sub category filter
    if (filter.subCategory) {
      filtered = filtered.filter((doc) => doc.subCategory === filter.subCategory);
    }
    
    // Apply file type filter
    if (filter.fileType) {
      filtered = filtered.filter((doc) => doc.fileType === filter.fileType);
    }
    
    // Apply search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((doc) => 
        doc.title.toLowerCase().includes(query) || 
        doc.notes?.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply tags filter
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((doc) => 
        filter.tags!.some(tag => doc.tags.includes(tag))
      );
    }
    
    // Apply favorite filter
    if (filter.favorite !== undefined) {
      filtered = filtered.filter((doc) => doc.favorite === filter.favorite);
    }
    
    // Apply sorting
    if (filter.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filter.sortBy) {
          case 'date':
            comparison = a.updatedAt - b.updatedAt;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'amount':
            comparison = (a.amount || 0) - (b.amount || 0);
            break;
        }
        
        return filter.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    return filtered;
  };
  
  const filteredDocuments = getFilteredDocuments();
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };
  
  const renderItem = ({ item }: { item: any }) => (
    <DocumentCard document={item} compact={viewMode === 'list'} />
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <Pressable onPress={toggleViewMode} style={styles.viewModeButton}>
          {viewMode === 'grid' ? (
            <List size={24} color={colors.dark.text} />
          ) : (
            <Grid size={24} color={colors.dark.text} />
          )}
        </Pressable>
      </View>
      
      <View style={styles.content}>
        <SearchBar />
        <FilterBar />
        
        {filteredDocuments.length === 0 ? (
          <EmptyState 
            title={`No documents found${currentCompany ? ` for ${currentCompany.name}` : ''}`}
            message="Start by scanning a document or applying different filters"
          />
        ) : (
          <FlatList
            data={filteredDocuments}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            numColumns={viewMode === 'grid' ? (Platform.OS === 'web' ? 2 : 1) : 1}
            key={viewMode} // Force re-render when view mode changes
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.dark.card,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 16,
  },
});