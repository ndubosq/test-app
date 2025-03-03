import React from 'react';
import { StyleSheet, View, Text, Pressable, Switch, ScrollView, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trash2, 
  Download, 
  Upload, 
  HelpCircle, 
  Info, 
  Lock, 
  Bell, 
  ChevronRight,
  LogOut,
  Building,
  User
} from 'lucide-react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import { useDocumentStore } from '@/store/document-store';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  
  const documents = useDocumentStore(state => state.documents);
  const deleteDocument = useDocumentStore(state => state.deleteDocument);
  
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  const handleClearAllDocuments = () => {
    Alert.alert(
      'Clear All Documents',
      'Are you sure you want to delete all documents? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          onPress: () => {
            // Delete all documents one by one
            documents.forEach(doc => {
              deleteDocument(doc.id);
            });
            Alert.alert('Documents Deleted', 'All documents have been deleted.');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleExportData = () => {
    // In a real app, we would implement export functionality
    Alert.alert('Export', 'Data export would be implemented here.');
  };
  
  const handleImportData = () => {
    // In a real app, we would implement import functionality
    Alert.alert('Import', 'Data import would be implemented here.');
  };
  
  const handleManageCompanies = () => {
    router.push('/company/manage');
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    action: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {action}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {user && (
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingItem(
            <Building size={24} color={colors.dark.primary} />,
            'Manage Companies',
            'Add, edit, or remove companies',
            <Pressable onPress={handleManageCompanies} hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
          
          {renderSettingItem(
            <User size={24} color={colors.dark.primary} />,
            'Profile Settings',
            'Update your personal information',
            <Pressable hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
          
          {renderSettingItem(
            <LogOut size={24} color={colors.dark.error} />,
            'Logout',
            'Sign out of your account',
            <Pressable onPress={handleLogout} hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingItem(
            <Bell size={24} color={colors.dark.primary} />,
            'Notifications',
            'Receive alerts for document processing',
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: colors.dark.primary + '50' }}
              thumbColor={notificationsEnabled ? colors.dark.primary : '#f4f3f4'}
            />
          )}
          
          {Platform.OS !== 'web' && renderSettingItem(
            <Lock size={24} color={colors.dark.primary} />,
            'Biometric Authentication',
            'Secure your documents with biometrics',
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#767577', true: colors.dark.primary + '50' }}
              thumbColor={biometricsEnabled ? colors.dark.primary : '#f4f3f4'}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          {renderSettingItem(
            <Download size={24} color={colors.dark.primary} />,
            'Export Data',
            'Export your documents as a backup',
            <Pressable onPress={handleExportData} hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
          
          {renderSettingItem(
            <Upload size={24} color={colors.dark.primary} />,
            'Import Data',
            'Import documents from a backup file',
            <Pressable onPress={handleImportData} hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
          
          {renderSettingItem(
            <Trash2 size={24} color={colors.dark.error} />,
            'Clear All Documents',
            `Delete all ${documents.length} documents`,
            <Pressable onPress={handleClearAllDocuments} hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          {renderSettingItem(
            <HelpCircle size={24} color={colors.dark.primary} />,
            'Help & Support',
            'Get assistance with using the app',
            <Pressable hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
          
          {renderSettingItem(
            <Info size={24} color={colors.dark.primary} />,
            'About DocScan Pro',
            'Version 1.0.0',
            <Pressable hitSlop={10}>
              <ChevronRight size={24} color={colors.dark.subtext} />
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.dark.subtext,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.dark.subtext,
  },
});