import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreens from "./src/screens/HomeScreens";
import SettingsScreens from "./src/screens/SettingsScreens";
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

export default function App() {
  const fondo='#0c2342';
  const blanco='#fff';
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Radiación UV') {
                iconName = focused
                  ? 'information-circle'
                  : 'information-circle-outline';
              } else if (route.name === 'Módulos') {
                iconName = focused ? 'list' : 'list-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: blanco,
            tabBarInactiveTintColor: '#0d4f81',
            headerStyle: { backgroundColor: fondo },  
            headerTintColor: blanco, 
            tabBarStyle: { backgroundColor: fondo } 
          })}
        >
          <Tab.Screen name="Radiación UV" component={HomeScreens} />
          <Tab.Screen name="Módulos" component={SettingsScreens} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }