import React, { Component,useState  } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input,View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet,  Alert,} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import moment from "moment";
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

    const SaveScreen = ({ navigation }) => {

    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorLocation, setVisitorLocation] = useState('');
    const [visitorTemperature, setVisitorTemperature] = useState('');
 
  let insertVisitorLog =()=>{
     
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
      
      

  }

  const insertToDatabase =  () => {

    var today = new Date()
    var current = moment();
   let currentTime = moment(current).format("hh:mm");
    let currentDate =today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    db.transaction(function (tx) {
    let Table =  tx.executeSql("  CREATE TABLE IF NOT EXISTS  visitor_log (pk_visitor_log_id	INTEGER UNIQUE,visitor_name	TEXT NOT NULL,visitor_mob	TEXT NOT NULL,visitor_location	TEXT NOT NULL,visitor_date TEXT NOT NULL,visitor_time 	TEXT NOT NULL,PRIMARY KEY(pk_visitor_log_id AUTOINCREMENT))",[]);
    console.log(Table);
    tx.executeSql(
        "INSERT INTO visitor_log (visitor_name, visitor_mob, visitor_location,visitor_date,visitor_time) VALUES ( ?, ?, ?, ?,?)", 
        [ visitorName,visitorPhone, visitorLocation,currentDate, currentTime],
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

    return (
      <Container>
        {/* <Header>
        <Left>
          <Button transparent>
            <Icon
              name="shopping-basket"
              style={{ color: '#ffff', fontSize: 25 }}
            />
          </Button>
        </Left>
          <Body>
            <Title>Showise Shops</Title>
          </Body>
          <Right />
        </Header> */}
        <Content>
        <Text style={styles.titleText}> Customer/Visitor  Details</Text>
        <View style={{ flex: 1, flexDirection: 'column',marginTop:10,padding:12 }}>
        <Item rounded>
            <Input placeholder='Name'  onChangeText={visitorName => setVisitorName(visitorName)}
        defaultValue={visitorName}/>
          </Item>
          <Item rounded style={{marginTop:10}}>
            <Input placeholder='Phone'  onChangeText={visitorPhone => setVisitorPhone(visitorPhone)}
        defaultValue={visitorPhone}/>
          </Item>
          <Item rounded style={{marginTop:10}}>
            <Input placeholder='Location'  onChangeText={visitorLocation => setVisitorLocation(visitorLocation)}
        defaultValue={visitorLocation}/>
          </Item>
          <Item rounded style={{marginTop:10}}>
            <Input placeholder='Temperature'  onChangeText={visitorTemperature => setVisitorTemperature(visitorTemperature)}
        defaultValue={visitorTemperature}/>
          </Item>

          <Button rounded success block style={{marginTop:15}} onPress={insertVisitorLog}> 
            <Text>Save</Text>
          </Button>
        </View>
        </Content>
    
      </Container>
    );
 
}
export default SaveScreen
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
      marginTop: 16,
    },
    textStyle: {
      color: '#3a3a3a',
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
  
