import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";



/* Initial state for the todo slice */

const initialState={
    todos:[],              // List of todos
    isLoading : false,     // Loading state for async actions
    todoToUpdate : {}      // Todo item selected for update
}



/* Thunk to fetch todos from an API */

export const getTodosThunk = createAsyncThunk("todo/getTodo",async ()=>{
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    return response.json();
})


/* Thunk to add a new todo to the list */

export const addTodoThunk = createAsyncThunk("todo/addTodo",async (payload)=>{
    const response = await fetch("https://jsonplaceholder.typicode.com/todos",{
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body : JSON.stringify({
            userId: 1,
            title : payload,
            completed : false,
        }),
    });
    return response.json();
})



/* Thunk to toggle the completion status of a todo */

export const toggleStatusTodoThunk = createAsyncThunk("todo/toggleStatus",async(todo,thunkAPI)=>{
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed : !todo.completed
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    const updatedTodo = await response.json();
    thunkAPI.dispatch(updateTodoStatus({...todo,completed : updatedTodo.completed}));
    toast.success(`The task has been completed`);
})


/* Thunk to update the title of a todo */

export const updateTodoThunk = createAsyncThunk("todo/updateTodo",async({todoToUpdate,title},thunkAPI)=>{
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoToUpdate.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title : title,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    const updatedTodo = await response.json();
    thunkAPI.dispatch(updateTodoTitle({...todoToUpdate,title : updatedTodo.title}));
    toast.success(`Task title upddated ----- ${updatedTodo.title}`)
})



/* Thunk to delete a todo from the list */

export const deleteTodoThunk = createAsyncThunk("todo/deleteTodo",async ({todo,index},thunkAPI)=>{
    const userConfirmed = window.confirm(`Would you like to delete this item (${todo.title}) ??`);
    if (!userConfirmed) {
        return;
    }
    await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'DELETE',
    });
    thunkAPI.dispatch(deleteTodo(index));
    toast.success(`${todo.title} delete successfully`);
})



/* create a slice */


const todoSlice = createSlice({
    name : "todo",
    initialState,
    reducers : {
        deleteTodo : (state,action)=>{
            state.todos.splice(action.payload,1);
        },
        setTodoToUpate : (state,action)=>{
            state.todoToUpdate = {...action.payload};
        },
        updateTodoStatus : (state,action)=>{
            const index = state.todos.findIndex(todo=>todo.id===action.payload.id);
            state.todos[index].completed = !state.todos[index].completed
        },
        updateTodoTitle : (state,action)=>{
            const index = state.todos.findIndex(todo=>todo.id===action.payload.id);
            state.todos[index].title = action.payload.title;
            state.todoToUpdate = {}
        }
    },
    extraReducers:(builder)=>{
        builder
        // Handle pending state for fetching todos
        .addCase(getTodosThunk.pending,(state,action)=>{
            state.isLoading = true;
        })

        // Handle fulfilled state for fetching todos
        .addCase(getTodosThunk.fulfilled,(state,action)=>{
            state.todos = [...action.payload]
            state.isLoading = false;
        })

        // Handle fulfilled state for adding a new todo
        .addCase(addTodoThunk.fulfilled,(state,action)=>{
            state.todos.push({...action.payload});
            toast.success("added in the todolist");
        })
    }
})

/* exporting todoReducer,actions and todoSlector function */

export const todoReducer = todoSlice.reducer;
export const {deleteTodo,setTodoToUpate,updateTodoStatus,updateTodoTitle} = todoSlice.actions;
export const todoSelector = (state)=>state.todoReducer;