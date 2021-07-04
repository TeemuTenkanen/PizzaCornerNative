import React from 'react';
import firebase from '../firebase.js';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import UpperBar from './UpperBar.js';
import {PizzaContext} from './Context.js';
import {IconButton, TextInput, Button, Snackbar} from 'react-native-paper';

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
    marginBottom: 35,
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

class RequestNewRestaurant extends React.Component {
  state = {
    name: '',
    location: '',
    openHours: '',
    submitDisabled: false,
    snackBarOpen: false,
    showErrorMessage: false,
    showNameError: false,
    restaurantData: this.context.restaurantData,
    restaurantRequests: this.context.restaurantRequests,
    restaurantNames: [],
  };

  componentDidMount() {
    let restaurantNames = [];
    for (let restaurant in this.state.restaurantData) {
      restaurantNames.push(
        this.state.restaurantData[restaurant].name.toLowerCase(),
      );
    }
    for (let request in this.state.restaurantRequests) {
      restaurantNames.push(
        this.state.restaurantRequests[request].name.toLowerCase(),
      );
    }
    this.setState({restaurantNames});
  }

  handleChange = (value, name) => {
    this.setState({submitDisabled: false});
    if (name === 'name') {
      if (this.state.restaurantNames.includes(value.toLowerCase())) {
        this.setState({showNameError: true, submitDisabled: true});
      }
    }
    this.setState({[name]: value});
  };

  onSend = (event) => {
    event.preventDefault();
    if (
      this.state.name !== '' &&
      this.state.location !== '' &&
      this.state.openHours !== ''
    ) {
      firebase.database().ref('RestaurantRequests').push({
        name: this.state.name,
        location: this.state.location,
        openHours: this.state.openHours,
      });
      this.setState({snackBarOpen: true, submitDisabled: true});
    } else {
      this.setState({showErrorMessage: true});
    }
  };

  handleSnackBarClose = () => {
    this.setState({
      snackBarOpen: false,
      showErrorMessage: false,
      showNameError: false,
    });
  };

  render() {
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
                bottom: 330,
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

            <Snackbar
              theme={{
                colors: {
                  onSurface: 'rgba(241, 169, 160, 1)',
                  accent: 'black',
                },
              }}
              style={{
                bottom: 330,
              }}
              visible={this.state.showErrorMessage}
              onDismiss={() => this.setState({showErrorMessage: false})}
              action={{
                label: 'X',
                onPress: () => {
                  this.setState({showErrorMessage: false});
                },
              }}>
              <View style={styles.row}>
                <IconButton
                  icon="checkbox-marked-circle-outline"
                  size={30}
                  style={{flex: 1}}
                />
                <Text style={{flex: 1, fontSize: 20}}>
                  You must fill every input
                </Text>
              </View>
            </Snackbar>
            <Snackbar
              theme={{
                colors: {
                  onSurface: 'rgba(241, 169, 160, 1)',
                  accent: 'black',
                },
              }}
              style={{
                bottom: 330,
              }}
              visible={this.state.showNameError}
              onDismiss={() => this.setState({showNameError: false})}
              action={{
                label: 'X',
                onPress: () => {
                  this.setState({showNameError: false});
                },
              }}>
              <View style={styles.row}>
                <IconButton
                  icon="checkbox-marked-circle-outline"
                  size={30}
                  style={{flex: 1}}
                />
                <Text style={{flex: 1, fontSize: 20}}>
                  This restaurant is added already
                </Text>
              </View>
            </Snackbar>
            <View>
              <Text style={styles.title}>Request new restaurant</Text>
            </View>
            <View style={styles.row}>
              <Text style={{flex: 1, left: 90}}>Name</Text>
              <TextInput
                label="Add name"
                value={this.state.name}
                onChangeText={(value) => this.handleChange(value, 'name')}
                style={{flex: 1, right: 50, maxWidth: 200}}
              />
            </View>
            <View style={styles.row}>
              <IconButton icon="map-marker" size={30} style={{flex: 1}} />
              <TextInput
                label="Add location"
                value={this.state.location}
                onChangeText={(value) => this.handleChange(value, 'location')}
                style={{flex: 1, right: 50}}
              />
            </View>
            <View style={styles.row}>
              <IconButton icon="clock-outline" size={30} style={{flex: 1}} />
              <TextInput
                label="Add open hours"
                value={this.state.openHours}
                onChangeText={(value) => this.handleChange(value, 'openHours')}
                style={{flex: 1, right: 50}}
              />
            </View>

            <View style={styles.row}>
              <Button
                mode="contained"
                onPress={this.onSend}
                style={{
                  flex: 1,
                  maxWidth: 250,
                  marginBottom: 20,
                  marginTop: 50,
                }}
                disabled={this.state.submitDisabled}>
                REQUEST NEW RESTAURANT
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

RequestNewRestaurant.contextType = PizzaContext;

export default RequestNewRestaurant;
