import { processPdfCompression } from '../utils/pdf-logic';

export interface WorkerCompressionMessage {
  id: string;
  arrayBuffer: ArrayBuffer;
  originalSize: number;
  compressionMode: 'hybrid' | 'deflate';
}

self.onmessage = async (e: MessageEvent<WorkerCompressionMessage>) => {
  const { id, arrayBuffer, originalSize, compressionMode } = e.data;
  try {
    const result = await processPdfCompression(arrayBuffer, originalSize, compressionMode);
    self.postMessage({ id, ...result });
  } catch (err: any) {
    self.postMessage({
      id,
      success: false,
      error: 'Terjadi kesalahan saat memproses PDF: ' + (err?.message || 'Gagal memproses.'),
    });
  }
};

