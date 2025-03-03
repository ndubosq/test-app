import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Scan, Settings } from 'lucide-react-native';
import colors from '@/constants/colors';
import CompanySwitcher from '@/components/CompanySwitcher';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.dark.background,
          borderTopColor: colors.dark.border,
        },
        tabBarActiveTintColor: colors.dark.primary,
        tabBarInactiveTintColor: colors.dark.subtext,
        headerStyle: {
          backgroundColor: colors.dark.background,
        },
        headerTitleStyle: {
          color: colors.dark.text,
        },
        headerTintColor: colors.dark.text,
        headerRight: () => <CompanySwitcher />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}