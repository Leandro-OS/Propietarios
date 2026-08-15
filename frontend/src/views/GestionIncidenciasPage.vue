<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Incidencias</h1>
          <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            ATRÁS
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex gap-2 mb-6 border-b">
          <button
            @click="activeTab = 'dashboard'"
            :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            DASHBOARD
          </button>
          <button
            @click="activeTab = 'comunidades'"
            :class="activeTab === 'comunidades' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            COMUNIDADES
          </button>
          <button
            @click="activeTab = 'propietarios'"
            :class="activeTab === 'propietarios' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            PROPIETARIOS
          </button>
        </div>

        <!-- Tab Content: Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="py-4">
          <div class="text-center py-8 text-gray-500">
            <p class="text-lg">Panel principal de incidencias</p>
          </div>
        </div>

        <!-- Tab Content: Comunidades -->
        <div v-if="activeTab === 'comunidades'" class="py-4">
          <div class="text-center py-8 text-gray-500">
            <p class="text-lg">Incidencias por comunidad</p>
          </div>
        </div>

        <!-- Tab Content: Propietarios -->
        <div v-if="activeTab === 'propietarios'" class="py-4">
          <div class="text-center py-8 text-gray-500">
            <p class="text-lg">Incidencias por propietario</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref<'dashboard' | 'comunidades' | 'propietarios'>('dashboard');

const goBack = () => {
  router.push('/');
};
</script>
