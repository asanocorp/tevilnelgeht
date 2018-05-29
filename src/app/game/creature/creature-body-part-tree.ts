export interface CreatureBodyPartTreeNode {
  slots?: string[];
  children?: { [location: string]: CreatureBodyPartTreeNode; };
}

export interface CreatureBodyPartTree {
  root: string;
  [rootLocation: string]: CreatureBodyPartTreeNode | string;
}
