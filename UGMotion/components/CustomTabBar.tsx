import React, { useEffect, useState } from 'react';
import { View, Pressable, LayoutChangeEvent, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Your icon import
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'react-native';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // 1. Filter out screens that shouldn't be on the tab bar (like BMI, Privacy, etc.)
  // We only want the main 4 tabs.
  const visibleRoutes = state.routes.filter(route => 
    ['Dashboard', 'MealPrep', 'WorkoutPlan', 'Profile'].includes(route.name)
  );

  // 2. Animation Setup
  const translateX = useSharedValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Calculate the width of a single tab button
  const tabWidth = dimensions.width / visibleRoutes.length;

  // Update position when the active tab changes
  useEffect(() => {
    if (tabWidth > 0) {
      // Find the index of the currently active tab within our filtered list
      const activeIndex = visibleRoutes.findIndex(r => r.key === state.routes[state.index].key);
      if (activeIndex !== -1) {
        translateX.value = withSpring(activeIndex * tabWidth, {
          damping: 15, // How "bouncy" the spring is (lower = bouncier)
          stiffness: 150,
        });
      }
    }
  }, [state.index, tabWidth, visibleRoutes]);

  // The animated style for the sliding green circle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View style={styles.tabBarContainer}>
      <View onLayout={onLayout} style={styles.tabBar}>
        
        {/* THE SLIDING GREEN CIRCLE */}
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.slidingCircle,
              { width: tabWidth }, // Circle takes up 1 tab slot
              animatedStyle,
            ]}
          >
            <View style={styles.circleInner} />
          </Animated.View>
        )}

        {/* THE TAB BUTTONS */}
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index].key === route.key;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              android_ripple={{ color: 'transparent' }}
            >
              {/* RENDER ICONS BASED ON ROUTE NAME */}
              {route.name === 'Dashboard' && (
                <Image 
                 source={require('../assets/images/House.png')}
                 style={{ width: 20, height: 20, tintColor: '#000'}}
               />
              )}
              {route.name === 'MealPrep' && (
                 <Image 
                 source={require('../assets/images/MealPrep.png')}
                 style={{ width: 40, height: 20 }}
               />
              )}
              {route.name === 'WorkoutPlan' && (
                <FontAwesome5 name="rocket" size={24} color="#000" />
              )}
              {route.name === 'Profile' && (
                <FontAwesome5 name="user-alt" size={22} color="#000" />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 9999, // Pill shape
    height: 65,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden', // Keeps the circle inside
  },
  slidingCircle: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, // Behind the icons
  },
  circleInner: {
    width: 48, 
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#22C55E', // GREEN COLOR
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // On top of the circle
  },
});