<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-blue-900 mb-2">Gestión de Propietarios</h1>
      <p class="text-center text-gray-500 mb-8">Sistema de administración de comunidades</p>

      <div class="space-y-4">
        <button
          @click="navigateTo('/gestion')"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span class="text-lg">GESTIÓN COM. PROP.</span>
        </button>

        <button
          @click="navigateTo('/incidencias')"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span class="text-lg">GESTIÓN INCIDENCIAS</span>
        </button>

        <button
          @click="navigateTo('/visualizacion')"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span class="text-lg">VISUALIZACIÓN COM. PROP.</span>
        </button>

        <button
          @click="navigateTo('/historico')"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span class="text-lg">HISTORICO</span>
        </button>

        <button
          @click="navigateTo('/busqueda')"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span class="text-lg">BÚSQUEDA</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};
</script>
