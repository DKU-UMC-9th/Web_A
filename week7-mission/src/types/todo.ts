export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  id: number;
  title?: string;
  completed?: boolean;
}
