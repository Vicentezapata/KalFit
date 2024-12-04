import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Text, Button } from 'react-native-paper';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({});
  const [weights, setWeights] = useState([]);
  const [lastGoal, setLastGoal] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const db = getDatabase();

    // Fetch profile data
    const profileRef = ref(db, 'profile');
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfile(data);
      }
    });

    // Fetch weights data
    const weightsRef = ref(db, 'weights');
    onValue(weightsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          date: new Date(data[key].date),
        }));
        const sortedData = formattedData.sort((a, b) => b.date - a.date);
        setWeights(sortedData.slice(0, 5));
      }
    });

    // Fetch last goal data
    const goalsRef = ref(db, 'goals');
    onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const lastGoal = formattedData[formattedData.length - 1];
        setLastGoal(lastGoal);
      }
    });

    // Fetch notifications data
    const notificationsRef = ref(db, 'notifications');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        const sortedData = formattedData.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(sortedData.slice(0, 5));
      }
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.header}>Bienvenido</Title>
      
      <View style={styles.row}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image source={require('../assets/Profile.png')} style={styles.image} />
            <View style={styles.cardText}>
              <Title style={styles.sectionHeader}>Información Personal</Title>
              <Text style={styles.centeredText}>Nombre: {profile.name}</Text>
              <Text style={styles.centeredText}>Edad: {profile.age}</Text>
              <Text style={styles.centeredText}>Sexo: {profile.sex}</Text>
              <Text style={styles.centeredText}>Altura: {profile.height} cm</Text>
              <Text style={styles.centeredText}>Peso: {profile.weight} kg</Text>
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} style={styles.button}>
              Editar Perfil
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image source={require('../assets/Push.png')} style={styles.image} />
            <View style={styles.cardText}>
              <Title style={styles.sectionHeader}>Notificaciones</Title>
              {notifications.length === 0 ? (
                <Text style={styles.centeredText}>No hay notificaciones configuradas.</Text>
              ) : (
                notifications.map((item, index) => (
                  <Text key={index} style={styles.centeredText}>
                    {item.reminderType} a las {item.time}
                  </Text>
                ))
              )}
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('Settings')} style={styles.button}>
              Configurar Notificaciones
            </Button>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.row}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image source={require('../assets/Height.png')} style={styles.image} />
            <View style={styles.cardText}>
              <Title style={styles.sectionHeader}>Historial de Peso</Title>
              {weights.length === 0 ? (
                <Text style={styles.centeredText}>No hay registros de peso.</Text>
              ) : (
                weights.map((item, index) => (
                  <Text key={index} style={styles.centeredText}>
                    {item.date.toLocaleDateString()}: {item.weight} kg
                  </Text>
                ))
              )}
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('RegisterWeight')} style={styles.button}>
              Registrar peso
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Image source={require('../assets/Healthy.png')} style={styles.image} />
            <View style={styles.cardText}>
              <Title style={styles.sectionHeader}>Objetivos de Salud</Title>
              {lastGoal ? (
                <>
                  <Text style={styles.centeredText}>Objetivo: {lastGoal.goal}</Text>
                  <Text style={styles.centeredText}>Meta: {lastGoal.target}</Text>
                </>
              ) : (
                <Text style={styles.centeredText}>No hay objetivos establecidos.</Text>
              )}
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('Goals')} style={styles.button}>
              Ver y Establecer Objetivos
            </Button>
          </Card.Content>
        </Card>
      </View>


          <Button mode="contained" onPress={() => navigation.navigate('FoodLog')} style={styles.button}>
            Registrar Alimentos
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('History')} style={styles.button}>
            Ver Historial de Alimentos consumidos
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('Education')} style={styles.button}>
            Educación
          </Button>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});