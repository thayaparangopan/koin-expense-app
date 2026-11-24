import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type TabKey = 'Home' | 'Expenses' | 'Insights' | 'Profile';

interface BottomNavigationProps {
  activeTab?: TabKey;
  onSelectTab?: (tab: TabKey) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'Expenses',
  onSelectTab,
}) => {
  const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
    {
      key: 'Home',
      label: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      key: 'Expenses',
      label: 'Expenses',
      icon: 'receipt-outline',
      activeIcon: 'receipt',
    },
    {
      key: 'Insights',
      label: 'Insights',
      icon: 'bar-chart-outline',
      activeIcon: 'bar-chart',
    },
    {
      key: 'Profile',
      label: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onSelectTab && onSelectTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? theme.colors.primary : theme.colors.textPlaceholder}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingBottom: 20,
    paddingTop: 8,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  inactiveLabel: {
    color: theme.colors.textPlaceholder,
    fontWeight: '500',
  },
});
