// Barcode and QR Code Scanner using Camera in React Native
// https://aboutreact.com/react-native-scan-qr-code/

// import React in our code
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';

// import CameraKitCameraScreen
import {CameraKitCameraScreen} from 'react-native-camera-kit';

import SQLite from 'react-native-sqlite-storage';


import HomeScreen from './screens/HomeScreen'
import SaveScreen from './screens/SaveScreen'
import ReportScreen from './screens/ReportScreen'

const Stack = createStackNavigator();
//const db = SQLite.openDatabase({ name: 'shopwiseDB' });

//console.log(db)
const App = () => {
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorLocation, setVisitorLocation] = useState('');
  const [visitorTemperature, setVisitorTemperature] = useState('');

  const onOpenlink = () => {
    // If scanned then function to open URL in Browser
    Linking.openURL(qrvalue);
  };


  

 
  
  const onBarcodeScan = (qrvalue) => {
    alert(qrvalue)
    // Called after te successful scanning of QRCode/Barcode
    setQrvalue(qrvalue);
    setOpneScanner(false);

    const db= SQLite.openDatabase(
      {
        name: 'test',
        location: 'default',
        createFromLocation:'~test.db',
      },
      () => {console.log('\n\n\nsuccess')},
      error => {
        console.log("ERROR:wrw " + error);
      }
    );
  

    const onOpneScanner = () => {
      // To Start Scanning
      if (Platform.OS === 'android') {
        async function requestCameraPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Camera Permission',
                message: 'App needs permission for camera access',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // If CAMERA Permission is granted
              setQrvalue('');
              setOpneScanner(true);
            } else {
              alert('CAMERA permission denied');
            }
          } catch (err) {
            alert('Camera permission err', err);
            console.warn(err);
          }
        }
        // Calling the camera permission function
        requestCameraPermission();
      } else {
        setQrvalue('');
        setOpneScanner(true);
      }
    };
    
    
alert('her');
    var userDetails = qrvalue.split(';');
    
    let name = userDetails[0].split("=")
    let phone = userDetails[1].split("=")
    let location = userDetails[2].split("=")
    console.log("name",name)
    if(name[0]=='SW-Name')
    setVisitorName(name[1])
    if(phone[0]=='SW-Phone')
    setVisitorPhone(phone[1])
    if(location[0]=='SW-Location')
    setVisitorLocation(location[1])


    let strErrors =""
      if(visitorName=="")
      strErrors+=" * Visitor Name is Mandatory\n\n"
      if(visitorPhone=="")
      strErrors+=" *Visitor Phone is Mandatory\n\n"
      if(visitorLocation=="")
      strErrors+=" * Visitor Location is Mandatory"

      if(strErrors!="")
      Alert.alert("Insufficient Data\n\n",strErrors)
      else{
        insertToDatabase()

      }





    

  };

  const insertToDatabase =  () => {
    alert('here');
    db.transaction(function (tx) {
    let Table =  tx.executeSql("  CREATE TABLE IF NOT EXISTS  visitor_log (pk_visitor_log_id	INTEGER UNIQUE,visitor_name	TEXT NOT NULL,visitor_mob	TEXT NOT NULL,visitor_location	TEXT NOT NULL,visitor_timestamp	TEXT NOT NULL,visitor_temperature 	INTEGER,PRIMARY KEY(pk_visitor_log_id AUTOINCREMENT))",[]);
    console.log(Table);
    tx.executeSql(
        "INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_timestamp,visitor_temperature) VALUES ( ?, ?, ?, ?,?)", 
        [ visitorName,visitorPhone, visitorLocation,'123123', visitorTemperature],
        (tx, results) => {
         
          console.log('Results', results);
          if (results.rowsAffected > 0) {
            Alert.alert(
                "Status",
                "Vistor Details Logged Successfully",
                [
                 
                  { text: "OK", onPress: () =>  navigation.navigate('Home') }
                ],
                { cancelable: false }
              );
          } else alert('Registration Failed');
        },(error)=>{
          console.log('d',error);
        }
      ), 
      (error) => {
       
        console.log(error)
        reject(error);
      };
    })
  }






  






  const onOpneScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // If CAMERA Permission is granted
            setQrvalue('');
            setOpneScanner(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpneScanner(true);
    }
  };

  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#3f51b5',
        
      },
    }}
 

      >
         
           <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
   
       {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        /> */}
      <Stack.Screen
          name="Save"
          component={SaveScreen}
          
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          
        />
       
    
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    marginTop: 16,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  textLinkStyle: {
    color: 'blue',
    paddingVertical: 20,
  },
});