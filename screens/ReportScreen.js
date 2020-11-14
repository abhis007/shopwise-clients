import React, { Component,useState  } from 'react';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input,View,DatePicker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet,  Alert,} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import RNFS from 'react-native-fs';
import * as XLSX from 'xlsx';
import {encode} from 'base64-arraybuffer';

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

    const ReportScreen = ({ navigation }) => {

    

    let [tableHeader,setTableHeader] = useState( ['Name', 'Phone', 'Location', 'Date ', 'Time'])
    let [data,setData] = useState('')
     
 
    var today = new Date()
    let currentDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear() ;
    let[visitorFromDate, setVisitorFromDate] = useState(currentDate);
    let [visitorToDate, setVisitorToDate] = useState(currentDate);
    
    let [visitorFromHH, setVisitorFromHH] = useState(new Date());
    let [visitorFromMM, setVisitorFromMM] = useState(new Date());

    let [visitorToHH, setVisitorToHH] = useState(new Date());
    let [visitorToMM, setVisitorToMM] = useState(new Date());

     
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
 
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


const searchData=()=>{
    let data=[];
    setData([])
    
    db.transaction(function (tx) {

let strNameLikeParam = visitorName + '%';
let strPhoneNumberLikeParam=visitorPhone+'%';
var dateFrm = moment(visitorFromDate, 'DD-MM-YYYY')
var dateTo = moment(visitorToDate, 'DD-MM-YYYY')
let fromDate= dateFrm.format('YYYY-MM-DD')
let toDate= dateTo.format('YYYY-MM-DD')

        tx.executeSql("SELECT * FROM visitor_log where visitor_name LIKE  ? AND visitor_date  >= ? and visitor_date <= ?  and visitor_mob like ?",[strNameLikeParam,fromDate,toDate,strPhoneNumberLikeParam],(tx,results)=>{
        
console.log(visitorFromDate,visitorToDate)
var hours = new Date().getHours(); //To get the Current Hours
var min = new Date().getMinutes();
let time =hours+':'+min;
           var rows = results.rows;
           console.log(rows);
           var testArray =[];
           for (let i = 0; i < rows.length; i++) {
               var item = rows.item(i);
               testArray[i]=[];
                try{
                        testArray[i].push(item['visitor_name'])
                        testArray[i].push(item['visitor_mob'])
                        testArray[i].push(item['visitor_location'])
                        testArray[i].push(item['visitor_date'])
                        testArray[i].push(item['visitor_time'])
                
                
                }
                    catch(e){
                    console.log(e)
                }
            //    testArray[i].push(item['visitor_mob'])
            // //   testArray[i][2]=item['visitor_location"']
           //    console.log('asdrtds',item)
               
           }
        //   console.log('asds',testArray)
           setData(testArray)
        },(error)=>{
            console.log('d',error);
          })
    })

}

  const insertToDatabase =  () => {
    db.transaction(function (tx) {
    let Table =  tx.executeSql("  CREATE TABLE IF NOT EXISTS  visitor_log (pk_visitor_log_id    INTEGER UNIQUE,visitor_name TEXT NOT NULL,visitor_mob   TEXT NOT NULL,visitor_location  TEXT NOT NULL,visitor_timestamp TEXT NOT NULL,visitor_temperature   INTEGER,PRIMARY KEY(pk_visitor_log_id AUTOINCREMENT))",[]);
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

  const formatDate = date => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const exportData = () => {
    var csvData = data;
    const fileName = 'ExportedData'
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.aoa_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    var path = RNFS.DownloadDirectoryPath + '/' + fileName + fileExtension;
    RNFS.writeFile(path, encode(excelBuffer), 'base64')
      .then((success) => {
        console.log('FILE WRITTEN !', path);
      })
      .catch((err) => {
        console.log(err.message);
      });
    // const data = new Blob([excelBuffer], {type: fileType});
    // FileSaver.saveAs(data, fileName + fileExtension);
    console.log(ws)
}

    return (
      <Container>
        
        <Content>
        
        <Text style={styles.titleText}> Customer/Visitor  Details</Text>
        <View style={{ flex: 1, flexDirection: 'column',marginTop:10,padding:12 ,backgroundColor:'#fdf6e3'}}>
        <View style={{ flex: 1, flexDirection: 'row',marginTop:10,padding:12 }}>
       <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>From :</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
        <DatePicker
            defaultSelected={visitorFromDate}
            minimumDate={new Date(2020, 1, 1)}
            

            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText={visitorFromDate}
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={setVisitorFromDate}
            disabled={false}
            style={{backgroundColor:'#2a2a2a',}}
            />
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>To :</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
       <DatePicker
            defaultSelected={setVisitorToDate}
            minimumDate={new Date(2020, 1, 1)}
            

            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText={visitorFromDate}
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={setVisitorToDate}
            disabled={false}
            style={{backgroundColor:'#2a2a2a',}}
            />
          
            </View>
            
        </View>

        <View style={{ flex: 1, flexDirection: 'row',marginTop:10,padding:12 }}>
       {/* <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>From Time:</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
        <Item regular style={{width:50}} >
            <Input placeholder='HH' />
          </Item>
          <Item regular style={{width:50}} >
            <Input placeholder='MM' />
          </Item>
    </View> */}
            {/* <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>To time:</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
       <Item regular style={{width:50}} >
            <Input placeholder='HH' />
          </Item>
          <Item regular style={{width:50}} >
            <Input placeholder='MM' />
          </Item>
            </View> */}
            
        </View>

        <View style={{ flex: 1, flexDirection: 'row',marginTop:10,padding:12 }}>
       <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>Name :</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
        <Item regular style={{flex: 1,marginRight:10}} >
            <Input placeholder='Name'  onChangeText={visitorName => setVisitorName(visitorName)} />
          </Item>
           
    </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
       <Text>Phone :</Text>
       </View> 
       <View style={{flex: 2,  flexDirection: 'row',marginTop:-10}}>
       <Item regular style={{flex: 1,marginRight:10}} >
            <Input placeholder='Phone'  onChangeText={visitorPhone => setVisitorPhone(visitorPhone)} />
          </Item>
           
           
            
        </View>
        
          </View>
          <View style={{padding: 10}}>
        <Button rounded success block style={{marginTop:15,padding:20}} onPress={searchData}> 
            <Text>Search</Text>
          </Button>
        <Button rounded success block style={{marginTop:15,padding:20}} onPress={exportData}> 
            <Text>Export</Text>
          </Button>
          </View> 
        

        
        </View>
        <View style={{padding: 4}}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
          <Row data={tableHeader} style={styles.HeadStyle} textStyle={styles.TableText}/>
          <Rows data={data} textStyle={styles.TableText}/>
        </Table>
</View>
        </Content>
    
      </Container>
    );

    
 
}
export default ReportScreen



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
    HeadStyle: { 
        height: 50,
        alignContent: "center",
        backgroundColor: '#ffe0f0'
      },
      TableText: { 
        margin: 10
      }
  });
  
