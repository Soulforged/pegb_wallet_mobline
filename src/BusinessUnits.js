//@flow
import React, { Component } from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const Row = ({ creationTime, id, lastUpdateTime, name, status }) => (
  <View style={styles.row}>
    <Text style={styles.cell}>{id}</Text>
    <Text style={styles.cell}>{name}</Text>
    <Text style={styles.cell}>{status}</Text>
    <Text style={styles.cell}>{creationTime}</Text>
    <Text style={styles.cell}>{lastUpdateTime}</Text>
  </View>
);

const BusinessUnits = ({ businessUnits }) => (
  <ListView
    style={{ flexGrow: 1, flex: 1 }}
    enableEmptySections={true}
    dataSource={ds.cloneWithRows(businessUnits.ids.map(id => businessUnits.byId[id]))}
    renderRow={Row}
  />
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexGrow: 1,
    flex: 1,
    margin: 10
  },
  cell: {
    flex: 1
  }
});

export default connect(
  ({ entities: { businessUnits } }) => ({ businessUnits })
)(BusinessUnits);
