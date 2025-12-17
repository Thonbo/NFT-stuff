#!/usr/bin/env node

/**
 * UniWorlds NFT Metadata Generator
 * Generates per-token JSON metadata from CSV for IPFS upload
 */

const fs = require('fs-extra');
const path = require('path');
const { parse } = require('csv-parse/sync');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  csvPath: 'metadata.csv',
  imagesFolder: 'images',
  outputFolder: 'metadata',
  collectionName: 'UniWorlds',
  collectionDescription: 'Far beyond, planets of all kinds orbit in quiet solitude - some untouched, some marked by time, and others shaped by distant civilizations. Each world holds its own story, waiting to be uncovered.',
  expectedTokenCount: 1337,
  tokenIdColumn: 'tokenID',
  imageFilenameColumn: 'file_name',
  nameColumn: 'name',
  descriptionColumn: 'description',
  externalUrlColumn: 'external_url',
  // Columns to exclude from attributes
  excludeColumns: ['tokenID', 'name', 'file_name', 'description', 'external_url'],
  // Placeholder CID - will be replaced later with actual IPFS CID
  imagesCidPlaceholder: '__IMAGES_CID_PLACEHOLDER__',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message, type = 'info') {
  const prefix = {
    info: '[INFO]',
    success: '[✓]',
    warn: '[WARNING]',
    error: '[ERROR]',
  }[type] || '[INFO]';

  console.log(`${prefix} ${message}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  console.log(title);
  console.log('='.repeat(70));
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateCSVStructure(records) {
  const errors = [];
  const warnings = [];

  // Check required columns exist
  const requiredColumns = [
    CONFIG.tokenIdColumn,
    CONFIG.imageFilenameColumn,
    CONFIG.nameColumn,
    CONFIG.descriptionColumn,
  ];

  const headers = Object.keys(records[0]);

  for (const col of requiredColumns) {
    if (!headers.includes(col)) {
      errors.push(`Missing required column: "${col}"`);
    }
  }

  // Check token count
  if (records.length !== CONFIG.expectedTokenCount) {
    errors.push(
      `Expected ${CONFIG.expectedTokenCount} tokens, found ${records.length}`
    );
  }

  // Check for duplicate token IDs
  const tokenIds = records.map(r => r[CONFIG.tokenIdColumn]);
  const duplicates = tokenIds.filter((id, index) => tokenIds.indexOf(id) !== index);

  if (duplicates.length > 0) {
    errors.push(
      `Duplicate token IDs found: ${[...new Set(duplicates)].join(', ')}`
    );
  }

  // Check for missing token IDs in sequence (1 to 1337)
  const tokenIdNumbers = tokenIds.map(id => parseInt(id, 10)).sort((a, b) => a - b);
  const missingIds = [];

  for (let i = 1; i <= CONFIG.expectedTokenCount; i++) {
    if (!tokenIdNumbers.includes(i)) {
      missingIds.push(i);
    }
  }

  if (missingIds.length > 0) {
    errors.push(
      `Missing token IDs: ${missingIds.slice(0, 10).join(', ')}${
        missingIds.length > 10 ? ` ... (${missingIds.length} total)` : ''
      }`
    );
  }

  // Check for invalid token ID range
  const invalidIds = tokenIdNumbers.filter(
    id => id < 1 || id > CONFIG.expectedTokenCount
  );

  if (invalidIds.length > 0) {
    errors.push(
      `Token IDs out of range (1-${CONFIG.expectedTokenCount}): ${invalidIds.slice(0, 10).join(', ')}`
    );
  }

  // Check for empty critical fields
  records.forEach((record, index) => {
    const tokenId = record[CONFIG.tokenIdColumn];

    if (!record[CONFIG.nameColumn] || record[CONFIG.nameColumn].trim() === '') {
      warnings.push(`Token ${tokenId} (row ${index + 2}) has empty name`);
    }

    if (!record[CONFIG.imageFilenameColumn] || record[CONFIG.imageFilenameColumn].trim() === '') {
      errors.push(`Token ${tokenId} (row ${index + 2}) has empty image filename`);
    }
  });

  return { errors, warnings };
}

function validateImages(records) {
  const errors = [];
  const warnings = [];

  // Check if images folder exists
  if (!fs.existsSync(CONFIG.imagesFolder)) {
    errors.push(`Images folder not found: "${CONFIG.imagesFolder}"`);
    errors.push('Please create the images folder and add your PNG files');
    return { errors, warnings };
  }

  // Get list of image files
  const imageFiles = fs.readdirSync(CONFIG.imagesFolder)
    .filter(f => f.toLowerCase().endsWith('.png'));

  if (imageFiles.length === 0) {
    errors.push(`No PNG files found in "${CONFIG.imagesFolder}" folder`);
    return { errors, warnings };
  }

  log(`Found ${imageFiles.length} PNG files in images folder`);

  // Check each referenced image exists
  const missingImages = [];

  records.forEach((record) => {
    const tokenId = record[CONFIG.tokenIdColumn];
    const imageFilename = record[CONFIG.imageFilenameColumn];
    const imagePath = path.join(CONFIG.imagesFolder, imageFilename);

    if (!fs.existsSync(imagePath)) {
      missingImages.push(`Token ${tokenId}: ${imageFilename}`);
    }
  });

  if (missingImages.length > 0) {
    errors.push(
      `Missing image files (${missingImages.length}):\n  ` +
      missingImages.slice(0, 20).join('\n  ') +
      (missingImages.length > 20 ? `\n  ... (${missingImages.length - 20} more)` : '')
    );
  }

  // Check for unreferenced images
  const referencedImages = records.map(r => r[CONFIG.imageFilenameColumn]);
  const unreferencedImages = imageFiles.filter(f => !referencedImages.includes(f));

  if (unreferencedImages.length > 0) {
    warnings.push(
      `Unreferenced images in folder (${unreferencedImages.length}): ${
        unreferencedImages.slice(0, 5).join(', ')
      }${unreferencedImages.length > 5 ? ' ...' : ''}`
    );
  }

  return { errors, warnings };
}

// ============================================================================
// METADATA GENERATION
// ============================================================================

function extractAttributes(record, headers) {
  const attributes = [];

  for (const header of headers) {
    // Skip excluded columns
    if (CONFIG.excludeColumns.includes(header)) {
      continue;
    }

    // Extract attribute name from "attributes[...]" format
    const attributeMatch = header.match(/^attributes\[(.+)\]$/);

    if (attributeMatch) {
      const traitType = attributeMatch[1];
      const value = record[header];

      // Only include non-empty values
      if (value && value.trim() !== '') {
        attributes.push({
          trait_type: traitType,
          value: value.trim(),
        });
      }
    }
  }

  return attributes;
}

function generateMetadata(record, headers) {
  const tokenId = record[CONFIG.tokenIdColumn];
  const imageFilename = record[CONFIG.imageFilenameColumn];
  const attributes = extractAttributes(record, headers);

  // OpenSea metadata standard
  const metadata = {
    name: record[CONFIG.nameColumn] || `${CONFIG.collectionName} #${tokenId}`,
    description: record[CONFIG.descriptionColumn] || CONFIG.collectionDescription,
    image: `ipfs://${CONFIG.imagesCidPlaceholder}/${imageFilename}`,
    attributes: attributes,
  };

  // Add external_url if present
  if (CONFIG.externalUrlColumn && record[CONFIG.externalUrlColumn]) {
    metadata.external_url = record[CONFIG.externalUrlColumn];
  }

  return metadata;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  logSection(`UniWorlds NFT Metadata Generator ${isDryRun ? '(DRY RUN)' : ''}`);

  // -------------------------------------------------------------------------
  // 1. READ CSV
  // -------------------------------------------------------------------------

  logSection('Step 1: Reading CSV');

  if (!fs.existsSync(CONFIG.csvPath)) {
    log(`CSV file not found: ${CONFIG.csvPath}`, 'error');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(CONFIG.csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  log(`Loaded ${records.length} records from ${CONFIG.csvPath}`, 'success');

  const headers = Object.keys(records[0]);
  log(`Columns: ${headers.join(', ')}`);

  // -------------------------------------------------------------------------
  // 2. VALIDATE CSV
  // -------------------------------------------------------------------------

  logSection('Step 2: Validating CSV Structure');

  const csvValidation = validateCSVStructure(records);

  if (csvValidation.warnings.length > 0) {
    csvValidation.warnings.forEach(w => log(w, 'warn'));
  }

  if (csvValidation.errors.length > 0) {
    csvValidation.errors.forEach(e => log(e, 'error'));
    process.exit(1);
  }

  log('CSV structure validation passed', 'success');

  // -------------------------------------------------------------------------
  // 3. VALIDATE IMAGES
  // -------------------------------------------------------------------------

  logSection('Step 3: Validating Images');

  const imageValidation = validateImages(records);

  if (imageValidation.warnings.length > 0) {
    imageValidation.warnings.forEach(w => log(w, 'warn'));
  }

  if (imageValidation.errors.length > 0) {
    imageValidation.errors.forEach(e => log(e, 'error'));
    process.exit(1);
  }

  log('Image validation passed', 'success');

  // -------------------------------------------------------------------------
  // 4. GENERATE METADATA
  // -------------------------------------------------------------------------

  if (isDryRun) {
    logSection('Step 4: Dry Run Complete');
    log('All validations passed!', 'success');
    log(`Ready to generate ${records.length} metadata JSON files`);
    log('', 'info');
    log('Run without --dry-run flag to generate files:', 'info');
    log('  npm run generate', 'info');
    return;
  }

  logSection('Step 4: Generating Metadata Files');

  // Create output folder
  await fs.ensureDir(CONFIG.outputFolder);
  log(`Created output folder: ${CONFIG.outputFolder}`);

  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    try {
      const tokenId = record[CONFIG.tokenIdColumn];
      const metadata = generateMetadata(record, headers);
      const outputPath = path.join(CONFIG.outputFolder, `${tokenId}.json`);

      await fs.writeJson(outputPath, metadata, { spaces: 2 });
      successCount++;

      if (successCount % 100 === 0) {
        log(`Generated ${successCount}/${records.length} files...`);
      }
    } catch (error) {
      errorCount++;
      log(`Failed to generate metadata for token ${record[CONFIG.tokenIdColumn]}: ${error.message}`, 'error');
    }
  }

  // -------------------------------------------------------------------------
  // 5. FINAL SUMMARY
  // -------------------------------------------------------------------------

  logSection('Summary');

  log(`Successfully generated: ${successCount} files`, 'success');

  if (errorCount > 0) {
    log(`Failed: ${errorCount} files`, 'error');
  }

  log('', 'info');
  log('Next steps:', 'info');
  log('1. Upload images/ folder to IPFS → get IMAGES_CID', 'info');
  log('2. Run: node patch-cid.js <IMAGES_CID>', 'info');
  log('3. Upload metadata/ folder to IPFS → get METADATA_CID', 'info');
  log('4. Set contract baseURI to: ipfs://<METADATA_CID>/', 'info');
}

// ============================================================================
// EXECUTE
// ============================================================================

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
