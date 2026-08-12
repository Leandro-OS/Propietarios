<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Propietarios de la Comunidad</h2>
    <div v-if="propietarios.length === 0" class="text-center py-8">
      <p class="text-gray-500">NO EXISTEN PROPIETARIOS</p>
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
            v-for="prop in propietarios"
            :key="prop.id"
            @click="$emit('select', prop)"
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
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← ANTERIOR
        </button>
        <span class="text-gray-700">
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
    </div>

    <div class="flex gap-4 mt-4">
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        ATRÁS
      </button>
      <button @click="$emit('create')" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition">
        CREAR PROPIETARIO
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Propietario } from '../types';
import { getPropietariosByComunidad } from '../services/api';

const props = defineProps<{
  comunidadId: number;
  showCreateButton?: boolean;
}>();

defineEmits<{
  select: [propietario: Propietario];
  back: [];
  create: [];
}>();

const propietariosAll = ref<Propietario[]>([]);
const currentPage = ref(1);
const limit = 10;

const totalPages = computed(() => Math.ceil(propietariosAll.value.length / limit));

const propietarios = computed(() => {
  const start = (currentPage.value - 1) * limit;
  return propietariosAll.value.slice(start, start + limit);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(async () => {
  propietariosAll.value = await getPropietariosByComunidad(props.comunidadId);
});
</script>
