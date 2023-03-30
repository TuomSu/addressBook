
import { StyleSheet, Text, View, TextInput, FlatList, Alert  } from 'react-native';

//import { push, ref, onValue, remove } from 'firebase/database';
import React, { useState, useEffect } from 'react';


import MapView, { Marker } from 'react-native-maps';
//import Map from './Map';
import MyPlaces from './MyPlaces'
import { Input, Button } from '@rneui/themed';

import KEY from './apiKey';


export default function Map ({route, navigation}){
  const [coordinates, setCoordinates] = useState({
    latitude: 0, 
    longitude: 0, 
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221});

  const [fullAddress, setFullAddress] = useState('');

  useEffect(() => {
    (async () => {
    const {address} = route.params;
        console.log('Tuleeko'+{address})
        try{
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${KEY}`)
        const info = await response.json();
        const location = info.results[0]
        console.log(info);
        setCoordinates(
          {latitude: info.results[0].geometry.location.lat,
          longitude: info.results[0].geometry.location.lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221});
        setFullAddress(`${location.formatted_address}`)
        }
        
      catch (e){
        Alert.alert('Error fetching data');
      }
      
  
        console.log({coordinates})
        
    
  })();
}, []);
      
    
  
  
    return (
      <View style={styles.container}>
        
        <MapView
          style={styles.map}
          region={coordinates}
          
        >
          <Marker
            coordinate={coordinates}
            title= {fullAddress}
          />
          
        </MapView>
        <Button title='Save location' onPress={() => {
          navigation.navigate('MyPlaces', {fullAddress: fullAddress.trim()});
        }} />
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
    map: {
      flex: 1,
      width: "100%",
      height: "75%"
    }
  });
  

