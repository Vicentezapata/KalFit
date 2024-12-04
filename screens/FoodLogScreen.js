import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

export default function FoodLogScreen() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const navigation = useNavigation();

  const handleAddFood = () => {
    const newFood = {
      name: food,
      calories: parseInt(calories),
      date: new Date().toLocaleDateString(),
    };
    console.log('Adding food:', newFood);

    const db = getDatabase();
    const foodLogRef = ref(db, 'foodLog');
    push(foodLogRef, newFood)
      .then(() => {
        console.log('Food added successfully');
        setFood('');
        setCalories('');
        swal({
          title: "Alimento añadido",
          text: "El alimento ha sido añadido exitosamente.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigation.navigate('Profile');
        });
      })
      .catch((error) => {
        console.error('Error adding food:', error);
        swal({
          title: "Error",
          text: "Hubo un error al añadir el alimento.",
          icon: "error",
          button: "OK",
        });
      });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Registrar Alimento</Title>
          <TextInput
            label="Alimento"
            value={food}
            onChangeText={setFood}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Calorías"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={handleAddFood} style={styles.button}>
            Añadir Alimento
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
    backgroundColor: '#fff',
  },
  card: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});