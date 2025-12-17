#!/usr/bin/env python3
"""
UniWorlds NFT Metadata Generator
Generates 1,337 JSON metadata files from CSV for IPFS upload
"""

import sys
import os
import json
import pandas as pd
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    'csv_path': 'metadata.csv',
    'images_folder': 'images',
    'output_folder': 'metadata',
    'expected_token_count': 1337,
    'token_id_column': 'tokenID',
    'image_filename_column': 'file_name',
    'name_column': 'name',
    'description_column': 'description',
    'external_url_column': 'external_url',
    # Columns to exclude from attributes
    'exclude_columns': ['tokenID', 'name', 'file_name', 'description', 'external_url'],
    # Placeholder CID - will be replaced later
    'images_cid_placeholder': '__IMAGES_CID_PLACEHOLDER__',
}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def log(message, type='info'):
    prefix = {
        'info': '[INFO]',
        'success': '[✓]',
        'warn': '[WARNING]',
        'error': '[ERROR]',
    }.get(type, '[INFO]')
    print(f"{prefix} {message}")

def log_section(title):
    print('\n' + '=' * 70)
    print(title)
    print('=' * 70)

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def validate_csv_structure(df):
    """Validate CSV has correct structure and token IDs"""
    errors = []
    warnings = []

    # Check required columns exist
    required_columns = [
        CONFIG['token_id_column'],
        CONFIG['image_filename_column'],
        CONFIG['name_column'],
        CONFIG['description_column'],
    ]

    for col in required_columns:
        if col not in df.columns:
            errors.append(f"Missing required column: '{col}'")

    if errors:
        return errors, warnings

    # Check token count
    if len(df) != CONFIG['expected_token_count']:
        errors.append(
            f"Expected {CONFIG['expected_token_count']} tokens, found {len(df)}"
        )

    # Get token IDs
    token_ids = df[CONFIG['token_id_column']].tolist()

    # Check for duplicates
    duplicates = df[df.duplicated(subset=[CONFIG['token_id_column']], keep=False)][CONFIG['token_id_column']].unique()
    if len(duplicates) > 0:
        errors.append(f"Duplicate token IDs found: {', '.join(map(str, duplicates[:10]))}")

    # Check for missing IDs in sequence (1 to 1337)
    expected_ids = set(range(1, CONFIG['expected_token_count'] + 1))
    actual_ids = set(token_ids)
    missing_ids = sorted(expected_ids - actual_ids)

    if missing_ids:
        errors.append(
            f"Missing token IDs: {', '.join(map(str, missing_ids[:10]))}" +
            (f" ... ({len(missing_ids)} total)" if len(missing_ids) > 10 else "")
        )

    # Check for invalid token ID range
    invalid_ids = [tid for tid in token_ids if tid < 1 or tid > CONFIG['expected_token_count']]
    if invalid_ids:
        errors.append(
            f"Token IDs out of range (1-{CONFIG['expected_token_count']}): {', '.join(map(str, invalid_ids[:10]))}"
        )

    # Check for empty critical fields
    for idx, row in df.iterrows():
        token_id = row[CONFIG['token_id_column']]

        if pd.isna(row[CONFIG['name_column']]) or str(row[CONFIG['name_column']]).strip() == '':
            warnings.append(f"Token {token_id} (row {idx + 2}) has empty name")

        if pd.isna(row[CONFIG['image_filename_column']]) or str(row[CONFIG['image_filename_column']]).strip() == '':
            errors.append(f"Token {token_id} (row {idx + 2}) has empty image filename")

    return errors, warnings

def validate_images(df):
    """Validate all referenced images exist"""
    errors = []
    warnings = []

    # Check if images folder exists
    if not os.path.exists(CONFIG['images_folder']):
        errors.append(f"Images folder not found: '{CONFIG['images_folder']}'")
        errors.append("Please create the images folder and add your PNG files")
        return errors, warnings

    # Get list of image files
    image_files = [f for f in os.listdir(CONFIG['images_folder']) if f.lower().endswith('.png')]

    if len(image_files) == 0:
        errors.append(f"No PNG files found in '{CONFIG['images_folder']}' folder")
        return errors, warnings

    log(f"Found {len(image_files)} PNG files in images folder")

    # Check each referenced image exists
    missing_images = []

    for idx, row in df.iterrows():
        token_id = row[CONFIG['token_id_column']]
        image_filename = row[CONFIG['image_filename_column']]
        image_path = os.path.join(CONFIG['images_folder'], image_filename)

        if not os.path.exists(image_path):
            missing_images.append(f"Token {token_id}: {image_filename}")

    if missing_images:
        errors.append(
            f"Missing image files ({len(missing_images)}):\n  " +
            '\n  '.join(missing_images[:20]) +
            (f"\n  ... ({len(missing_images) - 20} more)" if len(missing_images) > 20 else "")
        )

    # Check for unreferenced images
    referenced_images = df[CONFIG['image_filename_column']].tolist()
    unreferenced_images = [f for f in image_files if f not in referenced_images]

    if unreferenced_images:
        warnings.append(
            f"Unreferenced images in folder ({len(unreferenced_images)}): " +
            ', '.join(unreferenced_images[:5]) +
            (' ...' if len(unreferenced_images) > 5 else '')
        )

    return errors, warnings

