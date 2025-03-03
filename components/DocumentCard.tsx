import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Tag, FileText, File, FileSpreadsheet } from 'lucide-react-native';
import { Document } from '@/types/document';
import colors from '@/constants/colors';
import { useDocumentStore } from '@/store/document-store';

interface DocumentCardProps {
  document: Document;
  compact?: boolean;
}

export default function DocumentCard({ document, compact = false }: DocumentCardProps) {
  const router = useRouter();
  const toggleFavorite = useDocumentStore(state => state.toggleFavorite);
  
  const handlePress = () => {
    router.push(`/document/${document.id}`);
  };
  
  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(document.id);
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const getFileTypeIcon = () => {
    switch (document.fileType) {
      case 'pdf':
        return <FileText size={16} color={colors.dark.subtext} />;
      case 'xls':
        return <FileSpreadsheet size={16} color="#4CAF50" />;
      case 'doc':
        return <File size={16} color="#2196F3" />;
      case 'other':
        return <File size={16} color={colors.dark.subtext} />;
      default:
        return null;
    }
  };
  
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'comptabilite': return 'Comptabilité';
      case 'juridique': return 'Juridique';
      case 'social': return 'Social';
      default: return category;
    }
  };
  
  if (compact) {
    return (
      <Pressable 
        style={styles.compactContainer} 
        onPress={handlePress}
        android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
      >
        <View style={styles.compactImageContainer}>
          {document.fileType !== 'image' && (
            <View style={styles.fileTypeOverlay}>
              {getFileTypeIcon()}
            </View>
          )}
          <Image source={{ uri: document.imageUri }} style={styles.compactImage} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{document.title}</Text>
          <View style={styles.compactDetails}>
            <Text style={styles.compactCategory}>{getCategoryLabel(document.mainCategory)}</Text>
            <Text style={styles.compactDate}>{formatDate(document.createdAt)}</Text>
          </View>
        </View>
        <Pressable onPress={handleFavoritePress} style={styles.favoriteButton}>
          <Heart 
            size={18} 
            color={document.favorite ? colors.dark.accent : colors.dark.subtext} 
            fill={document.favorite ? colors.dark.accent : 'none'} 
          />
        </Pressable>
      </Pressable>
    );
  }
  
  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      <View style={styles.imageContainer}>
        {document.fileType !== 'image' && (
          <View style={styles.fileTypeOverlay}>
            {getFileTypeIcon()}
            <Text style={styles.fileTypeText}>{document.fileType.toUpperCase()}</Text>
          </View>
        )}
        <Image source={{ uri: document.imageUri }} style={styles.image} />
      </View>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{getCategoryLabel(document.mainCategory)}</Text>
          </View>
          <Pressable onPress={handleFavoritePress} hitSlop={10}>
            <Heart 
              size={20} 
              color={document.favorite ? colors.dark.accent : colors.dark.subtext} 
              fill={document.favorite ? colors.dark.accent : 'none'} 
            />
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={1}>{document.title}</Text>
          <View style={styles.details}>
            <Text style={styles.date}>{formatDate(document.createdAt)}</Text>
            {document.amount && (
              <Text style={styles.amount}>
                {document.currency || '€'}{document.amount.toFixed(2)}
              </Text>
            )}
          </View>
          {document.tags.length > 0 && (
            <View style={styles.tags}>
              <Tag size={12} color={colors.dark.subtext} />
              <Text style={styles.tagText} numberOfLines={1}>
                {document.tags.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  type: {
    color: colors.dark.subtext,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  footer: {
    gap: 4,
  },
  title: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: colors.dark.subtext,
    fontSize: 12,
  },
  amount: {
    color: colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tagText: {
    color: colors.dark.subtext,
    fontSize: 12,
    marginLeft: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  compactImageContainer: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
  },
  compactTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  compactDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactCategory: {
    color: colors.dark.primary,
    fontSize: 12,
  },
  compactDate: {
    color: colors.dark.subtext,
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
  },
});