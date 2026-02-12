import {
	EntityComponentTypes,
	EquipmentSlot,
	GameMode,
	ItemComponentTypes,
	ItemStack,
	system,
	world
} from "@minecraft/server";
import {
	DISTANCE
} from "./d.js";
import {
	MAX_SIZE
} from "./s.js";
let random = (s2, t) => Math.floor(Math.random() * (t - s2 + 1)) + s2,
	tiers = {
		"minecraft:wooden_pickaxe": 1,
		"minecraft:stone_pickaxe": 2,
		"minecraft:copper_pickaxe": 2,
		"minecraft:iron_pickaxe": 3,
		"minecraft:golden_pickaxe": 1,
		"minecraft:diamond_pickaxe": 4,
		"minecraft:netherite_pickaxe": 4
	},
	dropData = {
		"minecraft:coal_ore": {
			drop: "minecraft:coal",
			fortune: true,
			xp: {
				min: 0,
				max: 2
			}
		},
		"minecraft:lapis_ore": {
			drop: "minecraft:lapis_lazuli",
			tier: 2,
			fortune: true,
			rate: {
				min: 4,
				max: 9
			},
			xp: {
				min: 2,
				max: 5
			}
		},
		"minecraft:iron_ore": {
			drop: "minecraft:raw_iron",
			tier: 2,
			fortune: true
		},
		"minecraft:copper_ore": {
			drop: "minecraft:raw_copper",
			tier: 2,
			fortune: true,
			rate: {
				min: 2,
				max: 5
			}
		},
		"minecraft:gold_ore": {
			drop: "minecraft:raw_gold",
			tier: 3,
			fortune: true
		},
		"minecraft:nether_gold_ore": {
			drop: "minecraft:gold_nugget",
			fortune: true,
			rate: {
				min: 2,
				max: 6
			},
			xp: {
				min: 0,
				max: 1
			}
		},
		"minecraft:redstone_ore": {
			drop: "minecraft:redstone",
			tier: 2,
			rate: {
				min: 4,
				max: 5
			},
			xp: {
				min: 4,
				max: 5
			}
		},
		"minecraft:emerald_ore": {
			drop: "minecraft:emerald",
			tier: 3,
			fortune: true,
			xp: {
				min: 3,
				max: 7
			}
		},
		"minecraft:diamond_ore": {
			drop: "minecraft:diamond",
			tier: 3,
			fortune: true,
			xp: {
				min: 3,
				max: 7
			}
		},
		"minecraft:quartz_ore": {
			drop: "minecraft:quartz",
			fortune: true,
			xp: {
				min: 1,
				max: 5
			}
		},
		"minecraft:ancient_debris": {
			drop: "minecraft:ancient_debris"
		},
		"minecraft:cobblestone": {
			drop: "minecraft:cobblestone"
		},
		"minecraft:cobbled_deepslate": {
			drop: "minecraft:cobbled_deepslate"
		},
		"minecraft:stone": {
			drop: "minecraft:cobblestone"
		},
		"minecraft:deepslate": {
			drop: "minecraft:cobbled_deepslate"
		},
		"minecraft:granite": {
			drop: "minecraft:granite"
		},
		"minecraft:andesite": {
			drop: "minecraft:andesite"
		},
		"minecraft:diorite": {
			drop: "minecraft:diorite"
		},
		"minecraft:sandstone": {
			drop: "minecraft:sandstone"
		},
		"minecraft:red_sandstone": {
			drop: "minecraft:red_sandstone"
		},
		"minecraft:end_stone": {
			drop: "minecraft:end_stone"
		},
		"minecraft:netherrack": {
			drop: "minecraft:netherrack"
		},
		"minecraft:blackstone": {
			drop: "minecraft:blackstone"
		},
		"minecraft:basalt": {
			drop: "minecraft:basalt"
		},
		"minecraft:sand": {
			drop: "minecraft:sand"
		},
		"minecraft:red_sand": {
			drop: "minecraft:red_sand"
		},
		"minecraft:gravel": {
			drop: "minecraft:gravel"
		},
		"minecraft:hay_block": {
			drop: "minecraft:hay_block"
		},
		"minecraft:sculk": {
			drop: "minecraft:sculk"
		}
	},
	type = {
		"minecraft:coal_ore": "ore",
		"minecraft:lapis_ore": "ore",
		"minecraft:iron_ore": "ore",
		"minecraft:copper_ore": "ore",
		"minecraft:gold_ore": "ore",
		"minecraft:nether_gold_ore": "ore",
		"minecraft:redstone_ore": "ore",
		"minecraft:emerald_ore": "ore",
		"minecraft:diamond_ore": "ore",
		"minecraft:quartz_ore": "ore",
		"minecraft:ancient_debris": "ore",
		"minecraft:cobblestone": "ore",
		"minecraft:stone": "stone",
		"minecraft:granite": "stone",
		"minecraft:andesite": "stone",
		"minecraft:diorite": "stone",
		"minecraft:sandstone": "stone",
		"minecraft:red_sandstone": "stone",
		"minecraft:end_stone": "stone",
		"minecraft:netherrack": "stone",
		"minecraft:blackstone": "stone",
		"minecraft:basalt": "stone",
		"minecraft:sand": "sand",
		"minecraft:red_sand": "sand",
		"minecraft:gravel": "sand",
		"minecraft:hay_block": "hoecan",
		"minecraft:sculk": "hoecan"
	};

