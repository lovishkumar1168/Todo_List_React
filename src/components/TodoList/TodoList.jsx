import { useDispatch, useSelector } from "react-redux";
import { deleteTodoThunk, setTodoToUpate, todoSelector, toggleStatusTodoThunk } from "../../redux/reducers/todoReducer";
import styles from "./TodoList.module.css";
import Spinner from "react-spinner-material";


function TodoList(){

    const {todos,isLoading} = useSelector(todoSelector);
    const dispatch = useDispatch();
    
    return(
        <div className={styles.todoListContainer}>
            
            {isLoading && 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}> 
                    <Spinner radius={120} color={"#333"} stroke={2} visible={true} />
                </div>}
            
            {todos.map((todo,index)=>(
                <div className={styles.todoItemContainer} key={index}>
                    <div className={styles.todoDetails}>
                        <h4 className={styles.todoTitle}>{todo.title}</h4>
                    </div>
                    <div className={styles.todoStatus}>
                        <span className={todo.completed ? styles.completed : styles.pending}>
                            {todo.completed ? "completed" : "pending"}
                        </span>
                    </div>
                    <div className={styles.todoActions}>
                        <img src="https://cdn-icons-png.flaticon.com/128/10969/10969992.png" alt="edit" onClick={()=>dispatch(setTodoToUpate(todo))}/>
                        <img src="https://cdn-icons-png.flaticon.com/128/11948/11948736.png" alt="delete" onClick={()=>dispatch(deleteTodoThunk({todo,index}))}/>
                        <button  disabled={todo.completed} className={todo.completed ? styles.markCompletedButton : styles.markPendingButton} onClick={()=>dispatch(toggleStatusTodoThunk(todo))}>{todo.completed ? "completed" : "mark as completed"}</button>
                    </div>
                </div>
            ))}

        </div>
    )
}
export default TodoList;