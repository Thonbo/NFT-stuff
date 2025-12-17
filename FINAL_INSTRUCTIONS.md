# Final Instructions - NFT Reveal

Production-ready commands to reveal your UniWorlds collection.

---

## Folder Structure

```
NFT-stuff/
├── metadata.csv              ← Your data
├── images/                   ← Add 1,337 PNGs here
├── generate_metadata.py      ← Main script
├── patch_cid.py             ← CID patcher
├── requirements.txt         ← Dependencies
├── metadata/                ← Generated (output)
└── NFT_STORAGE_GUIDE.md     ← Upload instructions
```

---

## Commands (Windows PowerShell)

### 1. Install Python Dependencies

```powershell
pip install -r requirements.txt
```

**What installs:** pandas (CSV reading)

---

### 2. Add Your Images

```powershell
# Create images folder (if not exists)
mkdir images

# Copy your 1,337 PNG files into images/
# Verify filenames match CSV exactly
```

**Check count:**
```powershell
(Get-ChildItem images\*.png).Count
# Should output: 1337
```

---

### 3. Validate Everything (Dry Run)

```powershell
python generate_metadata.py --dry-run
```

**Expected output:**
```
[✓] CSV structure validation passed
[✓] Image validation passed
[✓] All validations passed!
[INFO] Ready to generate 1337 metadata JSON files
```

**If errors:** Fix issues and run dry-run again until clean.

---

### 4. Generate Metadata

```powershell
python generate_metadata.py
```

**Expected output:**
```
[✓] Successfully generated: 1337 files

[INFO] Next steps:
[INFO] 1. Upload images/ folder to NFT.Storage → get IMAGES_CID
```

**Verify:**
```powershell
(Get-ChildItem metadata\*.json).Count
# Should output: 1337
```

---

### 5. Upload to NFT.Storage

**See NFT_STORAGE_GUIDE.md for detailed steps.**

Quick version:
1. Go to https://nft.storage/
2. Sign up (free)
3. Upload `images/` folder → copy IMAGES_CID
4. Upload `metadata/` folder → copy METADATA_CID

---

### 6. Patch Images CID

```powershell
python patch_cid.py bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

**Replace with your actual IMAGES_CID!**

**Expected output:**
```
[✓] Patched: 1337 files
```

---

### 7. Verify a Sample JSON

```powershell
cat metadata\870.json
```

**Should show:**
```json
{
  "name": "Remes World",
  "description": "...",
  "image": "ipfs://bafybeig.../Remes_World.png",
  "attributes": [...]
}
```

**Check:** `image` field should have your REAL CID (not `__PLACEHOLDER__`)

---

### 8. Update Polygon Contract

Set baseURI to:
```
ipfs://<METADATA_CID>/
```

**Via PolygonScan:**
1. Find contract on PolygonScan (from OpenSea collection page)
2. Contract tab → Write Contract
3. Connect wallet (owner)
4. Function: `setBaseURI`
5. Value: `ipfs://<METADATA_CID>/`
6. Write → Confirm transaction

---

## Example Output: Token 870

**File:** `metadata/870.json`

```json
{
  "name": "Remes World",
  "description": "Remes World stands beneath distant suns, patient and unhurried. A lifeless rock drifting silently through space. An asteroid field encircles this mysterious planet. A multitude of moons orbit, silently accompanying this world. Spacecraft and technological marvels populate the skies, proof of advanced inhabitants.",
  "image": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/Remes_World.png",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Dead"
    },
    {
      "trait_type": "Civilization Tier",
      "value": "Spacefaring"
    },
    {
      "trait_type": "Orbital Belt",
      "value": "Asteroids"
    },
    {
      "trait_type": "Tier",
      "value": "Common"
    }
  ],
  "external_url": "https://thonbo.com/uniworlds-nft"
}
```

**Notes:**
- ✅ Name from CSV (not "UniWorlds #870")
- ✅ No "Atmosphere" trait (empty in CSV)
- ✅ Image points to IPFS with real CID
- ✅ Clean attributes array

---

## You're Done Checklist

- [ ] All 1,337 PNGs in `images/` folder
- [ ] Dry run passed with zero errors
- [ ] Generated 1,337 JSON files in `metadata/` folder
- [ ] Uploaded images to NFT.Storage (got IMAGES_CID)
- [ ] Patched metadata with IMAGES_CID (verified one file)
- [ ] Uploaded metadata to NFT.Storage (got METADATA_CID)
- [ ] Updated contract baseURI on Polygon
- [ ] Waited 30-60 minutes for OpenSea to update
- [ ] Checked OpenSea - NFTs show images and traits
- [ ] Saved original files + CIDs for backup

**Status:** ✅ Collection revealed and permanent on IPFS

---

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `pip install -r requirements.txt` |
| Count images | `(Get-ChildItem images\*.png).Count` |
| Dry run | `python generate_metadata.py --dry-run` |
| Generate | `python generate_metadata.py` |
| Count JSONs | `(Get-ChildItem metadata\*.json).Count` |
| Patch CID | `python patch_cid.py <CID>` |
| View JSON | `cat metadata\870.json` |

---

## Critical Notes

**Token IDs:**
- 1-based (1, 2, 3, ... 1337)
- Files named: `1.json`, `2.json`, ..., `1337.json`

**IPFS Format:**
- Images: `ipfs://<IMAGES_CID>/<filename>.png`
- Metadata: `ipfs://<METADATA_CID>/<tokenId>.json`

**Contract baseURI:**
- MUST end with `/`
- Example: `ipfs://bafybei.../`

**Empty attributes:**
- Automatically omitted (e.g., blank Atmosphere)
- Prevents rarity calculation errors

---

**Support:** Check NFT_STORAGE_GUIDE.md for troubleshooting.
