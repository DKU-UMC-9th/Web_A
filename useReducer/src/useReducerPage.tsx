import { useReducer, useState } from "react"

// 1. state에 대한 interface
interface IState {
    counter: number;
    error: string | null; 
}

// 2. reducer에 대한 interface
interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESSET_TO_ZERO';
}

function reducer(state: IState, action: IAction) {
    const { type } = action;

    switch(type) {
        case 'INCREASE': {
            return {
                ...state,
                counter: state.counter + 1
            }
        }

        case 'DECREASE': {
            return {
                ...state,
                counter: state.counter - 1
            }
        }

        case 'RESSET_TO_ZERO': {
            return {
                ...state,
                counter: 0
            }
        }


        default:
            return state;
    }
}


export default function UseReducerPage() {
    const [count, setCount] = useState(0);


    const [state, dispatch] = useReducer(reducer, {
        counter: 0,
    })

    const handleIncrease = () => {
        setCount(count + 1);
    }


    return (
        <div className="flex flex-col gap-10">
            <div>
                <h2 className="text-2xl">useState</h2>
                <h2>useState 훅 사용: {count}</h2>
                <button onClick={handleIncrease}>증가</button>
            </div>
            <div>
                <h2 className="text-2xl">useReducer</h2>
                <h2>useReducer 훅 사용: {state.counter}</h2>
                <button onClick={()  => dispatch({
                    type: 'INCREASE'
                })}>증가</button>
                <button onClick={()  => dispatch({
                    type: 'DECREASE'
                })}>감소</button>
                <button onClick={()  => dispatch({
                    type: 'RESSET_TO_ZERO'
                })}>초기화</button>
            </div>
        </div>
    )
}