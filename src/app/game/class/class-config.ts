export interface ClassConfig {
  classId: string;
  level?: number;
  properName: string;
  properNamePlural: string;
  restrictions: { abilities: { ability: string; score: number; bound: string; }[]; };
  hitDie: number;
}
