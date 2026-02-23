import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { clearAllData } from '../services/storage';

const SETTINGS_ITEMS = [
  { id: 'notifications', title: '消息通知', emoji: '🔔', type: 'switch' },
  { id: 'dailyReminder', title: '每日提醒', emoji: '⏰', type: 'switch' },
  { id: 'privacy', title: '隐私政策', emoji: '🔒', type: 'link' },
  { id: 'terms', title: '用户协议', emoji: '📄', type: 'link' },
  { id: 'about', title: '关于我们', emoji: 'ℹ️', type: 'link' },
  { id: 'feedback', title: '意见反馈', emoji: '💬', type: 'link' },
];

const SettingsScreen = () => {
  const { settings, updateSettings } = useApp();

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    await updateSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      '清除数据',
      '确定要清除所有数据吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('成功', '数据已清除');
          },
        },
      ]
    );
  };

  const handleLink = (id) => {
    if (id === 'feedback') {
      Linking.openURL('mailto:support@mindmate.app');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>设置</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>MindMate 用户</Text>
            <Text style={styles.profileSubtext}>记录你的情绪之旅</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用设置</Text>
          <View style={styles.settingsCard}>
            {SETTINGS_ITEMS.slice(0, 2).map((item, index) => (
              <View key={item.id} style={[styles.settingsItem, index < SETTINGS_ITEMS.slice(0, 2).length - 1 && styles.settingsItemBorder]}>
                <View style={styles.settingsLeft}>
                  <Text style={styles.settingsEmoji}>{item.emoji}</Text>
                  <Text style={styles.settingsTitle}>{item.title}</Text>
                </View>
                <Switch
                  value={settings[item.id]}
                  onValueChange={() => handleToggle(item.id)}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={settings[item.id] ? Colors.primary : Colors.textTertiary}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          <View style={styles.settingsCard}>
            {SETTINGS_ITEMS.slice(2).map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.settingsItem, index < SETTINGS_ITEMS.slice(2).length - 1 && styles.settingsItemBorder]}
                onPress={() => handleLink(item.id)}
              >
                <View style={styles.settingsLeft}>
                  <Text style={styles.settingsEmoji}>{item.emoji}</Text>
                  <Text style={styles.settingsTitle}>{item.title}</Text>
                </View>
                <Text style={styles.settingsArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <TouchableOpacity style={styles.dangerCard} onPress={handleClearData}>
            <Text style={styles.dangerEmoji}>🗑️</Text>
            <Text style={styles.dangerText}>清除所有数据</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MindMate v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 OpenWork Studio</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.md, backgroundColor: Colors.surface },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', color: Colors.textPrimary },
  content: { flex: 1, padding: Spacing.md },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, ...Shadows.sm },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  avatarText: { fontSize: FontSizes.xxxl, color: Colors.textOnPrimary, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs },
  profileSubtext: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  settingsCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, ...Shadows.sm },
  settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md },
  settingsItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsEmoji: { fontSize: 20, marginRight: Spacing.md },
  settingsTitle: { fontSize: FontSizes.md, color: Colors.textPrimary },
  settingsArrow: { fontSize: FontSizes.xl, color: Colors.textTertiary },
  dangerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.error, ...Shadows.sm },
  dangerEmoji: { fontSize: 20, marginRight: Spacing.md },
  dangerText: { fontSize: FontSizes.md, color: Colors.error },
  footer: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerText: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  footerSubtext: { fontSize: FontSizes.xs, color: Colors.textTertiary },
});

export default SettingsScreen;
