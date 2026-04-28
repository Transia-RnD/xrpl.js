#!/bin/bash

# Convenience script to apply Transia package transformation
# This transforms @xrplf packages to @transia packages

set -e

echo "🔄 Applying Transia Package Transformation"
echo ""
echo "This will:"
echo "  • Rename all packages to @transia scope"
echo "  • Update all import statements"
echo "  • Bump versions with -quantum.0 suffix"
echo ""

# Check if --dry-run flag is passed
DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "⚠️  DRY RUN MODE - No changes will be made"
  echo ""
fi

# Run the rename script
node scripts/rename-packages.js --scope=@transia --version-suffix=-quantum.0 $DRY_RUN

if [[ -z "$DRY_RUN" ]]; then
  echo ""
  echo "✅ Transformation complete!"
  echo ""
  echo "📋 Recommended next steps:"
  echo ""
  echo "1. Review changes:"
  echo "   git diff"
  echo ""
  echo "2. Run tests:"
  echo "   npm test"
  echo ""
  echo "3. Build packages:"
  echo "   npm run build"
  echo ""
  echo "4. Commit changes:"
  echo "   git add ."
  echo "   git commit -m \"Transform packages to @transia scope\""
  echo ""
  echo "5. Publish to npm:"
  echo "   npx lerna publish from-package --yes"
  echo ""
fi
