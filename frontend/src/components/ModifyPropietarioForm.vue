<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Modificar Propietario</h2>

    <!-- Mensaje si es Propietario -->
    <div v-if="propietario.tipo === 'Propietario'" class="mb-4">
      <p class="text-red-600 font-semibold">IMPOSIBLE MODIFICAR. SOLO INQUILINOS O AYUNTAMIENTO</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input v-model="form.nombre" type="text" class="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido 1 *</label>
          <input v-model="form.apellido1" type="text" class="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido 2 *</label>
          <input v-model="form.apellido2" type="text" class="w-full border rounded-lg p-2" required />
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button type="submit" :disabled="!isFormValid" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
          ACEPTAR
        </button>
        <button type="button" @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
          CANCELAR
        </button>
      </div>
    </form>

    <div v-if="propietario.tipo === 'Propietario'" class="mt-4">
      <button @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        CANCELAR
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import type { Propietario } from '../types';

const props = defineProps<{
  propietario: Propietario;
}>();

const emit = defineEmits<{
  save: [data: Partial<Propietario>];
  cancel: [];
}>();

const form = reactive({
  nombre: '',
  apellido1: '',
  apellido2: ''
});

onMounted(() => {
  form.nombre = props.propietario.nombre;
  form.apellido1 = props.propietario.apellido1;
  form.apellido2 = props.propietario.apellido2;
});

const isFormValid = computed(() => {
  return form.nombre && form.apellido1 && form.apellido2;
});

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { ...form });
  }
};
</script>
