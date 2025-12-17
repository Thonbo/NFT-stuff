# ✅ Simple Checklist - Print This!

Use this checklist to track your progress. Check off each box as you complete it.

---

## 🔧 One-Time Setup

- [ ] Install Node.js from https://nodejs.org/
- [ ] Restart computer after installing Node.js
- [ ] Open PowerShell in project folder
- [ ] Run: `npm install`

---

## 📁 Prepare Files

- [ ] Create `images` folder in project
- [ ] Copy all 1,337 PNG files into `images` folder
- [ ] Verify filenames match CSV exactly (check 5-10 random ones)

---

## ✅ Validate & Generate

- [ ] Run: `npm run dry-run`
- [ ] Fix any errors if they appear
- [ ] Run `dry-run` again until no errors
- [ ] Run: `npm run generate`
- [ ] Confirm `metadata` folder was created
- [ ] Verify it has 1,337 JSON files (check file count)

---

## ☁️ Upload Images to IPFS

- [ ] Sign up at Pinata.cloud (or another IPFS service)
- [ ] Upload entire `images` folder
- [ ] Wait for upload to complete
- [ ] Copy the IMAGES_CID (write it here: ________________________)
- [ ] Test one image URL: `https://ipfs.io/ipfs/YOUR_CID/Aam_115.png`

---

## 🔗 Patch Metadata

- [ ] Run: `node patch-cid.js QmYourImagesCID`
- [ ] Confirm: "Patched: 1337 files" message appears
- [ ] Open a random JSON file in `metadata` folder
- [ ] Verify the `image` field has your real CID (not `__PLACEHOLDER__`)

---

## ☁️ Upload Metadata to IPFS

- [ ] Go back to Pinata.cloud
- [ ] Upload entire `metadata` folder
- [ ] Wait for upload to complete
- [ ] Copy the METADATA_CID (write it here: ________________________)
- [ ] Test metadata URL: `https://ipfs.io/ipfs/YOUR_METADATA_CID/1.json`

---

## 🎯 Update Smart Contract

- [ ] Find your contract on PolygonScan (via OpenSea collection page)
- [ ] Go to "Write Contract" section
- [ ] Connect owner wallet
- [ ] Find `setBaseURI` function
- [ ] Set to: `ipfs://YOUR_METADATA_CID/` ⚠️ Don't forget the `/` at end!
- [ ] Submit transaction
- [ ] Wait for transaction to confirm

---

## 🎉 Verify It Worked

- [ ] Wait 30-60 minutes for OpenSea to update
- [ ] Go to: https://opensea.io/collection/uniworlds
- [ ] Click on token #1 - verify image and metadata show
- [ ] Click on token #870 - verify image and metadata show
- [ ] Click on token #1337 - verify image and metadata show
- [ ] Check 5-10 random tokens
- [ ] Celebrate! 🎉

---

## 📝 Important Info to Save

**Images CID:** _______________________________________________

**Metadata CID:** _______________________________________________

**Date Uploaded:** _______________________________________________

**Contract Address:** _______________________________________________

**PolygonScan Link:** _______________________________________________

---

## 🆘 If Something Goes Wrong

**Most common issues:**

1. **"npm not found"**
   - Solution: Install Node.js, restart computer, try again

2. **"Missing images" error**
   - Solution: Make sure all PNG files are in `images` folder

3. **"Can't find metadata.csv"**
   - Solution: Make sure you're in the right folder (should see metadata.csv)

4. **OpenSea not updating**
   - Solution: Wait longer (can take 1 hour), use "Refresh Metadata" button

5. **Wrong CID used**
   - Solution: Run patch command again with correct CID

---

**Stuck? Check START_HERE.md for detailed instructions!**
