import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';

import CitySearch from './CitySearch';
import Weather from './Weather';
const WeatherApp = () => {
  const [activeTab, setActiveTab] = useState<'today' | '3days' | '5days' | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      const apiKey = 'be61ea39971b82e35e204c4252d8c13e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`
      );

      if (!response.ok) {
        setData(null);
        setError('Город не найден');
        throw new Error('Город не найден');
      }

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
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1163/1163660.png' }}
          style={styles.logo}
        />

        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.activeTab]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={styles.tabText}>Сегодня</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === '3days' && styles.activeTab]}
            onPress={() => setActiveTab('3days')}
          >
            <Text style={styles.tabText}>На 3 дня</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === '5days' && styles.activeTab]}
            onPress={() => setActiveTab('5days')}
          >
            <Text style={styles.tabText}>На 5 дней</Text>
          </TouchableOpacity>
        </View>

        <CitySearch
          onCitySelect={(selectedCity) => {
            setCity(selectedCity);
            fetchWeather(selectedCity);
          }}
        />

        <Button title="Найти" onPress={() => fetchWeather(city)} />
      </View>
      <View style={styles.content}>
        {!city || !activeTab ? (
          <Text style={styles.prompt}>
            Выберите город и период на который хотите посмотреть прогноз погоды
          </Text>
        ) : (
          <>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            {data && (
              <>
                {activeTab === 'today' && <Weather city={city} forecastDays={1} />}
                {activeTab === '3days' && <Weather city={city} forecastDays={3} />}
                {activeTab === '5days' && <Weather city={city} forecastDays={5} />}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default WeatherApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eef6ff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 30,
    marginBottom: 15,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  prompt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
