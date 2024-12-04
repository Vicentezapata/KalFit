import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, push } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) newErrors.name = 'El nombre es obligatorio.';
    if (!email) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del email es incorrecto.';
    }
    if (!password) newErrors.password = 'La clave es obligatoria.';
    if (!confirmPassword) newErrors.confirmPassword = 'Repetir clave es obligatorio.';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, 'users');
    const newUser = {
      name,
      email,
      password,
    };

    push(usersRef, newUser)
      .then(() => {
        swal({
          title: "Registro exitoso",
          text: "El usuario ha sido registrado exitosamente.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigation.navigate('Login');
        });
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        swal({
          title: "Error",
          text: "Hubo un error al registrar el usuario.",
          icon: "error",
          button: "OK",
        });
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
          <Title style={styles.header}>Regístrate</Title>
          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            error={!!errors.name}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
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
            label="Clave"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            error={!!errors.password}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          <TextInput
            label="Repetir clave"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
          {errors.general && <Text style={styles.error}>{errors.general}</Text>}
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
          >
            Registrarse
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