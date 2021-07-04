import React, {Component} from 'react';
import {TextInput} from 'react-native-paper';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Card, DataTable, ActivityIndicator, Colors} from 'react-native-paper';
import firebase from '../firebase.js';
import {PizzaContext} from './Context.js';
import UpperBar from './UpperBar.js';

class MainPage extends Component {
  state = {
    restaurantKeyWord: '',
    sortBy: 'All',
    restaurantData: this.props.restaurantData,
  };

  starAverage = (reviews, name) => {
    if (reviews.length !== 0) {
      let starSum = 0;
      for (let i = 0; i < reviews.length; i++) {
        starSum += reviews[i].stars;
      }
      let starAverage = Math.round((starSum / reviews.length) * 100) / 100;
      firebase
        .database()
        .ref('Restaurants/' + name)
        .update({
          starAverage: starAverage,
        });
      return starAverage;
    }
  };

  handleRestaurantKeyword = (text) => {
    this.setState({restaurantKeyWord: text});
    this.context.filterRestaurants(text);
  };

  handleSortOrder = (itemValue) => {
    this.setState({sortBy: itemValue});
    this.context.sortRestaurants(itemValue);
  };

  render() {
    return (
      <View>
        <UpperBar navigation={this.props.navigation} />
        <ScrollView>
          <View style={styles.sortBoxes}>
            <TextInput
              style={styles.sortInput}
              label="Name"
              placeholder="Search by restaurant"
              defaultValue={this.state.restaurantKeyWord}
              onChangeText={this.handleRestaurantKeyword}
            />
          </View>
          <View style={styles.sortBoxes}>
            <Picker
              style={styles.sortInput}
              selectedValue={this.state.sortBy}
              onValueChange={(itemValue) => this.handleSortOrder(itemValue)}>
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Best reviews" value="Best reviews" />
              <Picker.Item label="Favoritess" value="Favorites" />
            </Picker>
          </View>
          {this.context.loading ? (
            <View style={styles.bottomSpace}>
              {this.context.restaurantData.map((restaurant) => (
                <View key={restaurant.name}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('RestaurantPage', {
                        restaurantData: restaurant,
                      });
                    }}>
                    <Card>
                      <Card.Title
                        title={restaurant.name}
                        subtitle={restaurant.location}
                        right={() => (
                          <Text style={styles.starAverage}>
                            {this.starAverage(
                              restaurant.reviews,
                              restaurant.name,
                            )}
                            /5
                          </Text>
                        )}
                      />
                      <Card.Cover
                        source={
                          restaurant.reviews !== undefined
                            ? {
                                uri: restaurant.reviews[0].picture,
                              }
                            : require('../Pictures/noReviews.png')
                        }
                        title="Pizza picture"
                      />
                      <Card.Content>
                        <DataTable>
                          {restaurant.reviews.map((review) => (
                            <DataTable.Row key={review.comment}>
                              <DataTable.Cell component="th" scope="row">
                                {review.comment}
                              </DataTable.Cell>
                              <DataTable.Cell align="right">
                                {review.stars}/5
                              </DataTable.Cell>
                            </DataTable.Row>
                          ))}
                        </DataTable>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View alignItems="center" justify="center" style={{height: 400}}>
              <ActivityIndicator
                animating={true}
                color={Colors.blue900}
                size="large"
                style={{top: 50}}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
MainPage.contextType = PizzaContext;

const styles = StyleSheet.create({
  sortBoxes: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  sortInput: {
    width: '50%',
    alignSelf: 'center',
  },
  starAverage: {
    marginRight: 12,
    fontSize: 35,
  },
  bottomSpace: {
    paddingBottom: 200,
  },
});

export default MainPage;
