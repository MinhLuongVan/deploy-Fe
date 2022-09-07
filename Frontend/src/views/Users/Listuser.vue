<template>
  <div class="bg-orange-200 h-screen">
    <div class="flex justify-between h-20 bg-cyan-200 border-b border-r-2">
      <div class="flex ">
        <img src="../../assets/images/lg.jpg" class=" w-28 h-full">
        <h2 class="text-3xl text-indigo-700 font-serif font-bold mt-5 ml-2">
          List User
        </h2>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center justify-center mt-2"
      >
       <button
          class="w-24 h-8 bg-purple-500 hover:bg-purple-700 text-white font-serif text-base shadow-md mr-2 rounded-xl"
          @click="router.push('/todolist')"
        >
          Todo
        </button>
       
        <button
          class="w-24 h-8 bg-purple-500 hover:bg-purple-700 text-white font-serif text-base shadow-md mr-2 rounded-xl"
          @click="router.push('/adduser')"
        >
          Add User
        </button>
      </div>
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center justify-center"
      >
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="intro-y col-span-12 lg:overflow-visible">
      <table class="table table-report -mt-2 mr-3">
        <thead>
          <tr>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Username
            </th>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Admin
            </th>
            <th
              class="text-center text-xl font-serif text-purple-700 whitespace-nowrap"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id" class="intro-x">
            <td class="text-lg text-center w-96">
              <p class="font-medium w-full text-purple-500">
                {{ user.username }}
              </p>
            </td>

            <td class="text-lg text-center w-96">
              <p class="font-medium w-full text-purple-500">
                {{ user.isAdmin }}
              </p>
            </td>

            <td class="text-lg w-96">
              <div class="flex justify-center items-center">
                <a
                  class="flex items-center text-green-500"
                  @click="handlUpdate(user)"
                >
                  <CheckSquareIcon class="w-5 h-5 mr-5" />
                </a>
                <a
                  class="flex items-center text-danger"
                  @click="actionDeleteModal(user._id)"
                >
                  <Trash2Icon class="w-5 h-5 mr-2" />
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
       <Modal
    :show="deleteConfirmationModal"
    @hidden="deleteConfirmationModal = false"
  >
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5 text-purple-700 font-serif">Are you sure?</div>
        <div class=" mt-2 text-purple-700 font-serif">
          Do you really want to delete this content? 
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click="deleteConfirmationModal = false"
          class=" w-24 h-9 border-2 rounded-lg mr-1"
        >
          Cancel
        </button>
        <button type="button" class=" w-24 h-9 text-white rounded-lg bg-red-500 hover:bg-red-700"
        @click="handlDelete()"
        >Delete</button>
      </div>
    </ModalBody>
  </Modal>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthorStore } from '../../stores/user';
import { useRouter } from 'vue-router';
import {
  requestDeleteUser
} from '../../services/userServices';
export default {
  name: 'Listuser',
  setup() {
    const username = ref('');
    const password = ref('');
    const userUpdate = ref();
    const router = useRouter();
    const {users,chosenUser} = storeToRefs(useAuthorStore());
    const {getAllUsers,getChosenUser  } = useAuthorStore();
    const userStore = useAuthorStore();
    const deleteConfirmationModal = ref(false);
    //get tất cả user
    onMounted(() => {
      getAllUsers();
    });

    const actionDeleteModal = (id) => {
      deleteConfirmationModal.value = true
      getChosenUser(id)
    }
    
    const handlUpdate = async (data) => {
      if (data) {
        userUpdate.value = data;
        console.log('data', data);
        username.value = data.value;
        password.value = data.value;
      }
      router.push(`/edituser/${data._id}`);
    };
    // delete user
    const handlDelete = async (id) => {
      try {
        const user = await requestDeleteUser(userStore.chosenUser._id);
        console.log('user', user);
        deleteConfirmationModal.value = false;
        getAllUsers();
      } catch (error) {
        console.log(error);
      }
    };
    return {
      users,
      username,
      password,
      router,
      getAllUsers,
      handlUpdate,
      handlDelete,
      chosenUser,
      actionDeleteModal,
      deleteConfirmationModal
 
    };
  }
};
</script>
