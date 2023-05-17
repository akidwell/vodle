export interface Deletable {
  //flag to determine if record needs to be deleted, should also hide record in UI while true
  markForDeletion: boolean;
  //hook for class if there is any need to edit before deletion
  onDelete(): void;
}
