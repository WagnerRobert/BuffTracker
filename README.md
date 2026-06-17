# Pathfinder Attack Calculator

A lightweight mobile-friendly web app for Pathfinder 1st Edition attack calculations.

## Features
- Enter Base Attack Bonus, attribute modifier, weapon bonus, and misc bonus.
- Add typed buffs and untyped buffs.
- Only the strongest buff of each typed category applies.
- All untyped buffs apply together.
- Shows the resulting attack sequence with iterative penalties.

## Usage
1. Open `index.html` in a browser.
2. Enter your character values.
3. Add buffs with name, bonus, type, and mark "Untyped" if needed.
4. The app updates total bonus and attack values automatically.

## Notes
- Typed buffs with the same type only apply the highest bonus.
- Untyped buffs stack normally.

## Development
No build tools are required. Open the file directly in a browser or use a local web server if you prefer.
