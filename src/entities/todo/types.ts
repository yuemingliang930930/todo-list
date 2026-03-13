export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  listId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
