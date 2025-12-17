#!/usr/bin/env python3
"""
Patch IPFS CID into metadata JSON files
Run this AFTER uploading images to NFT.Storage
"""

import sys
import os
import json
from pathlib import Path

METADATA_FOLDER = 'metadata'
PLACEHOLDER = '__IMAGES_CID_PLACEHOLDER__'

def log(message, type='info'):
    prefix = {
        'info': '[INFO]',
        'success': '[✓]',
        'warn': '[WARNING]',
        'error': '[ERROR]',
    }.get(type, '[INFO]')
    print(f"{prefix} {message}")

def patch_cid(images_cid):
    print('\n' + '=' * 70)
    print('Patching IPFS CID into Metadata Files')
    print('=' * 70)

    # Validate CID format (basic check)
    if not images_cid or len(images_cid) < 10:
        log('Invalid CID provided', 'error')
        log('Usage: python patch_cid.py <IMAGES_CID>', 'error')
        log('Example: python patch_cid.py bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi', 'error')
        sys.exit(1)

    # Check metadata folder exists
    if not os.path.exists(METADATA_FOLDER):
        log(f'Metadata folder not found: {METADATA_FOLDER}', 'error')
        log('Please run generate_metadata.py first', 'error')
        sys.exit(1)

    # Get all JSON files
    json_files = sorted(
        [f for f in os.listdir(METADATA_FOLDER) if f.endswith('.json')],
        key=lambda x: int(x.replace('.json', ''))
    )

    if len(json_files) == 0:
        log('No JSON files found in metadata folder', 'error')
        sys.exit(1)

    log(f"Found {len(json_files)} metadata files")
    log(f"Replacing: {PLACEHOLDER}")
    log(f"With CID: {images_cid}")
    log('')

    patched_count = 0
    already_patched_count = 0
    error_count = 0

    for file in json_files:
        try:
            file_path = os.path.join(METADATA_FOLDER, file)

            with open(file_path, 'r', encoding='utf-8') as f:
                content = json.load(f)

            # Check if already patched
            if content.get('image') and PLACEHOLDER not in content.get('image', ''):
                already_patched_count += 1
                continue

            # Patch the CID
            if 'image' in content:
                content['image'] = content['image'].replace(PLACEHOLDER, images_cid)

                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(content, f, indent=2, ensure_ascii=False)

                patched_count += 1

                if patched_count % 100 == 0:
                    log(f"Patched {patched_count}/{len(json_files)} files...")

        except Exception as e:
            error_count += 1
            log(f"Failed to patch {file}: {str(e)}", 'error')

    print('\n' + '=' * 70)
    print('Summary')
    print('=' * 70)

    log(f"Patched: {patched_count} files", 'success')

    if already_patched_count > 0:
        log(f"Already patched: {already_patched_count} files", 'info')

    if error_count > 0:
        log(f"Errors: {error_count} files", 'error')

    log('')
    log('Next steps:', 'info')
    log('1. Verify a few metadata files manually', 'info')
    log('2. Upload metadata/ folder to NFT.Storage → get METADATA_CID', 'info')
    log('3. Set contract baseURI to: ipfs://<METADATA_CID>/', 'info')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        log('Missing CID argument', 'error')
        log('Usage: python patch_cid.py <IMAGES_CID>', 'error')
        sys.exit(1)

    images_cid = sys.argv[1]
    patch_cid(images_cid)
