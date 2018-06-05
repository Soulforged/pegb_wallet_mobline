import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from "react-redux";
import createStore from "./reduxconf";
import BusinessUnits from "./BusinessUnits";
import Initializer from "./Initializer";

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.app}>
          <View style={styles.appHeader}>
            <Text style={styles.appTitle}>Business units list</Text>
          </View>
          <BusinessUnits />
          <Initializer />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1
  },
  appHeader: {
    backgroundColor: '#222',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appTitle: {
    fontSize: 16,
    color: 'white'
  }
});

export default App;
