import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';

const MEDITATIONS = [
  { id: '1', type: 'breathing', title: '深呼吸放松', duration: '3分钟', emoji: '🌬️', color: '#81D4FA' },
  { id: '2', type: 'breathing', title: '4-7-8呼吸法', duration: '5分钟', emoji: '😌', color: '#A5D6A7' },
  { id: '3', type: 'meditation', title: '正念冥想', duration: '10分钟', emoji: '🧘', color: '#CE93D8' },
  { id: '4', type: 'meditation', title: '身体扫描', duration: '15分钟', emoji: '✨', color: '#FFAB91' },
  { id: '5', type: 'story', title: '雨声放松', duration: '20分钟', emoji: '🌧️', color: '#90CAF9' },
  { id: '6', type: 'story', title: '海浪声', duration: '20分钟', emoji: '🌊', color: '#80DEEA' },
  { id: '7', type: 'sound', title: '森林鸟鸣', duration: '15分钟', emoji: '🌲', color: '#AED581' },
  { id: '8', type: 'sound', title: '篝火声', duration: '15分钟', emoji: '🔥', color: '#FF8A65' },
];

const CATEGORIES = [
  { key: 'all', label: '全部', emoji: '🎵' },
  { key: 'breathing', label: '呼吸', emoji: '🌬️' },
  { key: 'meditation', label: '冥想', emoji: '🧘' },
  { key: 'story', label: '自然', emoji: '🌿' },
  { key: 'sound', label: '白噪音', emoji: '🔊' },
];

const MeditationScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>冥想放松</Text>
        <Text style={styles.headerSubtitle}>给自己一个放松的时刻</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured */}
        <View style={styles.featuredCard}>
          <Text style={styles.featuredEmoji}>🧘</Text>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>每日正念</Text>
            <Text style={styles.featuredText}>每天10分钟，找到内心的平静</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(category => (
            <TouchableOpacity key={category.key} style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meditation List */}
        <Text style={styles.sectionTitle}>推荐内容</Text>
        <View style={styles.meditationGrid}>
          {MEDITATIONS.map(item => (
            <TouchableOpacity key={item.id} style={[styles.meditationCard, { backgroundColor: item.color }]}>
              <Text style={styles.meditationEmoji}>{item.emoji}</Text>
              <Text style={styles.meditationTitle}>{item.title}</Text>
              <Text style={styles.meditationDuration}>{item.duration}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 冥想小贴士</Text>
          <Text style={styles.tipsText}>
            找一个安静的角落，坐下或躺下，闭上眼睛，专注于呼吸。让身体逐渐放松，感受当下的平静。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.md, backgroundColor: Colors.surface },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.textPrimary },
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  content: { flex: 1, padding: Spacing.md },
  featuredCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  featuredEmoji: { fontSize: 48, marginRight: Spacing.md },
  featuredContent: { flex: 1 },
  featuredTitle: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.xs },
  featuredText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.lg },
  categoryItem: { alignItems: 'center' },
  categoryEmoji: { fontSize: 28, marginBottom: Spacing.xs },
  categoryLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.md },
  meditationGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  meditationCard: { width: '48%', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  meditationEmoji: { fontSize: 32, marginBottom: Spacing.sm },
  meditationTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs },
  meditationDuration: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  tipsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.xl, ...Shadows.sm },
  tipsTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm },
  tipsText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});

export default MeditationScreen;
