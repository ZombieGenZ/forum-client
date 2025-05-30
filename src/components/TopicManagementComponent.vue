<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { isNullOrEmpty } from '../utils/string.utils.ts'
import { RESPONSE_CODE } from '../constants/responseCode.constants.ts'
import HTTPSTATUS from '../constants/httpStatus.constants.ts'
import { TopicType } from '../schemas/topics.shemas.ts'
import { useToast } from 'vue-toastification'
import { ColorType } from '../constants/colors.constants.ts'
const toast = useToast()

const topciData = ref<TopicType[]>([])

const addTopic = ref<string>('')
const addColorType = ref<string>('basic')
const addBasicColor = ref<string>('#000000')
const addGradient2Color1 = ref<string>('#000000')
const addGradient2Color2 = ref<string>('#ffffff')
const addGradient3Color1 = ref<string>('#000000')
const addGradient3Color2 = ref<string>('#ffffff')
const addGradient3Color3 = ref<string>('#ff0000')
const addTextColorType = ref<string>('basic')
const addTextBasicColor = ref<string>('#000000')
const addTextGradient2Color1 = ref<string>('#000000')
const addTextGradient2Color2 = ref<string>('#ffffff')
const addTextGradient3Color1 = ref<string>('#000000')
const addTextGradient3Color2 = ref<string>('#ffffff')
const addTextGradient3Color3 = ref<string>('#ff0000')

const editTopic = ref<string[]>([])
const editColorType = ref<string[]>([])
const editBasicColor = ref<string[]>([])
const editGradient2Color1 = ref<string[]>([])
const editGradient2Color2 = ref<string[]>([])
const editGradient3Color1 = ref<string[]>([])
const editGradient3Color2 = ref<string[]>([])
const editGradient3Color3 = ref<string[]>([])
const editTextColorType = ref<string[]>([])
const editTextBasicColor = ref<string[]>([])
const editTextGradient2Color1 = ref<string[]>([])
const editTextGradient2Color2 = ref<string[]>([])
const editTextGradient3Color1 = ref<string[]>([])
const editTextGradient3Color2 = ref<string[]>([])
const editTextGradient3Color3 = ref<string[]>([])

const initializeRow = () => {
  const rows = document.querySelectorAll('tbody tr')
  rows.forEach((row) => {
    const buttons = row.querySelector('.function-buttons')
    row.addEventListener('mouseenter', () => {
      if (buttons) buttons.classList.remove('d-none')
    })
    row.addEventListener('mouseleave', () => {
      if (buttons) buttons.classList.add('d-none')
    })
  })
}

onMounted(() => {
  initializeRow()
})

watch(topciData, () => {
  nextTick(() => {
    initializeRow()
  })
})

