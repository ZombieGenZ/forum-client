<script setup lang="ts">
import HeaderComponent from './components/HeaderComponent.vue'
import { provide, ref, onMounted } from 'vue'
import { RESPONSE_CODE } from './constants/responseCode.constants.ts'
import HTTPSTATUS from './constants/httpStatus.constants.ts'
import { UserType } from './schemas/users.shemas.ts'
const user = ref<{ isLogin: boolean; account?: UserType }>()

let timeout
const access_token = localStorage.getItem('access_token')
const refresh_token = localStorage.getItem('refresh_token')
const getUserInfo = async () => {
  await fetch(`${import.meta.env.VITE_API_UR}/api/users/get-user-infomation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
    }),
  })
    .then((res) => {
      if (res.status === HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        user.value = {
          isLogin: false,
        }
        return Promise.reject()
      }
      return res.json()
    })
    .then((data) => {
      if (data.code === RESPONSE_CODE.AUTHENTICATION_FAILED) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            user.value = {
              isLogin: false,
            }
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.GET_USER_INFOMATION_SUCCESSFUL) {
        user.value = {
          isLogin: true,
          account: data.account,
        }
        return
      }
    })
}

if (!access_token || !refresh_token) {
  user.value = {
    isLogin: false,
  }
} else {
  getUserInfo()
}

onMounted(() => {
  if (!access_token || !refresh_token) {
    clearTimeout(timeout)
    user.value = {
      isLogin: false,
    }
  } else {
    timeout = setTimeout(getUserInfo, 60000)
  }
})

provide('userData', user)
</script>

<template>
  <div>
    <HeaderComponent v-if="!$route.path.startsWith('/management')"></HeaderComponent>
    <router-view></router-view>
  </div>
</template>
