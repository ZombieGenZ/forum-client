<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import CommentListComponent from './CommentListComponent.vue'
import CKEditorComponent from '../components/CKEditorComponent.vue'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { Tooltip } from 'bootstrap'
import HTTPSTATUS from '../constants/httpStatus.constants.ts'
import { RESPONSE_CODE } from '../constants/responseCode.constants.ts'
import { useToast } from 'vue-toastification'
import { formatDateFull } from '../utils/date.utils.ts'
import { ColorType } from '../constants/colors.constants.ts'
import { useRouter } from 'vue-router'
import { UserType } from '@/schemas/users.shemas'
import { TopicType } from '@/schemas/topics.shemas'
import { isNullOrEmpty } from '@/utils/string.utils'
import { UserTypeEnum } from '@/constants/users.constants'
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

const canEdit = ref(false)

const toast = useToast()
const router = useRouter()

const topicData = ref<TopicType[]>([])
const commentData = ref<any[]>([])

const editTopic = ref('')
const editTitle = ref('')
const editContent = ref('')

const addCommentContent = ref('')

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

const postData = ref<any>()

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

const getPost = () => {
  fetch(`${import.meta.env.VITE_API_UR}/api/posts/get-post-detail?url=${props.url}`)
    .then((res) => {
      if (res.status === HTTPSTATUS.INTERNAL_SERVER_ERROR) {
        toast.error('Lỗi khi kết nối đến máy chủ')
        return Promise.reject()
      }
      return res.json()
    })
    .then((data) => {
      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        router.push('/')
        return
      }

      if (data.code === RESPONSE_CODE.GET_POST_SUCCESSFUL) {
        postData.value = data.posts
        editTopic.value = data.posts.topic._id
        editTitle.value = data.posts.title
        editContent.value = data.posts.content
        nextTick(() => {
          loadTooltip()
        })
        return
      } else {
        toast.error(data.message)
      }
    })
}

