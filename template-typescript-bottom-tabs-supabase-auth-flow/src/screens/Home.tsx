import React, { useState, useEffect } from 'react';
import { View, Linking, Image, TouchableOpacity} from "react-native";
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
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [quality, setQuality] = useState(null);

  const readFile = async (uri) => {
    try {
      const file = await RNFS.readFile(uri, 'base64');
      return file;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (result) => {
    // Leer el archivo de imagen y convertirlo a base64
    const file = await readFile(result.uri);
    // Subir la imagen a Supabase
    try {
      const { body } = await supabase.from('avatars').insert({
        file_name: 'image.jpg',
        file_type: 'image/jpeg',
        file_size: file.length,
        file_data: file,
      });
      console.log(body);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  async function pickImage() {
    // Use the JS library to download a file.
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        uploadImage(result);
        console.log(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function insertData() {
    const userId = await AsyncStorage.getItem('user_id');
    const { data, error } = await supabase
    .from('wellness')
    .insert([
      { user_id: userId, estadoAnimo: status, calidadSueño: quality, imageUrl: 'test' },
    ])
  }

  return (
    <Layout>
      <TopNav
        middleContent="Home"
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
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
          <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Wellness
            </Text>
            <Text>Estado de ánimo</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Introduce tu estado de ánimo"
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setStatus(text)}
            />

            <Text style={{ marginTop: 15 }}>Calidad del sueño</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Introduce tu calidad de sueño"
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setQuality(text)}
            />

            <Text style={{ marginTop: 15 }}>Foto de tu jeto</Text>
            {/* <TouchableOpacity onPress={async() => {pickImage(); if(response?.imageData){setImage(response.uri); setImageData(response?.imageData);}}}> */}
            <Button

              text={"asdasd"}
              onPress={() => {
                pickImage();
              }}
              style={{
                marginTop: 20,
              }}
            />
            <Text style={{ marginTop: 15 }}> Pick an image from camera roll </Text>
            {/* </TouchableOpacity> */}
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 15 }} />}
            <Button

              text={"Enviar"}
              onPress={() => {
                insertData();
              }}
              style={{
                marginTop: 20,
              }}
            />
            
            <Button
              status="danger"
              text="Logout"
              onPress={async () => {
                const { error } = await supabase.auth.signOut();
                if (!error) {
                  alert("Signed out!");
                }
                if (error) {
                  alert(error.message);
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
