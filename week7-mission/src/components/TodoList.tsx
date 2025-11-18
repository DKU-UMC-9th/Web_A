import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { useState } from 'react';
import './TodoList.css';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getTodos,
  });

  // Create todo mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update to the new value
      const optimisticTodo: Todo = {
        id: Date.now(), // Temporary ID
        title: newTodo.title,
        completed: false,
        createdAt: new Date(),
      };

      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old ? [...old, optimisticTodo] : [optimisticTodo]
      );

      // Return context with the snapshotted value
      return { previousTodos };
    },
    onError: (err, _newTodo, context) => {
      // Rollback to previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      alert(`작성 실패: ${err.message}`);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Update todo mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: (input: UpdateTodoInput) => todoApi.updateTodo(input),
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map(todo =>
          todo.id === updatedTodo.id
            ? { ...todo, ...updatedTodo }
            : todo
        )
      );

      return { previousTodos };
    },
    onError: (err, _updatedTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      alert(`수정 실패: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Delete todo mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically remove
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.filter(todo => todo.id !== deletedId)
      );

      return { previousTodos };
    },
    onError: (err, _deletedId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      alert(`삭제 실패: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    createMutation.mutate({ title: newTodoTitle });
    setNewTodoTitle('');
  };

  const handleToggleComplete = (todo: Todo) => {
    updateMutation.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleSaveEdit = (id: number) => {
    if (!editTitle.trim()) return;
    
    updateMutation.mutate({
      id,
      title: editTitle,
    });
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="todo-container">
      <h1>📝 Todo List</h1>
      <p className="subtitle">useMutation과 Optimistic Update 예제</p>

      <form onSubmit={handleAddTodo} className="add-form">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          className="todo-input"
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? '추가 중...' : '추가'}
        </button>
      </form>

      <div className="status-info">
        <p>💡 <strong>Optimistic Update:</strong> UI가 즉시 업데이트됩니다!</p>
        <p>⚠️ 10% 확률로 실패하여 롤백됩니다.</p>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="todo-checkbox"
              />
              
              {editingId === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(todo.id)}
                    className="save-button"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="cancel-button"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </span>
                  <div className="todo-actions">
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="edit-button"
                      disabled={updateMutation.isPending}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="delete-button"
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div className="empty-state">
          할 일이 없습니다. 새로운 할 일을 추가해보세요! 🎉
        </div>
      )}
    </div>
  );
}
