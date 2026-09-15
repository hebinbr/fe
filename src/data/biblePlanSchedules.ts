import { ReadingPlanDay } from '../types';

// Helper to create an array of chapter names: e.g. createChapterList("Gênesis", 1, 3) -> ["Gênesis 1", "Gênesis 2", "Gênesis 3"]
export function createChapterList(book: string, startChapter: number, endChapter: number): string[] {
  const list: string[] = [];
  for (let i = startChapter; i <= endChapter; i++) {
    list.push(`${book} ${i}`);
  }
  return list;
}

// 90-Day New Testament Schedule (Covers all 260 chapters of the NT in 90 days)
export function generateNewTestament3MonthsDays(): ReadingPlanDay[] {
  const scheduleData: Array<{
    day: number;
    title: string;
    book: string;
    startCh: number;
    endCh: number;
    extraChapters?: string[];
    sampleRef: string;
    sampleText: string;
    insight: string;
  }> = [
    // Mateus (28 caps) - Dias 1 a 12
    {
      day: 1,
      title: 'A Genealogia e o Nascimento do Messias',
      book: 'Mateus',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Mateus 1:21-23',
      sampleText: 'Ela dará à luz um filho e lhe porás o nome de Jesus, porque ele salvará o seu povo dos pecados deles... Eis que a virgem conceberá e dará à luz um filho, e ele será chamado pelo nome de Emanuel, que quer dizer: Deus conosco.',
      insight: 'Jesus cumpre todas as promessas da história: Ele é o Emanuel, Deus conosco em todas as circunstâncias.'
    },
    {
      day: 2,
      title: 'Tentação no Deserto e o Início do Ministério',
      book: 'Mateus',
      startCh: 4,
      endCh: 5,
      sampleRef: 'Mateus 5:14-16',
      sampleText: 'Vós sois a luz do mundo. Não se pode esconder a cidade edificada sobre um monte... Assim brilhe também a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai que está nos céus.',
      insight: 'A Palavra de Deus é a nossa espada nas tentações e o Sermão do Monte define o estilo de vida do Reino.'
    },
    {
      day: 3,
      title: 'Oração, Jejum e Confiança no Pai',
      book: 'Mateus',
      startCh: 6,
      endCh: 7,
      sampleRef: 'Mateus 6:33-34',
      sampleText: 'Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas. Portanto, não vos inquieteis com o dia de amanhã.',
      insight: 'Quando o Reino de Deus é a nossa prioridade, o desespero pelo futuro perde sua força.'
    },
    {
      day: 4,
      title: 'Curas, Autoridade e o Chamado aos Discípulos',
      book: 'Mateus',
      startCh: 8,
      endCh: 9,
      sampleRef: 'Mateus 9:36-38',
      sampleText: 'Vendo ele as multidões, compadeceu-se delas, porque estavam aflitas e exaustas como ovelhas que não têm pastor. Então, disse a seus discípulos: A seara, na verdade, é grande, mas os trabalhadores são poucos.',
      insight: 'Jesus olha para os cansados com profunda compaixão e nos convida a sermos instrumentos de cura.'
    },
    {
      day: 5,
      title: 'O Envio dos Doze e o Custo do Discipulado',
      book: 'Mateus',
      startCh: 10,
      endCh: 11,
      sampleRef: 'Mateus 11:28-30',
      sampleText: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração; e achareis descanso para a vossa alma.',
      insight: 'O convite de Jesus não é para mais rituais pesados, mas para descanso e companheirismo com Ele.'
    },
    {
      day: 6,
      title: 'Senhor do Sábado e as Parábolas do Reino',
      book: 'Mateus',
      startCh: 12,
      endCh: 13,
      sampleRef: 'Mateus 13:44',
      sampleText: 'O reino dos céus é semelhante a um tesouro oculto no campo, o qual certo homem, tendo-o achado, escondeu. E, transbordante de alegria, vai, vende tudo o que tem e compra aquele campo.',
      insight: 'Encontrar a Cristo supera qualquer outra posse ou ambição deste mundo.'
    },
    {
      day: 7,
      title: 'Multiplicação dos Pães e Andando Sobre as Águas',
      book: 'Mateus',
      startCh: 14,
      endCh: 16,
      sampleRef: 'Mateus 16:15-16',
      sampleText: 'Mas vós, continuou ele, quem dizeis que eu sou? Respondendo Simão Pedro, disse: Tu és o Cristo, o Filho do Deus vivo.',
      insight: 'A fé genuína reconhece quem Jesus é mesmo em meio às tempestades da vida.'
    },
    {
      day: 8,
      title: 'A Transfiguração e o Perdão sem Limites',
      book: 'Mateus',
      startCh: 17,
      endCh: 19,
      sampleRef: 'Mateus 18:21-22',
      sampleText: 'Então, Pedro, aproximando-se, lhe perguntou: Senhor, até quantas vezes meu irmão pecará contra mim, que eu lhe perdoe? Até sete vezes? Respondeu-lhe Jesus: Não te digo que até sete vezes, mas até setenta vezes sete.',
      insight: 'Fomos perdoados de uma dívida impagável; por isso, perdoamos livremente quem nos ofende.'
    },
    {
      day: 9,
      title: 'A Entrada Triunfal e os Conflitos no Templo',
      book: 'Mateus',
      startCh: 20,
      endCh: 22,
      sampleRef: 'Mateus 22:37-39',
      sampleText: 'Respondeu-lhe Jesus: Amarás o Senhor, teu Deus, de todo o teu coração, de toda a tua alma e de todo o teu entendimento. Este é o grande e primeiro mandamento. O segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo.',
      insight: 'O amor a Deus e ao próximo é o resumo de toda a revelação das Escrituras.'
    },
    {
      day: 10,
      title: 'Advertências aos Fariseus e o Sermão Profético',
      book: 'Mateus',
      startCh: 23,
      endCh: 24,
      sampleRef: 'Mateus 24:13-14',
      sampleText: 'Aquele, porém, que perseverar até o fim, esse será salvo. E será pregado este evangelho do reino por todo o mundo, para testemunho a todas as nações. Então, virá o fim.',
      insight: 'Perseverar na esperança e compartilhar as Boas Novas é o foco da nossa caminhada diária.'
    },
    {
      day: 11,
      title: 'As Dez Virgens, os Talentos e o Getsêmani',
      book: 'Mateus',
      startCh: 25,
      endCh: 26,
      sampleRef: 'Mateus 26:39',
      sampleText: 'Adiantando-se um pouco, prostrou-se sobre o seu rosto, orando e dizendo: Meu Pai, se é possível, passe de mim este cálice! Todavia, não seja como eu quero, e sim como tu queres.',
      insight: 'A oração submissa no Getsêmani abriu o caminho da redenção para a humanidade.'
    },
    {
      day: 12,
      title: 'A Crucificação, Ressurreição e a Grande Comissão',
      book: 'Mateus',
      startCh: 27,
      endCh: 28,
      sampleRef: 'Mateus 28:18-20',
      sampleText: 'Jesus, aproximando-se, falou-lhes, dizendo: Toda a autoridade me foi dada no céu e na terra. Ide, portanto, fazei discípulos de todas as nações... E eis que estou convosco todos os dias até a consumação dos séculos.',
      insight: 'Cristo ressuscitou, venceu a morte e prometeu estar conosco todos os dias até o fim dos tempos.'
    },

    // Marcos (16 caps) - Dias 13 a 18
    {
      day: 13,
      title: 'O Servo Fiel e Poderoso em Ação',
      book: 'Marcos',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Marcos 1:35',
      sampleText: 'Tendo-se levantado alta madrugada, saiu, foi para um lugar deserto e ali orava.',
      insight: 'Mesmo na rotina mais agitada, a comunhão íntima com o Pai nas primeiras horas é o segredo da paz.'
    },
    {
      day: 14,
      title: 'Acalmando a Tempestade e Libertando os Oprimidos',
      book: 'Marcos',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Marcos 4:39-40',
      sampleText: 'E ele, despertando, repreendeu o vento e disse ao mar: Acalma-te, emudece! O vento cessou e fez-se grande bonança. Então, lhes disse: Por que sois assim tímidos? Como é que não tendes fé?',
      insight: 'Não há tempestade exterior que resista à autoridade da voz de Cristo no seu barco.'
    },
    {
      day: 15,
      title: 'Tradições Humanas vs Mandamento Divino',
      book: 'Marcos',
      startCh: 7,
      endCh: 9,
      sampleRef: 'Marcos 8:34-36',
      sampleText: 'Se alguém quer vir após mim, a si mesmo se negue, tome a sua cruz e siga-me. Quem quiser, pois, salvar a sua vida perdê-la-á; e quem perder a vida por causa de mim e do evangelho salvá-la-á.',
      insight: 'Ganhar o mundo inteiro sem ter a paz da alma é a maior das ilusões.'
    },
    {
      day: 16,
      title: 'O Maior no Reino é Aquele que Serve',
      book: 'Marcos',
      startCh: 10,
      endCh: 12,
      sampleRef: 'Marcos 10:45',
      sampleText: 'Pois o próprio Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos.',
      insight: 'A verdadeira nobreza cristã se expressa na toalha de servo e no amor aos outros.'
    },
    {
      day: 17,
      title: 'A Oferta da Viúva e a Vigilância no Fim dos Tempos',
      book: 'Marcos',
      startCh: 13,
      endCh: 14,
      sampleRef: 'Marcos 12:43-44',
      sampleText: 'Chamando os seus discípulos, disse-lhes: Em verdade vos digo que esta viúva pobre deitou mais do que todos os que deitaram no gazofilácio; porque todos deram do que lhes sobrava, mas ela, da sua pobreza, deitou tudo o que tinha.',
      insight: 'Deus não mede o tamanho da oferta pela quantia exterior, mas pelo amor e entrega do coração.'
    },
    {
      day: 18,
      title: 'Vitória Sobre a Sepultura e a Proclamação Mundial',
      book: 'Marcos',
      startCh: 15,
      endCh: 16,
      sampleRef: 'Marcos 16:6',
      sampleText: 'Ele, porém, lhes disse: Não vos atemorizeis; buscais a Jesus, o Nazareno, que foi crucificado; ele ressuscitou, não está mais aqui; vede o lugar onde o tinham posto.',
      insight: 'A sepultura vazia é a garantia inabalável de que a nossa esperança não morre.'
    },

    // Lucas (24 caps) - Dias 19 a 28
    {
      day: 19,
      title: 'O Cântico de Maria e o Nascimento em Belém',
      book: 'Lucas',
      startCh: 1,
      endCh: 2,
      sampleRef: 'Lucas 2:10-14',
      sampleText: 'O anjo, porém, lhes disse: Não temais; eis aqui vos trago boa-nova de grande alegria, que o será para todo o povo: é que hoje vos nasceu, na cidade de Davi, o Salvador, que é Cristo, o Senhor... Glória a Deus nas maiores alturas, e paz na terra entre os homens a quem ele quer bem.',
      insight: 'O Salvador veio aos simples e humildes, trazendo a verdadeira paz aos corações.'
    },
    {
      day: 20,
      title: 'O Batismo e a Genealogia da Esperança',
      book: 'Lucas',
      startCh: 3,
      endCh: 4,
      sampleRef: 'Lucas 4:18-19',
      sampleText: 'O Espírito do Senhor está sobre mim, pelo que me ungiu para evangelizar os pobres; enviou-me para proclamar libertação aos cativos e restauração da vista aos cegos, para pôr em liberdade os oprimidos, e apregoar o ano aceitável do Senhor.',
      insight: 'O Evangelho liberta, cura feridas e inaugura um novo tempo de graça.'
    },
    {
      day: 21,
      title: 'Pesca Milagrosa e o Sermão do Plano',
      book: 'Lucas',
      startCh: 5,
      endCh: 6,
      sampleRef: 'Lucas 6:27-28',
      sampleText: 'Digo-vos, porém, a vós outros que me ouvis: amai os vossos inimigos, fazei o bem aos que vos odeiam; bendizei aos que vos maldizem, orai pelos que vos caluniam.',
      insight: 'Amar quem nos faz mal quebra as correntes do ódio e reflete a graça do Pai.'
    },
    {
      day: 22,
      title: 'A Fé do Centurião e a Mulher que Ungiu os Pés de Jesus',
      book: 'Lucas',
      startCh: 7,
      endCh: 8,
      sampleRef: 'Lucas 7:47',
      sampleText: 'Por isso, te digo: perdoados lhe são os seus muitos pecados, porque ela muito amou; mas aquele a quem pouco se perdoa, pouco ama.',
      insight: 'Quanto mais compreendemos a imensidão do perdão que recebemos, mais transbordamos em adoração.'
    },
    {
      day: 23,
      title: 'A Glória no Monte e o Bom Samaritano',
      book: 'Lucas',
      startCh: 9,
      endCh: 10,
      sampleRef: 'Lucas 10:33-34',
      sampleText: 'Certo samaritano, que seguia o seu caminho, passou-lhe perto e, vendo-o, compadeceu-se dele. E, chegando-se, pensou-lhe os ferimentos, aplicando-lhes óleo e vinho; e, colocando-o sobre o seu próprio animal, levou-o para uma hospedaria e tratou dele.',
      insight: 'Compaixão genuína não passa de largo diante da dor do próximo.'
    },
    {
      day: 24,
      title: 'A Oração do Pai Nosso e Alerta Contra a Cobiça',
      book: 'Lucas',
      startCh: 11,
      endCh: 12,
      sampleRef: 'Lucas 12:32-34',
      sampleText: 'Não temais, ó pequenino rebanho; porque vosso Pai se agradou em dar-vos o seu reino. Vendei os vossos bens e dai esmola; fazei para vós outros bolsas que não desgastem, tesouro extinto nos céus, onde não chega o ladrão nem a traça corrói.',
      insight: 'Onde estiver o seu tesouro, aí estará também o seu coração.'
    },
    {
      day: 25,
      title: 'A Porta Estreita e a Parábola do Grande Banquete',
      book: 'Lucas',
      startCh: 13,
      endCh: 15,
      sampleRef: 'Lucas 15:7',
      sampleText: 'Digo-vos que, assim, haverá maior júbilo no céu por um pecador que se arrepende do que por noventa e nove justos que não necessitam de arrependimento.',
      insight: 'O céu faz festa a cada filho que volta para casa arrependido.'
    },
    {
      day: 26,
      title: 'O Administrador Infiel e o Rico com Lázaro',
      book: 'Lucas',
      startCh: 16,
      endCh: 18,
      sampleRef: 'Lucas 18:1',
      sampleText: 'Disse-lhes Jesus uma parábola sobre o dever de orar sempre e nunca esmorecer.',
      insight: 'A oração perseverante é a respiração da fé que nunca se rende.'
    },
    {
      day: 27,
      title: 'O Encontro com Zaqueu e a Última Ceia',
      book: 'Lucas',
      startCh: 19,
      endCh: 21,
      sampleRef: 'Lucas 19:9-10',
      sampleText: 'Disse-lhe Jesus: Hoje, houve salvação nesta casa, pois que também este é filho de Abraão. Porque o Filho do Homem veio buscar e salvar o perdido.',
      insight: 'Jesus entra na nossa casa e transforma nossa história de vida.'
    },
    {
      day: 28,
      title: 'A Paixão, o Caminho de Emaús e a Ascensão',
      book: 'Lucas',
      startCh: 22,
      endCh: 24,
      sampleRef: 'Lucas 24:32',
      sampleText: 'E disseram um ao outro: Porventura, não nos ardia o coração, quando ele, pelo caminho, nos falava, quando nos expunha as Escrituras?',
      insight: 'A presença do Cristo vivo faz queimar nosso peito com renovada esperança.'
    },

    // João (21 caps) - Dias 29 a 36
    {
      day: 29,
      title: 'O Verbo se Fez Carne e o Primeiro Milagre',
      book: 'João',
      startCh: 1,
      endCh: 3,
      sampleRef: 'João 3:16-17',
      sampleText: 'Porque Deus amou ao mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna. Porquanto Deus enviou o seu Filho ao mundo, não para que julgasse o mundo, mas para que o mundo fosse salvo por ele.',
      insight: 'O amor de Deus não é teoria: Ele deu Seu único Filho para que tenhamos vida plena.'
    },
    {
      day: 30,
      title: 'A Água Viva e a Cura no Tanque de Betesda',
      book: 'João',
      startCh: 4,
      endCh: 5,
      sampleRef: 'João 4:14',
      sampleText: 'Aquele, porém, que beber da água que eu lhe der nunca mais terá sede; pelo contrário, a água que eu lhe der será nele uma fonte a jorrar para a vida eterna.',
      insight: 'Só Cristo sacia a sede profunda de propósito e significado da alma.'
    },
    {
      day: 31,
      title: 'O Pão da Vida e os Rios de Água Viva',
      book: 'João',
      startCh: 6,
      endCh: 7,
      sampleRef: 'João 6:35',
      sampleText: 'Declarou-lhes, pois, Jesus: Eu sou o pão da vida; o que vem a mim jamais terá fome; e o que crê em mim jamais terá sede.',
      insight: 'Alimentar-se diariamente de Cristo é o segredo da vitalidade espiritual.'
    },
    {
      day: 32,
      title: 'A Luz do Mundo e o Cego de Nascença',
      book: 'João',
      startCh: 8,
      endCh: 9,
      sampleRef: 'João 8:12',
      sampleText: 'De novo, lhes falava Jesus, dizendo: Eu sou a luz do mundo; quem me segue não andará nas trevas; pelo contrário, terá a luz da vida.',
      insight: 'Seguir Jesus dissipa toda e qualquer escuridão dos nossos caminhos.'
    },
    {
      day: 33,
      title: 'O Bom Pastor e a Ressurreição de Lázaro',
      book: 'João',
      startCh: 10,
      endCh: 12,
      sampleRef: 'João 11:25-26',
      sampleText: 'Disse-lhe Jesus: Eu sou a ressurreição e a vida. Quem crê em mim, ainda que morra, viverá; e todo o que vive e crê em mim não morrerá, eternamente. Crês isto?',
      insight: 'A morte não tem a palavra final sobre aqueles que pertencem a Cristo.'
    },
    {
      day: 34,
      title: 'O Lava-Pés, a Promessa do Consolador e a Videira',
      book: 'João',
      startCh: 13,
      endCh: 15,
      sampleRef: 'João 15:4-5',
      sampleText: 'Permanecei em mim, e eu permanecerei em vós. Como não pode o ramo produzir fruto de si mesmo, se não permanecer na videira, assim, nem vós o podeis dar, se não permanecerdes em mim. Eu sou a videira, vós, os ramos.',
      insight: 'Permanecer ligado à Videira Verdadeira é o único modo de dar frutos eternos.'
    },
    {
      day: 35,
      title: 'A Obra do Espírito Santo e a Oração Sacerdotal',
      book: 'João',
      startCh: 16,
      endCh: 18,
      sampleRef: 'João 16:33',
      sampleText: 'Estas coisas vos tenho dito para que tenhais paz em mim. No mundo, passais por aflições; mas tende bom ânimo; eu venci o mundo.',
      insight: 'Temos paz não pela ausência de batalhas, mas pela presença Daquele que já venceu o mundo.'
    },
    {
      day: 36,
      title: 'Consumado Está, a Ressurreição e a Restauração de Pedro',
      book: 'João',
      startCh: 19,
      endCh: 21,
      sampleRef: 'João 20:29-31',
      sampleText: 'Disse-lhe Jesus: Porque me viste, creste? Bem-aventurados os que não viram e creram... Estes, porém, foram registrados para que creiais que Jesus é o Cristo, o Filho de Deus, e para que, crendo, tenhais vida em seu nome.',
      insight: 'A fé em Jesus nos garante vida abundante e esperança que não se abala.'
    },

    // Atos dos Apóstolos (28 caps) - Dias 37 a 46
    {
      day: 37,
      title: 'O Pentecostes e o Nascimento da Igreja',
      book: 'Atos',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Atos 1:8',
      sampleText: 'Mas recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra.',
      insight: 'O Espírito Santo nos capacita com ousadia e poder para viver o Evangelho.'
    },
    {
      day: 38,
      title: 'Ousadia na Perseguição e Comunhão Fraterna',
      book: 'Atos',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Atos 4:32',
      sampleText: 'Da multidão dos que creram era um o coração e a alma. Ninguém dizia que coisa alguma das que possuía era sua própria, mas tudo lhes era comum.',
      insight: 'A generosidade e a unidade são a marca visível de uma igreja cheia do Espírito.'
    },
    {
      day: 39,
      title: 'O Martírio de Estêvão e Filipe em Samaria',
      book: 'Atos',
      startCh: 7,
      endCh: 8,
      sampleRef: 'Atos 7:59-60',
      sampleText: 'E apedrejavam Estêvão, que invocava e dizia: Senhor Jesus, recebe o meu espírito! E, pondo-se de joelhos, clamou em alta voz: Senhor, não lhes imputes este pecado!',
      insight: 'Até no momento final, a graça de perdoar brilha com autoridade celestial.'
    },
    {
      day: 40,
      title: 'A Conversão de Saulo e a Visão de Pedro',
      book: 'Atos',
      startCh: 9,
      endCh: 10,
      sampleRef: 'Atos 10:34-35',
      sampleText: 'Então, falou Pedro, dizendo: Reconheço, por verdade, que Deus não faz acepção de pessoas; pelo contrário, em qualquer nação, aquele que o teme e faz o que é justo lhe é aceitável.',
      insight: 'A salvação em Jesus atravessa todas as barreiras étnicas, culturais e sociais.'
    },
    {
      day: 41,
      title: 'A Igreja em Antioquia e o Livramento de Pedro',
      book: 'Atos',
      startCh: 11,
      endCh: 13,
      sampleRef: 'Atos 12:5',
      sampleText: 'Pedro, pois, estava guardado no cárcere; mas havia oração incessante a Deus por parte da igreja a favor dele.',
      insight: 'As correntes caem e as portas de ferro se abrem quando a igreja ora fervorosamente.'
    },
    {
      day: 42,
      title: 'Primeira Viagem Missionária e o Concílio de Jerusalém',
      book: 'Atos',
      startCh: 14,
      endCh: 15,
      sampleRef: 'Atos 15:11',
      sampleText: 'Mas cremos que fomos salvos pela graça do Senhor Jesus, como também eles.',
      insight: 'Somos salvos exclusivamente pela graça, mediante a fé em Jesus Cristo.'
    },
    {
      day: 43,
      title: 'Louvor na Prisão de Filipos e Paulo em Atenas',
      book: 'Atos',
      startCh: 16,
      endCh: 18,
      sampleRef: 'Atos 16:25-26',
      sampleText: 'Por volta da meia-noite, Paulo e Silas oravam e cantavam louvores a Deus, e os outros presos os escutavam. De repente, sobreveio um tamanho terremoto, que os alicerces da prisão se abalaram.',
      insight: 'O louvor na hora mais escura da noite tem poder para romper qualquer prisão espiritual.'
    },
    {
      day: 44,
      title: 'O Avivamento em Éfeso e a Despedida dos Presbíteros',
      book: 'Atos',
      startCh: 19,
      endCh: 21,
      sampleRef: 'Atos 20:24',
      sampleText: 'Porém em nada considero a vida preciosa para mim mesmo, contanto que complete a minha carreira e o ministério que recebi do Senhor Jesus para dar testemunho do evangelho da graça de Deus.',
      insight: 'Completar o propósito de Deus com fidelidade vale mais do que a própria vida.'
    },
    {
      day: 45,
      title: 'Paulo Testemunha Perante Reis e Governadores',
      book: 'Atos',
      startCh: 22,
      endCh: 24,
      sampleRef: 'Atos 24:16',
      sampleText: 'Por isso, também me esforço por ter sempre consciência pura diante de Deus e dos homens.',
      insight: 'Uma consciência pura é o travesseiro mais macio e o testemunho mais eloquente.'
    },
    {
      day: 46,
      title: 'Naufrágio em Malta e o Evangelho em Roma',
      book: 'Atos',
      startCh: 25,
      endCh: 28,
      sampleRef: 'Atos 28:30-31',
      sampleText: 'Por dois anos inteiros, permaneceu Paulo na sua própria moradia alugada, recebendo todos os que o procuravam, pregando o reino de Deus, e, com toda a intrepidez, sem impedimento algum, ensinava as coisas referentes ao Senhor Jesus Cristo.',
      insight: 'Nenhuma prisão ou corrente humana pode impedir o avanço soberano da Palavra de Deus.'
    },

    // Romanos (16 caps) - Dias 47 a 51
    {
      day: 47,
      title: 'O Evangelho como Poder de Deus para Salvação',
      book: 'Romanos',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Romanos 1:16-17',
      sampleText: 'Pois não me envergonho do evangelho, porque é o poder de Deus para a salvação de todo aquele que crê; primeiro do judeu e também do grego; visto que a justiça de Deus se revela no evangelho, de fé em fé, como está escrito: O justo viverá por fé.',
      insight: 'Nossas próprias forças não nos justificam; somente a fé na obra de Cristo nos faz justos diante de Deus.'
    },
    {
      day: 48,
      title: 'Paz com Deus e Justificação pela Fé',
      book: 'Romanos',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Romanos 5:1-2',
      sampleText: 'Justificados, pois, mediante a fé, temos paz com Deus por meio de nosso Senhor Jesus Cristo; por intermédio de quem obtivemos igualmente acesso, pela fé, a esta graça na qual estamos firmes; e gloriamo-nos na esperança da glória de Deus.',
      insight: 'A paz que temos com Deus é eterna e inabalável, fundamentada no sacrifício na cruz.'
    },
    {
      day: 49,
      title: 'Vida no Espírito e Nenhuma Condenação',
      book: 'Romanos',
      startCh: 7,
      endCh: 9,
      sampleRef: 'Romanos 8:1-2',
      sampleText: 'Agora, pois, já nenhuma condenação há para os que estão em Cristo Jesus. Porque a lei do Espírito da vida, em Cristo Jesus, te livrou da lei do pecado e da morte.',
      insight: 'Em Cristo, somos mais do que vencedores e nada poderá nos separar do amor de Deus.'
    },
    {
      day: 50,
      title: 'A Mensagem da Fé e a Transformação da Mente',
      book: 'Romanos',
      startCh: 10,
      endCh: 12,
      sampleRef: 'Romanos 12:1-2',
      sampleText: 'Rogo-vos, pois, irmãos, pelas misericórdias de Deus, que apresenteis o vosso corpo por sacrifício vivo, santo e agradável a Deus, que é o vosso culto racional. E não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente.',
      insight: 'A verdadeira espiritualidade renova o pensamento e transforma as atitudes diárias.'
    },
    {
      day: 51,
      title: 'Amor ao Próximo, Submissão e Unidade Fraterna',
      book: 'Romanos',
      startCh: 13,
      endCh: 16,
      sampleRef: 'Romanos 15:13',
      sampleText: 'E o Deus da esperança vos encha de todo o gozo e paz no vosso crer, para que sejais ricos de esperança no poder do Espírito Santo.',
      insight: 'Que o Deus da esperança inunde os nossos corações de santa alegria e paz perfeita.'
    },

    // 1 Coríntios (16 caps) - Dias 52 a 56
    {
      day: 52,
      title: 'A Sabedoria da Cruz e a Loucura para o Mundo',
      book: '1 Coríntios',
      startCh: 1,
      endCh: 4,
      sampleRef: '1 Coríntios 1:18',
      sampleText: 'Certamente, a palavra da cruz é loucura para os que se perdem, mas para nós, que somos salvos, poder de Deus.',
      insight: 'O que o mundo despreza como fraqueza, Deus usa para demonstrar Sua infinita sabedoria.'
    },
    {
      day: 53,
      title: 'Pureza no Corpo e Santidade nos Relacionamentos',
      book: '1 Coríntios',
      startCh: 5,
      endCh: 8,
      sampleRef: '1 Coríntios 6:19-20',
      sampleText: 'Acaso, não sabeis que o vosso corpo é santuário do Espírito Santo, que está em vós, o qual tendes da parte de Deus, e que não sois de vós mesmos? Porque fostes comprados por preço. Agora, pois, glorificai a Deus no vosso corpo.',
      insight: 'Nosso corpo é a morada sagrada do Espírito; viver em santidade é honrar quem nos comprou.'
    },
    {
      day: 54,
      title: 'A Corrida da Fé e a Mesa da Ceia do Senhor',
      book: '1 Coríntios',
      startCh: 9,
      endCh: 11,
      sampleRef: '1 Coríntios 10:13',
      sampleText: 'Não vos sobreveio tentação que não fosse humana; mas Deus é fiel e não permitirá que sejais tentados além das vossas forças; pelo contrário, juntamente com a tentação, vos proverá livramento.',
      insight: 'Deus nunca nos abandona sozinhos nas batalhas; Ele sempre provê a saída com fidelidade.'
    },
    {
      day: 55,
      title: 'Dons Espirituais e o Hino ao Amor Maior',
      book: '1 Coríntios',
      startCh: 12,
      endCh: 14,
      sampleRef: '1 Coríntios 13:4-7',
      sampleText: 'O amor é paciente, é benigno; o amor não arde em ciúmes, não se ufana, não se ensoberbe... tudo sofre, tudo crê, tudo espera, tudo suporta. O amor jamais acaba.',
      insight: 'Sem amor, os maiores dons e realizações humanas não passam de ruído vazio.'
    },
    {
      day: 56,
      title: 'A Vitória Suprema sobre a Morte e a Ressurreição',
      book: '1 Coríntios',
      startCh: 15,
      endCh: 16,
      sampleRef: '1 Coríntios 15:57-58',
      sampleText: 'Graças a Deus, que nos dá a vitória por intermédio de nosso Senhor Jesus Cristo. Portanto, meus amados irmãos, sede firmes, inabaláveis e sempre abundantes na obra do Senhor, sabendo que, no Senhor, o vosso trabalho não é vão.',
      insight: 'Nenhum esforço feito por amor a Cristo é perdido; a ressurreição garante nosso galardão eterno.'
    },

    // 2 Coríntios (13 caps) - Dias 57 a 59
    {
      day: 57,
      title: 'O Deus de Toda Consolação e o Aroma de Cristo',
      book: '2 Coríntios',
      startCh: 1,
      endCh: 4,
      sampleRef: '2 Coríntios 4:16-18',
      sampleText: 'Por isso, não desanimamos; pelo contrário, mesmo que o nosso homem exterior se corrompa, contudo, o nosso homem interior se renova de dia em dia. Porque a nossa leve e momentânea tribulação produz para nós eterno peso de glória.',
      insight: 'O sofrimento presente é passageiro, mas a glória preparada por Deus é eterna e imensurável.'
    },
    {
      day: 58,
      title: 'Nova Criatura e a Graça da Generosidade',
      book: '2 Coríntios',
      startCh: 5,
      endCh: 9,
      sampleRef: '2 Coríntios 5:17',
      sampleText: 'E, assim, se alguém está em Cristo, é nova criatura; as coisas antigas já passaram; eis que se fizeram novas.',
      insight: 'Em Cristo o nosso passado foi redimido e uma história completamente nova começou.'
    },
    {
      day: 59,
      title: 'O Espinho na Carne e o Poder Aperfeiçoado na Fraqueza',
      book: '2 Coríntios',
      startCh: 10,
      endCh: 13,
      sampleRef: '2 Coríntios 12:9-10',
      sampleText: 'Então, ele me disse: A minha graça te basta, porque o poder se aperfeiçoa na fraqueza. De boa vontade, pois, mais me gloriarei nas fraquezas, para que sobre mim repouse o poder de Cristo.',
      insight: 'Quando reconhecemos a nossa insuficiência, a graça soberana de Deus se manifesta com plenitude.'
    },

    // Gálatas, Efésios, Filipenses, Colossenses (dias 60 a 65)
    {
      day: 60,
      title: 'Liberdade em Cristo vs O Julgo da Lei',
      book: 'Gálatas',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Gálatas 2:20',
      sampleText: 'Logo, já não sou eu quem vive, mas Cristo vive em mim; e esse viver que, agora, tenho na carne, vivo pela fé no Filho de Deus, que me amou e a si mesmo se entregou por mim.',
      insight: 'A vida cristã autêntica é Cristo vivendo Sua graça através de nós a cada instante.'
    },
    {
      day: 61,
      title: 'O Fruto do Espírito e a Semeadura da Alma',
      book: 'Gálatas',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Gálatas 5:22-23',
      sampleText: 'Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio. Contra estas coisas não há lei.',
      insight: 'O fruto do Espírito floresce quando andamos em sintonia diária com a Palavra.'
    },
    {
      day: 62,
      title: 'Bênçãos Espirituais nas Regiões Celestiais e Salvação pela Graça',
      book: 'Efésios',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Efésios 2:8-10',
      sampleText: 'Porque pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus; não de obras, para que ninguém se glorie. Pois somos feitura dele, criados em Cristo Jesus para boas obras.',
      insight: 'A salvação é presente gratuito da graça de Deus, nos capacitando para amar e servir.'
    },
    {
      day: 63,
      title: 'A Armadura de Deus e a Vida em Harmonia',
      book: 'Efésios',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Efésios 6:10-11',
      sampleText: 'Quanto ao mais, sede fortalecidos no Senhor e na força do seu poder. Revesti-vos de toda a armadura de Deus, para poderdes ficar firmes contra as ciladas do diabo.',
      insight: 'Revestidos com a verdade, a justiça e o escudo da fé, nenhuma cilada pode nos derrotar.'
    },
    {
      day: 64,
      title: 'Alegria Inabalável e a Paz que Excede Todo Entendimento',
      book: 'Filipenses',
      startCh: 1,
      endCh: 4,
      sampleRef: 'Filipenses 4:6-7',
      sampleText: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças. E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus.',
      insight: 'Troque a ansiedade pela oração com gratidão e experimente a paz que guarda o coração.'
    },
    {
      day: 65,
      title: 'A Supremacia Absoluta de Cristo e as Roupas da Compaixão',
      book: 'Colossenses',
      startCh: 1,
      endCh: 4,
      sampleRef: 'Colossenses 3:12-14',
      sampleText: 'Revesti-vos, pois, como eleitos de Deus, santos e amados, de ternos afetos de misericórdia, de bondade, de humildade, de mansidão, de longanimidade... e, acima de tudo isto, porém, esteja o amor, que é o vínculo da perfeição.',
      insight: 'Em Cristo habita corporalmente toda a plenitude da divindade, e Nele estamos completos.'
    },

    // 1 & 2 Tessalonicenses, 1 & 2 Timóteo, Tito, Filemom (dias 66 a 71)
    {
      day: 66,
      title: 'A Esperança da Volta de Cristo e a Santificação',
      book: '1 Tessalonicenses',
      startCh: 1,
      endCh: 5,
      sampleRef: '1 Tessalonicenses 5:16-18',
      sampleText: 'Regozijai-vos sempre. Orai sem cessar. Em tudo, dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
      insight: 'A alegria contínua, a oração sem cessar e a gratidão são o lema do discípulo fiel.'
    },
    {
      day: 67,
      title: 'Firmeza na Verdade e o Senhor da Paz',
      book: '2 Tessalonicenses',
      startCh: 1,
      endCh: 3,
      sampleRef: '2 Tessalonicenses 3:16',
      sampleText: 'Ora, o próprio Senhor da paz vos dê a paz continuamente, em todos os sentidos. O Senhor seja com todos vós.',
      insight: 'Que o Senhor da paz guarde seus passos e tranquilize as suas noites.'
    },
    {
      day: 68,
      title: 'O Bom Combate e a Liderança com Integridade',
      book: '1 Timóteo',
      startCh: 1,
      endCh: 3,
      sampleRef: '1 Timóteo 2:5-6',
      sampleText: 'Porquanto há um só Deus e um só Mediador entre Deus e os homens, Cristo Jesus, homem, o qual a si mesmo se deu em resgate por todos.',
      insight: 'Temos acesso direto ao trono da graça por meio de Jesus, nosso único Mediador.'
    },
    {
      day: 69,
      title: 'Exemplo na Fé e o Conteúdo da Piedade',
      book: '1 Timóteo',
      startCh: 4,
      endCh: 6,
      sampleRef: '1 Timóteo 4:12',
      sampleText: 'Ninguém despreze a tua mocidade; pelo contrário, torna-te padrão dos fiéis, na palavra, no procedimento, no amor, na fé, na pureza.',
      insight: 'Sua conduta e seu amor são o testemunho mais claro do Evangelho que você proclama.'
    },
    {
      day: 70,
      title: 'O Espírito de Coragem e o Fim da Carreira com Fidelidade',
      book: '2 Timóteo',
      startCh: 1,
      endCh: 4,
      sampleRef: '2 Timóteo 4:7-8',
      sampleText: 'Combati o bom combate, completei a carreira, guardei a fé. Já agora a coroa da justiça me está guardada, a qual o Senhor, reto juiz, me dará naquele Dia.',
      insight: 'Não fomos chamados para o medo, mas para o poder, o amor e o equilíbrio da fé.'
    },
    {
      day: 71,
      title: 'A Graça que Educa e a Reconciliação Fraterna',
      book: 'Tito',
      startCh: 1,
      endCh: 3,
      extraChapters: ['Filemom 1'],
      sampleRef: 'Tito 2:11-12',
      sampleText: 'Porquanto a graça de Deus se manifestou salvadora a todos os homens, educando-nos para que, renegadas a impiedade e as paixões mundanas, vivamos, no presente século, sensata, justa e piedosamente.',
      insight: 'A graça de Deus não apenas perdoa o passado, mas nos ensina a viver com nobreza hoje.'
    },

    // Hebreus (13 caps) - Dias 72 a 76
    {
      day: 72,
      title: 'A Voz Superior do Filho e o Capitão da Salvação',
      book: 'Hebreus',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Hebreus 1:1-2',
      sampleText: 'Havendo Deus, outrora, falado muitas vezes e de muitas maneiras aos pais, pelos profetas, nestes últimos dias nos falou pelo Filho, a quem constituiu herdeiro de todas as coisas, pelo qual também fez o universo.',
      insight: 'Em Cristo, Deus pronunciou Sua palavra final e completa de amor e acolhimento.'
    },
    {
      day: 73,
      title: 'O Descanso da Fé e o Trono da Graça',
      book: 'Hebreus',
      startCh: 4,
      endCh: 6,
      sampleRef: 'Hebreus 4:16',
      sampleText: 'Acheguemo-nos, portanto, confiadamente, junto ao trono da graça, a fim de recebermos misericórdia e acharmos graça para socorro em ocasião oportuna.',
      insight: 'Podemos nos aproximar de Deus sem medo, certos de que encontraremos socorro em tempo oportuno.'
    },
    {
      day: 74,
      title: 'O Sumo Sacerdote Perfeito e a Nova Aliança Eterna',
      book: 'Hebreus',
      startCh: 7,
      endCh: 9,
      sampleRef: 'Hebreus 7:25',
      sampleText: 'Por isso, também pode salvar totalmente os que por ele se aproximam de Deus, vivendo sempre para interceder por eles.',
      insight: 'Jesus vive para interceder por você ao lado do Pai; você está eternamente seguro nas mãos Dele.'
    },
    {
      day: 75,
      title: 'A Galeria dos Heróis da Fé',
      book: 'Hebreus',
      startCh: 10,
      endCh: 11,
      sampleRef: 'Hebreus 11:1-3',
      sampleText: 'Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem. Pois, pela fé, os antigos obtiveram bom testemunho... Pela fé, entendemos que foi o universo formado pela palavra de Deus.',
      insight: 'A fé enxerga o invisível, crê no impossível e experimenta os milagres da providência divina.'
    },
    {
      day: 76,
      title: 'Olhando Firmemente para Jesus e o Altar Celestial',
      book: 'Hebreus',
      startCh: 12,
      endCh: 13,
      sampleRef: 'Hebreus 12:1-2',
      sampleText: 'Portanto, também nós, visto que temos a rodear-nos tão grande nuvem de testemunhas, desembaraçando-nos de todo peso e do pecado que tenazmente nos assedia, corramos, com perseverança, a carreira que nos está proposta, olhando firmemente para o Autor e Consumador da fé, Jesus.',
      insight: 'Manter os olhos fixos em Jesus nos dá força para vencer qualquer cansaço ou tropeço no caminho.'
    },

    // Tiago, 1 & 2 Pedro, 1, 2 & 3 João, Judas (dias 77 a 84)
    {
      day: 77,
      title: 'Sabedoria nas Provações e a Fé que Pratica',
      book: 'Tiago',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Tiago 1:5-6',
      sampleText: 'Se, porém, algum de vos necessita de sabedoria, peça-a a Deus, que a todos dá com generosidade e não censura, e ser-lhe-á concedida. Peça-a, porém, com fé, em nada duvidando.',
      insight: 'A fé autêntica não é teoria retórica: ela se traduz em obras de justiça e controle da língua.'
    },
    {
      day: 78,
      title: 'A Proximidade com Deus e a Oração dos Justos',
      book: 'Tiago',
      startCh: 4,
      endCh: 5,
      sampleRef: 'Tiago 4:8',
      sampleText: 'Chegai-vos a Deus, e ele se chegará a vós outros. A oração de um justo pode muito em seus efeitos.',
      insight: 'A oração humilde e fervorosa move montanhas e atrai o favor de Deus para as nossas causas.'
    },
    {
      day: 79,
      title: 'Esperança Viva e Povo Adquirido por Deus',
      book: '1 Pedro',
      startCh: 1,
      endCh: 3,
      sampleRef: '1 Pedro 2:9',
      sampleText: 'Vós, porém, sois raça eleita, sacerdócio real, nação santa, povo de propriedade exclusiva de Deus, a fim de proclamardes as virtudes daquele que vos chamou das trevas para a sua maravilhosa luz.',
      insight: 'Você não é um acidente; você é propriedade exclusiva de Deus, chamado para proclamar Sua luz.'
    },
    {
      day: 80,
      title: 'Lançando Toda Ansiedade e a Rocha Firme',
      book: '1 Pedro',
      startCh: 4,
      endCh: 5,
      sampleRef: '1 Pedro 5:6-7',
      sampleText: 'Humilhai-vos, portanto, sob a poderosa mão de Deus, para que ele, em tempo oportuno, vos exalte, lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
      insight: 'Entregue o fardo da sua ansiedade ao Senhor, pois Ele cuida de você em cada detalhe.'
    },
    {
      day: 81,
      title: 'Preciosas Promessas e a Vigilância no Fim dos Tempos',
      book: '2 Pedro',
      startCh: 1,
      endCh: 3,
      sampleRef: '2 Pedro 1:3-4',
      sampleText: 'Pelo seu divino poder, nos têm sido doadas todas as coisas que conduzem à vida e à piedade... pelas quais nos têm sido doadas as suas preciosas e mui grandes promessas.',
      insight: 'Deus já nos concedeu tudo quanto é necessário para uma vida abençoada e frutífera.'
    },
    {
      day: 82,
      title: 'Comunhão na Luz e o Advogado Fiel',
      book: '1 João',
      startCh: 1,
      endCh: 3,
      sampleRef: '1 João 3:1',
      sampleText: 'Vede que grande amor nos tem concedido o Pai, a ponto de sermos chamados filhos de Deus; e, de fato, somos filhos de Deus.',
      insight: 'Ser chamado filho de Deus é a identidade suprema que nada nem ninguém pode revogar.'
    },
    {
      day: 83,
      title: 'Deus é Amor e a Vitória da Fé',
      book: '1 João',
      startCh: 4,
      endCh: 5,
      sampleRef: '1 João 4:18-19',
      sampleText: 'No amor não existe medo; antes, o perfeito amor lança fora o medo... Nós amamos porque ele nos amou primeiro.',
      insight: 'O amor de Deus dissipa todo terror e insegurança; fomos alcançados primeiro pela graça.'
    },
    {
      day: 84,
      title: 'Andar na Verdade e Edificação na Santíssima Fé',
      book: '2 João',
      startCh: 1,
      endCh: 1,
      extraChapters: ['3 João 1', 'Judas 1'],
      sampleRef: 'Judas 1:24-25',
      sampleText: 'Ora, àquele que é poderoso para vos guardar de tropeços e para vos apresentar com exultação, imaculados diante da sua glória, ao único Deus, nosso Salvador, mediante Jesus Cristo, glória e majestade para todo o sempre.',
      insight: 'O Senhor é poderoso para guardar os seus pés de tropeçar e conduzi-lo em triunfo.'
    },

    // Apocalipse (22 caps) - Dias 85 a 90
    {
      day: 85,
      title: 'A Revelação de Jesus Cristo e as Cartas às Igrejas',
      book: 'Apocalipse',
      startCh: 1,
      endCh: 3,
      sampleRef: 'Apocalipse 3:20',
      sampleText: 'Eis que estou à porta e bato; se alguém ouvir a minha voz e abrir a porta, entrarei em sua casa e cearei com ele, e ele, comigo.',
      insight: 'Jesus deseja intimidade profunda e constante com cada um de nós hoje.'
    },
    {
      day: 86,
      title: 'O Trono Celestial e o Cordeiro Digno',
      book: 'Apocalipse',
      startCh: 4,
      endCh: 7,
      sampleRef: 'Apocalipse 5:12',
      sampleText: 'Digno é o Cordeiro que foi morto de receber o poder, e riqueza, e sabedoria, e força, e honra, e glória, e louvor!',
      insight: 'O Cordeiro que foi imolado é o Soberano de todo o universo; a vitória já pertence a Ele.'
    },
    {
      day: 87,
      title: 'As Trombetas e as Duas Testemunhas',
      book: 'Apocalipse',
      startCh: 8,
      endCh: 11,
      sampleRef: 'Apocalipse 11:15',
      sampleText: 'O reino do mundo se tornou de nosso Senhor e do seu Cristo, e ele reinará pelos séculos dos séculos.',
      insight: 'A história não caminha para o caos, mas para o triunfo eterno do Reino de Cristo.'
    },
    {
      day: 88,
      title: 'A Vitória sobre o Dragão e o Cântico dos Remidos',
      book: 'Apocalipse',
      startCh: 12,
      endCh: 15,
      sampleRef: 'Apocalipse 12:11',
      sampleText: 'Eles, pois, o venceram por causa do sangue do Cordeiro e por causa da palavra do testemunho que deram e, mesmo em face da morte, não amaram a própria vida.',
      insight: 'O sangue de Jesus nos confere autoridade e vitória definitiva sobre qualquer força inimiga.'
    },
    {
      day: 89,
      title: 'A Queda da Babilônia e as Bodas do Cordeiro',
      book: 'Apocalipse',
      startCh: 16,
      endCh: 18,
      sampleRef: 'Apocalipse 19:6-7',
      sampleText: 'Aleluia! Pois reina o Senhor, nosso Deus, o Todo-Poderoso. Alegremo-nos, exultemos e demos-lhe a glória, porque são chegadas as bodas do Cordeiro.',
      insight: 'O banquete da vitória de Deus está preparado; nossa fidelidade será ricamente recompensada.'
    },
    {
      day: 90,
      title: 'Novos Céus, Nova Terra e o Rio da Água da Vida',
      book: 'Apocalipse',
      startCh: 19,
      endCh: 22,
      sampleRef: 'Apocalipse 21:3-4',
      sampleText: 'Eis o tabernáculo de Deus com os homens. Deus habitará com eles. Eles serão povos de Deus, e Deus mesmo estará com eles. E lhes enxugará dos olhos toda lágrima, e a morte já não existirá, já não haverá luto, nem pranto, nem dor, porque as primeiras coisas passaram.',
      insight: 'Todas as lágrimas serão enxugadas pelo próprio Deus. O Alfa e o Ômega nos aguarda na Nova Jerusalém!'
    }
  ];

  return scheduleData.map((item) => {
    const chapters = createChapterList(item.book, item.startCh, item.endCh);
    if (item.extraChapters) {
      chapters.push(...item.extraChapters);
    }

    const passageRef = `${item.book} ${item.startCh}${item.endCh > item.startCh ? `-${item.endCh}` : ''}${
      item.extraChapters ? `, ${item.extraChapters.join(', ')}` : ''
    }`;

    return {
      day: item.day,
      week: Math.ceil(item.day / 7),
      title: item.title,
      chapters,
      passages: [
        {
          reference: item.sampleRef,
          text: item.sampleText
        }
      ],
      devotionalInsight: item.insight
    };
  });
}

