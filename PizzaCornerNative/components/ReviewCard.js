import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Card, DataTable} from 'react-native-paper';

class ReviewCard extends Component {
  state = {
    review: this.props.review,
  };

  handleChange = (event) => {
    this.setState({sortBy: event.target.value});
  };

  render() {
    return (
      <Card>
        <Card.Cover
          source={
            this.props.review.picture !== undefined
              ? {
                  uri: this.state.review.picture,
                }
              : require('../Pictures/noReviews.png')
          }
          title="Pizza picture"
        />
        <Card.Content>
          <Text style={{marginTop: 25, marginBottom: 25}}>
            {this.state.review.timestamp}
          </Text>
          <DataTable>
            <DataTable.Row key={this.state.review.comment}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Text>{this.state.review.comment}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{textAlign: 'right'}}>
                    {this.state.review.stars}/5
                  </Text>
                </View>
              </View>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>
    );
  }
}
export default ReviewCard;
