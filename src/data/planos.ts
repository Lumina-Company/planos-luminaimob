// Espelho de docs/03-planos-e-acessorios.md e dos textos de docs/07.
// ÚNICA fonte de preço no código. Se o preço mudar, mude primeiro em docs/03.
// Nada de custo, margem ou fornecedor aqui: isso fica em calculadora-admin.ts.

export type CategoriaId = "essencial" | "pro";
export type AcessorioId = "motion" | "locucao";

export const CATEGORIAS: CategoriaId[] = ["essencial", "pro"];
export const ACESSORIOS: AcessorioId[] = ["motion", "locucao"];

export interface Faixa {
  id: string;
  nome: string;
  videos: number;
  duracao: number;
  preco: number;
  aceitaAcessorios: boolean;
}

export interface ParametrosPersonalizado {
  base: number;
  taxaFixa: number;
  precoAte15: number;
  precoAcima15: number;
}

export interface Personalizado {
  nome: string;
  descricao: string;
  parametros: ParametrosPersonalizado;
}

export interface Categoria {
  id: CategoriaId;
  nome: string;
  nivel: string;
  descricao: string;
  vantagens: string[];
  faixas: Faixa[];
  personalizado: Personalizado;
}

export interface Acessorio {
  id: AcessorioId;
  nome: string;
  descricao: string;
  preco: number;
  video: string;
}

export interface DemoCategoria {
  titulo: string;
  oQueE: string;
  paraQuem: string;
  destaques: string[];
  video: string;
  selo: string;
}

export interface Conteudo {
  site: {
    titulo: string;
    botaoDemo: string;
    botaoPrecos: string;
    acessoriosTitulo: string;
    escolher: string;
    escolhido: string;
  };
  categorias: Record<CategoriaId, Categoria>;
  acessorios: Record<AcessorioId, Acessorio>;
  inclusos: { titulo: string; itens: string[] };
  /** O que acontece depois da compra (slide "Como começamos" da apresentação comercial) */
  proximos: {
    rotulo: string;
    titulo: string;
    contrato: { quando: string; titulo: string; subtitulo: string; itens: string[]; contratante: string; assinado: string };
    etapas: { quando: string; titulo: string; texto: string; marcas: string[] }[];
    prazo: { texto: string; destaque: string };
  };
  condicoes: string[];
  mercado: { texto: string; fonte: string };
  demo: {
    passosTitulo: string;
    passos: string[];
    categorias: Record<CategoriaId, DemoCategoria>;
  };
  limites: {
    duracaoMin: number;
    duracaoMax: number;
    duracaoPasso: number;
    videosMin: number;
    videosMax: number;
    duracaoInicial: number;
    videosIniciais: number;
  };
}

