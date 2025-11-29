import { useState } from 'react';
import type { TTodo } from '../types/todo';

const Todo = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  // 할 일 추가
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInput(''); // 입력창 비우기
    }
  };

  // 할 일 완료 -> 완료 리스트로 이동
  const handleComplete = (id: number) => {
    const completed = todos.find((todo) => todo.id === id);
    if (completed) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setDoneTodos((prev) => [...prev, completed]);
    }
  };

  // 완료 항목 삭제
  const handleDelete = (id: number) => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">TODO</h1>

      {/* 입력폼 */}
      <form onSubmit={handleSubmit} className="todo-container__form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="todo-container__form--input"
          placeholder="할 일 입력"
          required
        />
        <button className="todo-container__button" type="submit">
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        {/* 할 일 목록 */}
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  style={{ backgroundColor: '#28a745' }}
                  className="render-container__item-button"
                  onClick={() => handleComplete(todo.id)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 목록 */}
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul id="completed-list" className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  style={{ backgroundColor: '#dc3545' }}
                  className="render-container__item-button"
                  onClick={() => handleDelete(todo.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todo;
