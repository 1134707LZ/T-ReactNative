import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function HeaderButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.white,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