# ============================================================================
# METADATA GENERATION
# ============================================================================

def extract_attributes(row):
    """Extract attributes from CSV row, omitting empty values"""
    attributes = []

    for column in row.index:
        # Skip excluded columns
        if column in CONFIG['exclude_columns']:
            continue

        # Extract attribute name from "attributes[...]" format
        if column.startswith('attributes[') and column.endswith(']'):
            trait_type = column[11:-1]  # Extract name between brackets
            value = row[column]

            # Only include non-empty values
            if pd.notna(value) and str(value).strip() != '':
                attributes.append({
                    'trait_type': trait_type,
                    'value': str(value).strip()
                })

    return attributes

def generate_metadata(row):
    """Generate metadata JSON for a single token"""
    token_id = row[CONFIG['token_id_column']]
    image_filename = row[CONFIG['image_filename_column']]
    attributes = extract_attributes(row)

    # Build metadata object
    metadata = {
        'name': str(row[CONFIG['name_column']]),
        'description': str(row[CONFIG['description_column']]),
        'image': f"ipfs://{CONFIG['images_cid_placeholder']}/{image_filename}",
        'attributes': attributes
    }

    # Add external_url if present
    if CONFIG['external_url_column'] in row.index and pd.notna(row[CONFIG['external_url_column']]):
        metadata['external_url'] = str(row[CONFIG['external_url_column']])

    return metadata

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    is_dry_run = '--dry-run' in sys.argv

    log_section(f"UniWorlds NFT Metadata Generator {'(DRY RUN)' if is_dry_run else ''}")

    # -------------------------------------------------------------------------
    # 1. READ CSV
    # -------------------------------------------------------------------------

    log_section('Step 1: Reading CSV')

    if not os.path.exists(CONFIG['csv_path']):
        log(f"CSV file not found: {CONFIG['csv_path']}", 'error')
        sys.exit(1)

    df = pd.read_csv(CONFIG['csv_path'])
    log(f"Loaded {len(df)} records from {CONFIG['csv_path']}", 'success')
    log(f"Columns: {', '.join(df.columns.tolist())}")

    # -------------------------------------------------------------------------
    # 2. VALIDATE CSV
    # -------------------------------------------------------------------------

    log_section('Step 2: Validating CSV Structure')

    csv_errors, csv_warnings = validate_csv_structure(df)

    for warning in csv_warnings:
        log(warning, 'warn')

    if csv_errors:
        for error in csv_errors:
            log(error, 'error')
        sys.exit(1)

    log('CSV structure validation passed', 'success')

    # -------------------------------------------------------------------------
    # 3. VALIDATE IMAGES
    # -------------------------------------------------------------------------

    log_section('Step 3: Validating Images')

    img_errors, img_warnings = validate_images(df)

    for warning in img_warnings:
        log(warning, 'warn')

    if img_errors:
        for error in img_errors:
            log(error, 'error')
        sys.exit(1)

    log('Image validation passed', 'success')

    # -------------------------------------------------------------------------
    # 4. GENERATE METADATA
    # -------------------------------------------------------------------------

    if is_dry_run:
        log_section('Step 4: Dry Run Complete')
        log('All validations passed!', 'success')
        log(f'Ready to generate {len(df)} metadata JSON files')
        log('')
        log('Run without --dry-run flag to generate files:', 'info')
        log('  python generate_metadata.py', 'info')
        return

    log_section('Step 4: Generating Metadata Files')

    # Create output folder
    os.makedirs(CONFIG['output_folder'], exist_ok=True)
    log(f"Created output folder: {CONFIG['output_folder']}")

    success_count = 0
    error_count = 0

    for idx, row in df.iterrows():
        try:
            token_id = row[CONFIG['token_id_column']]
            metadata = generate_metadata(row)
            output_path = os.path.join(CONFIG['output_folder'], f"{token_id}.json")

            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)

            success_count += 1

            if success_count % 100 == 0:
                log(f"Generated {success_count}/{len(df)} files...")

        except Exception as e:
            error_count += 1
            log(f"Failed to generate metadata for token {row[CONFIG['token_id_column']]}: {str(e)}", 'error')

    # -------------------------------------------------------------------------
    # 5. FINAL SUMMARY
    # -------------------------------------------------------------------------

    log_section('Summary')

    log(f"Successfully generated: {success_count} files", 'success')

    if error_count > 0:
        log(f"Failed: {error_count} files", 'error')

    log('')
    log('Next steps:', 'info')
    log('1. Upload images/ folder to NFT.Storage → get IMAGES_CID', 'info')
    log('2. Run: python patch_cid.py <IMAGES_CID>', 'info')
    log('3. Upload metadata/ folder to NFT.Storage → get METADATA_CID', 'info')
    log('4. Set contract baseURI to: ipfs://<METADATA_CID>/', 'info')

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)
