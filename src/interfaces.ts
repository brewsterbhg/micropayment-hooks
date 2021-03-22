export interface MicropaymentEvents {
  init: (x: InitProps) => void;
  getCurrentXP: () => number;
  getExperienceToNextLevel: () => number;
  getPercentageTowardsLevel: () => string | number;
  getCurrentLevel: () => number;
  startMonetization: () => void;
  stopMonetization: () => void;
  isActive: () => boolean;
  cleanup: () => void;
}

export interface CallbackEvents {
  onXPUpdate?: (x: number) => void;
  onLevelUp?: (x: number) => void;
}

export interface EventProps {
  assetScale: number;
  amount: number;
  xp: number;
  currentXP: number;
  level: number;
  levelThresholds: Array<number>;
  multiplier?: number;
}

export interface InitProps extends CallbackEvents, EventProps {}

export interface IIndexable {
  [key: string]: any;
}

export interface EventDetail {
  paymentPointer: string;
  requestId: string;
  amount: number;
  assetCode: string;
  assetScale: number;
  receipt: string;
}