export const conteudoPadrao: Conteudo = {
  site: {
    titulo: "Planos LuminaImob",
    botaoDemo: "Ver como funciona",
    botaoPrecos: "Ver preços",
    acessoriosTitulo: "Acessórios",
    escolher: "Escolher",
    escolhido: "Escolhido",
  },

  categorias: {
    essencial: {
      id: "essencial",
      nome: "Essencial",
      nivel: "Zoom + moldura, sem IA",
      descricao: "A foto do imóvel com movimento de zoom e uma moldura com os dados do imóvel.",
      vantagens: [
        "Foto com movimento de zoom",
        "Moldura com preço, quartos, banheiros, vagas e metragem",
        "Sem IA na edição",
      ],
      faixas: [
        { id: "essencial-30", nome: "Essencial 30", videos: 30, duracao: 15, preco: 149, aceitaAcessorios: true },
        { id: "essencial-60", nome: "Essencial 60", videos: 60, duracao: 15, preco: 269, aceitaAcessorios: true },
      ],
      personalizado: {
        nome: "Personalizado",
        descricao: "Duração e quantidade do seu jeito",
        parametros: { base: 29, taxaFixa: 1, precoAte15: 0.2, precoAcima15: 0.4 },
      },
    },
    pro: {
      id: "pro",
      nome: "Pro",
      nivel: "Vídeo por IA",
      descricao: "A IA transforma as fotos reais do imóvel num vídeo que passeia pelos cômodos.",
      vantagens: [
        "Vídeo gerado por IA a partir das fotos reais",
        "Passeia pelos cômodos, como alguém andando ou um drone",
      ],
      faixas: [
        { id: "pro-30", nome: "Pro 30", videos: 30, duracao: 15, preco: 399, aceitaAcessorios: true },
        { id: "pro-50", nome: "Pro 50", videos: 50, duracao: 15, preco: 619, aceitaAcessorios: true },
      ],
      personalizado: {
        nome: "Personalizado",
        descricao: "Duração e quantidade do seu jeito",
        parametros: { base: 69, taxaFixa: 2, precoAte15: 0.6, precoAcima15: 1.1 },
      },
    },
  },

  acessorios: {
    motion: {
      id: "motion",
      nome: "Motion Graphics",
      descricao: "Vídeo inteiro animado: os dados do imóvel entram animados na tela, no lugar da moldura",
      preco: 400,
      video: "",
    },
    locucao: {
      id: "locucao",
      nome: "Locução por IA",
      descricao: "Narração no vídeo",
      preco: 100,
      video: "/video/locucao-demo.mp4",
    },
  },

  inclusos: {
    titulo: "Todos os planos incluem",
    itens: [
      "Leitura automática da sua base de imóveis (o XML dos portais)",
      "Legenda escrita por IA, no tom da imobiliária",
      "Aprovação antes de postar: aprova, edita ou rejeita",
      "Publicação no Instagram (Reels), TikTok e YouTube Shorts",
      "Painel de resultados com histórico e métricas",
      "Vitrine de imóveis: sua carteira como um e-commerce",
      "Moldura com a marca da imobiliária",
    ],
  },

  // Textos do slide "Como começamos" (apresentação comercial, Lucas, 2026-10-16)
  proximos: {
    rotulo: "Próximos passos",
    titulo: "Como começamos",
    contrato: {
      quando: "Hoje",
      titulo: "Contrato assinado",
      subtitulo: "Escopo confirmado no contrato",
      itens: [
        "Integração ao seu cadastro",
        "Vídeo no padrão da marca",
        "Legendas no seu tom",
        "Painel de aprovação",
        "Redes que você escolher",
        "Prazo: até 20 dias",
      ],
      contratante: "Contratante",
      assinado: "Assinado",
    },
    etapas: [
      {
        quando: "Em seguida",
        titulo: "Reunião de alinhamento",
        texto: "Definimos o visual, o tom da legenda e as redes.",
        marcas: ["Logo e cores", "Tom de voz", "Redes"],
      },
      {
        quando: "Até 20 dias",
        titulo: "Desenvolvimento da automação",
        texto: "Ligamos ao seu cadastro e criamos o vídeo da sua marca.",
        marcas: ["XML de imóveis", "Vídeo modelo"],
      },
      {
        quando: "No ar",
        titulo: "Imóveis no ar sozinhos",
        texto: "Cada imóvel novo vira Reels com legenda. Você só aprova.",
        marcas: ["Aprovar ou refazer", "Postagem automática"],
      },
    ],
    prazo: { texto: "Da assinatura ao primeiro Reels no ar:", destaque: "em até 20 dias" },
  },

  // Prazo: 20 dias da assinatura ao primeiro Reels (Lucas, 2026-10-16; substitui os 7 dias úteis da C2)
  condicoes: ["Sem taxa de implementação", "Sem fidelidade", "Primeiro Reels no ar em até 20 dias"],

  mercado: {
    texto: "43% de quem quer comprar e usa as redes assiste a tours e vídeos de imóveis",
    fonte: "Loft/Offerwise, 2026",
  },

  demo: {
    passosTitulo: "Como funciona",
    passos: [
      "O sistema lê os imóveis da sua base (o mesmo XML dos portais).",
      "Escolhe as melhores fotos.",
      "Gera o vídeo (zoom ou IA).",
      "A IA escreve a legenda no tom da sua imobiliária.",
      "Você aprova, edita ou rejeita, ou deixa no automático.",
      "Publica no Instagram, TikTok e YouTube Shorts.",
    ],
    categorias: {
      essencial: {
        titulo: "Essencial",
        oQueE:
          "A foto do imóvel ganha movimento de zoom e uma moldura com os dados: preço, quartos, banheiros, vagas, metragem.",
        paraQuem: "Quem quer o Instagram ativo com toda a carteira, pelo menor preço.",
        destaques: ["Posta todo imóvel novo", "Sem edição manual", "Moldura com a marca da imobiliária"],
        video: "/video/essencial-demo.mp4",
        selo: "Exemplo em produção",
      },
      pro: {
        titulo: "Pro",
        oQueE:
          "A IA transforma as fotos do imóvel num vídeo que passeia pelos cômodos, como se alguém andasse por dentro ou um drone passasse.",
        paraQuem: "Quem quer vídeo que prende a atenção, no volume do dia a dia.",
        destaques: ["Fotos reais do imóvel, sem inventar ambiente", "15 s, vertical", "Legenda por IA"],
        video: "/video/pro-demo.mp4",
        selo: "Exemplo em produção",
      },
    },
  },

  limites: {
    duracaoMin: 5,
    duracaoMax: 60,
    duracaoPasso: 5,
    videosMin: 1,
    videosMax: 200,
    duracaoInicial: 15,
    videosIniciais: 30,
  },
};
