//import { useState,  type FormEvent } from "react";
//import type { TTodo } from "../types/todo.ts";
import TodoList from "./TodoList.tsx";
import TodoForm from "./TodoForm.tsx";
import { useTodo } from "../context/TodoContext.tsx";

const Todo = () => {
    //const [input, setInput] = useState<string>('');
    const {todos, completeTodo, deleteTodo, doneTodos} = useTodo();
    
    /*const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();

        if(text) {
            addTodo(text);
            setInput('');
        }
    };*/

    

    return ( 
        <div className="todo-container">
            <h1 className="todo-container__header">jjeongu TODO</h1>
            <TodoForm />
            <div className="render-container">
                <TodoList 
                    title='To-Do' 
                    todos={todos} 
                    buttonLabel='완료'
                    buttonColor = '#28a745'
                    onClick={completeTodo} 
                />
                <TodoList 
                    title='Finished!' 
                    todos={doneTodos} 
                    buttonLabel='삭제'
                    buttonColor = '#dc3545'
                    onClick={deleteTodo} 
                />
            </div>
        </div>
    )
};

export default Todo;