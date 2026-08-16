<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Listado de Comunidades</h2>
    <button
      @click="openCreateForm"
      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition mb-4 flex items-center gap-2"
    >
      ＋ CREAR INCIDENCIA
    </button>
    <div v-if="showCreateForm" class="mb-6">
      <CreateIncidenciaForm
        :comunidades="comunidades"
        @save="handleCreateIncidencia"
        @cancel="showCreateForm = false"
      />
    </div>
    <div v-if="comunidades.length === 0 && !loading && !showCreateForm" class="text-center py-8">
      <p class="text-gray-500 text-lg">NO EXISTEN COMUNIDADES DE PROPIETARIOS</p>
    </div>
    <div v-if="loading" class="text-center py-8">
      <p class="text-blue-600 font-semibold">CARGANDO...</p>
    </div>
    <div v-if="!showCreateForm" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left font-bold text-gray-700">COMUNIDAD</th>
            <th class="border p-3 text-left font-bold text-gray-700">POBLACION</th>
            <th class="border p-3 text-center font-bold text-gray-700">ACTIVAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">BLOQUEADAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">CERRADAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="comunidad in comunidades"
            :key="comunidad.id"
            @dblclick="viewIncidencias(comunidad)"
            class="hover:bg-blue-50 cursor-pointer transition"
          >
            <td class="border p-3">{{ comunidad.comunidad }}</td>
            <td class="border p-3">{{ comunidad.poblacion }}</td>
            <td class="border p-3 text-center">
              <span :class="getBadgeClass(comunidad.activas, 'activa')">{{ comunidad.activas }}</span>
            </td>
            <td class="border p-3 text-center">
              <span :class="getBadgeClass(comunidad.bloqueadas, 'bloqueada')">{{ comunidad.bloqueadas }}</span>
            </td>
            <td class="border p-3 text-center">
              <span :class="getBadgeClass(comunidad.cerradas, 'cerrada')">{{ comunidad.cerradas }}</span>
            </td>
            <td class="border p-3 text-center">
              <button
                @click.stop="viewIncidencias(comunidad)"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition"
              >
                VER
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-4">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← ANTERIOR
        </button>
        <span class="text-gray-700 font-medium">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SIGUIENTE →
        </button>
      </div>
      <div class="flex justify-center mt-6">
        <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
          ATRÁS
        </button>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p class="text-red-600 font-semibold mb-4">{{ modalMessage }}</p>
        <button @click="showModal = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full">
          OK
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { ComunidadIncidenciaCount } from '../types';
import { getComunidadesConIncidencias, createIncidenciaComunidad } from '../services/api';
import CreateIncidenciaForm from './CreateIncidenciaForm.vue';

const emit = defineEmits<{
  view: [comunidad: ComunidadIncidenciaCount];
  back: [];
}>();

const router = useRouter();

const comunidades = ref<ComunidadIncidenciaCount[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const showCreateForm = ref(false);
const showModal = ref(false);
const modalMessage = ref('');

onMounted(async () => {
  await loadComunidades();
});

const loadComunidades = async () => {
  loading.value = true;
  try {
    const data = await getComunidadesConIncidencias(currentPage.value);
    comunidades.value = data.comunidades;
    totalPages.value = data.pagination.totalPages;
  } catch (error) {
    console.error('Error al cargar comunidades:', error);
    modalMessage.value = 'ERROR AL CARGAR LAS COMUNIDADES';
    showModal.value = true;
  } finally {
    loading.value = false;
  }
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await loadComunidades();
};

const viewIncidencias = (comunidad: ComunidadIncidenciaCount) => {
  emit('view', comunidad);
};

const openCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
};

const handleCreateIncidencia = async (data: {
  idCom: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string;
}) => {
  try {
    await createIncidenciaComunidad(data);
    showCreateForm.value = false;
    await loadComunidades();
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    modalMessage.value = 'ERROR AL CREAR LA INCIDENCIA';
    showModal.value = true;
  }
};

const getBadgeClass = (count: number, type: 'activa' | 'bloqueada' | 'cerrada' = 'activa'): string => {
  if (count === 0) return 'text-gray-400';
  if (type === 'bloqueada') return 'text-orange-600 font-bold';
  if (type === 'cerrada') return 'text-gray-500';
  if (count <= 2) return 'text-yellow-600 font-bold';
  return 'text-red-600 font-bold';
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.border {
  border-color: #d1d5db;
}
</style>
