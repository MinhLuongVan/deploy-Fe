<template>
  <div>
    <div class="flex w-full justify-between h-20 bg-emerald-400">
      <div class="flex">
        <img src="../../assets/images/logo3.webp" class="w-28 h-full" />
        <h2 class="text-3xl text-indigo-700 font-serif font-bold mt-5 ml-2">
          List Todos
        </h2>
      </div>
      <div>
        <Dropdown>
          <DropdownToggle>
            <UsersIcon class="w-6 h-6 mt-7 mr-8 mb-1 text-indigo-700" />
          </DropdownToggle>
          <DropdownMenu class="w-28 mb-5">
            <DropdownContent class="text-base text-purple-700">
              <DropdownItem @click="handlUser, router.push('/user')">
                <UserIcon class="w-4 h-4 mr-2" /> User
              </DropdownItem>
              <DropdownItem @click="handlLogout">
                <LogOutIcon class="w-4 h-4 mr-2" /> Logout
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center justify-center mt-2"
      >
        <button
          class="w-28 h-8 ml-5 bg-purple-500 hover:bg-purple-700 text-white font-serif text-base shadow-md mr-2 rounded-lg"
          @click="router.push('/addtodo')"
        >
          + Add Todo
        </button>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 lg:overflow-visibl">
      <table class="table table-report mt-2 mr-3">
        <thead v-if="todoHidden !== 0">
          <tr>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Title
            </th>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Status
            </th>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Actions
            </th>
          </tr>
        </thead>
        <thead v-else>
          <h1 class="text-center text-lg font-serif text-purple-700">
            Bạn chưa có công việc nào,hãy thêm công việc của bạn!
          </h1>
        </thead>
        <tbody>
          <tr v-for="item in todos" :key="item._id" class="intro-x">
            <td class="text-base text-center w-96">
              <p class="font-serif w-full text-purple-500">
                {{ item.title }}
              </p>
            </td>

            <td class="text-center border-none w-96">
              <input
                :id="'checkbox-' + item._id"
                :checked="item.status"
                type="checkbox"
                true-value="true"
                false-value="false"
                @change="clickBox(item)"
              />
            </td>

            <td class="w-96">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center text-green-500"
                  @click="handlUpdate(item)"
                >
                  <EditIcon class="w-5 h-5 ml-3 mr-5" />
                </a>
                <a
                  class="flex items-center text-danger"
                  @click="actionOpenDeleteModal(item._id)"
                >
                  <Trash2Icon class="w-5 h-5 mr-2" />
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-10" v-if="todoHidden !== 0">
        <paginate
          class="flex justify-center items-center"
          :page-count="totalPages"
          :click-handler="getToDoPage"
          :prev-text="'<<'"
          :next-text="'>>'"
          :container-class="'pagination'"
        >
        </paginate>
      </div>
      <Modal
        :show="deleteConfirmationModal"
        @hidden="deleteConfirmationModal = false"
      >
        <ModalBody class="p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-12 h-12 text-danger mx-auto mt-3" />
            <div class="text-3xl mt-5 text-purple-700 font-serif">
              Are you sure?
            </div>
            <div class="mt-2 text-purple-700 font-serif">
              Do you really want to delete this content?
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              @click="deleteConfirmationModal = false"
              class="w-24 h-8 border-2 rounded-lg mr-1"
            >
              Cancel
            </button>
            <!-- <button
              type="button"
              class="w-24 h-9 text-white rounded-lg bg-red-500 hover:bg-red-700"
              @click="handlDelete()"
            >
              Delete
            </button> -->
            <button
              class="btn h-8 rounded-lg font-serif text-white bg-red-500 hover:bg-red-700"
              @click="handlDelete"
            >
              Delete
              <LoadingIcon icon="puff" color="white" class="w-4 h-4 ml-2" />
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTodosStore } from '../../stores/todo';
import Cookies from 'js-cookie';
import Paginate from 'vuejs-paginate-next';
import {
  requestDeleteToDo,
  requestUpdateToDo,
  requestGetToDoByPage
} from '../../services/todoService';

export default {
  name: 'Todolist',
  components: {
    Paginate
  },
  setup() {
    const router = useRouter();
    const title = ref('');
    const todoUpdate = ref();
    const truevalue = ref(true);
    const falsevalue = ref(false);
    const { todos, chosenTodo } = storeToRefs(useTodosStore());
    const { findTodoPage, getChosenTodo } = useTodosStore();
    const currentPage = ref(1);
    const totalPages = ref(1);
    const deleteConfirmationModal = ref(false);
    const todoHidden = ref(0);
    const todosStore = useTodosStore();

    async function getToDoPage(page) {
      if (page === undefined) {
        currentPage.value = 1;
      } else {
        currentPage.value = page;
      }
      const res = await requestGetToDoByPage(currentPage.value);
      todoHidden.value = res.data.total;
      findTodoPage(res.data.todo);
      totalPages.value = res.data.totalPages;
    }
    onMounted(() => {
      // if (localStorage.getItem('reloaded')) {
      //   localStorage.removeItem('reloaded');
      // } else {
      //   localStorage.setItem('reloaded', '1');
      //   location.reload();
      // }
      getToDoPage();
    });
    const handlUpdate = async (data) => {
      if (data) {
        todoUpdate.value = data;
        title.value = data.value;
      }
      router.push(`/edittodo/${data._id}`);
    };

    const actionOpenDeleteModal = (id) => {
      deleteConfirmationModal.value = true;
      getChosenTodo(id);
    };
    const handlDelete = async () => {
      try {
        const todo = await requestDeleteToDo(todosStore.chosenTodo._id);
        console.log('todo1', todo);
        deleteConfirmationModal.value = false;
        getToDoPage();
      } catch (error) {
        console.log(error);
      }
    };
    async function clickBox(data) {
      if (data) {
        const checkboxItem = document.getElementById('checkbox-' + data._id);
        if (checkboxItem.checked) {
          const item = {
            _id: data._id,
            title: data.title,
            status: truevalue.value
          };
          const res = await requestUpdateToDo(item);
          if (res) {
            getToDoPage();
          }
        } else {
          const item = {
            _id: data._id,
            title: data.title,
            status: falsevalue.value
          };
          const res = await requestUpdateToDo(item);
          if (res) {
            getToDoPage();
          }
        }
      }
    }
    const handlLogout = async () => {
      try {
        await Cookies.remove('cookieRefesh');
        Cookies.remove('token');
        router.push('/');
      } catch (error) {
        console.log(error);
      }
    };

    return {
      router,
      todos,
      title,
      handlDelete,
      handlUpdate,
      handlLogout,
      getToDoPage,
      currentPage,
      totalPages,
      clickBox,
      deleteConfirmationModal,
      chosenTodo,
      actionOpenDeleteModal,
      todoHidden
    };
  }
};
</script>
<style>
.page-item {
  font-size: 14px;
  cursor: pointer;
}
</style>
