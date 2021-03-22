import { EventProps } from './interfaces';

/**
 * This function is responsible updating the xp when the monetization API
 * sends a payment update
 *
 * @param {number} assetScale the assetScale returned from monetization API
 * @param {number} amount the amount to increment by
 * @param {number} currentXP the current experience
 * @param {number} multiplier a multiplier for the amount
 *
 * @returns {number} the new xp value
 */
export function incrementXP({
  assetScale,
  amount,
  currentXP,
  multiplier,
}: Partial<EventProps>): number {
  return updateXP({
    xp: currentXP,
    amount: Number(getScaledAmount(amount, assetScale)),
    multiplier,
  });
}

/**
 * This function increments the current xp by a provided amount
 *
 * @param {number} xp the current experience
 * @param {number} amount the amount to add
 * @param {number} multiplier a multiplier for the amount
 *
 * @returns {number} the incremented value
 */
export function updateXP({
  xp,
  amount,
  multiplier,
}: {
  xp: number;
  amount: number;
  multiplier: number;
}): number {
  return (xp += amount * multiplier);
}

/**
 * This function returns experience adjusted to the provided assetScale
 * returned from the web monetization API
 *
 * @param {number} amount the amount
 * @param {number} scale the assetScale returned from monetization API
 *
 * @returns {string} the scaled experience
 */
export function getScaledAmount(amount: number, scale: number): string {
  return (amount * Math.pow(10, -scale)).toFixed(scale);
}

/**
 * This function acts as a predicate to whether or not the experience
 * threshold of the next level has been reached
 *
 * @param {number} currentXP the current experience
 * @param {number} requiredXP the required experience to the next level
 *
 * @returns {boolean}
 */
export function checkLevelUp(currentXP: number, requiredXP: number): boolean {
  return currentXP >= requiredXP;
}

/**
 * This function increments the current level by one
 *
 * @param {number} currentLevel the current level
 *
 * @returns {number} current level incremented by one
 */
export function levelUp(currentLevel: number): number {
  return ++currentLevel;
}

/**
 * This predicate function checks if the user has reached the max level
 *
 * @param {number} currentLevel the current level
 * @param {Array} levelThresholds the thresholds for levels
 *
 * @returns {boolean} true if max level, false otherwise
 */
export function isMaxLevel(
  currentLevel: number,
  levelThresholds: Array<number>
): boolean {
  return currentLevel > levelThresholds.length;
}

/**
 * This function returns the amount of experience needed until next level
 *
 * @param {number} currentLevel the current level
 * @param {number} currentXP experience that has been scaled
 * @param {Array} levelThresholds the thresholds for levels
 *
 * @returns {number} the experience needed until next level
 */
export function experienceUntilLevel({
  currentLevel,
  currentXP,
  levelThresholds,
}: {
  currentLevel: number;
  currentXP: number;
  levelThresholds: Array<number>;
}): number {
  return isMaxLevel(currentLevel, levelThresholds)
    ? 0
    : Number((levelThresholds[currentLevel - 1] - currentXP).toFixed(2));
}

/**
 * This function returns the percentage between the current experience
 * and the next level
 *
 * @param {number} currentLevel the current level
 * @param {number} currentXP experience that has been scaled
 * @param {Array} levelThresholds the thresholds for levels
 *
 * @returns {string | number} the experience needed until next level (as percentage)
 */
export function percentUntilLevel({
  currentLevel,
  currentXP,
  levelThresholds,
}: {
  currentLevel: number;
  currentXP: number;
  levelThresholds: Array<number>;
}): string | number {
  // Return 100 in the case when current XP is 0 or have reached max xp
  if (currentXP === 0 || isMaxLevel(currentLevel, levelThresholds)) {
    return 100;
  }

  // Handle the case for level 1 as there's no previous threshold to calculate from
  if (currentLevel === 1) {
    return (currentXP / levelThresholds[0]) * 100;
  }

  const prevLevel = levelThresholds[currentLevel - 2];
  const currentThreshold = levelThresholds[currentLevel - 1];

  return (
    ((currentXP - prevLevel) / (currentThreshold - prevLevel)) *
    100
  ).toFixed(2);
}
