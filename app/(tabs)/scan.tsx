import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Platform, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Scan, Image as ImageIcon, Check, X, FileText } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useDocumentStore } from '@/store/document-store';
import { DocumentMainCategory, DocumentSubCategory, DocumentFileType } from '@/types/document';
import DocumentCategorySelector from '@/components/DocumentCategorySelector';
import TagInput from '@/components/TagInput';
import DocumentFileTypeSelector from '@/components/DocumentFileTypeSelector';

export default function ScanScreen() {
  const addDocument = useDocumentStore(state => state.addDocument);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState<DocumentMainCategory>('comptabilite');
  const [subCategory, setSubCategory] = useState<DocumentSubCategory | undefined>('achat');
  const [fileType, setFileType] = useState<DocumentFileType>('image');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('€');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const cameraRef = useRef<Camera>(null);
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);
  
  // Reset subCategory when mainCategory changes
  useEffect(() => {
    if (mainCategory === 'comptabilite') {
      setSubCategory('achat');
    } else if (mainCategory === 'juridique') {
      setSubCategory('contrats');
    } else if (mainCategory === 'social') {
      setSubCategory('paie');
    }
  }, [mainCategory]);
  
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedImage(photo.uri);
        setFileType('image');
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      
      // Try to determine file type from URI
      const uri = result.assets[0].uri.toLowerCase();
      if (uri.endsWith('.pdf')) {
        setFileType('pdf');
      } else if (uri.endsWith('.xls') || uri.endsWith('.xlsx')) {
        setFileType('xls');
      } else if (uri.endsWith('.doc') || uri.endsWith('.docx')) {
        setFileType('doc');
      } else {
        setFileType('image');
      }
    }
  };
  
  const saveDocument = () => {
    if (!capturedImage || !title) return;
    
    addDocument({
      title,
      mainCategory,
      subCategory,
      fileType,
      imageUri: capturedImage,
      tags,
      notes,
      amount: amount ? parseFloat(amount) : undefined,
      currency,
      favorite: false,
      processed: false,
    });
    
    // Reset form and navigate back
    resetForm();
    router.push('/');
  };
  
  const resetForm = () => {
    setCapturedImage(null);
    setTitle('');
    setMainCategory('comptabilite');
    setSubCategory('achat');
    setFileType('image');
    setAmount('');
    setCurrency('€');
    setTags([]);
    setNotes('');
  };
  
  const cancelCapture = () => {
    setCapturedImage(null);
  };
  
  if (hasPermission === null && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false && Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Pressable style={styles.button} onPress={pickImage}>
          <ImageIcon size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Document Details</Text>
        </View>
        
        <ScrollView style={styles.formContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter document title"
              placeholderTextColor={colors.dark.subtext}
              value={title}
              onChangeText={setTitle}
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
              placeholder="Add notes about this document"
              placeholderTextColor={colors.dark.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={cancelCapture}>
              <X size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton, !title && styles.disabledButton]} 
              onPress={saveDocument}
              disabled={!title}
            >
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {Platform.OS !== 'web' ? (
        <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <Pressable style={styles.cameraButton} onPress={takePicture}>
                <Scan size={32} color="#FFFFFF" />
                <Text style={styles.cameraButtonText}>Capture</Text>
              </Pressable>
              <Pressable style={styles.galleryButton} onPress={pickImage}>
                <ImageIcon size={24} color="#FFFFFF" />
                <Text style={styles.galleryButtonText}>Gallery</Text>
              </Pressable>
              <Pressable style={styles.fileButton} onPress={pickImage}>
                <FileText size={24} color="#FFFFFF" />
                <Text style={styles.fileButtonText}>Files</Text>
              </Pressable>
            </View>
          </View>
        </Camera>
      ) : (
        <View style={styles.webContainer}>
          <Text style={styles.webText}>Camera is not available on web</Text>
          <Pressable style={styles.button} onPress={pickImage}>
            <ImageIcon size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Select from Gallery</Text>
          </Pressable>
        </View>
      )}
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
  text: {
    color: colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  cameraButton: {
    backgroundColor: colors.dark.primary,
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 15,
    position: 'absolute',
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  fileButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 15,
    position: 'absolute',
    left: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webText: {
    color: colors.dark.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: colors.dark.error,
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.dark.success,
    flex: 1,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});