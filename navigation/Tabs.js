import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator'
import { COLORS } from '../constants';
import { MyEvents } from '../screens';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();


const Tabs = () => {
  const navigator = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeNavigator') {
            iconName = 'home';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          } else if (route.name === 'Mis Eventos') {
            iconName = 'calendar'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          title: 'Inicio'
        }}
        name="HomeNavigator" component={HomeStackNavigator} />
      <Tab.Screen name="Mis Eventos" component={MyEvents} />
      <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default Tabs;