import {defineStore} from 'pinia'
// import {
//      requestGetToDoByPage
//   } from '../services/todoService';
export const useTodosStore = defineStore({
    id: 'todo',
    state:() => ({
        todos: [],
        chosenTodo: {} | undefined
    }),
    // getters: {
    //     getTodoUser :(state) => {
    //         return(authorId) => state.todos.filter((todo) => todo.owner === authorId)
    //     }
    // },
    actions : {
        // async getAllByPage(){
        //      this.todos = [];
        //   try {
        //     const res = await requestGetToDoByPage();
        //     this.todos = res.data;  
        //   } catch (error) {
        //      console.log(error);
        //   }  
        // },
        findTodoPage(data) {
            this.todos = data;
        },
        getChosenTodo(id) {
            this.chosenTodo = this.todos.find(todo => todo._id === id)
        }
        // deleteTodo(id) {
        //     this.todos = this.todos.filter(todo => todo._id !== id)
        // },
        // addTodo(data) {
        //     this.todos = this.todos.push(data);
        // }
    
    }
}
    
)