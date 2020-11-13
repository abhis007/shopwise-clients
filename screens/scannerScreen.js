// Barcode and QR Code Scanner using Camera in React Native
// https://aboutreact.com/react-native-scan-qr-code/

// import React in our code
import React, {useState,useEffect} from 'react';

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



//const db = SQLite.openDatabase({ name: 'shopwiseDB' });

//console.log(db)


const scannerScreen = () => {
  const [qrvalue, setQrvalue] = useState('');
  const [opneScanner, setOpneScanner] = useState(false);

  const onOpenlink = () => {
    // If scanned then function to open URL in Browser
    Linking.openURL(qrvalue);
  };


  // ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  //   db.transaction((trans) => {
  //     trans.executeSql(sql, params, (trans, results) => {
  //       resolve(results);
  //     },
  //       (error) => {
  //         reject(error);
  //       });
  //   });
  // });

  async function InsertQuery(logDetailsToSave) {
   // let singleInsert =  await ExecuteQuery("INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_timestamp,visitor_temperature) VALUES ( ?, ?, ?, ?,?)", [ 'sdfsd','sdfsdf', 'asd','123123', 0]);
   // console.log(singleInsert);




   const db= SQLite.openDatabase(
    {
      name: 'shopwiseDB',
      location: 'default',
      createFromLocation: 'Library',
    },
    () => {console.log('success')},
    error => {
      console.log("ERROR:wrw " + error);
    }
  );



    db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_timestamp,visitor_temperature) VALUES ( ?, ?, ?, ?,?)", 
        [ 'sdfsd','sdfsdf', 'asd','123123', 0],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Registred');
          } else alert('Registration Failed');
        }
      ),
      (error) => {
        console.log(error)
        reject(error);
      };
    });
  };
  
  const onBarcodeScan = (qrvalue) => {
    // Called after te successful scanning of QRCode/Barcode
    setQrvalue(qrvalue);
    setOpneScanner(false);
alert('fdfd');
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
  
    var userDetails = qrvalue.split(';');
    var logDetailsToSave = {
      "Name":userDetails[0],
      "Phone":userDetails[1],
      "Location":userDetails[2],

    }
    console.log('fb',db);

  

    var today = new Date()
    let currentDate =today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


    db.transaction(function (tx) {
      let Table =  tx.executeSql("  CREATE TABLE IF NOT EXISTS  visitor_log (pk_visitor_log_id	INTEGER UNIQUE,visitor_name	TEXT NOT NULL,visitor_mob	TEXT NOT NULL,visitor_location	TEXT NOT NULL,visitor_date TEXT NOT NULL,visitor_time 	TEXT NOT NULL,PRIMARY KEY(pk_visitor_log_id AUTOINCREMENT))",[]);
      console.log(Table);
      tx.executeSql(
        "INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_date,visitor_time) VALUES ( ?, ?, ?, ?,?)", 
        [ 'sdfsd','sdfsdf', 'asd','123123', 12],
        (tx, results) => {
         
          console.log('Results', results);
          if (results.rowsAffected > 0) {
            alert('Registred');
          } else alert('Registration Failed');
        },(error)=>{
          console.log('d',error);
        }
      ), 
      (error) => {
       
        console.log(error)
        reject(error);
      };
     // console.log('\n\n\n',tx);
    });
    //await InsertQuery(logDetailsToSave);


     
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

  return (
    <SafeAreaView style={{flex: 1}}>
      {opneScanner ? (
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
      ) : (
        <View style={styles.container}>
          <Text style={styles.titleText}>
           Shopwise
          </Text>
          <Text style={styles.textStyle}>
            {
              
              qrvalue ? 'Scanned Result: ' + qrvalue : ''}


          </Text>
          {qrvalue.includes('https://') ||
          qrvalue.includes('http://') ||
          qrvalue.includes('geo:') ? (
            <TouchableHighlight onPress={onOpenlink}>
              <Text style={styles.textLinkStyle}>
                {
                  qrvalue.includes('geo:') ?
                  'Open in Map' : 'Open Link'
                }
              </Text>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            onPress={onOpneScanner}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>
              Open QR Scanner
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={onOpneScanner}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>
             Enter Mannually
            </Text>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaView>
  );
};

export default scannerScreen;

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