import { useEffect, useRef, useState } from "react";
import styles from "./TodoForm.module.css"
import { addTodoThunk, getTodosThunk, todoSelector, updateTodoThunk} from "../../redux/reducers/todoReducer";
import { useDispatch, useSelector} from "react-redux";

function TodoForm(){
    const [todoTitle,setTodoTitle] = useState("");
    const dispatch = useDispatch();
    const {todoToUpdate} = useSelector(todoSelector)
    const inputRef = useRef();


    // Effect to focus the input and set its value when there's a todo to update
    useEffect(()=>{
        if(todoToUpdate.title)
        {
            inputRef.current.focus();
            setTodoTitle(todoToUpdate.title)
        }
    },[todoToUpdate])


    // Effect to dispatch an action to get all todos when the component mounts
    useEffect(()=>{
        dispatch(getTodosThunk());
    },[])


    // Handler for form submission
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(todoToUpdate.title)
        {
            dispatch(updateTodoThunk({todoToUpdate,title : todoTitle}));  // Dispatch the updateTodo Thunk with the updated title
            setTodoTitle("");
            return;
        }
        dispatch(addTodoThunk(todoTitle)); // Dispatch the addTodo Thunk with the new title
        setTodoTitle("");
    }

    return(
        <div className={styles.todoContainer}>
            <h1>Todo</h1>
            <div className={styles.todoFormContainer}>
                <form onSubmit={handleSubmit}>
                    <input type="text" required  ref={inputRef} placeholder="Enter todo name" value={todoTitle} onChange={(e)=>setTodoTitle(e.target.value)}/>
                    <button >{todoToUpdate.title ? "Edit Todo" : "Add Todo"}</button>
                </form>
            </div>
        </div>
    )
}

export default TodoForm;