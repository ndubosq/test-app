import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useDocumentStore } from '@/store/document-store';

export default function SearchBar() {
  const filter = useDocumentStore(state => state.filter);
  const setFilter = useDocumentStore(state => state.setFilter);
  const [searchText, setSearchText] = useState(filter.searchQuery || '');
  
  const handleSearch = (text: string) => {
    setSearchText(text);
    setFilter({ ...filter, searchQuery: text || undefined });
  };
  
  const clearSearch = () => {
    setSearchText('');
    setFilter({ ...filter, searchQuery: undefined });
  };
  
  return (
    <View style={styles.container}>
      <Search size={20} color={colors.dark.subtext} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search documents..."
        placeholderTextColor={colors.dark.subtext}
        value={searchText}
        onChangeText={handleSearch}
        returnKeyType="search"
      />
      {searchText.length > 0 && (
        <Pressable onPress={clearSearch} style={styles.clearButton}>
          <X size={18} color={colors.dark.subtext} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.dark.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
});