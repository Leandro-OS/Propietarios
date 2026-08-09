<template>
  <div>
    <p class="text-lg font-semibold mb-4">{{ message }}</p>
    <div class="flex gap-4">
      <button @click="$emit('yes')" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition">
        SÍ
      </button>
      <button @click="$emit('no')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        NO
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits<{
  yes: [];
  no: [];
}>();
</script>
