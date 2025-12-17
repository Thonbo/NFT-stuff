# Example Metadata Output

This shows what the generated JSON files will look like.

## File: `metadata/870.json`

```json
{
  "name": "Remes World",
  "description": "Remes World stands beneath distant suns, patient and unhurried. A lifeless rock drifting silently through space. An asteroid field encircles this mysterious planet. A multitude of moons orbit, silently accompanying this world. Spacecraft and technological marvels populate the skies, proof of advanced inhabitants.",
  "image": "ipfs://__IMAGES_CID_PLACEHOLDER__/Remes_World.png",
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

## After Patching with Images CID

After running `node patch-cid.js QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`, the file becomes:

```json
{
  "name": "Remes World",
  "description": "Remes World stands beneath distant suns, patient and unhurried. A lifeless rock drifting silently through space. An asteroid field encircles this mysterious planet. A multitude of moons orbit, silently accompanying this world. Spacecraft and technological marvels populate the skies, proof of advanced inhabitants.",
  "image": "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/Remes_World.png",
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

## Notes on Attributes

- **Atmosphere** is not present because token 870 has an empty value in that column
- Only non-empty attributes are included
- Attribute names are extracted from `attributes[...]` column headers in CSV
- This follows the OpenSea metadata standard

## How OpenSea Displays This

**Name:** Remes World

**Description:** Remes World stands beneath distant suns...

**Traits:**
- Type: Dead
- Civilization Tier: Spacefaring
- Orbital Belt: Asteroids
- Tier: Common

**Image:** Displays `Remes_World.png` from IPFS

**External Link:** Links to https://thonbo.com/uniworlds-nft
