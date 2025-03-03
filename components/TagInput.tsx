import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Tag, X, Plus } from 'lucide-react-native';
import colors from '@/constants/colors';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(newTags);
  };
  
  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter' || nativeEvent.key === ',') {
      handleAddTag();
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags</Text>
      <View style={styles.inputContainer}>
        <Tag size={20} color={colors.dark.subtext} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Add tags (comma or enter to add)"
          placeholderTextColor={colors.dark.subtext}
          value={inputValue}
          onChangeText={setInputValue}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        {inputValue.length > 0 && (
          <Pressable onPress={handleAddTag} style={styles.addButton}>
            <Plus size={20} color={colors.dark.primary} />
          </Pressable>
        )}
      </View>
      
      {tags.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <Pressable onPress={() => handleRemoveTag(tag)} style={styles.removeButton}>
                <X size={14} color={colors.dark.text} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.dark.text,
    fontSize: 16,
  },
  addButton: {
    padding: 8,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tagsContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
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
  removeButton: {
    marginLeft: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});