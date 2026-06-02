import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { calculateBowlingScore, validateFrames } from '../utils/scoring';
import { FrameInput } from '../types';

const initialFrames: FrameInput[] = Array.from({ length: 10 }, (_, index) => ({
  rolls: index === 9 ? ['', '', ''] : ['', ''],
}));

const frameLabel = (index: number) => `Frame ${index + 1}`;

const ScoreSheet = () => {
  const [frames, setFrames] = useState<FrameInput[]>(initialFrames);

  const validationMessage = useMemo(() => validateFrames(frames), [frames]);
  const { total, frameScores } = useMemo(() => calculateBowlingScore(frames), [frames]);

  const updateRoll = (frameIndex: number, rollIndex: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    const nextFrames = frames.map((frame, index) => ({
      rolls: [...frame.rolls],
    }));
    nextFrames[frameIndex].rolls[rollIndex] = sanitized;
    setFrames(nextFrames);
  };

  const reset = () => {
    setFrames(initialFrames);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Text style={styles.title}>Bowling Score Tracker</Text>
      <Text style={styles.subtitle}>Enter pin counts for each frame below.</Text>
      <View style={styles.gridHeader}>
        <Text style={styles.headerCell}>Frame</Text>
        <Text style={styles.headerCell}>Roll 1</Text>
        <Text style={styles.headerCell}>Roll 2</Text>
        <Text style={styles.headerCell}>Roll 3</Text>
        <Text style={styles.headerCell}>Frame Total</Text>
      </View>

      {frames.map((frame, frameIndex) => {
        const isTenth = frameIndex === 9;
        const frameScore = frameScores[frameIndex]?.cumulative ?? 0;
        return (
          <View key={frameIndex} style={styles.frameRow}>
            <Text style={styles.frameCell}>{frameLabel(frameIndex)}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={frame.rolls[0]}
              onChangeText={(text) => updateRoll(frameIndex, 0, text)}
              placeholder="0"
              maxLength={2}
            />
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={frame.rolls[1]}
              onChangeText={(text) => updateRoll(frameIndex, 1, text)}
              placeholder="0"
              maxLength={2}
            />
            {isTenth ? (
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={frame.rolls[2]}
                onChangeText={(text) => updateRoll(frameIndex, 2, text)}
                placeholder="0"
                maxLength={2}
              />
            ) : (
              <View style={styles.inputPlaceholder} />
            )}
            <Text style={styles.scoreCell}>{frameScore}</Text>
          </View>
        );
      })}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Score</Text>
        <Text style={styles.summaryValue}>{validationMessage ? '--' : total}</Text>
        {validationMessage ? <Text style={styles.validation}>{validationMessage}</Text> : null}
      </View>

      <TouchableOpacity onPress={reset} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Reset Sheet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#eef3fb',
  },
  pageContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
    color: '#4b5563',
  },
  gridHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#cbd5e1',
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    color: '#334155',
  },
  frameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  frameCell: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  input: {
    flex: 1,
    minWidth: 48,
    height: 42,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
  },
  inputPlaceholder: {
    flex: 1,
    minWidth: 48,
  },
  scoreCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
  },
  summaryCard: {
    marginTop: 18,
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  validation: {
    marginTop: 10,
    color: '#b91c1c',
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ScoreSheet;
