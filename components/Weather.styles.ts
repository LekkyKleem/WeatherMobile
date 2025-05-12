import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  temp: {
    fontSize: 16,
  },
  icon: {
    width: 50,
    height: 50,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});
