<template>
  <div>
    <div v-if="step === 'confirm'">
      <p class="text-lg font-semibold mb-4">¿ESTA SEGURO DE SUPRIMIR EL PROPIETARIO?</p>
      <div class="flex gap-4">
        <button @click="step = 'motivo'" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          SÍ
        </button>
        <button @click="$emit('cancelled')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
          NO
        </button>
      </div>
    </div>

    <div v-if="step === 'motivo'">
      <label class="block text-sm font-medium text-gray-700 mb-2">Motivo de la baja</label>
      <textarea
        v-model="motivo"
        class="w-full border rounded-lg p-2 mb-4"
        rows="3"
        placeholder="Indique el motivo de la baja..."
      ></textarea>
      <div class="flex gap-4">
        <button @click="handleDelete" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          ACEPTAR
        </button>
        <button @click="$emit('cancelled')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
          CANCELAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deletePropietario } from '../services/api';

const props = defineProps<{
  propietarioId?: number;
}>();

const emit = defineEmits<{
  deleted: [];
  cancelled: [];
}>();

const step = ref<'confirm' | 'motivo'>('confirm');
const motivo = ref('');

const handleDelete = async () => {
  if (props.propietarioId) {
    await deletePropietario(props.propietarioId, motivo.value || undefined);
    emit('deleted');
  }
};
</script>
