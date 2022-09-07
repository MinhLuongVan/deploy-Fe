<template>
  <div>
    <div class="flex w-full h-20 bg-cyan-200 border-b border-r-2">
      <img src="../../assets/images/lg.jpg" class=" w-28 h-full">
      <h2 class="text-3xl text-center text-purple-700 font-serif font-bold mt-5 ml-8">
        List Todos
      </h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5 ">
      <div class="intro-y col-span-12 lg:col-span-6 ">
        <div class="intro-y mx-1 box p-5 ">
          <div>
            <h1 class="text-2xl text-center font-serif text-purple-700">
              Form add todo
            </h1>
            <input
              id="crud-form-1"
              type="text"
              v-model="title"
              @keyup.enter="handlAddTodo"
              class="w-full text-purple-700 font-serif outline-none rounded-md mt-4"
              placeholder="New todo..."
            />
          </div>

          <div class="text-right mt-5">
            <button
              type="button"
              class="border-2 w-24 h-8 rounded-lg font-serif mr-1"
              @click="router.push('/todolist')"
            >
              Cancel
            </button>
            <button class="btn h-8 mr-1 mb-2 rounded-lg font-serif text-white bg-purple-500 hover:bg-purple-700"
            @click="handlAddTodo">
              Adding
              <LoadingIcon
                icon="spinning-circles"
                color="white"
                class="w-4 h-4 ml-2"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { requestAddToDo } from '../../services/todoService';
export default {
  name: 'Addtodo',
  setup() {
    const router = useRouter();
    const title = ref('');
    const todos = ref([]);
    //create
    const handlAddTodo = async () => {
      try {
        const addToDo = {
          title: title.value
        };
        if (title.value == '') {
          alert("Vui lòng nhập đủ thông tin");
        } else {
          const res = await requestAddToDo(addToDo);
          title.value = '';
        }
      } catch (error) {
        console.log(error);
      }
      router.push('/todolist');
    };
    return {
      router,
      title,
      todos,
      handlAddTodo
    };
  }
};
</script>
