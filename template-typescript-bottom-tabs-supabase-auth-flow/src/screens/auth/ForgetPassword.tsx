import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
	ScrollView,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
	Image,
} from 'react-native';
import { supabase } from '../../initSupabase';
import { AuthStackParamList } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Layout, Text, TextInput, Button } from 'react-native-rapi-ui';

export default function ({
	navigation,
}: StackScreenProps<AuthStackParamList, 'ForgetPassword'>) {
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	async function forget() {
		setLoading(true);
		const { data, error } = await supabase.auth.api.resetPasswordForEmail(
			email
		);
		if (!error) {
			setLoading(false);
			alert('Check your email to reset your password!');
		}
		if (error) {
			setLoading(false);
			alert(error.message);
		}
	}
	return (
		<KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
			<StatusBar style="auto" translucent backgroundColor="#f7f7f7" />
			<Layout>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#f7f7f7',
						}}
					>
						<Image
							resizeMode="contain"
							style={{
								height: 220,
								width: 220,
							}}
							source={require('../../../assets/images/forget.png')}
						/>
					</View>
					<View
						style={{
							flex: 3,
							paddingHorizontal: 20,
							paddingBottom: 20,
							backgroundColor: '#fff',
						}}
					>
						<Text
							size="h3"
							fontWeight="bold"
							style={{
								alignSelf: 'center',
								padding: 30,
							}}
						>
							Forget Password
						</Text>
						<Text>Email</Text>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Enter your email"
							value={email}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="email-address"
							onChangeText={(text) => setEmail(text)}
						/>
						<Button
							text={loading ? 'Loading' : 'Send email'}
							onPress={() => {
								forget();
							}}
							style={{
								marginTop: 20,
							}}
							disabled={loading}
						/>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginTop: 15,
								justifyContent: 'center',
							}}
						>
							<Text size="md">Already have an account?</Text>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('Login');
								}}
							>
								<Text
									size="md"
									fontWeight="bold"
									style={{
										marginLeft: 5,
									}}
								>
									Login here
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</Layout>
		</KeyboardAvoidingView>
	);
}