//1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

//2. 할 일 -> Type 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo[] = [];
let doneTodos: Todo[] = [];

const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTodos.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

const getTodoText = (): string => {
    return todoInput.value.trim();
};

const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text});
    todoInput.value = '';
    renderTasks();
};

const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t):boolean => t.id !== todo.id);
    doneTodos.push(todo);
    renderTasks();
};

const deleteTodo = (todo: Todo): void => {
    doneTodos = doneTodos.filter((t):boolean => t.id !== todo.id);
    renderTasks();
};

const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('list-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('list-container__item-button');

    if(isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#e74c3c';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#2ecc71';
    }

    button.addEventListener('click', (): void => {
        if(isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};


todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();