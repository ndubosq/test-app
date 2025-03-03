import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Building, Plus, Edit2, Trash2, Check, X } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Company } from '@/types/auth';

export default function ManageCompaniesScreen() {
  const companies = useAuthStore(state => state.companies);
  const currentCompany = useAuthStore(state => state.currentCompany);
  const addCompany = useAuthStore(state => state.addCompany);
  const removeCompany = useAuthStore(state => state.removeCompany);
  const switchCompany = useAuthStore(state => state.switchCompany);
  
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  
  const handleAddCompany = () => {
    if (!newCompanyName.trim()) {
      Alert.alert('Error', 'Company name is required');
      return;
    }
    
    addCompany({
      name: newCompanyName.trim(),
      industry: newCompanyIndustry.trim() || undefined,
      logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    });
    
    setIsAddingCompany(false);
    setNewCompanyName('');
    setNewCompanyIndustry('');
  };
  
  const handleDeleteCompany = (company: Company) => {
    if (companies.length <= 1) {
      Alert.alert('Error', 'You must have at least one company');
      return;
    }
    
    Alert.alert(
      'Delete Company',
      `Are you sure you want to delete ${company.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeCompany(company.id),
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSelectCompany = (company: Company) => {
    switchCompany(company.id);
    router.back();
  };
  
  const renderCompanyItem = ({ item }: { item: Company }) => (
    <Pressable 
      style={[
        styles.companyItem,
        currentCompany?.id === item.id && styles.selectedCompanyItem
      ]}
      onPress={() => handleSelectCompany(item)}
    >
      <Image source={{ uri: item.logo }} style={styles.companyLogo} />
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        {item.industry && (
          <Text style={styles.companyIndustry}>{item.industry}</Text>
        )}
      </View>
      {currentCompany?.id === item.id && (
        <View style={styles.selectedIndicator}>
          <Check size={16} color="#FFFFFF" />
        </View>
      )}
      <Pressable 
        style={styles.deleteButton} 
        onPress={() => handleDeleteCompany(item)}
        hitSlop={10}
      >
        <Trash2 size={20} color={colors.dark.error} />
      </Pressable>
    </Pressable>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              onPress={() => setIsAddingCompany(true)} 
              style={styles.headerButton}
              disabled={isAddingCompany}
            >
              <Plus size={24} color={colors.dark.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.content}>
        {isAddingCompany ? (
          <View style={styles.addCompanyForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add New Company</Text>
              <Pressable onPress={() => setIsAddingCompany(false)}>
                <X size={24} color={colors.dark.text} />
              </Pressable>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter company name"
                placeholderTextColor={colors.dark.subtext}
                value={newCompanyName}
                onChangeText={setNewCompanyName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Industry (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter industry"
                placeholderTextColor={colors.dark.subtext}
                value={newCompanyIndustry}
                onChangeText={setNewCompanyIndustry}
              />
            </View>
            
            <Pressable 
              style={[styles.addButton, !newCompanyName.trim() && styles.disabledButton]} 
              onPress={handleAddCompany}
              disabled={!newCompanyName.trim()}
            >
              <Text style={styles.addButtonText}>Add Company</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.description}>
              Select a company to view and manage its documents. You can also add new companies or delete existing ones.
            </Text>
            
            <FlatList
              data={companies}
              renderItem={renderCompanyItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.companiesList}
            />
          </>
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
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: colors.dark.subtext,
    marginBottom: 24,
    lineHeight: 24,
  },
  companiesList: {
    paddingBottom: 16,
  },
  companyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCompanyItem: {
    borderColor: colors.dark.primary,
    borderWidth: 2,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  companyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  companyIndustry: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginTop: 4,
  },
  selectedIndicator: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  addCompanyForm: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.dark.text,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});