const create = () => {
  if (isNullOrEmpty(addTopic.value)) {
    toast.warning('không được bỏ trống chủ đề')
    return
  }

  let colorTextType
  let colorType
  if (addColorType.value === 'basic') {
    colorType = ColorType.COLOR_BASIC
  } else if (addColorType.value === 'gradient2') {
    colorType = ColorType.COLOR_GRADIENT_2
  } else if (addColorType.value === 'gradient3') {
    colorType = ColorType.COLOR_GRADIENT_3
  } else {
    colorType = ColorType.COLOR_RAMBOW
  }
  if (addTextColorType.value === 'basic') {
    colorTextType = ColorType.COLOR_BASIC
  } else if (addTextColorType.value === 'gradient2') {
    colorTextType = ColorType.COLOR_GRADIENT_2
  } else if (addTextColorType.value === 'gradient3') {
    colorTextType = ColorType.COLOR_GRADIENT_3
  } else {
    colorTextType = ColorType.COLOR_RAMBOW
  }

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  fetch(`${import.meta.env.VITE_API_UR}/api/topics/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      topic: addTopic.value,
      colorType: colorType,
      basicColor: addBasicColor.value,
      gradient2Color1: addGradient2Color1.value,
      gradient2Color2: addGradient2Color2.value,
      gradient3Color1: addGradient3Color1.value,
      gradient3Color2: addGradient3Color2.value,
      gradient3Color3: addGradient3Color3.value,
      textColorType: colorTextType,
      textBasicColor: addTextBasicColor.value,
      textGradient2Color1: addTextGradient2Color1.value,
      textGradient2Color2: addTextGradient2Color2.value,
      textGradient3Color1: addTextGradient3Color1.value,
      textGradient3Color2: addTextGradient3Color2.value,
      textGradient3Color3: addTextGradient3Color3.value,
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

      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code == RESPONSE_CODE.COLOR_INVALID) {
        toast.warning(data.message)
        return
      }

      if (data.code === RESPONSE_CODE.CREATE_TOPIC_SUCCESSFUL) {
        addTopic.value = ''
        addColorType.value = 'basic'
        addBasicColor.value = '#000000'
        addGradient2Color1.value = '#000000'
        addGradient2Color2.value = '#ffffff'
        addGradient3Color1.value = '#000000'
        addGradient3Color2.value = '#ffffff'
        addGradient3Color3.value = '#ff0000'
        addTextColorType.value = 'basic'
        addTextBasicColor.value = '#000000'
        addTextGradient2Color1.value = '#000000'
        addTextGradient2Color2.value = '#ffffff'
        addTextGradient3Color1.value = '#000000'
        addTextGradient3Color2.value = '#ffffff'
        addTextGradient3Color3.value = '#ff0000'
        toast.success(data.message)
        getTopic()
        document.getElementById('addModal')?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

const update = (id: string, index: number) => {
  if (isNullOrEmpty(editTopic.value[index])) {
    toast.warning('không được bỏ trống chủ đề')
    return
  }

  let colorTextType
  let colorType
  if (editColorType.value[index] === 'basic') {
    colorType = ColorType.COLOR_BASIC
  } else if (editColorType.value[index] === 'gradient2') {
    colorType = ColorType.COLOR_GRADIENT_2
  } else if (editColorType.value[index] === 'gradient3') {
    colorType = ColorType.COLOR_GRADIENT_3
  } else {
    colorType = ColorType.COLOR_RAMBOW
  }
  if (editTextColorType.value[index] === 'basic') {
    colorTextType = ColorType.COLOR_BASIC
  } else if (editTextColorType.value[index] === 'gradient2') {
    colorTextType = ColorType.COLOR_GRADIENT_2
  } else if (editTextColorType.value[index] === 'gradient3') {
    colorTextType = ColorType.COLOR_GRADIENT_3
  } else {
    colorTextType = ColorType.COLOR_RAMBOW
  }

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  fetch(`${import.meta.env.VITE_API_UR}/api/topics/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      topic_id: id,
      topic: editTopic.value[index],
      colorType: colorType,
      basicColor: editBasicColor.value[index],
      gradient2Color1: editGradient2Color1.value[index],
      gradient2Color2: editGradient2Color2.value[index],
      gradient3Color1: editGradient3Color1.value[index],
      gradient3Color2: editGradient3Color2.value[index],
      gradient3Color3: editGradient3Color3.value[index],
      textColorType: colorTextType,
      textBasicColor: editTextBasicColor.value[index],
      textGradient2Color1: editTextGradient2Color1.value[index],
      textGradient2Color2: editTextGradient2Color2.value[index],
      textGradient3Color1: editTextGradient3Color1.value[index],
      textGradient3Color2: editTextGradient3Color2.value[index],
      textGradient3Color3: editTextGradient3Color3.value[index],
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

      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code == RESPONSE_CODE.COLOR_INVALID) {
        toast.warning(data.message)
        return
      }

      if (data.code === RESPONSE_CODE.UPDATE_TOPIC_SUCCESSFUL) {
        toast.success(data.message)
        getTopic()
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
  fetch(`${import.meta.env.VITE_API_UR}/api/topics/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      refresh_token,
      topic_id: id,
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

      if (data.code === RESPONSE_CODE.INPUT_DATA_ERROR) {
        for (const key in data.errors) {
          if (Object.prototype.hasOwnProperty.call(data.errors, key)) {
            toast.warning(data.errors[key].msg)
          }
        }
        return
      }

      if (data.code === RESPONSE_CODE.DELETE_POST_SUCCESSFUL) {
        toast.success(data.message)
        getTopic()
        document.getElementById(`deleteModal-${index}`)?.querySelector('.btn-close')?.click()
        return
      } else {
        toast.error(data.message)
      }
    })
}

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
        editTopic.value = []
        editColorType.value = []
        editBasicColor.value = []
        editGradient2Color1.value = []
        editGradient2Color2.value = []
        editGradient3Color1.value = []
        editGradient3Color2.value = []
        editGradient3Color3.value = []
        editTextColorType.value = []
        editTextBasicColor.value = []
        editTextGradient2Color1.value = []
        editTextGradient2Color2.value = []
        editTextGradient3Color1.value = []
        editTextGradient3Color2.value = []
        editTextGradient3Color3.value = []

        topciData.value = data.topic

        for (const topic of data.topic) {
          editTopic.value.push(topic.topic)

          let colorType
          let colorTextType
          if (topic.background_color.type === ColorType.COLOR_BASIC) {
            colorType = 'basic'
          } else if (topic.background_color.type === ColorType.COLOR_GRADIENT_2) {
            colorType = 'gradient2'
          } else if (topic.background_color.type === ColorType.COLOR_GRADIENT_3) {
            colorType = 'gradient3'
          } else {
            colorType = 'rainbow'
          }
          if (topic.text_color.type === ColorType.COLOR_BASIC) {
            colorTextType = 'basic'
          } else if (topic.text_color.type === ColorType.COLOR_GRADIENT_2) {
            colorTextType = 'gradient2'
          } else if (topic.text_color.type === ColorType.COLOR_GRADIENT_3) {
            colorTextType = 'gradient3'
          } else {
            colorTextType = 'rainbow'
          }
          editColorType.value.push(colorType)
          editBasicColor.value.push(topic.background_color.color?.color || '#000000')
          editGradient2Color1.value.push(topic.background_color.color?.color1 || '#000000')
          editGradient2Color2.value.push(topic.background_color.color?.color2 || '#ffffff')
          editGradient3Color1.value.push(topic.background_color.color?.color1 || '#000000')
          editGradient3Color2.value.push(topic.background_color.color?.color2 || '#ffffff')
          editGradient3Color3.value.push(topic.background_color.color?.color3 || '#ff0000')

          editTextColorType.value.push(colorTextType)
          editTextBasicColor.value.push(topic.text_color.color?.color || '#000000')
          editTextGradient2Color1.value.push(topic.text_color.color?.color1 || '#000000')
          editTextGradient2Color2.value.push(topic.text_color.color?.color2 || '#ffffff')
          editTextGradient3Color1.value.push(topic.text_color.color?.color1 || '#000000')
          editTextGradient3Color2.value.push(topic.text_color.color?.color2 || '#ffffff')
          editTextGradient3Color3.value.push(topic.text_color.color?.color3 || '#ff0000')
        }
        return
      } else {
        toast.error(data.message)
      }
    })
}

getTopic()
</script>

<template>
  <div class="row row-cols-1 py-3 px-2">
    <div class="col">
      <div class="d-flex justify-content-end align-items-center gap-2">
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
      <div style="overflow-x: auto; overflow-y: auto; max-height: 600px; max-width: 100%">
        <table
          class="table table-striped table-hover"
          style="min-width: 600px; table-layout: fixed"
        >
          <thead class="sticky-top bg-white">
            <tr>
              <th scope="col" class="text-nowrap" style="width: 60%; min-width: 200px">Chủ đề</th>
              <th
                scope="col"
                class="text-nowrap position-sticky bg-white text-end"
                style="
                  right: 0;
                  z-index: 10;
                  border-left: 1px solid #dee2e6;
                  width: 40%;
                  min-width: 150px;
                "
              >
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(topic, index) in topciData" :key="topic._id">
              <td
                style="
                  width: 60%;
                  min-width: 200px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  padding-right: 15px;
                "
              >
                {{ topic.topic }}
              </td>
              <td
                class="position-sticky bg-white text-end"
                style="
                  right: 0;
                  z-index: 5;
                  border-left: 1px solid #dee2e6;
                  width: 40%;
                  min-width: 150px;
                "
              >
                <div class="function-buttons d-flex justify-content-end d-none">
                  <button
                    class="btn btn-warning btn-sm me-1"
                    data-bs-toggle="modal"
                    :data-bs-target="`#editModal-${index}`"
                  >
                    Sửa
                  </button>
                  <button
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    :data-bs-target="`#deleteModal-${index}`"
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

  <div>
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
            <h5 class="modal-title" id="addModalLabel">Tạo chủ đề</h5>
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
                <label for="addTopicInput" class="form-label">Chủ đề</label>
                <input
                  type="text"
                  class="form-control"
                  id="addTopicInput"
                  placeholder="Nhập chủ đề"
                  v-model="addTopic"
                />
              </div>
              <div>
                <div class="mb-3">
                  <label for="addColorTypeSelect" class="form-label">Loại màu nền</label>
                  <select class="form-select" id="addColorTypeSelect" v-model="addColorType">
                    <option value="basic">Màu nền cơ bản</option>
                    <option value="gradient2">Màu nền gradient 2</option>
                    <option value="gradient3">Màu nền gradient 3</option>
                    <option value="rainbow">Màu nền cầu vồng</option>
                  </select>
                </div>
                <div v-if="addColorType === 'basic'" class="mb-3">
                  <label for="addBasicColor" class="form-label">Màu nền</label>
                  <input
                    type="color"
                    class="form-control"
                    style="height: 38px; width: 100%"
                    id="addBasicColor"
                    v-model="addBasicColor"
                  />
                </div>
                <div v-if="addColorType === 'gradient2'" class="mb-3">
                  <div class="row">
                    <div class="col">
                      <label for="addGradient2Color1" class="form-label">Màu nền 1</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addGradient2Color1"
                        v-model="addGradient2Color1"
                      />
                    </div>
                    <div class="col">
                      <label for="addGradient2Color2" class="form-label">Màu nền 2</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addGradient2Color2"
                        v-model="addGradient2Color2"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="addColorType === 'gradient3'" class="mb-3">
                  <div class="row">
                    <div class="col">
                      <label for="addGradient3Color1" class="form-label">Màu nền 1</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addGradient3Color1"
                        v-model="addGradient3Color1"
                      />
                    </div>
                    <div class="col">
                      <label for="addGradient3Color2" class="form-label">Màu nền 2</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addGradient3Color2"
                        v-model="addGradient3Color2"
                      />
                    </div>
                    <div class="col">
                      <label for="addGradient3Color3" class="form-label">Màu nền 3</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addGradient3Color3"
                        v-model="addGradient3Color3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="mb-3">
                  <label for="addTextColorTypeSelect" class="form-label">Loại màu chữ</label>
                  <select
                    class="form-select"
                    id="addTextColorTypeSelect"
                    v-model="addTextColorType"
                  >
                    <option value="basic">Màu chử cơ bản</option>
                    <option value="gradient2">Màu chử gradient 2</option>
                    <option value="gradient3">Màu chử gradient 3</option>
                    <option value="rainbow">Màu chử cầu vồng</option>
                  </select>
                </div>
                <div v-if="addTextColorType === 'basic'" class="mb-3">
                  <label for="addTextBasicColor" class="form-label">Màu chử</label>
                  <input
                    type="color"
                    class="form-control"
                    style="height: 38px; width: 100%"
                    id="addTextBasicColor"
                    v-model="addTextBasicColor"
                  />
                </div>
                <div v-if="addTextColorType === 'gradient2'" class="mb-3">
                  <div class="row">
                    <div class="col">
                      <label for="addTextGradient2Color1" class="form-label">Màu chử 1</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addTextGradient2Color1"
                        v-model="addTextGradient2Color1"
                      />
                    </div>
                    <div class="col">
                      <label for="addTextGradient2Color2" class="form-label">Màu chử 2</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addTextGradient2Color2"
                        v-model="addTextGradient2Color2"
                      />
                    </div>
                  </div>
                </div>
                <div v-if="addTextColorType === 'gradient3'" class="mb-3">
                  <div class="row">
                    <div class="col">
                      <label for="addTextGradient3Color1" class="form-label">Màu chử 1</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addTextGradient3Color1"
                        v-model="addTextGradient3Color1"
                      />
                    </div>
                    <div class="col">
                      <label for="addTextGradient3Color2" class="form-label">Màu chử 2</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addTextGradient3Color2"
                        v-model="addTextGradient3Color2"
                      />
                    </div>
                    <div class="col">
                      <label for="addTextGradient3Color3" class="form-label">Màu chử 3</label>
                      <input
                        type="color"
                        class="form-control"
                        style="height: 38px; width: 100%"
                        id="addTextGradient3Color3"
                        v-model="addTextGradient3Color3"
                      />
                    </div>
                  </div>
                </div>
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
      v-for="(topic, index) in topciData"
      :key="topic._id"
      class="modal fade"
      :id="`editModal-${index}`"
      tabindex="-1"
      :aria-labelledby="`editModalLabel-${index}`"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="`editModalLabel-${index}`">Chỉnh sửa chủ đề</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div>
                <div class="mb-3">
                  <label :for="`editTopicInput-${index}`" class="form-label">Chủ đề</label>
                  <input
                    type="text"
                    class="form-control"
                    :id="`editTopicInput-${index}`"
                    placeholder="Nhập chủ đề"
                    v-model="editTopic[index]"
                  />
                </div>
                <div>
                  <div class="mb-3">
                    <label :for="`editColorTypeSelect-${index}`" class="form-label"
                      >Loại màu nền</label
                    >
                    <select
                      class="form-select"
                      :id="`editColorTypeSelect-${index}`"
                      v-model="editColorType[index]"
                    >
                      <option value="basic">Màu cơ bản</option>
                      <option value="gradient2">Màu gradient 2</option>
                      <option value="gradient3">Màu gradient 3</option>
                      <option value="rainbow">Màu cầu vồng</option>
                    </select>
                  </div>
                  <div v-if="editColorType[index] === 'basic'" class="mb-3">
                    <label :for="`color1-${index}`" class="form-label">Màu</label>
                    <input
                      type="color"
                      class="form-control"
                      style="height: 38px; width: 100%"
                      :id="`color1-${index}`"
                      v-model="editBasicColor[index]"
                    />
                  </div>
                  <div v-if="editColorType[index] === 'gradient2'" class="mb-3">
                    <div class="row">
                      <div class="col">
                        <label :for="`editGradient2Color1-${index}`" class="form-label"
                          >Màu 1</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editGradient2Color1-${index}`"
                          v-model="editGradient2Color1[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editGradient2Color2-${index}`" class="form-label"
                          >Màu 2</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editGradient2Color2-${index}`"
                          v-model="editGradient2Color2[index]"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-if="editColorType[index] === 'gradient3'" class="mb-3">
                    <div class="row">
                      <div class="col">
                        <label :for="`editGradient3Color1-${index}`" class="form-label"
                          >Màu 1</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editGradient3Color1-${index}`"
                          v-model="editGradient3Color1[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editGradient3Color2-${index}`" class="form-label"
                          >Màu 2</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editGradient3Color2-${index}`"
                          v-model="editGradient3Color2[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editGradient3Color3-${index}`" class="form-label"
                          >Màu 3</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editGradient3Color3-${index}`"
                          v-model="editGradient3Color3[index]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="mb-3">
                    <label :for="`textColorTypeSelect-${index}`" class="form-label"
                      >Loại màu chữ</label
                    >
                    <select
                      class="form-select"
                      :id="`textColorTypeSelect-${index}`"
                      v-model="editTextColorType[index]"
                    >
                      <option value="basic">Màu cơ bản</option>
                      <option value="gradient2">Màu gradient 2</option>
                      <option value="gradient3">Màu gradient 3</option>
                      <option value="rainbow">Màu cầu vồng</option>
                    </select>
                  </div>
                  <div v-if="editTextColorType[index] === 'basic'" class="mb-3">
                    <label :for="`editTextBasicColor-${index}`" class="form-label">Màu</label>
                    <input
                      type="color"
                      class="form-control"
                      style="height: 38px; width: 100%"
                      :id="`editTextBasicColor-${index}`"
                      v-model="editTextBasicColor[index]"
                    />
                  </div>
                  <div v-if="editTextColorType[index] === 'gradient2'" class="mb-3">
                    <div class="row">
                      <div class="col">
                        <label :for="`editTextGradient2Color1-${index}`" class="form-label"
                          >Màu 1</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editTextGradient2Color1-${index}`"
                          v-model="editTextGradient2Color1[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editTextGradient2Color2-${index}`" class="form-label"
                          >Màu 2</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editTextGradient2Color2-${index}`"
                          v-model="editTextGradient2Color2[index]"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-if="editTextColorType[index] === 'gradient3'" class="mb-3">
                    <div class="row">
                      <div class="col">
                        <label :for="`editTextGradient3Color1-${index}`" class="form-label"
                          >Màu 1</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editTextGradient3Color1-${index}`"
                          v-model="editTextGradient3Color1[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editTextGradient3Color2-${index}`" class="form-label"
                          >Màu 2</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editTextGradient3Color2-${index}`"
                          v-model="editTextGradient3Color2[index]"
                        />
                      </div>
                      <div class="col">
                        <label :for="`editTextGradient3Color3-${index}`" class="form-label"
                          >Màu 3</label
                        >
                        <input
                          type="color"
                          class="form-control"
                          style="height: 38px; width: 100%"
                          :id="`editTextGradient3Color3-${index}`"
                          v-model="editTextGradient3Color3[index]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="update((topic._id as string).toString(), index)"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="(topic, index) in topciData"
      :key="topic._id"
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
          <div class="modal-body">Bạn có chắc chắn muốn xóa chủ đề này?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="del((topic._id as string).toString(), index)"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
