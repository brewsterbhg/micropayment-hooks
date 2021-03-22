import {
  incrementXP,
  updateXP,
  getScaledAmount,
  checkLevelUp,
  levelUp,
  isMaxLevel,
  experienceUntilLevel,
  percentUntilLevel,
} from '../src/events';

const TEST_XP = 100;
const TEST_AMOUNT = 10;
const TEST_SCALE = 5;
const TEST_LEVEL = 1;
const TEST_THRESHOLDS = [20, 50, 100];

describe('events', () => {
  describe('incrementXP', () => {
    it('updates the scaled xp value', () => {
      const expected = 100.0001;
      const actual = incrementXP({
        assetScale: TEST_SCALE,
        amount: TEST_AMOUNT,
        currentXP: TEST_XP,
        multiplier: 1,
      });

      expect(actual).toBe(expected);
    });
  });

  describe('updateXP', () => {
    it('returns incremented xp', () => {
      const expected = TEST_AMOUNT + TEST_AMOUNT;
      const actual = updateXP({
        xp: TEST_AMOUNT,
        amount: TEST_AMOUNT,
        multiplier: 1,
      });

      expect(actual).toBe(expected);
    });

    it('updates the scaled xp value with a multiplier', () => {
      const expected = 110;
      const actual = updateXP({
        xp: TEST_AMOUNT,
        amount: TEST_AMOUNT,
        multiplier: 10,
      });

      expect(actual).toBe(expected);
    });
  });

  describe('getScaledAmount', () => {
    it('returns an amount scaled to provided assetScale', () => {
      const expected = '0.00010';
      const actual = getScaledAmount(TEST_AMOUNT, TEST_SCALE);

      expect(actual).toBe(expected);
    });
  });

  describe('checkLevelUp', () => {
    it('returns false if it should not progress to next level', () => {
      const expected = false;
      const actual = checkLevelUp(TEST_AMOUNT, 100);

      expect(actual).toBe(expected);
    });

    it('returns true if it should progress to next level', () => {
      const expected = true;
      const actual = checkLevelUp(TEST_AMOUNT, 5);

      expect(actual).toBe(expected);
    });
  });

  describe('levelUp', () => {
    it('returns a level incremented by 1', () => {
      const expected = TEST_LEVEL + 1;
      const actual = levelUp(TEST_LEVEL);

      expect(actual).toBe(expected);
    });
  });

  describe('isMaxLevel', () => {
    it('returns false when user is not max level', () => {
      const expected = false;
      const actual = isMaxLevel(3, [0, 1, 2]);

      expect(actual).toBe(expected);
    });

    it('returns true when user is at max level', () => {
      const expected = true;
      const actual = isMaxLevel(4, [0, 1, 2]);

      expect(actual).toBe(expected);
    });
  });

  describe('experienceUntilLevel', () => {
    it('returns the amount of experience needed until next level', () => {
      const expected = 10;
      const actual = experienceUntilLevel({
        currentLevel: 1,
        currentXP: TEST_AMOUNT,
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });

    it('returns 0 when user is at max xp', () => {
      const expected = 0;
      const actual = experienceUntilLevel({
        currentLevel: 4,
        currentXP: TEST_AMOUNT,
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });
  });

  describe('percentUntilLevel', () => {
    it('returns 100 when current XP is 0', () => {
      const expected = 100;
      const actual = percentUntilLevel({
        currentLevel: TEST_LEVEL,
        currentXP: 0,
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });

    it('returns 100 when user is at max xp', () => {
      const expected = 100;
      const actual = percentUntilLevel({
        currentLevel: 4,
        currentXP: TEST_THRESHOLDS[TEST_THRESHOLDS.length - 1],
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });

    it('returns the percentage until level 2 when level is 1', () => {
      const expected = 50;
      const actual = percentUntilLevel({
        currentLevel: 1,
        currentXP: TEST_AMOUNT,
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });

    it('returns the percentage between current level and next level', () => {
      const expected = 75;
      const actual = percentUntilLevel({
        currentLevel: TEST_LEVEL,
        currentXP: 15,
        levelThresholds: TEST_THRESHOLDS,
      });

      expect(actual).toBe(expected);
    });
  });
});
