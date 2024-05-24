import { Provider } from "react-redux";
import TodoForm from "./components/TodoForm/TodoForm";
import TodoList from "./components/TodoList/TodoList";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Provider store={store}>
        <ToastContainer/>
        <TodoForm/>
        <TodoList/>
      </Provider>
    </>
  );
}

export default App;
