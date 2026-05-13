'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface CelebrityCardProps {
  name: string;
  profession: string;
  similarity: string;
  iconicLook: string;
  signatureColors: string[];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FBF9F4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Pretendard',
    color: '#2A2A2A',
    marginRight: 8,
  },
  profession: {
    fontSize: 9,
    color: '#888',
    fontFamily: 'Pretendard',
  },
  colorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#fff',
  },
  similarity: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#444',
    fontFamily: 'Pretendard',
    marginBottom: 8,
  },
  iconicBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
  },
  iconicLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginRight: 6,
    marginTop: 1,
  },
  iconicText: {
    fontSize: 9.5,
    color: '#555',
    fontFamily: 'Pretendard',
    lineHeight: 1.5,
    flex: 1,
  },
});

export function CelebrityCard({
  name, profession, similarity, iconicLook, signatureColors,
}: CelebrityCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: signatureColors[0] ?? '#7C3AED' }]}>
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.profession}>{profession}</Text>
        </View>
        <View style={styles.colorDots}>
          {signatureColors.slice(0, 3).map((color, i) => (
            <View key={i} style={[styles.colorDot, { backgroundColor: color }]} />
          ))}
        </View>
      </View>

      <Text style={styles.similarity}>{similarity}</Text>

      <View style={styles.iconicBox}>
        <Text style={styles.iconicLabel}>✨ SIGNATURE LOOK</Text>
        <Text style={styles.iconicText}>{iconicLook}</Text>
      </View>
    </View>
  );
}
