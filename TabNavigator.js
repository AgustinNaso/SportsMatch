import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './screens/Profile/Profile';
import Home from './screens/Home/Home';
import { Ionicons } from '@expo/vector-icons';
import NewEvent from './screens/NewEvent/NewEvent';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'NewEvent') {
            iconName = 'add-circle-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="NewEvent" component={NewEvent}/>
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default TabNavigator;