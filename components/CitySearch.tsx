import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const API_KEY = 'be61ea39971b82e35e204c4252d8c13e';

interface CitySearchProps {
  onCitySelect: (city: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (text: string) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=10&lang=ru&appid=${API_KEY}`
      );
      const data: any[] = await response.json();
      setSuggestions(data.map((item) => item.local_names?.ru || item.name));
    } catch (error) {
      console.error('Ошибка загрузки подсказок:', error);
    }
  };

  const handleChange = (text: string) => {
    setQuery(text);
    fetchSuggestions(text);
  };

  const handleSelect = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    onCitySelect(city);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введите город"
        value={query}
        onChangeText={handleChange}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default CitySearch;
