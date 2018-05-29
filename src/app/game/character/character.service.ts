import { Injectable } from '@angular/core';

import { ClassService } from '../class/class.service';
import { ClassConfig } from '../class/class-config';
import { CreatureService } from '../creature/creature.service';
import { ItemConfig } from '../item/item-config';
import { ItemService } from '../item/item.service';
import { TextureService } from '../texture/texture.service';
import { Character } from './character';

/**
 * Character service.
 */
@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  /**
   * Instantiate character service.
   *
   * @param textureService Texture service.
   * @param creatureService Creature service.
   * @param classService Class service.
   * @param itemService Item service.
   */
  public constructor(
    private textureService: TextureService,
    private creatureService: CreatureService,
    private classService: ClassService,
    private itemService: ItemService
  ) { }

  /**
   * Generate character.
   *
   * @param creatureId Creature ID.
   * @param classId Class ID.
   * @param classLevel Class level.
   * @param inventory Inventory array.
   * @param scene Phaser scene.
   */
  public generate(creatureId: string, classId: string, classLevel: number, inventory: any[], scene: Phaser.Scene): Character {
    // Get creature configuration data.
    const creatureConfig = this.creatureService.get(creatureId);

    // Get class configuration data.
    const classConfig = { ...this.classService.get(classId), level: classLevel };

    // Instantiate character with creature & class configurations.
    const character = new Character(creatureConfig, classConfig, scene, new Phaser.Curves.Path(), 0, 0);

    // Set character sprite origin.
    const textureOrigin = creatureConfig.textureOrigin;
    character.setOrigin(textureOrigin.x, textureOrigin.y);

    // Parse body data from creature configuration.
    const root = creatureConfig.bodyPartTree.root;
    const bodyData = this.parseBodyParts(root, creatureConfig.bodyPartTree[root]);

    // Setup character's item equip slots.
    bodyData.itemEquipSlots.forEach(s => character.itemEquipSlots.push(s));

    // Fill character's inventory using inventory configuration array.
    inventory.forEach(itemKeys => {
      character.inventory.push(this.itemService.get(itemKeys.itemType, itemKeys.itemId));
    });

    // Auto-equip items that correspond to empty item equip slots on character.
    character.inventory.forEach(item => {
      if (this.hasItemEquipSlotsAvailableForItem(character, item)) {
        this.equipItem(character, item);
      }
    });

    // Refresh all renderable data based on currently equipped items.
    this.refreshRenderableData(character, scene);

    return character;
  }

  /**
   * Test if character has item equip slots available for specified item.
   *
   * @param character Character.
   * @param item Item.
   */
  public hasItemEquipSlotsAvailableForItem(character: Character, item: ItemConfig): boolean {
    if (item.equipSlots) {
      const requirements = this.getItemEquipRequiredSlotsCount(item);
      const available = this.getAvailableItemEquipSlotsCount(character);
      const slots = Object.keys(requirements);

      let slotsAvailable = true;
      for (let i = 0, len = slots.length; i < len; ++i) {
        slotsAvailable = (available[slots[i]] >= requirements[slots[i]]);

        if (!slotsAvailable) {
          break;
        }
      }

      return slotsAvailable;
    }

    return false;
  }

  /**
   * Test if character has the necessary item equip slots (filled or available) for the item.
   *
   * @param character Character.
   * @param item Item.
   */
  public hasItemEquipSlotsForItem(character: Character, item: ItemConfig): boolean {
    if (item.equipSlots) {
      const requirements = this.getItemEquipRequiredSlotsCount(item);

      const all = {};
      character.itemEquipSlots.forEach(slot => all[slot] = all[slot] ? (all[slot] + 1) : 1);

      const slots = Object.keys(requirements);

      let slotsAvailable = true;
      for (let i = 0, len = slots.length; i < len; ++i) {
        slotsAvailable = (all[slots[i]] >= requirements[slots[i]]);

        if (!slotsAvailable) {
          break;
        }
      }

      return slotsAvailable;
    }

    return false;
  }

  /**
   * Get character's available item equip slots.
   *
   * @param character Character.
   */
  public getAvailableItemEquipSlots(character: Character): any[] {
    return character.itemEquipSlots.filter(s => !s.item);
  }

  /**
   * Get character's filled item equip slots.
   *
   * @param character Character.
   */
  public getFilledItemEquipSlots(character: Character): any[] {
    return character.itemEquipSlots.filter(s => s.item);
  }

  /**
   * Get character's equipped items.
   *
   * @param character Character.
   */
  public getEquippedItems(character: Character): ItemConfig[] {
    const itemFoundSet = new Set();

    return this.getFilledItemEquipSlots(character).filter(slot => {
      if (!itemFoundSet.has(slot.item)) {
        itemFoundSet.add(slot.item);
        return true;
      }

      return false;
    }).map(slot => slot.item);
  }

  /**
   * Equip character with specified item.
   *
   * @param character Character.
   * @param item Item.
   */
  public equipItem(character: Character, item: ItemConfig): void {
    if (item.equipSlots && this.hasItemEquipSlotsForItem(character, item)) {
      const requirements = this.getItemEquipRequiredSlotsCount(item);

      // Unequip current item(s) filling target item equip slots.
      Object.keys(requirements).forEach(
        slot => character.itemEquipSlots
          .filter(s => slot === s.slot)
          .slice(0, requirements[slot])
          .forEach(s => this.unEquipItem(character, s.item))
      );

      // Equip new item.
      Object.keys(requirements).forEach(slot => {
        character.itemEquipSlots.filter(s => slot === s.slot).slice(0, requirements[slot]).forEach(s => s.item = item);
      });
    }
  }

  /**
   * Unequip character of specified item.
   *
   * @param character Character.
   * @param item Item.
   */
  public unEquipItem(character: Character, item: ItemConfig): void {
    character.itemEquipSlots.forEach(slot => slot.item = slot.item === item ? undefined : slot.item);
  }

  /**
   * Refresh character's renderable data.
   *
   * @param character Character.
   * @param scene Phaser scene.
   */
  public refreshRenderableData(character: Character, scene: Phaser.Scene): void {
    const equippedItems = this.getEquippedItemsInRenderOrder(character);
    const keyPrefix = this.buildKeyPrefixFromItems(equippedItems);

    // Character creature textures with equipped items.
    const characterTextures = character.creatureConfig.textures
      // Ignore potential textures that have already been processed & created.
      .filter(texture => !scene.textures.exists(keyPrefix + texture.key))
      // Process textures with equipped items.
      .map(texture => {
        // Create new texture object with copy of data.
        texture = { ...texture, data: this.copyTextureData(texture.data) };

        // Process texture with each equipped item, accumulating result.
        equippedItems.forEach(
          item => texture = item.texture.processCreatureEquippedTextureConfig(character.creatureConfig.creatureType, texture, item)
        );

        return { ...texture, key: keyPrefix + texture.key };
      });

    // Character animations with updated texture keys.
    const characterAnimations = character.creatureConfig.animations
      // Ignore potential animations that have already been processed & created.
      .filter(animation => !character.anims.animationManager.get(keyPrefix + animation.key))
      // Process animations with updated texture keys.
      .map(animation => {
        const frames = animation.frames.map(frame => ({ key: keyPrefix + frame.key }));
        return { ...animation, frames, key: keyPrefix + animation.key };
      });

    // Update character's default texture & animation.
    const characterDefaultTexture = keyPrefix + character.creatureConfig.defaultTexture;
    const characterDefaultAnimation = keyPrefix + character.creatureConfig.defaultAnimation;

    // Generate new textures key map with updated texture keys.
    const characterTexturesKeyMap = {};
    Object.keys(character.creatureConfig.texturesKeyMap).forEach(
      key => characterTexturesKeyMap[key] = keyPrefix + character.creatureConfig.texturesKeyMap[key]
    );

    // Generate new animations key map with updated animation keys.
    const characterAnimationsKeyMap = {};
    Object.keys(character.creatureConfig.animationsKeyMap).forEach(
      key => characterAnimationsKeyMap[key] = keyPrefix + character.creatureConfig.animationsKeyMap[key]
    );

    // Apply updated renderable data to character.
    character.texturesKeyMap = characterTexturesKeyMap;
    character.animationsKeyMap = characterAnimationsKeyMap;
    character.defaultTexture = characterDefaultTexture;
    character.defaultAnimation = characterDefaultAnimation;

    // Load any new textures.
    if (characterTextures.length) {
      this.textureService.loadTextures(scene, characterTextures, this.creatureService.pixelHeight, this.creatureService.pixelWidth);
    }

    // Load any new animations.
    if (characterAnimations.length) {
      this.textureService.loadAnimations(scene, characterAnimations);
    }
  }

  /**
   * Build key prefix from specified items.
   *
   * @param items Items.
   */
  private buildKeyPrefixFromItems(items: ItemConfig[]): string {
    let keyPrefix = '';
    items.forEach(item => keyPrefix = keyPrefix.concat(item.itemId, '-'));
    return keyPrefix;
  }

  /**
   * Get item equip slots required for the specified item.
   *
   * @param item Item.
   */
  private getItemEquipRequiredSlotsCount(item: ItemConfig): { [slot: string]: number; } {
    const requirements = {};
    item.equipSlots.forEach(slot => requirements[slot] = requirements[slot] ? (requirements[slot] + 1) : 1);
    return requirements;
  }

  /**
   * Get character's available item equip slots counts.
   *
   * @param character Character.
   */
  private getAvailableItemEquipSlotsCount(character: Character): { [slot: string]: number; } {
    const available = {};
    this.getAvailableItemEquipSlots(character).forEach(s => available[s.slot] = available[s.slot] ? (available[s.slot] + 1) : 1);
    return available;
  }

  /**
   * Get character's equipped items in render order.
   *
   * @param character Character.
   */
  private getEquippedItemsInRenderOrder(character: Character): ItemConfig[] {
    // Build array of equipped items.
    const itemFoundSet = new Set();
    return this.getFilledItemEquipSlots(character)
      // Remove item equip slots that contain an already found item.
      .filter(s => {
        if (!itemFoundSet.has(s.item)) {
          itemFoundSet.add(s.item);
          return true;
        }

        return false;
      })
      // Sort item equip slots in render order.
      .sort((a, b) => {
        const aIndex = character.creatureConfig.itemEquipSlotRenderOrder.indexOf(a.slot);
        const bIndex = character.creatureConfig.itemEquipSlotRenderOrder.indexOf(b.slot);

        return aIndex - bIndex;
      })
      // Get equipped items, sorted in render order.
      .map(s => s.item);
  }

  /**
   * Copy texture data.
   *
   * @param data Texture data.
   */
  private copyTextureData(data: string[]): string[] {
    return data.map(row => row.slice());
  }

  /**
   * Parse body parts.
   *
   * @param location Body part location.
   * @param data Body part data.
   */
  private parseBodyParts(location: string, data: any): any {
    const container = {
      itemEquipSlots: []
    };

    if (Array.isArray(data.slots)) {
      // Gather item equip slots from this body part location.
      data.slots.forEach(slot => container.itemEquipSlots.push({ slot, location, item: undefined }));
    }

    if (data.children) {
      Object.keys(data.children).forEach(loc => {
        // Parse child body part locations.
        const c = this.parseBodyParts(loc, data.children[loc]);

        // Gather item equip slots from child body part locations.
        container.itemEquipSlots = container.itemEquipSlots.concat(c.itemEquipSlots);
      });
    }

    return container;
  }
}
