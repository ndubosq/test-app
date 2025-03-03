import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Receipt, FileText, FileCheck, File } from 'lucide-react-native';
import colors from '@/constants/colors';
import { DocumentType } from '@/types/document';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onSelectType: (type: DocumentType) => void;
}

export default function DocumentTypeSelector({ selectedType, onSelectType }: DocumentTypeSelectorProps) {
  const types: { type: DocumentType; icon: React.ReactNode; label: string }[] = [
    { 
      type: 'receipt', 
      icon: <Receipt size={24} color={selectedType === 'receipt' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Receipt'
    },
    { 
      type: 'invoice', 
      icon: <FileText size={24} color={selectedType === 'invoice' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Invoice'
    },
    { 
      type: 'tax', 
      icon: <FileCheck size={24} color={selectedType === 'tax' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Tax'
    },
    { 
      type: 'other', 
      icon: <File size={24} color={selectedType === 'other' ? colors.dark.primary : colors.dark.subtext} />,
      label: 'Other'
    },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Document Type</Text>
      <View style={styles.typeContainer}>
        {types.map(({ type, icon, label }) => (
          <Pressable
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.selectedTypeButton
            ]}
            onPress={() => onSelectType(type)}
          >
            {icon}
            <Text style={[
              styles.typeLabel,
              selectedType === type && styles.selectedTypeLabel
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
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
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
  },
  selectedTypeLabel: {
    color: colors.dark.primary,
    fontWeight: '500',
  },
});