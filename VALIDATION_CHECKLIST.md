# Pre-IPFS Upload Validation Checklist

Use this checklist to ensure everything is correct before uploading to IPFS and revealing your NFT collection.

## ✅ Pre-Generation Validation

- [ ] **CSV validated**: Dry-run completed with zero errors
- [ ] **Row count correct**: CSV has exactly 1,337 data rows (plus 1 header row = 1,338 total)
- [ ] **Token IDs sequential**: All IDs from 1 to 1337 present with no gaps
- [ ] **No duplicate token IDs**: Each token ID appears exactly once
- [ ] **Images folder exists**: `images/` folder is present in project root
- [ ] **Image count correct**: Exactly 1,337 PNG files in `images/` folder
- [ ] **Filenames match CSV**: Every `file_name` in CSV matches an actual PNG file
- [ ] **No extra images**: No unreferenced images in folder (or verify they're intentional)

## ✅ Post-Generation Validation

- [ ] **Metadata folder created**: `metadata/` folder exists
- [ ] **File count correct**: Exactly 1,337 JSON files in `metadata/` folder
- [ ] **Filenames sequential**: Files named `1.json` through `1337.json` with no gaps
- [ ] **No generation errors**: Script completed with 0 errors

## ✅ Spot-Check Sample Files

Manually inspect 5-10 random JSON files:

- [ ] **Token 1** (`metadata/1.json`):
  - [ ] `name` field is correct
  - [ ] `description` is present and correct
  - [ ] `image` contains placeholder: `ipfs://__IMAGES_CID_PLACEHOLDER__/filename.png`
  - [ ] `attributes` array has expected traits
  - [ ] `external_url` is correct (if applicable)

- [ ] **Token 870** (`metadata/870.json`):
  - [ ] Matches expected output in `EXAMPLE_OUTPUT.md`
  - [ ] "Remes World" name is correct
  - [ ] Attributes: Type, Civilization Tier, Orbital Belt, Tier
  - [ ] No "Atmosphere" trait (because it's empty in CSV)

- [ ] **Token 1337** (`metadata/1337.json`):
  - [ ] Last token looks correct
  - [ ] No formatting issues

- [ ] **Random tokens** (pick 5-10):
  - [ ] Names match CSV
  - [ ] Descriptions are unique per token
  - [ ] Image filenames match CSV `file_name` column
  - [ ] Attributes are extracted correctly
  - [ ] Empty CSV columns are excluded from attributes

## ✅ JSON Structure Validation

Pick a few files and verify structure:

```json
{
  "name": "...",
  "description": "...",
  "image": "ipfs://__IMAGES_CID_PLACEHOLDER__/...",
  "attributes": [
    { "trait_type": "...", "value": "..." }
  ],
  "external_url": "..."
}
```

- [ ] All required fields present: `name`, `description`, `image`, `attributes`
- [ ] `attributes` is an array of objects with `trait_type` and `value`
- [ ] No syntax errors (valid JSON)
- [ ] Proper indentation (2 spaces)

## ✅ IPFS Upload Validation

### After Uploading Images

- [ ] **Images uploaded**: `images/` folder uploaded to IPFS
- [ ] **Images CID obtained**: CID recorded (e.g., `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`)
- [ ] **Test image URL**: Verify at least 3 images load via IPFS gateway:
  - [ ] `https://ipfs.io/ipfs/<IMAGES_CID>/Aam_115.png` loads correctly
  - [ ] `https://ipfs.io/ipfs/<IMAGES_CID>/Remes_World.png` loads correctly
  - [ ] `https://ipfs.io/ipfs/<IMAGES_CID>/<random_filename>.png` loads correctly

### After Patching CID

- [ ] **Patch script run**: `node patch-cid.js <IMAGES_CID>` completed successfully
- [ ] **CID patched count**: Script reports 1,337 files patched
- [ ] **Spot-check patched files**: Verify 3-5 JSON files now contain real CID (not placeholder)
- [ ] **Example token 870**: `image` field should be `ipfs://<YOUR_CID>/Remes_World.png`

### After Uploading Metadata

- [ ] **Metadata uploaded**: `metadata/` folder uploaded to IPFS
- [ ] **Metadata CID obtained**: CID recorded (e.g., `QmAbCdEf123456789...`)
- [ ] **Test metadata URL**: Verify at least 3 token metadata loads:
  - [ ] `https://ipfs.io/ipfs/<METADATA_CID>/1.json` returns valid JSON
  - [ ] `https://ipfs.io/ipfs/<METADATA_CID>/870.json` returns valid JSON
  - [ ] `https://ipfs.io/ipfs/<METADATA_CID>/1337.json` returns valid JSON
- [ ] **Check image links**: Open a few metadata JSONs and verify the `image` URLs resolve

## ✅ Smart Contract Update

- [ ] **Base URI set**: Contract `baseURI` updated to `ipfs://<METADATA_CID>/`
- [ ] **Test on-chain**: Call `tokenURI(1)` on contract
  - [ ] Returns: `ipfs://<METADATA_CID>/1.json`
- [ ] **Test via OpenSea**: View a token on OpenSea testnet/mainnet
  - [ ] Metadata loads correctly
  - [ ] Image displays
  - [ ] Attributes show correctly

## ✅ Final Pre-Reveal Checklist

Before revealing to the public:

- [ ] **Test on Polygon testnet first** (Mumbai) if possible
- [ ] **Verify OpenSea metadata refresh** works (force refresh on a few tokens)
- [ ] **Check multiple IPFS gateways**:
  - [ ] `https://ipfs.io/ipfs/<CID>/...`
  - [ ] `https://gateway.pinata.cloud/ipfs/<CID>/...`
  - [ ] `https://cloudflare-ipfs.com/ipfs/<CID>/...`
- [ ] **Pin on multiple services** (Pinata + backup service)
- [ ] **Test token transfer**: Transfer a token and verify metadata persists
- [ ] **Rarity tools compatible**: Ensure attributes format works with rarity scanners
- [ ] **Mobile view test**: View on OpenSea mobile app
- [ ] **Share preview**: Send preview links to team/trusted community members

## ✅ Post-Reveal Monitoring

After reveal:

- [ ] **Monitor OpenSea**: Check that tokens are updating (may take 10-30 minutes)
- [ ] **Watch IPFS metrics**: Ensure high availability (>95% uptime on Pinata)
- [ ] **Check community feedback**: Monitor Discord/Twitter for any display issues
- [ ] **Verify rarity tools**: Check if sites like rarity.tools can index your collection
- [ ] **Test purchasing flow**: Verify full purchase → transfer → display works

## Common Issues to Watch For

### ❌ Issue: Metadata not updating on OpenSea
**Fix:** Use OpenSea's force refresh feature per token, or wait 30-60 minutes

### ❌ Issue: Images not loading
**Fix:** Verify IPFS gateway is accessible, check CID patching was successful

### ❌ Issue: Attributes missing or wrong
**Fix:** Verify CSV columns, regenerate metadata, re-upload

### ❌ Issue: Token URI returns 404
**Fix:** Check contract baseURI format (must end with `/`), verify IPFS CID

### ❌ Issue: Slow IPFS loading
**Fix:** Ensure content is pinned on multiple nodes, use dedicated gateway

## Emergency Rollback Plan

If major issues are found post-reveal:

1. **Do not panic** - Metadata can be updated
2. **Identify the issue** - Wrong attributes? Missing images? Wrong CID?
3. **Fix locally** - Regenerate or patch metadata files
4. **Re-upload to IPFS** - Get new METADATA_CID
5. **Update contract** - Set new baseURI (requires owner privileges)
6. **Notify community** - Transparent communication is key
7. **Force OpenSea refresh** - May need to contact OpenSea support for bulk refresh

## Resources

- **OpenSea Metadata Standards**: https://docs.opensea.io/docs/metadata-standards
- **IPFS Documentation**: https://docs.ipfs.tech/
- **Pinata Support**: https://docs.pinata.cloud/
- **Contract on PolygonScan**: [Link from OpenSea]

---

**Pro Tip:** Create a backup of your `metadata/` folder after patching the CID. Store it securely in case you need to re-upload to IPFS.
