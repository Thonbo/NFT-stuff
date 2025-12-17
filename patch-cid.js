#!/usr/bin/env node

/**
 * Patch IPFS CID into metadata JSON files
 * Run this AFTER uploading images to IPFS
 */

const fs = require('fs-extra');
const path = require('path');

const METADATA_FOLDER = 'metadata';
const PLACEHOLDER = '__IMAGES_CID_PLACEHOLDER__';

function log(message, type = 'info') {
  const prefix = {
    info: '[INFO]',
    success: '[✓]',
    warn: '[WARNING]',
    error: '[ERROR]',
  }[type] || '[INFO]';

  console.log(`${prefix} ${message}`);
}

async function patchCID(imagesCID) {
  console.log('\n' + '='.repeat(70));
  console.log('Patching IPFS CID into Metadata Files');
  console.log('='.repeat(70));

  // Validate CID format (basic check)
  if (!imagesCID || imagesCID.length < 10) {
    log('Invalid CID provided', 'error');
    log('Usage: node patch-cid.js <IMAGES_CID>', 'error');
    log('Example: node patch-cid.js QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', 'error');
    process.exit(1);
  }

  // Check metadata folder exists
  if (!fs.existsSync(METADATA_FOLDER)) {
    log(`Metadata folder not found: ${METADATA_FOLDER}`, 'error');
    log('Please run generate-metadata.js first', 'error');
    process.exit(1);
  }

  // Get all JSON files
  const files = fs.readdirSync(METADATA_FOLDER)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('.json', ''), 10);
      const numB = parseInt(b.replace('.json', ''), 10);
      return numA - numB;
    });

  if (files.length === 0) {
    log('No JSON files found in metadata folder', 'error');
    process.exit(1);
  }

  log(`Found ${files.length} metadata files`);
  log(`Replacing: ${PLACEHOLDER}`);
  log(`With CID: ${imagesCID}`);
  log('');

  let patchedCount = 0;
  let alreadyPatchedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(METADATA_FOLDER, file);
      const content = await fs.readJson(filePath);

      // Check if already patched
      if (content.image && !content.image.includes(PLACEHOLDER)) {
        alreadyPatchedCount++;
        continue;
      }

      // Patch the CID
      if (content.image) {
        content.image = content.image.replace(PLACEHOLDER, imagesCID);
        await fs.writeJson(filePath, content, { spaces: 2 });
        patchedCount++;

        if (patchedCount % 100 === 0) {
          log(`Patched ${patchedCount}/${files.length} files...`);
        }
      }
    } catch (error) {
      errorCount++;
      log(`Failed to patch ${file}: ${error.message}`, 'error');
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('Summary');
  console.log('='.repeat(70));

  log(`Patched: ${patchedCount} files`, 'success');

  if (alreadyPatchedCount > 0) {
    log(`Already patched: ${alreadyPatchedCount} files`, 'info');
  }

  if (errorCount > 0) {
    log(`Errors: ${errorCount} files`, 'error');
  }

  log('', 'info');
  log('Next steps:', 'info');
  log('1. Verify a few metadata files manually', 'info');
  log('2. Upload metadata/ folder to IPFS → get METADATA_CID', 'info');
  log('3. Set contract baseURI to: ipfs://<METADATA_CID>/', 'info');
}

// Get CID from command line argument
const imagesCID = process.argv[2];

patchCID(imagesCID).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
