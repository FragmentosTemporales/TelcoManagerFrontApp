import client from './axiosClient';

export const downloadFile = async (payload) => {
  try {
    const response = await client.post('/download', payload, { responseType: 'blob' });

    const fileName = response.headers['content-disposition']?.split('filename=')[1] || 'archivo';

    const urlBlob = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob);

  } catch (error) {
    console.error('Error al descargar el archivo:', error.message);
    throw error;
  }
};

export const fetchFileUrl = async (payload) => {
  try {
    const response = await client.post('/view-image', payload, { responseType: 'blob' });
    const fileUrl = URL.createObjectURL(response.data);
    return fileUrl;
  } catch (error) {
    console.error('Error al obtener el archivo:', error.message);
    throw error;
  }
};