import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, Card, Text } from 'react-native-paper';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import swal from 'sweetalert';
import { database } from '../firebaseConfig';

export default function SettingsScreen() {
  const [reminderType, setReminderType] = useState('');
  const [time, setTime] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const notificationsRef = ref(db, 'notifications');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setNotifications(formattedData);
      }
    });
  }, []);

  const handleAddNotification = () => {
    let newErrors = {};

    if (!reminderType) newErrors.reminderType = 'El tipo de recordatorio es obligatorio.';
    if (!time) newErrors.time = 'La hora es obligatoria.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const db = getDatabase();
    const notificationsRef = ref(db, 'notifications');
    const newNotification = {
      reminderType,
      time,
    };

    push(notificationsRef, newNotification)
      .then(() => {
        setReminderType('');
        setTime('');
        setErrors({});
        swal({
          title: "Notificación añadida",
          text: "La notificación ha sido añadida exitosamente.",
          icon: "success",
          button: "OK",
        });
      })
      .catch((error) => {
        console.error('Error adding notification:', error);
        swal({
          title: "Error",
          text: "Hubo un error al añadir la notificación.",
          icon: "error",
          button: "OK",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Configurar Recordatorios</Title>
          <TextInput
            label="Tipo de Recordatorio"
            value={reminderType}
            onChangeText={setReminderType}
            style={styles.input}
            mode="outlined"
            error={!!errors.reminderType}
          />
          {errors.reminderType && <Text style={styles.errorText}>{errors.reminderType}</Text>}
          <TextInput
            label="Hora"
            value={time}
            onChangeText={setTime}
            style={styles.input}
            mode="outlined"
            error={!!errors.time}
          />
          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
          <Button mode="contained" onPress={handleAddNotification} style={styles.button}>
            Añadir Recordatorio
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Notificaciones Configuradas</Title>
          {notifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No hay notificaciones configuradas.</Text>
          ) : (
            notifications.map((item, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationText}>Tipo: {item.reminderType}</Text>
                <Text style={styles.notificationText}>Hora: {item.time}</Text>
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
  noNotificationsText: {
    textAlign: 'center',
    color: '#888',
  },
  notificationItem: {
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});