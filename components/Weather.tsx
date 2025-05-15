import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './WeatherStyles';

// Типизация данных
type ForecastData = {
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h': number;
  };
};

// Пропс для компонента Weather (передает город и кол-во дней прогноза)
type WeatherProps = {
  city: string;
  forecastDays?: number;
};

// Функция для правильного склонения слова "день"
const getDayWord = (number: number) => {
  if (number % 100 >= 11 && number % 100 <= 14) {
    return 'дней';
  }
  const lastDigit = number % 10;
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
};

// Компонент Weather
const Weather = ({ city, forecastDays = 1 }: WeatherProps) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Функция для запроса данных о погоде
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const apiKey = 'be61ea39971b82e35e204c4252d8c13e';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=ru`
      );

      if (!response.ok) {
        setForecast([]);
        throw new Error('Ошибка при получении данных о погоде');
      }

      const forecastData = await response.json();
      const filteredForecast = forecastData.list.filter(
        (item: ForecastData) => item.dt_txt.includes('12:00:00')
      );

      // Ограничиваем количество дней
      setForecast(filteredForecast.slice(0, forecastDays));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при изменении города или количества дней
  useEffect(() => {
    fetchWeatherData(city);
  }, [city, forecastDays]);

  return (
    <View style={styles.weather}>
      <Text style={styles.header}>Прогноз на {forecastDays} {getDayWord(forecastDays)}</Text>

      {loading && <Text>Загрузка...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Добавляем ScrollView для прокрутки прогноза */}
      <ScrollView contentContainerStyle={styles.forecastCards}>
        {forecast.length === 0 ? (
          <Text>Нет данных для отображения</Text>
        ) : (
          forecast.map((item, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.date}>
                <Text style={styles.bold}>{new Date(item.dt_txt).toLocaleDateString('ru-RU')}</Text>
              </Text>
              <Image
                style={styles.icon}
                source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
              />
              <Text>Температура: {item.main.temp}°C</Text>
              <Text>Ощущается как: {item.main.feels_like}°C</Text>
              <Text>Влажность: {item.main.humidity}%</Text>
              <Text>Скорость ветра: {item.wind.speed} м/с</Text>
              <Text>Описание: {item.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Weather;
