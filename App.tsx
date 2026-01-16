import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  User, 
  Activity, 
  Heart, 
  Brain,
  Lock,
  Menu,
  X,
  Plus,
  Minus,
  ThumbsUp,
  Quote,
  MapPin
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

// --- Types ---

type StepType = 'intro' | 'question' | 'input' | 'interstitial' | 'loading' | 'sales' | 'graph';

interface QuizStep {
  id: number;
  type: StepType;
  title?: string;
  subtitle?: string;
  image?: string;
  options?: string[];
  inputType?: 'text' | 'number';
  inputLabel?: string;
  variableName?: string;
  content?: React.ReactNode;
  autoAdvance?: boolean;
  delay?: number;
  multiSelect?: boolean;
}

// --- Data & Content ---

const stepsData: QuizStep[] = [
  // 0. Intro
  {
    id: 0,
    type: 'intro',
    title: 'A maioria dos homens não sabe disso e isso está sabotando sua performance na cama',
    image: 'https://paulosalustiano.com.br/wp-content/uploads/2017/05/homem-preocupado-mulher-olhando-sentados-cama-1200x799.png',
    subtitle: 'Faça esse quizz de 1 minuto e vamos te ajudar agora a resolver seus problemas com sua parceira'
  },
  // 1. Body Type
  {
    id: 1,
    type: 'question',
    title: 'Escolha o seu tipo de corpo',
    subtitle: 'A gordura corporal afeta a testosterona — vamos ver como isso impacta a sua saúde sexual.',
    options: ['Magro', 'Normal', 'Gordo', 'Obeso'],
    variableName: 'bodyType'
  },
  // 2. Interstitial - Social Proof
  {
    id: 2,
    type: 'interstitial',
    title: 'Bem-vindo à sua mudança de vida sexual!',
    image: 'https://quiz.getrelatio.com/funnels/Pe3MpF1/images/103a_ValueProp.png',
    subtitle: '1.243.000+ Homens já nos escolheram'
  },
  // 3. Main Goal
  {
    id: 3,
    type: 'question',
    title: 'Escolha o seu principal objetivo',
    subtitle: 'Selecione uma opção',
    options: ['Durar mais durante o sexo', 'Ter ereções mais firmes', 'Melhorar ambos os itens acima'],
    variableName: 'goal'
  },
  // 4. Goal Affirmation
  {
    id: 4,
    type: 'interstitial',
    title: 'Você acabou de definir seu primeiro objetivo!',
    subtitle: 'Parabéns por começar seu caminho para mais força e bem-estar íntimo.'
  },
  // 5. Frequency
  {
    id: 5,
    type: 'question',
    title: 'Com que frequência você ejacula antes do que gostaria?',
    options: ['Na maioria das vezes', 'Com bastante frequência', 'Às vezes', 'Nunca'],
    variableName: 'ejaculationFrequency'
  },
  // 6. Duration Current
  {
    id: 6,
    type: 'question',
    title: 'Quanto tempo, em média, dura sua relação sexual?',
    options: ['Menos de 2 minutos', '2–7 minutos', '8–14 minutos', '15–25 minutos', '26 minutos ou mais'],
    variableName: 'currentDuration'
  },
  // 7. Control Level
  {
    id: 7,
    type: 'question',
    title: 'Quão difícil é para você controlar a ejaculação durante o sexo?',
    subtitle: 'Avalie de 1 a 5',
    options: ['1', '2', '3', '4', '5'],
    variableName: 'controlDifficulty'
  },
  // 8. Masturbation Control
  {
    id: 8,
    type: 'question',
    title: 'É difícil controlar a ejaculação durante a masturbação?',
    subtitle: 'Avalie de 1 a 5',
    options: ['1', '2', '3', '4', '5'],
    variableName: 'masturbationControl'
  },
  // 9. Desired Duration
  {
    id: 9,
    type: 'question',
    title: 'Quanto tempo você gostaria de durar na cama?',
    options: ['10–15 minutos', '15–30 minutos', '30–60 minutos', '60+ minutos'],
    variableName: 'desiredDuration'
  },
  // 10. Harvard Info
  {
    id: 10,
    type: 'interstitial',
    title: 'Durar mais com músculos pélvicos mais fortes',
    image: 'https://i.imgur.com/6PrhGae.jpeg',
    subtitle: 'Músculos fortes do assoalho pélvico permitem controlar o reflexo da ejaculação e durar mais.\n\nPesquisa de Harvard'
  },
  // 11. Two Rounds
  {
    id: 11,
    type: 'question',
    title: 'Você consegue fazer sexo duas vezes seguidas?',
    options: ['Sim, sem problemas', 'Sim, mas preciso me esforçar bastante', 'Não, não consigo'],
    variableName: 'twoRounds'
  },
  // 12. Erection Strength
  {
    id: 12,
    type: 'question',
    title: 'Como você avalia a força da sua ereção?',
    options: ['Forte e consistente', 'Ocasionalmente mais fraca', 'Muitas vezes mais fraca do que eu gostaria', 'Raramente firme o suficiente', 'Fraca demais para ter desempenho'],
    variableName: 'erectionStrength'
  },
  // 13. Social Compare
  {
    id: 13,
    type: 'interstitial',
    title: 'Achamos você incrível! 🏆',
    subtitle: 'Você está à frente de 93,1% dos nossos usuários.\n\nAgora, experimente os exercícios de Kegel para desenvolver controle e melhorar seu desempenho sexual.'
  },
  // 14. 84% Stats + Loading
  {
    id: 14,
    type: 'loading',
    title: 'Potência de duração',
    subtitle: 'Conectando ao banco de dados',
    autoAdvance: true,
    delay: 10000 
  },
  // 15. Graph Before/After
  {
    id: 15,
    type: 'graph',
    title: 'Um plano personalizado de Kegel ajuda',
    subtitle: 'estudos mostram que a resistência pode melhorar em até 7 vezes.\n\nEste método ajuda homens a melhorar sua vida íntima, mesmo que já tenham tido dificuldades antes.\n\nFrançois de Carufel & Gilles Trudel, Ph.D. – Estudo'
  },
  // 16. Stress
  {
    id: 16,
    type: 'question',
    title: 'Como você avalia seu nível diário de estresse?',
    subtitle: 'Avalie de 1 a 5',
    options: ['1', '2', '3', '4', '5'],
    variableName: 'stressLevel'
  },
  // 17. Activity
  {
    id: 17,
    type: 'question',
    title: 'Qual é o seu nível atual de atividade física?',
    options: ['Eu me exercito regularmente', 'Sou ativo ocasionalmente', 'Sou principalmente inativo', 'Não faço exercícios'],
    variableName: 'activityLevel'
  },
  // 18. Walking
  {
    id: 18,
    type: 'question',
    title: 'Quanto você caminha por dia?',
    options: ['Menos de 1 hora', '1–2 horas', 'Mais de 2 horas'],
    variableName: 'walkingTime'
  },
  // 19. Porn
  {
    id: 19,
    type: 'question',
    title: 'Com que frequência você assiste pornô para mastubar?',
    options: ['1 vez por dia', '3-4 vezes por semana', '1 vez por semana', '1 vez por mês', 'Nunca'],
    variableName: 'pornFrequency'
  },
  // 20. Bad Habits (Multi-select)
  {
    id: 20,
    type: 'question', 
    title: 'Algum destes hábitos se aplica a você?',
    subtitle: '(Marque todos os que se aplicam)',
    options: ['Fumar', 'Consumo de álcool', 'Alto consumo de açúcar', 'Sono ruim', 'Consumo frequente de comida ultraprocessada', 'Nenhuma das opções'],
    variableName: 'badHabits',
    multiSelect: true
  },
  // 21. Height
  {
    id: 21,
    type: 'input',
    inputType: 'number',
    title: 'Qual é a sua altura?',
    subtitle: 'Calculando seu Índice de Massa Corporal (IMC). Estudos mostram que homens com IMC mais alto têm maior probabilidade de apresentar problemas de desempenho sexual.',
    inputLabel: 'cm',
    variableName: 'height'
  },
  // 22. Weight
  {
    id: 22,
    type: 'input',
    inputType: 'number',
    title: 'Qual é o seu peso atual?',
    subtitle: 'Um peso saudável favorece a circulação sanguínea e a testosterona — ambos essenciais para um bom desempenho sexual. Ajustaremos seu plano de acordo.',
    inputLabel: 'kg',
    variableName: 'weight'
  },
  // 23. Age
  {
    id: 23,
    type: 'input',
    inputType: 'number',
    title: 'Qual é a sua idade?',
    subtitle: 'Pedimos sua idade para criar o plano correto para você. À medida que os homens envelhecem, os níveis de testosterona diminuem, mesmo com o mesmo IMC — por isso a idade é importante para o desempenho e os resultados.',
    inputLabel: 'anos',
    variableName: 'age'
  },
  // 24. Profile Risk Summary
  {
    id: 24,
    type: 'interstitial',
    title: 'Seu perfil de risco de estilo de vida',
    subtitle: 'Base forte para evoluir. Um peso saudável favorece a testosterona e o fluxo sanguíneo — fundamentais para músculos pélvicos mais fortes, melhor controle e desempenho mais confiável.'
  },
  // 25. Relationship
  {
    id: 25,
    type: 'question',
    title: 'Você está em um relacionamento?',
    options: ['Solteiro', 'Namorando', 'Casado', 'Não quero responder'],
    variableName: 'relationshipStatus'
  },
  // 26. Sex Worry
  {
    id: 26,
    type: 'question',
    title: 'Você se preocupa que questões sexuais estejam afetando seu relacionamento?',
    options: ['Sim, é uma grande preocupação', 'Um pouco, penso nisso', 'Não tenho certeza', 'Não, nem um pouco'],
    variableName: 'sexWorry'
  },
  // 27. Monthly Freq
  {
    id: 27,
    type: 'question',
    title: 'Quantas vezes por mês você costuma ter relações sexuais?',
    options: ['Menos de 3 vezes', '3–6 vezes', '7–15 vezes', 'Mais de 15 vezes', 'Prefiro não responder'],
    variableName: 'monthlySex'
  },
  // 28. Satisfaction
  {
    id: 28,
    type: 'question',
    title: 'Quão satisfeito você esteve com sua vida sexual nos últimos 3 meses?',
    subtitle: 'Avalie de 1 a 5',
    options: ['1', '2', '3', '4', '5'],
    variableName: 'satisfaction'
  },
  // 29. Improvement Areas (Multi-select)
  {
    id: 29,
    type: 'question',
    title: 'O que você deseja melhorar na sua vida sexual?',
    subtitle: '(Marque todas as opções aplicáveis)',
    options: ['Reduzir ansiedade', 'Aumentar libido', 'Conseguir mais de uma relação seguida', 'Masturbar-se menos', 'Melhorar a saúde sexual'],
    variableName: 'improvements',
    multiSelect: true
  },
  // 30. Meds
  {
    id: 30,
    type: 'question',
    title: 'Você já usou algum medicamento para ter ereções mais firmes ou durar mais?',
    options: ['Sim, uso regularmente', 'Sim, já experimentei ocasionalmente', 'Nunca'],
    variableName: 'meds'
  },
  // 31. More than pills
  {
    id: 31,
    type: 'interstitial',
    title: 'Mais do que comprimidos 💊 — controle real, desempenho real',
    subtitle: 'Pare de depender de soluções temporárias. Treine os músculos e o controle que realmente fazem a diferença.',
    image: 'https://i.imgur.com/w3OwvmW.jpeg'
  },
  // 32. Experts Text
  {
    id: 32,
    type: 'interstitial',
    title: 'O Protocolo POTÊNCIA MÁXIMA é desenvolvido por especialistas certificados',
    image: 'https://thumbs.dreamstime.com/b/logo-famoso-das-universidades-americanas-ilustra%C3%A7%C3%A3o-editorial-do-vetor-de-columbia-harvard-princeton-mit-caltech-stanford-249290631.jpg',
    subtitle: 'Harvard Medical School • Stanford University • Johns Hopkins Medicine'
  },
  // 33. Reviewer
  {
    id: 33,
    type: 'interstitial',
    title: 'Seu plano será revisado por um especialista em saúde íntima masculina',
    image: 'https://i.imgur.com/eBiT2VA.jpeg',
    subtitle: '“Protocolo POTÊNCIA MÁXIMA oferece ferramentas baseadas em evidências para melhorar o bem-estar sexual e a confiança dos homens.”\n\nRevisado por Dr. Nathan Reed\nEspecialista certificado em assoalho pélvico'
  },
  // 34. Self Criticism
  {
    id: 34,
    type: 'question',
    title: 'Você se critica durante o sexo?',
    options: ['Sim', 'Não', 'Às vezes', 'Não tenho certeza'],
    variableName: 'selfCriticism'
  },
  // 35. Partner Disappoint
  {
    id: 35,
    type: 'question',
    title: 'Você sente que seu parceiro(a) fica decepcionado(a) após o sexo?',
    options: ['Sim, acho que sim', 'Às vezes', 'Não tenho certeza', 'Definitivamente não'],
    variableName: 'partnerDisappoint'
  },
  // 36. Profile Summary Calc
  {
    id: 36,
    type: 'interstitial',
    title: 'Resumo do seu perfil',
    subtitle: 'Analise detalhada do seu desempenho.'
  },
  // 37. Good Hands
  {
    id: 37,
    type: 'interstitial',
    title: 'VOCÊ ESTÁ EM BOAS MÃOS',
    subtitle: 'O Protocolo POTÊNCIA MÁXIMA é desenvolvido por especialistas líderes mundiais na área da saúde sexual masculina.\nEle oferece técnicas cientificamente comprovadas e dicas práticas de especialistas em intimidade.\nJá ajudou milhares de homens no mundo todo a elevar sua vida sexual a um novo nível.\nTodos os programas são totalmente personalizados para atender aos SEUS OBJETIVOS.'
  },
  // 38. Join Globe
  {
    id: 38,
    type: 'interstitial',
    title: 'Junte-se a mais de 1.243.000 homens 🌍',
    image: 'https://us.123rf.com/450wm/hanohiki/hanohiki1609/hanohiki160900103/64571213-pin-pontos-no-mapa-do-mundo-ilustra%C3%A7%C3%A3o-do-conceito-de-viagem-marcador-de-localiza%C3%A7%C3%A3o-no-globo.jpg?ver=6',
    subtitle: 'Faça parte de uma comunidade global em crescimento e alcance seus objetivos conosco!'
  },
  // 39. Time Goal
  {
    id: 39,
    type: 'question',
    title: 'Defina seu objetivo de tempo',
    subtitle: 'Com base nas suas respostas, estimamos que você pode alcançar seu desempenho máximo em:',
    options: ['5 min por dia', '10 min por dia', '15 min por dia', '20+ min por dia'],
    variableName: 'timeGoal'
  },
  // 40. Prediction
  {
    id: 40,
    type: 'graph',
    title: 'O último plano que você precisará para melhorar sua vida sexual',
    // subtitle is generated dynamically in render
    subtitle: 'Com base nas suas respostas, estimamos que você pode alcançar seu desempenho máximo até:' 
  },
  // 41. Final Processing
  {
    id: 41,
    type: 'loading',
    title: 'Criando seu Plano Personalizado',
    subtitle: '',
    autoAdvance: true,
    delay: 6000
  },
  // 42. Ready
  {
    id: 42,
    type: 'interstitial',
    title: 'Seu plano pessoal de 4 semanas para melhorar o desempenho sexual está pronto!',
    subtitle: 'SUA VIDA SEXUAL VAI MELHORAR 100%'
  },
  // 43. Sales Page
  {
    id: 43,
    type: 'sales'
  }
];

