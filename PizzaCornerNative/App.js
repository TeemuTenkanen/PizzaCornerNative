import 'react-native-gesture-handler';
import React, {Component} from 'react';
import MainPage from './components/MainPage.js';
import RestaurantPage from './components/RestaurantPage.js';
import CreateNewReview from './components/CreateNewReview.js';
import RequestNewRestaurant from './components/RequestNewRestaurant.js';
import firebase from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PizzaContext} from './components/Context';
import {setCustomText} from 'react-native-global-props';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const customTextProps = {
  style: {
    fontFamily: 'Roboto',
  },
};

const StackNavigation = (props) => {
  return (
    <Stack.Navigator initialRouteName="MainPage">
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RestaurantPage"
        component={RestaurantPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateNewReview"
        component={CreateNewReview}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      restaurantData: [],
      originalRestaurantData: [],
      restaurantRequests: [],
      drawerOpen: false,
      loading: false,
    };
  }

  filterRestaurants = (value) => {
    let newList = [];
    if (value !== '') {
      newList = this.state.originalRestaurantData.filter((restaurant) => {
        const nameLc = restaurant.name.toLowerCase();
        const filterLc = value.toLowerCase();
        return nameLc.includes(filterLc);
      });
    } else {
      newList = this.state.originalRestaurantData;
    }
    this.setState({restaurantData: newList});
  };

  sortRestaurants = async (value) => {
    let newList = [];
    if (value !== 'All') {
      if (value === 'Favorites') {
        let favoriteListString = await AsyncStorage.getItem('favoriteList');
        newList = this.state.originalRestaurantData.filter((restaurant) => {
          const nameLc = restaurant.name.toLowerCase();
          const filterLc = favoriteListString.toLowerCase();
          return filterLc.includes(nameLc);
        });
      }
      if (value === 'Best reviews') {
        newList = this.state.originalRestaurantData.sort((x, y) =>
          x.starAverage < y.starAverage ? 1 : -1,
        );
      }
    } else {
      newList = this.state.originalRestaurantData;
    }
    this.setState({restaurantData: newList});
  };

  async componentDidMount() {
    setCustomText(customTextProps);
    const dbRef = firebase.database().ref();
    dbRef.on('value', (snapshot) => {
      let dbData = snapshot.val();
      let restaurantData = [];
      for (let restaurant in dbData.Restaurants) {
        let reviews = [];
        for (let review in dbData.Restaurants[restaurant].reviews) {
          reviews.push({
            comment: dbData.Restaurants[restaurant].reviews[review].comment,
            price: dbData.Restaurants[restaurant].reviews[review].price,
            stars: dbData.Restaurants[restaurant].reviews[review].stars,
            picture: dbData.Restaurants[restaurant].reviews[review].picture,
            timestamp: dbData.Restaurants[restaurant].reviews[review].timestamp,
          });
        }
        reviews.sort(function (a, b) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        restaurantData.push({
          name: dbData.Restaurants[restaurant].name,
          location: dbData.Restaurants[restaurant].location,
          openHours: dbData.Restaurants[restaurant].openHours,
          reviews: reviews,
          starAverage: dbData.Restaurants[restaurant].starAverage,
        });
      }
      let restaurantRequests = [];
      for (let request in dbData.RestaurantRequests) {
        restaurantRequests.push({
          name: dbData.RestaurantRequests[request].name,
          location: dbData.RestaurantRequests[request].location,
          openHours: dbData.RestaurantRequests[request].openHours,
        });
      }
      this.setState({
        originalRestaurantData: restaurantData,
        restaurantData,
        restaurantRequests,
        loading: true,
      });
    });
    var favoriteList = await AsyncStorage.getItem('favoriteList');
    if (favoriteList == null) {
      await AsyncStorage.setItem('favoriteList', 'Testi');
    }
  }

  render() {
    return (
      <PizzaContext.Provider
        value={{
          restaurantData: this.state.restaurantData,
          restaurantRequests: this.state.restaurantRequests,
          loading: this.state.loading,
          filterRestaurants: this.filterRestaurants,
          sortRestaurants: this.sortRestaurants,
        }}>
        <NavigationContainer>
          <Drawer.Navigator
            initial={MainPage}
            screenOptions={{headerShown: false}}
            drawerPosition="right">
            <Drawer.Screen name="MainPage" component={StackNavigation} />
            <Drawer.Screen
              name="RequestNewRestaurant"
              component={RequestNewRestaurant}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PizzaContext.Provider>
    );
  }
}

export default App;
