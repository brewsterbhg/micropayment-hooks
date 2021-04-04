import {
  incrementXP,
  checkLevelUp,
  levelUp,
  experienceUntilLevel,
  percentUntilLevel,
} from './events';

import {
  MicropaymentEvents,
  CallbackEvents,
  InitProps,
  IIndexable,
  EventDetail,
} from './interfaces';
import { MONETIZATION_PROGRESS, REQUIRED_PARAMS } from './constants';

const NO_OP = () => {};

const MicropaymentHooks = (): MicropaymentEvents => {
  let currentXP: number;
  let currentLevel: number;
  let thresholds: Array<number>;
  let multiplier: number;
  let cbs: CallbackEvents = {};
  let active = false;

  /**
   * This function sets up the initial properties, any callback functions,
   * and sets the event listener for the monetizationprogress event
   *
   * @param {Object} params the params for initializing
   * @param {number} params.xp the user's current experience
   * @param {number} params.level the users current level
   * @param {Array} params.levelThresholds the experience thresholds between levels
   * @param {number} [params.multiplier] a multiplier to use when incrementing experience
   * @param {Function} [params.onXPUpdate] optional callback for when experience updates
   * @param {Function} [params.onLevelUp] optional callback for when user levels up
   * @returns {void}
   */
  function init(params: InitProps): void {
    if (!(document as any).monetization) {
      throw new Error('Monetization not initialized');
    }

    // Make sure the required parameters were passed
    for (const key of REQUIRED_PARAMS) {
      if (
        (params as IIndexable)[key] === undefined ||
        (params as IIndexable)[key] === null
      ) {
        throw new Error(`${key} must be provided when initializing!`);
      }
    }

    // Initialize variables
    currentXP = params.xp || 0;
    currentLevel = params.level || 1;
    thresholds = params.levelThresholds;
    multiplier = params.multiplier || 1;
    cbs.onXPUpdate = params.onXPUpdate || NO_OP;
    cbs.onLevelUp = params.onLevelUp || NO_OP;
    active = true;

    startMonetization();
  }

  /**
   * This function is called on every iteration of the monetizationprogress
   * event. It takes in an event object containing the amount received, and
   * the scale (number of places past the decimal for the amount)
   * Read more: https://webmonetization.org/docs/api
   *
   * @param {Object} detail the detail param pulled from the event
   * @param {number} detail.assetScale the scale to use with the amount
   * @param {number} detail.amount the destination amount received
   * @returns {void}
   */
  function updateXP({ detail }: { detail: EventDetail }): void {
    try {
      const { amount, assetScale } = detail;

      currentXP = incrementXP({ assetScale, amount, currentXP, multiplier });
      cbs.onXPUpdate && cbs.onXPUpdate(currentXP);

      if (checkLevelUp(currentXP, thresholds[currentLevel - 1])) {
        currentLevel = levelUp(currentLevel);
        cbs.onLevelUp && cbs.onLevelUp(currentLevel);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * This function calls a helper function that returns the amount of
   * experience needed until the next level
   *
   * @returns {number} the amount needed to reach the next threshold
   */
  function getExperienceToNextLevel(): number {
    return experienceUntilLevel({
      currentLevel,
      currentXP,
      levelThresholds: thresholds,
    });
  }

  /**
   * This function calls a helper function that returns the percentage
   * between the user's current level and the next level
   *
   * @returns {string|number} returns the percentage towards the next threshold
   */
  function getPercentageTowardsLevel(): string | number {
    return percentUntilLevel({
      currentLevel,
      currentXP,
      levelThresholds: thresholds,
    });
  }

  /**
   * This function returns the user's current experience
   *
   * @returns {number} returns the current experience
   */
  function getCurrentXP(): number {
    return currentXP;
  }

  /**
   * This function returns the user's current level
   *
   * @returns {number} the current level
   */
  function getCurrentLevel(): number {
    return currentLevel;
  }

  /**
   * This function adds the monetization progress event listener
   *
   */
  function startMonetization(): void {
    active = true;

    (document as any).monetization.addEventListener(
      MONETIZATION_PROGRESS,
      updateXP
    );
  }

  /**
   * This function removes the monetization progress event listener
   *
   */
  function stopMonetization(): void {
    active = false;

    (document as any).monetization.removeEventListener(
      MONETIZATION_PROGRESS,
      incrementXP
    );
  }

  /**
   * This function returns whether monetization is active
   *
   * @returns {boolean} whether the monetization events are active
   */
  function isActive(): boolean {
    return active;
  }

  /**
   * This function should be called for cleaning up references and
   * event listeners when no longer needed
   *
   */
  function cleanup(): void {
    active = false;
    cbs = null;

    stopMonetization();
  }

  return {
    init,
    getCurrentXP,
    getExperienceToNextLevel,
    getPercentageTowardsLevel,
    getCurrentLevel,
    startMonetization,
    stopMonetization,
    isActive,
    cleanup,
  };
};

export default MicropaymentHooks;
