import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { saveEmotionRecord, getEmotionRecords, deleteEmotionRecord } from '../services/storage';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const EMOTIONS = [
  { key: 'happy', label: '开心', emoji: '😊', color: Colors.emotions.happy },
  { key: 'sad', label: '难过', emoji: '😢', color: Colors.emotions.sad },
  { key: 'anxious', label: '焦虑', emoji: '😰', color: Colors.emotions.anxious },
  { key: 'angry', label: '生气', emoji: '😠', color: Colors.emotions.angry },
  { key: 'neutral', label: '平静', emoji: '😐', color: Colors.emotions.neutral },
  { key: 'excited', label: '兴奋', emoji: '🤩', color: Colors.emotions.excited },
];

const DiaryScreen = () => {
  const { emotionRecords, setEmotionRecords, refreshData } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const handleSaveEmotion = async () => {
    if (!selectedEmotion) {
      Alert.alert('提示', '请选择一个情绪');
      return;
    }

    const record = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      intensity: intensity,
      note: note.trim(),
      triggers: triggers.split(',').map(t => t.trim()).filter(t => t),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await saveEmotionRecord(record);
    refreshData();
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedEmotion(null);
    setIntensity(5);
    setNote('');
    setTriggers('');
  };

  const handleDelete = async (id) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await deleteEmotionRecord(id);
            refreshData();
          },
        },
      ]
    );
  };

  const getEmotionInfo = (emotionKey) => {
    return EMOTIONS.find(e => e.key === emotionKey) || EMOTIONS[4];
  };

  const renderEmotionRecord = (record) => {
    const emotionInfo = getEmotionInfo(record.emotion);
    
    return (
      <View key={record.id} style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <View style={[styles.emotionBadge, { backgroundColor: emotionInfo.color }]}>
            <Text style={styles.emotionEmoji}>{emotionInfo.emoji}</Text>
            <Text style={styles.emotionLabel}>{emotionInfo.label}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(record.id)}>
            <Text style={styles.deleteButton}>删除</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>情绪强度：</Text>
          <View style={styles.intensityBar}>
            <View style={[styles.intensityFill, { width: `${record.intensity * 10}%`, backgroundColor: emotionInfo.color }]} />
          </View>
          <Text style={styles.intensityValue}>{record.intensity}/10</Text>
        </View>

        {record.note && (
          <Text style={styles.noteText}>{record.note}</Text>
        )}

        {record.triggers && record.triggers.length > 0 && (
          <View style={styles.triggersContainer}>
            {record.triggers.map((trigger, index) => (
              <View key={index} style={styles.triggerTag}>
                <Text style={styles.triggerText}>{trigger}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.recordDate}>
          {format(new Date(record.date), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>情绪日记</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ 记录</Text>
        </TouchableOpacity>
      </View>

      {/* Records */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {emotionRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>还没有情绪记录</Text>
            <Text style={styles.emptySubtext}>点击右上角记录今天的心情</Text>
          </View>
        ) : (
          emotionRecords.map(renderEmotionRecord)
        )}
      </ScrollView>

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
              <Text style={styles.cancelButton}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>记录情绪</Text>
            <TouchableOpacity onPress={handleSaveEmotion}>
              <Text style={styles.saveButton}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Emotion Selection */}
            <Text style={styles.sectionTitle}>今天感觉如何？</Text>
            <View style={styles.emotionGrid}>
              {EMOTIONS.map((emotion) => (
                <TouchableOpacity
                  key={emotion.key}
                  style={[
                    styles.emotionOption,
                    selectedEmotion === emotion.key && { backgroundColor: emotion.color, borderColor: emotion.color },
                  ]}
                  onPress={() => setSelectedEmotion(emotion.key)}
                >
                  <Text style={styles.emotionOptionEmoji}>{emotion.emoji}</Text>
                  <Text style={[
                    styles.emotionOptionLabel,
                    selectedEmotion === emotion.key && styles.emotionOptionLabelSelected,
                  ]}>
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Intensity */}
            <Text style={styles.sectionTitle}>情绪强度：{intensity}/10</Text>
            <View style={styles.intensitySelector}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.intensityButton,
                    intensity >= num && styles.intensityButtonActive,
                  ]}
                  onPress={() => setIntensity(num)}
                >
                  <Text style={[styles.intensityButtonText, intensity >= num && styles.intensityButtonTextActive]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <Text style={styles.sectionTitle}>写下今天的故事</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="今天发生了什么？"
              placeholderTextColor={Colors.placeholder}
              multiline
              value={note}
              onChangeText={setNote}
            />

            {/* Triggers */}
            <Text style={styles.sectionTitle}>触发因素（用逗号分隔）</Text>
            <TextInput
              style={styles.triggerInput}
              placeholder="例如：工作、学习、人际关系"
              placeholderTextColor={Colors.placeholder}
              value={triggers}
              onChangeText={setTriggers}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  addButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  recordCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  emotionEmoji: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.xs,
  },
  emotionLabel: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  deleteButton: {
    color: Colors.error,
    fontSize: FontSizes.sm,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  intensityLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  intensityBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  intensityFill: {
    height: '100%',
    borderRadius: 4,
  },
  intensityValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  noteText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  triggerTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  triggerText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
  },
  recordDate: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cancelButton: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  saveButton: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionOption: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  emotionOptionEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  emotionOptionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  emotionOptionLabelSelected: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  intensitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intensityButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  intensityButtonText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  intensityButtonTextActive: {
    color: Colors.textOnPrimary,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  triggerInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
});

export default DiaryScreen;
