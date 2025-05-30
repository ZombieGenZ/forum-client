<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { Tooltip } from 'bootstrap'
import CKEditorComponent from './CKEditorComponent.vue'
import { TopicType } from '../schemas/topics.shemas.ts'
import HTTPSTATUS from '../constants/httpStatus.constants.ts'
import { RESPONSE_CODE } from '../constants/responseCode.constants.ts'
import { isNullOrEmpty } from '../utils/string.utils.ts'
import { useToast } from 'vue-toastification'
import { formatDateFull } from '@/utils/date.utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const toast = useToast()

const topciData = ref<TopicType[]>([])

const addTopic = ref('')
const addTitle = ref('')
const addContent = ref('')

const editTopic = ref<string[]>([])
const editTitle = ref<string[]>([])
const editContent = ref<string[]>([])

const postData = ref<any[]>([])

const load = () => {
  const rows = document.querySelectorAll('tbody tr')
  rows.forEach((row) => {
    const buttons = row.querySelector('.function-buttons')
    row.addEventListener('mouseenter', () => {
      if (buttons) buttons.style.display = 'flex'
    })
    row.addEventListener('mouseleave', () => {
      if (buttons) buttons.style.display = 'none'
    })
  })

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
}

onMounted(load)

const getTopic = () => {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  fetch(`${import.meta.env.VITE_API_UR}/api/topics/get-topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
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
      if (data.code === RESPONSE_CODE.AUTHENTICATION_FAILED) {
        toast.error(data.message)
        return
      }

      if (data.code === RESPONSE_CODE.GET_TOPIC_SUCCESSFUL) {
        topciData.value = []
        topciData.value = data.topic

        return
      } else {
        toast.error(data.message)
      }
    })
}

getTopic()

const create = () => {
  if (
    isNullOrEmpty(addTopic.value) ||
    isNullOrEmpty(addTitle.value) ||
    isNullOrEmpty(addContent.value)
  ) {
    if (isNullOrEmpty(addTopic.value)) {
      toast.warning('Không được để trống chủ đề của bài viết')
    }
    if (isNullOrEmpty(addTitle.value)) {
      toast.warning('Không được để trống tiêu đề của bài viết')
    }
    if (isNullOrEmpty(addContent.value)) {
      toast.warning('Không được để trống nội dung của bài viết')
    }
    return
  }

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  fetch(`${import.meta.env.VITE_API_UR}/api/posts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      topic_id: addTopic.value,
      title: addTitle.value,
      content: addContent.value,
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
      if (data.code === RESPONSE_CODE.AUTHENTICATION_FAILED) {
        router.push('/')
        return
      }

      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.CREATE_POST_SUCCESSFUL) {
        addTopic.value = ''
        addTitle.value = ''
        addContent.value = ''
        getPost()
        toast.success(data.message)
        document.getElementById('addModal')?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

const getPost = () => {
  fetch(`${import.meta.env.VITE_API_UR}/api/posts/get-post`)
    .then((res) => {
      if (res.status === HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        toast.error('Lỗi khi kết nối đến máy chủ')
        return Promise.reject()
      }
      return res.json()
    })
    .then((data) => {
      if (data.code === RESPONSE_CODE.GET_POST_SUCCESSFUL) {
        postData.value = []
        postData.value = data.posts

        for (let index = 0; index < postData.value.length; index++) {
          editTopic.value[index] = postData.value[index].topic._id
          editTitle.value[index] = postData.value[index].title
          editContent.value[index] = postData.value[index].content
        }

        nextTick(() => {
          load()
        })
        return
      } else {
        toast.error(data.message)
      }
    })
}

getPost()

const update = (id: string, index: number) => {
  if (
    isNullOrEmpty(editTopic.value[index]) ||
    isNullOrEmpty(editTitle.value[index]) ||
    isNullOrEmpty(editContent.value[index])
  ) {
    if (isNullOrEmpty(editTopic.value[index])) {
      toast.warning('Không được để trống chủ đề của bài viết')
    }
    if (isNullOrEmpty(editTitle.value[index])) {
      toast.warning('Không được để trống tiêu đề của bài viết')
    }
    if (isNullOrEmpty(editContent.value[index])) {
      toast.warning('Không được để trống nội dung của bài viết')
    }
    return
  }

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  fetch(`${import.meta.env.VITE_API_UR}/api/posts/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      post_id: id,
      topic_id: editTopic.value[index],
      title: editTitle.value[index],
      content: editContent.value[index],
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
      if (data.code === RESPONSE_CODE.AUTHENTICATION_FAILED) {
        router.push('/')
        return
      }

      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.UPDATE_POST_SUCCESSFUL) {
        editTopic.value[index] = ''
        editTitle.value[index] = ''
        editContent.value[index] = ''
        getPost()
        toast.success(data.message)
        document.getElementById(`editModal-${index}`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}
const del = (id: string, index: number) => {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  fetch(`${import.meta.env.VITE_API_UR}/api/posts/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      post_id: id,
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
      if (data.code === RESPONSE_CODE.AUTHENTICATION_FAILED) {
        router.push('/')
        return
      }

      if (data.code === RESPONSE_CODE.DELETE_POST_SUCCESSFUL) {
        getPost()
        toast.success(data.message)
        document.getElementById(`deleteModal-${index}`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}
</script>

<template>
  <div class="row row-cols-1 py-3 px-2">
    <div class="col">
      <div class="d-flex justify-content-end align-items-center gap-2 flex-wrap">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm"
          style="border-radius: 0.375rem 0 0 0.375rem; border-right: none; max-width: 200px"
        />
        <button
          class="btn btn-primary btn-sm"
          style="border-radius: 0 0.375rem 0.375rem 0; padding: 0.25rem 0.75rem"
        >
          <i class="bi bi-search"></i>
        </button>
        <button
          class="btn btn-success btn-sm"
          style="border-radius: 0.375rem; padding: 0.25rem 1rem"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          Thêm
        </button>
      </div>
    </div>
    <div class="col">
      <div style="overflow-x: auto; overflow-y: auto; max-height: 600px">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="sticky-top bg-white">
              <tr>
                <th scope="col" class="text-nowrap" style="min-width: 150px">Chủ đề</th>
                <th scope="col" class="text-nowrap" style="min-width: 120px">Người đăng</th>
                <th scope="col" class="text-nowrap" style="min-width: 120px">Thời gian đăng</th>
                <th
                  scope="col"
                  class="text-nowrap position-sticky bg-white text-end"
                  style="right: 0; z-index: 10; border-left: 1px solid #dee2e6; min-width: 120px"
                >
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(post, index) in postData" :key="post._id">
                <td style="max-width: 150px; white-space: normal; padding-right: 15px">
                  <router-link
                    :to="`/posts/${post?.url}`"
                    class="text-decoration-none text-black d-inline"
                  >
                    {{ post?.title }}
                  </router-link>
                </td>
                <td
                  style="
                    max-width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  <router-link
                    :to="`/profile/${post?.user.username}`"
                    class="text-decoration-none text-black d-inline"
                    style="cursor: pointer"
                  >
                    {{ post?.user.display_name }}
                    <i
                      v-if="post?.user.is_verified"
                      class="bi bi-check-circle-fill"
                      style="color: rgb(51, 153, 255)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Đã xác minh"
                    ></i>
                  </router-link>
                </td>
                <td style="max-width: 120px; white-space: nowrap">
                  {{ formatDateFull(new Date(post?.created_at)) }}
                </td>
                <td
                  class="position-sticky bg-white text-end"
                  style="right: 0; z-index: 5; border-left: 1px solid #dee2e6; min-width: 120px"
                >
                  <div
                    class="function-buttons d-flex justify-content-end gap-1"
                    style="display: none"
                  >
                    <button
                      class="btn btn-warning btn-sm"
                      data-bs-toggle="modal"
                      :data-bs-target="`#editModal-${index}`"
                      data-bs-placement="top"
                      data-bs-title="Chỉnh sửa"
                      style="padding: 0.25rem 0.5rem"
                    >
                      Sửa
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      :data-bs-target="`#deleteModal-${index}`"
                      data-bs-placement="top"
                      data-bs-title="Xóa"
                      style="padding: 0.25rem 0.5rem"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="addModal"
    tabindex="-1"
    aria-labelledby="addModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addModalLabel">Đăng bài viết</h5>
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
              <label for="addTopicSelect" class="form-label">Chủ đề</label>
              <select
                class="form-select"
                id="addTopicSelect"
                aria-label="Chọn chủ đề"
                v-model="addTopic"
              >
                <option selected disabled>Chọn chủ đề</option>
                <option v-for="topic in topciData" :key="topic._id" :value="topic._id">
                  {{ topic.topic }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="addTitleInput" class="form-label">Tiêu đề</label>
              <input
                type="text"
                class="form-control"
                id="addTitleInput"
                placeholder="Nhập tiêu đề"
                v-model="addTitle"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nội dung</label>
              <CKEditorComponent v-model="addContent"></CKEditorComponent>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="create">Tạo</button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-for="(post, index) in postData"
    :key="index"
    class="modal fade"
    :id="`editModal-${index}`"
    tabindex="-1"
    :aria-labelledby="`editModalLabel-${index}`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`editModalLabel-${index}`">Chỉnh sửa</h5>
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
              <label :for="`editTopicSelect-${index}`" class="form-label">Chủ đề</label>
              <select
                class="form-select"
                :id="`editTopicSelect-${index}`"
                aria-label="Chọn chủ đề"
                v-model="editTopic[index]"
              >
                <option selected disabled>Chọn chủ đề</option>
                <option v-for="topic in topciData" :key="topic._id" :value="topic._id">
                  {{ topic.topic }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label :for="`editTitleInput-${index}`" class="form-label">Tiêu đề</label>
              <input
                type="text"
                class="form-control"
                :id="`editTitleInput-${index}`"
                placeholder="Nhập tiêu đề"
                v-model="editTitle[index]"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nội dung</label>
              <CKEditorComponent v-model="editContent[index]"></CKEditorComponent>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="update(post._id, index)">
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-for="(post, index) in postData"
    :key="index"
    class="modal fade"
    :id="`deleteModal-${index}`"
    tabindex="-1"
    :aria-labelledby="`deleteModalLabel-${index}`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`deleteModalLabel-${index}`">Xác nhận xóa</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">Bạn có chắc chắn muốn xóa bài viết này?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button type="button" class="btn btn-danger" @click="del(post._id, index)">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>
