import axios from 'axios';

function FileUpload() {
  const uploadFiles = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    const response = await axios.post('http://localhost:8000/uploadfiles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data); // Handle the response as needed
  };

  return (
    <div>
      <h2>Upload Files</h2>
      <input
        type="file"
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
      />
    </div>
  );
}

export default FileUpload;