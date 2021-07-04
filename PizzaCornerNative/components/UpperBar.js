import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {IconButton} from 'react-native-paper';

class UpperBar extends Component {
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

  render() {
    return (
      <View style={styles.paddingBottom}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <IconButton
                  icon="home"
                  size={40}
                  onPress={() => {
                    this.props.navigation.navigate('MainPage');
                  }}
                />
                <View style={styles.titleBox}>
                  <Text style={styles.title}>PIZZA CORNER</Text>
                </View>
                <IconButton
                  icon="menu"
                  size={40}
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    width: '50%',
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  paddingBottom: {
    paddingBottom: 10,
    backgroundColor: 'white',
  },
});

export default UpperBar;
