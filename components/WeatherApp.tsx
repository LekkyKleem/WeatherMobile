import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import Weather from './Weather'; // Импорт компонента Weather

const WeatherApp = () => {
  const [activeTab, setActiveTab] = useState<'today' | '3days' | '5days' | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      const apiKey = 'be61ea39971b82e35e204c4252d8c13e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`
      );

      if (!response.ok) throw new Error('Город не найден');

      const weatherData = await response.json();
      setData(weatherData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌤️</Text> {/* Логотип погоды, можно заменить на изображение */}
        
        <View style={styles.nav}>
          <Button
            title="Сегодня"
            onPress={() => setActiveTab('today')}
            color={activeTab === 'today' ? 'blue' : 'gray'}
          />
          <Button
            title="На 3 дня"
            onPress={() => setActiveTab('3days')}
            color={activeTab === '3days' ? 'blue' : 'gray'}
          />
          <Button
            title="На 5 дней"
            onPress={() => setActiveTab('5days')}
            color={activeTab === '5days' ? 'blue' : 'gray'}
          />
        </View>

        <View style={styles.search}>
          <TextInput
            style={styles.input}
            placeholder="Введите город"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={() => fetchWeather(city)}
          />
          <Button title="Найти" onPress={() => fetchWeather(city)} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!city || !activeTab ? (
          <Text>Выберите город и период на который хотите посмотреть прогноз погоды</Text>
        ) : (
          <>
            {loading && <Text>Загрузка...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {data && (
              <>
                {activeTab === 'today' && <Weather city={city} forecastDays={1} />}
                {activeTab === '3days' && <Weather city={city} forecastDays={3} />}
                {activeTab === '5days' && <Weather city={city} forecastDays={5} />}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  search: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  content: {
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default WeatherApp;
