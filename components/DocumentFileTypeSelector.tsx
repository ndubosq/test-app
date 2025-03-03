import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image as ImageIcon, FileText, File, FileSpreadsheet } from 'lucide-react-native';
import colors from '@/constants/colors';
import { DocumentFileType } from '@/types/document';

interface DocumentFileTypeSelectorProps {
  selectedFileType: DocumentFileType;
  onSelectFileType: (type: DocumentFileType) => void;
}

export default function DocumentFileTypeSelector({
  selectedFileType,
  onSelectFileType,
}: DocumentFileTypeSelectorProps) {
  const fileTypes: { type: DocumentFileType; icon: React.ReactNode; label: string }[] = [
    {
      type: 'image',
      icon: <ImageIcon size={24} color={selectedFileType === 'image' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Image',
    },
    {
      type: 'pdf',
      icon: <FileText size={24} color={selectedFileType === 'pdf' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'PDF',
    },
    {
      type: 'xls',
      icon: <FileSpreadsheet size={24} color={selectedFileType === 'xls' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Excel',
    },
    {
      type: 'doc',
      icon: <File size={24} color={selectedFileType === 'doc' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Word',
    },
    {
      type: 'other',
      icon: <File size={24} color={selectedFileType === 'other' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Other',
    },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>File Type</Text>
      <View style={styles.typeContainer}>
        {fileTypes.map(({ type, icon, label }) => (
          <Pressable
            key={type}
            style={[
              styles.typeButton,
              selectedFileType === type && styles.selectedTypeButton
            ]}
            onPress={() => onSelectFileType(type)}
          >
            {icon}
            <Text style={[
              styles.typeLabel,
              selectedFileType === type && styles.selectedTypeLabel
            ]}>{label}</Text>
          </Pressable>
        ))}
      </View>
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: 'rgba(79, 142, 247, 0.15)',
    borderColor: colors.dark.primary,
    borderWidth: 1,
  },
  typeLabel: {
    color: colors.dark.subtext,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedTypeLabel: {
    color: colors.dark.primary,
    fontWeight: '500',
  },
});