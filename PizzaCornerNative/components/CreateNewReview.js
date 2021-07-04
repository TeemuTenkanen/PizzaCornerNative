import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Image} from 'react-native';
import {IconButton, TextInput, Button, Snackbar} from 'react-native-paper';
import UpperBar from './UpperBar.js';
import {Rating} from 'react-native-ratings';
import * as ImagePicker from 'react-native-image-picker';
import defaultPicture from '../Pictures/defaultPicture.png';
import firebase from '../firebase';
import RNFS from 'react-native-fs';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 100,
  },
  title: {
    fontSize: 28,
    padding: 15,
    paddingTop: 40,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pizzaPicture: {
    width: '100%',
    height: 250,
    marginVertical: 45,
  },
  bottomSpace: {
    paddingBottom: 200,
  },
});

class CreateNewReview extends Component {
  state = {
    restaurantData: this.props.route.params.restaurantData,
    stars: 0,
    price: 0,
    comment: '',
    image: Image.resolveAssetSource(defaultPicture).uri,
    imageUrl: null,
    snackBarOpen: false,
  };

  handleChange = (value, name) => {
    this.setState({[name]: value});
  };

  handleImageChange = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets[0].uri) {
        this.setState({image: response.assets[0].uri});
        RNFS.readFile(response.assets[0].uri, 'base64').then((res) => {
          var imageUrl = 'data:image/jpeg;base64,' + res;
          this.setState({imageUrl});
        });
      }
    });
  };

  onSend = async () => {
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    let time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    firebase
      .database()
      .ref('Restaurants/' + this.state.restaurantData.name + '/reviews')
      .push({
        comment: this.state.comment,
        price: this.state.price,
        stars: this.state.stars,
        picture: this.state.imageUrl,
        timestamp: date + ' ' + time,
      });
    this.setState({snackBarOpen: true});
  };

  render() {
    const submitDisabled =
      this.state.price !== 0 &&
      this.state.comment !== '' &&
      this.state.stars !== 0 &&
      this.state.imageUrl !== 'null'
        ? false
        : true;
    return (
      <View>
        <UpperBar navigation={this.props.navigation} />
        <ScrollView>
          <View style={styles.container}>
            <Snackbar
              theme={{
                colors: {
                  onSurface: 'rgba(200, 247, 197, 1)',
                  accent: 'black',
                },
              }}
              style={{
                flex: 1,
                bottom: 550,
              }}
              visible={this.state.snackBarOpen}
              onDismiss={() => this.setState({snackBarOpen: false})}
              action={{
                label: 'X',
                onPress: () => {
                  this.setState({snackBarOpen: false});
                },
              }}>
              <View style={styles.row}>
                <IconButton
                  icon="checkbox-marked-circle-outline"
                  size={30}
                  style={{flex: 1}}
                />
                <Text style={{flex: 1, fontSize: 20}}>
                  You created a review.
                </Text>
              </View>
            </Snackbar>
            <View>
              <Text style={styles.title}>
                Review {this.state.restaurantData.name}
              </Text>
            </View>
            <View style={styles.row}>
              <IconButton icon="emoticon-outline" size={30} style={{flex: 1}} />
              <Rating
                type="custom"
                defaultRating={0}
                ratingBackgroundColor="#BDC3C7"
                onFinishRating={(value) => this.handleChange(value, 'stars')}
                value={this.state.stars}
                tintColor="#FFFFFF"
                imageSize={30}
                style={{flex: 1, right: 50}}
              />
            </View>
            <View style={styles.row}>
              <IconButton icon="currency-eur" size={30} style={{flex: 1}} />
              <TextInput
                keyboardType="numeric"
                name="price"
                label="The price of pizza?"
                value={this.state.price}
                onChangeText={(value) => this.handleChange(value, 'price')}
                style={{flex: 1, right: 50}}
              />
            </View>
            <View style={styles.row}>
              <IconButton icon="message-outline" size={30} style={{flex: 1}} />
              <TextInput
                label="Add comment"
                value={this.state.comment}
                onChangeText={(value) => this.handleChange(value, 'comment')}
                style={{flex: 1, right: 50}}
              />
            </View>
            <View style={styles.row}>
              <IconButton icon="camera" size={30} style={{flex: 1}} />
              <Button
                mode="contained"
                onPress={this.handleImageChange}
                style={{flex: 1, right: 50, maxWidth: 200}}>
                ADD PICTURE
              </Button>
            </View>

            <Image
              source={{uri: this.state.image}}
              style={styles.pizzaPicture}
            />

            <View style={styles.row}>
              <Button
                mode="contained"
                onPress={this.onSend}
                style={{flex: 1, maxWidth: 200, marginBottom: 20}}
                disabled={submitDisabled}>
                Send review
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default CreateNewReview;
