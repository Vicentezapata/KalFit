import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />
      <Title style={styles.header}>Bienvenido a KalFit!</Title>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        Iniciar Sesión
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
      >
        Registrarse
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.button}
      >
        Forgot Password
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#efede7',
  },
  logo: {
    width: 500,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});