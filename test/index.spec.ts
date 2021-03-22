import RankedProfile from '../src/index';
import { MicropaymentEvents } from '../src/interfaces';

const TEST_XP = 10;
const TEST_LEVEL = 1;
const TEST_THRESHOLDS = [20, 50, 100];
const EVENT_PROGRESS = 'monetizationprogress';

const globalDocument = window.document as any;

describe('index', () => {
  let rp: MicropaymentEvents;

  const initParams = {
    xp: TEST_XP,
    level: TEST_LEVEL,
    levelThresholds: TEST_THRESHOLDS,
    assetScale: 1,
    amount: 0,
    currentXP: 0,
  };

  beforeEach(() => {
    rp = RankedProfile();

    globalDocument.monetization = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    it('returns undefined when monetization is not initialized', () => {
      globalDocument.monetization = null;

      expect(() => {
        rp.init(null);
      }).toThrowError('Monetization not initialized');
    });

    it('returns undefined when not provided with xp', () => {
      expect(() => {
        rp.init({
          ...initParams,
          xp: null,
        });
      }).toThrowError('xp must be provided when initializing!');
    });

    it('returns undefined when not provided with level', () => {
      expect(() => {
        rp.init({
          ...initParams,
          level: null,
        });
      }).toThrowError('level must be provided when initializing!');
    });

    it('returns undefined when not provided with levelThresholds', () => {
      expect(() => {
        rp.init({
          ...initParams,
          levelThresholds: null,
        });
      }).toThrowError('levelThresholds must be provided when initializing!');
    });

    it('correctly initializes when provided with correct params', () => {
      const windowSpy = globalDocument.monetization.addEventListener;

      rp.init({
        ...initParams,
      });

      expect(windowSpy).toHaveBeenCalled();
      expect(windowSpy.mock.calls[0][0]).toBe(EVENT_PROGRESS);
    });
  });

  describe('getExperienceToNextLevel', () => {
    it('correctly returns experience until the next level', () => {
      rp.init({ ...initParams });

      const expected = 10;
      const actual = rp.getExperienceToNextLevel();

      expect(actual).toBe(expected);
    });
  });

  describe('getPercentageTowardsLevel', () => {
    it('correctly returns percentage towards the next level', () => {
      rp.init({ ...initParams });

      const expected = 50;
      const actual = rp.getPercentageTowardsLevel();

      expect(actual).toBe(expected);
    });
  });

  describe('getCurrentXP', () => {
    it('returns the current experience', () => {
      rp.init({ ...initParams });

      const expected = 10;
      const actual = rp.getCurrentXP();

      expect(actual).toBe(expected);
    });
  });

  describe('getCurrentLevel', () => {
    it('returns the current level', () => {
      rp.init({ ...initParams });

      const expected = TEST_LEVEL;
      const actual = rp.getCurrentLevel();

      expect(actual).toBe(expected);
    });
  });

  describe('startMonetization', () => {
    it('adds the monetization start event listener', () => {
      const windowSpy = globalDocument.monetization.addEventListener;

      rp.startMonetization();

      expect(windowSpy).toHaveBeenCalled();
      expect(windowSpy.mock.calls[0][0]).toBe(EVENT_PROGRESS);
    });
  });

  describe('stopMonetization', () => {
    it('removes the moneitzationprogress event listener', () => {
      const windowSpy = globalDocument.monetization.removeEventListener;

      rp.stopMonetization();

      expect(windowSpy).toHaveBeenCalled();
      expect(windowSpy.mock.calls[0][0]).toBe(EVENT_PROGRESS);
    });
  });

  describe('isActive', () => {
    it('returns true when monetization is active', () => {
      rp.startMonetization();

      const expected = true;
      const actual = rp.isActive();

      expect(actual).toBe(expected);
    });

    it('returns false when monetization is not active', () => {
      rp.stopMonetization();

      const expected = false;
      const actual = rp.isActive();

      expect(actual).toBe(expected);
    });
  });

  describe('cleanup', () => {
    it('removes the moneitzationprogress event listener', () => {
      const windowSpy = globalDocument.monetization.removeEventListener;

      rp.cleanup();

      expect(windowSpy).toHaveBeenCalled();
      expect(windowSpy.mock.calls[0][0]).toBe(EVENT_PROGRESS);
    });
  });
});
