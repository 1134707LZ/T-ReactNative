import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { getProductById, getErrorMessage, formatCategory } from '../services/api';
import { formatPrice } from '../utils/formatPrice';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import { colors } from '../theme';

export default function ProductDetailsScreen({ route }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        if (!data) throw new Error('not-found');
        if (active) setProduct(data);
      } catch (err) {
        if (active) {
          const message = getErrorMessage(err, 'Produto não encontrado.');
          setError(message);
          Alert.alert('Erro', message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (loading) return <Loading message="Carregando detalhes..." />;
  if (error || !product) {
    return <ErrorView message={error} onRetry={() => setReloadKey((k) => k + 1)} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageBox}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={styles.category}>{formatCategory(product.category)}</Text>
      <Text style={styles.name}>{product.title}</Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  imageBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 260,
  },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
