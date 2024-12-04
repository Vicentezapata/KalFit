import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const foodLogRef = ref(db, 'foodLog');
    onValue(foodLogRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupedData = Object.keys(data).reduce((acc, key) => {
          const { date, name, calories } = data[key];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({ name, calories });
          return acc;
        }, {});

        const formattedData = Object.keys(groupedData).map((date) => ({
          date,
          foods: groupedData[date],
        }));

        setHistory(formattedData);
      }
    });
  }, []);

  const calculateTotalCalories = (foods) => {
    return foods.reduce((total, food) => total + food.calories, 0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.header}>Historial de Comidas</Title>
      {history.map((day, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Title style={styles.date}>{day.date}</Title>
            {day.foods.map((food, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodCalories}>{food.calories} calorías</Text>
              </View>
            ))}
            <Text style={styles.totalCalories}>
              Total de calorías: {calculateTotalCalories(day.foods)}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  foodName: {
    fontSize: 16,
  },
  foodCalories: {
    fontSize: 16,
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
});