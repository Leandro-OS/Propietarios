<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Propietarios Históricos</h2>
    <div v-if="propietarios.length === 0" class="text-center py-8">
      <p class="text-gray-500">NO EXISTEN PROPIETARIOS EN EL HISTÓRICO</p>
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
    </div>
    <div class="mt-4">
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        ATRÁS
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { PropietarioHistorico } from '../types';
import { getPropietariosHistoricosByComunidad } from '../services/api';

const props = defineProps<{
  comunidadId: number;
}>();

defineEmits<{
  select: [propietario: PropietarioHistorico];
  back: [];
}>();

const propietarios = ref<PropietarioHistorico[]>([]);

onMounted(async () => {
  propietarios.value = await getPropietariosHistoricosByComunidad(props.comunidadId);
});
</script>
