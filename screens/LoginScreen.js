import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del email es incorrecto.';
    }
    if (!password) newErrors.password = 'La clave es obligatoria.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
          swal({
            title: "Inicio de sesión exitoso",
            text: "Has iniciado sesión exitosamente.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigation.navigate('Profile');
          });
        } else {
          swal({
            title: "Error",
            text: "Credenciales incorrectas.",
            icon: "error",
            button: "OK",
          });
        }
      } else {
        swal({
          title: "Error",
          text: "No se encontraron usuarios registrados.",
          icon: "error",
          button: "OK",
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover 
          source={require('../assets/Register.jpg')} 
          resizeMode="cover"
        />
        <Card.Content>
          <Title style={styles.header}>Ingresa tus credenciales</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            error={!!errors.email}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            error={!!errors.password}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Iniciar Sesión
          </Button>
        </Card.Content>
      </Card>
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
  card: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});