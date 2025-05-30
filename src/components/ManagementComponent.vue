<script setup lang="ts">
import SideBarManagementComponent from './SideBarManagementComponent.vue'
</script>

<template>
  <div style="padding: 0">
    <div style="display: flex">
      <div style="display: none; flex: 0 0 min(250px, 80vw)" class="d-md-flex">
        <SideBarManagementComponent />
      </div>
      <div style="flex-grow: 1; height: 100vh; overflow-y: auto">
        <nav
          style="background-color: #212529; padding: 0.5rem 1rem"
          class="navbar navbar-dark d-md-none"
        >
          <div style="width: 100%">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
              aria-controls="sidebar"
              style="border: none"
              aria-label="Toggle sidebar"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>
        <div
          class="offcanvas offcanvas-start d-md-none"
          tabindex="-1"
          id="sidebar"
          aria-labelledby="sidebarLabel"
          style="width: min(250px, 80vw)"
        >
          <div style="background-color: #212529; color: #fff; padding: 1rem">
            <h5 style="margin: 0; font-size: 1.25rem" id="sidebarLabel">Menu</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              style="filter: invert(1)"
            ></button>
          </div>
          <div style="padding: 0">
            <SideBarManagementComponent />
          </div>
        </div>
        <div style="padding: 1.5rem">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
