import React, { useState } from 'react';
import { UploadCloud, FilePlus, Download, Trash2, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const ImageToPdfTool: React.FC = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      const newItems = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...newItems]);
      setPdfUrl(null);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPdfUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;
        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const { width, height } = embeddedImage.scale(1);
        // Create page matching image aspect or scaled to standard A4 (595 x 842 pt)
        const page = pdfDoc.addPage([595.28, 841.89]);
        const scale = Math.min(555 / width, 801 / height, 1);
        const drawWidth = width * scale;
        const drawHeight = height * scale;

        page.drawImage(embeddedImage, {
          x: (595.28 - drawWidth) / 2,
          y: (841.89 - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      alert('Gagal mengonversi gambar ke PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Image to PDF
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Gabungkan dan ubah koleksi foto menjadi dokumen PDF A4 siap cetak dan bagikan.
        </p>
      </div>

      <div style={{
        border: '2px dashed var(--cat-pdf-primary)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--cat-pdf-light)',
        padding: '36px 24px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        marginBottom: '24px',
      }}>
        <input 
          type="file" 
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <FilePlus size={28} color="var(--cat-pdf-dark)" />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Pilih atau Tarik Foto (JPG/PNG) ke Sini
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Bisa memilih beberapa foto sekaligus
        </div>
      </div>

      {images.length > 0 && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Urutan Foto ({images.length} gambar)
            </h3>
            <button 
              onClick={() => setImages([])}
              style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Hapus Semua
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
            {images.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '8px',
                  background: 'var(--color-bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <img 
                  src={item.preview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }}
                />
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.file.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                  <button 
                    onClick={() => moveUp(idx)} 
                    disabled={idx === 0}
                    style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    onClick={() => moveDown(idx)} 
                    disabled={idx === images.length - 1}
                    style={{ border: 'none', background: 'transparent', cursor: idx === images.length - 1 ? 'default' : 'pointer', opacity: idx === images.length - 1 ? 0.3 : 1 }}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button 
                    onClick={() => removeImage(idx)} 
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={convertToPdf}
              disabled={isProcessing}
              className="btn-primary"
              style={{ width: '100%', maxWidth: '280px', padding: '12px' }}
            >
              {isProcessing ? <RefreshCw size={17} className="animate-spin" /> : <FilePlus size={17} />}
              <span>Ekspor ke Dokumen PDF</span>
            </button>
          </div>
        </div>
      )}

      {pdfUrl && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--color-bg-card)', border: '1px solid var(--cat-pdf-border)', textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cat-pdf-dark)', marginBottom: '8px' }}>
            Dokumen PDF Berhasil Dibuat
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Semua gambar telah digabungkan ke format dokumen A4.
          </p>
          <a
            href={pdfUrl}
            download="images_converted.pdf"
            className="btn-primary"
            style={{ textDecoration: 'none', padding: '12px 28px' }}
          >
            <Download size={17} />
            <span>Unduh Dokumen PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};
