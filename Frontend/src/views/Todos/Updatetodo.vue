<template>
  <div>
    <div class="flex w-full h-20 bg-cyan-200 border-b border-r-2">
      <img src="../../assets/images/lg.jpg" class=" w-28 h-full">
      <h2 class="text-3xl text-center text-purple-700 font-serif font-bold mt-5 ml-8">
        List Todos
      </h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-6">
        <div class="intro-y mx-1 box p-5">
          <h1 class="text-2xl text-center font-serif  text-purple-700">
            Form update todo
          </h1>
          <div>
            <input
              id="crud-form-1"
              type="text"
              v-model="title"
              @keyup.enter="actionUpdateTodo()"
              class="w-full border-1 border-neutral-200 rounded-md mt-4"
              placeholder="Edit title"
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
            <button
              class="btn h-8 mr-1 mb-2 rounded-lg font-serif text-white bg-purple-500 hover:bg-purple-700"
              @click="actionUpdateTodo()"
            >
              Update
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import {
  requestFindToDoUpdate,
  requestUpdateToDo
} from '../../services/todoService';

export default {
  name: 'Updatetodo',
  setup() {
    const router = useRouter();
    const title = ref('');
    const route = useRoute();
    const updateTodoId = ref('');

    const actionUpdateTodo = async () => {
      try {
        const todoUpdate = {
          _id: updateTodoId.value,
          title: title.value
        };
        const res = await requestUpdateToDo(todoUpdate);
        router.push('/todolist');
      } catch (error) {
        console.log(error);
      }
      title.value = '';
    };

    // tìm title tương ứng theo id
    const findTodoUpdate = async () => {
      try {
        const res = await requestFindToDoUpdate(route.params.id);
        title.value = res.data.data.title;
        updateTodoId.value = res.data.data._id;
      } catch (error) {
        console.log(error);
      }
    };
    onMounted(() => {
      findTodoUpdate();
    });
    return {
      router,
      title,
      actionUpdateTodo
    };
  }
};
</script>
