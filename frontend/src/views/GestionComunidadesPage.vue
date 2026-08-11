<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Comunidades de Propietarios</h1>
      </div>

      <!-- Lista de Comunidades -->
      <div v-if="viewState === 'list'" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex gap-4 mb-6">
          <button @click="openCreateForm" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            CREAR COM.PROP.
          </button>
          <button @click="goHome" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
            ATRÁS
          </button>
        </div>

        <div v-if="comunidades.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">NO EXISTEN COMUNIDADES DE PROPIETARIOS</p>
        </div>

        <div v-else>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-200">
                <th class="border p-3 text-left font-bold text-gray-700">ID</th>
                <th class="border p-3 text-left font-bold text-gray-700">COMUNIDAD PROPIETARIOS</th>
                <th class="border p-3 text-left font-bold text-gray-700">POBLACIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="comunidad in comunidades"
                :key="comunidad.id"
                @click="selectComunidad(comunidad.id)"
                class="hover:bg-blue-50 cursor-pointer transition"
              >
                <td class="border p-3">{{ comunidad.id }}</td>
                <td class="border p-3">{{ comunidad.via }} {{ comunidad.direccion }} {{ comunidad.numero }}</td>
                <td class="border p-3">{{ comunidad.poblacion }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div class="flex justify-center items-center gap-4 mt-4">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Formulario Crear Comunidad -->
      <div v-if="viewState === 'create'" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Crear Comunidad de Propietarios</h2>
        <CreateComunidadForm @save="handleCreateComunidad" @cancel="viewState = 'list'" />
      </div>

      <!-- Detalle de Comunidad -->
      <div v-if="viewState === 'detail' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <ComunidadDetail
          :comunidad="selectedComunidad"
          @modify="openModifyForm"
          @delete="confirmDeleteComunidad"
          @createPropietario="viewState = 'createPropietario'"
          @viewPropietarios="viewState = 'propietariosList'"
          @cancel="viewState = 'list'"
        />
      </div>

      <!-- Modificar Comunidad -->
      <div v-if="viewState === 'modify' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Modificar Comunidad de Propietarios</h2>
        <ModifyComunidadForm
          :comunidad="selectedComunidad"
          @save="handleModifyComunidad"
          @cancel="viewState = 'detail'"
        />
      </div>

      <!-- Crear Propietario -->
      <div v-if="viewState === 'createPropietario' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <CreatePropietarioForm
          :comunidad="selectedComunidad"
          @save="handleCreatePropietario"
          @cancel="viewState = 'detail'"
        />
      </div>

      <!-- Lista de Propietarios -->
      <div v-if="viewState === 'propietariosList' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <PropietariosList
          :comunidad-id="selectedComunidad.id"
          @select="selectPropietario"
          @back="viewState = 'detail'"
        />
      </div>

      <!-- Detalle de Propietario -->
      <div v-if="viewState === 'propietarioDetail' && selectedPropietario" class="bg-white rounded-lg shadow-md p-6">
        <PropietarioDetail
          :propietario="selectedPropietario"
          :comunidad="selectedComunidad"
          @modify="openModifyPropietario"
          @delete="confirmDeletePropietario"
          @back="viewState = 'propietariosList'"
        />
      </div>

      <!-- Modificar Propietario -->
      <div v-if="viewState === 'modifyPropietario' && selectedPropietario" class="bg-white rounded-lg shadow-md p-6">
        <ModifyPropietarioForm
          :propietario="selectedPropietario"
          @save="handleModifyPropietario"
          @cancel="viewState = 'propietarioDetail'"
        />
      </div>

      <!-- Confirmación de eliminación -->
      <div v-if="viewState === 'confirmDeleteComunidad' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <ConfirmDeleteComunidad
          :comunidad-id="selectedComunidad.id"
          @deleted="handleComunidadDeleted"
          @cancelled="viewState = 'detail'"
        />
      </div>

      <div v-if="viewState === 'confirmDeletePropietario'" class="bg-white rounded-lg shadow-md p-6">
        <ConfirmDeletePropietario
          :propietario-id="selectedPropietario?.id"
          @deleted="viewState = 'propietariosList'"
          @cancelled="viewState = 'propietarioDetail'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Comunidad, Propietario } from '../types';
import {
  getComunidades,
  createComunidad,
  updateComunidad,
  getComunidadWithPropietarios,
  createPropietario,
  updatePropietario
} from '../services/api';
import CreateComunidadForm from '../components/CreateComunidadForm.vue';
import ModifyComunidadForm from '../components/ModifyComunidadForm.vue';
import ComunidadDetail from '../components/ComunidadDetail.vue';
import CreatePropietarioForm from '../components/CreatePropietarioForm.vue';
import PropietariosList from '../components/PropietariosList.vue';
import PropietarioDetail from '../components/PropietarioDetail.vue';
import ModifyPropietarioForm from '../components/ModifyPropietarioForm.vue';
import ConfirmDeleteComunidad from '../components/ConfirmDeleteComunidad.vue';
import ConfirmDeletePropietario from '../components/ConfirmDeletePropietario.vue';

const router = useRouter();

type ViewState = 'list' | 'create' | 'detail' | 'modify' | 'createPropietario' |
  'propietariosList' | 'propietarioDetail' | 'modifyPropietario' |
  'confirmDeleteComunidad' | 'confirmDeletePropietario';

const viewState = ref<ViewState>('list');
const comunidades = ref<Comunidad[]>([]);
const selectedComunidad = ref<Comunidad | null>(null);
const selectedPropietario = ref<Propietario | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

onMounted(async () => {
  await loadComunidades();
});

const loadComunidades = async () => {
  const data = await getComunidades(currentPage.value);
  comunidades.value = data.comunidades;
  totalPages.value = data.pagination.totalPages;
};

const changePage = async (page: number) => {
  currentPage.value = page;
  await loadComunidades();
};

const goHome = () => {
  router.push('/');
};

const openCreateForm = () => {
  viewState.value = 'create';
};

const selectComunidad = async (id: number) => {
  selectedComunidad.value = await getComunidadWithPropietarios(id);
  viewState.value = 'detail';
};

const handleCreateComunidad = async (data: Partial<Comunidad>) => {
  await createComunidad(data);
  viewState.value = 'list';
  await loadComunidades();
};

const openModifyForm = () => {
  viewState.value = 'modify';
};

const handleModifyComunidad = async (data: Partial<Comunidad>) => {
  if (selectedComunidad.value) {
    await updateComunidad(selectedComunidad.value.id, data);
    selectedComunidad.value = await getComunidadWithPropietarios(selectedComunidad.value.id);
    viewState.value = 'detail';
  }
};

const confirmDeleteComunidad = () => {
  viewState.value = 'confirmDeleteComunidad';
};

const handleComunidadDeleted = async () => {
  viewState.value = 'list';
  await loadComunidades();
};

const selectPropietario = (prop: Propietario) => {
  selectedPropietario.value = prop;
  viewState.value = 'propietarioDetail';
};

const handleCreatePropietario = async (data: Partial<Propietario>) => {
  await createPropietario(data);
  if (selectedComunidad.value) {
    selectedComunidad.value = await getComunidadWithPropietarios(selectedComunidad.value.id);
  }
  viewState.value = 'detail';
};

const openModifyPropietario = () => {
  viewState.value = 'modifyPropietario';
};

const handleModifyPropietario = async (data: Partial<Propietario>) => {
  if (selectedPropietario.value) {
    await updatePropietario(selectedPropietario.value.id, data);
    selectedPropietario.value = null;
    viewState.value = 'propietariosList';
  }
};

const confirmDeletePropietario = () => {
  viewState.value = 'confirmDeletePropietario';
};
</script>
