
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";



function Home({ navigation }) {
  const [getdataSource, setdataSource] = useState(null);
  const [getCountry, setCountry] = useState("pakistan");
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    return await fetch("https://covid-19-data.p.rapidapi.com/totals", {
      method: "GET",
      headers: {
        "x-rapidapi-key": "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 2 }}>
        <TextInput
          keyboardType="default"
          onChangeText={(data) => setCountry(data)}
        />
      </View>
      {getdataSource !== null ? (
        <View>
          <DataDisplay
            critical={getdataSource[0].critical}
            deaths={getdataSource[0].deaths}
            confirmed={getdataSource[0].confirmed}
            recovered={getdataSource[0].recovered}
          />
        </View>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

function CountryDetails({ navigation, route }) {
  const cont = route.params.cont;
  console.log(cont);
  const [getdataSource, setdataSource] = useState(null);
  const [getCountry, setCountry] = useState(cont);
  useEffect(() => {
    getData();
  },);

  const getData = async () => {
    return await fetch(
      "https://covid-19-data.p.rapidapi.com/country?name=" + getCountry,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ borderWidth: 2 }}>
        <TextInput
          keyboardType="default"
          onChangeText={(data) => setCountry(data)}
        />
      </View>
      {getdataSource && (
        <View>
          <Text>{JSON.stringify(getdataSource)}</Text>
        </View>
      )}
    </View>
  );
}
function DataDisplay(props) {
  return (
    <View>
      <Text>Confirmed Cases: {props.confirmed}</Text>
      <Text>Recovered: {props.recovered}</Text>
      <Text>Deaths: {props.deaths}</Text>
      <Text>Critical Cases: {props.critical}</Text>
    </View>
  );
}


function CountryList({ navigation, route }) {
  var x = 1;
  const [getdataSource, setdataSource] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    return await fetch(
      "https://world-population.p.rapidapi.com/allcountriesname",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "a8095841bamsh096696e6bbc18b9p1429d1jsnccffa5439580",
          "x-rapidapi-host": "world-population.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setdataSource(responseJson.body.countries);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Second Screen</Text>
      {getdataSource && (
        <FlatList
          data={getdataSource}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={Math.random()}
              onPress={() => navigation.navigate("Detail", { cont: item })}
            >
              <View>
                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Country List" component={MyDrawer} />
     </Drawer.Navigator>
    </NavigationContainer>
  );
}


function MyDrawer() {
  return (
    
      <Drawer.Navigator initialRouteName={"CountryList"}>
        <Drawer.Screen name="CountryList" component={CountryList} />
        <Drawer.Screen name="Detail" component={CountryDetails} />
      </Drawer.Navigator>
      );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
