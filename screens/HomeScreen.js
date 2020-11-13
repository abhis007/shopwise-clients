import React, { useState } from 'react';
import moment from "moment";
// import all the components we are going to use
import {
 
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  SafeAreaView
} from 'react-native';

import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Text,
  View,

  
} from 'native-base';
import {  Alert,} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import SQLite from 'react-native-sqlite-storage';
const db= SQLite.openDatabase(
  {
    name: 'shopwiseDB',
    location: 'default',
    createFromLocation:'~shopwiseDB.db',
  },
  () => {console.log('\n\n\nsuccess')},
  error => {
    console.log("ERROR:wrw " + error);
  }
);
export default function HomeScreen({navigation}) {
  // const [visitorName, setVisitorName] = useState('');
  // const [visitorPhone, setVisitorPhone] = useState('');
  // const [visitorLocation, setVisitorLocation] = useState('');
  // const [visitorTemperature, setVisitorTemperature] = useState('');

  const onBarcodeScan = (qrvalue) => {
    // Called after te successful scanning of QRCode/Barcode
    setQrvalue(qrvalue);
    setOpneScanner(false);

    // const db= SQLite.openDatabase(
    //   {
    //     name: 'test',
    //     location: 'default',
    //     createFromLocation:'~test.db',
    //   },
    //   () => {console.log('\n\n\nsuccess')},
    //   error => {
    //     console.log("ERROR:wrw " + error);
    //   }
    // );
  
  
    var userDetails = qrvalue.split(';');
    
    let name = userDetails[0].split("=")
    
    let phone = userDetails[1].split("=")
    let location = userDetails[2].split("=")

    let nameToSave=''
    let phoneToSave=''
    let locationToSave=''
    console.log("name",name)
    if(name[0]=='SW-Name')
    nameToSave=name[1]
    if(phone[0]=='SW-Phone')
    phoneToSave=phone[1]
    if(location[0]=='SW-Location')
    locationToSave=location[1]


    let strErrors =""
      if(nameToSave=="")
      strErrors+=" * Visitor Name is Mandatory\n\n"
      if(phoneToSave=="")
      strErrors+=" *Visitor Phone is Mandatory\n\n"
      if(locationToSave=="")
      strErrors+=" * Visitor Location is Mandatory"

      if(strErrors!="")
      Alert.alert("Insufficient Data\n\n",strErrors)
      else{
        insertToDatabase(nameToSave,phoneToSave,locationToSave)

      }


     
  };

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


  const insertToDatabase =  (nameToSave,phoneToSave,locationToSave)=> {
 
    var today = new Date()
    let currentDate =today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var current = moment();
    let currentTime = moment(current).format("hh:mm");
    db.transaction(function (tx) {
    let Table =  tx.executeSql("  CREATE TABLE IF NOT EXISTS  visitor_log (pk_visitor_log_id	INTEGER UNIQUE,visitor_name	TEXT NOT NULL,visitor_mob	TEXT NOT NULL,visitor_location	TEXT NOT NULL,visitor_date	TEXT NOT NULL,visitor_time 	TEXT NOT NULL,PRIMARY KEY(pk_visitor_log_id AUTOINCREMENT))",[]);
    console.log(Table);
    tx.executeSql(
        "INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_date,visitor_time) VALUES ( ?, ?, ?, ?,?)", 
        [ nameToSave,phoneToSave, locationToSave,currentDate, currentTime],
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

  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
    {opneScanner?(
     
      <View style={{flex: 1}}>
        <CameraKitCameraScreen
          showFrame={true}
          // Show/hide scan frame
          scanBarcode={true}
          // Can restrict for the QR Code only
          laserColor={'blue'}
          // Color can be of your choice
          frameColor={'yellow'}
          // If frame is visible then frame color
          colorForScannerFrame={'black'}
          // Scanner Frame color
          onReadCode={(event) =>
            onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
     
      
      )
     : (
   
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon
              name="shopping-basket"
              style={{ color: '#ffff', fontSize: 25 }}
            />
          </Button>
        </Left>
        <Body>
          <Title>Shopwise</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <View style={styles.container}>
          <Text style={styles.titleText}>
          Shopwise
          </Text>
          <Text style={styles.textStyle}>
            {
              
              qrvalue ? 'Scanned Result: ' + qrvalue : ''}


          </Text>
        <View style={{ flex: 1, flexDirection: 'column',marginTop:10,padding:10 }}>
        <Text > Welcome shopkeeper </Text>
        <Button block success style={{marginTop:10}} onPress={onOpneScanner}>
            <Text>Scan</Text>
          </Button>
          <Button block warning style={{marginTop:10}} onPress={ () =>  navigation.navigate('Save')}>
            <Text>Enter Mannualy</Text>
          </Button>
          <Button block info style={{marginTop:10}} onPress={ () =>  navigation.navigate('Report')}>
            <Text>Report</Text>
          </Button>
          <Button block danger style={{marginTop:10}}>
            <Text>Profile</Text>
          </Button>
        </View>
        </View>
        
        
      </Content>
 
    </Container>)
    }
    </SafeAreaView>
    
  );
}

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
