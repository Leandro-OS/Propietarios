<template>
  <div>
    <!-- Paso 1: Advertencia -->
    <div v-if="step === 'warning'" class="text-center">
      <p class="text-lg font-bold text-red-700 mb-2">¡ATENCIÓN, VA A ELIMINAR UNA COMUNIDAD DE PROPIETARIOS!</p>
      <p class="text-lg font-semibold text-red-600 mb-6">¿ESTÁS SEGURO DE CONTINUAR?</p>
      <div class="flex justify-center gap-4">
        <button @click="step = 'motivo'" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          SÍ
        </button>
        <button @click="$emit('cancelled')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
          NO
        </button>
      </div>
    </div>

    <!-- Paso 2: Motivo de supresión -->
    <div v-if="step === 'motivo'" class="text-center">
      <p class="text-lg font-semibold mb-4">MOTIVO SUPRESIÓN</p>
      <textarea
        v-model="motivo"
        rows="4"
        class="w-full border border-gray-300 rounded p-3 mb-4"
        placeholder="Indique el motivo de la supresión (opcional)"
      ></textarea>
      <div class="flex justify-center">
        <button @click="handleDelete" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  comunidadId: number;
}>();

const emit = defineEmits<{
  deleted: [];
  cancelled: [];
}>();

const step = ref<'warning' | 'motivo'>('warning');
const motivo = ref('');

const handleDelete = async () => {
  const API_BASE = '/api';
  await fetch(`${API_BASE}/comunidades/${props.comunidadId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo: motivo.value || undefined })
  });
  emit('deleted');
};
</script>
