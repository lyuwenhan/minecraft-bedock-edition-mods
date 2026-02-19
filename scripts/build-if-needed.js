const fs = require("fs");
const path = require("path");
const {
	execSync
} = require("child_process");
const root = process.cwd();
const dataDir = path.join(root, "data");
const mcpacksDir = path.join(dataDir, "mcpacks");
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, {
		recursive: true
	})
}
const versionsPath = path.join(dataDir, "versions.json");
let versions = {};
if (fs.existsSync(versionsPath)) {
	try {
		versions = JSON.parse(fs.readFileSync(versionsPath, "utf8"))
	} catch (e) {
		console.error("Invalid versions.json, resetting.")
	}
}
const defaultStatus = {
	needsUpdate: false
};
const excluded = [".git", ".github", "data", "node_modules", "scripts"];
const dirs = fs.readdirSync(root).filter(d => !excluded.includes(d) && fs.existsSync(path.join(root, d, "manifest.json")));
let hasError = false;
for (const dir of dirs) {
	try {
		console.log(`Processing ${dir}...`);
		const extensionsDir = path.join(dataDir, dir);
		const extPath = path.join(root, dir);
		const statusPath = path.join(extPath, "status.json");
		let status = {};
		try {
			status = JSON.parse(fs.readFileSync(statusPath, "utf8"))
		} catch {
			console.warn(`${dir}: invalid or missing status.json, using default.`)
		}
		if (status?.needsUpdate) {
			fs.mkdirSync(extensionsDir, {
				recursive: true
			});
			let hasIcon = false;
			const iconPath = path.join(extPath, "pack_icon.png");
			if (fs.existsSync(iconPath)) {
				const targetPath = path.join(extensionsDir, "icon.png");
				fs.copyFileSync(iconPath, targetPath);
				console.log(`Icon copied: ${iconPath} -> ${targetPath}`);
				hasIcon = true
			} else {
				console.warn(`pack_icon.png not found for ${dir}`)
			}
			const manifestPath = path.join(extPath, "manifest.json");
			const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
			const version = manifest.header.version.join(".");
			const displayName = "";
			const description = "";
			const textPath = path.join(extPath, "texts", "en_US.lang");
			if (fs.existsSync(textPath)) {
				const texts = fs.readFileSync(textPath, "utf8").split("\n");
				texts.forEach(text => {
					if (text.startsWith("pack.name=")) {
						displayName = text.slice("pack.name=".length)
					} else if (text.startsWith("pack.description=")) {
						description = text.slice("pack.description=".length)
					}
				})
			}
			const isNew = !versions[dir];
			if (isNew) {
				console.log(`New extension detected: ${dir}`);
				versions[dir] = {
					version,
					hasIcon,
					href: "",
					displayName,
					description
				}
			} else {
				versions[dir].version = version;
				versions[dir].hasIcon = hasIcon;
				versions[dir].displayName = displayName;
				versions[dir].description = description
			}
			const outFile = path.join(mcpacksDir, `${dir}.mcpack`);
			console.log(`Packing ${dir} -> ${outFile}`);
			execSync(`zip -r "${outFile}" . -x "*.git*"`, {
				cwd: extPath,
				stdio: "inherit"
			});
			console.log(`${dir} built successfully.`)
		} else {
			console.log(`Skip ${dir}: no new content`)
		}
		fs.writeFileSync(statusPath, JSON.stringify(defaultStatus, null, "\t") + "\n", "utf8")
	} catch (err) {
		hasError = true;
		console.error(`Failed processing ${dir}: ${err.message}`)
	}
}
fs.writeFileSync(versionsPath, JSON.stringify(versions) + "\n", "utf8");
if (hasError) {
	process.exit(1)
}
