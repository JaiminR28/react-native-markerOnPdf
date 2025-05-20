import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from 'src/components/HapticTab';
import { IconSymbol } from 'src/components/ui/IconSymbol';
import BlurTabBarBackground from 'src/components/ui/TabBarBackground.ios';
import { Colors } from 'src/constants/Colors';
import { useColorScheme } from 'src/hooks/useColorScheme.web';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
       <Tabs.Screen
        name="pdfLib"
        options={{
          title: 'pdf Lib',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.diamond.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bottomSheetTest"
        options={{
          title: 'testBottomSHeet',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.diamond.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="storage"
        options={{
          title: 'Storage',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
    </GestureHandlerRootView>
  );
}
