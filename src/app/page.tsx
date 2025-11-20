"use client";

import { useState, useEffect } from "react";
import { Heart, BookOpen, Users, Lightbulb, Settings, Moon, Sun, Dog, Cat, Sparkles, Mail, Lock, User, MapPin, Globe, ChevronLeft, ChevronRight, Play, Pause, Volume2 } from "lucide-react";

type Mood = "happy" | "neutral" | "sad" | "crying" | "angry" | null;
type Pet = "dog" | "cat" | null;
type Screen = "register" | "petSelection" | "dashboard" | "diary" | "community" | "selfcare" | "tips" | "settings" | "relaxingSounds" | "breathingExercises" | "breathingSession" | "meditationList" | "meditationSession" | "gratitudeExercises";

interface UserData {
  name: string;
  email: string;
  password: string;
  depressionLevel: string;
  anxietyLevel: string;
  symptomsFrequency: string;
  country: string;
  state: string;
  city: string;
}

interface DiaryEntry {
  date: string;
  mood: Mood;
  feeling: string;
  content: string;
}

interface CommunityPost {
  id: string;
  username: string;
  content: string;
  reactions: number;
}

interface RelaxingSound {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  duration: string;
}

interface BreathingExercise {
  id: string;
  title: string;
  type: string;
  duration: string;
  icon: string;
  steps: string[];
  tip: string;
}

interface MeditationExercise {
  id: string;
  title: string;
  duration: string;
  icon: string;
  objective: string;
  steps: string[];
  tip: string;
}

interface GratitudeExercise {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
}

