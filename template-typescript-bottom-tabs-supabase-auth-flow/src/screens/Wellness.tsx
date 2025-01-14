import React, { useState, useEffect } from "react";
import { View, Linking, Image, TouchableOpacity, FlatList } from "react-native";
import { Card } from "react-native-elements";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TextInput,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();

  const [wellness, setWellness] = useState(null);
  async function showData() {
    const userId = await AsyncStorage.getItem("user_id");
    const { data, error } = await supabase.from("wellness").select().eq("user_id", userId);
    setWellness(data);
  }

  console.log(wellness);

  return (
    <Layout>
      <TopNav
        middleContent="Wellness"
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          text={"Show data"}
          onPress={() => {
            showData();
          }}
          style={{
            marginTop: 10,
          }}
        />

        <FlatList
          data={wellness}
          renderItem={({ item }) => (
            <Card>
              <Card.Title key={item.id}>{item.id}</Card.Title>
              <Card.Divider />
              <Image
                source={{ uri: "https://zgrlireycbtaumwfayab.supabase.co/" + item.image_url }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              ></Image>
              <Text style={{ marginTop: 10 }} key={item.id}>
                Estado de ánimo: {item.estadoAnimo}
              </Text>
              <Text style={{ marginTop: 10 }} key={item.id}>
                Calidad de sueño: {item.calidadSueño}
              </Text>
            </Card>
          )}
        />
      </View>
    </Layout>
  );
}
