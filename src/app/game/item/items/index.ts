import { ItemDefinitions } from '../item-definitions';

export let items = {};

// Generate item configurations.
Object.keys(ItemDefinitions.ItemType)
  // Parse item type enumerations.
  .filter(key => { const n = parseFloat(key); return isNaN(n) || !isFinite(n); })
  // Map enumeration to item type.
  .map(key => ItemDefinitions.ItemType[key])
  // Use item type to locate data.
  .forEach(itemType => items = { ...items, ...require('./' + itemType)[itemType] });
