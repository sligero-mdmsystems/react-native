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
import blobUtil from 'blob-util';

// import RNFS from 'react-native-fs';
export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [status, setStatus] = useState(null);
  const [quality, setQuality] = useState(null);

  async function pickImage() {
    // Use the JS library to download a file.
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      setImageUrl(result.uri)

      let imageBlob = await new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', result.uri, true);
        xhr.send(null);
    });
    setImage(imageBlob);
    } catch (error) {
      console.log(error);
    }
  }

  async function insertData() {
    const userId = await AsyncStorage.getItem('user_id');
    const { data, error } = await supabase
    .from('wellness')
    .insert([
      { user_id: userId, estadoAnimo: status, calidadSueño: quality, image_url: imageUrl },
    ]);

    const { dataStor, errorStor } = await supabase.storage
    .from('avatars')
    .upload(`public/${imageName}.jpg`, image, {
      cacheControl: '3600',
      upsert: false,
      contentType: "image/jpeg",
    })
    
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

            <Text style={{ marginTop: 15 }}>Nombre de la imagen</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Introduce el nombre de la imagen"
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setImageName(text)}
            />

            <Button
              text={"Escoger Imagen"}
              onPress={() => {
                pickImage();
              }}
              style={{
                marginTop: 20,
              }}
            />
            
            {imageUrl ? <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginTop: 10 }} /> : null}
            <Button

              text={"Enviar"}
              onPress={() => {
                insertData();
              }}
              style={{
                marginTop: 10,
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