const checkAllowEdit = () => {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  if (!access_token || !refresh_token) {
    canEdit.value = false
    return
  }

  fetch(`${import.meta.env.VITE_API_UR}/api/posts/check-edit-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      url: props.url,
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
        router.push('/')
        return
      }

      if (data.code === RESPONSE_CODE.CHECK_PERMISSION_SUCCESSFUL) {
        canEdit.value = data.allow
        return
      } else {
        toast.error(data.message)
      }
    })
}

getPost()
checkAllowEdit()

const loadTooltip = () => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
}

onMounted(() => {
  setTimeout(() => {
    getComment()
  }, 2000)
})

const getBackgroundStyle = () => {
  const colorType = postData.value?.topic.background_color.type || ColorType.COLOR_BASIC
  switch (colorType) {
    case ColorType.COLOR_BASIC:
      return {
        backgroundColor: postData.value?.topic.background_color.color?.color || 'transparent',
      }
    case ColorType.COLOR_GRADIENT_2:
      return {
        background: `linear-gradient(to right, ${postData.value?.topic.background_color.color?.color1 || '#fff'}, ${postData.value?.topic.background_color.color?.color2 || '#fff'})`,
      }
    case ColorType.COLOR_GRADIENT_3:
      return {
        background: `linear-gradient(to right, ${postData.value?.topic.background_color.color?.color1 || '#fff'}, ${postData.value?.topic.background_color.color?.color2 || '#fff'}, ${postData.value?.topic.background_color.color?.color3 || '#fff'})`,
      }
    case ColorType.COLOR_RAMBOW:
      return {
        background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)',
        backgroundSize: '800%',
        animation: 'rainbowAnimation 30s linear infinite',
      }
    default:
      return { backgroundColor: 'transparent' }
  }
}

const getTextColorStyle = () => {
  const textColorType = postData.value?.topic.text_color.type || ColorType.COLOR_BASIC
  switch (textColorType) {
    case ColorType.COLOR_BASIC:
      return { color: postData.value?.topic.text_color.color?.color || '#000' }
    case ColorType.COLOR_GRADIENT_2:
      return {
        background: `linear-gradient(to right, ${postData.value?.topic.text_color.color?.color1 || '#000'}, ${postData.value?.topic.text_color.color?.color2 || '#000'})`,
        backgroundClip: 'text',
        color: 'transparent',
      }
    case ColorType.COLOR_GRADIENT_3:
      return {
        background: `linear-gradient(to right, ${postData.value?.topic.text_color.color?.color1 || '#000'}, ${postData.value?.topic.text_color.color?.color2 || '#000'}, ${postData.value?.topic.text_color.color?.color3 || '#000'})`,
        backgroundClip: 'text',
        color: 'transparent',
      }
    case ColorType.COLOR_RAMBOW:
      return {
        background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)',
        backgroundSize: '800%',
        animation: 'rainbowAnimation 30s linear infinite',
        backgroundClip: 'text',
        color: 'transparent',
      }
    default:
      return { color: '#000' }
  }
}

const updatePost = () => {
  if (
    isNullOrEmpty(editTopic.value) ||
    isNullOrEmpty(editTitle.value) ||
    isNullOrEmpty(editContent.value)
  ) {
    if (isNullOrEmpty(editTopic.value)) {
      toast.warning('Không được để trống chủ đề của bài viết')
    }
    if (isNullOrEmpty(editTitle.value)) {
      toast.warning('Không được để trống tiêu đề của bài viết')
    }
    if (isNullOrEmpty(editContent.value)) {
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
      post_id: postData.value._id,
      topic_id: editTopic.value,
      title: editTitle.value,
      content: editContent.value,
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
        toast.warning(data.message)
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
        editTopic.value = ''
        editTitle.value = ''
        editContent.value = ''
        getPost()
        toast.success(data.message)
        document.getElementById(`editPostModal`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}
const delPost = () => {
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
      post_id: postData.value._id,
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
        toast.warning(data.message)
        return
      }

      if (data.code === RESPONSE_CODE.DELETE_POST_SUCCESSFUL) {
        getPost()
        toast.success(data.message)
        document.getElementById(`confirmDeletePostModal`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

const createComment = () => {
  if (isNullOrEmpty(addCommentContent.value)) {
    toast.warning('Không được để trống nội dung của bình luận')
    return
  }

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  fetch(`${import.meta.env.VITE_API_UR}/api/comments/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      post_id: postData.value._id,
      content: addCommentContent.value,
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
        toast.warning(data.message)
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

      if (data.code === RESPONSE_CODE.CREATE_COMMENT_SUCCESSFUL) {
        addCommentContent.value = ''
        getComment()
        toast.success(data.message)
        document.getElementById(`addCommentModal`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

const getComment = () => {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  fetch(`${import.meta.env.VITE_API_UR}/api/comments/get-comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: isNullOrEmpty(access_token) ? '' : `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token: isNullOrEmpty(refresh_token) ? '' : refresh_token,
      post_id: postData.value?._id,
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
        toast.warning(data.message)
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

      if (data.code === RESPONSE_CODE.GET_COMMENT_SUCCESSFUL) {
        commentData.value = data.comments
        console.log(commentData.value)
        nextTick(() => {
          loadTooltip()
        })
        return
      } else {
        toast.error(data.message)
      }
    })
}
</script>

<template>
  <div>
    <h1 class="h1 mb-3">
      <div class="px-2 rounded-3" style="display: inline-block" :style="getBackgroundStyle()">
        <span style="font-size: 0.8em" :style="getTextColorStyle()">{{
          postData?.topic.topic
        }}</span>
      </div>
      {{ postData?.title }}
    </h1>
    <div class="d-flex align-items-center">
      <router-link
        :to="`/profile/${postData?.user.username}`"
        class="text-decoration-none text-black d-inline"
        style="cursor: pointer"
      >
        {{ postData?.user.display_name }}
        <i
          v-if="postData?.user.is_verified"
          class="bi bi-check-circle-fill"
          style="color: rgb(51, 153, 255)"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Đã xác minh"
        ></i>
      </router-link>
      <div class="ms-auto d-flex align-items-center">
        <p class="mb-0 me-2">{{ formatDateFull(new Date(postData?.updated_at || new Date())) }}</p>
        <div class="dropdown">
          <button
            v-if="canEdit"
            class="btn btn-link text-black p-0"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#editPostModal"
                >Chỉnh sửa</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#confirmDeletePostModal"
                >Xóa</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-1" v-html="postData?.content"></div>
  </div>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h3 class="h3 mb-0">Danh sách bình luận</h3>
      <button
        v-if="userData?.isLogin && userData?.account?.user_type === UserTypeEnum.VERIFIED"
        class="btn btn-success mt-1"
        data-bs-toggle="modal"
        data-bs-target="#addCommentModal"
      >
        <span class="d-none d-sm-block">Thêm bình luận</span>
        <span class="d-block d-sm-none"><i class="bi bi-file-earmark-plus"></i></span>
      </button>
    </div>
    <CommentListComponent :commentList="commentData"></CommentListComponent>
  </div>

  <div>
    <div
      v-if="userData?.isLogin && userData?.account?.user_type === UserTypeEnum.VERIFIED"
      class="modal fade"
      id="addCommentModal"
      tabindex="-1"
      aria-labelledby="addCommentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCommentModalLabel">Thêm bình luận mới</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <label class="form-label">Nội dung</label>
              <CKEditorComponent v-model="addCommentContent"></CKEditorComponent>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="createComment">
              Gửi bình luận
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="canEdit">
      <div
        class="modal fade"
        id="editPostModal"
        tabindex="-1"
        aria-labelledby="editPostModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editPostModalLabel">Chỉnh sửa bài viết</h5>
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
                  <label for="editPostTopicSelect" class="form-label">Chủ đề</label>
                  <select
                    class="form-select"
                    id="editPostTopicSelect"
                    aria-label="Chọn chủ đề"
                    v-model="editTopic"
                  >
                    <option selected disabled>Chọn chủ đề</option>
                    <option v-for="topic in topicData" :key="topic._id" :value="topic._id">
                      {{ topic.topic }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editPostTitle" class="form-label">Tiêu đề</label>
                  <input type="text" class="form-control" id="editPostTitle" v-model="editTitle" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Nội dung</label>
                  <CKEditorComponent v-model="editContent"></CKEditorComponent>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" class="btn btn-primary" @click="updatePost">Chỉnh sửa</button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="confirmDeletePostModal"
        tabindex="-1"
        aria-labelledby="confirmDeletePostModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmDeletePostModalLabel">Xác nhận xóa</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Bạn có chắc chắn muốn xóa bài viết này không?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" class="btn btn-danger" @click="delPost">Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