function normalize(e2) {
	return (e2 || "minecraft:air").replace(/^lit_|deepslate_/g, "").replace(/^minecraft:deepslate$/, "minecraft:stone").replace(/^minecraft:cobbled_deepslate$/, "minecraft:cobblestone")
}

function dis(pos) {
	return Math.max(Math.abs(pos.x1 - pos.x2), Math.abs(pos.y1 - pos.y2), Math.abs(pos.z1 - pos.z2))
}

function veinMining(block, d = 0) {
	let ty = normalize(block.typeId),
		ret = [block],
		o = {
			x1: block.x,
			y1: block.y,
			z1: block.z
		},
		set = new Set([`${block.x},${block.y},${block.z}`]);
	for (let i = 0; i < ret.length && ret.length <= MAX_SIZE; i++) {
		let prev = ret[i];
		[prev, prev.above(), prev.below()].flatMap(p => [p, p.north(), p.south()]).flatMap(p => [p, p.east(), p.west()]).filter(p => p !== prev).forEach(cur => {
			let pos = `${cur.x},${cur.y},${cur.z}`;
			if (ret.length < MAX_SIZE && (d <= 0 || dis({
					...o,
					x2: cur.x,
					y2: cur.y,
					z2: cur.z
				}) <= d) && normalize(cur.typeId) === ty && !set.has(pos)) {
				set.add(pos);
				ret.push(cur)
			}
		})
	}
	return ret
}
world.beforeEvents.playerBreakBlock.subscribe(e => {
	const {
		block,
		player,
		itemStack
	} = e;
	let is_c = player.getGameMode() === GameMode.creative;
	if (player.isSneaking && itemStack) {
		let n = block.location,
			d = itemStack.getComponent(ItemComponentTypes.Durability),
			dam = d.damage;
		if (!d || d.maxDurability - dam < 0) {
			return
		}
		let c = normalize(block.typeId),
			enchants = itemStack.getComponent(ItemComponentTypes.Enchantable),
			unbreak = enchants?.getEnchantment("unbreaking")?.level || 0,
			fortune = enchants?.getEnchantment("fortune")?.level || 0,
			silk = enchants?.getEnchantment("silk_touch")?.level || 0,
			ores = [];
		if (itemStack.typeId.endsWith("_pickaxe") && type[c] === "ore" || itemStack.typeId.endsWith("_axe") && c.startsWith("minecraft:") && (c.endsWith("_log") || c.endsWith("_planks") || c.endsWith("_stem")) || itemStack.typeId.endsWith("_shovel") && type[c] === "sand" || itemStack.typeId.endsWith("_hoe") && type[c] === "hoecan") {
			ores = veinMining(block)
		} else if (DISTANCE && itemStack.typeId.endsWith("_pickaxe") && type[c] === "stone") {
			ores = veinMining(block, DISTANCE)
		}
		if (ores.length <= 1) {
			return
		}
		let dro = dropData[c];
		if (!dro) {
			if (c.endsWith("_log") || c.endsWith("_stem") || c.endsWith("_planks")) {
				dro = {
					drop: c
				}
			} else {
				return
			}
		}
		let tire = dro?.tier;
		if (tire && tire > (tiers[itemStack?.typeId] || 1)) {
			return
		}
		let dim = block.dimension;
		e.cancel = true;
		system.run(() => {
			const final_drop = {},
				mine = [],
				gai = fortune < 0 ? 10 : fortune > 3 ? 1 : 10 - 3 * fortune;
			let xps = 0;
			if (is_c) {
				mine = [...ores]
			} else {
				for (let a of ores) {
					mine.push(a);
					let id = dro.drop,
						cnt = 1;
					if (silk) {
						id = a.typeId.replace(/lit_/g, "")
					} else if (c === "minecraft:sculk") {
						id = "minecraft:air";
						xps++
					} else if (c === "minecraft:stone" || c === "minecraft:cobblestone") {
						id = dropData[a.typeId].drop
					} else if (c === "minecraft:gravel") {
						if (random(1, gai) === 1) {
							id = "minecraft:flint"
						}
					} else if (type[c] === "ore") {
						cnt = dro.rate ? random(dro.rate.min, dro.rate.max) : 1;
						if (fortune && dro.fortune) {
							cnt *= Math.max(1, random(0, fortune + 1))
						}
						if (dro?.xp) {
							xps += random(dro.xp.min || 0, dro.xp.max || 0)
						}
					}
					if (id && id !== "minecraft:air") {
						if (!final_drop[id]) {
							final_drop[id] = 0
						}
						final_drop[id] += cnt
					}
					if (random(0, unbreak) === 0) {
						dam++;
						if (d.maxDurability - dam < 0) {
							break
						}
					}
				}
			}
			try {
				d.damage = dam;
				player.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand, itemStack)
			} catch {
				player.getComponent(EntityComponentTypes.Equippable).setEquipment(EquipmentSlot.Mainhand, new ItemStack("minecraft:air"));
				player.runCommandAsync(`playsound random.break @a ${block.x} ${block.y} ${block.z}`)
			}
			mine.forEach(b => {
				b.setType("minecraft:air")
			});
			for (let t = 0; t < xps; t++) {
				dim.spawnEntity("minecraft:xp_orb", n)
			}
			for (const id in final_drop) {
				while (final_drop[id] > 0) {
					dim.spawnItem(new ItemStack(id, Math.min(64, final_drop[id])), n);
					final_drop[id] -= 64
				}
			}
		})
	}
});
