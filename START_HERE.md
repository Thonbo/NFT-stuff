# 🚀 START HERE - Simple Guide for Non-Technical Users

**Welcome!** I've built everything you need to reveal your UniWorlds NFT collection. Follow these simple steps - no technical knowledge required!

---

## ✅ What I've Done For You (Already Complete)

I created 3 tools that do all the hard work:

1. **Validator** - Checks if everything is correct before starting
2. **Generator** - Creates 1,337 JSON files automatically
3. **Patcher** - Updates the files with your IPFS link

All the code is saved and ready to use!

---

## 📝 What YOU Need to Do (Step by Step)

### Step 1: Install Node.js (One-Time Setup)

**If you don't have Node.js installed:**

1. Go to: https://nodejs.org/
2. Download the version that says "Recommended for Most Users"
3. Run the installer (just click "Next" through everything)
4. Restart your computer

**To check if it's installed:**
- Open **PowerShell** (search for it in Windows start menu)
- Type: `node --version`
- If you see a version number like `v18.x.x`, you're good!

---

### Step 2: Open PowerShell in Your Project Folder

1. Open Windows File Explorer
2. Navigate to your NFT project folder (where you see `metadata.csv`)
3. Click in the address bar at the top (where the folder path is shown)
4. Type: `powershell`
5. Press Enter

A blue/black window will open - this is PowerShell!

---

### Step 3: Install Required Tools (One-Time)

In the PowerShell window, type this and press Enter:

```powershell
npm install
```

**What this does:** Downloads 2 helper tools I need to read your CSV file.

