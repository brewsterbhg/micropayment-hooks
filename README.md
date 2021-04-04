<div style="display: flex; align-items: center; justify-content: center;">
<h1>Micropayment Hooks <img src="https://webmonetization.org/img/wm-icon-animated.svg" height="30" /></h1>
</div>

<div align="center">
	<!--<a href="https://www.npmjs.com/package/micropayment-hooks" rel="external" aria-label="NPM package">
	  <img src="https://img.shields.io/npm/v/micropayment-hooks.svg" alt="npm badge" />
	</a>-->
    <img src="https://travis-ci.com/brewsterbhg/micropayment-hooks.svg?branch=master" alt="Travis CI badge">
</div>

## Overview

This library provides a way to hook into dispatched micropayment events in order to create a tiered system where you control what happens after set thresholds have been reached. Experience is determined by the payment amount (which can be controlled with a multiplier). Callback functions are exposed on experience update and level up functions to integrate into your own applications.

## Requirements

Check out the official Web Monetization [Quick Start Guide](https://webmonetization.org/docs/getting-started) to learn how to set up a wallet for receiving payments. This library assumes you have a meta tag with both the `name="moneization"` and `content={your payment pointer}` properties. Example:

```
<meta
  name="monetization"
  content="$wallet.example.com/alice"
>
```

## Installation

```
npm install micropayment-hooks --save
```

## Example

```
const hooks = new MicropaymentHooks();

hooks.init({
    level: 1,
    xp: 0,
    levelThresholds: [10, 20, 50],
    multiplier: 1000,
    onXPUpdate: (xp) => console.log(xp),
    onLevelUp: (level) => console.log(level),
});
```

## Options

| Name            | Type     | Required | Description                                                  |
| --------------- | -------- | -------- | ------------------------------------------------------------ |
| xp              | number   | yes      | The current experience for a user.                           |
| level           | number   | yes      | The current level for a user.                                |
| levelThresholds | [number] | yes      | The experience thresholds needed for each level.             |
| multiplier      | number   | no       | The multiplier for controlling the payment/experience ratio. |
| onXPUpdate      | function | no       | The callback function when experience is updated.            |
| onLevelUp       | function | no       | The callback function when level is updated.                 |

## API

| Name                      | Returns | Description                                                                               |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| init                      | void    | Initialize a new RankedProfile instance.                                                  |
| getCurrentXP              | number  | Returns the user's current experience.                                                    |
| getExperienceToNextLevel  | number  | Returns the amount of experience needed to reach the next level (returns 0 at max level). |
| getPercentageTowardsLevel | number  | Returns the current percentage towards the next level (returns 100 at max level).         |
| getCurrentLevel           | number  | Returns the user's current level.                                                         |
| startMonetization         | void    | Starts the monetization event (called automatically with `init`).                         |
| stopMonetization          | void    | Stops the monetization event (called automatically with `cleanup`).                       |
| isActive                  | boolean | Returns whether a RankedProfile instance has been initialized.                            |
| cleanup                   | void    | Cleanup function to remove event listeners and clean up callbacks.                        |

## Contributing

If you've noticed a bug or have a feature you'd like to suggest, please open a [GitHub Issue](https://github.com/brewsterbhg/ranked-profile/issues). If you would like to contribute to the project, feel free to fork this repo, create a new branch & open a pull request.

## Licence

MIT © [brewsterbhg](https://github.com/brewsterbhg)
