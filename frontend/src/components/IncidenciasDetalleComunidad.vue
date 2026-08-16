<template>
  <div>
    <!-- Header: Titulo con nombre de comunidad -->
    <div class="bg-gray-100 rounded-lg p-4 mb-4">
      <h2 class="text-xl font-bold text-gray-800">
        Listado incidencias de {{ comunidad.comunidad }}
      </h2>
      <p class="text-sm text-gray-600 mt-1">{{ comunidad.poblacion }} - ID: {{ comunidad.id }}</p>
    </div>
    <!-- Botones de accion -->
    <div class="flex gap-2 mb-4">
      <button @click="openCreateForm" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
        + CREAR INCIDENCIA
      </button>
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
        VOLVER A LISTADO
      </button>
    </div>
    <!-- Formulario Creacion -->
    <div v-if="showCreateForm" class="mb-6">
      <CreateIncidenciaForm :comunidades="[comunidad]" :is-evolution="false" @save="handleCreateIncidencia" @cancel="showCreateForm = false" />
    </div>
    <!-- Formulario Evolucion -->
    <div v-if="showEvolutionForm" class="mb-6">
      <CreateIncidenciaForm :comunidades="[comunidad]" :is-evolution="true" :initial-data="selectedIncidencia" :allowed-states="allowedEvolutionStates" @save="handleEvolutionIncidencia" @cancel="showEvolutionForm = false" />
    </div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-blue-600 font-semibold">CARGANDO INCIDENCIAS...</p>
    </div>
    <!-- Listado Vacio -->
    <div v-else-if="incidencias.length === 0 && !showCreateForm && !showEvolutionForm" class="text-center py-8">
      <p class="text-gray-500 text-lg">NO EXISTEN INCIDENCIAS PARA ESTA COMUNIDAD</p>
    </div>
    <!-- Tabla de Incidencias con paginacion -->
    <div v-else-if="!showCreateForm && !showEvolutionForm" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left font-bold text-gray-700">TIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">SUBTIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">DESCRIPCION</th>
            <th class="border p-3 text-left font-bold text-gray-700">ESTADO</th>
            <th class="border p-3 text-left font-bold text-gray-700">FECHA CREACION</th>
            <th class="border p-3 text-left font-bold text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inc in paginatedIncidencias" :key="inc.idIncidencia" class="hover:bg-blue-50 cursor-pointer transition">
            <td class="border p-3">{{ inc.tipoIncidencia }}</td>
            <td class="border p-3">{{ inc.subtipoIncidencia || "-" }}</td>
            <td class="border p-3">{{ inc.descripcion }}</td>
            <td class="border p-3"><span :class="getEstadoClass(inc.estado)">{{ inc.estado }}</span></td>
            <td class="border p-3">{{ formatDate(inc.fechaCreacion) }}</td>
            <td class="border p-3 text-center">
              <button @click="viewDetalle(inc)" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition">DETALLE</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginacion -->
      <div class="flex justify-between items-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">ANTERIOR</button>
        <span class="text-gray-700 font-medium">Pagina {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">SIGUIENTE</button>
      </div>
    </div>
    <!-- Modal Detalle -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold mb-4 text-blue-800">DETALLE DE INCIDENCIA</h3>
        <div v-if="selectedIncidencia" class="space-y-2">
          <p><strong>Tipo:</strong> {{ selectedIncidencia.tipoIncidencia }}</p>
          <p><strong>Subtipo:</strong> {{ selectedIncidencia.subtipoIncidencia || "-" }}</p>
          <p><strong>Descripcion:</strong> {{ selectedIncidencia.descripcion }}</p>
          <p><strong>Estado:</strong> {{ selectedIncidencia.estado }}</p>
          <p><strong>Descripcion Estado:</strong> {{ selectedIncidencia.descripcionEstado }}</p>
          <p><strong>Fecha Creacion:</strong> {{ formatDate(selectedIncidencia.fechaCreacion) }}</p>
          <p v-if="selectedIncidencia.fechaModificacion"><strong>Fecha Modificacion:</strong> {{ formatDate(selectedIncidencia.fechaModificacion) }}</p>
          <p v-if="selectedIncidencia.fechaCierre"><strong>Fecha Cierre:</strong> {{ formatDate(selectedIncidencia.fechaCierre) }}</p>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="evolucionarIncidencia" :disabled="selectedIncidencia?.estado === 'Cerrada'" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed">EVOLUCIONAR</button>
          <button @click="showDetailModal = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex-1">CERRAR</button>
        </div>
      </div>
    </div>
    <!-- Modal Error -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p class="text-red-600 font-semibold mb-4">{{ errorMessage }}</p>
        <button @click="showErrorModal = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { getIncidenciasByComunidad } from '../services/api';
import { createIncidenciaComunidad, updateIncidenciaComunidad } from '../services/api';
import type { IncidenciaComunidadTitulo } from '../types';
import CreateIncidenciaForm from './CreateIncidenciaForm.vue';

const props = defineProps<{ comunidadId: number; comunidad: { id: number; comunidad: string; poblacion: string } }>();
const emit = defineEmits(['back']);

const incidencias = ref<IncidenciaComunidadTitulo[]>([]);
const loading = ref(false);
const showCreateForm = ref(false);
const showEvolutionForm = ref(false);
const showDetailModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const selectedIncidencia = ref<IncidenciaComunidadTitulo | null>(null);

// Paginacion
const currentPage = ref(1);
const pageSize = 10;

const paginatedIncidencias = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return incidencias.value.slice(start, start + pageSize);
});

