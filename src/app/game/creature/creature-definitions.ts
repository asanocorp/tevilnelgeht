import { CreatureAbilityBoundType } from './creature-ability-bound-type.enum';
import { CreatureAbility } from './creature-ability.enum';
import { CreatureAnimation } from './creature-animation.enum';
import { CreatureId } from './creature-id.enum';
import { CreatureType } from './creature-type.enum';
import { HumanoidCreatureDefinitions } from './humanoid-creature-definitions';

export class CreatureDefinitions {
  public static readonly pixelWidth = 2;

  public static readonly pixelHeight = 2;

  public static readonly playableCreatureIds = [
    CreatureId.Dwarf,
    CreatureId.Elf,
    CreatureId.Halfling,
    CreatureId.Human
  ] as string[];

  public static readonly defaultValuesByCreatureType = {
    [CreatureType.Humanoid]: HumanoidCreatureDefinitions
  };

  public static readonly CreatureId = CreatureId;

  public static readonly CreatureType = CreatureType;

  public static readonly CreatureAnimation = CreatureAnimation;

  public static readonly CreatureAbility = CreatureAbility;

  public static readonly CreatureAbilityBoundType = CreatureAbilityBoundType;
}
