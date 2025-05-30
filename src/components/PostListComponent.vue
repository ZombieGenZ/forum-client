<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import { TopicType } from '../schemas/topics.shemas.ts'
import PostCardComponent from './PostCardComponent.vue'
import InfomationBarComponent from './InfomationBarComponent.vue'
import CKEditorComponent from './CKEditorComponent.vue'
import { UserType } from './schemas/users.shemas.ts'
import HTTPSTATUS from '../constants/httpStatus.constants.ts'
import { RESPONSE_CODE } from '../constants/responseCode.constants.ts'
const userData = ref<{ isLogin: boolean; account?: UserType }>()
import { isNullOrEmpty } from '../utils/string.utils.ts'
import { UserTypeEnum } from '../constants/users.constants.ts'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
const toast = useToast()
const user = inject('userData')
const router = useRouter()

const topicData = ref<TopicType[]>([])
const postData = ref<any[]>([])

const addTopic = ref('')
const addTitle = ref('')
const addContent = ref('')

watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      userData.value = newUser
    }
  },
  { immediate: true },
)

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
        // toast.error(data.message)
        return
      }

      if (data.code === RESPONSE_CODE.GET_TOPIC_SUCCESSFUL) {
        topicData.value = []

        topicData.value = data.topic
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
        document.getElementById('postModal')?.querySelector('.btn-close')?.click()
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
        return
      } else {
        toast.error(data.message)
      }
    })
}

getPost()
</script>

<template>
  <div class="container-fluid">
    <div class="row p-3">
      <div class="row g-3">
        <h1 class="h1">
          Bài viết
          <button
            v-if="userData?.isLogin && userData?.account?.user_type !== UserTypeEnum.UNVERIFIED"
            class="btn btn-primary float-end"
            data-bs-toggle="modal"
            data-bs-target="#postModal"
          >
            <span class="d-none d-sm-block">Đăng bài</span>
            <span class="d-block d-sm-none"><i class="bi bi-file-earmark-plus"></i></span>
          </button>
        </h1>
        <div class="col-12 col-md-9">
          <div class="row row-cols-1 g-3">
            <PostCardComponent
              v-for="post in postData"
              :key="post._id"
              :title="post.title"
              :summary="post.summary"
              :url="post.url"
              :user_display_name="post.user.display_name"
              :user_color="post.user.display_color"
              :user_username="post.user.username"
              :user_is_verified="post.user.is_verified"
              :topic_topic="post.topic.topic"
              :topic_text_color="post.topic.text_color"
              :topic_background_color="post.topic.background_color"
              :updated_at="post.updated_at"
            ></PostCardComponent>
          </div>
          <nav class="mt-3 float-end">
            <ul class="pagination">
              <li class="page-item">
                <a class="page-link" href="#">
                  <span aria-hidden="true"><i class="bi bi-arrow-left"></i></span>
                </a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <span aria-hidden="true"><i class="bi bi-arrow-right"></i></span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-12 col-md-3">
          <InfomationBarComponent></InfomationBarComponent>
        </div>
      </div>
    </div>

    <div
      v-if="userData?.isLogin && userData?.account?.user_type !== UserTypeEnum.UNVERIFIED"
      class="modal fade"
      id="postModal"
      tabindex="-1"
      aria-labelledby="postModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="postModalLabel">Đăng bài viết</h5>
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
                <label for="postTopic" class="form-label">Chủ đề</label>
                <select class="form-select" id="postTopic" v-model="addTopic">
                  <option selected disabled>Chọn chủ đề</option>
                  <option v-for="topic in topicData" :key="topic._id" :value="topic._id">
                    {{ topic.topic }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="postTitle" class="form-label">Tiêu đề</label>
                <input
                  v-model="addTitle"
                  type="text"
                  class="form-control"
                  id="postTitle"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nội dung</label>
                <CKEditorComponent v-model="addContent"></CKEditorComponent>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="create">Đăng bài</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
