import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  copied: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, onCopyLink, copied }) => {
  if (!isOpen) return null;

  // Generate QR code based on current browser URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-card max-w-sm w-full rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center shadow-2xl relative">
        <div className="flex justify-between w-full items-center mb-4">
          <h3 className="font-bold text-white text-lg">Seu QR Code</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Aponte a câmera para acessar as informações de contato instantaneamente.
        </p>

        <div className="p-4 bg-white rounded-2xl shadow-inner mb-5">
          <img src={qrApiUrl} alt="QR Code de Contato" className="w-48 h-48 block" />
        </div>

        <button
          onClick={onCopyLink}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Link Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-brand-primary" />
              <span>Copiar Link do Cartão</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
