<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 class="text-2xl font-bold text-gray-800">Búsqueda</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex gap-4 mb-4">
          <input
            v-model="searchText"
            type="text"
            class="flex-1 border rounded-lg p-2"
            :class="{ 'border-red-500': searchError }"
            placeholder="Introducir texto a buscar..."
            @input="validateSearchText"
          />
          <button
            @click="handleSearch"
            :disabled="!searchText || !!searchError"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buscar
          </button>
        </div>

        <p v-if="searchError" class="text-red-500 text-sm mb-4">{{ searchError }}</p>

        <div class="flex gap-6 mb-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="searchType"
              value="comunidades"
              class="w-4 h-4"
            />
            <span>COMUNIDADES</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="searchType"
              value="propietarios"
              class="w-4 h-4"
            />
            <span>PROPIETARIOS</span>
          </label>
        </div>

        <!-- Resultados de búsqueda de Comunidades -->
        <div v-if="hasSearched && searchType === 'comunidades'">
          <h2 class="text-lg font-semibold mb-4">Resultados de Comunidades</h2>
          <div v-if="comunidadesResults.length === 0" class="text-center py-8">
            <p class="text-gray-500">No se encontraron resultados</p>
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
                  v-for="comunidad in comunidadesResults"
                  :key="comunidad.id"
                  @click="selectComunidad(comunidad)"
                  class="hover:bg-blue-50 cursor-pointer transition"
                >
                  <td class="border p-3">{{ comunidad.id }}</td>
                  <td class="border p-3">{{ comunidad.via }} {{ comunidad.direccion }} {{ comunidad.numero }}</td>
                  <td class="border p-3">{{ comunidad.poblacion }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Paginación -->
            <div class="flex justify-between items-center mt-4">
              <button
                @click="changeComunidadPage(currentComunidadPage - 1)"
                :disabled="currentComunidadPage === 1"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← ANTERIOR
              </button>
              <span class="text-gray-700">
                Página {{ currentComunidadPage }} de {{ comunidadTotalPages }}
              </span>
              <button
                @click="changeComunidadPage(currentComunidadPage + 1)"
                :disabled="currentComunidadPage === comunidadTotalPages"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SIGUIENTE →
              </button>
            </div>
          </div>
        </div>

        <!-- Resultados de búsqueda de Propietarios -->
        <div v-if="hasSearched && searchType === 'propietarios'">
          <h2 class="text-lg font-semibold mb-4">Resultados de Propietarios</h2>
          <div v-if="propietariosResults.length === 0" class="text-center py-8">
            <p class="text-gray-500">No se encontraron resultados</p>
          </div>
          <div v-else>
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-200">
                  <th class="border p-3 text-left font-bold text-gray-700">NÚMERO</th>
                  <th class="border p-3 text-left font-bold text-gray-700">NOMBRE</th>
                  <th class="border p-3 text-left font-bold text-gray-700">TIPO</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="prop in propietariosResults"
                  :key="prop.id"
                  @click="selectPropietario(prop)"
                  class="hover:bg-blue-50 cursor-pointer transition"
                >
                  <td class="border p-3">{{ prop.numPropiedad }}</td>
                  <td class="border p-3">{{ prop.nombre }} {{ prop.apellido1 }} {{ prop.apellido2 }}</td>
                  <td class="border p-3">{{ prop.tipo }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Paginación -->
            <div class="flex justify-between items-center mt-4">
              <button
                @click="changePropietarioPage(currentPropietarioPage - 1)"
                :disabled="currentPropietarioPage === 1"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← ANTERIOR
              </button>
              <span class="text-gray-700">
                Página {{ currentPropietarioPage }} de {{ propietarioTotalPages }}
              </span>
              <button
                @click="changePropietarioPage(currentPropietarioPage + 1)"
                :disabled="currentPropietarioPage === propietarioTotalPages"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SIGUIENTE →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalle de Comunidad -->
      <div v-if="viewState === 'comunidadDetail' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6 mt-4">
        <VisualComunidadDetail
          :comunidad="selectedComunidad"
          @viewPropietarios="viewState = 'propietariosList'"
          @cancel="viewState = 'search'"
        />
      </div>

      <!-- Lista de Propietarios -->
      <div v-if="viewState === 'propietariosList' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6 mt-4">
        <PropietariosList
          :comunidad-id="selectedComunidad.id"
          :show-create-button="true"
          @select="selectPropietario"
          @back="viewState = 'comunidadDetail'"
          @create="viewState = 'createPropietario'"
        />
      </div>

      <!-- Crear Propietario -->
      <div v-if="viewState === 'createPropietario' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6 mt-4">
        <CreatePropietarioForm
          :comunidad="selectedComunidad"
          @save="handleCreatePropietario"
          @cancel="viewState = 'propietariosList'"
        />
      </div>

      <!-- Detalle de Propietario -->
      <div v-if="viewState === 'propietarioDetail' && selectedPropietario" class="bg-white rounded-lg shadow-md p-6 mt-4">
        <VisualPropietarioDetail
          :propietario="selectedPropietario"
          @back="viewState = 'search'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Comunidad, Propietario } from '../types';
import { buscarComunidades, buscarPropietarios, getComunidadWithPropietarios, createPropietario } from '../services/api';
import VisualComunidadDetail from '../components/VisualComunidadDetail.vue';
import PropietariosList from '../components/PropietariosList.vue';
import VisualPropietarioDetail from '../components/VisualPropietarioDetail.vue';
import CreatePropietarioForm from '../components/CreatePropietarioForm.vue';

type ViewState = 'search' | 'comunidadDetail' | 'propietariosList' | 'propietarioDetail' | 'createPropietario';

const viewState = ref<ViewState>('search');
const searchText = ref('');
const searchType = ref<'comunidades' | 'propietarios'>('comunidades');
const hasSearched = ref(false);
const searchError = ref('');

const comunidadesResults = ref<Comunidad[]>([]);
const propietariosResults = ref<Propietario[]>([]);

const currentComunidadPage = ref(1);
const currentPropietarioPage = ref(1);
const comunidadTotalPages = ref(0);
const propietarioTotalPages = ref(0);

const selectedComunidad = ref<Comunidad | null>(null);
const selectedPropietario = ref<Propietario | null>(null);

const validateSearchText = () => {
  const text = searchText.value;
  const alphanumericRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]*$/;
  
  if (text.length > 100) {
    searchError.value = 'Máximo 100 caracteres permitidos';
  } else if (!alphanumericRegex.test(text)) {
    searchError.value = 'Solo se permiten caracteres alfanuméricos';
  } else {
    searchError.value = '';
  }
};

const handleSearch = async () => {
  if (!searchText.value || searchError.value) return;

  if (searchType.value === 'comunidades') {
    const result = await buscarComunidades(searchText.value, currentComunidadPage.value);
    comunidadesResults.value = result.comunidades;
    comunidadTotalPages.value = result.pagination.totalPages;
  } else {
    const result = await buscarPropietarios(searchText.value, currentPropietarioPage.value);
    propietariosResults.value = result.propietarios;
    propietarioTotalPages.value = result.pagination.totalPages;
  }
  hasSearched.value = true;
};

const changeComunidadPage = async (page: number) => {
  currentComunidadPage.value = page;
  await handleSearch();
};

const changePropietarioPage = async (page: number) => {
  currentPropietarioPage.value = page;
  await handleSearch();
};

const selectComunidad = async (comunidad: Comunidad) => {
  selectedComunidad.value = await getComunidadWithPropietarios(comunidad.id);
  viewState.value = 'comunidadDetail';
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
  viewState.value = 'comunidadDetail';
};
</script>
