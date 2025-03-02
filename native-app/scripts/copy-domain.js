const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths - adjust based on the actual project structure
const scriptDir = process.cwd();
const nativeAppDir = path.resolve(scriptDir);
const rootDir = path.resolve(nativeAppDir, "..");
const domainDir = path.join(rootDir, "domain");
const nodeModulesDir = path.join(
  nativeAppDir,
  "node_modules",
  "@windy-civi",
  "domain"
);

// Verify domain directory exists
if (!fs.existsSync(domainDir)) {
  console.error(`Error: Domain directory not found at ${domainDir}`);
  process.exit(1);
}

// Create directories if they don't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Remove symlink if it exists
function removeSymlinkIfExists() {
  try {
    const stats = fs.lstatSync(nodeModulesDir);
    if (stats.isSymbolicLink()) {
      console.log("Removing existing symlink...");
      fs.unlinkSync(nodeModulesDir);
    } else if (stats.isDirectory()) {
      // If it's a directory, we'll remove it to ensure a clean copy
      console.log("Removing existing directory...");
      fs.rmSync(nodeModulesDir, { recursive: true, force: true });
    }
  } catch (error) {
    // If the path doesn't exist, that's fine
    if (error.code !== "ENOENT") {
      console.error("Error checking symlink:", error);
    }
  }
}

// Recursively copy a directory
function copyDirRecursive(src, dest) {
  // Create destination directory
  ensureDirectoryExists(dest);

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip node_modules
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively copy directory
      copyDirRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy domain files to node_modules
function copyDomainFiles() {
  console.log("Copying domain files to native-app...", nodeModulesDir);

  // Ensure the target directory exists
  ensureDirectoryExists(path.dirname(nodeModulesDir));

  // Remove symlink if it exists
  removeSymlinkIfExists();

  // Try using rsync first (faster and handles permissions better)
  try {
    console.log("Attempting to copy with rsync...");
    execSync(
      `rsync -avL --delete \
      --exclude="node_modules" \
      --exclude=".git" \
      --exclude="*.log" \
      ${domainDir}/ ${nodeModulesDir}/`,
      { stdio: "inherit" }
    );

    // Verify it's not a symlink after copying
    if (fs.lstatSync(nodeModulesDir).isSymbolicLink()) {
      throw new Error("Directory is still a symlink after rsync copy");
    }

    console.log("Domain files copied successfully with rsync!");
  } catch (error) {
    console.warn(
      "Rsync copy failed or resulted in symlink, falling back to Node.js copy:",
      error.message
    );

    // Fallback to Node.js copy
    try {
      // Ensure the directory is removed first
      if (fs.existsSync(nodeModulesDir)) {
        fs.rmSync(nodeModulesDir, { recursive: true, force: true });
      }

      // Copy using Node.js fs methods
      copyDirRecursive(domainDir, nodeModulesDir);

      console.log("Domain files copied successfully with Node.js!");
    } catch (nodeError) {
      console.error("Error copying domain files with Node.js:", nodeError);
      process.exit(1);
    }
  }
}

// Watch for changes in the domain directory
function watchDomainFiles() {
  console.log("Watching for changes in domain directory...");

  fs.watch(domainDir, { recursive: true }, (eventType, filename) => {
    // Ignore node_modules changes
    if (filename && !filename.includes("node_modules")) {
      console.log(`Change detected: ${filename}`);
      copyDomainFiles();
    }
  });
}

// Main function
function main() {
  // Initial copy
  copyDomainFiles();

  // Check if watch flag is provided
  const shouldWatch = process.argv.includes("--watch");

  if (shouldWatch) {
    watchDomainFiles();
    console.log("Watching for changes. Press Ctrl+C to stop.");
  }
}

main();
