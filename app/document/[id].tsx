import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  Trash2, 
  Share2, 
  Edit2, 
  Save, 
  X, 
  Download,
  Tag,
  FileText,
  File
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useDocumentStore } from '@/store/document-store';
import DocumentCategorySelector from '@/components/DocumentCategorySelector';
import DocumentFileTypeSelector from '@/components/DocumentFileTypeSelector';
import TagInput from '@/components/TagInput';
import { DocumentMainCategory, DocumentSubCategory, DocumentFileType } from '@/types/document';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const documents = useDocumentStore(state => state.documents);
  const updateDocument = useDocumentStore(state => state.updateDocument);
  const deleteDocument = useDocumentStore(state => state.deleteDocument);
  const toggleFavorite = useDocumentStore(state => state.toggleFavorite);
  
  const document = documents.find(doc => doc.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document?.title || '');
  const [mainCategory, setMainCategory] = useState<DocumentMainCategory>(document?.mainCategory || 'comptabilite');
  const [subCategory, setSubCategory] = useState<DocumentSubCategory | undefined>(document?.subCategory);
  const [fileType, setFileType] = useState<DocumentFileType>(document?.fileType || 'image');
  const [amount, setAmount] = useState(document?.amount?.toString() || '');
  const [currency, setCurrency] = useState(document?.currency || '€');
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [notes, setNotes] = useState(document?.notes || '');
  
  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Document not found</Text>
      </SafeAreaView>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteDocument(document.id);
            router.navigate('/(tabs)');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleShare = () => {
    // In a real app, we would implement share functionality
    Alert.alert('Share', 'Share functionality would be implemented here.');
  };
  
  const handleDownload = () => {
    // In a real app, we would implement download functionality
    Alert.alert('Download', 'Download functionality would be implemented here.');
  };
  
  const handleSave = () => {
    updateDocument(document.id, {
      title,
      mainCategory,
      subCategory,
      fileType,
      amount: amount ? parseFloat(amount) : undefined,
      currency,
      tags,
      notes,
    });
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form values
    setTitle(document.title);
    setMainCategory(document.mainCategory);
    setSubCategory(document.subCategory);
    setFileType(document.fileType);
    setAmount(document.amount?.toString() || '');
    setCurrency(document.currency || '€');
    setTags(document.tags);
    setNotes(document.notes || '');
    
    setIsEditing(false);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const getFileTypeIcon = () => {
    switch (document.fileType) {
      case 'pdf':
        return <FileText size={24} color={colors.dark.primary} />;
      case 'xls':
        return <File size={24} color="#4CAF50" />;
      case 'doc':
        return <File size={24} color="#2196F3" />;
      default:
        return null;
    }
  };
  
  const getCategoryLabel = (category: DocumentMainCategory): string => {
    switch (category) {
      case 'comptabilite': return 'Comptabilité';
      case 'juridique': return 'Juridique';
      case 'social': return 'Social';
      default: return category;
    }
  };
  
  const getSubCategoryLabel = (category?: DocumentSubCategory): string => {
    if (!category) return 'N/A';
    
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
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: isEditing ? 'Edit Document' : document.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {!isEditing ? (
                <>
                  <Pressable onPress={() => toggleFavorite(document.id)} style={styles.headerButton}>
                    <Heart 
                      size={24} 
                      color={document.favorite ? colors.dark.accent : colors.dark.text} 
                      fill={document.favorite ? colors.dark.accent : 'none'} 
                    />
                  </Pressable>
                  <Pressable onPress={() => setIsEditing(true)} style={styles.headerButton}>
                    <Edit2 size={24} color={colors.dark.text} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable onPress={handleCancel} style={styles.headerButton}>
                    <X size={24} color={colors.dark.text} />
                  </Pressable>
                  <Pressable onPress={handleSave} style={styles.headerButton}>
                    <Save size={24} color={colors.dark.primary} />
                  </Pressable>
                </>
              )}
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.documentPreview}>
          {document.fileType !== 'image' && (
            <View style={styles.fileTypeOverlay}>
              {getFileTypeIcon()}
              <Text style={styles.fileTypeText}>{document.fileType.toUpperCase()}</Text>
            </View>
          )}
          <Image source={{ uri: document.imageUri }} style={styles.image} />
        </View>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Document title"
                placeholderTextColor={colors.dark.subtext}
              />
            </View>
            
            <DocumentCategorySelector 
              selectedMainCategory={mainCategory} 
              selectedSubCategory={subCategory}
              onSelectMainCategory={setMainCategory}
              onSelectSubCategory={setSubCategory}
            />
            
            <DocumentFileTypeSelector 
              selectedFileType={fileType}
              onSelectFileType={setFileType}
            />
            
            {(mainCategory === 'comptabilite' && ['achat', 'ventes', 'banque'].includes(subCategory || '')) && (
              <View style={styles.amountContainer}>
                <Text style={styles.label}>Amount (Optional)</Text>
                <View style={styles.amountInputContainer}>
                  <TextInput
                    style={styles.currencyInput}
                    value={currency}
                    onChangeText={setCurrency}
                    maxLength={1}
                  />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={colors.dark.subtext}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
            
            <TagInput tags={tags} onTagsChange={setTags} />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this document"
                placeholderTextColor={colors.dark.subtext}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        ) : (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{getCategoryLabel(document.mainCategory)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subcategory</Text>
              <Text style={styles.detailValue}>{getSubCategoryLabel(document.subCategory)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>File Type</Text>
              <Text style={styles.detailValue}>{document.fileType.toUpperCase()}</Text>
            </View>
            
            {document.amount !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>
                  {document.currency || '€'}{document.amount.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>{formatDate(document.createdAt)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>{formatDate(document.updatedAt)}</Text>
            </View>
            
            {document.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <View style={styles.tagsHeader}>
                  <Tag size={16} color={colors.dark.subtext} />
                  <Text style={styles.tagsLabel}>Tags</Text>
                </View>
                <View style={styles.tagsList}>
                  {document.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {document.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{document.notes}</Text>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={handleShare}>
                <Share2 size={24} color={colors.dark.text} />
                <Text style={styles.actionButtonText}>Share</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={handleDownload}>
                <Download size={24} color={colors.dark.text} />
                <Text style={styles.actionButtonText}>Download</Text>
              </Pressable>
              
              <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                <Trash2 size={24} color={colors.dark.error} />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  errorText: {
    color: colors.dark.text,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  documentPreview: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  fileTypeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  fileTypeText: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  details: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  detailLabel: {
    color: colors.dark.subtext,
    fontSize: 16,
  },
  detailValue: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  tagsContainer: {
    marginTop: 16,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsLabel: {
    color: colors.dark.subtext,
    fontSize: 16,
    marginLeft: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.dark.primary + '30',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.dark.primary,
    fontSize: 14,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    color: colors.dark.subtext,
    fontSize: 16,
    marginBottom: 8,
  },
  notesText: {
    color: colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  deleteButtonText: {
    color: colors.dark.error,
  },
  editForm: {
    padding: 16,
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
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.dark.text,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyInput: {
    backgroundColor: colors.dark.card,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.dark.text,
    fontSize: 16,
    width: 50,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.dark.border,
  },
  amountInput: {
    backgroundColor: colors.dark.card,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.dark.text,
    fontSize: 16,
    flex: 1,
  },
});