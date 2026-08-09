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
            placeholder="Introducir texto a buscar..."
          />
          <button
            @click="handleSearch"
            :disabled="!searchText"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buscar
          </button>
        </div>

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
        <VisualPropietariosList
          :comunidad-id="selectedComunidad.id"
          @select="selectPropietario"
          @back="viewState = 'comunidadDetail'"
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
import { buscarComunidades, buscarPropietarios, getComunidadWithPropietarios } from '../services/api';
import VisualComunidadDetail from '../components/VisualComunidadDetail.vue';
import VisualPropietariosList from '../components/VisualPropietariosList.vue';
import VisualPropietarioDetail from '../components/VisualPropietarioDetail.vue';

type ViewState = 'search' | 'comunidadDetail' | 'propietariosList' | 'propietarioDetail';

const viewState = ref<ViewState>('search');
const searchText = ref('');
const searchType = ref<'comunidades' | 'propietarios'>('comunidades');
const hasSearched = ref(false);
const comunidadesResults = ref<Comunidad[]>([]);
const propietariosResults = ref<Propietario[]>([]);
const selectedComunidad = ref<Comunidad | null>(null);
const selectedPropietario = ref<Propietario | null>(null);

const handleSearch = async () => {
  if (!searchText.value) return;

  if (searchType.value === 'comunidades') {
    comunidadesResults.value = await buscarComunidades(searchText.value);
  } else {
    propietariosResults.value = await buscarPropietarios(searchText.value);
  }
  hasSearched.value = true;
};

const selectComunidad = async (comunidad: Comunidad) => {
  selectedComunidad.value = await getComunidadWithPropietarios(comunidad.id);
  viewState.value = 'comunidadDetail';
};

const selectPropietario = (prop: Propietario) => {
  selectedPropietario.value = prop;
  viewState.value = 'propietarioDetail';
};
</script>
