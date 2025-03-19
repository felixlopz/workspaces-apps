const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Ensure Metro resolves modules from your `packages/` directory
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      // Redirect imports from `packages/*` to the correct location
      if (name.startsWith("@kopcenter/")) {
        return path.join(
          workspaceRoot,
          "packages",
          name.replace("@kopcenter/", "")
        );
      }
      return path.join(projectRoot, "node_modules", name);
    },
  }
);

// 4. Add support for TypeScript (if needed)
config.resolver.sourceExts = [...config.resolver.sourceExts, "ts", "tsx"];

module.exports = config;
