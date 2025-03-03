import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { FileText, Briefcase, Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { DocumentMainCategory, DocumentSubCategory } from '@/types/document';

interface DocumentCategorySelectorProps {
  selectedMainCategory: DocumentMainCategory;
  selectedSubCategory?: DocumentSubCategory;
  onSelectMainCategory: (category: DocumentMainCategory) => void;
  onSelectSubCategory: (subCategory?: DocumentSubCategory) => void;
}

export default function DocumentCategorySelector({
  selectedMainCategory,
  selectedSubCategory,
  onSelectMainCategory,
  onSelectSubCategory,
}: DocumentCategorySelectorProps) {
  const mainCategories: { value: DocumentMainCategory; label: string; icon: React.ReactNode }[] = [
    {
      value: 'comptabilite',
      label: 'Comptabilité',
      icon: <FileText size={24} color={selectedMainCategory === 'comptabilite' ? colors.dark.primary : colors.dark.subtext} />,
    },
    {
      value: 'juridique',
      label: 'Juridique',
      icon: <Briefcase size={24} color={selectedMainCategory === 'juridique' ? colors.dark.primary : colors.dark.subtext} />,
    },
    {
      value: 'social',
      label: 'Social',
      icon: <Users size={24} color={selectedMainCategory === 'social' ? colors.dark.primary : colors.dark.subtext} />,
    },
  ];
  
  const subCategories: Record<DocumentMainCategory, { value: DocumentSubCategory; label: string }[]> = {
    comptabilite: [
      { value: 'achat', label: 'Achat' },
      { value: 'ventes', label: 'Ventes' },
      { value: 'banque', label: 'Banque' },
      { value: 'fiscal', label: 'Fiscal' },
      { value: 'divers', label: 'Divers' },
    ],
    juridique: [
      { value: 'contrats', label: 'Contrats' },
      { value: 'statuts', label: 'Statuts' },
      { value: 'assemblees', label: 'Assemblées' },
      { value: 'divers', label: 'Divers' },
    ],
    social: [
      { value: 'paie', label: 'Paie' },
      { value: 'conges', label: 'Congés' },
      { value: 'formation', label: 'Formation' },
      { value: 'divers', label: 'Divers' },
    ],
  };
  
  const handleMainCategorySelect = (category: DocumentMainCategory) => {
    onSelectMainCategory(category);
    // Select first subcategory by default
    onSelectSubCategory(subCategories[category][0].value);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Document Category</Text>
      
      <View style={styles.mainCategoryContainer}>
        {mainCategories.map(({ value, label, icon }) => (
          <Pressable
            key={value}
            style={[
              styles.mainCategoryButton,
              selectedMainCategory === value && styles.selectedMainCategoryButton
            ]}
            onPress={() => handleMainCategorySelect(value)}
          >
            {icon}
            <Text style={[
              styles.mainCategoryLabel,
              selectedMainCategory === value && styles.selectedMainCategoryLabel
            ]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      
      <Text style={styles.subLabel}>Subcategory</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subCategoryScroll}>
        {subCategories[selectedMainCategory].map(({ value, label }) => (
          <Pressable
            key={value}
            style={[
              styles.subCategoryButton,
              selectedSubCategory === value && styles.selectedSubCategoryButton
            ]}
            onPress={() => onSelectSubCategory(value)}
          >
            <Text style={[
              styles.subCategoryLabel,
              selectedSubCategory === value && styles.selectedSubCategoryLabel
            ]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  mainCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mainCategoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  selectedMainCategoryButton: {
    backgroundColor: 'rgba(79, 142, 247, 0.15)',
    borderColor: colors.dark.primary,
    borderWidth: 1,
  },
  mainCategoryLabel: {
    color: colors.dark.subtext,
    fontSize: 12,
    marginTop: 4,
  },
  selectedMainCategoryLabel: {
    color: colors.dark.primary,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginBottom: 8,
  },
  subCategoryScroll: {
    marginBottom: 8,
  },
  subCategoryButton: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedSubCategoryButton: {
    backgroundColor: colors.dark.primary,
  },
  subCategoryLabel: {
    color: colors.dark.text,
    fontSize: 14,
  },
  selectedSubCategoryLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});