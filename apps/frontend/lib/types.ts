export interface User {
  id: number;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  note_count: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: Category;
  created_at: string;
  updated_at: string;
}
