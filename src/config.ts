export interface EmployeeConfig {
  name: string;
  role: string;
  bio: string;
  photo: string;
  whatsapp: string;
  email: string;
}

export interface ButtonConfig {
  label: string;
  sublabel: string;
  url: string;
}

export interface CompanyConfig {
  name: string;
  website: ButtonConfig;
  whatsapp: ButtonConfig & { message: string };
  instagram: ButtonConfig;
  email: ButtonConfig;
}

export interface ProfileConfig {
  employee: EmployeeConfig;
  company: CompanyConfig;
}

export const PROFILE_CONFIG: ProfileConfig = {
  employee: {
    name: "Victor Matos",
    role: "Fundador e Desenvolvedor",
    bio: "Ajudando empresas a escalar processos usando agentes inteligentes e integrações de software robustas.",
    photo: "/avatar.png",
    whatsapp: "5579996996780",
    email: "victor.matos@automatas.tech",
  },
  company: {
    name: "Automatas Tech",
    website: {
      label: "Website Oficial",
      sublabel: "automatas.tech",
      url: "https://automatas.tech",
    },
    whatsapp: {
      label: "Chamar no WhatsApp",
      sublabel: "Atendimento comercial",
      url: "5579996996780",
      message: "Olá! Gostaria de falar com o atendimento da empresa.",
    },
    instagram: {
      label: "Instagram Oficial",
      sublabel: "@automatas.tech",
      url: "https://instagram.com/automatas.tech",
    },
    email: {
      label: "Enviar E-mail",
      sublabel: "contato@automatas.tech",
      url: "contato@automatas.tech",
    },
  },
};
