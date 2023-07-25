import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../screens/Profile';
import Home from '../screens/Home';
import { Ionicons } from '@expo/vector-icons';
import NewEvent from '../screens/NewEvent';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator'
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'New Event') {
            iconName = 'add-circle-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home"      component={HomeStackNavigator}/>
      <Tab.Screen name="New Event" component={NewEvent}/>
      <Tab.Screen name="Profile"   component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default Tabs;