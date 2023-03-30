import { Header } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import { Input, Button } from '@rneui/themed';
import { ListItem } from '@rneui/themed';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Alert  } from 'react-native';

import { push, ref, onValue, remove } from 'firebase/database';
import React, { useState, useEffect } from 'react';

import database from './firebase';

export default function MyPlaces({navigation, route}) {

  const [address, setAddress] = useState('');
  const [list, setList] = useState([]);

  useEffect (() => {
    const itemsRef = ref(database, 'list/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    //console.log(data)
    const items = data ? Object.keys(data).map(key =>({key, ...data[key]})) : [];
    //console.log(items)
    setList(items);
    })
    }, []);

  const saveItem = () => {
    push(
      ref(database, 'list/'),
      {'address': address})
;  }

const deleteItem = (key) => {
  //console.log('deleteItem', key);
  remove(ref(database, 'list/' + key))
};

const confirmDelete = key =>
Alert.alert(
  "Delete place",
  "Are you sure you want to delete the place?",
  [
    {
      text:'Cancel',
    },
    {
      text:'Yes',
      onPress:()=> deleteItem(key),
    }
  ],
  {
    cancelable:true
  }
);

//useEffect(init, []);

useEffect (() => {
  const {fullAddress} = route.params  || false;
  if (fullAddress) {
    console.log('Save', fullAddress);
    setAddress(fullAddress)
    saveItem(address);
  }
}, [route.params?.fullAddress]);

const renderItem = ({item}) => (
  <ListItem 
  bottomDivider
  topDivider
  onPress={() => navigation.navigate('Map', {address:item.address})}
  onLongPress={() => confirmDelete(item.key)}>
    <ListItem.Content style={{flexDirection:'row', justifyContent: 'space-between'}}>
      <ListItem.Title numberOfLines={1} style={{flex:1}}> {item.address}</ListItem.Title>
      <ListItem.Subtitle right> Show on map</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron/>
      </ListItem>
);

  return (
    <View style={styles.container}>
      <Header
      centerComponent={{text: 'PLACEFINDER', style:{color: '#fff'}}}/>
      <Input placeholder='Type in address' label='address' style={{marginTop: 5, fontSize: 18, width: 200 }}
        onChangeText={(address) => setAddress(address)}
        value={address}/>      
      <Button title='Show on map' onPress={() => {
        if (address.trim()) {
          navigation.navigate ('Map', {address:address});
          setAddress('');
          }
          }}  />
      
      <FlatList
      style={styles.listcontainer}
        data={list}
        keyExtractor={item => item.key} 
        renderItem={renderItem }
         
         />   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    //alignItems: 'center'
   },
});

