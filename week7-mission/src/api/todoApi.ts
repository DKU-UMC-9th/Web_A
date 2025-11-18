import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

// Mock database
let todos: Todo[] = [
  { id: 1, title: 'React Query 학습하기', completed: false, createdAt: new Date() },
  { id: 2, title: 'useMutation 적용하기', completed: false, createdAt: new Date() },
  { id: 3, title: 'Optimistic Update 구현하기', completed: false, createdAt: new Date() },
];

let nextId = 4;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const todoApi = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    await delay(500); // Simulate network delay
    return [...todos];
  },

  // Create a new todo
  createTodo: async (input: CreateTodoInput): Promise<Todo> => {
    await delay(800); // Simulate network delay
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to create todo');
    }

    const newTodo: Todo = {
      id: nextId++,
      title: input.title,
      completed: false,
      createdAt: new Date(),
    };
    
    todos.push(newTodo);
    return newTodo;
  },

  // Update a todo
  updateTodo: async (input: UpdateTodoInput): Promise<Todo> => {
    await delay(600); // Simulate network delay
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to update todo');
    }

    const index = todos.findIndex(t => t.id === input.id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    todos[index] = {
      ...todos[index],
      ...input,
    };

    return todos[index];
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<void> => {
    await delay(600); // Simulate network delay
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Failed to delete todo');
    }

    todos = todos.filter(t => t.id !== id);
  },
};