const totalPages = computed(() => Math.max(1, Math.ceil(incidencias.value.length / pageSize)));

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Flujo de estados
const flujo: Record<string, string[]> = {
  'Registrada': ['Abierta'],
  'Abierta': ['En proceso', 'Bloqueada'],
  'En proceso': ['En ejecucion', 'Bloqueada'],
  'En ejecucion': ['Resuelta', 'Bloqueada'],
  'Bloqueada': ['En ejecucion', 'Resuelta'],
  'Resuelta': ['Cerrada'],
  'Cerrada': []
};

const allowedEvolutionStates = computed(() => {
  if (!selectedIncidencia.value) return [];
  return flujo[selectedIncidencia.value.estado] || [];
});

// Formatters
function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getEstadoClass(estado: string): string {
  const map: Record<string, string> = {
    'Registrada': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold',
    'Abierta': 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold',
    'En proceso': 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold',
    'En ejecucion': 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold',
    'Bloqueada': 'bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-semibold',
    'Resuelta': 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold',
    'Cerrada': 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold'
  };
  return map[estado] || 'px-2 py-1 rounded text-xs';
}

// Actions
function openCreateForm() {
  showCreateForm.value = true;
  showEvolutionForm.value = false;
}

function viewDetalle(inc: IncidenciaComunidadTitulo) {
  selectedIncidencia.value = inc;
  showDetailModal.value = true;
}

function evolucionarIncidencia() {
  if (!selectedIncidencia.value) return;
  showDetailModal.value = false;
  showEvolutionForm.value = true;
  showCreateForm.value = false;
}

async function handleCreateIncidencia(formData: {
  idCom: number; tipoIncidencia: string; subtipoIncidencia: string | null;
  descripcion: string; estado: string; descripcionEstado: string;
}) {
  try {
    await createIncidenciaComunidad(formData);
    showCreateForm.value = false;
    await loadIncidencias();
  } catch (e) {
    console.error('Error creando incidencia:', e);
  }
}

async function handleEvolutionIncidencia(data: { estado: string; descripcionEstado: string }) {
  if (!selectedIncidencia.value) return;
  try {
    await updateIncidenciaComunidad(selectedIncidencia.value.idIncidencia, {
      estado: data.estado,
      descripcionEstado: data.descripcionEstado
    });
    showEvolutionForm.value = false;
    selectedIncidencia.value = null;
    await loadIncidencias();
  } catch (e: any) {
    const errorData = e?.error;
    errorMessage.value = errorData || 'Error al evolucionar la incidencia';
    showErrorModal.value = true;
  }
}

async function loadIncidencias() {
  loading.value = true;
  try {
    const data = await getIncidenciasByComunidad(props.comunidadId);
    incidencias.value = data.incidencias;
    currentPage.value = 1;
  } catch (e) {
    console.error('Error cargando incidencias:', e);
  } finally {
    loading.value = false;
  }
}

watch(() => props.comunidadId, () => loadIncidencias());

loadIncidencias();
</script>
