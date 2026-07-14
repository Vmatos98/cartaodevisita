import { useState, useEffect } from 'react';
import {
  Globe,
  Mail,
  UserPlus,
  QrCode,
  Share2,
  SendToBack,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { LeadModal } from './components/LeadModal';
import { QRCodeModal } from './components/QRCodeModal';
import { Toast } from './components/Toast';
import { PROFILE_CONFIG } from './config';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
}

function App() {
  const profile = PROFILE_CONFIG.employee;
  const company = PROFILE_CONFIG.company;

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('automatas_leads_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Sync leads data to localStorage
  useEffect(() => {
    localStorage.setItem('automatas_leads_v2', JSON.stringify(leads));
  }, [leads]);

  // Ignore any subpaths in the URL and replace them with root path
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleSaveLead = (newLeadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast("Contato enviado com sucesso! Obrigado.");
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${profile.name};;;
FN:${profile.name}
ORG:Automatas Tech
TITLE:${profile.role}
TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+${profile.whatsapp}
EMAIL;TYPE=PREF,INTERNET:${profile.email}
URL:${company.website.url}
NOTE:Adicionado via Cartao de Visitas Digital NFC da Automatas Tech.
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const newLink = document.createElement('a');
    newLink.download = `${profile.name.replace(/\s+/g, '_')}_contato.vcf`;
    newLink.href = url;
    newLink.click();
    URL.revokeObjectURL(url);

    showToast("Contato preparado para download!");
  };

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      showToast("Link copiado para a área de transferência!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = currentUrl;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      setCopiedLink(true);
      showToast("Link copiado para a área de transferência!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: profile.name,
      text: `Confira os contatos de ${profile.name} - Automatas Tech`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="text-slate-100 min-h-screen flex flex-col px-5 py-5 relative overflow-x-hidden w-full glass-card">
      {/* Container Principal do Cartão */}
      <main className="w-full relative z-10 flex-grow flex flex-col">
        <div>
          {/* Header do Cartão: Logo */}
          <div className="flex justify-center items-center mb-8 w-full">
            <img src="/logo.png" alt="Automatas Tech Logo" className="h-28 object-contain" />
          </div>

          {/* Avatar & Perfil do Funcionário */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="relative mb-5">
              {/* Foto de Perfil com Anel de Gradiente */}
              <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-brand-primary via-blue-500 to-brand-secondary neon-glow relative overflow-hidden">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback SVG if image fails to load
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='1.5'><path stroke-linecap='round' stroke-linejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'/></svg>";
                    }}
                  />
                </div>
              </div>
              {/* Badge de Verificado */}
              <span className="absolute bottom-1 right-1 bg-indigo-500 text-white rounded-full p-1.5 border-2 border-slate-900 shadow flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </span>
            </div>

            {/* Nome, Cargo e Bio do Funcionário */}
            <h1 className="text-4xl font-bold tracking-tight text-white">{profile.name}</h1>
            <p className="text-lg text-brand-primary mt-2 font-medium">{profile.role}</p>
            <p className="text-base text-slate-400 mt-3 w-full px-2">{profile.bio}</p>

            {/* Contatos Diretos do Funcionário (Top Section) */}
            <div className="flex gap-4 mt-6 w-full">
              <a
                href={`https://wa.me/${profile.whatsapp}?text=Olá%20${encodeURIComponent(
                  profile.name
                )}!%20Vim%20através%20do%20seu%20cartão%20NFC.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-base font-semibold hover:bg-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer active:scale-98"
              >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-base font-semibold hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer active:scale-98"
              >
                <Mail className="w-5 h-5" />
                E-mail
              </a>
            </div>
          </div>

          {/* Divisor Elegante de Seção */}
          <div className="relative flex py-7 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-slate-500 font-bold bg-slate-950/20 px-4 py-1.5 rounded-lg border border-white/5">
              Contatos da Empresa
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Botões Principais de Ação da Empresa */}
          <div className="space-y-4 mb-6">
            {/* Website Oficial */}
            <a
              href={company.website.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500/20 transition-all">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">{company.website.label}</p>
                  <p className="text-sm text-slate-400">{company.website.sublabel}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* WhatsApp Direct Empresa */}
            <a
              href={`https://wa.me/${company.whatsapp.url}?text=${encodeURIComponent(company.whatsapp.message)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">{company.whatsapp.label}</p>
                  <p className="text-sm text-slate-400">{company.whatsapp.sublabel}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Instagram Corporativo */}
            <a
              href={company.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                  <FaInstagram className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">{company.instagram.label}</p>
                  <p className="text-sm text-slate-400">{company.instagram.sublabel}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* E-mail Corporativo */}
            <a
              href={`mailto:${company.email.url}`}
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-white">{company.email.label}</p>
                  <p className="text-sm text-slate-400">{company.email.sublabel}</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

          {/* Botões Rápidos de Ação (Salvar, QR, Compartilhar) */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {/* Salvar Contato (vCard) */}
            <button
              onClick={downloadVCard}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-400/20 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-teal-400/10 text-teal-400 flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-300">Salvar</span>
            </button>

            {/* Mostrar QR Code */}
            <button
              onClick={() => setIsQRCodeModalOpen(true)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-400/20 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-400/10 text-indigo-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-300">QR Code</span>
            </button>

            {/* Compartilhar Link */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-400/20 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-pink-400/10 text-pink-400 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-300">Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Botão para abrir o Formulário de Enviar Contato de Volta */}
        <div className="mt-8 pt-5 border-t border-white/5">
          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 hover:from-teal-500/30 hover:to-indigo-500/30 border border-teal-500/30 text-teal-300 hover:text-white font-medium text-base tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <SendToBack className="w-5 h-5" />
            Trocar Contatos / Deixar Meu Lead
          </button>
        </div>
      </main>

      {/* Footer Discreto */}
      <footer className="mt-6 text-center relative z-10 w-full">
        <p className="text-sm text-slate-500 flex justify-center items-center gap-1">
          <span>Powered by</span>
          <span className="font-bold text-teal-400 tracking-wider">AUTOMATAS.TECH</span>
        </p>
      </footer>

      {/* Modais da Aplicação */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSaveLead={handleSaveLead}
      />

      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        onCopyLink={handleCopyLink}
        copied={copiedLink}
      />

      <Toast
        message={toastMessage}
        visible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}

export default App;
