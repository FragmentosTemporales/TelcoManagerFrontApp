import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import client from '../api/axiosClient';

export async function downloadAprobadasAsZip(aprobados) {
    const zip = new JSZip();

    let count = 0;
    for (let i = 0; i < aprobados.length; i++) {
        const recurso = aprobados[i];
        if (!recurso.file) {
            console.warn(`[${i}] Recurso sin file:`, recurso);
            continue;
        }
        try {
            const response = await client.post('/view-image', { file_path: recurso.file }, { responseType: 'blob' });
            const blob = response.data;
            const ext = recurso.file.split('.').pop().toLowerCase() || 'jpg';
            const rawName = recurso.formulario?.pregunta || `imagen_${i}`;
            const baseName = rawName.replace(/[\t\n\r\\/:*?"<>|]+/g, '').trim();
            let fileName = `${baseName}.${ext}`;
            let suffix = 1;
            while (zip.files[fileName]) {
                fileName = `${baseName}_${suffix}.${ext}`;
                suffix++;
            }
            zip.file(fileName, blob);
            count++;
        } catch (e) {
            console.error(`[${i}] Error descargando archivo:`, e, recurso);
        }
    }
    if (count === 0) {
        alert('No hay imágenes aprobadas para descargar.');
        return;
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'aprobadas.zip');
}
