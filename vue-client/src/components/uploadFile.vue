<template>
<div>
  <h1>Upload File</h1>
  <input type="file" @change="handleFileChange" />
  <button @click="uploadFile" :disabled="loading">{{uploadBtnText}}</button>


  <h2>File List</h2>
  <ul>
    <li v-for="file in fileList" :key="file.id" style="text-align: left">
      {{ file.original_filename }}
      <button @click="downloadFile(file.original_filename, file.stored_filename)">Download</button>
    </li>
  </ul>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      loading: false,
      uploadBtnText: 'Upload File',
      fileList: [],
    };
  },
  mounted() {
    // Fetch the list of files when the component is mounted
    this.fetchFileList();
  },
  methods: {
    fetchFileList() {
      // Make a GET request to your Express server to get the list of files
      axios.get('http://localhost:3000/files')
          .then(response => {
            this.fileList = response.data;
          })
          .catch(error => {
            console.error(error);
            // Handle error
          });
    },
    downloadFile(originalFilename, storedFilename) {
      console.log('Download file:', storedFilename);

      const original_file_name = originalFilename;

      // Make a GET request to download the file
      axios.get(`http://localhost:3000/uploads/${storedFilename}`, {
        responseType: 'blob', // Set responseType to 'blob' for binary data (like files)
      })
          .then(response => {
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // Create a link element and trigger a click to download the file
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = original_file_name; // Use the original filename
            link.click();
          })
          .catch(error => {
            console.error(error);
            // Handle error
          });
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      //this.loading = true;
      this.uploadBtnText = 'Uploading...';
      // Use a library like axios to send the file to the server
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      axios.post('http://localhost:3000/upload', formData)
          .then(response => {
            //this.loading = false;
            this.uploadBtnText = 'Upload File';
            this.fetchFileList();
            console.log(response.data);
            // Handle success
          })
          .catch(error => {
            //this.loading = false;
            this.uploadBtnText = 'Upload File';
            console.error(error);
            // Handle error
          });
    },
  },
};
</script>