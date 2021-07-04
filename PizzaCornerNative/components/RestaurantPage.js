import React, {Component} from 'react';
import UpperBar from './UpperBar.js';
import ReviewCard from './ReviewCard.js';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {List, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  pizzaPicture: {
    width: '100%',
    height: 250,
  },
  titles: {
    fontSize: 28,
    padding: 15,
  },
  createReviewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
    marginTop: 10,
    paddingBottom: 10,
    alignContent: 'center',
  },
  itemAlignCenter: {alignContent: 'center', justifyContent: 'center'},
});

class RestaurantPage extends Component {
  state = {
    restaurantData: this.props.route.params.restaurantData,
    priceAverage: 0,
    reviewAverage: '',
    favoriteButtonColor: 'black',
  };

  async componentDidMount() {
    let restaurantData = this.props.route.params.restaurantData;
    let reviews = restaurantData.reviews;
    let priceSum = 0;
    let starSum = 0;
    for (let i = 0; i < reviews.length; i++) {
      priceSum += reviews[i].price;
      starSum += reviews[i].stars;
    }
    let priceAverage = Math.round((priceSum / reviews.length) * 100) / 100;
    priceAverage = priceAverage + 'e';
    let starAverage = Math.round((starSum / reviews.length) * 100) / 100;
    let reviewAverage = '';
    if (starAverage < 1) {
      reviewAverage = 'Poor ' + starAverage + '/5';
    }
    if (starAverage > 1 < 2) {
      reviewAverage = 'Okey ' + starAverage + '/5';
    }
    if (starAverage > 2 < 3) {
      reviewAverage = 'Good ' + starAverage + '/5';
    }
    if (starAverage > 3 < 4) {
      reviewAverage = 'Great ' + starAverage + '/5';
    }
    if (starAverage > 4 < 5) {
      reviewAverage = 'Excellent ' + starAverage + '/5';
    }
    if (isNaN(starAverage)) {
      reviewAverage = 'No reviews';
      priceAverage = 'No reviews';
    }

    let favoriteListString = await AsyncStorage.getItem('favoriteList');
    let favoriteButtonColor = 'black';
    if (favoriteListString.includes(this.state.restaurantData.name)) {
      favoriteButtonColor = 'deeppink';
    }
    this.setState({
      priceAverage,
      reviewAverage,
      restaurantData,
      favoriteButtonColor,
    });
  }

  handleFavoriteButtonClick = async () => {
    let favoriteListString = await AsyncStorage.getItem('favoriteList');
    let favoriteList = favoriteListString.split(',');
    if (this.state.favoriteButtonColor === 'black') {
      this.setState({favoriteButtonColor: 'deeppink'});
      favoriteList.push(this.state.restaurantData.name);
    } else {
      this.setState({favoriteButtonColor: 'black'});
      let index = favoriteList.indexOf(this.state.restaurantData.name);
      if (index !== -1) {
        favoriteList.splice(index, 1);
      }
    }
    await AsyncStorage.setItem('favoriteList', favoriteList.toString());
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <UpperBar navigation={this.props.navigation} />
        <ScrollView>
          <View>
            <Image
              style={styles.pizzaPicture}
              source={
                this.state.restaurantData.reviews !== undefined
                  ? {
                      uri: this.state.restaurantData.reviews[0].picture,
                    }
                  : require('../Pictures/noReviews.png')
              }
              title="Pizza picture"
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.titles}>
                {this.state.restaurantData.name}
              </Text>
              <IconButton
                color={this.state.favoriteButtonColor}
                icon="heart-outline"
                size={45}
                onPress={this.handleFavoriteButtonClick}
              />
            </View>
            <List.Item
              title={this.state.reviewAverage}
              left={(props) => <List.Icon {...props} icon="emoticon-outline" />}
            />
            <List.Item
              title={this.state.restaurantData.openHours}
              left={(props) => <List.Icon {...props} icon="clock-outline" />}
            />
            <List.Item
              title={this.state.restaurantData.location}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
            />
            <List.Item
              title={this.state.priceAverage}
              left={(props) => <List.Icon {...props} icon="currency-eur" />}
            />
          </View>
          <View style={{marginTop: 45}}>
            <Text style={styles.titles}>Comments and reviews</Text>
          </View>

          <View style={{padding: 15}}>
            {this.state.restaurantData.reviews.map((review) => (
              <View style={{marginBottom: 40}} key={review.comment}>
                <ReviewCard review={review} />
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('CreateNewReview', {
              restaurantData: this.state.restaurantData,
            });
          }}>
          <View style={styles.createReviewButton}>
            <View style={styles.itemAlignCenter}>
              <IconButton icon="pencil" size={30} />
            </View>
            <View style={styles.itemAlignCenter}>
              <Text>Add a review...</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default RestaurantPage;
