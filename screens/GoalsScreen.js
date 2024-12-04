import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

export default function GoalsScreen() {
  const [goal, setGoal] = useState('');
  const [target, setTarget] = useState('');
  const [goals, setGoals] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const goalsRef = ref(db, 'goals');
    onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setGoals(formattedData);
      }
    });
  }, []);

  const handleAddGoal = () => {
    let newErrors = {};

    if (!goal) newErrors.goal = 'El objetivo es obligatorio.';
    if (!target) newErrors.target = 'La meta es obligatoria.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const goalsRef = ref(db, 'goals');
    const newGoal = {
      goal,
      target,
    };

    push(goalsRef, newGoal)
      .then(() => {
        setGoal('');
        setTarget('');
        setErrors({});
        swal({
          title: "Objetivo añadido",
          text: "El objetivo ha sido añadido exitosamente.",
          icon: "success",
          button: "OK",
        });
      })
      .catch((error) => {
        console.error('Error adding goal:', error);
        swal({
          title: "Error",
          text: "Hubo un error al añadir el objetivo.",
          icon: "error",
          button: "OK",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Establecer Objetivo</Title>
          <TextInput
            label="Objetivo"
            value={goal}
            onChangeText={setGoal}
            style={styles.input}
            mode="outlined"
            error={!!errors.goal}
          />
          {errors.goal && <Text style={styles.errorText}>{errors.goal}</Text>}
          <TextInput
            label="Meta"
            value={target}
            onChangeText={setTarget}
            style={styles.input}
            mode="outlined"
            error={!!errors.target}
          />
          {errors.target && <Text style={styles.errorText}>{errors.target}</Text>}
          <Button mode="contained" onPress={handleAddGoal} style={styles.button}>
            Añadir Objetivo
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Objetivos Establecidos</Title>
          {goals.length === 0 ? (
            <Text style={styles.noGoalsText}>No hay objetivos establecidos.</Text>
          ) : (
            goals.map((item, index) => (
              <View key={index} style={styles.goalItem}>
                <Text style={styles.goalText}>Objetivo: {item.goal}</Text>
                <Text style={styles.goalText}>Meta: {item.target}</Text>
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
  noGoalsText: {
    textAlign: 'center',
    color: '#888',
  },
  goalItem: {
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});