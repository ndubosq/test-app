import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { Building, ChevronDown, Check, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Company } from '@/types/auth';

export default function CompanySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const companies = useAuthStore(state => state.companies);
  const currentCompany = useAuthStore(state => state.currentCompany);
  const switchCompany = useAuthStore(state => state.switchCompany);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelectCompany = (company: Company) => {
    switchCompany(company.id);
    setIsOpen(false);
  };
  
  const handleManageCompanies = () => {
    setIsOpen(false);
    router.push('/company/manage');
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
      <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
      {currentCompany?.id === item.id && (
        <View style={styles.checkIcon}>
          <Check size={16} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
  
  if (!currentCompany) return null;
  
  return (
    <View>
      <Pressable style={styles.button} onPress={toggleDropdown}>
        <Image source={{ uri: currentCompany.logo }} style={styles.currentCompanyLogo} />
        <Text style={styles.currentCompanyName} numberOfLines={1}>
          {currentCompany.name}
        </Text>
        <ChevronDown size={16} color={colors.dark.text} />
      </Pressable>
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Company</Text>
            </View>
            
            <FlatList
              data={companies}
              renderItem={renderCompanyItem}
              keyExtractor={(item) => item.id}
              style={styles.companiesList}
            />
            
            <Pressable style={styles.manageButton} onPress={handleManageCompanies}>
              <Settings size={18} color={colors.dark.primary} />
              <Text style={styles.manageButtonText}>Manage Companies</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 16,
  },
  currentCompanyLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  currentCompanyName: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
    maxWidth: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  companiesList: {
    maxHeight: 300,
  },
  companyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  selectedCompanyItem: {
    backgroundColor: 'rgba(79, 142, 247, 0.1)',
  },
  companyLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  companyName: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
  },
  checkIcon: {
    backgroundColor: colors.dark.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  manageButtonText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});