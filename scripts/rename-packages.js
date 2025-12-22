#!/usr/bin/env node

/**
 * Script to rename packages from @xrplf scope to a custom scope
 * Usage: node scripts/rename-packages.js --scope=@transia --version-suffix=-alpha.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

const targetScope = getArg('scope') || '@transia';
const versionSuffix = getArg('version-suffix') || '-alpha.0';
const dryRun = args.includes('--dry-run');

console.log(`\n🔄 Package Renaming Script`);
console.log(`Target scope: ${targetScope}`);
console.log(`Version suffix: ${versionSuffix}`);
console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}\n`);

// Package mappings
const packageMappings = {
  'ripple-keypairs': `${targetScope}/ripple-keypairs`,
  'ripple-address-codec': `${targetScope}/ripple-address-codec`,
  'ripple-binary-codec': `${targetScope}/ripple-binary-codec`,
  '@xrplf/isomorphic': `${targetScope}/isomorphic`,
  '@xrplf/secret-numbers': `${targetScope}/secret-numbers`,
  'xrpl': `${targetScope}/xrpl`,
};

// Get all package directories
const packagesDir = path.join(__dirname, '../packages');
const packageDirs = fs.readdirSync(packagesDir)
  .map(dir => path.join(packagesDir, dir))
  .filter(dir => fs.statSync(dir).isDirectory());

/**
 * Update a package.json file
 */
function updatePackageJson(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const originalName = packageJson.name;

  // Update package name
  if (packageMappings[originalName]) {
    packageJson.name = packageMappings[originalName];
    console.log(`  ✓ Renamed: ${originalName} → ${packageJson.name}`);
  }

  // Update version with suffix
  if (packageJson.version && !packageJson.version.includes('alpha')) {
    const [major, minor, patch] = packageJson.version.split('.');
    const newPatch = parseInt(patch) + 1;
    packageJson.version = `${major}.${minor}.${newPatch}${versionSuffix}`;
    console.log(`  ✓ Version: ${originalName} → ${packageJson.version}`);
  }

  // Update dependencies
  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];
  depTypes.forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(dep => {
        if (packageMappings[dep]) {
          const version = packageJson[depType][dep];
          delete packageJson[depType][dep];
          packageJson[depType][packageMappings[dep]] = version;
          console.log(`  ✓ Dependency: ${dep} → ${packageMappings[dep]}`);
        }
      });
    }
  });

  if (!dryRun) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  }
}

/**
 * Update import statements in a file
 */
function updateImportStatements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  Object.keys(packageMappings).forEach(oldName => {
    const newName = packageMappings[oldName];

    // Match various import patterns
    const patterns = [
      // from 'package-name'
      new RegExp(`from ['"]${oldName.replace(/\//g, '\\/')}['"]`, 'g'),
      // from 'package-name/subpath'
      new RegExp(`from ['"]${oldName.replace(/\//g, '\\/')}\\/`, 'g'),
      // require('package-name')
      new RegExp(`require\\(['"]${oldName.replace(/\//g, '\\/')}['"]\\)`, 'g'),
      // require('package-name/subpath')
      new RegExp(`require\\(['"]${oldName.replace(/\//g, '\\/')}\\/`, 'g'),
    ];

    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(
          new RegExp(`(['"])${oldName.replace(/\//g, '\\/')}`, 'g'),
          `$1${newName}`
        );
        modified = true;
      }
    });
  });

  if (modified && !dryRun) {
    fs.writeFileSync(filePath, content);
  }

  return modified;
}

/**
 * Recursively find all TypeScript/JavaScript files
 */
function findSourceFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        findSourceFiles(filePath, fileList);
      }
    } else if (/\.(ts|js|tsx|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Main execution
 */
async function main() {
  console.log('📦 Updating package.json files...\n');

  // Update all package.json files
  packageDirs.forEach(packageDir => {
    const packageName = path.basename(packageDir);
    console.log(`Processing: ${packageName}`);
    updatePackageJson(packageDir);
    console.log('');
  });

  // Update root package.json
  console.log('Processing: root package.json');
  updatePackageJson(path.join(__dirname, '..'));
  console.log('');

  console.log('📝 Updating import statements...\n');

  // Update all TypeScript/JavaScript files
  let filesModified = 0;
  packageDirs.forEach(packageDir => {
    const sourceFiles = findSourceFiles(packageDir);
    sourceFiles.forEach(file => {
      if (updateImportStatements(file)) {
        filesModified++;
        const relativePath = path.relative(process.cwd(), file);
        console.log(`  ✓ Updated: ${relativePath}`);
      }
    });
  });

  console.log(`\n✓ Modified ${filesModified} source files`);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN - No changes were made');
    console.log('Remove --dry-run flag to apply changes\n');
  } else {
    console.log('\n✅ Package renaming complete!\n');
    console.log('Next steps:');
    console.log('1. Review the changes with: git diff');
    console.log('2. Run tests: npm test');
    console.log('3. Build packages: npm run build');
    console.log('4. Publish with: npx lerna publish from-package --yes\n');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
