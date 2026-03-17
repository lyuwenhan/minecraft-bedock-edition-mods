# Chain Mining

A Minecraft Bedrock Edition behavior pack that adds vein mining (chain mining) functionality. Break connected blocks of the same type at once by sneaking while mining.

## Features

- **Vein Mining:** When sneaking and breaking blocks, connected blocks of the same type are mined together
- **Ore Support:** Coal, lapis, iron, copper, gold, redstone, emerald, diamond, quartz, ancient debris, and more
- **Stone Support:** Stone, cobblestone, deepslate, granite, andesite, diorite, sandstone, netherrack, basalt, blackstone, end stone
- **Other Blocks:** Sand, gravel, logs, planks, hay blocks, sculk
- **Tool Compatibility:** Pickaxe (ores/stone), axe (logs/planks), shovel (sand/gravel), hoe (hay blocks/sculk)
- **Enchantment Support:** Fortune, Silk Touch, Unbreaking
- **Drop Logic:** Proper drops and XP for ores, including fortune multipliers

## How to Use

1. **Sneak** (hold the sneak key) while breaking a block
2. Use the correct tool for the block type
3. All connected blocks of the same type within range will be broken at once

## Subpacks

Choose your preferred mining range for stone-type blocks:

| Subpack | Range | Description |
|:-:|:-:|:-:|
| Normal | 0 | No chain mining for stone |
| Break 3×3 stone | 1 | 3×3 area |
| Break 5×5 stone | 2 | 5×5 area |
| Break 7×7 stone | 3 | 7×7 area |
| Break 9×9 stone | 4 | 9×9 area |

Ore vein mining always works for connected ores (up to 1024 blocks per vein).

## Requirements

- Minecraft Bedrock Edition 1.21.0 or later

## Installation

1. Download the `.mcpack` file
2. Open it to import into Minecraft
3. Enable the pack **World Settings -> Behavior Packs**
4. Activate the world with the pack
5. (Optional) Enable a subpack for stone chain mining range

## License

MIT