// --- Helpers ---

const calculateBMI = (weight: number, height: number) => {
  if (!weight || !height) return { value: 0, status: 'Desconhecido' };
  const hM = height / 100;
  const bmi = weight / (hM * hM);
  let status = 'Normal';
  if (bmi < 18.5) status = 'Abaixo do peso';
  else if (bmi >= 25 && bmi < 29.9) status = 'Sobrepeso';
  else if (bmi >= 30) status = 'Obeso';
  return { value: bmi.toFixed(1), status };
};

const getFutureDate = (monthsToAdd: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
  const month = date.toLocaleString('pt-BR', { month: 'long' });
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`;
};

// --- Components ---

const LoadingBar = ({ duration, onComplete }: { duration: number, onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
      <div 
        className="bg-blue-600 h-3 rounded-full transition-all ease-linear" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-center mt-1 text-gray-500">{Math.round(progress)}%</p>
    </div>
  );
};

const PhoneFrame = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[10px] rounded-[2rem] shadow-xl max-w-[280px]">
      <div className="h-[24px] w-[3px] bg-gray-800 absolute -start-[12px] top-[50px] rounded-s-lg"></div>
      <div className="h-[36px] w-[3px] bg-gray-800 absolute -start-[12px] top-[90px] rounded-s-lg"></div>
      <div className="h-[48px] w-[3px] bg-gray-800 absolute -end-[12px] top-[100px] rounded-e-lg"></div>
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-white relative">
        {/* Notch simulation */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-24 bg-gray-800 rounded-b-xl z-20"></div>
        {children}
      </div>
    </div>
  );
}

const Carousel = ({ images, withReactions = false, captions = [], fitType = 'cover' }: { images: string[], withReactions?: boolean, captions?: string[], fitType?: 'cover' | 'contain' }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const i = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(i);
    }, [images.length]);

    return (
        <div className="flex flex-col items-center w-full h-full bg-black">
            <div className="relative w-full h-[450px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                    >
                         <img
                            src={images[index]}
                            className={`w-full h-full ${fitType === 'contain' ? 'object-contain' : 'object-cover'}`}
                            alt="Carousel item"
                            loading="eager"
                        />
                        {captions.length > 0 && captions[index] && (
                            <div className="absolute bottom-6 left-2 right-2 bg-black/70 rounded-lg p-2 backdrop-blur-sm">
                                <p className="text-white font-bold text-center text-sm">{captions[index]}</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const TestimonialCarousel = () => {
    const reviews = [
        { img: 'https://i.imgur.com/lUUhU1Y.jpg', name: 'Carlos Mendes', text: 'Cara, sinceramente, não botava fé, mas depois de 10 dias eu vi que o negócio é sério. Minha esposa agradece!', time: 'há 2 dias', likes: 24 },
        { img: 'https://i.imgur.com/QfJtgio.jpg', name: 'Rafael Souza', text: 'O melhor investimento que fiz esse ano. Simples, direto e funciona de verdade. Recomendo pra todo mundo.', time: 'há 5 dias', likes: 15 },
        { img: 'https://i.imgur.com/cGzrRGs.jpg', name: 'Felipe Oliveira', text: 'Eu tava com muita ansiedade, e as técnicas de respiração junto com os exercícios mudaram meu jogo. Valeu demais.', time: 'há 1 semana', likes: 42 },
        { img: 'https://i.imgur.com/iGAged5.png', name: 'João Pedro', text: 'Gostei muito da didática. É fácil de acompanhar e não toma tempo do dia. Resultados top!', time: 'há 2 semanas', likes: 31 }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const i = setInterval(() => {
            setIndex(prev => (prev + 1) % reviews.length);
        }, 4000);
        return () => clearInterval(i);
    }, [reviews.length]);

    return (
        <div className="w-full relative min-h-[160px]">
             <AnimatePresence mode="wait">
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                 >
                     <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col space-y-3">
                        <div className="flex items-center space-x-3">
                            <img src={reviews[index].img} alt={reviews[index].name} className="w-12 h-12 rounded-full object-cover border-2 border-green-500" loading="eager" />
                            <div>
                                <p className="font-bold text-gray-900">{reviews[index].name}</p>
                                <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                </div>
                            </div>
                            <span className="ml-auto text-xs text-gray-400">{reviews[index].time}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-snug">"{reviews[index].text}"</p>
                        <div className="pt-2 flex items-center space-x-4 border-t border-gray-100 mt-2">
                            <div className="flex items-center text-xs text-gray-500 space-x-1">
                                <ThumbsUp className="w-3 h-3 text-blue-500" />
                                <span>{reviews[index].likes} Curtidas</span>
                            </div>
                             <div className="flex items-center text-xs text-gray-500 space-x-1">
                                <Heart className="w-3 h-3 text-red-500" />
                                <span>Amei</span>
                            </div>
                        </div>
                    </div>
                 </motion.div>
             </AnimatePresence>
        </div>
    );
};

const ImagePreloader = ({ steps, currentIndex }: { steps: QuizStep[], currentIndex: number }) => {
  // Preload next 3 images
  const imagesToLoad = steps
    .slice(currentIndex + 1, currentIndex + 4)
    .map(s => s.image)
    .filter(Boolean);

  return (
    <div style={{ display: 'none' }}>
      {imagesToLoad.map((src, i) => (
        <img key={i} src={src} alt="" />
      ))}
    </div>
  );
};


// --- Main App ---

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // For MultiSelect

  const currentStep = stepsData[currentStepIndex];

  const handleNext = (val?: any) => {
    if (currentStep.variableName && val !== undefined) {
      setAnswers(prev => ({ ...prev, [currentStep.variableName!]: val }));
    }
    setDirection(1);
    setInputValue('');
    setSelectedOptions([]);
    setCurrentStepIndex(prev => Math.min(prev + 1, stepsData.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputNext = () => {
    if(!inputValue) return;
    handleNext(inputValue);
  };

  const toggleOption = (opt: string) => {
     if (opt === 'Nenhuma das opções') {
         setSelectedOptions(['Nenhuma das opções']);
         return;
     }
     if (selectedOptions.includes('Nenhuma das opções')) {
         setSelectedOptions([opt]);
         return;
     }

     if (selectedOptions.includes(opt)) {
         setSelectedOptions(prev => prev.filter(o => o !== opt));
     } else {
         setSelectedOptions(prev => [...prev, opt]);
     }
  };

  const handleMultiSelectNext = () => {
      handleNext(selectedOptions);
  };

  // Specific Logic Rendering
  
  const renderStepContent = () => {
    // 14. 84% Stats + Loading
    if (currentStep.id === 14) {
      return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{currentStep.title}</h2>
            <div className="flex space-x-1 mb-4">
                {[...Array(10)].map((_, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0.3, scale: 0.8 }}
                        animate={{ 
                            opacity: i < 8 ? 1 : i === 8 ? 0.4 : 0.3,
                            scale: i < 9 ? 1 : 0.8,
                            color: i < 9 ? '#22c55e' : '#d1d5db',
                            fill: i < 9 ? '#22c55e' : 'none'
                        }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                     >
                        <User className={`w-7 h-7 ${i < 9 ? 'text-green-500 fill-green-500' : 'text-gray-300'}`} />
                     </motion.div>
                ))}
            </div>
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 2 }}
                className="text-xl font-bold mb-4 text-center"
            >
                84% dos homens
            </motion.p>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
                <p className="italic text-gray-600 mb-2">“84% dos homens melhoraram significativamente o tempo de duração ao seguir o Protocolo POTÊNCIA MÁXIMA.”</p>
                <div className="flex items-center text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Pesquisa com Usuários – Verificada • Há 4 dias
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl w-full mb-6">
                 <div className="flex text-yellow-400 mb-2">
                     <Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" /><Star className="fill-current w-4 h-4" />
                 </div>
                 <p className="text-sm text-gray-700">"O efeito é excelente. Depois de 4 semanas do programa, não tenho mais dificuldade para manter a ereção. Se você estiver com dificuldades como eu estava, experimente esses exercícios."</p>
            </div>
            <div className="w-full mt-4">
                <p className="text-sm text-center mb-2">{currentStep.subtitle}</p>
                <LoadingBar duration={currentStep.delay || 10000} onComplete={() => handleNext()} />
            </div>
        </div>
      );
    }

    // 15. Graph
    if (currentStep.id === 15) {
        const data = [
            { name: 'Semana 0', sem: 20, com: 20 },
            { name: 'Semana 1', sem: 18, com: 40 },
            { name: 'Semana 2', sem: 15, com: 65 },
            { name: 'Semana 3', sem: 12, com: 85 },
            { name: 'Semana 4', sem: 10, com: 100 },
        ];
        return (
            <div className="flex flex-col items-center">
                 <h2 className="text-xl font-bold text-center mb-4">{currentStep.title}</h2>
                 <div className="w-full h-64 mb-6">
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={data}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="name" hide />
                             <YAxis hide />
                             <Tooltip />
                             <Line type="monotone" dataKey="sem" stroke="#ef4444" strokeWidth={3} dot={false} name="Sem Protocolo" />
                             <Line type="monotone" dataKey="com" stroke="#22c55e" strokeWidth={3} dot={false} name="Com Protocolo" />
                         </LineChart>
                     </ResponsiveContainer>
                     <div className="flex justify-center space-x-4 text-xs mt-2">
                         <span className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1 rounded-full"></div> Sem Protocolo</span>
                         <span className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1 rounded-full"></div> Com Protocolo</span>
                     </div>
                 </div>
                 <p className="text-sm text-gray-600 text-center whitespace-pre-line mb-6">{currentStep.subtitle}</p>
                 <button onClick={() => handleNext()} className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Continuar</button>
            </div>
        )
    }

    // 24. Profile Risk
    if (currentStep.id === 24) {
        const bmi = calculateBMI(parseFloat(answers.weight), parseFloat(answers.height));
        const lifestyleRisk = (answers.badHabits && !answers.badHabits.includes('Nenhuma das opções')) ? 'Requer atenção' : 'Saudável';
        
        return (
            <div className="flex flex-col space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900">{currentStep.title}</h2>
                 
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700">Índice de Massa Corporal (IMC)</h3>
                    <div className="flex items-end space-x-2 mt-2">
                        <span className="text-3xl font-bold text-blue-600">{bmi.value}</span>
                        <span className="text-sm text-gray-500 mb-1">kg/m²</span>
                    </div>
                    <div className="flex mt-2 text-xs font-bold text-white text-center rounded-full overflow-hidden">
                        <div className={`flex-1 py-1 ${bmi.status === 'Normal' ? 'bg-green-500' : 'bg-gray-300'}`}>NORMAL</div>
                        <div className={`flex-1 py-1 ${bmi.status === 'Sobrepeso' ? 'bg-yellow-500' : 'bg-gray-300'}`}>SOBREPESO</div>
                        <div className={`flex-1 py-1 ${bmi.status === 'Obeso' ? 'bg-red-500' : 'bg-gray-300'}`}>OBESO</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{currentStep.subtitle}</p>
                 </div>

                 <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between border-b pb-2"><span>Estilo de vida:</span> <span className="font-semibold">{lifestyleRisk}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Atividade física:</span> <span className="font-semibold">{answers.activityLevel || 'Sedentário'}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Nível de estresse:</span> <span className="font-semibold">{answers.stressLevel}/5</span></div>
                    <div className="flex justify-between"><span>Objetivo:</span> <span className="font-semibold text-blue-600">{answers.goal}</span></div>
                 </div>

                 <button onClick={() => handleNext()} className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold shadow-lg mt-4">Continuar</button>
            </div>
        )
    }

    // 36. Profile Summary Calc
    if (currentStep.id === 36) {
        return (
            <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-bold mb-2">Resumo do seu perfil</h2>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <p className="text-gray-500 text-sm mb-1">Nível de desempenho sexual</p>
                    <div className="text-5xl font-black text-red-500 mb-2">17,35</div>
                    <div className="flex text-xs font-bold text-center rounded-full overflow-hidden text-white mb-4">
                        <div className="flex-1 bg-red-500 py-1">Baixo</div>
                        <div className="flex-1 bg-gray-300 py-1">Médio</div>
                        <div className="flex-1 bg-gray-300 py-1">Alto</div>
                    </div>
                    <p className="text-left text-sm text-gray-600 mb-4 leading-relaxed">
                        <strong>Baixo nível de desempenho pode levar a:</strong><br/>
                        • Diminuição da libido<br/>
                        • Medo de rejeição<br/>
                        • Distanciamento emocional<br/>
                        • Baixa confiança sexual
                    </p>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 text-sm space-y-2">
                    <div className="flex justify-between"><span>Controle da ejaculação:</span> <span className="text-red-500 font-bold">Baixo</span></div>
                    <div className="flex justify-between"><span>Duração:</span> <span className="text-red-500 font-bold">{answers.currentDuration}</span></div>
                    <div className="flex justify-between"><span>Tônus pélvico:</span> <span className="text-yellow-600 font-bold">Precisa fortalecer</span></div>
                    <div className="flex justify-between"><span>Ansiedade:</span> <span className="text-red-500 font-bold">Alta</span></div>
                </div>
                <button onClick={() => handleNext()} className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold shadow-lg mt-4">Continuar</button>
            </div>
        )
    }

    // 40. Prediction Graph (Improved)
    if (currentStep.id === 40) {
        const nextMonthDate = getFutureDate(1);
        const data = [
             { name: 'HOJE', val: 20 },
             { name: '15 Dias', val: 65 },
             { name: nextMonthDate, val: 95 },
        ];
        return (
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-center mb-2">{currentStep.title}</h2>
                <p className="text-center text-sm mb-4">{currentStep.subtitle} <strong>{nextMonthDate}</strong></p>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-bold mb-4 text-center">
                    VOCÊ VAI MELHORAR SEU DESEMPENHO EM APENAS 1 MÊS
                </div>
                
                <div className="w-full h-64 mb-6 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                            <YAxis hide />
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                            <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <button onClick={() => handleNext()} className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold shadow-lg">Continuar</button>
            </div>
        )
    }

    // 41. Final Processing
    if (currentStep.id === 41) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-bold mb-6 animate-pulse">Criando seu Plano...</h2>
                <ul className="space-y-4 text-left w-full max-w-xs mb-8">
                    {['Coletando suas respostas', 'Analisando seus resultados', 'Processando seu perfil', 'Priorizando desafios', 'Definindo seus objetivos', 'Criando seu Plano Personalizado'].map((item, i) => (
                        <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.8 }}
                            className="flex items-center text-gray-700"
                        >
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /> {item}
                        </motion.li>
                    ))}
                </ul>
                <div className="w-full mb-4">
                     <LoadingBar duration={6000} onComplete={() => handleNext()} />
                </div>
                <div className="text-xs text-gray-400">1.243.000+ homens já escolheram o Protocolo</div>
            </div>
        )
    }
    
    // 42. Ready - ADDED GRAPH HERE
    if (currentStep.id === 42) {
      const data = [
        { name: 'Atual', score: 40 },
        { name: 'Semana 1', score: 55 },
        { name: 'Semana 2', score: 75 },
        { name: 'Semana 3', score: 90 },
        { name: 'Semana 4', score: 100 },
      ];

      return (
        <div className="flex flex-col items-center text-center">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
            >
                <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
            <p className="text-green-600 font-bold text-lg mb-6">{currentStep.subtitle}</p>

            <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis hide domain={[0, 110]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-2">Projeção de melhoria baseada no seu perfil</p>
            </div>

            <button 
              onClick={() => handleNext()} 
              className="bg-green-600 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition transform active:scale-95 animate-pulse"
            >
              VER MEU PLANO
            </button>
        </div>
      );
    }

    // 43. Sales Page
    if (currentStep.id === 43) {
        return <SalesPage answers={answers} />;
    }

    // Standard Render based on Type
    switch (currentStep.type) {
      case 'intro':
      case 'interstitial':
        return (
          <div className="flex flex-col items-center text-center">
            {currentStep.image && (
              <img src={currentStep.image} alt="" className="w-full max-w-sm rounded-xl mb-6 shadow-md" loading="eager" />
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{currentStep.title}</h2>
            {currentStep.subtitle && <p className="text-gray-600 mb-8 whitespace-pre-line">{currentStep.subtitle}</p>}
            <button 
              onClick={() => handleNext()} 
              className="bg-blue-600 text-white w-full max-w-xs py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition transform active:scale-95"
            >
              Continuar
            </button>
          </div>
        );

      case 'question':
        return (
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
            {currentStep.subtitle && <p className="text-sm text-gray-500 mb-6">{currentStep.subtitle}</p>}
            <div className="flex flex-col space-y-3">
              {currentStep.options?.map((opt, idx) => {
                 const isSelected = currentStep.multiSelect ? selectedOptions.includes(opt) : false;
                 return (
                    <button
                      key={idx}
                      onClick={() => currentStep.multiSelect ? toggleOption(opt) : handleNext(opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center group
                        ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'}
                      `}
                    >
                      {opt}
                      {currentStep.multiSelect ? (
                          isSelected ? <CheckCircle2 className="w-5 h-5 text-blue-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      ) : (
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
                      )}
                    </button>
                 );
              })}
            </div>
            {currentStep.multiSelect && (
                 <button 
                  onClick={handleMultiSelectNext}
                  disabled={selectedOptions.length === 0}
                  className="bg-blue-600 disabled:bg-gray-300 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg transition mt-6"
                >
                  Continuar
                </button>
            )}
          </div>
        );

      case 'input':
        return (
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
            {currentStep.subtitle && <p className="text-sm text-gray-500 mb-6">{currentStep.subtitle}</p>}
            <div className="flex items-center space-x-2 mb-6">
                <input 
                    type={currentStep.inputType} 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    autoFocus
                />
                <span className="text-gray-500 font-medium">{currentStep.inputLabel}</span>
            </div>
            <button 
              onClick={handleInputNext}
              disabled={!inputValue}
              className="bg-blue-600 disabled:bg-gray-300 text-white w-full py-4 rounded-xl font-bold text-lg shadow-lg transition"
            >
              Continuar
            </button>
          </div>
        );
        
       default:
        return null;
    }
  };

  // Render wrapper
  const isSalesPage = currentStep.type === 'sales';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <ImagePreloader steps={stepsData} currentIndex={currentStepIndex} />
      
      {!isSalesPage && (
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-200 z-50">
           <motion.div 
             className="h-full bg-blue-600"
             initial={{ width: 0 }}
             animate={{ width: `${((currentStepIndex + 1) / stepsData.length) * 100}%` }}
             transition={{ duration: 0.5 }}
           />
        </div>
      )}

      <main className={`w-full mx-auto ${isSalesPage ? '' : 'max-w-md px-6 py-8 mt-6'}`}>
         {!isSalesPage && (
            <div className="flex justify-center mb-6">
                <img src="https://i.imgur.com/5Iow3lA.png" alt="Protocolo Potência Máxima" className="w-[100px] h-[100px] object-contain" />
            </div>
         )}
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentStepIndex}
            custom={direction}
            initial={isSalesPage ? { opacity: 0 } : { x: direction > 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isSalesPage ? { opacity: 0 } : { x: direction > 0 ? -50 : 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sales Page Component ---

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full text-left font-semibold text-gray-800">
                {question}
                {isOpen ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pt-3 text-gray-600 text-sm leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StickyTimer = () => {
    const [seconds, setSeconds] = useState(600); // 10 minutes

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const secs = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="bg-red-600 text-white text-center py-2 px-4 font-bold text-sm md:text-base sticky top-0 z-40 shadow-md">
            Você acabou de ganhar 70% de desconto que expira em: <span className="text-yellow-300 font-mono text-lg ml-1">{formatTime(seconds)}</span>
        </div>
    );
};

const SalesNotification = () => {
    const names = ["João S.", "Carlos M.", "Pedro H.", "Lucas A.", "Mateus O.", "Felipe R.", "Rafael C.", "Bruno L.", "Thiago M."];
    const [visible, setVisible] = useState(false);
    const [currentName, setCurrentName] = useState("");

    useEffect(() => {
        const cycle = () => {
            setCurrentName(names[Math.floor(Math.random() * names.length)]);
            setVisible(true);
            
            // Hide after 4 seconds
            setTimeout(() => {
                setVisible(false);
            }, 4000);

            // Reschedule next appearance (random between 5s and 15s)
            setTimeout(cycle, Math.random() * 10000 + 5000);
        };

        // Start initial cycle after 2 seconds
        const timeout = setTimeout(cycle, 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-xl p-3 max-w-[250px] border-l-4 border-green-500 flex items-center gap-3"
                >
                    <div className="bg-green-100 p-2 rounded-full">
                         <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800">{currentName}</p>
                        <p className="text-[10px] text-gray-500 leading-tight">acabou de receber o PROTOCOLO</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SalesPage = ({ answers }: { answers: any }) => {
    return (
        <div className="bg-white w-full">
            <StickyTimer />
            <SalesNotification />
            
            {/* Header */}
            <div className="bg-blue-900 text-white p-6 text-center">
                 <h1 className="text-2xl font-bold mb-2">Aqui está o seu Plano Pessoal para melhorar o seu desempenho sexual.</h1>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Comparison Visual */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center">
                        <p className="font-bold text-gray-500 mb-2">Agora</p>
                        <img src="https://quiz.getrelatio.com/funnels/Pe3MpF1/v_3g/images/OfferBefore.png" alt="Before" className="w-full rounded-lg mb-2 opacity-80" loading="eager" />
                        <div className="space-y-2 text-xs font-semibold">
                            <div>
                                <p className="text-left mb-1">Controle</p>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-1/4 h-full bg-red-500 rounded-full"></div></div>
                            </div>
                            <div>
                                <p className="text-left mb-1">Confiança</p>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-1/3 h-full bg-red-500 rounded-full"></div></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-green-600 mb-2">Depois do Protocolo</p>
                        <img src="https://quiz.getrelatio.com/funnels/Pe3MpF1/v_3g/images/OfferAfter.png" alt="After" className="w-full rounded-lg mb-2 shadow-lg ring-2 ring-green-500" loading="eager" />
                        <div className="space-y-2 text-xs font-semibold">
                            <div>
                                <p className="text-left mb-1">Controle</p>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-full h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div></div>
                            </div>
                            <div>
                                <p className="text-left mb-1">Confiança</p>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-full h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center mb-8">
                    <p className="font-bold text-green-800 text-sm">94% dos homens com perfis semelhantes ao seu percebem melhora em apenas 2 semanas com o Protocolo POTÊNCIA MÁXIMA</p>
                </div>

                <h2 className="text-xl font-bold mb-4">Aqui está o seu Plano Pessoal para melhorar seu desempenho sexual</h2>
                <p className="text-gray-600 text-sm mb-6">Nosso algoritmo inteligente criou um plano personalizado com base nos seus objetivos.</p>

                <ul className="space-y-3 mb-8">
                    {[
                        'Plano avançado de exercícios de Kegel — apenas 5 minutos por dia',
                        'Cobertura completa das cinco áreas do bem-estar sexual',
                        'Ferramentas práticas e suporte para aumentar sua confiança',
                        'Cursos com especialistas renomados'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start text-sm">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>

                <h3 className="font-bold text-lg mb-4">O que você vai receber?</h3>
                <div className="space-y-4 mb-8">
                    {[
                        'Um programa avançado de exercícios de Kegel, composto por 3 sessões por dia.',
                        'Músculos abdominais e das pernas mais fortes aumentam o desejo sexual.',
                        'O controle adequado da respiração reduz a tensão no corpo e na mente.',
                        'Programa de bem-estar emocional para fortalecer sua autoconfiança.',
                        'Orientações personalizadas de especialistas de nível mundial.'
                    ].map((text, i) => (
                        <div key={i} className="flex p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                             <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                             {text}
                        </div>
                    ))}
                </div>

                {/* Mockup Carousel */}
                <h3 className="font-bold text-center mb-6">Visualize seu progresso</h3>
                <PhoneFrame>
                    <Carousel 
                        images={[
                            'https://i.ytimg.com/vi/w-_fr-cvxn8/maxresdefault.jpg',
                            'https://i.ytimg.com/vi/ZJ76OnA5nI4/maxresdefault.jpg',
                            'https://i.ytimg.com/vi/jsHlnaI7ob4/sddefault.jpg'
                        ]} 
                        captions={[
                            "Posição 1: A Montanha",
                            "Posição 2: Controle Total",
                            "Posição 3: O Guardião"
                        ]}
                        fitType="contain"
                    />
                </PhoneFrame>

                {/* Testimonials */}
                <h3 className="font-bold text-center mt-12 mb-6">O que dizem os nossos alunos</h3>
                <div className="mb-8">
                    <TestimonialCarousel />
                </div>
                
                {/* Social Proof Bar */}
                <div className="flex items-center justify-center space-x-2 bg-gray-50 py-3 rounded-full mb-8">
                     <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center"><ThumbsUp className="w-3 h-3 text-white fill-current" /></div>
                         <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center"><Heart className="w-3 h-3 text-white fill-current" /></div>
                     </div>
                     <span className="text-xs font-semibold text-gray-600">Aprovado por mais de 15 mil alunos</span>
                </div>


                <div className="bg-blue-900 text-white rounded-2xl p-6 text-center my-8 shadow-xl">
                    <h3 className="text-2xl font-black mb-2">E O MELHOR?</h3>
                    <p className="mb-4">Tudo isso custa menos que uma PIZZA.<br/>Invista em você e conquiste a performance que você realmente merece.</p>
                </div>

                {/* Timeline */}
                <h2 className="text-2xl font-bold mb-6 text-center">🚀 Sua jornada de transformação</h2>
                <div className="space-y-6 relative border-l-2 border-blue-200 ml-4 pl-6 mb-10">
                    <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <h4 className="font-bold text-lg text-blue-900">7 Dias — Primeira Semana</h4>
                        <p className="text-sm text-gray-600 mt-2">Você começa a sentir mais controle sobre o seu corpo. A ansiedade diminui, sua confiança aumenta e você percebe que está mais presente.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <h4 className="font-bold text-lg text-blue-900">14 Dias — Segunda Semana</h4>
                        <p className="text-sm text-gray-600 mt-2">Sua postura muda. Seu parceiro(a) percebe a diferença — e solta: <i>“Tem algo diferente em você…”</i></p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <h4 className="font-bold text-lg text-blue-900">21 Dias — Terceira Semana</h4>
                        <p className="text-sm text-gray-600 mt-2">Os resultados ficam evidentes. Mais resistência, mais domínio, mais confiança. <i>“O que aconteceu com você? Você está em outro nível.”</i></p>
                    </div>
                </div>

                {/* Bonuses */}
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 mb-8">
                    <h3 className="text-xl font-bold text-center mb-6">🚀 Ganhe 5 BÔNUS EXCLUSIVOS</h3>
                    <p className="text-center text-red-500 font-bold mb-6 animate-pulse">⏰ ÚLTIMAS 5 VAGAS DISPONÍVEIS</p>
                    
                    <div className="space-y-4">
                        {[
                            { title: 'Plano de Controle e Resistência em 30 Dias', price: 'R$ 97', desc: 'Protocolo estratégico para acelerar seu domínio.' },
                            { title: 'Treinamento Diário de Foco e Confiança', price: 'R$ 67', desc: 'Fortaleça sua mentalidade e reduza ansiedade.' },
                            { title: 'Método Antiansiedade para Performance', price: 'R$ 87', desc: 'Elimine tensão e bloqueios mentais em 15min/dia.' },
                            { title: 'Aula: Desbloquear Potencial Masculino', price: 'R$ 127', desc: 'Identifique e elimine hábitos sabotadores.' },
                            { title: 'Comunidade Fechada Potência MÁXIMA', price: 'R$ 97', desc: 'Acesso exclusivo para suporte e motivação.' },
                        ].map((bonus, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                                <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded mb-2 inline-block">BÔNUS {i+1}</span>
                                <h4 className="font-bold text-gray-900">{bonus.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{bonus.desc}</p>
                                <p className="text-sm font-semibold text-green-600 mt-2">Valor: {bonus.price}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 line-through">Valor total dos bônus: R$ 475</p>
                        <p className="font-bold text-green-600 text-lg">HOJE: GRÁTIS</p>
                    </div>
                </div>

                {/* Pricing CTA (STATIC, GREEN THEME) */}
                <div className="bg-white border-2 border-green-500 rounded-3xl p-6 shadow-2xl text-center mb-10">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Oferta Especial</p>
                    <p className="text-gray-400 text-sm line-through">De R$ 497,00</p>
                    <div className="text-5xl font-black text-green-500 mb-2 tracking-tighter">R$ 47</div>
                    <p className="text-xs text-gray-500 mb-4">Pagamento único • Acesso vitalício</p>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl text-xl shadow-lg transform transition hover:scale-105 animate-pulse">
                        QUERO O PROTOCOLO AGORA !
                    </button>
                    <div className="flex justify-center items-center mt-3 text-xs text-gray-500">
                        <Lock className="w-3 h-3 mr-1" /> Pagamento 100% Seguro
                    </div>
                </div>

                {/* Guarantee */}
                <div className="text-center mb-8 px-4">
                    <ShieldCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">🛡️ GARANTIA TOTAL — RISCO ZERO</h3>
                    <p className="text-sm text-gray-600 mb-4">Você tem 30 dias completos para colocar o Protocolo POTÊNCIA MÁXIMA em prática. Se, por qualquer motivo, você não sentir mais controle, mais confiança e evolução no seu desempenho, basta enviar um e-mail ou mensagem — e devolvemos 100% do seu dinheiro.</p>
                </div>

                {/* Cost Comparison */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-12 text-left">
                    <h3 className="text-xl font-bold text-center mb-6 text-gray-900">Compare os Custos Para Melhorar Sua Performance</h3>
                    <div className="space-y-4">
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                           <div className="text-2xl mr-3">💊</div>
                           <div>
                               <p className="font-bold text-gray-800">Remédios e estimulantes (1 mês): <span className="text-red-600">R$300 a R$1.500</span></p>
                               <p className="text-xs text-gray-500">Consultas recorrentes, efeito temporário e possível dependência.</p>
                           </div>
                        </div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                           <div className="text-2xl mr-3">👨‍⚕️</div>
                           <div>
                               <p className="font-bold text-gray-800">Urologista / Terapias particulares: <span className="text-red-600">R$400 a R$800 por consulta</span></p>
                               <p className="text-xs text-gray-500">Sem garantia de resultado e acompanhamento limitado.</p>
                           </div>
                        </div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                           <div className="text-2xl mr-3">🏋️‍♂️</div>
                           <div>
                               <p className="font-bold text-gray-800">Academia + Personal Trainer: <span className="text-red-600">R$500 a R$1.200 por mês</span></p>
                               <p className="text-xs text-gray-500">Demanda tempo alto e foco não específico para desempenho íntimo.</p>
                           </div>
                        </div>
                        <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                           <div className="text-2xl mr-3">💉</div>
                           <div>
                               <p className="font-bold text-gray-800">Tratamentos clínicos avançados: <span className="text-red-600">R$5.000 a R$20.000</span></p>
                               <p className="text-xs text-gray-500">Custos elevados, riscos e resultados imprevisíveis.</p>
                           </div>
                        </div>
                    </div>
                     <div className="mt-6 text-center bg-green-100 p-4 rounded-xl border border-green-300 shadow-inner">
                        <p className="font-bold text-green-800 text-lg">Protocolo POTÊNCIA MÁXIMA</p>
                        <p className="text-3xl font-black text-green-600">Apenas R$ 47,00</p>
                        <p className="text-xs text-green-700 font-semibold">Pagamento único • Sem mensalidades</p>
                    </div>
                </div>

                {/* Final Choice */}
                <div className="bg-gray-900 text-white rounded-2xl p-8 mb-12">
                    <h3 className="text-xl font-bold mb-6 text-center">Agora você tem 2 escolhas…</h3>
                    <div className="space-y-6">
                        <div className="flex">
                            <div className="mr-4 mt-1"><X className="text-red-500" /></div>
                            <div>
                                <h4 className="font-bold text-red-400">1. Continuar preso à insegurança</h4>
                                <p className="text-sm text-gray-400 mt-1">Tentando “dar um jeito” sozinho, repetindo os mesmos padrões.</p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mr-4 mt-1"><CheckCircle2 className="text-green-500" /></div>
                            <div>
                                <h4 className="font-bold text-green-400">2. Começar hoje com o Protocolo</h4>
                                <p className="text-sm text-gray-400 mt-1">Usando um método simples, prático e acessível que já ajudou milhares.</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl mt-8 shadow-lg animate-pulse">
                        ENTRAR NO PROTOCOLO POTÊNCIA MÁXIMA
                    </button>
                </div>

                {/* FAQ */}
                <div className="mb-20">
                    <h3 className="text-2xl font-bold text-center mb-6">Perguntas Frequentes</h3>
                    <FAQItem question="Em quanto tempo vejo resultados?" answer="A maioria dos homens relata sentir mais controle e confiança já nos primeiros 7 a 14 dias seguindo o protocolo diariamente." />
                    <FAQItem question="Preciso de equipamentos?" answer="Não. O protocolo utiliza apenas o peso do corpo e técnicas de controle mental/respiratório." />
                    <FAQItem question="Funciona para qualquer idade?" answer="Sim. O protocolo foi desenvolvido levando em consideração a fisiologia masculina em diversas faixas etárias, dos 20 aos 70+." />
                    <FAQItem question="Como acesso o conteúdo?" answer="O acesso é enviado imediatamente para o seu e-mail após a confirmação do pagamento." />
                    <FAQItem question="É seguro comprar?" answer="Sim, utilizamos plataformas de pagamento criptografadas de nível bancário. Seus dados estão 100% seguros." />
                </div>
                
                <footer className="text-center text-xs text-gray-400 pb-10">
                    <p>© 2024 Protocolo Potência Máxima. Todos os direitos reservados.</p>
                    <p className="mt-2">Este site não faz parte do site do Facebook ou Facebook Inc.<br/>Além disso, este site NÃO é endossado pelo Facebook de forma alguma.</p>
                </footer>
            </div>
        </div>
    );
};