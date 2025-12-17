# NFT.Storage Upload Guide

Simple, one-time upload to NFT.Storage. No subscriptions, no ongoing maintenance.

---

## Step 1: Sign Up (Free, One-Time)

1. Go to: https://nft.storage/
2. Click **"Start Storing"** → **"Sign In"**
3. Use GitHub or email to create account
4. **Free tier**: Unlimited storage for NFTs

---

## Step 2: Get API Key

1. After login, click your profile → **"API Keys"**
2. Click **"+ New Key"**
3. Name it: `UniWorlds Upload`
4. Click **"Create"**
5. **Copy the API key** (starts with `eyJhbG...`)
6. Save it somewhere safe (you'll need it once)

---

## Step 3: Upload Images Folder

### Option A: Web Interface (Easiest)

1. Go to: https://nft.storage/files/
2. Click **"Upload"** → **"Folder"**
3. Select your entire `images/` folder (1,337 PNGs)
4. Wait for upload (10-30 minutes depending on file size)
5. **Copy the CID** (looks like: `bafybeiaaaaa...`)
6. **Write it down**: IMAGES_CID = `_________________________`

### Option B: Command Line (NFTUp tool)

**Windows (PowerShell):**
```powershell
# Install NFTUp (one-time)
npm install -g nftup

# Set your API key
$env:NFT_STORAGE_TOKEN="your_api_key_here"

# Upload images folder
nftup images/

# Copy the CID from output
```

**Expected output:**
```
✅ Uploaded to IPFS
CID: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

---

## Step 4: Patch Metadata with Images CID

Replace placeholder in all JSON files:

```powershell
python patch_cid.py bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
```

**Expected output:**
```
[✓] Patched: 1337 files
```

---

## Step 5: Upload Metadata Folder

### Option A: Web Interface

1. Go to: https://nft.storage/files/
2. Click **"Upload"** → **"Folder"**
3. Select your entire `metadata/` folder (1,337 JSONs)
4. Wait for upload (faster than images - just a few minutes)
5. **Copy the CID** (different from images CID!)
6. **Write it down**: METADATA_CID = `_________________________`

### Option B: Command Line

```powershell
nftup metadata/
```

---

## Step 6: Verify Uploads

Test your URLs work:

**Test images:**
```
https://nftstorage.link/ipfs/<IMAGES_CID>/Aam_115.png
```

**Test metadata:**
```
https://nftstorage.link/ipfs/<METADATA_CID>/1.json
```

Open these in your browser - you should see your image and JSON.

---

## Step 7: Update Polygon Contract

Set your contract's `baseURI` to:

```
ipfs://<METADATA_CID>/
```

**Example with Ethers.js:**
```javascript
const tx = await contract.setBaseURI("ipfs://bafybeiabc123.../");
await tx.wait();
```

**Or via PolygonScan:**
1. Go to your contract on PolygonScan
2. Contract → Write Contract → Connect Wallet
3. Find `setBaseURI` function
4. Enter: `ipfs://<METADATA_CID>/`
5. Submit transaction

---

## ✅ You're Done

Your NFTs are now revealed on IPFS forever.

**Key points:**
- ✅ NFT.Storage is free and permanent
- ✅ Content is pinned by Filecoin network
- ✅ No ongoing maintenance required
- ✅ Decentralized and censorship-resistant

**Backup recommendation:**
- Keep original `images/` and `metadata/` folders saved locally
- Write down your CIDs somewhere safe
- That's it - no ongoing work needed

---

## Troubleshooting

**Upload fails:**
- Check internet connection
- Try web interface instead of CLI
- Verify API key is correct

**Images not loading:**
- Wait 5-10 minutes for IPFS propagation
- Try alternative gateway: `https://ipfs.io/ipfs/<CID>/...`
- Verify CID is correct

**Metadata not showing on OpenSea:**
- Wait 30-60 minutes after contract update
- Use OpenSea "Refresh Metadata" button
- Verify baseURI ends with `/`

---

## Important CIDs (Save These!)

**IMAGES_CID**: `_________________________________________`

**METADATA_CID**: `_________________________________________`

**Date Uploaded**: `_________________________________________`
