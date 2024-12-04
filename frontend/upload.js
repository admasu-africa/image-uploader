document.getElementById('imageForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const files = document.getElementById('files').files;

    if (files.length === 0) {
      alert('Please select at least one image.');
      return;
    }
    formData.append('title', title);
    formData.append('description', description);

    Array.from(files).forEach((image, index) => {
      formData.append('files', image);  
    });
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.textContent = 'Uploading...';

    try {
      const response = await fetch('http://localhost:3000/items', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      // console.log("Response: ",response,"Result: ",result)
  
      if (response.ok) {
        uploadStatus.textContent = 'Upload successful!';
        document.getElementById('files').files.value = ""; 
        document.getElementById('title').value = "";
        document.getElementById('description').value = "";
      } else {
        uploadStatus.textContent = `Error: ${result.message}`;
      }
    } catch (error) {
      uploadStatus.textContent = 'Error uploading images.';
      console.error(error);
    }
  });

 