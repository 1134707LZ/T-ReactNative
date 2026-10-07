import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors } from '../theme';

const MEMBERS = [
  { name: 'Vinícius Galvani', ra: '1137277' },
  { name: 'Lucas Albigo Zílio', ra: '1134707' },
  { name: 'Anderson Tavares Silva', ra: '1134877' },
   { name: 'Ricardo Marin', ra: '1130644' },
   { name: 'Artur Machado', ra: '1135566' },
];

export default function GroupInfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        Aplicativo desenvolvido em React Native com Expo para a disciplina, consumindo
        dados da API DummyJSON. Ele conta com autenticação, listagem de produtos com
        filtro por categoria e tela de detalhes.
      </Text>

      <Text style={styles.sectionTitle}>Integrantes</Text>

      <FlatList
        data={MEMBERS}
        keyExtractor={(item) => item.ra}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.ra}>RA: {item.ra}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  ra: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});
