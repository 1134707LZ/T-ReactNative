import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  getProducts,
  getCategories,
  getProductsByCategory,
  getErrorMessage,
  formatCategory,
} from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import { colors } from '../theme';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const data = selectedCategory
          ? await getProductsByCategory(selectedCategory)
          : await getProducts();
        if (active) setProducts(data);
      } catch (err) {
        if (active) {
          const message = getErrorMessage(err, 'Não foi possível carregar os produtos.');
          setError(message);
          Alert.alert('Erro', message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [selectedCategory, reloadKey]);

  function handleSelectCategory(category) {
    setSelectedCategory((current) => (current === category ? null : category));
  }

  function renderProduct({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterBox}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {categories.map((category) => {
            const selected = category === selectedCategory;
            return (
              <Pressable
                key={category}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => handleSelectCategory(category)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {formatCategory(category)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedCategory && (
          <Pressable style={styles.clearButton} onPress={() => setSelectedCategory(null)}>
            <Text style={styles.clearText}>Limpar filtro ✕</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <Loading message="Carregando produtos..." />
      ) : error ? (
        <ErrorView message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum produto encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBox: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  filterRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: colors.white,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 12,
  },
  clearText: {
    color: colors.error,
    fontWeight: '600',
  },
  list: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
  },
});
