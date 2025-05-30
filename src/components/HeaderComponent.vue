<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()
import { isNullOrEmpty, isValidAlphanumeric } from '../utils/string.utils.ts'
import { isValidEmail } from '../utils/email.utils.ts'
import { isValidVietnameseLocalPhoneNumber } from '../utils/phone.utils.ts'
import { RESPONSE_CODE } from '../constants/responseCode.constants.ts'
import HTTPSTATUS from '../constants/httpStatus.constants.ts'
import { UserRoleEnum, UserTypeEnum } from '../constants/users.constants.ts'
import { UserType } from './schemas/users.shemas.ts'
const userData = ref<{ isLogin: boolean; account?: UserType }>()
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

// register variable
const regUsername = ref('')
const regEmail = ref('')
const regPhone = ref('')
const regPassword = ref('')
const regConfirmPassword = ref('')

// login variable
const logEmail = ref('')
const logPassword = ref('')

const registerHandle = async () => {
  if (
    isNullOrEmpty(regEmail.value) ||
    isNullOrEmpty(regUsername.value) ||
    isNullOrEmpty(regPhone.value) ||
    isNullOrEmpty(regPassword.value) ||
    isNullOrEmpty(regConfirmPassword.value)
  ) {
    if (isNullOrEmpty(regUsername.value)) {
      toast.warning('Không được bỏ trống tên người dùng')
    }

    if (isNullOrEmpty(regEmail.value)) {
      toast.warning('Không được bỏ trống địa chỉ email')
    }

    if (isNullOrEmpty(regPhone.value)) {
      toast.warning('Không được bỏ trống số điện thoại')
    }

    if (isNullOrEmpty(regPassword.value)) {
      toast.warning('Không được bỏ trống mật khẩu')
    }

    if (isNullOrEmpty(regConfirmPassword.value)) {
      toast.warning('Không được bỏ trống xác nhận mật khẩu')
    }
    return
  }

  if (!isValidAlphanumeric(regUsername.value)) {
    toast.warning('Tên người dùng chỉ được chứa chữ cái và số')
    return
  }

  if (!isValidEmail(regEmail.value)) {
    toast.warning('Địa chỉ email không hợp lệ')
    return
  }

  if (!isValidVietnameseLocalPhoneNumber(regPhone.value)) {
    toast.warning('Số điện thoại không hợp lệ')
    return
  }

  if (regPassword.value !== regConfirmPassword.value) {
    toast.warning('Mật khẩu và xác nhận mật khẩu không khớp')
    return
  }

  fetch(`${import.meta.env.VITE_API_UR}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: regUsername.value,
      email: regEmail.value,
      phone: regPhone.value,
      password: regPassword.value,
      confirm_password: regConfirmPassword.value,
    }),
  })
    .then((res) => {
      if (res.status === HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        toast.error('Lỗi khi kết nối đến máy chủ')
        return Promise.reject()
      }
      return res.json()
    })
    .then((data) => {
      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.USER_REGISTRATION_SUCCESSFUL) {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)
        regUsername.value = ''
        regEmail.value = ''
        regPhone.value = ''
        regPassword.value = ''
        regConfirmPassword.value = ''
        toast.success(data.message)
        document.getElementById('registerModal')?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

const loginHandle = async () => {
  if (isNullOrEmpty(logEmail.value) || isNullOrEmpty(logPassword.value)) {
    if (isNullOrEmpty(logEmail.value)) {
      toast.warning('Không được bỏ trống địa chỉ email')
    }

    if (isNullOrEmpty(logPassword.value)) {
      toast.warning('Không được bỏ trống mật khẩu')
    }
    return
  }

  if (!isValidEmail(logEmail.value)) {
    toast.warning('Địa chỉ email không hợp lệ')
    return
  }

  fetch(`${import.meta.env.VITE_API_UR}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: logEmail.value,
      password: logPassword.value,
    }),
  })
    .then((res) => {
      if (res.status === HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        toast.error('Lỗi khi kết nối đến máy chủ')
        return Promise.reject()
      }
      return res.json()
    })
    .then((data) => {
      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.USER_LOGIN_SUCCESSFUL) {
        localStorage.setItem('access_token', data.authenticate.access_token)
        localStorage.setItem('refresh_token', data.authenticate.refresh_token)
        logEmail.value = ''
        logPassword.value = ''
        toast.success(data.message)
        document.getElementById('loginModal')?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}
</script>

<template>
  <div
    v-if="userData?.isLogin && userData?.account.user_type === UserTypeEnum.UNVERIFIED"
    class="alert alert-warning mb-0"
    role="alert"
  >
    Bạn chưa xác minh tài khoản! Vui lòng kiểm tra hộp thư <b>{{ userData?.account.email }}</b> để
    xác minh tài khoản của bạn <button class="btn btn-warning">Gửi lại mã xác thực</button>
  </div>
  <nav class="navbar navbar-expand-lg py-3 shadow-sm bg-dark navbar-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><h1 class="h1 mb-0">Khoa's Blog</h1></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
        aria-controls="nav"
        aria-expanded="false"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <div v-if="userData?.isLogin">
            <li class="nav-item dropdown d-none d-lg-block">
              <button
                class="btn btn-outline-light fw-bold d-flex align-items-center dropdown-toggle"
                type="button"
                id="dropdownUserButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person me-2"></i> <span>{{ userData.account.display_name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUserButton">
                <li>
                  <router-link class="dropdown-item" to="/profile">Hồ sơ của bạn</router-link>
                </li>
                <li v-if="userData?.account.user_role == UserRoleEnum.ADMINISTRATOR">
                  <router-link class="dropdown-item" to="/management">Quản lý</router-link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li><a class="dropdown-item">Đăng xuất</a></li>
              </ul>
            </li>
            <li class="nav-item d-block d-lg-none">
              <router-link class="nav-link" to="/profile">Hồ sơ của bạn</router-link>
            </li>
            <li
              v-if="userData?.account.user_role == UserRoleEnum.ADMINISTRATOR"
              class="nav-item d-block d-lg-none"
            >
              <router-link class="nav-link" to="/management">Quản lý</router-link>
            </li>
            <li class="nav-item d-block d-lg-none">
              <router-link class="nav-link">Đăng xuất</router-link>
            </li>
          </div>
          <div class="d-block d-lg-flex" v-else>
            <li class="nav-item">
              <a class="nav-link">
                <button
                  class="btn btn-outline-light me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                >
                  Đăng nhập
                </button>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link">
                <button
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#registerModal"
                >
                  Đăng ký
                </button>
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>

  <div v-if="!userData?.isLogin">
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="loginModalLabel">Đăng nhập</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label for="loginIdentifier" class="form-label">Email hoặc Số điện thoại</label>
                <input type="text" class="form-control" id="loginIdentifier" v-model="logEmail" />
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Mật khẩu</label>
                <input
                  type="password"
                  class="form-control"
                  id="loginPassword"
                  v-model="logPassword"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary w-100" @click="loginHandle">Đăng nhập</button>
            </div>
            <div class="mb-2 w-100 text-center">
              <a
                style="text-decoration: none"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#forgotPasswordModal"
                data-bs-dismiss="modal"
                >Quên mật khẩu?</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="registerModal"
      tabindex="-1"
      aria-labelledby="registerModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalLabel">Đăng ký</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label for="registerUsername" class="form-label">Tên người dùng</label>
                <input
                  type="text"
                  class="form-control"
                  id="registerUsername"
                  v-model="regUsername"
                />
              </div>
              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="registerEmail" v-model="regEmail" />
              </div>
              <div class="mb-3">
                <label for="registerPhone" class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" id="registerPhone" v-model="regPhone" />
              </div>
              <div class="mb-3">
                <label for="registerPassword" class="form-label">Mật khẩu</label>
                <input
                  type="password"
                  class="form-control"
                  id="registerPassword"
                  v-model="regPassword"
                />
              </div>
              <div class="mb-3">
                <label for="registerConfirmPassword" class="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  class="form-control"
                  id="registerConfirmPassword"
                  v-model="regConfirmPassword"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary w-100" @click="registerHandle">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="forgotPasswordModal"
      tabindex="-1"
      aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="forgotPasswordModalLabel">Quên mật khẩu</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="forgotPasswordEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="forgotPasswordEmail" required />
              </div>
            </form>
            <div class="modal-footer">
              <button class="btn btn-primary w-100">Yêu cầu đặt lại mật khẩu</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
