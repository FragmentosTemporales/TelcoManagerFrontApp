import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadAprobadasAsZip(aprobados, recursoData, recursoUrls) {
    const zip = new JSZip();

    let count = 0;
    for (const recurso of aprobados) {
        const idx = recursoData.findIndex(r => r.id === recurso.id);
        if (recurso.file && recursoUrls[idx]) {
            try {
                const response = await fetch(recursoUrls[idx]);
                const blob = await response.blob();
                let ext = '';
                try {
                    ext = recursoUrls[idx].split('.').pop().split('?')[0];
                    if (!['jpg','jpeg','png','gif','bmp','webp'].includes(ext.toLowerCase())) ext = 'jpg';
                } catch { ext = 'jpg'; }
                zip.file(`${recurso.formulario.pregunta}.${ext}`, blob);
                count++;
            } catch (e) {
                // skip if error
            }
        }
    }
    if (count === 0) {
        alert('No hay imágenes aprobadas para descargar.');
        return;
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'aprobadas.zip');
}