**Wait time:** 10-30 seconds (you'll see progress messages)

**When it's done:** You'll see your folder path again, ready for the next command.

---

### Step 4: Add Your Images

**Before running anything, you MUST do this:**

1. Create a folder called `images` in your project folder (next to `metadata.csv`)
2. Copy ALL 1,337 PNG files into the `images` folder

**Important:** The image filenames MUST exactly match what's in your `metadata.csv` file!

Example:
- CSV says: `Aam_115.png` → Your file must be named exactly: `Aam_115.png`
- CSV says: `Remes_World.png` → Your file must be named exactly: `Remes_World.png`

---

### Step 5: Test Everything (Dry Run)

In PowerShell, type:

```powershell
npm run dry-run
```

**What this does:** Checks everything WITHOUT creating any files yet.

**This checks:**
- ✅ You have exactly 1,337 rows in your CSV
- ✅ All token IDs are 1 to 1337 (no missing numbers)
- ✅ All 1,337 image files exist
- ✅ Image filenames match your CSV

**If you see errors:**
- Read the error message - it will tell you exactly what's wrong
- Common issues: Missing images, wrong filenames, CSV problems
- Fix the issue and run `npm run dry-run` again

**When successful, you'll see:**
```
[✓] CSV structure validation passed
[✓] Image validation passed
[✓] All validations passed!
[INFO] Ready to generate 1337 metadata JSON files
```

---

### Step 6: Generate Your Metadata Files

Once dry-run passes, generate the actual files:

```powershell
npm run generate
```

**What this does:** Creates a `metadata` folder with 1,337 JSON files (one per NFT).

**Wait time:** About 5-10 seconds

**When done, you'll see:**
```
[✓] Successfully generated: 1337 files

[INFO] Next steps:
[INFO] 1. Upload images/ folder to IPFS → get IMAGES_CID
[INFO] 2. Run: node patch-cid.js <IMAGES_CID>
[INFO] 3. Upload metadata/ folder to IPFS → get METADATA_CID
[INFO] 4. Set contract baseURI to: ipfs://<METADATA_CID>/
```

**You now have:**
- `metadata/1.json` (token #1 info)
- `metadata/2.json` (token #2 info)
- ...
- `metadata/1337.json` (token #1337 info)

---

### Step 7: Upload Images to IPFS

**What is IPFS?** It's like Google Drive, but for blockchain/NFT files.

**Recommended service:** Pinata (free account works!)

1. Go to: https://pinata.cloud/
2. Sign up for a free account
3. Click **"Upload"** → **"Folder"**
4. Select your entire `images` folder (all 1,337 PNGs)
5. Wait for upload (may take 10-20 minutes depending on file size)

**When done:**
- You'll see a **CID** (a long code like: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`)
- **COPY THIS CID** - you need it for the next step!

**Test it works:**
- Go to: `https://ipfs.io/ipfs/YOUR_CID/Aam_115.png`
- Replace `YOUR_CID` with the actual CID you got
- You should see one of your planet images!

---

### Step 8: Patch the IPFS Link Into Your Metadata

Now that your images are on IPFS, update your metadata files:

In PowerShell, type:

```powershell
node patch-cid.js QmYourActualCIDHere
```

**Replace `QmYourActualCIDHere` with your real IPFS CID from Step 7!**

**Example:**
```powershell
node patch-cid.js QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
```

**What this does:** Updates all 1,337 JSON files to point to your images on IPFS.

**When done:**
```
[✓] Patched: 1337 files

[INFO] Next steps:
[INFO] 1. Verify a few metadata files manually
[INFO] 2. Upload metadata/ folder to IPFS → get METADATA_CID
[INFO] 3. Set contract baseURI to: ipfs://<METADATA_CID>/
```

---

### Step 9: Upload Metadata to IPFS

Almost done! Now upload your metadata:

1. Go back to Pinata: https://pinata.cloud/
2. Click **"Upload"** → **"Folder"**
3. Select your entire `metadata` folder (all 1,337 JSON files)
4. Wait for upload (should be faster than images - just a few minutes)

**When done:**
- You'll get another **CID** (different from the images CID)
- **COPY THIS CID** - this is your METADATA_CID!

**Test it works:**
- Go to: `https://ipfs.io/ipfs/YOUR_METADATA_CID/1.json`
- Replace `YOUR_METADATA_CID` with the actual CID
- You should see JSON data for token #1!

---

### Step 10: Update Your Smart Contract

**Final step!** Connect your contract to the metadata:

You need to call a function on your smart contract that sets the "baseURI" to:

```
ipfs://YOUR_METADATA_CID/
```

**IMPORTANT:** Don't forget the `/` at the end!

**How to do this depends on your contract:**

**Option A: If your contract has an "owner" function on PolygonScan:**
1. Go to your contract on PolygonScan (find it from OpenSea collection page)
2. Click "Contract" → "Write Contract"
3. Connect your wallet (the owner wallet)
4. Find function like `setBaseURI` or `setBaseTokenURI`
5. Paste: `ipfs://YOUR_METADATA_CID/`
6. Click "Write" and confirm transaction

**Option B: Ask your developer:**
If you're not sure how to do this, send your metadata CID to whoever deployed your contract. They'll know what to do!

---

## ✅ How to Know It Worked

After 10-30 minutes, check OpenSea:

1. Go to: https://opensea.io/collection/uniworlds
2. Click on any token
3. You should see:
   - The planet image (not the placeholder)
   - The name (e.g., "Remes World")
   - The traits (Type, Civilization Tier, etc.)

If images don't update immediately:
- Wait 30-60 minutes (OpenSea caches metadata)
- Try the "Refresh Metadata" button on individual tokens
- Check that your contract's baseURI is set correctly

---

## 🆘 Common Problems & Solutions

### "Images not found" error
**Fix:** Make sure all PNG files are in the `images` folder with exact filenames from CSV

### "npm command not found"
**Fix:** Install Node.js (see Step 1) and restart PowerShell

### OpenSea still shows placeholder
**Fix:** Wait 30-60 minutes, or click "Refresh Metadata" on each token

### Wrong CID in metadata files
**Fix:** Run the patch command again with the correct CID - it's safe to run multiple times

### Can't find my project folder
**Fix:** Look for the folder that has `metadata.csv` in it

---

## 📞 Quick Reference Commands

**Open PowerShell in your folder:**
- File Explorer → Click address bar → Type `powershell` → Enter

**One-time setup:**
```powershell
npm install
```

**Check everything (safe, doesn't create files):**
```powershell
npm run dry-run
```

**Create metadata files:**
```powershell
npm run generate
```

**Update with IPFS link:**
```powershell
node patch-cid.js QmYourImagesCID
```

---

## 🎉 That's It!

You're ready to reveal your UniWorlds collection!

**Remember:**
1. Always run `dry-run` first
2. Keep your CIDs saved somewhere safe
3. Double-check everything before updating the contract
4. Be patient - IPFS and OpenSea need time to update

Good luck! 🌍✨
