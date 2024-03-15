import * as React from 'react';
import PieChart from 'react-native-pie-chart';
import { BellSimple, CaretDown, MapPin } from "phosphor-react-native";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";


import Sun from "../img/01d.svg";
import Sun02d from "../img/02d.svg";
const HomeScreens = () => {
  const widthAndHeight = 200
  const series = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  const sliceColor = ['#2ecc71',"#2ecc71",'#f1c40f',"#f1c40f","#f1c40f", '#eb7343', '#eb7343', '#c0392b','#c0392b',"#c0392b","#8128b4","#8128b4","#8128b4","#8128b4","#8128b4","#8128b4"]
  return (
    <View >
      <View style={styles.content}>
        <View style={styles.info}>
        <View style={styles.container}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              sliceColor={sliceColor}
              coverRadius={0.45}
              coverFill={null}     
            />
          </View>
          <Text style={styles.infoText}>15</Text>
          <Text style={styles.infoTextMaxMin}>Max.: 15 - Min.: 0</Text>
        </View>
      </View>
      <View style={styles.infoDetails}>
        <Text style={styles.infoDetailsText}>Modulos</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.infoDetailsCard}>
            <Text style={styles.infoDetailsCardWeekDay}>Seg.</Text>
            <Image source={Sun02d} />
            <Text style={styles.infoDetailsCardPreview}>19°C</Text>
          </View>
          <View style={styles.infoDetailsCard}>
            <Text style={styles.infoDetailsCardWeekDay}>Seg.</Text>
            <Image source={Sun02d} />
            <Text style={styles.infoDetailsCardPreview}>19°C</Text>
          </View>
          <View style={styles.infoDetailsCard}>
            <Text style={styles.infoDetailsCardWeekDay}>Seg.</Text>
            <Image source={Sun02d} />
            <Text style={styles.infoDetailsCardPreview}>19°C</Text>
          </View>
          <View style={styles.infoDetailsCard}>
            <Text style={styles.infoDetailsCardWeekDay}>Seg.</Text>
            <Image source={Sun02d} />
            <Text style={styles.infoDetailsCardPreview}>19°C</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  content: { paddingHorizontal: 40 },
  header: {
    width: "100%",
    marginTop: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10, // Use marginLeft instead of gap
  },
  headerLeftText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    paddingVertical: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoImg: {
    width: 230,
    height: 230,
  },
  infoText: {
    marginTop: 65,
    fontSize: 50,
    fontWeight: "300",
    color: "#0c2342",

  },
  infoTextMaxMin: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  infoDetails: {
    marginTop: 65,
    paddingLeft: 20,
  },
  infoDetailsText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "300",
  },
  infoDetailsCard: {
    marginRight: 20,
    width: 99,
    height: 129,
    backgroundColor: "rgba(255, 255, 255, 0.23)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4, // Use marginHorizontal instead of gap
  },
  infoDetailsCardWeekDay: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoDetailsCardPreview: {
    fontSize: 24,
    fontWeight: "300",
  }
});


export default HomeScreens;