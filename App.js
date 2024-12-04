import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ProfileScreen from './screens/ProfileScreen';
import FoodLogScreen from './screens/FoodLogScreen';
import HistoryScreen from './screens/HistoryScreen';
import GoalsScreen from './screens/GoalsScreen';
import EducationScreen from './screens/EducationScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import RegisterWeightScreen from './screens/RegisterWeightScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FoodLog" component={FoodLogScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="RegisterWeight" component={RegisterWeightScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}