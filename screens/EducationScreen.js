import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, TextInput, Title, DataTable, Button } from 'react-native-paper';

const API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
const SEARCH_API_URL = 'https://trackapi.nutritionix.com/v2/search/instant';
const API_KEY = 'daaa9dd5085af7783c5a0fee620f01c7'; // Reemplaza con tu clave API
const API_ID = 'b2c91645'; // Reemplaza con tu ID de aplicación

const ITEMS_PER_PAGE = 5;

const translationDictionary = {
  apple: 'Manzana',
  banana: 'Banana',
  orange: 'Naranja',
  'chicken breast': 'Pechuga de pollo',
  rice: 'Arroz',
  bread: 'Pan',
  milk: 'Leche',
  eggs: 'Huevos',
  cheese: 'Queso',
  beef: 'Carne de res',
  pork: 'Cerdo',
  fish: 'Pescado',
  potato: 'Papa',
  tomato: 'Tomate',
  lettuce: 'Lechuga',
  carrot: 'Zanahoria',
  broccoli: 'Brócoli',
  spinach: 'Espinaca',
  yogurt: 'Yogur',
  almonds: 'Almendras',
};

export default function EducationScreen() {
  const [foods, setFoods] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'x-app-id': API_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'apple, banana, orange, chicken breast, rice, bread, milk, eggs, cheese, beef, pork, fish, potato, tomato, lettuce, carrot, broccoli, spinach, yogurt, almonds',
          }),
        });
        const data = await response.json();
        setFoods(data.foods);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await fetch(`${SEARCH_API_URL}/?query=${query}`, {
        method: 'GET',
        headers: {
          'x-app-id': API_ID,
          'x-app-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSearchResults(data.common);
      setSearchLoading(false);
      setSearchPage(0); // Reset search page to 0 when new search is performed
    } catch (error) {
      console.error(error);
      setSearchLoading(false);
    }
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, foods.length);

  const searchFrom = searchPage * itemsPerPage;
  const searchTo = Math.min((searchPage + 1) * itemsPerPage, searchResults.length);

  const translateFoodName = (foodName) => {
    return translationDictionary[foodName.toLowerCase()] || foodName;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Tabla nutricional de alimentos</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Alimento</DataTable.Title>
              <DataTable.Title numeric>Calorías</DataTable.Title>
              <DataTable.Title numeric>Porción</DataTable.Title>
            </DataTable.Header>

            {foods.slice(from, to).map((item) => (
              <DataTable.Row key={item.food_name}>
                <DataTable.Cell>{translateFoodName(item.food_name)}</DataTable.Cell>
                <DataTable.Cell numeric>{item.nf_calories}</DataTable.Cell>
                <DataTable.Cell numeric>{item.serving_qty} {item.serving_unit}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(foods.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} de ${foods.length}`}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              showFastPaginationControls
              optionsLabel={'Filas por página'}
            />
          </DataTable>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Buscar Alimentos</Title>
          <TextInput
            mode="outlined"
            placeholder="Buscar..."
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleSearch} loading={searchLoading} style={styles.button}>
            Buscar
          </Button>
          {searchResults.length > 0 && (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Imagen</DataTable.Title>
                <DataTable.Title>Alimento</DataTable.Title>
                <DataTable.Title numeric>Porción</DataTable.Title>
              </DataTable.Header>

              {searchResults.slice(searchFrom, searchTo).map((item) => (
                <DataTable.Row key={item.food_name}>
                  <DataTable.Cell>
                    <Image source={{ uri: item.photo.thumb }} style={styles.image} />
                  </DataTable.Cell>
                  <DataTable.Cell>{translateFoodName(item.food_name)}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.serving_qty} {item.serving_unit}</DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={searchPage}
                numberOfPages={Math.ceil(searchResults.length / itemsPerPage)}
                onPageChange={(page) => setSearchPage(page)}
                label={`${searchFrom + 1}-${searchTo} de ${searchResults.length}`}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showFastPaginationControls
                optionsLabel={'Filas por página'}
              />
            </DataTable>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
});