export default function MindHug() {
  // ✅ TODOS OS HOOKS NO TOPO (NUNCA CONDICIONAIS)
  const [screen, setScreen] = useState<Screen>("register");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    depressionLevel: "",
    anxietyLevel: "",
    symptomsFrequency: "",
    country: "",
    state: "",
    city: ""
  });
  const [currentMood, setCurrentMood] = useState<Mood>(null);
  const [selectedPet, setSelectedPet] = useState<Pet>(null);
  const [petLevel, setPetLevel] = useState(1);
  const [lastActivityDate, setLastActivityDate] = useState<string>(new Date().toDateString());
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [missedDays, setMissedDays] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    { id: "1", username: "Estrela Azul", content: "Hoje acordei triste, mas tentei caminhar um pouco. Pequenos passos importam.", reactions: 12 },
    { id: "2", username: "Lua Serena", content: "Consegui meditar por 5 minutos hoje. Me sinto mais calma.", reactions: 8 },
    { id: "3", username: "Sol Dourado", content: "Às vezes só precisamos de um abraço, mesmo que virtual 💙", reactions: 15 }
  ]);
  
  // Estados para Diary Screen com navegação de páginas
  const [feeling, setFeeling] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  
  // Estados para Community Screen
  const [newPost, setNewPost] = useState("");

  // Estados para Relaxing Sounds
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  // Estados para Breathing Session
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // 5 minutos em segundos
  const [sessionActive, setSessionActive] = useState(false);

  // Estados para Meditation Session
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationExercise | null>(null);
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0);
  const [meditationActive, setMeditationActive] = useState(false);

  // 50 frases motivacionais que mudam todo dia
  const motivationalQuotes = [
    "Está tudo bem não estar bem. Permita-se sentir.",
    "Sentir também é crescer.",
    "Tudo passa — até o que parece impossível.",
    "Um passo de cada vez já é caminho.",
    "Você não precisa ser forte o tempo todo.",
    "Chorar também é cura.",
    "O tempo não apaga, mas ensina a viver diferente.",
    "Respira. Você está aprendendo, não falhando.",
    "Permita-se recomeçar quantas vezes forem necessárias.",
    "Seu ritmo é o certo pra você.",
    "Dias difíceis também acabam.",
    "A luz volta, mesmo depois da tempestade.",
    "Um dia de cada vez.",
    "O amanhã pode ser leve.",
    "Continue — o seu esforço não é em vão.",
    "O que hoje dói, amanhã ensina.",
    "Você já superou tanto.",
    "Ainda há beleza em você, mesmo cansado.",
    "Tudo o que você sente é válido.",
    "A dor também te molda em algo mais forte.",
    "Pequenos passos também são progresso.",
    "O importante é não desistir de si.",
    "Você é mais capaz do que imagina.",
    "Tudo começa quando você acredita um pouco mais em si.",
    "Não precisa ter tudo resolvido pra seguir.",
    "Coragem não é não ter medo — é seguir mesmo com ele.",
    "Você não precisa ser perfeito pra ser incrível.",
    "A força está nas coisas simples.",
    "Às vezes, o ato mais corajoso é apenas levantar da cama.",
    "Continue — o mundo precisa da sua luz.",
    "Cuide de você como cuidaria de quem ama.",
    "Você merece descanso.",
    "Amar-se é um processo, não um destino.",
    "Se respeitar é o primeiro passo pra se curar.",
    "Tudo bem pausar.",
    "Sua paz vale mais que a pressa.",
    "Seja gentil com suas próprias feridas.",
    "Você é suficiente, mesmo em dias nublados.",
    "O silêncio também é um tipo de força.",
    "Recomeçar é um ato de amor-próprio.",
    "Às vezes, o que falta é apenas respirar e tentar de novo.",
    "Florescem os que aprendem a esperar o tempo certo.",
    "Até o caos tem algo pra ensinar.",
    "Nem sempre brilhar é iluminar — às vezes é só resistir.",
    "Há beleza no processo, mesmo quando dói.",
    "Ser é melhor do que parecer.",
    "O universo escuta quem tenta com o coração.",
    "Você não está atrasado — está no seu tempo.",
    "Há calma dentro do caos, se você respirar fundo.",
    "Um novo começo pode nascer de um dia comum."
  ];

  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);

  // Biblioteca completa de sons relaxantes
  const relaxingSounds: RelaxingSound[] = [
    {
      id: "rain",
      title: "Som de Chuva",
      description: "Chuva suave caindo, perfeita para relaxar e dormir",
      icon: "🌧️",
      url: "https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce99.mp3",
      duration: "10 min"
    },
    {
      id: "ocean",
      title: "Ondas do Mar",
      description: "Ondas suaves batendo na praia, som calmante",
      icon: "🌊",
      url: "https://cdn.pixabay.com/audio/2022/03/10/audio_4a465d8138.mp3",
      duration: "15 min"
    },
    {
      id: "fire",
      title: "Lareira Crepitante",
      description: "Som de fogo crepitando, aconchegante e relaxante",
      icon: "🔥",
      url: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c6e0c4d8.mp3",
      duration: "12 min"
    },
    {
      id: "stream",
      title: "Água Corrente",
      description: "Riacho fluindo suavemente pela floresta",
      icon: "💧",
      url: "https://cdn.pixabay.com/audio/2022/03/09/audio_c610232532.mp3",
      duration: "10 min"
    },
    {
      id: "beach-fire",
      title: "Fogueira na Praia",
      description: "Combinação de ondas do mar com fogueira crepitante",
      icon: "🏖️",
      url: "https://cdn.pixabay.com/audio/2022/05/27/audio_c2f0d92c76.mp3",
      duration: "15 min"
    },
    {
      id: "forest",
      title: "Floresta Tranquila",
      description: "Sons da natureza com pássaros cantando",
      icon: "🌲",
      url: "https://cdn.pixabay.com/audio/2022/03/10/audio_d1718ab41b.mp3",
      duration: "12 min"
    },
    {
      id: "wind",
      title: "Vento Suave",
      description: "Brisa suave passando pelas árvores",
      icon: "🍃",
      url: "https://cdn.pixabay.com/audio/2022/03/12/audio_8bf3d3f2e5.mp3",
      duration: "10 min"
    },
    {
      id: "thunder",
      title: "Tempestade Distante",
      description: "Trovões suaves ao longe com chuva",
      icon: "⛈️",
      url: "https://cdn.pixabay.com/audio/2022/05/13/audio_5c1e0c0b5e.mp3",
      duration: "15 min"
    },
    {
      id: "autumn",
      title: "Folhas de Outono",
      description: "Som de folhas caindo e vento suave no outono",
      icon: "🍂",
      url: "https://cdn.pixabay.com/audio/2022/11/09/audio_3e9f0922c7.mp3",
      duration: "10 min"
    },
    {
      id: "night",
      title: "Noite Tranquila",
      description: "Sons noturnos da natureza com grilos",
      icon: "🌙",
      url: "https://cdn.pixabay.com/audio/2022/03/15/audio_1b3f570d5c.mp3",
      duration: "12 min"
    },
    {
      id: "waterfall",
      title: "Cachoeira",
      description: "Água caindo suavemente em uma cachoeira",
      icon: "💦",
      url: "https://cdn.pixabay.com/audio/2022/03/09/audio_b8d38e5f7e.mp3",
      duration: "10 min"
    },
    {
      id: "birds",
      title: "Pássaros ao Amanhecer",
      description: "Canto de pássaros no início da manhã",
      icon: "🐦",
      url: "https://cdn.pixabay.com/audio/2022/03/10/audio_f2c3b4d8e9.mp3",
      duration: "12 min"
    }
  ];

  // Biblioteca completa de exercícios de respiração
  const breathingExercises: BreathingExercise[] = [
    {
      id: "calming",
      title: "Respiração Calmante",
      type: "Relaxante",
      duration: "4 min",
      icon: "🫶",
      steps: [
        "Inspire pelo nariz por 4 segundos",
        "Segure por 2 segundos",
        "Expire lentamente pela boca por 6 segundos",
        "Repita por 10 ciclos"
      ],
      tip: "Ideal antes de dormir ou após um dia estressante"
    },
    {
      id: "4-7-8",
      title: "Respiração 4-7-8",
      type: "Terapêutica",
      duration: "3 min",
      icon: "🌙",
      steps: [
        "Inspire pelo nariz por 4 segundos",
        "Segure o ar por 7 segundos",
        "Solte devagar pela boca por 8 segundos"
      ],
      tip: "Ajuda a desacelerar a mente e reduzir ansiedade"
    },
    {
      id: "energizing",
      title: "Respiração Energizante",
      type: "Estimulante",
      duration: "3 min",
      icon: "⚡",
      steps: [
        "Inspire rapidamente pelo nariz (2 seg)",
        "Expire com força pela boca (2 seg)",
        "Faça 20 ciclos curtos e firmes"
      ],
      tip: "Use de manhã ou antes de uma tarefa importante"
    },
    {
      id: "square",
      title: "Respiração em Quadrado",
      type: "Equilíbrio mental",
      duration: "5 min",
      icon: "🔲",
      steps: [
        "Inspire 4 seg",
        "Segure 4 seg",
        "Expire 4 seg",
        "Segure 4 seg"
      ],
      tip: "Imagine um quadrado sendo desenhado enquanto respira"
    },
    {
      id: "heart",
      title: "Respiração do Coração",
      type: "Relaxante emocional",
      duration: "4 min",
      icon: "❤️",
      steps: [
        "Coloque a mão sobre o peito",
        "Inspire fundo sentindo o coração expandir (5 seg)",
        "Expire suavemente (5 seg)"
      ],
      tip: "Foco em conexão e autocompaixão"
    },
    {
      id: "waves",
      title: "Respiração das Ondas",
      type: "Meditativa",
      duration: "5 min",
      icon: "🌊",
      steps: [
        "Inspire visualizando uma onda subindo (5 seg)",
        "Expire imaginando-a descendo (5 seg)"
      ],
      tip: "Use sons de mar como fundo"
    },
    {
      id: "3-3-6",
      title: "Respiração 3-3-6",
      type: "Controle emocional",
      duration: "3 min",
      icon: "🧩",
      steps: [
        "Inspire 3 seg",
        "Segure 3 seg",
        "Expire 6 seg"
      ],
      tip: "Equilibra o sistema nervoso em momentos de tensão"
    },
    {
      id: "compassionate",
      title: "Respiração Compassiva",
      type: "Terapêutica emocional",
      duration: "5 min",
      icon: "💗",
      steps: [
        "Inspire imaginando amor entrando (4 seg)",
        "Expire enviando gentileza ao mundo (6 seg)"
      ],
      tip: "Ideal para momentos de culpa, raiva ou tristeza"
    },
    {
      id: "focused",
      title: "Respiração Focada",
      type: "Concentração",
      duration: "4 min",
      icon: "🎯",
      steps: [
        "Inspire profundamente (4 seg)",
        "Expire lentamente (4 seg)",
        "Repita concentrando-se apenas no ar"
      ],
      tip: "Aumenta foco e atenção plena"
    },
    {
      id: "smile",
      title: "Respiração do Sorriso",
      type: "Felicidade",
      duration: "3 min",
      icon: "😊",
      steps: [
        "Inspire com um leve sorriso (4 seg)",
        "Segure (2 seg)",
        "Expire sorrindo (6 seg)"
      ],
      tip: "Estimula bem-estar e positividade"
    },
    {
      id: "deep-guided",
      title: "Respiração Profunda Guiada",
      type: "Relaxamento total",
      duration: "5 min",
      icon: "🌬️",
      steps: [
        "Inspire fundo (5 seg), enchendo o abdômen",
        "Segure (3 seg)",
        "Expire completamente (7 seg)"
      ],
      tip: "Use narração suave e música ambiente"
    },
    {
      id: "solar",
      title: "Respiração do Calor Solar",
      type: "Energizante e alegre",
      duration: "4 min",
      icon: "🌞",
      steps: [
        "Inspire imaginando luz dourada (5 seg)",
        "Expire espalhando essa energia (5 seg)"
      ],
      tip: "Ideal pela manhã ou antes de começar o dia"
    }
  ];

  // Biblioteca completa de meditações guiadas
  const meditationExercises: MeditationExercise[] = [
    {
      id: "breathing",
      title: "Meditação da Respiração",
      duration: "2-3 min",
      icon: "🧘",
      objective: "Acalmar a mente e reduzir o estresse",
      steps: [
        "Sente-se confortavelmente e feche os olhos",
        "Inspire profundamente pelo nariz em 4 segundos",
        "Segure o ar por 2 segundos",
        "Expire devagar pela boca em 6 segundos",
        "Repita o ciclo por 2 a 3 minutos, apenas observando a respiração"
      ],
      tip: "Foque apenas na sensação do ar entrando e saindo"
    },
    {
      id: "gratitude",
      title: "Meditação da Gratidão",
      duration: "3 min",
      icon: "🌞",
      objective: "Aumentar emoções positivas",
      steps: [
        "Feche os olhos e respire fundo",
        "Pense em três coisas pelas quais você é grato hoje",
        "Podem ser pessoas, momentos ou simples detalhes",
        "Sinta a gratidão no peito",
        "Diga mentalmente: 'Obrigado por isso'",
        "Fique alguns segundos apenas sentindo essa emoção"
      ],
      tip: "Gratidão transforma perspectivas e eleva o humor"
    },
    {
      id: "mindfulness",
      title: "Meditação da Atenção Plena",
      duration: "5 min",
      icon: "🧩",
      objective: "Trazer foco para o momento presente",
      steps: [
        "Sente-se e observe sua respiração",
        "Não tente controlá-la, apenas observe",
        "Note os sons, cheiros e sensações do corpo",
        "Quando a mente se distrair, apenas perceba",
        "Volte à respiração sem se julgar",
        "Continue assim por 5 minutos"
      ],
      tip: "Mindfulness é sobre aceitar o momento como ele é"
    },
    {
      id: "energizing",
      title: "Meditação Energizante",
      duration: "2 min",
      icon: "🔥",
      objective: "Aumentar energia e foco",
      steps: [
        "Inspire profundamente pelo nariz e levante os ombros",
        "Expire forte pela boca, soltando os ombros",
        "Repita por 1 minuto",
        "Depois, respire normalmente",
        "Imagine uma luz brilhante enchendo seu corpo de energia"
      ],
      tip: "Perfeita para começar o dia com disposição"
    },
    {
      id: "sleep",
      title: "Meditação para Dormir",
      duration: "3 min",
      icon: "🌙",
      objective: "Relaxar corpo e mente antes do sono",
      steps: [
        "Deite-se confortavelmente",
        "Inspire profundamente, imaginando o ar relaxando seu corpo",
        "Ao expirar, solte toda a tensão",
        "Vá focando em partes do corpo: pés, pernas, abdômen",
        "Continue subindo: ombros, pescoço, rosto",
        "Relaxe completamente cada parte"
      ],
      tip: "Pratique deitado na cama, com luzes apagadas"
    }
  ];

  // Biblioteca completa de exercícios de gratidão
  const gratitudeExercises: GratitudeExercise[] = [
    // 1. Escrita e reflexão
    { id: "1", category: "📝 Escrita e reflexão", icon: "📔", title: "Diário da gratidão", description: "Escreva 3 coisas boas por dia" },
    { id: "2", category: "📝 Escrita e reflexão", icon: "💌", title: "Carta de gratidão", description: "Escreva para alguém que te ajudou (pode ou não enviar)" },
    { id: "3", category: "📝 Escrita e reflexão", icon: "📅", title: "Linha do tempo da gratidão", description: "Liste momentos marcantes da sua vida pelos quais é grato" },
    { id: "4", category: "📝 Escrita e reflexão", icon: "💪", title: "Agradeça um desafio", description: "Reflita sobre algo difícil que te fez crescer" },
    { id: "5", category: "📝 Escrita e reflexão", icon: "📜", title: "Lista de bênçãos", description: "Faça uma lista longa de tudo que valoriza na vida" },
    { id: "6", category: "📝 Escrita e reflexão", icon: "🌅", title: "Gratidão matinal", description: "Escreva algo que te faz feliz logo ao acordar" },
    { id: "7", category: "📝 Escrita e reflexão", icon: "🌙", title: "Gratidão noturna", description: "Reflita antes de dormir sobre 3 coisas boas do dia" },
    { id: "8", category: "📝 Escrita e reflexão", icon: "🎴", title: "Cartão da gratidão", description: "Tenha um cartão físico para anotar gratidões semanais" },
    { id: "9", category: "📝 Escrita e reflexão", icon: "🏆", title: "Jornal de conquistas", description: "Registre pequenas vitórias pessoais" },
    { id: "10", category: "📝 Escrita e reflexão", icon: "💖", title: "Gratidão por si mesmo", description: "Liste 5 qualidades ou atitudes suas que você aprecia" },
    
    // 2. Mentais e meditativos
    { id: "11", category: "💭 Mentais e meditativos", icon: "🧘", title: "Meditação da gratidão", description: "Feche os olhos e sinta gratidão por pessoas e momentos" },
    { id: "12", category: "💭 Mentais e meditativos", icon: "🌬️", title: "Respiração com gratidão", description: "Inspire imaginando o que você tem de bom e expire liberando tensão" },
    { id: "13", category: "💭 Mentais e meditativos", icon: "✨", title: "Visualização positiva", description: "Imagine um momento feliz e sinta a emoção de gratidão" },
    { id: "14", category: "💭 Mentais e meditativos", icon: "👁️", title: "Agradeça o presente", description: "Observe algo ao seu redor agora e agradeça por isso" },
    { id: "15", category: "💭 Mentais e meditativos", icon: "👂", title: "Gratidão pelos sentidos", description: "Agradeça poder ver, ouvir, tocar, sentir e saborear" },
    { id: "16", category: "💭 Mentais e meditativos", icon: "🪞", title: "Gratidão no espelho", description: "Olhe-se no espelho e diga algo bom sobre você" },
    { id: "17", category: "💭 Mentais e meditativos", icon: "🕉️", title: "Mantra da gratidão", description: "Repita mentalmente frases como 'Sou grato por estar vivo hoje'" },
    
    // 3. Interpessoais
    { id: "18", category: "💌 Interpessoais", icon: "🙏", title: "Dizer 'obrigado' com consciência", description: "Não apenas por educação, mas sentindo o agradecimento" },
    { id: "19", category: "💌 Interpessoais", icon: "📱", title: "Lembrança positiva", description: "Mande mensagem a alguém que te fez bem no passado" },
    { id: "20", category: "💌 Interpessoais", icon: "🤫", title: "Gratidão silenciosa", description: "Mentalmente, agradeça alguém sem precisar falar" },
    { id: "21", category: "💌 Interpessoais", icon: "👨‍👩‍👧‍👦", title: "Jogo da gratidão em família", description: "Cada um fala algo bom pelo qual é grato naquele dia" },
    { id: "22", category: "💌 Interpessoais", icon: "📝", title: "Post-it da gratidão", description: "Deixe bilhetes agradecendo pessoas (em casa, trabalho etc.)" },
    
    // 4. Corpo, natureza e cotidiano
    { id: "23", category: "🌿 Corpo, natureza e cotidiano", icon: "🚶", title: "Caminhada da gratidão", description: "Caminhe e vá agradecendo mentalmente por coisas simples (ar, sol, corpo)" },
    { id: "24", category: "🌿 Corpo, natureza e cotidiano", icon: "💪", title: "Agradeça pelo corpo", description: "Pense em tudo o que seu corpo faz por você diariamente" },
    { id: "25", category: "🌿 Corpo, natureza e cotidiano", icon: "🍽️", title: "Gratidão pela comida", description: "Antes de comer, reflita sobre o processo que trouxe o alimento até você" },
    { id: "26", category: "🌿 Corpo, natureza e cotidiano", icon: "☀️", title: "Agradecimento ao dia", description: "Ao acordar ou anoitecer, diga: 'Sou grato por mais um dia'" },
    { id: "27", category: "🌿 Corpo, natureza e cotidiano", icon: "📸", title: "Fotografia da gratidão", description: "Tire uma foto por dia de algo que te faz feliz" },
    { id: "28", category: "🌿 Corpo, natureza e cotidiano", icon: "🚿", title: "Gratidão no banho", description: "Enquanto a água cai, agradeça pelas sensações e pelo descanso" },
    { id: "29", category: "🌿 Corpo, natureza e cotidiano", icon: "📱", title: "Gratidão pelos objetos", description: "Escolha algo que usa muito (celular, roupa, livro) e agradeça por sua utilidade" },
    
    // 5. Criativos e simbólicos
    { id: "30", category: "✨ Criativos e simbólicos", icon: "🏺", title: "Pote da gratidão", description: "Escreva algo bom em um papel por dia e guarde num pote; leia depois de um mês" },
    { id: "31", category: "✨ Criativos e simbólicos", icon: "🎨", title: "Colagem da gratidão", description: "Faça um painel com imagens e palavras que representam o que ama" },
    { id: "32", category: "✨ Criativos e simbólicos", icon: "🎵", title: "Trilha sonora da gratidão", description: "Monte uma playlist com músicas que te fazem sentir grato" },
    { id: "33", category: "✨ Criativos e simbólicos", icon: "🖼️", title: "Desenho ou pintura de gratidão", description: "Expresse visualmente algo ou alguém especial" },
    { id: "34", category: "✨ Criativos e simbólicos", icon: "🕯️", title: "Ritual semanal de agradecimento", description: "Um momento fixo da semana só para reconhecer o que deu certo" },
    { id: "35", category: "✨ Criativos e simbólicos", icon: "📆", title: "Desafio dos 21 dias", description: "Durante 21 dias seguidos, anote 3 coisas novas pelas quais é grato" }
  ];

  // Sistema de nível do pet baseado em dias consecutivos
  useEffect(() => {
    const today = new Date().toDateString();
    
    if (lastActivityDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastActivityDate === yesterdayStr) {
        // Atividade no dia anterior - mantém sequência
        setConsecutiveDays(prev => prev + 1);
        setMissedDays(0);
      } else {
        // Pulou dia(s)
        const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastActivityDate).getTime()) / (1000 * 60 * 60 * 24));
        setMissedDays(prev => prev + daysDiff);
        
        // Se passou 3 dias sem atividade, reseta para nível 1
        if (missedDays >= 3) {
          setPetLevel(1);
          setConsecutiveDays(0);
          setMissedDays(0);
        }
      }
      
      setLastActivityDate(today);
    }
  }, [lastActivityDate, missedDays]);

  // Seleciona frase do dia baseada na data (muda todo dia)
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Timer para sessão de respiração
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionActive && sessionTimeLeft > 0) {
      interval = setInterval(() => {
        setSessionTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (sessionTimeLeft === 0 && sessionActive) {
      // Sessão completada
      setSessionActive(false);
      completeActivity();
      alert("🎉 Parabéns! Você completou o exercício de respiração!");
      setScreen("breathingExercises");
    }
    
    return () => clearInterval(interval);
  }, [sessionActive, sessionTimeLeft]);

  // Timer para sessão de meditação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (meditationActive && meditationTimeLeft > 0) {
      interval = setInterval(() => {
        setMeditationTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (meditationTimeLeft === 0 && meditationActive) {
      // Sessão completada
      setMeditationActive(false);
      completeActivity();
      alert("🎉 Parabéns! Você completou a meditação!");
      setScreen("meditationList");
    }
    
    return () => clearInterval(interval);
  }, [meditationActive, meditationTimeLeft]);

  const moodEmojis = {
    happy: { emoji: "😊", label: "Feliz" },
    neutral: { emoji: "😐", label: "Neutro" },
    sad: { emoji: "😔", label: "Triste" },
    crying: { emoji: "😭", label: "Muito Triste" },
    angry: { emoji: "😡", label: "Irritado" }
  };

  const handleRegister = () => {
    if (userData.name && userData.email && userData.password && userData.depressionLevel && userData.anxietyLevel && userData.symptomsFrequency && userData.country && userData.state && userData.city) {
      setScreen("petSelection");
    }
  };

  const handlePetSelection = (pet: Pet) => {
    setSelectedPet(pet);
    setScreen("dashboard");
  };

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    completeActivity();
  };

  const completeActivity = () => {
    const today = new Date().toDateString();
    
    if (lastActivityDate !== today) {
      // Primeira atividade do dia
      setConsecutiveDays(prev => prev + 1);
      setLastActivityDate(today);
      setMissedDays(0);
      
      // Aumenta nível baseado em dias consecutivos
      if (selectedPet) {
        setPetLevel(prev => Math.min(prev + 1, 10));
      }
    } else {
      // Atividades adicionais no mesmo dia dão pequeno boost
      if (selectedPet) {
        setPetLevel(prev => Math.min(prev + 0.2, 10));
      }
    }
  };

  const saveDiaryEntry = (feeling: string, content: string) => {
    const entry: DiaryEntry = {
      date: new Date().toLocaleDateString("pt-BR"),
      mood: currentMood,
      feeling,
      content
    };
    setDiaryEntries([entry, ...diaryEntries]);
    completeActivity();
  };

  const addCommunityPost = (content: string) => {
    const randomNames = ["Estrela Azul", "Lua Serena", "Sol Dourado", "Nuvem Suave", "Brisa Calma"];
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      username: randomNames[Math.floor(Math.random() * randomNames.length)],
      content,
      reactions: 0
    };
    setCommunityPosts([newPost, ...communityPosts]);
    completeActivity();
  };

  const reactToPost = (postId: string) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, reactions: post.reactions + 1 } : post
      )
    );
  };

  const toggleSound = (soundId: string) => {
    if (playingSound === soundId) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundId);
      completeActivity();
    }
  };

  const startBreathingSession = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setSessionTimeLeft(300); // 5 minutos
    setSessionActive(false);
    setScreen("breathingSession");
  };

  const startMeditationSession = (meditation: MeditationExercise) => {
    setSelectedMeditation(meditation);
    // Converter duração para segundos (ex: "2-3 min" -> 180 segundos)
    const durationMatch = meditation.duration.match(/(\d+)/);
    const minutes = durationMatch ? parseInt(durationMatch[1]) : 3;
    setMeditationTimeLeft(minutes * 60);
    setMeditationActive(false);
    setScreen("meditationSession");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Register Screen (PRIMEIRA PÁGINA)
  if (screen === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 flex items-center justify-center p-4 transition-all duration-500">
        <div className="max-w-lg w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center">
            MindHug
          </h1>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Um espaço seguro para cuidar de você 🌙
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma senha segura"
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nível de depressão
              </label>
              <select
                value={userData.depressionLevel}
                onChange={(e) => setUserData({...userData, depressionLevel: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="leve">Leve</option>
                <option value="moderado">Moderado</option>
                <option value="grave">Grave</option>
                <option value="nao-sei">Não sei / Prefiro não informar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nível de ansiedade
              </label>
              <select
                value={userData.anxietyLevel}
                onChange={(e) => setUserData({...userData, anxietyLevel: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="leve">Leve</option>
                <option value="moderado">Moderado</option>
                <option value="grave">Grave</option>
                <option value="nao-sei">Não sei / Prefiro não informar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequência dos sintomas (por semana)
              </label>
              <select
                value={userData.symptomsFrequency}
                onChange={(e) => setUserData({...userData, symptomsFrequency: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="">Selecione</option>
                <option value="1-2">1-2 vezes por semana</option>
                <option value="3-4">3-4 vezes por semana</option>
                <option value="5-6">5-6 vezes por semana</option>
                <option value="diario">Diariamente</option>
              </select>
            </div>

            <div className="pt-4 border-t-2 border-teal-200 dark:border-teal-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                Localização (para recursos locais de apoio)
              </label>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <Globe className="w-3 h-3 inline mr-1" />
                    País
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Brasil"
                    value={userData.country}
                    onChange={(e) => setUserData({...userData, country: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Estado/Província
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={userData.state}
                    onChange={(e) => setUserData({...userData, state: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={userData.city}
                    onChange={(e) => setUserData({...userData, city: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border-2 border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRegister}
              disabled={!userData.name || !userData.email || !userData.password || !userData.depressionLevel || !userData.anxietyLevel || !userData.symptomsFrequency || !userData.country || !userData.state || !userData.city}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continuar
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Suas informações são privadas e seguras 🔒
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pet Selection Screen (SEGUNDA PÁGINA)
  if (screen === "petSelection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 dark:from-amber-950 dark:via-orange-950 dark:to-rose-950 flex items-center justify-center p-4 transition-all duration-500">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Escolha seu companheiro
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300">
            Olá, {userData.name}! 👋<br/>
            Escolha um amiguinho para cuidar enquanto cuida de você mesmo
          </p>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => handlePetSelection("cat")}
              className="flex flex-col items-center gap-3 p-8 bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/40 rounded-3xl hover:scale-105 transition-transform shadow-lg hover:shadow-2xl"
            >
              <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop" 
                  alt="Gatinho fofo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Gatinho</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Calmo e carinhoso</span>
            </button>

            <button
              onClick={() => handlePetSelection("dog")}
              className="flex flex-col items-center gap-3 p-8 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-3xl hover:scale-105 transition-transform shadow-lg hover:shadow-2xl"
            >
              <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop" 
                  alt="Cachorrinho fofo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Cachorrinho</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Alegre e leal</span>
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Quanto mais você cuidar de si, mais seu amiguinho crescerá! 🌱
          </p>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  if (screen === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 transition-all duration-500">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindHug
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Olá, {userData.name}! Como você está hoje?
            </h2>
            
            {/* Mood Selection */}
            <div className="flex gap-4 justify-center flex-wrap">
              {Object.entries(moodEmojis).map(([mood, data]) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood as Mood)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-110 ${
                    currentMood === mood
                      ? "bg-purple-200 dark:bg-purple-800 scale-110 shadow-lg"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-4xl">{data.emoji}</span>
                  <span className={`text-xs font-medium transition-colors ${
                    currentMood === mood
                      ? "text-purple-700 dark:text-purple-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {data.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Pet Display - ATUALIZADO COM SISTEMA DE DIAS */}
            {selectedPet && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {selectedPet === "cat" ? (
                      <img 
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop" 
                        alt="Seu gatinho"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop" 
                        alt="Seu cachorrinho"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seu {selectedPet === "cat" ? "gatinho" : "cachorrinho"} está crescendo!
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                          style={{ width: `${(petLevel / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Nível {Math.floor(petLevel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        🔥 {consecutiveDays} dias seguidos
                      </p>
                      {missedDays > 0 && (
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          ⚠️ {3 - missedDays} dias até resetar
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Complete atividades diariamente para ele crescer!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Quote - ATUALIZADO COM SISTEMA DE FRASES DIÁRIAS */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
              <Sparkles className="w-6 h-6 mx-auto mb-2" />
              <p className="text-lg font-medium italic">"{dailyQuote}"</p>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setScreen("selfcare")}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-center space-y-3"
            >
              <div className="bg-gradient-to-br from-green-400 to-teal-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Autocuidado</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exercícios, respiração e meditação
              </p>
            </button>

            <button
              onClick={() => setScreen("diary")}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-center space-y-3"
            >
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Meu Diário</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registre seus sentimentos
              </p>
            </button>

            <button
              onClick={() => setScreen("community")}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-center space-y-3"
            >
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Comunidade</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compartilhe e apoie outros
              </p>
            </button>

            <button
              onClick={() => setScreen("tips")}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-center space-y-3"
            >
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Dicas e Apoio</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conteúdos e ajuda profissional
              </p>
            </button>
          </div>

          {/* Emergency Section */}
          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
            <h3 className="font-bold text-red-800 dark:text-red-300 mb-3">
              Precisa de ajuda imediata?
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-red-700 dark:text-red-400">
                <strong>CVV (Brasil):</strong> 188 - Atendimento 24h
              </p>
              <p className="text-red-700 dark:text-red-400">
                <strong>CAPS:</strong> Centros de Atenção Psicossocial - Busque o mais próximo
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-3">
                Este app não substitui tratamento profissional. Em caso de emergência, procure ajuda especializada.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Gratitude Exercises Screen
  if (screen === "gratitudeExercises") {
    // Agrupar exercícios por categoria
    const groupedExercises = gratitudeExercises.reduce((acc, exercise) => {
      if (!acc[exercise.category]) {
        acc[exercise.category] = [];
      }
      acc[exercise.category].push(exercise);
      return acc;
    }, {} as Record<string, GratitudeExercise[]>);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("selfcare")}
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Exercícios de Gratidão</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold mb-2">35 Exercícios de Gratidão</h2>
            <p className="text-green-50">
              Práticas simples para cultivar gratidão e transformar sua perspectiva
            </p>
          </div>

          {Object.entries(groupedExercises).map(([category, exercises]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => {
                      completeActivity();
                      alert(`✨ ${exercise.title}\n\n${exercise.description}\n\nÓtimo trabalho! Continue praticando gratidão! 🌟`);
                    }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{exercise.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
                          {exercise.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-green-700 dark:text-green-400">
              💡 <strong>Dica:</strong> Comece com um exercício por dia. A gratidão é uma prática - 
              quanto mais você cultiva, mais natural se torna reconhecer as coisas boas da vida.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Meditation Session Screen
  if (screen === "meditationSession" && selectedMeditation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center space-y-8">
          <div className="text-6xl mb-4">{selectedMeditation.icon}</div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {selectedMeditation.title}
          </h2>
          
          <div className="text-7xl font-bold text-purple-600 dark:text-purple-400">
            {formatTime(meditationTimeLeft)}
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-3">
              Siga os passos:
            </p>
            <ul className="space-y-2">
              {selectedMeditation.steps.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-purple-500 font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            {!meditationActive ? (
              <button
                onClick={() => setMeditationActive(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-6 h-6" />
                Começar
              </button>
            ) : (
              <button
                onClick={() => setMeditationActive(false)}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Pause className="w-6 h-6" />
                Pausar
              </button>
            )}
            
            <button
              onClick={() => {
                setMeditationActive(false);
                setScreen("meditationList");
              }}
              className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Voltar
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {selectedMeditation.icon} {selectedMeditation.tip}
          </p>
        </div>
      </div>
    );
  }

  // Meditation List Screen
  if (screen === "meditationList") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("selfcare")}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Meditação Guiada</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <div className="text-5xl mb-4">🕯️</div>
            <h2 className="text-2xl font-bold mb-2">Meditações Guiadas</h2>
            <p className="text-purple-50">
              Práticas simples para acalmar a mente e encontrar paz interior
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditationExercises.map((meditation) => (
              <div
                key={meditation.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{meditation.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {meditation.title}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                      {meditation.duration}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">
                    Objetivo:
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {meditation.objective}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Como fazer:
                  </p>
                  <ul className="space-y-1">
                    {meditation.steps.slice(0, 3).map((step, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                    {meditation.steps.length > 3 && (
                      <li className="text-xs text-purple-600 dark:text-purple-400 italic">
                        + {meditation.steps.length - 3} passos...
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => startMeditationSession(meditation)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Começar
                </button>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-purple-700 dark:text-purple-400">
              💡 <strong>Dica:</strong> Encontre um lugar tranquilo, sente-se confortavelmente e 
              permita-se estar presente. A meditação é uma prática - quanto mais você faz, mais natural se torna.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Breathing Session Screen - NOVA TELA COM TIMER DE 5 MINUTOS
  if (screen === "breathingSession" && selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center space-y-8">
          <div className="text-6xl mb-4">{selectedExercise.icon}</div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {selectedExercise.title}
          </h2>
          
          <div className="text-7xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatTime(sessionTimeLeft)}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
              Siga os passos:
            </p>
            <ul className="space-y-2">
              {selectedExercise.steps.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-indigo-500 font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            {!sessionActive ? (
              <button
                onClick={() => setSessionActive(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Play className="w-6 h-6" />
                Começar
              </button>
            ) : (
              <button
                onClick={() => setSessionActive(false)}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Pause className="w-6 h-6" />
                Pausar
              </button>
            )}
            
            <button
              onClick={() => {
                setSessionActive(false);
                setScreen("breathingExercises");
              }}
              className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Voltar
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {selectedExercise.icon} {selectedExercise.tip}
          </p>
        </div>
      </div>
    );
  }

  // Breathing Exercises Screen
  if (screen === "breathingExercises") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("selfcare")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Respiração Guiada</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <div className="text-5xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold mb-2">Exercícios de Respiração</h2>
            <p className="text-indigo-50">
              Técnicas comprovadas para acalmar a mente e reduzir ansiedade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {breathingExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{exercise.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {exercise.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                      {exercise.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {exercise.duration}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Como fazer:
                  </p>
                  <ul className="space-y-1">
                    {exercise.steps.map((step, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">
                    {exercise.icon} {exercise.tip}
                  </p>
                </div>

                <button
                  onClick={() => startBreathingSession(exercise)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  Começar
                </button>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              💡 <strong>Dica:</strong> Pratique em um ambiente tranquilo. Sente-se confortavelmente, 
              feche os olhos e concentre-se apenas na sua respiração. Com o tempo, ficará mais fácil!
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Relaxing Sounds Screen
  if (screen === "relaxingSounds") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-cyan-950 dark:to-blue-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("selfcare")}
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Áudios Relaxantes</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <Volume2 className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sons da Natureza</h2>
            <p className="text-cyan-50">
              Escolha um som relaxante e deixe a natureza acalmar sua mente
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relaxingSounds.map((sound) => (
              <div
                key={sound.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{sound.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {sound.title}
                    </h3>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mb-2">
                      {sound.duration}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {sound.description}
                    </p>
                    <button
                      onClick={() => toggleSound(sound.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium transition-all ${
                        playingSound === sound.id
                          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {playingSound === sound.id ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Reproduzir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/30 border-2 border-cyan-200 dark:border-cyan-800 rounded-2xl p-6 text-center">
            <p className="text-sm text-cyan-700 dark:text-cyan-400">
              💡 <strong>Dica:</strong> Use fones de ouvido para uma experiência mais imersiva. 
              Feche os olhos, respire profundamente e deixe os sons da natureza te guiarem.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Diary Screen - FORMATO LIVRO COM NAVEGAÇÃO
  if (screen === "diary") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("dashboard")}
              className="text-amber-600 dark:text-amber-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Meu Diário</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {!bookOpen ? (
            // Capa do livro fechado
            <div className="flex items-center justify-center min-h-[600px]">
              <button
                onClick={() => setBookOpen(true)}
                className="relative group"
              >
                <div className="w-80 h-96 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 rounded-r-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl border-l-8 border-amber-900">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                    <BookOpen className="w-20 h-20 mb-4 opacity-90" />
                    <h2 className="text-3xl font-bold mb-2 text-center">Meu Diário</h2>
                    <p className="text-amber-100 text-center text-sm">Clique para abrir</p>
                  </div>
                  {/* Detalhes do livro */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-4 left-4 right-4 h-1 bg-amber-900/30 rounded"></div>
                    <div className="absolute bottom-4 left-4 right-4 h-1 bg-amber-900/30 rounded"></div>
                  </div>
                </div>
                {/* Sombra do livro */}
                <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/20 blur-xl rounded-full"></div>
              </button>
            </div>
          ) : (
            // Livro aberto com páginas
            <div className="flex items-center justify-center min-h-[600px] gap-4">
              {/* Botão página anterior */}
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all hover:scale-110 disabled:hover:scale-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Livro aberto */}
              <div className="flex gap-1 perspective-1000">
                {/* Página esquerda */}
                <div className="w-96 h-[600px] bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-l-2xl shadow-2xl p-8 border-r-2 border-amber-200 dark:border-amber-800">
                  {currentPage === 0 ? (
                    // Primeira página - Nova entrada
                    <div className="h-full flex flex-col space-y-6">
                      <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-4 text-center border-b-2 border-amber-300 dark:border-amber-700 pb-2">
                        Nova Entrada
                      </h3>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                            Como você se sente?
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Ansioso, feliz, cansado..."
                            value={feeling}
                            onChange={(e) => setFeeling(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                            O que aconteceu hoje no seu dia?
                          </label>
                          <textarea
                            placeholder="Escreva sobre seu dia..."
                            value={diaryContent}
                            onChange={(e) => setDiaryContent(e.target.value)}
                            rows={12}
                            className="w-full px-3 py-2 rounded-lg border-2 border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 resize-none text-sm"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (feeling.trim() && diaryContent.trim()) {
                              saveDiaryEntry(feeling, diaryContent);
                              setFeeling("");
                              setDiaryContent("");
                              alert("Entrada salva! 📖");
                            }
                          }}
                          disabled={!feeling.trim() || !diaryContent.trim()}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Salvar no diário
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Páginas de entradas anteriores (página esquerda)
                    <div className="h-full flex flex-col">
                      {diaryEntries[currentPage * 2 - 2] ? (
                        <>
                          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-amber-300 dark:border-amber-700">
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              {diaryEntries[currentPage * 2 - 2].date}
                            </span>
                            {diaryEntries[currentPage * 2 - 2].mood && (
                              <span className="text-2xl">
                                {moodEmojis[diaryEntries[currentPage * 2 - 2].mood].emoji}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-3 text-sm">
                            {diaryEntries[currentPage * 2 - 2].feeling}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-y-auto flex-1">
                            {diaryEntries[currentPage * 2 - 2].content}
                          </p>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-amber-400 dark:text-amber-600">
                          <p className="text-sm italic">Página em branco</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Página direita */}
                <div className="w-96 h-[600px] bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-r-2xl shadow-2xl p-8">
                  {currentPage === 0 ? (
                    // Primeira página direita - Instruções
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                      <BookOpen className="w-16 h-16 text-amber-600 dark:text-amber-400" />
                      <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">
                        Bem-vindo ao seu diário
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Este é seu espaço seguro para expressar seus sentimentos e registrar seu dia a dia.
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                        Use as setas para navegar entre as páginas
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-8">
                        Total de entradas: {diaryEntries.length}
                      </div>
                    </div>
                  ) : (
                    // Páginas de entradas anteriores (página direita)
                    <div className="h-full flex flex-col">
                      {diaryEntries[currentPage * 2 - 1] ? (
                        <>
                          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-amber-300 dark:border-amber-700">
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              {diaryEntries[currentPage * 2 - 1].date}
                            </span>
                            {diaryEntries[currentPage * 2 - 1].mood && (
                              <span className="text-2xl">
                                {moodEmojis[diaryEntries[currentPage * 2 - 1].mood].emoji}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-3 text-sm">
                            {diaryEntries[currentPage * 2 - 1].feeling}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-y-auto flex-1">
                            {diaryEntries[currentPage * 2 - 1].content}
                          </p>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-amber-400 dark:text-amber-600">
                          <p className="text-sm italic">Página em branco</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botão próxima página */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(diaryEntries.length / 2)}
                className="p-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full shadow-lg transition-all hover:scale-110 disabled:hover:scale-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Indicador de página */}
          {bookOpen && (
            <div className="text-center mt-6 text-sm text-amber-700 dark:text-amber-400">
              Página {currentPage === 0 ? "1" : `${currentPage * 2} - ${currentPage * 2 + 1}`}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Community Screen
  if (screen === "community") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("dashboard")}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Comunidade</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* New Post */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">
              Compartilhe anonimamente
            </h2>
            <textarea
              placeholder="Como você está se sentindo? Compartilhe sua experiência..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            />
            <button
              onClick={() => {
                if (newPost.trim()) {
                  addCommunityPost(newPost);
                  setNewPost("");
                }
              }}
              disabled={!newPost.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Publicar
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.username[0]}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {post.username}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => reactToPost(post.id)}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    💙 {post.reactions}
                  </button>
                  <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    💪 Apoiar
                  </button>
                  <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    🌻 Abraço
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Self Care Screen
  if (screen === "selfcare") {
    const activities = [
      {
        icon: "🧘",
        title: "Respiração Guiada",
        duration: "3-5 minutos",
        description: "12 técnicas diferentes de respiração para cada momento",
        action: () => setScreen("breathingExercises")
      },
      {
        icon: "🎧",
        title: "Áudios Relaxantes",
        duration: "10-15 minutos",
        description: "Sons da natureza, música ambiente e frequências calmantes",
        action: () => setScreen("relaxingSounds")
      },
      {
        icon: "🕯️",
        title: "Meditação Curta",
        duration: "5-10 minutos",
        description: "Meditação guiada para acalmar a mente e reduzir ansiedade",
        action: () => setScreen("meditationList")
      },
      {
        icon: "🌿",
        title: "Exercício de Gratidão",
        duration: "5 minutos",
        description: "35 exercícios práticos para cultivar gratidão diariamente",
        action: () => setScreen("gratitudeExercises")
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("dashboard")}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Autocuidado</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Cuide de você</h2>
            <p className="text-green-50">
              Pequenos momentos de autocuidado fazem grande diferença
            </p>
          </div>

          <div className="grid gap-4">
            {activities.map((activity, index) => (
              <button
                key={index}
                onClick={() => {
                  if (activity.action) {
                    activity.action();
                  } else {
                    completeActivity();
                    alert(`Ótimo! Você completou: ${activity.title} 🌟`);
                  }
                }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                      {activity.duration}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Tips Screen
  if (screen === "tips") {
    const tips = [
      {
        title: "Como lidar com crises de ansiedade",
        content: "Técnicas de respiração, grounding (5 sentidos) e validação emocional podem ajudar."
      },
      {
        title: "Como melhorar o sono",
        content: "Estabeleça rotina, evite telas antes de dormir e crie ambiente confortável."
      },
      {
        title: "Pequenos hábitos que ajudam",
        content: "Caminhadas curtas, hidratação, exposição ao sol e momentos de pausa."
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setScreen("dashboard")}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Dicas e Apoio</h1>
            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Conhecimento é poder</h2>
            <p className="text-orange-50">
              Aprenda mais sobre saúde mental e bem-estar
            </p>
          </div>

          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-3"
              >
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{tip.content}</p>
              </div>
            ))}
          </div>

          {/* Professional Help - ATUALIZADO COM LOCALIZAÇÃO */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-teal-300 dark:border-teal-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-teal-800 dark:text-teal-300">
                Recursos de Apoio - {userData.city}, {userData.state}
              </h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                <p className="font-medium text-teal-700 dark:text-teal-400 mb-1">
                  CVV - Centro de Valorização da Vida
                </p>
                <p className="text-teal-600 dark:text-teal-500">📞 Telefone: 188 (24 horas, gratuito)</p>
                <p className="text-teal-600 dark:text-teal-500">💬 Chat: cvv.org.br</p>
                <p className="text-xs text-teal-500 dark:text-teal-600 mt-2">
                  Apoio emocional e prevenção do suicídio
                </p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                <p className="font-medium text-teal-700 dark:text-teal-400 mb-1">
                  CAPS - Centro de Atenção Psicossocial
                </p>
                <p className="text-teal-600 dark:text-teal-500">
                  📍 Busque a unidade mais próxima em {userData.city}
                </p>
                <p className="text-xs text-teal-500 dark:text-teal-600 mt-2">
                  Atendimento gratuito pelo SUS para saúde mental
                </p>
              </div>

              <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                <p className="font-medium text-teal-700 dark:text-teal-400 mb-1">
                  Emergências
                </p>
                <p className="text-teal-600 dark:text-teal-500">🚑 SAMU: 192</p>
                <p className="text-teal-600 dark:text-teal-500">🚒 Bombeiros: 193</p>
                <p className="text-teal-600 dark:text-teal-500">👮 Polícia: 190</p>
              </div>

              {userData.country.toLowerCase() === "brasil" && (
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                  <p className="font-medium text-teal-700 dark:text-teal-400 mb-1">
                    Outros recursos em {userData.state}
                  </p>
                  <p className="text-teal-600 dark:text-teal-500">
                    🏥 UBS (Unidade Básica de Saúde) - Atendimento psicológico gratuito
                  </p>
                  <p className="text-teal-600 dark:text-teal-500">
                    🎓 Clínicas-escola de Psicologia - Atendimento a preços acessíveis
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-teal-600 dark:text-teal-500 italic bg-white/40 dark:bg-gray-800/40 rounded-lg p-3">
              💙 Lembre-se: buscar ajuda profissional é um ato de coragem e autocuidado. Você não está sozinho.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
