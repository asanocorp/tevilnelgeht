enum ClassId {
  Cleric = 'cleric',
  Fighter = 'fighter',
  Mage = 'mage',
  Thief = 'thief'
}

export class ClassDefinitions {
  public static readonly playableClassIds = [ClassId.Cleric, ClassId.Fighter, ClassId.Mage, ClassId.Thief] as string[];

  public static readonly ClassId = ClassId;
}
