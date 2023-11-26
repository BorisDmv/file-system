<template>
  <div v-if="webhookData">
    <h2>Received Real-Time Webhook Data:</h2>
    <pre>{{ webhookData }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import io from 'socket.io-client';

const webhookData = ref(null);

onMounted(async () => {
  const socket = io('http://localhost:3000');

  socket.on('webhookData', (data) => {
    console.log('Received real-time webhook data:', data);
    webhookData.value = data;
  });

  try {
    const response = await axios.post('http://localhost:3000/subscribe', {
      webhookUrl: 'http://localhost:3000/webhook', // Adjust the port as needed
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error subscribing to webhook:', error);
  }
});
</script>



<style scoped>
.read-the-docs {
  color: #888;
}
</style>