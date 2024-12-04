import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

export default function RegisterWeightScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [weights, setWeights] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const weightsRef = ref(db, 'weights');
    onValue(weightsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          date: new Date(data[key].date),
        }));
        setWeights(formattedData);
      }
    });
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleAddWeight = () => {
    let newErrors = {};

    if (!weight) newErrors.weight = 'El peso es obligatorio.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const weightsRef = ref(db, 'weights');
    const newWeight = {
      weight,
      date: date.toISOString(),
    };

    push(weightsRef, newWeight)
      .then(() => {
        setWeight('');
        setErrors({});
        swal({
          title: "Peso añadido",
          text: "El peso ha sido añadido exitosamente.",
          icon: "success",
          button: "OK",
        });
      })
      .catch((error) => {
        console.error('Error adding weight:', error);
        swal({
          title: "Error",
          text: "Hubo un error al añadir el peso.",
          icon: "error",
          button: "OK",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Registrar Peso</Title>
          <Button mode="contained" onPress={showDatePicker} style={styles.button}>
            Seleccionar Fecha
          </Button>
          <Text style={styles.dateText}>Fecha: {date.toLocaleDateString()}</Text>
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
          <Button mode="contained" onPress={handleAddWeight} style={styles.button}>
            Añadir Peso
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Historial de Peso</Title>
          {weights.length === 0 ? (
            <Text style={styles.noWeightsText}>No hay registros de peso.</Text>
          ) : (
            weights.map((item, index) => (
              <View key={index} style={styles.weightItem}>
                <Text style={styles.weightText}>Fecha: {item.date.toLocaleDateString()}</Text>
                <Text style={styles.weightText}>Peso: {item.weight} kg</Text>
              </View>
            ))
          )}
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
  button: {
    marginTop: 10,
  },
  dateText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  noWeightsText: {
    textAlign: 'center',
    color: '#888',
  },
  weightItem: {
    marginBottom: 10,
  },
  weightText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});