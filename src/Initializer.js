//@flow
import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import actions from "./businessUnits/actions";

const {
  fetchAll,
} = actions;

class Initializer extends React.Component {
  render() {
    return <View />;
  }

  componentDidMount() {
    this.props.fetchAll();
  }
}

export default connect(
  () => ({}),
  { fetchAll }
)(Initializer);
