/**
 * UI string translations for all user-facing text.
 *
 * Usage:
 *   import { t } from './ui-strings.js';
 *   element.textContent = t('welcome.greeting');
 *
 * All keys are dot-separated paths into the locale objects below.
 */

import { getLocale } from './locale.js';

const strings = {
  en: {
    // Welcome / Help panel
    welcome: {
      greeting: 'What would you like to discover about emotions?',
      introBtn: 'Give me an intro to this tool',
      emotionsBtn: 'What are emotions?',
      helpBtn: 'How can emotions help me?',
    },

    // Windrose help icon
    help: {
      tooltip: 'Click for Help',
    },

    // Wisdom panel
    wisdom: {
      title: 'Emotional Wisdom',
      close: 'Close panel',
      inputPlaceholder: 'Ask about this feeling...',
      send: 'Send',
      privacyNotice: 'This conversation uses AI (Claude by Anthropic) to help you explore your emotions. Messages are not stored. This is not therapy.',
    },

    // Starter prompts
    starters: {
      feeling: "I'm feeling {emotion} right now \u2014 what might it be telling me?",
      relate: 'How do {emotion} and {fellow} relate?',
      need: 'Help me explore what need this connects to for me',
    },

    // HUD bar
    hud: {
      fellowMessengers: "{emotion}'s Fellow Messengers",
      explore: 'explore:',
    },

    // Entry hint
    entry: {
      hint: 'tap to explore',
    },

    // Chat
    chat: {
      turnLimit: "You've been doing wonderful exploration! If you'd like to go deeper, you might enjoy the book \u2014 emotionrules.com",
      error: 'Something went wrong. Please try again.',
    },

    // Subscription gate
    subscription: {
      title: 'Continue Exploring',
      copy: 'Enter your name and email to unlock unlimited exploration of the Emotion Constellation.',
      firstName: 'First name',
      email: 'Email',
      country: 'Country',
      submit: 'Unlock Full Access',
      consent: 'By submitting this form, you agree to receive email communications from Six Seconds. You can unsubscribe anytime. See our',
      privacyPolicy: 'Privacy Policy',
      successTitle: 'Access Granted',
      dismiss: 'Maybe later',
    },

    // Book credit (legacy, unused)
    book: {
      credit: 'From Emotion Rules by',
    },

    // Copyright line
    copyright: {
      line: '\u00a9 {author}, based on the book {book} | made with {tool}',
    },

    // About panel (opened from "About this App" copyright link)
    about: {
      btnLabel: 'About this App',
      p1: 'This app was created by Joshua Freedman \u0026 Claude to illustrate one of the key ideas in the book, {book}: There are no negative feelings \u2014 they\u2019re all messages from us, for us.',
      p2: 'The map shows six of the basic human needs (such as safety), and how various feelings can help us with those needs. Click around to explore, or ask Claude a question:',
      starter1: 'How does this map help me?',
      starter2: "What do you mean by \u2018there are no negative feelings\u2019?",
      starter3: 'What is Emotion Rules all about?',
    },

    // Language selector
    language: {
      label: 'Language',
    },
  },

  es: {
    welcome: {
      greeting: '\u00bfQu\u00e9 te gustar\u00eda descubrir sobre las emociones?',
      introBtn: 'Dame una introducci\u00f3n a esta herramienta',
      emotionsBtn: '\u00bfQu\u00e9 son las emociones?',
      helpBtn: '\u00bfC\u00f3mo pueden ayudarme las emociones?',
    },
    help: { tooltip: 'Haz clic para Ayuda' },
    wisdom: {
      title: 'Sabidur\u00eda Emocional',
      close: 'Cerrar panel',
      inputPlaceholder: 'Pregunta sobre esta emoci\u00f3n...',
      send: 'Enviar',
      privacyNotice: 'Esta conversaci\u00f3n usa IA (Claude de Anthropic) para ayudarte a explorar tus emociones. Los mensajes no se almacenan. Esto no es terapia.',
    },
    starters: {
      feeling: 'Estoy sintiendo {emotion} ahora mismo \u2014 \u00bfqu\u00e9 podr\u00eda estar dici\u00e9ndome?',
      relate: '\u00bfC\u00f3mo se relacionan {emotion} y {fellow}?',
      need: 'Ay\u00fadame a explorar qu\u00e9 necesidad conecta conmigo',
    },
    hud: {
      fellowMessengers: 'Compa\u00f1eros mensajeros de {emotion}',
      explore: 'explorar:',
    },
    entry: { hint: 'toca para explorar' },
    chat: {
      turnLimit: '\u00a1Has hecho una exploraci\u00f3n maravillosa! Si quieres profundizar, te puede gustar el libro \u2014 emotionrules.com',
      error: 'Algo sali\u00f3 mal. Por favor, int\u00e9ntalo de nuevo.',
    },
    subscription: {
      title: 'Contin\u00faa Explorando',
      copy: 'Ingresa tu nombre y correo para desbloquear la exploraci\u00f3n ilimitada de la Constelaci\u00f3n de Emociones.',
      firstName: 'Nombre',
      email: 'Correo electr\u00f3nico',
      country: 'Pa\u00eds',
      submit: 'Desbloquear Acceso Completo',
      consent: 'Al enviar este formulario, aceptas recibir comunicaciones por correo de Six Seconds. Puedes cancelar en cualquier momento. Ver nuestra',
      privacyPolicy: 'Pol\u00edtica de Privacidad',
      successTitle: 'Acceso Concedido',
      dismiss: 'Quiz\u00e1s m\u00e1s tarde',
    },
    book: { credit: 'De Emotion Rules por' },
    copyright: { line: '\u00a9 {author}, basado en el libro {book} | hecho con {tool}' },
    about: {
      btnLabel: 'Acerca de esta App',
      p1: 'Esta app fue creada por Joshua Freedman \u0026 Claude para ilustrar una de las ideas clave del libro {book}: No hay sentimientos negativos \u2014 todos son mensajes de nosotros, para nosotros.',
      p2: 'El mapa muestra seis de las necesidades humanas b\u00e1sicas (como la seguridad) y c\u00f3mo varios sentimientos pueden ayudarnos con esas necesidades. Haz clic para explorar, o hazle una pregunta a Claude:',
      starter1: '\u00bfC\u00f3mo me ayuda este mapa?',
      starter2: '\u00bfQu\u00e9 quieres decir con \u201cno hay sentimientos negativos\u201d?',
      starter3: '\u00bfDe qu\u00e9 trata Emotion Rules?',
    },
    language: { label: 'Idioma' },
  },

  ko: {
    welcome: {
      greeting: '\uac10\uc815\uc5d0 \ub300\ud574 \ubb34\uc5c7\uc744 \ubc1c\uacac\ud558\uace0 \uc2f6\uc73c\uc138\uc694?',
      introBtn: '\uc774 \ub3c4\uad6c\uc5d0 \ub300\ud574 \uc18c\uac1c\ud574 \uc8fc\uc138\uc694',
      emotionsBtn: '\uac10\uc815\uc774\ub780 \ubb34\uc5c7\uc778\uac00\uc694?',
      helpBtn: '\uac10\uc815\uc774 \uc5b4\ub5bb\uac8c \ub3c4\uc6c0\uc774 \ub420 \uc218 \uc788\ub098\uc694?',
    },
    help: { tooltip: '\ub3c4\uc6c0\ub9d0\uc744 \ud074\ub9ad\ud558\uc138\uc694' },
    wisdom: {
      title: '\uac10\uc815\uc758 \uc9c0\ud61c',
      close: '\ud328\ub110 \ub2eb\uae30',
      inputPlaceholder: '\uc774 \uac10\uc815\uc5d0 \ub300\ud574 \ubb3c\uc5b4\ubcf4\uc138\uc694...',
      send: '\ubcf4\ub0b4\uae30',
      privacyNotice: '\uc774 \ub300\ud654\ub294 AI(Anthropic\uc758 Claude)\ub97c \uc0ac\uc6a9\ud558\uc5ec \uac10\uc815 \ud0d0\uc0c9\uc744 \ub3d5\uc2b5\ub2c8\ub2e4. \uba54\uc2dc\uc9c0\ub294 \uc800\uc7a5\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \uc774\uac83\uc740 \uce58\ub8cc\uac00 \uc544\ub2d9\ub2c8\ub2e4.',
    },
    starters: {
      feeling: '\uc9c0\uae08 {emotion}\uc744(\ub97c) \ub290\ub07c\uace0 \uc788\uc5b4\uc694 \u2014 \ubb34\uc5c7\uc744 \ub9d0\ud574\uc8fc\uace0 \uc788\uc744\uae4c\uc694?',
      relate: '{emotion}\uacfc(\uc640) {fellow}\uc740(\ub294) \uc5b4\ub5bb\uac8c \uad00\ub828\ub418\ub098\uc694?',
      need: '\uc774\uac83\uc774 \uc5b4\ub5a4 \uc695\uad6c\uc640 \uc5f0\uacb0\ub418\ub294\uc9c0 \ud0d0\uc0c9\ud574 \uc8fc\uc138\uc694',
    },
    hud: {
      fellowMessengers: '{emotion}\uc758 \ub3d9\ub8cc \uba54\uc2e0\uc800',
      explore: '\ud0d0\uc0c9:',
    },
    entry: { hint: '\ud0d0\uc0c9\ud558\ub824\uba74 \ud0ed\ud558\uc138\uc694' },
    chat: {
      turnLimit: '\ub9c8\uc74c\uae0d\ud55c \ud0d0\uc0c9\uc744 \ud558\uc168\uc5b4\uc694! \ub354 \uae4a\uc774 \uc54c\uace0 \uc2f6\uc73c\uc2dc\ub2e4\uba74, \ucc45\uc744 \ucd94\ucc9c\ud574 \ub4dc\ub9bd\ub2c8\ub2e4 \u2014 emotionrules.com',
      error: '\ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.',
    },
    subscription: {
      title: '\uacc4\uc18d \ud0d0\uc0c9\ud558\uae30',
      copy: '\uac10\uc815 \uc740\ud558\uc758 \ubb34\uc81c\ud55c \ud0d0\uc0c9\uc744 \uc704\ud574 \uc774\ub984\uacfc \uc774\uba54\uc77c\uc744 \uc785\ub825\ud558\uc138\uc694.',
      firstName: '\uc774\ub984',
      email: '\uc774\uba54\uc77c',
      country: '\uad6d\uac00',
      submit: '\uc804\uccb4 \uc561\uc138\uc2a4 \uc7a0\uae08 \ud574\uc81c',
      consent: '\uc774 \uc591\uc2dd\uc744 \uc81c\ucd9c\ud558\uba74 Six Seconds\uc758 \uc774\uba54\uc77c \uc218\uc2e0\uc5d0 \ub3d9\uc758\ud569\ub2c8\ub2e4. \uc5b8\uc81c\ub4e0 \uad6c\ub3c5\uc744 \ucde8\uc18c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.',
      privacyPolicy: '\uac1c\uc778\uc815\ubcf4 \ubcf4\ud638\uc815\ucc45',
      successTitle: '\uc561\uc138\uc2a4 \uc2b9\uc778',
      dismiss: '\ub098\uc911\uc5d0',
    },
    book: { credit: 'Emotion Rules \uc800\uc790' },
    copyright: { line: '\u00a9 {author}, \ucc45 {book} \uae30\ubc18 | {tool}\ub85c \uc81c\uc791' },
    about: {
      btnLabel: '\uc774 \uc571\uc5d0 \ub300\ud558\uc5ec',
      p1: '\uc774 \uc571\uc740 Joshua Freedman\uacfc Claude\uac00 \ucc45 {book}\uc758 \ud575\uc2ec \uc544\uc774\ub514\uc5b4\ub97c \uc124\uba85\ud558\uae30 \uc704\ud574 \ub9cc\ub4e4\uc5c8\uc2b5\ub2c8\ub2e4: \ubd80\uc815\uc801\uc778 \uac10\uc815\uc740 \uc5c6\uc2b5\ub2c8\ub2e4 \u2014 \ubaa8\ub4e0 \uac10\uc815\uc740 \uc6b0\ub9ac\ub85c\ubd80\ud130, \uc6b0\ub9ac\ub97c \uc704\ud55c \uba54\uc2dc\uc9c0\uc785\ub2c8\ub2e4.',
      p2: '\uc9c0\ub3c4\ub294 \uc778\uac04\uc758 6\uac00\uc9c0 \uae30\ubcf8 \uc695\uad6c(\uc548\uc804 \ub4f1)\uc640 \ub2e4\uc591\ud55c \uac10\uc815\uc774 \uadf8 \uc695\uad6c\uc5d0 \uc5b4\ub5bb\uac8c \ub3c4\uc6c0\uc774 \ub418\ub294\uc9c0\ub97c \ubcf4\uc5ec\uc90d\ub2c8\ub2e4. \ud074\ub9ad\ud558\uc5ec \ud0d0\uc0c9\ud558\uac70\ub098 Claude\uc5d0\uac8c \uc9c8\ubb38\ud558\uc138\uc694:',
      starter1: '\uc774 \uc9c0\ub3c4\uac00 \uc5b4\ub5bb\uac8c \ub3c4\uc6c0\uc774 \ub418\ub098\uc694?',
      starter2: '\uc810\ubd80\uc815\uc801\uc778 \uac10\uc815\uc774 \uc5c6\ub2e4\u201d\ub294 \uac83\uc740 \ubb34\uc2a8 \uc758\ubbf8\uc778\uac00\uc694?',
      starter3: 'Emotion Rules\ub294 \uc5b4\ub5a4 \ucc45\uc778\uac00\uc694?',
    },
    language: { label: '\uc5b8\uc5b4' },
  },

  zh: {
    welcome: {
      greeting: '\u4f60\u60f3\u4e86\u89e3\u5173\u4e8e\u60c5\u7eea\u7684\u4ec0\u4e48\uff1f',
      introBtn: '\u7ed9\u6211\u4ecb\u7ecd\u8fd9\u4e2a\u5de5\u5177',
      emotionsBtn: '\u4ec0\u4e48\u662f\u60c5\u7eea\uff1f',
      helpBtn: '\u60c5\u7eea\u5982\u4f55\u5e2e\u52a9\u6211\uff1f',
    },
    help: { tooltip: '\u70b9\u51fb\u83b7\u53d6\u5e2e\u52a9' },
    wisdom: {
      title: '\u60c5\u7eea\u667a\u6167',
      close: '\u5173\u95ed\u9762\u677f',
      inputPlaceholder: '\u8be2\u95ee\u8fd9\u79cd\u60c5\u7eea...',
      send: '\u53d1\u9001',
      privacyNotice: '\u6b64\u5bf9\u8bdd\u4f7f\u7528AI\uff08Anthropic\u7684Claude\uff09\u5e2e\u52a9\u60a8\u63a2\u7d22\u60c5\u7eea\u3002\u6d88\u606f\u4e0d\u4f1a\u88ab\u5b58\u50a8\u3002\u8fd9\u4e0d\u662f\u6cbb\u7597\u3002',
    },
    starters: {
      feeling: '\u6211\u73b0\u5728\u611f\u5230{emotion} \u2014 \u5b83\u53ef\u80fd\u5728\u544a\u8bc9\u6211\u4ec0\u4e48\uff1f',
      relate: '{emotion}\u548c{fellow}\u6709\u4ec0\u4e48\u5173\u7cfb\uff1f',
      need: '\u5e2e\u6211\u63a2\u7d22\u8fd9\u8fde\u63a5\u5230\u6211\u7684\u4ec0\u4e48\u9700\u6c42',
    },
    hud: {
      fellowMessengers: '{emotion}\u7684\u540c\u4f34\u4fe1\u4f7f',
      explore: '\u63a2\u7d22\uff1a',
    },
    entry: { hint: '\u70b9\u51fb\u63a2\u7d22' },
    chat: {
      turnLimit: '\u4f60\u505a\u4e86\u5f88\u68d2\u7684\u63a2\u7d22\uff01\u5982\u679c\u60f3\u66f4\u6df1\u5165\uff0c\u53ef\u4ee5\u770b\u770b\u8fd9\u672c\u4e66 \u2014 emotionrules.com',
      error: '\u51fa\u4e86\u4e9b\u95ee\u9898\u3002\u8bf7\u91cd\u8bd5\u3002',
    },
    subscription: {
      title: '\u7ee7\u7eed\u63a2\u7d22',
      copy: '\u8f93\u5165\u59d3\u540d\u548c\u90ae\u7bb1\u89e3\u9501\u60c5\u7eea\u661f\u5ea7\u7684\u65e0\u9650\u63a2\u7d22\u3002',
      firstName: '\u540d\u5b57',
      email: '\u90ae\u7bb1',
      country: '\u56fd\u5bb6',
      submit: '\u89e3\u9501\u5b8c\u6574\u8bbf\u95ee',
      consent: '\u63d0\u4ea4\u6b64\u8868\u5355\u5373\u8868\u793a\u60a8\u540c\u610f\u63a5\u6536Six Seconds\u7684\u90ae\u4ef6\u3002\u60a8\u53ef\u4ee5\u968f\u65f6\u53d6\u6d88\u8ba2\u9605\u3002',
      privacyPolicy: '\u9690\u79c1\u653f\u7b56',
      successTitle: '\u8bbf\u95ee\u5df2\u6388\u6743',
      dismiss: '\u4ee5\u540e\u518d\u8bf4',
    },
    book: { credit: 'Emotion Rules \u4f5c\u8005' },
    copyright: { line: '\u00a9 {author}\uff0c\u57fa\u4e8e{book}\u4e00\u4e66 | \u7531{tool}\u5236\u4f5c' },
    about: {
      btnLabel: '\u5173\u4e8e\u672c\u5e94\u7528',
      p1: '\u8fd9\u6b3e\u5e94\u7528\u7531 Joshua Freedman \u548c Claude \u5171\u540c\u521b\u5efa\uff0c\u65e8\u5728\u9610\u8ff0\u300a{book}\u300b\u4e00\u4e66\u7684\u6838\u5fc3\u7406\u5ff5\uff1a\u6ca1\u6709\u8d1f\u9762\u60c5\u7eea\u2014\u2014\u6240\u6709\u60c5\u7eea\u90fd\u662f\u6211\u4eec\u7ed9\u81ea\u5df1\u7684\u4fe1\u606f\u3002',
      p2: '\u5730\u56fe\u5c55\u793a\u4e86\u516d\u79cd\u57fa\u672c\u4eba\u7c7b\u9700\u6c42\uff08\u5982\u5b89\u5168\u611f\uff09\u4ee5\u53ca\u5404\u79cd\u60c5\u7eea\u5982\u4f55\u5e2e\u52a9\u6211\u4eec\u6ee1\u8db3\u8fd9\u4e9b\u9700\u6c42\u3002\u70b9\u51fb\u63a2\u7d22\uff0c\u6216\u5411 Claude \u63d0\u95ee\uff1a',
      starter1: '\u8fd9\u5f20\u5730\u56fe\u5982\u4f55\u5e2e\u52a9\u6211\uff1f',
      starter2: '\u201c\u6ca1\u6709\u8d1f\u9762\u60c5\u7eea\u201d\u662f\u4ec0\u4e48\u610f\u601d\uff1f',
      starter3: 'Emotion Rules \u8fd9\u672c\u4e66\u8bb2\u7684\u662f\u4ec0\u4e48\uff1f',
    },
    language: { label: '\u8bed\u8a00' },
  },

  ar: {
    welcome: {
      greeting: '\u0645\u0627\u0630\u0627 \u062a\u0631\u064a\u062f \u0623\u0646 \u062a\u0643\u062a\u0634\u0641 \u0639\u0646 \u0627\u0644\u0645\u0634\u0627\u0639\u0631\u061f',
      introBtn: '\u0623\u0639\u0637\u0646\u064a \u0645\u0642\u062f\u0645\u0629 \u0639\u0646 \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629',
      emotionsBtn: '\u0645\u0627 \u0647\u064a \u0627\u0644\u0645\u0634\u0627\u0639\u0631\u061f',
      helpBtn: '\u0643\u064a\u0641 \u064a\u0645\u0643\u0646 \u0644\u0644\u0645\u0634\u0627\u0639\u0631 \u0645\u0633\u0627\u0639\u062f\u062a\u064a\u061f',
    },
    help: { tooltip: '\u0627\u0646\u0642\u0631 \u0644\u0644\u0645\u0633\u0627\u0639\u062f\u0629' },
    wisdom: {
      title: '\u062d\u0643\u0645\u0629 \u0639\u0627\u0637\u0641\u064a\u0629',
      close: '\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0644\u0648\u062d\u0629',
      inputPlaceholder: '\u0627\u0633\u0623\u0644 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0634\u0639\u0648\u0631...',
      send: '\u0625\u0631\u0633\u0627\u0644',
      privacyNotice: '\u062a\u0633\u062a\u062e\u062f\u0645 \u0647\u0630\u0647 \u0627\u0644\u0645\u062d\u0627\u062f\u062b\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a (Claude \u0645\u0646 Anthropic) \u0644\u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0641\u064a \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0645\u0634\u0627\u0639\u0631\u0643. \u0644\u0627 \u064a\u062a\u0645 \u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0631\u0633\u0627\u0626\u0644. \u0647\u0630\u0627 \u0644\u064a\u0633 \u0639\u0644\u0627\u062c\u0627\u064b.',
    },
    starters: {
      feeling: '\u0623\u0634\u0639\u0631 \u0628{emotion} \u0627\u0644\u0622\u0646 \u2014 \u0645\u0627\u0630\u0627 \u0642\u062f \u064a\u062e\u0628\u0631\u0646\u064a\u061f',
      relate: '\u0643\u064a\u0641 \u064a\u0631\u062a\u0628\u0637 {emotion} \u0648{fellow}\u061f',
      need: '\u0633\u0627\u0639\u062f\u0646\u064a \u0641\u064a \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0627\u0644\u062d\u0627\u062c\u0629 \u0627\u0644\u062a\u064a \u064a\u0631\u062a\u0628\u0637 \u0628\u0647\u0627',
    },
    hud: {
      fellowMessengers: '\u0631\u0641\u0627\u0642 {emotion} \u0627\u0644\u0645\u0631\u0633\u0644\u0648\u0646',
      explore: '\u0627\u0633\u062a\u0643\u0634\u0641:',
    },
    entry: { hint: '\u0627\u0646\u0642\u0631 \u0644\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641' },
    chat: {
      turnLimit: '\u0644\u0642\u062f \u0642\u0645\u062a \u0628\u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0631\u0627\u0626\u0639! \u0625\u0630\u0627 \u0623\u0631\u062f\u062a \u0627\u0644\u062a\u0639\u0645\u0642\u060c \u0642\u062f \u064a\u0639\u062c\u0628\u0643 \u0627\u0644\u0643\u062a\u0627\u0628 \u2014 emotionrules.com',
      error: '\u062d\u062f\u062b \u062e\u0637\u0623. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
    },
    subscription: {
      title: '\u062a\u0627\u0628\u0639 \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641',
      copy: '\u0623\u062f\u062e\u0644 \u0627\u0633\u0645\u0643 \u0648\u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u0641\u062a\u062d \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u063a\u064a\u0631 \u0627\u0644\u0645\u062d\u062f\u0648\u062f.',
      firstName: '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0623\u0648\u0644',
      email: '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
      country: '\u0627\u0644\u062f\u0648\u0644\u0629',
      submit: '\u0641\u062a\u062d \u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0643\u0627\u0645\u0644',
      consent: '\u0628\u0625\u0631\u0633\u0627\u0644 \u0647\u0630\u0627 \u0627\u0644\u0646\u0645\u0648\u0630\u062c\u060c \u062a\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u062a\u0644\u0642\u064a \u0631\u0633\u0627\u0626\u0644 \u0645\u0646 Six Seconds. \u064a\u0645\u0643\u0646\u0643 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a \u0623\u064a \u0648\u0642\u062a.',
      privacyPolicy: '\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',
      successTitle: '\u062a\u0645 \u0645\u0646\u062d \u0627\u0644\u0648\u0635\u0648\u0644',
      dismiss: '\u0631\u0628\u0645\u0627 \u0644\u0627\u062d\u0642\u0627\u064b',
    },
    book: { credit: 'Emotion Rules \u0628\u0642\u0644\u0645' },
    copyright: { line: '\u00a9 {author}\u060c \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0643\u062a\u0627\u0628 {book} | \u0635\u064f\u0646\u0639 \u0628\u0648\u0627\u0633\u0637\u0629 {tool}' },
    about: {
      btnLabel: '\u062d\u0648\u0644 \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642',
      p1: '\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0628\u0648\u0627\u0633\u0637\u0629 Joshua Freedman \u0648Claude \u0644\u062a\u0648\u0636\u064a\u062d \u0625\u062d\u062f\u0649 \u0627\u0644\u0623\u0641\u0643\u0627\u0631 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0641\u064a \u0643\u062a\u0627\u0628 {book}: \u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0634\u0627\u0639\u0631 \u0633\u0644\u0628\u064a\u0629 \u2014 \u062c\u0645\u064a\u0639\u0647\u0627 \u0631\u0633\u0627\u0626\u0644 \u0645\u0646\u0627 \u0648\u0625\u0644\u064a\u0646\u0627.',
      p2: '\u062a\u064f\u0638\u0647\u0631 \u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0633\u062a\u0629 \u0645\u0646 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u064a\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 (\u0643\u0627\u0644\u0623\u0645\u0627\u0646) \u0648\u0643\u064a\u0641 \u064a\u0645\u0643\u0646 \u0644\u0644\u0645\u0634\u0627\u0639\u0631 \u0627\u0644\u0645\u062e\u062a\u0644\u0641\u0629 \u0645\u0633\u0627\u0639\u062f\u062a\u0646\u0627. \u0627\u0646\u0642\u0631 \u0644\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641\u060c \u0623\u0648 \u0627\u0633\u0623\u0644 Claude \u0633\u0624\u0627\u0644\u0627\u064b:',
      starter1: '\u0643\u064a\u0641 \u062a\u0633\u0627\u0639\u062f\u0646\u064a \u0647\u0630\u0647 \u0627\u0644\u062e\u0631\u064a\u0637\u0629\u061f',
      starter2: '\u0645\u0627\u0630\u0627 \u062a\u0642\u0635\u062f \u0628\u0640\u201c\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0634\u0627\u0639\u0631 \u0633\u0644\u0628\u064a\u0629\u201d\u061f',
      starter3: '\u0645\u0627 \u0627\u0644\u0630\u064a \u064a\u062f\u0648\u0631 \u062d\u0648\u0644\u0647 \u0643\u062a\u0627\u0628 Emotion Rules\u061f',
    },
    language: { label: '\u0627\u0644\u0644\u063a\u0629' },
  },

  he: {
    welcome: {
      greeting: 'מה תרצה לגלות על רגשות?',
      introBtn: 'תן לי הקדמה לכלי הזה',
      emotionsBtn: 'מה הם רגשות?',
      helpBtn: 'איך רגשות יכולים לעזור לי?',
    },
    help: { tooltip: 'לחץ לעזרה' },
    wisdom: {
      title: 'חוכמה רגשית',
      close: 'סגור לוח',
      inputPlaceholder: 'שאל על הרגש הזה...',
      send: 'שלח',
      privacyNotice: 'שיחה זו משתמשת בבינה מלאכותית (Claude של Anthropic) כדי לעזור לך לחקור את הרגשות שלך. הודעות אינן נשמרות. זו אינה טיפול.',
    },
    starters: {
      feeling: 'אני מרגיש {emotion} עכשיו — מה זה עשוי לומר לי?',
      relate: 'איך {emotion} ו-{fellow} קשורים?',
      need: 'עזור לי לחקור לאיזה צורך זה מתחבר אצלי',
    },
    hud: {
      fellowMessengers: 'השליחים של {emotion}',
      explore: 'חקור:',
    },
    entry: { hint: 'הקש כדי לחקור' },
    chat: {
      turnLimit: 'עשית חקירה נפלאה! אם תרצה להעמיק, אולי תאהב את הספר — emotionrules.com',
      error: 'משהו השתבש. אנא נסה שוב.',
    },
    subscription: {
      title: 'המשך לחקור',
      copy: 'הזן את שמך ואימייל כדי לפתוח חקירה בלתי מוגבלת של קונסטלציית הרגשות.',
      firstName: 'שם פרטי',
      email: 'אימייל',
      country: 'מדינה',
      submit: 'פתח גישה מלאה',
      consent: 'בשליחת טופס זה, אתה מסכים לקבל תקשורת מ-Six Seconds. אתה יכול לבטל את המנוי בכל עת. ראה את',
      privacyPolicy: 'מדיניות הפרטיות',
      successTitle: 'גישה אושרה',
      dismiss: 'אולי מאוחר יותר',
    },
    book: { credit: 'מתוך Emotion Rules מאת' },
    copyright: { line: '© {author}, מבוסס על הספר {book} | נוצר עם {tool}' },
    about: {
      btnLabel: 'אודות האפליקציה',
      p1: 'האפליקציה נוצרה על ידי Joshua Freedman ו-Claude כדי להמחיש אחד מהרעיונות המרכזיים בספר {book}: אין רגשות שליליים — כולם מסרים מאיתנו, עבורנו.',
      p2: 'המפה מציגה שישה מהצרכים האנושיים הבסיסיים (כמו ביטחון) וכיצד רגשות שונים יכולים לעזור לנו עם אותם צרכים. לחץ לחקור, או שאל את Claude שאלה:',
      starter1: 'כיצד המפה הזו עוזרת לי?',
      starter2: 'מה הכוונה ב"אין רגשות שליליים"?',
      starter3: 'על מה עוסק Emotion Rules?',
    },
    language: { label: 'שפה' },
  },

  ja: {
    welcome: {
      greeting: '\u611f\u60c5\u306b\u3064\u3044\u3066\u4f55\u3092\u767a\u898b\u3057\u305f\u3044\u3067\u3059\u304b\uff1f',
      introBtn: '\u3053\u306e\u30c4\u30fc\u30eb\u306e\u7d39\u4ecb\u3092\u304f\u3060\u3055\u3044',
      emotionsBtn: '\u611f\u60c5\u3068\u306f\u4f55\u3067\u3059\u304b\uff1f',
      helpBtn: '\u611f\u60c5\u306f\u3069\u3046\u5f79\u7acb\u3061\u307e\u3059\u304b\uff1f',
    },
    help: { tooltip: '\u30d8\u30eb\u30d7' },
    wisdom: {
      title: '\u611f\u60c5\u306e\u77e5\u6075',
      close: '\u30d1\u30cd\u30eb\u3092\u9589\u3058\u308b',
      inputPlaceholder: '\u3053\u306e\u611f\u60c5\u306b\u3064\u3044\u3066\u805e\u304f...',
      send: '\u9001\u4fe1',
      privacyNotice: '\u3053\u306e\u4f1a\u8a71\u306fAI\uff08Anthropic\u306eClaude\uff09\u3092\u4f7f\u7528\u3057\u3066\u611f\u60c5\u306e\u63a2\u7d22\u3092\u304a\u624b\u4f1d\u3044\u3057\u307e\u3059\u3002\u30e1\u30c3\u30bb\u30fc\u30b8\u306f\u4fdd\u5b58\u3055\u308c\u307e\u305b\u3093\u3002\u3053\u308c\u306f\u30bb\u30e9\u30d4\u30fc\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3002',
    },
    starters: {
      feeling: '\u4eca{emotion}\u3092\u611f\u3058\u3066\u3044\u307e\u3059 \u2014 \u4f55\u3092\u4f1d\u3048\u3066\u3044\u308b\u306e\u3067\u3057\u3087\u3046\u304b\uff1f',
      relate: '{emotion}\u3068{fellow}\u306f\u3069\u3046\u95a2\u4fc2\u3057\u3066\u3044\u307e\u3059\u304b\uff1f',
      need: '\u3053\u308c\u304c\u3069\u306e\u30cb\u30fc\u30ba\u306b\u3064\u306a\u304c\u308b\u304b\u63a2\u7d22\u3057\u3066\u304f\u3060\u3055\u3044',
    },
    hud: {
      fellowMessengers: '{emotion}\u306e\u4ef2\u9593\u306e\u30e1\u30c3\u30bb\u30f3\u30b8\u30e3\u30fc',
      explore: '\u63a2\u7d22:',
    },
    entry: { hint: '\u30bf\u30c3\u30d7\u3057\u3066\u63a2\u7d22' },
    chat: {
      turnLimit: '\u7d20\u6674\u3089\u3057\u3044\u63a2\u7d22\u3067\u3057\u305f\uff01\u3082\u3063\u3068\u6df1\u304f\u77e5\u308a\u305f\u3044\u5834\u5408\u306f\u3001\u672c\u3092\u304a\u52e7\u3081\u3057\u307e\u3059 \u2014 emotionrules.com',
      error: '\u554f\u984c\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\u518d\u8a66\u884c\u3057\u3066\u304f\u3060\u3055\u3044\u3002',
    },
    subscription: {
      title: '\u63a2\u7d22\u3092\u7d9a\u3051\u308b',
      copy: '\u540d\u524d\u3068\u30e1\u30fc\u30eb\u3092\u5165\u529b\u3057\u3066\u3001\u611f\u60c5\u306e\u661f\u5ea7\u3092\u7121\u5236\u9650\u306b\u63a2\u7d22\u3057\u307e\u3057\u3087\u3046\u3002',
      firstName: '\u540d\u524d',
      email: '\u30e1\u30fc\u30eb',
      country: '\u56fd',
      submit: '\u30d5\u30eb\u30a2\u30af\u30bb\u30b9\u3092\u89e3\u9664',
      consent: '\u3053\u306e\u30d5\u30a9\u30fc\u30e0\u3092\u9001\u4fe1\u3059\u308b\u3068\u3001Six Seconds\u304b\u3089\u306e\u30e1\u30fc\u30eb\u53d7\u4fe1\u306b\u540c\u610f\u3057\u305f\u3053\u3068\u306b\u306a\u308a\u307e\u3059\u3002\u3044\u3064\u3067\u3082\u767b\u9332\u89e3\u9664\u3067\u304d\u307e\u3059\u3002',
      privacyPolicy: '\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u30dd\u30ea\u30b7\u30fc',
      successTitle: '\u30a2\u30af\u30bb\u30b9\u8a31\u53ef',
      dismiss: '\u5f8c\u3067',
    },
    book: { credit: 'Emotion Rules \u8457\u8005' },
    copyright: { line: '\u00a9 {author}\u3001\u66f8\u7c4d{book}\u306b\u57fa\u3065\u304f | {tool}\u3067\u5236\u4f5c' },
    about: {
      btnLabel: '\u3053\u306e\u30a2\u30d7\u30ea\u306b\u3064\u3044\u3066',
      p1: '\u3053\u306e\u30a2\u30d7\u30ea\u306fJoshua Freedman\u3068Claude\u304c\u66f8\u7c4d{book}\u306e\u6838\u5fc3\u7684\u306a\u30a2\u30a4\u30c7\u30a2\u3092\u8aac\u660e\u3059\u308b\u305f\u3081\u306b\u4f5c\u6210\u3057\u307e\u3057\u305f\uff1a\u30cd\u30ac\u30c6\u30a3\u30d6\u306a\u611f\u60c5\u306f\u5b58\u5728\u3057\u307e\u305b\u3093\u2014\u3059\u3079\u3066\u306e\u611f\u60c5\u306f\u79c1\u305f\u3061\u304b\u3089\u3001\u79c1\u305f\u3061\u3078\u306e\u30e1\u30c3\u30bb\u30fc\u30b8\u3067\u3059\u3002',
      p2: '\u30de\u30c3\u30d7\u306f6\u3064\u306e\u57fa\u672c\u7684\u306a\u4eba\u9593\u306e\u6b32\u6c42\uff08\u5b89\u5168\u306a\u3069\uff09\u3068\u3001\u3055\u307e\u3056\u307e\u306a\u611f\u60c5\u304c\u305d\u308c\u3089\u306e\u6b32\u6c42\u306b\u3069\u3046\u5f79\u7acb\u3064\u304b\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\u30af\u30ea\u30c3\u30af\u3057\u3066\u63a2\u7d22\u3059\u308b\u304b\u3001Claude\u306b\u8cea\u554f\u3057\u3066\u304f\u3060\u3055\u3044\uff1a',
      starter1: '\u3053\u306e\u30de\u30c3\u30d7\u306f\u3069\u3046\u5f79\u7acb\u3061\u307e\u3059\u304b\uff1f',
      starter2: '\u300c\u30cd\u30ac\u30c6\u30a3\u30d6\u306a\u611f\u60c5\u306f\u5b58\u5728\u3057\u306a\u3044\u300d\u3068\u306f\u3069\u3046\u3044\u3046\u610f\u5473\u3067\u3059\u304b\uff1f',
      starter3: 'Emotion Rules\u3068\u306f\u3069\u3093\u306a\u672c\u3067\u3059\u304b\uff1f',
    },
    language: { label: '\u8a00\u8a9e' },
  },

  fr: {
    welcome: {
      greeting: 'Que souhaitez-vous d\u00e9couvrir sur les \u00e9motions\u00a0?',
      introBtn: 'Pr\u00e9sentez-moi cet outil',
      emotionsBtn: 'Que sont les \u00e9motions\u00a0?',
      helpBtn: 'Comment les \u00e9motions peuvent-elles m\u2019aider\u00a0?',
    },
    help: { tooltip: 'Cliquez pour l\u2019aide' },
    wisdom: {
      title: 'Sagesse \u00c9motionnelle',
      close: 'Fermer le panneau',
      inputPlaceholder: 'Posez une question sur cette \u00e9motion...',
      send: 'Envoyer',
      privacyNotice: 'Cette conversation utilise l\u2019IA (Claude d\u2019Anthropic) pour explorer vos \u00e9motions. Les messages ne sont pas stock\u00e9s. Ce n\u2019est pas de la th\u00e9rapie.',
    },
    starters: {
      feeling: 'Je ressens {emotion} en ce moment \u2014 qu\u2019est-ce que cela pourrait me dire\u00a0?',
      relate: 'Comment {emotion} et {fellow} sont-ils li\u00e9s\u00a0?',
      need: 'Aidez-moi \u00e0 explorer quel besoin cela touche chez moi',
    },
    hud: {
      fellowMessengers: 'Messagers compagnons de {emotion}',
      explore: 'explorer\u00a0:',
    },
    entry: { hint: 'touchez pour explorer' },
    chat: {
      turnLimit: 'Quelle belle exploration\u00a0! Pour aller plus loin, le livre pourrait vous plaire \u2014 emotionrules.com',
      error: 'Un probl\u00e8me est survenu. Veuillez r\u00e9essayer.',
    },
    subscription: {
      title: 'Continuez l\u2019exploration',
      copy: 'Entrez votre nom et email pour d\u00e9bloquer l\u2019exploration illimit\u00e9e de la Constellation des \u00c9motions.',
      firstName: 'Pr\u00e9nom',
      email: 'Email',
      country: 'Pays',
      submit: 'D\u00e9bloquer l\u2019acc\u00e8s complet',
      consent: 'En soumettant ce formulaire, vous acceptez de recevoir des communications de Six Seconds. Vous pouvez vous d\u00e9sinscrire \u00e0 tout moment. Voir notre',
      privacyPolicy: 'Politique de confidentialit\u00e9',
      successTitle: 'Acc\u00e8s accord\u00e9',
      dismiss: 'Peut-\u00eatre plus tard',
    },
    book: { credit: 'De Emotion Rules par' },
    copyright: { line: '\u00a9 {author}, bas\u00e9 sur le livre {book} | fait avec {tool}' },
    about: {
      btnLabel: '\u00c0 propos de cette App',
      p1: 'Cette application a \u00e9t\u00e9 cr\u00e9\u00e9e par Joshua Freedman \u0026 Claude pour illustrer l\u2019une des id\u00e9es cl\u00e9s du livre {book}\u00a0: Il n\u2019y a pas de sentiments n\u00e9gatifs \u2014 ce sont tous des messages de nous, pour nous.',
      p2: 'La carte montre six des besoins humains fondamentaux (comme la s\u00e9curit\u00e9) et comment diff\u00e9rentes \u00e9motions peuvent nous aider. Cliquez pour explorer ou posez une question \u00e0 Claude\u00a0:',
      starter1: 'Comment cette carte m\u2019aide-t-elle\u00a0?',
      starter2: 'Que voulez-vous dire par \u00ab\u00a0il n\u2019y a pas de sentiments n\u00e9gatifs\u00a0\u00bb\u00a0?',
      starter3: 'De quoi parle Emotion Rules\u00a0?',
    },
    language: { label: 'Langue' },
  },

  pt: {
    welcome: {
      greeting: 'O que voc\u00ea gostaria de descobrir sobre emo\u00e7\u00f5es?',
      introBtn: 'Me apresente esta ferramenta',
      emotionsBtn: 'O que s\u00e3o emo\u00e7\u00f5es?',
      helpBtn: 'Como as emo\u00e7\u00f5es podem me ajudar?',
    },
    help: { tooltip: 'Clique para ajuda' },
    wisdom: {
      title: 'Sabedoria Emocional',
      close: 'Fechar painel',
      inputPlaceholder: 'Pergunte sobre esta emo\u00e7\u00e3o...',
      send: 'Enviar',
      privacyNotice: 'Esta conversa usa IA (Claude da Anthropic) para ajud\u00e1-lo a explorar suas emo\u00e7\u00f5es. As mensagens n\u00e3o s\u00e3o armazenadas. Isso n\u00e3o \u00e9 terapia.',
    },
    starters: {
      feeling: 'Estou sentindo {emotion} agora \u2014 o que pode estar me dizendo?',
      relate: 'Como {emotion} e {fellow} se relacionam?',
      need: 'Me ajude a explorar qual necessidade isso conecta em mim',
    },
    hud: {
      fellowMessengers: 'Mensageiros companheiros de {emotion}',
      explore: 'explorar:',
    },
    entry: { hint: 'toque para explorar' },
    chat: {
      turnLimit: 'Voc\u00ea fez uma explora\u00e7\u00e3o maravilhosa! Se quiser aprofundar, pode gostar do livro \u2014 emotionrules.com',
      error: 'Algo deu errado. Por favor, tente novamente.',
    },
    subscription: {
      title: 'Continue Explorando',
      copy: 'Insira seu nome e email para desbloquear a explora\u00e7\u00e3o ilimitada da Constela\u00e7\u00e3o de Emo\u00e7\u00f5es.',
      firstName: 'Nome',
      email: 'Email',
      country: 'Pa\u00eds',
      submit: 'Desbloquear Acesso Completo',
      consent: 'Ao enviar este formul\u00e1rio, voc\u00ea concorda em receber comunica\u00e7\u00f5es da Six Seconds. Voc\u00ea pode cancelar a qualquer momento. Veja nossa',
      privacyPolicy: 'Pol\u00edtica de Privacidade',
      successTitle: 'Acesso Concedido',
      dismiss: 'Talvez depois',
    },
    book: { credit: 'De Emotion Rules por' },
    copyright: { line: '\u00a9 {author}, baseado no livro {book} | feito com {tool}' },
    about: {
      btnLabel: 'Sobre este App',
      p1: 'Este app foi criado por Joshua Freedman \u0026 Claude para ilustrar uma das ideias centrais do livro {book}: N\u00e3o h\u00e1 sentimentos negativos \u2014 todos s\u00e3o mensagens nossas, para n\u00f3s.',
      p2: 'O mapa mostra seis das necessidades humanas b\u00e1sicas (como seguran\u00e7a) e como v\u00e1rios sentimentos podem nos ajudar. Clique para explorar ou fa\u00e7a uma pergunta ao Claude:',
      starter1: 'Como esse mapa me ajuda?',
      starter2: 'O que voc\u00ea quer dizer com \u201cn\u00e3o h\u00e1 sentimentos negativos\u201d?',
      starter3: 'Do que trata Emotion Rules?',
    },
    language: { label: 'Idioma' },
  },

  it: {
    welcome: {
      greeting: 'Cosa vorresti scoprire sulle emozioni?',
      introBtn: 'Presentami questo strumento',
      emotionsBtn: 'Cosa sono le emozioni?',
      helpBtn: 'Come possono aiutarmi le emozioni?',
    },
    help: { tooltip: 'Clicca per aiuto' },
    wisdom: {
      title: 'Saggezza Emotiva',
      close: 'Chiudi pannello',
      inputPlaceholder: 'Chiedi di questa emozione...',
      send: 'Invia',
      privacyNotice: 'Questa conversazione usa l\'IA (Claude di Anthropic) per aiutarti a esplorare le tue emozioni. I messaggi non vengono salvati. Questo non \u00e8 terapia.',
    },
    starters: {
      feeling: 'Sto provando {emotion} adesso \u2014 cosa potrebbe dirmi?',
      relate: 'Come sono collegati {emotion} e {fellow}?',
      need: 'Aiutami a esplorare quale bisogno questo collega in me',
    },
    hud: {
      fellowMessengers: 'Messaggeri compagni di {emotion}',
      explore: 'esplora:',
    },
    entry: { hint: 'tocca per esplorare' },
    chat: {
      turnLimit: 'Hai fatto un\'esplorazione meravigliosa! Se vuoi approfondire, potrebbe piacerti il libro \u2014 emotionrules.com',
      error: 'Qualcosa \u00e8 andato storto. Riprova.',
    },
    subscription: {
      title: 'Continua a Esplorare',
      copy: 'Inserisci nome e email per sbloccare l\'esplorazione illimitata della Costellazione delle Emozioni.',
      firstName: 'Nome',
      email: 'Email',
      country: 'Paese',
      submit: 'Sblocca Accesso Completo',
      consent: 'Inviando questo modulo, accetti di ricevere comunicazioni da Six Seconds. Puoi annullare l\'iscrizione in qualsiasi momento. Vedi la nostra',
      privacyPolicy: 'Informativa sulla Privacy',
      successTitle: 'Accesso Concesso',
      dismiss: 'Forse dopo',
    },
    book: { credit: 'Da Emotion Rules di' },
    copyright: { line: '\u00a9 {author}, basato sul libro {book} | fatto con {tool}' },
    about: {
      btnLabel: 'Info sull\u2019App',
      p1: 'Questa app \u00e8 stata creata da Joshua Freedman \u0026 Claude per illustrare una delle idee chiave del libro {book}: Non ci sono sentimenti negativi \u2014 sono tutti messaggi da noi, per noi.',
      p2: 'La mappa mostra sei dei bisogni umani fondamentali (come la sicurezza) e come vari sentimenti possono aiutarci. Clicca per esplorare o fai una domanda a Claude:',
      starter1: 'Come mi aiuta questa mappa?',
      starter2: 'Cosa intendi con \u201cnon ci sono sentimenti negativi\u201d?',
      starter3: 'Di cosa parla Emotion Rules?',
    },
    language: { label: 'Lingua' },
  },

  de: {
    welcome: {
      greeting: 'Was m\u00f6chten Sie \u00fcber Emotionen entdecken?',
      introBtn: 'Stellen Sie mir dieses Tool vor',
      emotionsBtn: 'Was sind Emotionen?',
      helpBtn: 'Wie k\u00f6nnen Emotionen mir helfen?',
    },
    help: { tooltip: 'Klicken f\u00fcr Hilfe' },
    wisdom: {
      title: 'Emotionale Weisheit',
      close: 'Panel schlie\u00dfen',
      inputPlaceholder: '\u00dcber dieses Gef\u00fchl fragen...',
      send: 'Senden',
      privacyNotice: 'Dieses Gespr\u00e4ch nutzt KI (Claude von Anthropic) um Ihnen bei der Erkundung Ihrer Emotionen zu helfen. Nachrichten werden nicht gespeichert. Dies ist keine Therapie.',
    },
    starters: {
      feeling: 'Ich f\u00fchle gerade {emotion} \u2014 was k\u00f6nnte es mir sagen?',
      relate: 'Wie h\u00e4ngen {emotion} und {fellow} zusammen?',
      need: 'Helfen Sie mir zu erkunden, welches Bed\u00fcrfnis das bei mir anspricht',
    },
    hud: {
      fellowMessengers: 'Mitbotschafter von {emotion}',
      explore: 'erkunden:',
    },
    entry: { hint: 'tippen zum Erkunden' },
    chat: {
      turnLimit: 'Wunderbare Erkundung! Wenn Sie tiefer gehen m\u00f6chten, k\u00f6nnte Ihnen das Buch gefallen \u2014 emotionrules.com',
      error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    },
    subscription: {
      title: 'Weiter Erkunden',
      copy: 'Geben Sie Ihren Namen und Ihre E-Mail ein, um die unbegrenzte Erkundung der Emotionskonstellation freizuschalten.',
      firstName: 'Vorname',
      email: 'E-Mail',
      country: 'Land',
      submit: 'Vollzugang freischalten',
      consent: 'Mit dem Absenden dieses Formulars stimmen Sie dem Erhalt von E-Mails von Six Seconds zu. Sie k\u00f6nnen sich jederzeit abmelden. Siehe unsere',
      privacyPolicy: 'Datenschutzrichtlinie',
      successTitle: 'Zugang gew\u00e4hrt',
      dismiss: 'Vielleicht sp\u00e4ter',
    },
    book: { credit: 'Aus Emotion Rules von' },
    copyright: { line: '\u00a9 {author}, basierend auf dem Buch {book} | erstellt mit {tool}' },
    about: {
      btnLabel: '\u00dcber diese App',
      p1: 'Diese App wurde von Joshua Freedman \u0026 Claude erstellt, um eine der Schl\u00fcsselideen des Buches {book} zu veranschaulichen: Es gibt keine negativen Gef\u00fchle \u2014 sie sind alle Botschaften von uns, f\u00fcr uns.',
      p2: 'Die Karte zeigt sechs der grundlegenden menschlichen Bed\u00fcrfnisse (wie Sicherheit) und wie verschiedene Gef\u00fchle uns dabei helfen k\u00f6nnen. Klicken Sie zum Erkunden oder stellen Sie Claude eine Frage:',
      starter1: 'Wie hilft mir diese Karte?',
      starter2: 'Was meinen Sie mit \u201ees gibt keine negativen Gef\u00fchle\u201c?',
      starter3: 'Worum geht es bei Emotion Rules?',
    },
    language: { label: 'Sprache' },
  },
};

/**
 * Get a translated string by dot-separated key path.
 * Falls back to English if key is missing in current locale.
 *
 * @param {string} key - Dot-separated path, e.g. 'welcome.greeting'
 * @param {Object} [vars] - Interpolation variables, e.g. { emotion: 'Joy' }
 * @returns {string}
 */
export function t(key, vars) {
  const locale = getLocale();
  let result = resolve(strings[locale], key) || resolve(strings.en, key) || key;

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }

  return result;
}

/**
 * Resolve a dot-separated key path in a nested object.
 * @param {Object} obj
 * @param {string} path
 * @returns {string|undefined}
 */
function resolve(obj, path) {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current[part] === undefined) return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}
