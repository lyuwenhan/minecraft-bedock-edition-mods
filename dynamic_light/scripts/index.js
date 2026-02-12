import {
	world,
	system,
	EquipmentSlot
} from "@minecraft/server";
const light = {
	"minecraft:beacon": 15,
	"minecraft:campfire": 15,
	"minecraft:glowstone": 15,
	"minecraft:glow_berries": 14,
	"minecraft:lit_pumpkin": 15,
	"minecraft:lava_bucket": 15,
	"minecraft:sea_lantern": 15,
	"minecraft:conduit": 15,
	"minecraft:lantern": 15,
	"minecraft:shroomlight": 15,
	"minecraft:pearlescent_froglight": 15,
	"minecraft:verdant_froglight": 15,
	"minecraft:ochre_froglight": 15,
	"minecraft:end_rod": 14,
	"minecraft:torch": 14,
	"minecraft:soul_torch": 10,
	"minecraft:soul_lantern": 10,
	"minecraft:crying_obsidian": 10,
	"minecraft:soul_campfire": 10,
	"minecraft:enchanting_table": 7,
	"minecraft:ender_chest": 7,
	"minecraft:redstone_torch": 7,
	"minecraft:glow_lichen": 7,
	"minecraft:sea_pickle": 6,
	"minecraft:sculk_catalyst": 6,
	"minecraft:magma": 3,
	"minecraft:firefly_bush": 2,
	"minecraft:brewing_stand": 1,
	"minecraft:brown_mushroom": 1,
	"minecraft:dragon_egg": 1,
	"minecraft:sculk_sensor": 1,
	"minecraft:calibrated_sculk_sensor": 1,
	"minecraft:light_block_0": 0,
	"minecraft:light_block_1": 1,
	"minecraft:light_block_2": 2,
	"minecraft:light_block_3": 3,
	"minecraft:light_block_4": 4,
	"minecraft:light_block_5": 5,
	"minecraft:light_block_6": 6,
	"minecraft:light_block_7": 7,
	"minecraft:light_block_8": 8,
	"minecraft:light_block_9": 9,
	"minecraft:light_block_10": 10,
	"minecraft:light_block_11": 11,
	"minecraft:light_block_12": 12,
	"minecraft:light_block_13": 13,
	"minecraft:light_block_14": 14,
	"minecraft:light_block_15": 15
};

function check_light (t) {
	return light[t.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Mainhand)?.typeId] ?? 0
}

function fill (t, n, i, e, c, r) {
	const o = world.getDimension(r),
		a = o.getBlock({
			x: t,
			y: n,
			z: i
		}).typeId;
	/minecraft:((air)|(light_block_\d+))/.test(a) && (c ? o.runCommand(`setblock ${t} ${n} ${i} ${e}_${c}`) : o.runCommand(`setblock ${t} ${n} ${i} ${e}`))
}
let last = {},
	now = {};
system.runInterval(() => {
	last = now, now = {};
	for (const n of world.getAllPlayers()) {
		const i = n.location,
			e = n.dimension.id,
			c = `${Math.floor(i.x)},${Math.floor(i.y)},${Math.floor(i.z)}`,
			r = check_light(n);
		now[e] || (now[e] = {});
		const o = now[e][c] ?? 0;
		now[e][c] = Math.max(o, r)
	}
	for (const a in now) {
		let l = {};
		for (const m in now[a]) {
			const f = now[a][m],
				[_, s, g] = m.split(",").map(Number);

			function t (t, n, i, e) {
				if (e <= 0) return;
				const c = `${t},${n},${i}`,
					r = l[c] ?? 0;
				l[c] = Math.max(r, e)
			}
			f > 0 && (t(_, s, g, f), t(_, s + 1, g, f)), f > 1 && (t(_, s - 1, g, f - 1), t(_, s, g + 1, f - 1), t(_, s, g - 1, f - 1), t(_ + 1, s, g, f - 1), t(_ - 1, s, g, f - 1), t(_, s + 2, g, f - 1), t(_, s + 1, g + 1, f - 1), t(_, s + 1, g - 1, f - 1), t(_ + 1, s + 1, g, f - 1), t(_ - 1, s + 1, g, f - 1))
		}
		now[a] = l;
		for (const h in last[a] ?? {})
			if (!(h in now[a])) {
				const [b, k, u] = h.split(",").map(Number);
				fill(b, k, u, "minecraft:air", 0, a)
			} for (const w in now[a]) {
			const [d, p, $] = w.split(",").map(Number);
			fill(d, p, $, "minecraft:light_block", now[a][w], a)
		}
	}
}, 1);