// 365-Day Annual Bible Plan Generator
// Structured across 52 weeks covering Pentateuch, Historical, Wisdom, Major/Minor Prophets, Gospels, Epistles & Revelation
export function generateAnnualBiblePlanDays(): ReadingPlanDay[] {
  // 52 weeks canonical / balanced tracks
  const weeklyStructure: Array<{
    week: number;
    otBook: string;
    otStart: number;
    otEnd: number;
    title: string;
    insight: string;
    sampleRef: string;
    sampleText: string;
    psalmStart: number;
  }> = [
    { week: 1, otBook: 'Gênesis', otStart: 1, otEnd: 24, title: 'Criação, Queda e o Chamado de Abraão', insight: 'Deus começa Sua maravilhosa história redentora chamando homens e mulheres para andar por fé.', sampleRef: 'Gênesis 12:1-3', sampleText: 'Ora, disse o Senhor a Abrão: Sai da tua terra... de ti farei uma grande nação, e te abençoarei... em ti serão benditas todas as famílias da terra.', psalmStart: 1 },
    { week: 2, otBook: 'Gênesis', otStart: 25, otEnd: 50, title: 'Os Patriarcas: Isaque, Jacó e José', insight: 'Mesmo o que homens intentaram para o mal, Deus orquestra para o bem supremo e salvação de muitos.', sampleRef: 'Gênesis 50:20', sampleText: 'Vós, na verdade, intentastes o mal contra mim; porém Deus o tornou em bem, para fazer, como vedes agora, que se conserve muita gente em vida.', psalmStart: 8 },
    { week: 3, otBook: 'Êxodo', otStart: 1, otEnd: 20, title: 'O Clamor dos Cativos, as Pragas e a Páscoa', insight: 'O sangue do cordeiro nos umbrais liberta o povo; Deus é o nosso Libertador invencível.', sampleRef: 'Êxodo 14:13-14', sampleText: 'Moisés, porém, disse ao povo: Não temais; aquietai-vos e vede o livramento do Senhor que, hoje, vos fará... O Senhor pelejará por vós, e vós vos calareis.', psalmStart: 15 },
    { week: 4, otBook: 'Êxodo', otStart: 21, otEnd: 40, title: 'A Lei no Sinai e o Tabernáculo da Glória', insight: 'Deus deseja habitar no meio do Seu povo; Sua santidade nos convoca à adoração pura.', sampleRef: 'Êxodo 33:14-15', sampleText: 'Respondeu-lhe: A minha presença irá contigo, e eu te darei descanso. Então, lhe disse Moisés: Se a tua presença não vai comigo, não nos faças subir deste lugar.', psalmStart: 22 },
    { week: 5, otBook: 'Levítico', otStart: 1, otEnd: 27, title: 'Santidade e Sacrifícios Agradáveis a Deus', insight: 'A santidade do Senhor requer reverência, e o Dia do Perdão aponta diretamente para a cruz de Cristo.', sampleRef: 'Levítico 19:2', sampleText: 'Fala a toda a congregação dos filhos de Israel e dize-lhes: Santos sereis, porque eu, o Senhor, vosso Deus, sou santo.', psalmStart: 29 },
    { week: 6, otBook: 'Números', otStart: 1, otEnd: 21, title: 'A Jornada no Deserto e a Nuvem de Glória', insight: 'Mesmo quando fraquejamos na murmuração, a fidelidade de Deus nos conduz dia e noite.', sampleRef: 'Números 6:24-26', sampleText: 'O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto e te dê a paz.', psalmStart: 36 },
    { week: 7, otBook: 'Números', otStart: 22, otEnd: 36, title: 'Profecias de Balaão e a Nova Geração', insight: 'Nenhuma maldição pode prevalecer contra o povo que o próprio Deus declarou abençoado.', sampleRef: 'Números 23:19', sampleText: 'Deus não é homem, para que minta; nem filho de homem, para que se arrependa. Porventura, diria ele e não o faria? Ou falaria e não o cumpriria?', psalmStart: 43 },
    { week: 8, otBook: 'Deuteronômio', otStart: 1, otEnd: 18, title: 'Ouve, ó Israel: Amar a Deus de Todo o Coração', insight: 'Amar a Deus sobre todas as coisas e guardar Seus preceitos é a fonte de toda prosperidade espiritual.', sampleRef: 'Deuteronômio 6:4-5', sampleText: 'Ouve, Israel, o Senhor, nosso Deus, é o único Senhor. Amarás, pois, o Senhor, teu Deus, de todo o teu coração, de toda a tua alma e de toda a tua força.', psalmStart: 50 },
    { week: 9, otBook: 'Deuteronômio', otStart: 19, otEnd: 34, title: 'Bênçãos da Obediência e a Morte de Moisés', insight: 'Deus coloca diante de nós a vida e a bênção; escolher a obediência é escolher viver plenamente.', sampleRef: 'Deuteronômio 30:19', sampleText: 'Os céus e a terra tomo, hoje, por testemunhas contra ti, que te propus a vida e a morte, a bênção e a maldição; escolhe, pois, a vida, para que vivas, tu e a tua descendência.', psalmStart: 57 },
    { week: 10, otBook: 'Josué', otStart: 1, otEnd: 24, title: 'Sê Forte e Corajoso: Conquistando a Terra Prometida', insight: 'Não temas nem te espantes, pois o Senhor teu Deus está contigo por onde quer que andares.', sampleRef: 'Josué 1:8-9', sampleText: 'Não cesses de falar deste Livro da Lei; antes, medita nele dia e noite... Não to mandei eu? Sê forte e corajoso; não temas, nem te desanimes, porque o Senhor, teu Deus, é contigo.', psalmStart: 64 },
    { week: 11, otBook: 'Juízes & Rute', otStart: 1, otEnd: 21, title: 'Libertadores em Tempos de Crise e a Redenção de Rute', insight: 'Nos dias mais escuros da desobediência, a graça de Deus levanta socorro e resgata os fiéis.', sampleRef: 'Rute 1:16-17', sampleText: 'Disse, porém, Rute: Não me instes para que te deixe e me afaste de ti; porque, aonde quer que tu fores, irei eu... o teu povo é o meu povo, o teu Deus é o meu Deus.', psalmStart: 71 },
    { week: 12, otBook: '1 Samuel', otStart: 1, otEnd: 15, title: 'A Oração de Ana e o Chamado do Jovem Samuel', insight: 'A oração humilde de uma mãe comovida move o coração de Deus e gera um profeta para a nação.', sampleRef: '1 Samuel 2:1-2', sampleText: 'O meu coração se regozija no Senhor, a minha força está exaltada no Senhor... Não há santo como é o Senhor; porque não há outro além de ti.', psalmStart: 78 },
    { week: 13, otBook: '1 Samuel', otStart: 16, otEnd: 31, title: 'Davi e Golias: O Coração que Deus Procura', insight: 'O homem vê a aparência exterior, mas o Senhor contempla e valoriza o coração sincero.', sampleRef: '1 Samuel 16:7', sampleText: 'Porém o Senhor disse a Samuel: Não atentes para a sua aparência, nem para a sua grande estatura... porque o homem vê o que está diante dos olhos, porém o Senhor olha para o coração.', psalmStart: 85 },
    { week: 14, otBook: '2 Samuel', otStart: 1, otEnd: 24, title: 'O Reinado de Davi e a Aliança Messiânica', insight: 'Mesmo em meio a tropeços e arrependimento profundo, Deus firma Sua aliança eterna com Davi.', sampleRef: '2 Samuel 7:16', sampleText: 'A tua casa e o teu reino serão firmados para sempre diante de ti; o teu trono será estabelecido para todo o sempre.', psalmStart: 92 },
    { week: 15, otBook: '1 Reis', otStart: 1, otEnd: 11, title: 'A Sabedoria de Salomão e a Glória do Templo', insight: 'A sabedoria que vem do alto supera todas as riquezas e palácios deste mundo.', sampleRef: '1 Reis 3:9', sampleText: 'Dá, pois, ao teu servo coração compreensivo para julgar a teu povo, para que prudentemente discirna entre o bem e o mal.', psalmStart: 99 },
    { week: 16, otBook: '1 Reis', otStart: 12, otEnd: 22, title: 'Elias no Monte Carmelo: O Deus que Responde com Fogo', insight: 'O Senhor é o verdadeiro Deus! O sussurro suave da presença divina renova os cansados.', sampleRef: '1 Reis 18:39', sampleText: 'O que vendo todo o povo, caiu de rosto em terra e disse: O Senhor é Deus! O Senhor é Deus!', psalmStart: 106 },
    { week: 17, otBook: '2 Reis', otStart: 1, otEnd: 13, title: 'Eliseu e a Porção Dobrada do Espírito', insight: 'Os olhos da fé enxergam cavalos e carros de fogo ao redor dos servos de Deus.', sampleRef: '2 Reis 6:16-17', sampleText: 'Ele respondeu: Não temas, porque mais são os que estão conosco do que os que estão com eles. E orou Eliseu e disse: Senhor, peço-te que lhe abras os olhos para que veja.', psalmStart: 113 },
    { week: 18, otBook: '2 Reis', otStart: 14, otEnd: 25, title: 'O Avivamento de Josias e o Cativeiro da Babilônia', insight: 'Quando a Palavra de Deus é reencontrada e obedecida, o arrependimento traz renovo espiritual.', sampleRef: '2 Reis 22:19', sampleText: 'Porquanto o teu coração se enterneceu, e te humilhaste perante o Senhor... eu também te ouvi, diz o Senhor.', psalmStart: 120 },
    { week: 19, otBook: '1 Crônicas', otStart: 1, otEnd: 29, title: 'A Adoração Contínua e a Oração de Jabez', insight: 'A adoração no templo e as genealogias mostram que Deus nunca esquece nenhum dos Seus filhos.', sampleRef: '1 Crônicas 29:11-12', sampleText: 'Tua é, Senhor, a magnificência, o poder, a glória, a vitória e a majestade; porque teu é tudo quanto há nos céus e na terra; teu, Senhor, é o reino.', psalmStart: 127 },
    { week: 20, otBook: '2 Crônicas', otStart: 1, otEnd: 20, title: 'Se o Meu Povo Orar: A Batalha Pertence ao Senhor', insight: 'A humilhação e a oração do povo atraem a cura e o socorro celestial para a terra.', sampleRef: '2 Crônicas 7:14', sampleText: 'Se o meu povo, que se chama pelo meu nome, se humilhar, e orar, e me buscar, e se converter dos seus maus caminhos, então, eu ouvirei dos céus, perdoarei os seus pecados e sararei a sua terra.', psalmStart: 134 },
    { week: 21, otBook: '2 Crônicas', otStart: 21, otEnd: 36, title: 'Reformas Espirituais e o Decreto de Restauração', insight: 'Deus move reis e impérios para garantir que Seu remanescente volte para adorá-Lo.', sampleRef: '2 Crônicas 30:9', sampleText: 'Porque o Senhor, vosso Deus, é misericordioso e compassivo e não desviará de vós o rosto, se vos converterdes a ele.', psalmStart: 141 },
    { week: 22, otBook: 'Esdras & Neemias', otStart: 1, otEnd: 23, title: 'Reconstruindo os Muros com Espada e Colher', insight: 'A alegria do Senhor é a nossa força inabalável para reconstruir o que foi destruído.', sampleRef: 'Neemias 8:10', sampleText: 'Não vos entristeçais, porque a alegria do Senhor é a vossa força.', psalmStart: 148 },
    { week: 23, otBook: 'Ester', otStart: 1, otEnd: 10, title: 'Para um Tempo como Este: A Providência Invisível de Deus', insight: 'Mesmo quando o nome de Deus não é explicitamente mencionado, Sua mão invisível guia cada detalhe da história.', sampleRef: 'Ester 4:14', sampleText: 'E quem sabe se para conjuntura como esta é que foste elevada a rainha?', psalmStart: 1 },
    { week: 24, otBook: 'Jó', otStart: 1, otEnd: 21, title: 'Fé em Meio à Provação Extrema e Sofrimento', insight: 'Mesmo perdendo tudo, Jó adora: Deus é digno de louvor tanto na abundância quanto na perda.', sampleRef: 'Jó 1:21', sampleText: 'O Senhor o deu e o Senhor o tomou; bendito seja o nome do Senhor!', psalmStart: 8 },
    { week: 25, otBook: 'Jó', otStart: 22, otEnd: 42, title: 'Eu Sei que o Meu Redentor Vive', insight: 'Eu te conhecia só de ouvir, mas agora os meus olhos Te veem: Deus restaura e consola.', sampleRef: 'Jó 19:25', sampleText: 'Porque eu sei que o meu Redentor vive e por fim se levantará sobre a terra.', psalmStart: 15 },
    { week: 26, otBook: 'Salmos', otStart: 1, otEnd: 41, title: 'Livro I dos Salmos: Louvor, Lamento e Confiança', insight: 'O Senhor é o meu pastor; nos pastos verdejantes Ele refrigera as nossas almas.', sampleRef: 'Salmo 23:1-3', sampleText: 'O Senhor é o meu pastor; nada me faltará. Ele me faz repousar em pastos verdejantes. Leva-me para junto das águas de descanso; refrigera a minha alma.', psalmStart: 23 },
    { week: 27, otBook: 'Salmos', otStart: 42, otEnd: 72, title: 'Livro II dos Salmos: Como a Corça Suspira pelas Águas', insight: 'Deus é o nosso refúgio e fortaleza, socorro bem presente nas tribulações.', sampleRef: 'Salmo 46:1-2', sampleText: 'Deus é o nosso refúgio e fortaleza, socorro bem presente nas tribulações. Portanto, não temeremos ainda que a terra se transtorne.', psalmStart: 46 },
    { week: 28, otBook: 'Salmos', otStart: 73, otEnd: 89, title: 'Livro III dos Salmos: Fidelidade Através das Gerações', insight: 'Quem tenho eu no céu além de Ti? E na terra não há quem eu deseje além da Tua presença.', sampleRef: 'Salmo 73:25-26', sampleText: 'Quem tenho eu no céu além de ti? E na terra nada mais desejo além de estar junto a ti. A minha carne e o meu coração esmorecem, mas Deus é a fortaleza do meu coração.', psalmStart: 73 },
    { week: 29, otBook: 'Salmos', otStart: 90, otEnd: 106, title: 'Livro IV dos Salmos: Sob a Sombra do Onipotente', insight: 'Aquele que habita no esconderijo do Altíssimo descansa seguro debaixo de Suas asas.', sampleRef: 'Salmo 91:1-2', sampleText: 'O que habita no esconderijo do Altíssimo e descansa à sombra do Onipotente diz ao Senhor: Meu refúgio e meu baluarte, Deus meu, em quem confio.', psalmStart: 91 },
    { week: 30, otBook: 'Salmos', otStart: 107, otEnd: 150, title: 'Livro V dos Salmos: Tudo Quanto Tem Fôlego Louve ao Senhor', insight: 'Lâmpada para os meus pés é a Tua palavra e luz para o meu caminho; aleluia!', sampleRef: 'Salmo 119:105', sampleText: 'Lâmpada para os meus pés é a tua palavra e, luz para os meus caminhos.', psalmStart: 119 },
    { week: 31, otBook: 'Provérbios', otStart: 1, otEnd: 15, title: 'O Temor do Senhor: Princípio da Sabedoria Prática', insight: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.', sampleRef: 'Provérbios 3:5-6', sampleText: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.', psalmStart: 1 },
    { week: 32, otBook: 'Provérbios', otStart: 16, otEnd: 31, title: 'Caminhos de Honra, Paz e a Mulher Virtuosa', insight: 'Confia ao Senhor as tuas obras e os teus planos serão bem-sucedidos.', sampleRef: 'Provérbios 16:3', sampleText: 'Confia ao Senhor as tuas obras, e os teus desígnios serão estabelecidos.', psalmStart: 16 },
    { week: 33, otBook: 'Eclesiastes & Cantares', otStart: 1, otEnd: 20, title: 'Tudo tem o Seu Tempo e a Beleza do Amor', insight: 'Tudo fez Deus formoso no seu devido tempo; o dever do homem é temer a Deus e guardar Seus mandamentos.', sampleRef: 'Eclesiastes 3:1', sampleText: 'Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.', psalmStart: 25 },
    { week: 34, otBook: 'Isaías', otStart: 1, otEnd: 20, title: 'Santo, Santo, Santo: O Chamado do Profeta', insight: 'Eis-me aqui, envia-me a mim! O Senhor purifica os lábios e renova a vocação do discípulo.', sampleRef: 'Isaías 6:8', sampleText: 'Depois disto, ouvi a voz do Senhor, que dizia: A quem enviarei, e quem há de ir por nós? Disse eu: eis-me aqui, envia-me a mim.', psalmStart: 32 },
    { week: 35, otBook: 'Isaías', otStart: 21, otEnd: 39, title: 'Emanuel, Príncipe da Paz e a Confiança Firme', insight: 'Tu, Senhor, guardarás em perfeita paz aquele cujo propósito está firme em Ti.', sampleRef: 'Isaías 26:3', sampleText: 'Tu, Senhor, conservarás em perfeita paz aquele cujo propósito é firme; porque ele confia em ti.', psalmStart: 40 },
    { week: 36, otBook: 'Isaías', otStart: 40, otEnd: 55, title: 'Consolai o Meu Povo: O Servo Sofredor', insight: 'Ele foi traspassado pelas nossas transgressões e moído pelas nossas iniquidades; pelas Suas pisaduras fomos sarados.', sampleRef: 'Isaías 53:5', sampleText: 'Mas ele foi traspassado pelas nossas transgressões e moído pelas nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.', psalmStart: 51 },
    { week: 37, otBook: 'Isaías', otStart: 56, otEnd: 66, title: 'A Glória da Nova Criação e o Ano da Graça', insight: 'Levanta-te, resplandece, porque já vem a tua luz, e a glória do Senhor nasce sobre ti.', sampleRef: 'Isaías 60:1', sampleText: 'Levanta-te, resplandece, porque já vem a tua luz, e a glória do Senhor está nascendo sobre ti.', psalmStart: 62 },
    { week: 38, otBook: 'Jeremias', otStart: 1, otEnd: 25, title: 'O Profeta das Nações e a Fonte de Águas Vivas', insight: 'Antes que te formasse no ventre materno, eu te conheci e te consagrei profeta.', sampleRef: 'Jeremias 1:5', sampleText: 'Antes que eu te formasse no ventre materno, eu te conheci, e, antes que saísses da madre, te consagrei, e te constituí profeta às nações.', psalmStart: 72 },
    { week: 39, otBook: 'Jeremias', otStart: 26, otEnd: 52, title: 'Pensamentos de Paz e a Nova Aliança Gravada no Coração', insight: 'Eu sei que pensamentos tenho a vosso respeito: pensamentos de paz e não de mal, para vos dar um futuro e uma esperança.', sampleRef: 'Jeremias 29:11-13', sampleText: 'Eu é que sei que pensamentos tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que desejais. Então, me invocareis, passareis a orar a mim, e eu vos ouvirei.', psalmStart: 84 },
    { week: 40, otBook: 'Lamentações & Ezequiel', otStart: 1, otEnd: 20, title: 'As Misericórdias se Renovam a Cada Manhã', insight: 'Grande é a Tua fidelidade: as misericórdias do Senhor são a causa de não sermos consumidos.', sampleRef: 'Lamentações 3:22-23', sampleText: 'As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã. Grande é a tua fidelidade.', psalmStart: 90 },
    { week: 41, otBook: 'Ezequiel', otStart: 21, otEnd: 48, title: 'O Vale de Ossos Secos e o Novo Coração de Carne', insight: 'Dar-vos-ei coração novo e porei dentro de vós espírito novo; tirarei o coração de pedra e vos darei coração de carne.', sampleRef: 'Ezequiel 36:26', sampleText: 'Dar-vos-ei coração novo e porei dentro de vós espírito novo; tirarei de vós o coração de pedra e vos darei coração de carne.', psalmStart: 103 },
    { week: 42, otBook: 'Daniel', otStart: 1, otEnd: 12, title: 'Fidelidade na Babilônia e a Cova dos Leões', insight: 'O Deus Altíssimo tem domínio sobre o reino dos homens e socorre os que Nele confiam.', sampleRef: 'Daniel 6:26-27', sampleText: 'Porque ele é o Deus vivo e para sempre permanente; o seu reino não será destruído, e o seu domínio não terá fim. Ele livra e salva, e opera sinais e maravilhas.', psalmStart: 110 },
    { week: 43, otBook: 'Oséias a Amós', otStart: 1, otEnd: 25, title: 'O Amor Incondicional de Deus e Justiça como Rios', insight: 'Conheçamos e prossigamos em conhecer ao Senhor; como a alva, a Sua vinda é certa.', sampleRef: 'Oséias 6:3', sampleText: 'Conheçamos e prossigamos em conhecer ao Senhor; como a alva, a sua vinda é certa; e ele descerá sobre nós como a chuva, como chuva serôdia que rega a terra.', psalmStart: 118 },
    { week: 44, otBook: 'Jonas a Malaquias', otStart: 1, otEnd: 25, title: 'Miqueias, Habacuque e a Estrela da Alva', insight: 'O justo viverá pela sua fé; ainda que a figueira não floresça, eu me alegrarei no Deus da minha salvação.', sampleRef: 'Habacuque 3:17-18', sampleText: 'Ainda que a figueira não floresça, nem haja fruto na vide... todavia, eu me alegrarei no Senhor, exultarei no Deus da minha salvação.', psalmStart: 126 },
    { week: 45, otBook: 'Mateus', otStart: 1, otEnd: 28, title: 'O Messias Prometido e o Sermão da Montanha', insight: 'Jesus é o Rei que veio servir e salvar; Nele encontramos o sentido supremo de toda a Escritura.', sampleRef: 'Mateus 5:16', sampleText: 'Assim brilhe também a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai que está nos céus.', psalmStart: 133 },
    { week: 46, otBook: 'Marcos & Lucas 1-12', otStart: 1, otEnd: 28, title: 'O Evangelho em Ação e o Filho do Homem', insight: 'O Filho do Homem veio buscar e salvar o que estava perdido.', sampleRef: 'Lucas 12:31-32', sampleText: 'Buscai, antes de tudo, o seu reino, e estas coisas vos serão acrescentadas. Não temais, ó pequenino rebanho; porque vosso Pai se agradou em dar-vos o seu reino.', psalmStart: 139 },
    { week: 47, otBook: 'Lucas 13-24 & João 1-10', otStart: 1, otEnd: 22, title: 'O Bom Pastor e a Vitória na Ressurreição', insight: 'Eu vim para que tenham vida e a tenham em abundância; Ele nos resgata do abismo.', sampleRef: 'João 10:10', sampleText: 'O ladrão vem apenas para roubar, matar e destruir; eu vim para que tenham vida e a tenham em abundância.', psalmStart: 145 },
    { week: 48, otBook: 'João 11-21 & Atos 1-14', otStart: 1, otEnd: 25, title: 'A Videira Verdadeira e o Fogo de Pentecostes', insight: 'Recebereis poder e sereis minhas testemunhas em toda a terra; Cristo está conosco!', sampleRef: 'Atos 1:8', sampleText: 'Mas recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra.', psalmStart: 1 },
    { week: 49, otBook: 'Atos 15-28 & Romanos', otStart: 1, otEnd: 30, title: 'A Expansão da Fé e a Justificação pela Graça', insight: 'Se Deus é por nós, quem será contra nós? Em Cristo somos mais do que vencedores.', sampleRef: 'Romanos 8:31-32', sampleText: 'Que diremos, pois, à vista destas coisas? Se Deus é por nós, quem será contra nós? Aquele que não poupou o seu próprio Filho, antes, por todos nós o entregou.', psalmStart: 23 },
    { week: 50, otBook: '1 & 2 Coríntios & Gálatas', otStart: 1, otEnd: 35, title: 'O Hino ao Amor e a Liberdade Espiritual', insight: 'O amor nunca falha; fostes chamados para a liberdade de servir uns aos outros em amor.', sampleRef: '1 Coríntios 13:13', sampleText: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três; porém o maior destes é o amor.', psalmStart: 46 },
    { week: 51, otBook: 'Epístolas Paulinas & Gerais', otStart: 1, otEnd: 40, title: 'A Armadura da Fé, Hebreus e a Esperança Viva', insight: 'Corramos com perseverança a carreira que nos está proposta, olhando para Jesus.', sampleRef: 'Hebreus 12:2', sampleText: 'Olhando firmemente para o Autor e Consumador da fé, Jesus, o qual, em troca da alegria que lhe estava proposta, suportou a cruz.', psalmStart: 91 },
    { week: 52, otBook: 'Epístolas de João & Apocalipse', otStart: 1, otEnd: 28, title: 'A Nova Jerusalém e o Triunfo Eterno do Cordeiro', insight: 'Maranata! O Senhor enxugará toda lágrima dos nossos olhos e habitará para sempre conosco.', sampleRef: 'Apocalipse 22:20-21', sampleText: 'Aquele que dá testemunho destas coisas diz: Certamente, venho sem demora. Amém! Vem, Senhor Jesus! A graça do Senhor Jesus seja com todos.', psalmStart: 150 }
  ];

  const days: ReadingPlanDay[] = [];
  let currentDay = 1;

  for (const w of weeklyStructure) {
    // 7 days per week
    const totalChaptersInWeek = w.otEnd - w.otStart + 1;
    const chaptersPerDay = Math.max(1, Math.ceil(totalChaptersInWeek / 7));

    for (let dayInWeek = 1; dayInWeek <= 7; dayInWeek++) {
      if (currentDay > 365) break;

      const chStart = w.otStart + (dayInWeek - 1) * chaptersPerDay;
      const chEnd = Math.min(w.otEnd, chStart + chaptersPerDay - 1);
      const actualChStart = Math.min(chStart, w.otEnd);
      const actualChEnd = Math.max(actualChStart, chEnd);

      const chapterList = createChapterList(w.otBook, actualChStart, actualChEnd);
      // add a psalm or proverb
      const psalmNum = ((w.psalmStart + dayInWeek - 2) % 150) + 1;
      chapterList.push(`Salmo ${psalmNum}`);

      const title = dayInWeek === 1 ? w.title : `${w.title} (Parte ${dayInWeek})`;

      days.push({
        day: currentDay,
        week: w.week,
        title,
        chapters: chapterList,
        passages: [
          {
            reference: w.sampleRef,
            text: w.sampleText
          }
        ],
        devotionalInsight: w.insight
      });

      currentDay++;
    }
  }

  // Ensure full 365 days if any rounding gap
  while (days.length < 365) {
    const dayNum = days.length + 1;
    days.push({
      day: dayNum,
      week: 52,
      title: `Consagração e Meditação Final (Dia ${dayNum})`,
      chapters: ['Apocalipse 21', 'Apocalipse 22', 'Salmo 150'],
      passages: [
        {
          reference: 'Apocalipse 22:17',
          text: 'O Espírito e a noiva dizem: Vem! Aquele que ouve, diga: Vem! Aquele que tem sede venha, e quem quiser receba de graça a água da vida.'
        }
      ],
      devotionalInsight: 'A Palavra de Deus se cumpre plenamente: somos herdeiros da vida eterna junto ao trono do Cordeiro.'
    });
  }

  return days;
}
