<script setup lang="ts">
import { ref, inject, watch } from 'vue'
const userData = ref<{ isLogin: boolean; account?: UserType }>()
import { UserRoleEnum } from '../constants/users.constants.ts'
const user = inject('userData')

watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      userData.value = newUser
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="d-flex flex-column bg-dark text-white vh-100 overflow-y-auto"
    style="width: min(250px, 80vw)"
  >
    <router-link to="/" class="text-decoration-none text-center mb-3">
      <h3 class="my-4 fs-4 fw-bold text-white">Khoa's Blog</h3>
    </router-link>
    <ul class="nav flex-column flex-grow-1 px-3">
      <li class="nav-item" v-if="userData?.account.user_role == UserRoleEnum.ADMINISTRATOR">
        <router-link
          to="/management/topics"
          class="nav-link text-white rounded py-2 px-3 mb-2"
          :class="{ 'bg-primary': $route.path === '/management/topics' }"
          @mouseover="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @mouseout="
            (event) =>
              (event.target.style.backgroundColor =
                $route.path === '/management/topics' ? '#007bff' : 'transparent')
          "
          @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @blur="
            (event) =>
              (event.target.style.backgroundColor =
                $route.path === '/management/topics' ? '#007bff' : 'transparent')
          "
          aria-current="page"
          aria-label="Quản lý chủ đề"
          >Quản lý chủ đề</router-link
        >
      </li>
      <li class="nav-item" v-if="userData?.account.user_role == UserRoleEnum.ADMINISTRATOR">
        <router-link
          to="/management"
          class="nav-link text-white rounded py-2 px-3 mb-2"
          :class="{ 'bg-primary': $route.path === '/management' }"
          @mouseover="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @mouseout="
            (event) =>
              (event.target.style.backgroundColor =
                $route.path === '/management' ? '#007bff' : 'transparent')
          "
          @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @blur="
            (event) =>
              (event.target.style.backgroundColor =
                $route.path === '/management' ? '#007bff' : 'transparent')
          "
          aria-label="Quản lý bài viết"
          >Quản lý bài viết</router-link
        >
      </li>
    </ul>
    <ul class="nav flex-column px-3 pb-3">
      <li class="nav-item dropdown">
        <button
          class="btn btn-outline-light fw-bold d-flex align-items-center w-100 text-start py-2 px-3 rounded mb-2 dropdown-toggle"
          type="button"
          id="dropdownUserButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style="border: none; color: #fff; transition: background-color 0.3s ease"
          @mouseover="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @mouseout="(event) => (event.target.style.backgroundColor = 'transparent')"
          @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
          @blur="(event) => (event.target.style.backgroundColor = 'transparent')"
          aria-label="User menu for Khoa"
        >
          <i class="bi bi-person me-2"></i> <span>{{ userData?.account.display_name }}</span>
        </button>
        <ul
          class="dropdown-menu bg-dark border border-secondary"
          aria-labelledby="dropdownUserButton"
        >
          <li>
            <router-link
              to="/profile"
              class="dropdown-item text-white py-2 px-3"
              :class="{ 'bg-primary': $route.path === '/profile' }"
              style="transition: background-color 0.3s ease"
              @mouseover="
                (event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
              "
              @mouseout="
                (event) =>
                  (event.target.style.backgroundColor =
                    $route.path === '/profile' ? '#007bff' : 'transparent')
              "
              @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
              @blur="
                (event) =>
                  (event.target.style.backgroundColor =
                    $route.path === '/profile' ? '#007bff' : 'transparent')
              "
              aria-label="Go to your profile"
              >Hồ sơ của bạn</router-link
            >
          </li>
          <li>
            <router-link
              to="/management"
              class="dropdown-item text-white py-2 px-3"
              :class="{ 'bg-primary': $route.path === '/management' }"
              style="transition: background-color 0.3s ease"
              @mouseover="
                (event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
              "
              @mouseout="
                (event) =>
                  (event.target.style.backgroundColor =
                    $route.path === '/management' ? '#007bff' : 'transparent')
              "
              @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
              @blur="
                (event) =>
                  (event.target.style.backgroundColor =
                    $route.path === '/management' ? '#007bff' : 'transparent')
              "
              aria-label="Go to management"
              >Quản lý</router-link
            >
          </li>
          <li><hr class="dropdown-divider border-secondary" /></li>
          <li>
            <router-link
              to="/logout"
              class="dropdown-item text-white py-2 px-3"
              style="transition: background-color 0.3s ease"
              @mouseover="
                (event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
              "
              @mouseout="(event) => (event.target.style.backgroundColor = 'transparent')"
              @focus="(event) => (event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')"
              @blurInk="(event) => (event.target.style.backgroundColor = 'transparent')"
              aria-label="Log out"
              >Đăng xuất</router-link
            >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
