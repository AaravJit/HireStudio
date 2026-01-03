import JSZip from 'jszip';

export async function buildZip(files: { filename: string; buffer: Buffer }[]) {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.filename, file.buffer);
  });
  return zip.generateAsync({ type: 'nodebuffer' });
}
