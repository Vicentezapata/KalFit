import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Picker } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const profileRef = ref(db, 'profile');
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name || '');
        setAge(data.age || '');
        setSex(data.sex || '');
        setHeight(data.height || '');
        setWeight(data.weight || '');
      }
    });
  }, []);

  const handleSaveProfile = () => {
    let newErrors = {};

    if (!name) newErrors.name = 'El nombre es obligatorio.';
    if (!age) newErrors.age = 'La edad es obligatoria.';
    if (!sex) newErrors.sex = 'El sexo es obligatorio.';
    if (!height) newErrors.height = 'La altura es obligatoria.';
    if (!weight) newErrors.weight = 'El peso es obligatorio.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const profileRef = ref(db, 'profile');
    const profileData = {
      name,
      age,
      sex,
      height,
      weight,
    };

    set(profileRef, profileData)
      .then(() => {
        swal({
          title: "Perfil guardado",
          text: "El perfil ha sido guardado exitosamente.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigation.goBack();
        });
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        swal({
          title: "Error",
          text: "Hubo un error al guardar el perfil.",
          icon: "error",
          button: "OK",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Editar Perfil</Title>
          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            error={!!errors.name}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput
            label="Edad"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            error={!!errors.age}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Sexo</Text>
            <Picker
              selectedValue={sex}
              onValueChange={(itemValue) => setSex(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Femenino" value="Femenino" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Reservado" value="Reservado" />
            </Picker>
            {errors.sex && <Text style={styles.errorText}>{errors.sex}</Text>}
          </View>
          <TextInput
            label="Altura (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            error={!!errors.height}
          />
          {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
          <TextInput
            label="Peso (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            error={!!errors.weight}
          />
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
          <Button mode="contained" onPress={handleSaveProfile} style={styles.button}>
            Guardar Perfil
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});