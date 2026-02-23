import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import InsightsScreen from '../screens/InsightsScreen';
import MeditationScreen from '../screens/MeditationScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, focused }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
  </View>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textTertiary,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: '对话',
            tabBarIcon: ({ focused }) => <TabIcon emoji="💬" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Diary" 
          component={DiaryScreen}
          options={{
            tabBarLabel: '日记',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Insights" 
          component={InsightsScreen}
          options={{
            tabBarLabel: '洞察',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Meditation" 
          component={MeditationScreen}
          options={{
            tabBarLabel: '冥想',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🧘" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarLabel: '设置',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: FontSizes.xs,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
});

export default AppNavigator;
