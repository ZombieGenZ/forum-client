<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Tooltip } from 'bootstrap'
import CKEditorComponent from './CKEditorComponent.vue'
import { formatDateFull } from '@/utils/date.utils'

const props = defineProps({
  _id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_display_name: {
    type: String,
    required: true,
  },
  user_color: {
    type: Object,
    required: true,
  },
  user_username: {
    type: String,
    required: true,
  },
  user_is_verified: {
    type: Boolean,
    required: true,
  },
  can_edit: {
    type: Boolean,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
})

const content = ref(props.content)

onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
})
</script>

<template>
  <div class="col">
    <div class="card p-2 position-relative">
      <div class="d-flex justify-content-between align-items-center">
        <router-link
          :to="`/profile/${props.user_username}`"
          class="text-decoration-none text-black d-inline"
          style="cursor: pointer"
          >{{ props.user_display_name }}
          <i
            class="bi bi-check-circle-fill"
            style="color: rgb(51, 153, 255)"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Đã xác minh"
          ></i>
        </router-link>
        <div class="dropdown">
          <button
            class="btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="padding: 0; border: none; background: none"
          >
            <i class="bi bi-three-dots" style="font-size: 1.2rem"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
              <button
                class="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
                style="cursor: pointer"
              >
                Sửa
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
                style="cursor: pointer"
              >
                Xóa
              </button>
            </li>
          </ul>
        </div>
      </div>
      <p class="mb-0 mb-1">{{ formatDateFull(new Date()) }}</p>
      <p class="mb-0" v-html="props.content"></p>
    </div>

    <div
      v-if="props.can_edit"
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Sửa bình luận</h5>
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
              <CKEditorComponent v-model="content"></CKEditorComponent>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              style="background-color: #6c757d; border-color: #6c757d"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              style="background-color: #007bff; border-color: #007bff"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Xác nhận xóa</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">Bạn có chắc chắn muốn xóa bình luận này?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              style="background-color: #6c757d; border-color: #6c757d"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              style="background-color: #dc3545; border-color: #dc3545"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
