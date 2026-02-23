import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { generateEmotionInsight } from '../services/chatService';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const screenWidth = Dimensions.get('window').width;

const EMOTION_LABELS = {
  happy: '开心',
  sad: '难过',
  anxious: '焦虑',
  angry: '生气',
  neutral: '平静',
  excited: '兴奋',
};

const EMOTION_COLORS = {
  happy: '#4CAF50',
  sad: '#5C6BC0',
  anxious: '#FF9800',
  angry: '#EF5350',
  neutral: '#90A4AE',
  excited: '#FFEB3B',
};

const InsightsScreen = () => {
  const { emotionRecords } = useApp();

  // Calculate emotion distribution
  const emotionDistribution = useMemo(() => {
    if (emotionRecords.length === 0) return [];
    
    const counts = {};
    emotionRecords.forEach(record => {
      counts[record.emotion] = (counts[record.emotion] || 0) + 1;
    });
    
    return Object.entries(counts).map(([emotion, count]) => ({
      name: EMOTION_LABELS[emotion] || emotion,
      count,
      color: EMOTION_COLORS[emotion] || '#999',
      legendFontColor: Colors.textSecondary,
      legendFontSize: 12,
    }));
  }, [emotionRecords]);

  // Calculate weekly data
  const weeklyData = useMemo(() => {
    if (emotionRecords.length === 0) {
      return {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
      };
    }

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const intensityByDay = days.map(day => {
      const dayRecords = emotionRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === day.toDateString();
      });
      
      if (dayRecords.length === 0) return 0;
      
      const avgIntensity = dayRecords.reduce((sum, r) => sum + r.intensity, 0) / dayRecords.length;
      return Math.round(avgIntensity * 10) / 10;
    });

    return {
      labels: days.map(d => format(d, 'EEEEE', { locale: zhCN })),
      datasets: [{ data: intensityByDay }],
    };
  }, [emotionRecords]);

  // Generate AI insight
  const aiInsight = useMemo(() => {
    if (emotionRecords.length === 0) {
      return "还没有足够的情绪数据来生成洞察。试着记录几天的情绪吧！";
    }
    return generateEmotionInsight(emotionRecords);
  }, [emotionRecords]);

  // Statistics
  const stats = useMemo(() => {
    if (emotionRecords.length === 0) {
      return { total: 0, avgIntensity: 0, streak: 0 };
    }

    const total = emotionRecords.length;
    const avgIntensity = emotionRecords.reduce((sum, r) => sum + r.intensity, 0) / total;
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasRecord = emotionRecords.some(record => 
        new Date(record.date).toDateString() === checkDate.toDateString()
      );
      if (hasRecord) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      total,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      streak,
    };
  }, [emotionRecords]);

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(156, 124, 244, ${opacity})`,
    labelColor: () => Colors.textSecondary,
    style: {
      borderRadius: BorderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  if (emotionRecords.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>情绪洞察</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>暂无数据</Text>
          <Text style={styles.emptySubtext}>记录你的情绪，了解自己的内心</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>情绪洞察</Text>
          <Text style={styles.headerSubtitle}>了解你的情绪模式</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>记录次数</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgIntensity}</Text>
            <Text style={styles.statLabel}>平均强度</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>连续天数</Text>
          </View>
        </View>

        {/* AI Insight */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightEmoji}>💡</Text>
            <Text style={styles.insightTitle}>AI 洞察</Text>
          </View>
          <Text style={styles.insightText}>{aiInsight}</Text>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>本周情绪强度</Text>
          <LineChart
            data={weeklyData}
            width={screenWidth - Spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>

        {/* Emotion Distribution */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>情绪分布</Text>
          <PieChart
            data={emotionDistribution}
            width={screenWidth - Spacing.md * 4}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 小贴士</Text>
          <Text style={styles.tipsText}>
            保持记录情绪的习惯可以帮助你更好地了解自己的情绪模式。
            建议每天至少记录一次，持续记录一周后可以看到更准确的洞察。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  insightCard: {
    backgroundColor: Colors.primaryLight,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  insightTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  insightText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  chartTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chart: {
    borderRadius: BorderRadius.lg,
  },
  tipsCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  tipsTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
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
});

export default InsightsScreen;
