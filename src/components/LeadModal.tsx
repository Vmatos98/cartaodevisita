import React, { useState } from 'react';
import { UserCheck, X, CheckCircle } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: { name: string; phone: string; email: string; message: string }) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSaveLead }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;
    onSaveLead({ name, phone, email, message });
    // Reset state
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="glass-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-white/10 shadow-2xl relative">
        <div className="flex justify-between w-full items-center mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-primary" />
            <h3 className="font-bold text-white text-lg">Trocar Contatos</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-slate-300 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Preencha seus dados para enviar seu contato direto para nossa equipe da Automatas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Roberto Silva"
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: nome@empresa.com"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mensagem ou Demanda
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Gostaria de orçar um chatbot para vendas..."
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-teal-600 hover:to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Enviar Meus Dados</span>
          </button>
        </form>
      </div>
    </div>
  );
};
