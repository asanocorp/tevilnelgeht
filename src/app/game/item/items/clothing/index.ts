import { ItemConfig } from '../../item-config';
import { ItemDefinitions } from '../../item-definitions';

const itemIds = [
  ItemDefinitions.ItemId.Boots,
  ItemDefinitions.ItemId.Pants,
  ItemDefinitions.ItemId.Gloves,
  ItemDefinitions.ItemId.Sandals,
  ItemDefinitions.ItemId.Shirt,
  ItemDefinitions.ItemId.Shoes,
  ItemDefinitions.ItemId.Shorts,
  ItemDefinitions.ItemId.Vest
];

const itemConditions = [
  '',
  ItemDefinitions.ItemCondition.Exquisite,
  ItemDefinitions.ItemCondition.Fine,
  ItemDefinitions.ItemCondition.Ragged,
  ItemDefinitions.ItemCondition.Worn
];

export const clothing: { [itemId: string]: ItemConfig } = {};

itemIds.forEach(itemId => generateItemConfigs(require('./' + itemId)));

function generateItemConfigs(base: ItemConfig): void {
  itemConditions.forEach(condition => {
    const id = condition ? (condition + '-' + base.itemId) : base.itemId;
    const texture = {
      ...base.texture,
      data: copyTextureData(base.texture.data, base.texture.colorPaletteIndex[condition]),
      key: id
    };

    clothing[id] = { ...base, texture, itemId: id, condition };
  });
}

function copyTextureData(data: string[], colorPaletteIndex: string): string[] {
  const newData = data.map(row => '.' + row.slice().replace(/\*/g, colorPaletteIndex) + '.');
  newData.unshift('.'.repeat(newData[0].length));
  newData.push('.'.repeat(newData[0].length));
  return newData;
}
