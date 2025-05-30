<script setup lang="ts">
import { onMounted } from 'vue'
import { Tooltip } from 'bootstrap'
import PostCardComponent from './PostCardComponent.vue'

onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
})
</script>

<template>
  <div class="container-fluid py-5 px-4 bg-light rounded-3 shadow-sm">
    <div class="row align-items-center mb-4">
      <div class="col-md-8">
        <div class="d-flex align-items-center gap-2 mb-2">
          <h1 class="h2 fw-bold text-dark mb-0">Khoa</h1>
          <i
            class="bi bi-check-circle-fill text-primary"
            style="font-size: 1.5rem"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Đã xác minh"
          ></i>
        </div>
        <h4 class="text-muted fw-medium mb-2">@khoa</h4>
        <p class="text-secondary mb-0">
          <i class="bi bi-calendar-check-fill me-2"></i>
          Tham gia vào 27/05/2025
        </p>
      </div>
      <div class="col-md-4 d-flex justify-content-md-end gap-3 mt-3 mt-md-0">
        <button
          type="button"
          class="btn btn-primary fw-medium px-4 py-2 rounded-3"
          data-bs-toggle="modal"
          data-bs-target="#editProfileModal"
        >
          Chỉnh sửa thông tin
        </button>
        <button
          type="button"
          class="btn btn-outline-primary fw-medium px-4 py-2 rounded-3"
          data-bs-toggle="modal"
          data-bs-target="#changePasswordModal"
        >
          Thay đổi mật khẩu
        </button>
      </div>
    </div>

    <div class="row text-center py-4 border-top border-bottom">
      <div class="col-md-4">
        <h5 class="fw-bold text-dark mb-1">120</h5>
        <p class="text-muted mb-0">Bài viết</p>
      </div>
      <div class="col-md-4">
        <h5 class="fw-bold text-dark mb-1">350</h5>
        <p class="text-muted mb-0">Bình luận</p>
      </div>
      <div class="col-md-4">
        <h5 class="fw-bold text-dark mb-1">15,200</h5>
        <p class="text-muted mb-0">Lượt xem</p>
      </div>
    </div>

    <div class="row mt-5">
      <h4 class="fw-semibold text-dark mb-4">Bài viết</h4>
      <div class="row row-cols-1 g-4">
        <PostCardComponent></PostCardComponent>
      </div>
    </div>

    <div
      class="modal fade"
      id="editProfileModal"
      tabindex="-1"
      aria-labelledby="editProfileModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-3">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-semibold text-dark" id="editProfileModalLabel">
              Chỉnh sửa thông tin cá nhân
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body pt-3">
            <div class="mb-3">
              <label for="changeDisplayName" class="form-label text-dark fw-medium">Tên</label>
              <input id="changeDisplayName" class="form-control rounded-3" />
            </div>
            <div class="mb-3">
              <label for="changeUserName" class="form-label text-dark fw-medium"
                >Tên người dùng</label
              >
              <input id="changeUserName" class="form-control rounded-3" />
            </div>
            <div class="mb-3">
              <label for="changePhone" class="form-label text-dark fw-medium">Số điện thoại</label>
              <input id="changePhone" class="form-control rounded-3" />
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-outline-secondary fw-medium px-4 py-2 rounded-3"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary fw-medium px-4 py-2 rounded-3"
              data-bs-dismiss="modal"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="changePasswordModal"
      tabindex="-1"
      aria-labelledby="changePasswordModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-3">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-semibold text-dark" id="changePasswordModalLabel">
              Thay đổi mật khẩu
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body pt-3">
            <div class="mb-3">
              <label for="currentPassword" class="form-label text-dark fw-medium"
                >Mật khẩu hiện tại</label
              >
              <input id="currentPassword" type="password" class="form-control rounded-3" />
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label text-dark fw-medium">Mật khẩu mới</label>
              <input id="newPassword" type="password" class="form-control rounded-3" />
            </div>
            <div class="mb-3">
              <label for="confirmNewPassword" class="form-label text-dark fw-medium"
                >Xác nhận mật khẩu mới</label
              >
              <input id="confirmNewPassword" type="password" class="form-control rounded-3" />
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-outline-secondary fw-medium px-4 py-2 rounded-3"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-danger fw-medium px-4 py-2 rounded-3"
              data-bs-dismiss="modal"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
