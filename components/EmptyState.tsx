import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FileSearch } from 'lucide-react-native';
import colors from '@/constants/colors';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title = 'No documents found', 
  message = 'Start by scanning a document or applying different filters', 
  icon 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon || <FileSearch size={64} color={colors.dark.subtext} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.dark.subtext,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
});