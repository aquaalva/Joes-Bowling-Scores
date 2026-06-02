import { FrameInput, FrameScore } from '../types';

const parseRoll = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const framesToRolls = (frames: FrameInput[]) => {
  const rolls: number[] = [];
  for (let i = 0; i < frames.length; i += 1) {
    const frame = frames[i];
    const parsed = frame.rolls.map(parseRoll).filter((n): n is number => n !== null);
    rolls.push(...parsed);
  }
  return rolls;
};

export const calculateBowlingScore = (frames: FrameInput[]) => {
  const frameScores: FrameScore[] = [];
  const rolls = framesToRolls(frames);
  let rollIndex = 0;
  let total = 0;

  for (let frameIndex = 0; frameIndex < 10; frameIndex += 1) {
    if (frameIndex === 9) {
      const frameRolls = rolls.slice(rollIndex, rollIndex + 3);
      const frameTotal = frameRolls.reduce((sum, roll) => sum + roll, 0);
      total += frameTotal;
      frameScores.push({ score: frameTotal, cumulative: total });
      break;
    }

    const first = rolls[rollIndex];
    const second = rolls[rollIndex + 1];
    if (first === undefined || second === undefined) {
      frameScores.push({ score: 0, cumulative: total });
      break;
    }

    if (first === 10) {
      const bonusOne = rolls[rollIndex + 1] ?? 0;
      const bonusTwo = rolls[rollIndex + 2] ?? 0;
      const frameScore = 10 + bonusOne + bonusTwo;
      total += frameScore;
      frameScores.push({ score: frameScore, cumulative: total });
      rollIndex += 1;
      continue;
    }

    const frameSum = first + second;
    if (frameSum === 10) {
      const bonus = rolls[rollIndex + 2] ?? 0;
      const frameScore = 10 + bonus;
      total += frameScore;
      frameScores.push({ score: frameScore, cumulative: total });
    } else {
      const frameScore = frameSum;
      total += frameScore;
      frameScores.push({ score: frameScore, cumulative: total });
    }
    rollIndex += 2;
  }

  return { total, frameScores };
};

export const validateFrames = (frames: FrameInput[]) => {
  for (let frameIndex = 0; frameIndex < 9; frameIndex += 1) {
    const frame = frames[frameIndex];
    const first = parseRoll(frame.rolls[0]);
    const second = parseRoll(frame.rolls[1]);

    if (first === null || first < 0 || first > 10) {
      return `Frame ${frameIndex + 1} first roll must be 0-10.`;
    }
    if (first === 10) {
      continue;
    }
    if (second === null || second < 0 || second > 10) {
      return `Frame ${frameIndex + 1} second roll must be 0-10.`;
    }
    if (first + second > 10) {
      return `Frame ${frameIndex + 1} total cannot exceed 10.`;
    }
  }

  const tenth = frames[9].rolls.map(parseRoll);
  const first = tenth[0];
  const second = tenth[1];
  const third = tenth[2];

  if (first === null || first < 0 || first > 10) {
    return 'Frame 10 first roll must be 0-10.';
  }
  if (second === null || second < 0 || second > 10) {
    return 'Frame 10 second roll must be 0-10.';
  }

  if (first === 10) {
    if (third === null || third < 0 || third > 10) {
      return 'Frame 10 third roll must be 0-10 when first roll is a strike.';
    }
    return null;
  }

  if (first + second === 10) {
    if (third === null || third < 0 || third > 10) {
      return 'Frame 10 third roll must be 0-10 when frame is a spare.';
    }
    return null;
  }

  if (third !== null && third !== 0) {
    return 'Frame 10 third roll is only allowed after a strike or spare.';
  }

  if (first + second > 10) {
    return 'Frame 10 first and second roll cannot exceed 10 unless first roll is a strike.';
  }

  return null;
};
