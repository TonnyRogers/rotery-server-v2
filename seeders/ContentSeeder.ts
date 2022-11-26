import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { ContentList, ContentType } from '@/entities/content-list.entity';
import { GuideTourKeys } from '@/utils/enums';

export class ContentSeeder extends Seeder {
  private backpackerProfileGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-new.png',
      title: 'Adicionando Foto',
      content:
        'Clique no botão de alterar imagem e selecione sua foto estilosa. 📸',
      key: GuideTourKeys.BACKPACKER_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-new1.png',
      title: 'Preenchendo seus dados',
      content:
        'É muito importante saber quem é você de verdade, por isso seja sincero ao preencher seu perfil.',
      key: GuideTourKeys.BACKPACKER_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-backpacker.png',
      title: 'Assinatura',
      content:
        'Assinando o plano para mochileiros você tem mais vantagens saiba mais clicando aqui. (a assinatura não é obrigatória mas te da acesso a mais funcionalidades)',
      key: GuideTourKeys.BACKPACKER_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-backpacker2.png',
      title: 'Acessar Carteira',
      content: 'Aqui você pode cadastrar e gerenciar seus cartões.',
      key: GuideTourKeys.BACKPACKER_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private guideProfileGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-new.png',
      title: 'Adicionando Foto',
      content:
        'Clique no botão de alterar imagem e selecione sua foto estilosa. 📸',
      key: GuideTourKeys.GUIDE_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-profile-new1.png',
      title: 'Preenchendo seus dados',
      content:
        'É muito importante saber quem é você de verdade, por isso seja sincero ao preencher seu perfil.',
      key: GuideTourKeys.GUIDE_PROFILE,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private backpackerSubscriptionsGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-host-subscription-statuses.webp',
      title: 'Status da assinatura',
      content:
        'Você pode acompanhar os status da sua assinatura aqui, cada um deles libera uma acão.',
      key: GuideTourKeys.BACKPACKER_SUBSCRIPTION,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-host-subscription-pending.webp',
      title: 'Status pendente',
      content:
        'Aqui você precisa aguardar o processamento do pagamento para liberar sua assinatura.',
      key: GuideTourKeys.BACKPACKER_SUBSCRIPTION,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-host-subscription-cancel.webp',
      title: 'Status ativo',
      content:
        'Neste caso, esta tudo certo, mas você pode solicitar o cancelamento da assinatura.',
      key: GuideTourKeys.BACKPACKER_SUBSCRIPTION,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-host-subscription-alter-card.webp',
      title: 'Status sem pagamento',
      content:
        'Aqui você vai poder trocar o seu cartão caso haja algo de errado com a cobrança.',
      key: GuideTourKeys.BACKPACKER_SUBSCRIPTION,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private homeCarousel: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/rotery-banner.jpg',
      title: 'App Lançado:',
      content:
        'Chegou a hora de você voar com a gente! Cadastre-se ja e nos ajude a criar um app incrivel.',
      type: ContentType.LOGIN_LIST,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/rotery-montanha.jpg',
      title: 'Sobre a Rotery:',
      content:
        'Nossa missão é criar uma comunidade de aventureiros e facilitar o acesso a atividades radicais e o cuidado com a natureza.',
      type: ContentType.LOGIN_LIST,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/rotery-defender.jpg',
      title: 'Nos Apoie:',
      content:
        'Queremos criar a melhor plataforma para viajantes, de forma independênte, nos apoie no APOIA-SE.',
      type: ContentType.LOGIN_LIST,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private revenuesGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-revenues1.png',
      title: 'Tela de faturamento',
      content:
        'Aqui você pode acompanhar as contribuições enviadas pelos mochileiros que você ajudou.',
      key: GuideTourKeys.REVENUES,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-revenues2.png',
      title: 'Dia de Trânsferencia',
      content:
        'Essa data é o dia de corte em que vamos limitar para tranferir o valor acomualdo (desse dia até o primeiro do mês), você pode cadastra-lo na tela de configurações de faturamento.',
      key: GuideTourKeys.REVENUES,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-revenues-config.png',
      title: 'Configurando dia de pagamento',
      content:
        'Para receber pelo app você precisa cadastrar seus dados bancários e definir uma data de corte (data da transferência).',
      key: GuideTourKeys.REVENUES,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-revenues-reqeust-help1.png',
      title: 'Ajuda com movimentação 1/2',
      content: 'Caso haja algum problema você pode solicitar ajuda pelo app.',
      key: GuideTourKeys.REVENUES,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-revenues-reqeust-help2.png',
      title: 'Ajuda com movimentação 2/2',
      content:
        'Detalhe o problema e logo em seguida vamos te contactar por e-mail ou telefone, lembrando que o limite de caracteres é de 255.',
      key: GuideTourKeys.REVENUES,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private subscriptionGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-checkout-new1.png',
      title: 'Selecionando Cartão 1/2',
      content: 'Selecione sua forma de pagamento clicando aqui.',
      key: GuideTourKeys.SUBSCRIPTION_CHECKOUT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-checkout-new2.png',
      title: 'Selecionando Cartão 2/2',
      content:
        'Após isso seus cartões cadastrados serão listados aqui, caso não tenha nenhum adicione clicando aqui e preenchendo os dados.',
      key: GuideTourKeys.SUBSCRIPTION_CHECKOUT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-itinerary-payment-2.webp',
      title: 'Confirmando Pagamento',
      content:
        'Após selecionar o cartão e código você verá o botão de pagamento ficar ativo.',
      key: GuideTourKeys.SUBSCRIPTION_CHECKOUT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private guideChatGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-guide.png',
      title: 'Chats 1/3',
      content:
        'Aqui você tem a listagem de todos os seus chats, clicando em algum deles você será direcionado para a conversa com o mochileiro, seja respeitoso 😇.',
      key: GuideTourKeys.GUIDE_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-finish.png',
      title: 'Chats 2/3',
      content:
        'Apenas os mochileiros podem iniciar um chat mas você pode finaliza-lo caso o assunto se encerre, procure se limitar apenas por informações do local em que foi solicitado tirar duvidas.',
      key: GuideTourKeys.GUIDE_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-finish-alert.png',
      title: 'Chats 3/3',
      content:
        'Ao finalizar o chat (por você ou pelo mochileiro) será solicitado para ele avaliar como tudo correu e ele pode contribuir com você doando algum valor como agradecimento.',
      key: GuideTourKeys.GUIDE_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private backpackerChatGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-backpacker.png',
      title: 'Chats 1/3',
      content:
        'Aqui você tem a listagem de todos os seus chats, clicando em algum deles você será direcionado para a conversa com o guia, seja respeitoso 😇. Você só pode inicar um chat a partir de um local que deseja tirar duvidas.',
      key: GuideTourKeys.BACKPACKER_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-finish.png',
      title: 'Chats 2/3',
      content:
        'Quando sua duvida for exclarecida você deve finalizar o chat (o guia pode fazer isso também), depois disso você irá avaliar o guia e poderá retribuir com algum valor que vai para ele.',
      key: GuideTourKeys.BACKPACKER_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-chats-finish-alert.png',
      title: 'Chats 3/3',
      content:
        'Os chats são limitados na versão gratuita (1 por mês), caso queira chats ilimitados você pode assinar o plano para mochileiros 🚀.',
      key: GuideTourKeys.BACKPACKER_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private exploreLocationGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-explore-location-1.png',
      title: 'Exporando Locais 1/2',
      content:
        'Nessa tela você pode fazer uma pré seleção dos locais que você deseja ver a seguir, filtrando por atividade, região do Brasil e outros...',
      key: GuideTourKeys.EXPLORE_LOCATIONS,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-explore-location-2.png',
      title: 'Exporando Locais 2/2',
      content:
        'Depois da pré seleção você vai poder ver o feed de locais, além do filtro da pré seleção ainda é possivel adicionar outros filtros deixando sua pesquisa mais objetiva, basta clicar aqui.',
      key: GuideTourKeys.EXPLORE_LOCATIONS,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private guideLocationDetailGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-1.png',
      title: 'Detalhes do local',
      content:
        'Essas são as caracteristicas deste local e auxiliam os mochileiros no momento de escolher o próximo local para descobrir.',
      key: GuideTourKeys.GUIDE_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-guide-1.png',
      title: 'Vincular local a você',
      content:
        'Clicando aqui você se vincula a ele e os mochileiros vão poder entrar em contato com você através daqui, por isso selecione apenas o locais que você tem experiência e domínio.',
      key: GuideTourKeys.GUIDE_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-ratings.png',
      title: 'Avaliações',
      content:
        'Com base na experiência que tiveram com guias e com o local os mochileiros deixam sua avaliação sobre este local e isso pode ajudar outros na hora de decidir.',
      key: GuideTourKeys.GUIDE_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private backpackerLocationDetailGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-1.png',
      title: 'Detalhes do local',
      content:
        'Essas são as caracteristicas deste local e auxiliam os mochileiros no momento de escolher o próximo local para descobrir.',
      key: GuideTourKeys.BACKPACKER_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-backpacker-1.png',
      title: 'Guias',
      content:
        'Você pode escolher um dos guias digitais para te auxiliar sobre este local, dando dicas, melhores rotas, e etc... considere a nota de outros mochileiros ao escolher.',
      key: GuideTourKeys.BACKPACKER_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-ratings.png',
      title: 'Avaliações',
      content:
        'Com base na experiência que tiveram com guias e com o local os mochileiros deixam sua avaliação sobre este local e isso pode ajudar outros na hora de decidir.',
      key: GuideTourKeys.BACKPACKER_LOCATION_DETALING,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private guideWelcomeGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/rotery-montanha.webp',
      title: 'Bem-vindo(a)',
      content:
        'Olá! Vamos para uma breve explicação do que você pode fazer no app arrasta para a esquerda para ver as próximas dicas.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-guide-1.png',
      title: 'Complete seu perfil',
      content:
        'Adicione foto e seus dados para uma melhor experiência na comunidade.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-guide-2.png',
      title: 'Notificações',
      content:
        'Clique no sino para ver e então clique em uma das notificações para setar como lida, algumas notificações podem te redirecionar para uma nova tela.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-guide-3.png',
      title: 'Menu',
      content:
        'Aqui você pode navegar pelo app, assim que alguma nova funcionalidade for adicionada este guia deve aparecer novamente 😌.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-guide-4.png',
      title: 'Contribuições',
      content:
        'Suas interações com outros usuários vão ser contabilizadas aqui.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-firs-steps.png',
      title: 'Primeiros Passos',
      content:
        'Uma lista com terefas inicias para ingressar no mundo dos mochileiros digitais, tente completa-la antes de qualquer coisa 😉.',
      key: GuideTourKeys.GUIDE_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private backpackerWelcomeGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/rotery-montanha.webp',
      title: 'Bem-vindo(a)',
      content:
        'Olá! Vamos para uma breve explicação do que você pode fazer no app arrasta para a esquerda para ver as próximas dicas.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-backpacer-1.png',
      title: 'Complete seu perfil',
      content:
        'Adicione foto e seus dados para uma melhor experiência na comunidade.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-backpacer-2.png',
      title: 'Notificações',
      content:
        'Clique no sino para ver e então clique em uma das notificações para setar como lida, algumas notificações podem te redirecionar para uma nova tela.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-backpacer-3.png',
      title: 'Menu',
      content:
        'Aqui você pode navegar pelo app, assim que alguma nova funcionalidade for adicionada este guia deve aparecer novamente 😌.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-backpacer-4.png',
      title: 'Contribuições',
      content:
        'Suas interações com outros usuários vão ser contabilizadas aqui.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-welcome-firs-steps.png',
      title: 'Primeiros Passos',
      content:
        'Uma lista com terefas inicias para ingressar no mundo dos mochileiros digitais, tente completa-la antes de qualquer coisa 😉.',
      key: GuideTourKeys.BACKPACKER_WELCOME,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  private beginChatGuide: Partial<ContentList>[] = [
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-explore-location-1.png',
      title: 'Chat com Guias 1/3',
      content:
        'Para iniciar um chat é necessário selecionar um local que deseja ajuda de um guia.',
      key: GuideTourKeys.BEGIN_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-feed.png',
      title: 'Chat com Guias 2/3',
      content:
        'Vá para o feed de locais, selecione um e veja os guias relacionados.',
      key: GuideTourKeys.BEGIN_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
    {
      externalUrl:
        'https://rotery-filestore.nyc3.digitaloceanspaces.com/guides-location-details-backpacker-1.png',
      title: 'Chat com Guias 3/3',
      content:
        'Ao selecionar um deles as informações do local poderão ser enviadas para o guia e assim ele pode te responder com mais precisão.',
      key: GuideTourKeys.BEGIN_CHAT,
      type: ContentType.APP_GUIDED_TOUR,
      withInfo: true,
      isList: true,
      isAnimation: false,
    },
  ];

  async run(em: EntityManager): Promise<void> {
    for (const iterator of this.backpackerProfileGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.guideProfileGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.backpackerSubscriptionsGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.homeCarousel) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.revenuesGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.subscriptionGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.guideChatGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.backpackerChatGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.exploreLocationGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.guideLocationDetailGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.backpackerLocationDetailGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.guideWelcomeGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.backpackerWelcomeGuide) {
      em.create(ContentList, iterator);
    }

    for (const iterator of this.beginChatGuide) {
      em.create(ContentList, iterator);
    }

    em.create(ContentList, {
      title: 'Principais Destinos de Inverno',
      content: 'Veja os locais mais procurados nesta estação do ano...',
      isList: false,
      externalUrl:
        'https://images.ctfassets.net/hrltx12pl8hq/a2hkMAaruSQ8haQZ4rBL9/8ff4a6f289b9ca3f4e6474f29793a74a/nature-image-for-website.jpg',
      isAnimation: false,
      withInfo: true,
      type: ContentType.WELCOME_SEASON_BANNER,
    });
  }
}
