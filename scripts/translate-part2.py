#!/usr/bin/env python3
"""Part 2: Add readMore + inquiry translations for emotions 1-13 (trust through anger)."""
import json, os

F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "emotion-constellation-more-info-data.json")
with open(F, "r", encoding="utf-8") as f:
    data = json.load(f)

LOCALES = ["es","ko","zh","ar","he","ja","fr","pt","it","de"]

# Build a lookup by emotion id
emo_map = {e["id"]: e for e in data["emotions"]}

def add_translations(eid, field, translations):
    """Add locale translations to emo_map[eid]["readMore"][field]."""
    for i, loc in enumerate(LOCALES):
        emo_map[eid]["readMore"][field][loc] = translations[i]

def add_inquiry(eid, need_idx, translations):
    """Add locale translations to inquiry at given need index."""
    for i, loc in enumerate(LOCALES):
        emo_map[eid]["needs"][need_idx]["inquiry"][loc] = translations[i]

# ═══ TRUST ═══
add_translations("trust", "essence", [
    "Un sentimiento de seguridad y confianza en las personas, los sistemas o en ti mismo — una señal de que las reglas están establecidas y eres aceptado.",
    "사람, 시스템, 또는 자기 자신에 대한 안전감과 확신 — 규칙이 자리잡고 있고 당신이 수용되고 있다는 신호입니다.",
    "对人、系统或自我的安全感和信心——这是规则已就位、你被接纳的信号。",
    "شعور بالأمان والثقة في الناس أو الأنظمة أو في نفسك — إشارة إلى أن القواعد موجودة وأنك مقبول.",
    "תחושת ביטחון ואמון באנשים, במערכות או בעצמך — אות שהכללים במקומם ושאתה מקובל.",
    "人、システム、または自分自身への安心感と信頼感 — ルールが整い、あなたが受け入れられているというシグナルです。",
    "Un sentiment de sécurité et de confiance envers les gens, les systèmes ou vous-même — un signal que les règles sont en place et que vous êtes accepté.",
    "Um sentimento de segurança e confiança nas pessoas, sistemas ou em si mesmo — um sinal de que as regras estão em vigor e você é aceito.",
    "Un sentimento di sicurezza e fiducia nelle persone, nei sistemi o in te stesso — un segnale che le regole sono al loro posto e sei accettato.",
    "Ein Gefühl von Sicherheit und Vertrauen in Menschen, Systeme oder sich selbst — ein Signal, dass die Regeln gelten und du akzeptiert bist.",
])
add_translations("trust", "signal", [
    "La confianza es tu sistema diciendo: aquí estás seguro. Cuando hay confianza, puedes abrirte, colaborar e invertir en relaciones. La confianza nos habla de seguridad — las reglas están establecidas y nos sentimos aceptados como parte del sistema. También es la base de la pertenencia; sin ella, la conexión permanece superficial.",
    "신뢰는 당신의 시스템이 말하는 것입니다: 여기는 안전합니다. 신뢰가 있을 때, 마음을 열고, 협력하고, 관계에 투자할 수 있습니다. 신뢰는 안전에 대해 알려줍니다 — 규칙이 자리잡고 있고, 우리는 시스템의 일부로 수용됩니다. 또한 소속감의 기반이기도 합니다; 신뢰 없이는 연결이 피상적으로 남습니다.",
    "信任是你的系统在说：这里是安全的。当信任存在时，你可以敞开心扉、合作并投入关系。信任告诉我们关于安全——规则已就位，我们感到被接纳为系统的一部分。它也是归属感的基础；没有它，连接只会停留在表面。",
    "الثقة هي نظامك يقول: الأمان هنا. عندما تكون الثقة حاضرة، يمكنك الانفتاح والتعاون والاستثمار في العلاقات. الثقة تخبرنا عن الأمان — القواعد موجودة، ونشعر بأننا مقبولون كجزء من النظام. إنها أيضًا أساس الانتماء؛ بدونها يبقى التواصل سطحيًا.",
    "אמון הוא המערכת שלך אומרת: בטוח כאן. כשאמון נוכח, אתה יכול להיפתח, לשתף פעולה ולהשקיע ביחסים. אמון מספר לנו על ביטחון — הכללים במקומם, ואנחנו מרגישים מקובלים כחלק מהמערכת. הוא גם הבסיס לשייכות; בלעדיו, החיבור נשאר שטחי.",
    "信頼はあなたのシステムが伝えていること：ここは安全です。信頼があるとき、心を開き、協力し、関係に投資できます。信頼は安全について教えてくれます——ルールが整い、私たちはシステムの一部として受け入れられていると感じます。帰属感の基盤でもあります；信頼なくして、つながりは浅いままです。",
    "La confiance est votre système qui dit : c'est sûr ici. Quand la confiance est présente, vous pouvez vous ouvrir, collaborer et investir dans les relations. La confiance nous renseigne sur la sécurité — les règles sont en place et nous nous sentons acceptés. C'est aussi le fondement de l'appartenance ; sans elle, la connexion reste superficielle.",
    "A confiança é o seu sistema dizendo: é seguro aqui. Quando a confiança está presente, você pode se abrir, colaborar e investir em relacionamentos. A confiança nos fala sobre segurança — as regras estão em vigor e nos sentimos aceitos como parte do sistema. É também a base do pertencimento; sem ela, a conexão permanece superficial.",
    "La fiducia è il tuo sistema che dice: qui è sicuro. Quando la fiducia è presente, puoi aprirti, collaborare e investire nelle relazioni. La fiducia ci parla di sicurezza — le regole sono al loro posto e ci sentiamo accettati come parte del sistema. È anche il fondamento dell'appartenenza; senza di essa, la connessione resta superficiale.",
    "Vertrauen ist dein System, das sagt: Hier ist es sicher. Wenn Vertrauen vorhanden ist, kannst du dich öffnen, zusammenarbeiten und in Beziehungen investieren. Vertrauen sagt uns etwas über Sicherheit — die Regeln sind da, und wir fühlen uns als Teil des Systems akzeptiert. Es ist auch die Grundlage von Zugehörigkeit; ohne Vertrauen bleibt Verbindung oberflächlich.",
])
add_translations("trust", "reflection", [
    "¿En qué parte de tu vida está presente la confianza — y dónde podrías estar reteniéndola?",
    "삶의 어디에서 신뢰가 존재하나요 — 그리고 어디에서 그것을 보류하고 있을 수 있나요?",
    "在你生活的哪些方面信任存在——你可能在哪里保留着它？",
    "أين في حياتك تتواجد الثقة — وأين قد تكون تحجبها؟",
    "היכן בחייך האמון נוכח — והיכן ייתכן שאתה מסתיר אותו?",
    "あなたの人生のどこに信頼がありますか——そしてどこでそれを差し控えているかもしれませんか？",
    "Où dans votre vie la confiance est-elle présente — et où pourriez-vous la retenir ?",
    "Onde em sua vida a confiança está presente — e onde você pode estar retendo-a?",
    "Dove nella tua vita è presente la fiducia — e dove potresti trattenerla?",
    "Wo in deinem Leben ist Vertrauen vorhanden — und wo hältst du es vielleicht zurück?",
])
add_inquiry("trust", 0, [
    "¿Tengo apoyo y protección?",
    "나에게 지지와 보호가 있는가?",
    "我有支持和保护吗？",
    "هل لدي الدعم والحماية؟",
    "האם יש לי תמיכה והגנה?",
    "私にはサポートと守りがありますか？",
    "Ai-je du soutien et de la protection ?",
    "Tenho apoio e proteção?",
    "Ho supporto e protezione?",
    "Habe ich Unterstützung und Schutz?",
])
add_inquiry("trust", 1, [
    "¿Son confiables los vínculos que me rodean?",
    "내 주변의 유대는 믿을 만한가?",
    "我周围的纽带可靠吗？",
    "هل الروابط من حولي موثوقة؟",
    "האם הקשרים סביבי אמינים?",
    "私の周りの絆は信頼できるものですか？",
    "Les liens autour de moi sont-ils fiables ?",
    "Os vínculos ao meu redor são confiáveis?",
    "I legami intorno a me sono affidabili?",
    "Sind die Bindungen um mich herum verlässlich?",
])

# ═══ FEAR ═══
add_translations("fear", "essence", [
    "Una alerta de que algo que te importa puede estar en riesgo — la forma en que tu sistema agudiza tu atención hacia lo que más importa.",
    "당신이 소중히 여기는 것이 위험에 처해 있을 수 있다는 경고 — 가장 중요한 것에 주의를 집중시키는 시스템의 방식입니다.",
    "一个警报，表明你在意的东西可能处于危险之中——你的系统将注意力集中在最重要事物上的方式。",
    "تنبيه بأن شيئًا تهتم به قد يكون في خطر — طريقة نظامك في شحذ انتباهك نحو ما يهم أكثر.",
    "התראה שמשהו שאכפת לך ממנו עשוי להיות בסכנה — הדרך של המערכת שלך לחדד את תשומת הלב למה שחשוב ביותר.",
    "あなたが大切にしているものが危険にさらされているかもしれないという警告 — 最も大切なものに注意を向けさせるシステムの働きです。",
    "Une alerte que quelque chose qui vous tient à cœur pourrait être en danger — la façon dont votre système aiguise votre attention vers ce qui compte le plus.",
    "Um alerta de que algo que você valoriza pode estar em risco — a maneira do seu sistema de aguçar sua atenção para o que mais importa.",
    "Un avviso che qualcosa a cui tieni potrebbe essere a rischio — il modo in cui il tuo sistema affina la tua attenzione verso ciò che conta di più.",
    "Ein Alarm, dass etwas, das dir wichtig ist, gefährdet sein könnte — die Art deines Systems, deine Aufmerksamkeit auf das Wesentlichste zu schärfen.",
])
add_translations("fear", "signal", [
    "El miedo no es signo de debilidad; es signo de que algo te importa. El miedo agudiza tu atención y te prepara para proteger. La pregunta más profunda no es '¿cómo dejo de tener miedo?' sino '¿qué amo tanto como para temer perderlo?' El miedo y el amor son dos caras del compromiso — el amor lo profundiza, el miedo aparece cuando percibimos riesgo en lo que amamos.",
    "두려움은 약함의 징후가 아니라, 관심의 징후입니다. 두려움은 주의를 날카롭게 하고 보호할 준비를 합니다. 더 깊은 질문은 '어떻게 두려움을 멈출 수 있을까?'가 아니라 '잃는 것이 두려울 만큼 내가 무엇을 사랑하는가?'입니다. 두려움과 사랑은 헌신의 양면입니다 — 사랑은 그것을 깊게 하고, 두려움은 우리가 사랑하는 것에 위험을 느낄 때 발생합니다.",
    "恐惧不是软弱的标志；而是在乎的标志。恐惧使你的注意力敏锐，让你准备好保护。更深层的问题不是'我怎样才能不害怕？'而是'我爱什么到害怕失去它？'恐惧和爱是承诺的两面——爱加深承诺，恐惧在我们感知到所爱之物面临风险时出现。",
    "الخوف ليس علامة ضعف؛ إنه علامة اهتمام. الخوف يشحذ انتباهك ويعدك للحماية. السؤال الأعمق ليس 'كيف أتوقف عن الخوف؟' بل 'ما الذي أحبه بما يكفي لأخاف فقدانه؟' الخوف والحب وجهان للالتزام — الحب يعمقه، والخوف يحدث عندما ندرك خطرًا على ما نحب.",
    "פחד אינו סימן לחולשה; הוא סימן לאכפתיות. פחד מחדד את תשומת הלב ומכין אותך להגן. השאלה העמוקה יותר אינה 'איך אפסיק לפחד?' אלא 'מה אני אוהב מספיק כדי לפחד לאבד?' פחד ואהבה הם שני צדדים של מחויבות — אהבה מעמיקה אותה, פחד מתרחש כשאנו חשים סיכון למה שאנו אוהבים.",
    "恐れは弱さのしるしではありません。それは大切にしている証です。恐れはあなたの注意を鋭くし、守る準備をさせます。より深い問いは「どうすれば怖くなくなるか？」ではなく、「失うことが怖いほど何を愛しているか？」です。恐れと愛はコミットメントの両面です——愛がそれを深め、恐れは愛するものへのリスクを感じたときに生じます。",
    "La peur n'est pas un signe de faiblesse ; c'est un signe d'attention. La peur aiguise votre attention et vous prépare à protéger. La question profonde n'est pas 'comment arrêter d'avoir peur ?' mais 'qu'est-ce que j'aime assez pour craindre de le perdre ?' La peur et l'amour sont les deux faces de l'engagement — l'amour l'approfondit, la peur survient quand nous percevons un risque pour ce que nous aimons.",
    "O medo não é sinal de fraqueza; é sinal de que você se importa. O medo aguça sua atenção e prepara você para proteger. A pergunta mais profunda não é 'como paro de ter medo?' mas 'o que eu amo o suficiente para temer perder?' Medo e amor são dois lados do compromisso — o amor o aprofunda, o medo surge quando percebemos risco ao que amamos.",
    "La paura non è un segno di debolezza; è un segno di cura. La paura affina la tua attenzione e ti prepara a proteggere. La domanda più profonda non è 'come smetto di aver paura?' ma 'cosa amo abbastanza da temere di perderlo?' Paura e amore sono due facce dell'impegno — l'amore lo approfondisce, la paura si presenta quando percepiamo un rischio per ciò che amiamo.",
    "Angst ist kein Zeichen von Schwäche; sie ist ein Zeichen von Fürsorge. Angst schärft deine Aufmerksamkeit und bereitet dich darauf vor, zu schützen. Die tiefere Frage ist nicht 'Wie höre ich auf, Angst zu haben?' sondern 'Was liebe ich genug, um Angst zu haben, es zu verlieren?' Angst und Liebe sind zwei Seiten des Engagements — Liebe vertieft es, Angst entsteht, wenn wir ein Risiko für das wahrnehmen, was wir lieben.",
])
add_translations("fear", "reflection", [
    "¿Cómo sería quedarte con este miedo y escuchar lo que está protegiendo?",
    "이 두려움과 함께 머물며 그것이 보호하고 있는 것에 귀 기울인다면 어떤 모습일까요?",
    "如果留在这种恐惧中，倾听它在保护什么，会是什么样子？",
    "كيف سيبدو البقاء مع هذا الخوف والاستماع إلى ما يحميه؟",
    "איך ייראה להישאר עם הפחד הזה ולהקשיב למה שהוא מגן עליו?",
    "この恐れと共にいて、それが何を守っているのかに耳を傾けるとしたら、どのような姿になるでしょうか？",
    "À quoi ressemblerait le fait de rester avec cette peur et d'écouter ce qu'elle protège ?",
    "Como seria permanecer com esse medo e ouvir o que ele está protegendo?",
    "Come sarebbe restare con questa paura e ascoltare ciò che sta proteggendo?",
    "Wie würde es aussehen, bei dieser Angst zu bleiben und darauf zu hören, was sie beschützt?",
])
add_inquiry("fear", 0, [
    "¿Qué es lo que me importa y cuál es el riesgo?",
    "내가 소중히 여기는 것은 무엇이며, 위험은 무엇인가?",
    "我在意的是什么，风险是什么？",
    "ما الذي أهتم به، وما هو الخطر؟",
    "מה אכפת לי ממנו, ומהו הסיכון?",
    "私が大切にしているのは何で、リスクは何ですか？",
    "Qu'est-ce qui m'importe et quel est le risque ?",
    "O que me importa e qual é o risco?",
    "A cosa tengo e qual è il rischio?",
    "Was ist mir wichtig und was ist das Risiko?",
])

# ═══ VIGILANCE ═══
add_translations("vigilance", "essence", [
    "Un estado elevado de alerta y observación — tu mente escaneando lo que podría estar cambiando a tu alrededor.",
    "높아진 경계와 주시 상태 — 주변에서 무엇이 변하고 있는지 스캔하는 마음입니다.",
    "一种高度警觉和警惕的状态——你的头脑在扫描周围可能正在发生的变化。",
    "حالة متزايدة من اليقظة والمراقبة — عقلك يمسح ما قد يتغير من حولك.",
    "מצב מוגבר של ערנות וצפייה — המוח שלך סורק מה עשוי להשתנות סביבך.",
    "高まった警戒と注意深さの状態 — あなたの周囲で何が変わりつつあるかを脳がスキャンしています。",
    "Un état accru de vigilance et d'observation — votre esprit scanne ce qui pourrait changer autour de vous.",
    "Um estado elevado de alerta e observação — sua mente escaneando o que pode estar mudando ao seu redor.",
    "Uno stato di allerta e osservazione accentuato — la tua mente scansiona ciò che potrebbe cambiare intorno a te.",
    "Ein erhöhter Zustand der Wachsamkeit und Beobachtung — dein Geist scannt, was sich um dich herum verändern könnte.",
])
add_translations("vigilance", "signal", [
    "La vigilancia es una forma intensa de anticipación enfocada en la seguridad. Es tu cerebro en modo de monitoreo activo, buscando señales de cambio. Aunque puede ser agotadora si se mantiene, cumple un propósito: mantenerte un paso adelante. La pregunta es si el escaneo te ayuda a prepararte o te mantiene atrapado en modo reactivo.",
    "경계는 안전에 초점을 맞춘 강렬한 예측의 형태입니다. 뇌가 적극적으로 변화의 신호를 찾는 모니터링 모드에 있습니다. 지속되면 피로할 수 있지만, 한 발 앞서게 해주는 목적이 있습니다. 질문은 이 스캔이 준비에 도움이 되는지, 반응적 모드에 갇히게 하는지입니다.",
    "警觉是一种以安全为中心的强烈预期形式。你的大脑处于主动监控模式，寻找变化的信号。虽然持续下去会令人疲惫，但它有其目的：让你保持领先一步。问题是这种扫描是在帮你做好准备，还是让你困在反应模式中。",
    "اليقظة هي شكل مكثف من الترقب يركز على الأمان. إنه دماغك في وضع المراقبة النشطة، يبحث عن إشارات التغيير. رغم أنها قد تكون مرهقة إذا استمرت، إلا أنها تخدم غرضًا: إبقاؤك متقدمًا بخطوة. السؤال هو ما إذا كان المسح يساعدك على الاستعداد أم يبقيك عالقًا في وضع التفاعل.",
    "ערנות היא צורה אינטנסיבית של ציפייה ממוקדת בביטחון. המוח שלך במצב ניטור פעיל, מחפש סימנים לשינוי. אף שהיא עלולה להיות מתישה אם נמשכת, היא משרתת מטרה: לשמור אותך צעד אחד קדימה. השאלה היא האם הסריקה עוזרת לך להתכונן או שומרת אותך תקוע במצב תגובתי.",
    "警戒は安全に焦点を当てた予測の強い形です。脳が積極的に変化のシグナルを探すモニタリングモードです。持続すると疲れますが、一歩先を行くという目的があります。問いは、このスキャンが準備に役立っているのか、反応モードに留まらせているのかです。",
    "La vigilance est une forme intense d'anticipation centrée sur la sécurité. C'est votre cerveau en mode surveillance active, cherchant des signaux de changement. Bien qu'elle puisse être épuisante si elle persiste, elle sert un objectif : vous garder un pas en avance. La question est de savoir si ce balayage vous aide à vous préparer ou vous maintient en mode réactif.",
    "A vigilância é uma forma intensa de antecipação focada na segurança. É o seu cérebro em modo de monitoramento ativo, procurando sinais de mudança. Embora possa ser exaustiva se mantida, ela serve a um propósito: manter você um passo à frente. A questão é se essa varredura está ajudando você a se preparar ou mantendo-o preso no modo reativo.",
    "La vigilanza è una forma intensa di anticipazione focalizzata sulla sicurezza. È il tuo cervello in modalità di monitoraggio attivo, alla ricerca di segnali di cambiamento. Sebbene possa essere estenuante se prolungata, serve a uno scopo: tenerti un passo avanti. La domanda è se la scansione ti stia aiutando a prepararti o ti tenga bloccato in modalità reattiva.",
    "Wachsamkeit ist eine intensive Form der Erwartung, die auf Sicherheit ausgerichtet ist. Dein Gehirn ist im aktiven Überwachungsmodus und sucht nach Veränderungszeichen. Obwohl sie erschöpfend sein kann, dient sie einem Zweck: dich einen Schritt voraus zu halten. Die Frage ist, ob das Scannen dir hilft, dich vorzubereiten, oder dich im reaktiven Modus festhält.",
])
add_translations("vigilance", "reflection", [
    "¿Tu vigilancia te está ayudando a prepararte, o te está impidiendo estar presente?",
    "당신의 경계가 준비에 도움이 되고 있나요, 아니면 현재에 존재하는 것을 방해하고 있나요?",
    "你的警觉是在帮你准备，还是在阻碍你活在当下？",
    "هل يقظتك تساعدك على الاستعداد، أم تمنعك من أن تكون حاضرًا؟",
    "האם הערנות שלך עוזרת לך להתכונן, או שומרת אותך מלהיות נוכח?",
    "その警戒は準備に役立っていますか、それとも今この瞬間にいることを妨げていますか？",
    "Votre vigilance vous aide-t-elle à vous préparer, ou vous empêche-t-elle d'être présent ?",
    "Sua vigilância está ajudando você a se preparar, ou está impedindo você de estar presente?",
    "La tua vigilanza ti sta aiutando a prepararti, o ti sta impedendo di essere presente?",
    "Hilft dir deine Wachsamkeit, dich vorzubereiten, oder hält sie dich davon ab, präsent zu sein?",
])
add_inquiry("vigilance", 0, [
    "¿Qué viene después?",
    "다음에 무엇이 올까?",
    "接下来会发生什么？",
    "ما الذي سيأتي بعد ذلك؟",
    "מה יבוא אחר כך?",
    "次に何が来るのか？",
    "Qu'est-ce qui vient ensuite ?",
    "O que vem a seguir?",
    "Cosa succederà dopo?",
    "Was kommt als Nächstes?",
])

# ═══ SURPRISE ═══
add_translations("surprise", "essence", [
    "Una sacudida repentina de reconocimiento de que algo inesperado ha sucedido — el sistema de respuesta rápida de tu cerebro ante la novedad.",
    "예상치 못한 일이 일어났다는 갑작스러운 인식의 충격 — 새로운 것에 대한 뇌의 빠른 반응 시스템입니다.",
    "突然认识到意外发生了——你大脑对新事物的快速反应系统。",
    "هزة مفاجئة من الإدراك بأن شيئًا غير متوقع قد حدث — نظام الاستجابة السريعة في دماغك للجديد.",
    "זעזוע פתאומי של הכרה שמשהו בלתי צפוי קרה — מערכת התגובה המהירה של המוח שלך לחידוש.",
    "予期せぬことが起きたという突然の認識の衝撃 — 新しいものに対する脳の即応システムです。",
    "Un sursaut soudain de reconnaissance que quelque chose d'inattendu s'est produit — le système de réponse rapide de votre cerveau face à la nouveauté.",
    "Um sobressalto repentino de reconhecimento de que algo inesperado aconteceu — o sistema de resposta rápida do seu cérebro à novidade.",
    "Un sussulto improvviso di riconoscimento che qualcosa di inaspettato è accaduto — il sistema di risposta rapida del tuo cervello alla novità.",
    "Ein plötzlicher Ruck des Erkennens, dass etwas Unerwartetes geschehen ist — das Schnellreaktionssystem deines Gehirns auf Neues.",
])
add_translations("surprise", "signal", [
    "La sorpresa interrumpe tu modelo mental actual y fuerza una actualización. Sirve tanto a la seguridad (algo cambió — ¡adáptate!) como al crecimiento (algo nuevo — ¡aprende!). La sorpresa es la emoción que conecta lo familiar con lo desconocido. Es breve, pero abre una ventana donde eres especialmente receptivo a nueva información.",
    "놀라움은 현재의 정신 모델을 중단시키고 업데이트를 강제합니다. 안전(무언가 변했다 — 적응하라!)과 성장(새로운 것 — 배워라!) 모두에 기여합니다. 놀라움은 익숙한 것과 미지의 것을 연결하는 감정입니다. 잠깐이지만, 새로운 정보에 특히 수용적인 창을 엽니다.",
    "惊讶中断了你当前的心理模型并迫使更新。它同时服务于安全（有变化——适应！）和成长（有新东西——学习！）。惊讶是连接熟悉与未知的情感。它很短暂，但打开了一扇你特别容易接收新信息的窗户。",
    "المفاجأة تقطع نموذجك الذهني الحالي وتفرض تحديثًا. إنها تخدم الأمان (شيء تغير — تكيف!) والنمو (شيء جديد — تعلم!). المفاجأة هي العاطفة التي تربط المألوف بالمجهول. إنها قصيرة، لكنها تفتح نافذة تكون فيها متقبلاً بشكل خاص للمعلومات الجديدة.",
    "הפתעה מפסיקה את המודל המנטלי הנוכחי שלך ומכריחה עדכון. היא משרתת גם ביטחון (משהו השתנה — הסתגל!) וגם צמיחה (משהו חדש — למד!). הפתעה היא הרגש שמגשר בין המוכר לבלתי ידוע. היא קצרה, אך פותחת חלון שבו אתה פתוח במיוחד למידע חדש.",
    "驚きは現在のメンタルモデルを中断し、更新を強制します。安全（何かが変わった — 適応せよ！）と成長（何か新しい — 学べ！）の両方に役立ちます。驚きは馴染みのあるものと未知のものを橋渡しする感情です。瞬間的ですが、新しい情報に特に受容的になる窓を開きます。",
    "La surprise interrompt votre modèle mental actuel et force une mise à jour. Elle sert à la fois la sécurité (quelque chose a changé — adaptez-vous !) et la croissance (quelque chose de nouveau — apprenez !). La surprise est l'émotion qui relie le familier à l'inconnu. Elle est brève, mais elle ouvre une fenêtre où vous êtes particulièrement réceptif aux nouvelles informations.",
    "A surpresa interrompe seu modelo mental atual e força uma atualização. Serve tanto à segurança (algo mudou — adapte-se!) quanto ao crescimento (algo novo — aprenda!). A surpresa é a emoção que conecta o familiar ao desconhecido. É breve, mas abre uma janela onde você está especialmente receptivo a novas informações.",
    "La sorpresa interrompe il tuo modello mentale attuale e forza un aggiornamento. Serve sia alla sicurezza (qualcosa è cambiato — adattati!) che alla crescita (qualcosa di nuovo — impara!). La sorpresa è l'emozione che collega il familiare all'ignoto. È breve, ma apre una finestra in cui sei particolarmente ricettivo a nuove informazioni.",
    "Überraschung unterbricht dein aktuelles Denkmodell und erzwingt ein Update. Sie dient sowohl der Sicherheit (etwas hat sich verändert — passe dich an!) als auch dem Wachstum (etwas Neues — lerne!). Überraschung ist die Emotion, die das Vertraute mit dem Unbekannten verbindet. Sie ist kurz, aber öffnet ein Fenster, in dem du besonders empfänglich für neue Informationen bist.",
])
add_translations("surprise", "reflection", [
    "Cuando te sorprendes, ¿qué te dice tu primera reacción sobre lo que esperabas?",
    "놀랐을 때, 첫 번째 반응은 당신이 무엇을 기대하고 있었는지에 대해 무엇을 말해주나요?",
    "当你感到惊讶时，你的第一反应告诉你关于你期望什么的信息？",
    "عندما تُفاجأ، ماذا يخبرك رد فعلك الأول عما كنت تتوقعه؟",
    "כשאתה מופתע, מה התגובה הראשונה שלך מגלה על מה שציפית?",
    "驚いたとき、最初の反応はあなたが何を期待していたかについて何を教えてくれますか？",
    "Quand vous êtes surpris, que vous dit votre première réaction sur ce que vous attendiez ?",
    "Quando você se surpreende, o que sua primeira reação lhe diz sobre o que estava esperando?",
    "Quando sei sorpreso, cosa ti dice la tua prima reazione su ciò che ti aspettavi?",
    "Was sagt dir deine erste Reaktion, wenn du überrascht wirst, darüber, was du erwartet hast?",
])
add_inquiry("surprise", 0, [
    "¿Qué acaba de cambiar y cómo necesito adaptarme?",
    "무엇이 방금 변했고, 어떻게 적응해야 하는가?",
    "刚刚发生了什么变化，我需要如何适应？",
    "ما الذي تغير للتو، وكيف أحتاج للتكيف؟",
    "מה השתנה זה עתה, ואיך אני צריך להסתגל?",
    "何が変わったのか、そしてどう適応すべきか？",
    "Qu'est-ce qui vient de changer et comment dois-je m'adapter ?",
    "O que acabou de mudar e como preciso me adaptar?",
    "Cosa è appena cambiato e come devo adattarmi?",
    "Was hat sich gerade verändert und wie muss ich mich anpassen?",
])
add_inquiry("surprise", 1, [
    "¿Qué hay de nuevo aquí para que yo aprenda?",
    "여기에서 내가 배울 새로운 것은 무엇인가?",
    "这里有什么新东西值得我学习？",
    "ما الجديد هنا لأتعلمه؟",
    "מה חדש כאן שאני יכול ללמוד?",
    "ここで学ぶべき新しいことは何ですか？",
    "Qu'y a-t-il de nouveau ici pour moi à apprendre ?",
    "O que há de novo aqui para eu aprender?",
    "Cosa c'è di nuovo qui da imparare?",
    "Was gibt es hier Neues für mich zu lernen?",
])

# ═══ LONELINESS ═══
add_translations("loneliness", "essence", [
    "Un dolor persistente de desconexión — una señal de que tu necesidad de contacto humano significativo no está siendo satisfecha.",
    "단절감의 아픔 — 의미 있는 인간적 접촉에 대한 욕구가 충족되지 않고 있다는 신호입니다.",
    "一种持续的断裂感——你对有意义的人际接触的需求未被满足的信号。",
    "شعور مؤلم بالانفصال — إشارة إلى أن حاجتك للتواصل الإنساني المعنوي غير ملباة.",
    "כאב מכרסם של ניתוק — אות שהצורך שלך במגע אנושי משמעותי אינו מסופק.",
    "痛みを伴う断絶感 — 意味のある人間的つながりの必要が満たされていないというシグナルです。",
    "Un sentiment douloureux de déconnexion — un signal que votre besoin de contact humain significatif n'est pas satisfait.",
    "Um sentimento doloroso de desconexão — um sinal de que sua necessidade de contato humano significativo não está sendo atendida.",
    "Un senso doloroso di disconnessione — un segnale che il tuo bisogno di contatto umano significativo non è soddisfatto.",
    "Ein schmerzhaftes Gefühl der Trennung — ein Signal, dass dein Bedürfnis nach bedeutungsvollem menschlichem Kontakt unerfüllt ist.",
])
add_translations("loneliness", "signal", [
    "La soledad no es lo mismo que estar solo. Puedes estar rodeado de personas y sentirte solo, o estar a solas y sentirte conectado. La soledad es una señal sobre la calidad de la conexión, no la cantidad. Pregunta: ¿pertenezco? ¿Me ven? A veces señala desconexión de otros; a veces se trata de desconexión de ti mismo.",
    "외로움은 혼자 있는 것과 같지 않습니다. 사람들에 둘러싸여 있어도 외로울 수 있고, 혼자 있어도 연결된 느낌을 받을 수 있습니다. 외로움은 연결의 양이 아니라 질에 대한 신호입니다. 나는 소속되어 있는가? 나는 보이는가? 때로는 타인과의 단절을, 때로는 자신과의 단절을 가리킵니다.",
    "孤独不等于独处。你可以被人群包围却感到孤独，也可以独自一人却感到连接。孤独是关于连接质量的信号，而非数量。它在检查：我属于这里吗？有人看到我吗？有时它指向与他人的断裂；有时是与自己的断裂。",
    "الوحدة ليست نفس الشيء مثل الوحدة الجسدية. يمكنك أن تكون محاطًا بالناس وتشعر بالوحدة، أو أن تكون وحدك وتشعر بالتواصل. الوحدة إشارة عن جودة التواصل، لا الكمية. إنها تسأل: هل أنتمي؟ هل يراني أحد؟ أحيانًا تشير إلى انفصال عن الآخرين؛ وأحيانًا عن انفصال عن نفسك.",
    "בדידות אינה אותו דבר כמו להיות לבד. אתה יכול להיות מוקף באנשים ולהרגיש בודד, או להיות לבד ולהרגיש מחובר. בדידות היא אות על איכות החיבור, לא הכמות. היא בודקת: האם אני שייך? האם רואים אותי? לפעמים היא מצביעה על ניתוק מאחרים; לפעמים על ניתוק מעצמך.",
    "孤独は一人でいることと同じではありません。人に囲まれていても孤独を感じることがあり、一人でいてもつながりを感じることがあります。孤独はつながりの量ではなく質についてのシグナルです。私は属しているか？見てもらえているか？時に他者との断絶を、時に自分自身との断絶を示しています。",
    "La solitude n'est pas la même chose qu'être seul. Vous pouvez être entouré de gens et vous sentir seul, ou être seul et vous sentir connecté. La solitude est un signal sur la qualité de la connexion, pas la quantité. Elle demande : est-ce que j'appartiens ? Suis-je vu ? Parfois elle pointe vers une déconnexion des autres ; parfois vers une déconnexion de soi-même.",
    "A solidão não é o mesmo que estar sozinho. Você pode estar cercado de pessoas e sentir-se solitário, ou estar sozinho e sentir-se conectado. A solidão é um sinal sobre a qualidade da conexão, não a quantidade. Ela pergunta: eu pertenço? Eu sou visto? Às vezes aponta para desconexão dos outros; às vezes trata-se de desconexão de si mesmo.",
    "La solitudine non è la stessa cosa di essere soli. Puoi essere circondato da persone e sentirti solo, o essere solo e sentirti connesso. La solitudine è un segnale sulla qualità della connessione, non sulla quantità. Chiede: appartengo? Sono visto? A volte indica disconnessione dagli altri; a volte riguarda la disconnessione da se stessi.",
    "Einsamkeit ist nicht dasselbe wie Alleinsein. Du kannst von Menschen umgeben sein und dich einsam fühlen, oder allein sein und dich verbunden fühlen. Einsamkeit ist ein Signal über die Qualität der Verbindung, nicht die Menge. Sie fragt: Gehöre ich dazu? Werde ich gesehen? Manchmal deutet sie auf Trennung von anderen hin; manchmal auf Trennung von dir selbst.",
])
add_translations("loneliness", "reflection", [
    "¿Esta soledad se trata de necesitar más personas, o de necesitar una conexión más profunda con las personas — o la persona — que ya están aquí?",
    "이 외로움은 더 많은 사람이 필요한 것인가요, 아니면 이미 여기 있는 사람들 — 또는 그 사람 — 과의 더 깊은 연결이 필요한 것인가요?",
    "这种孤独是关于需要更多的人，还是需要与已经在这里的人——或者那个人——更深层的连接？",
    "هل هذه الوحدة تتعلق بالحاجة إلى المزيد من الناس، أم بالحاجة إلى تواصل أعمق مع الناس — أو الشخص — الموجودين بالفعل هنا؟",
    "האם הבדידות הזו עוסקת בצורך ביותר אנשים, או בצורך בחיבור עמוק יותר עם האנשים — או האדם — שכבר כאן?",
    "この孤独は、より多くの人が必要なのでしょうか、それとも既にここにいる人々 — あるいはその人 — とのより深いつながりが必要なのでしょうか？",
    "Cette solitude est-elle liée au besoin de plus de gens, ou au besoin d'une connexion plus profonde avec les personnes — ou la personne — déjà présentes ?",
    "Essa solidão é sobre precisar de mais pessoas, ou sobre precisar de uma conexão mais profunda com as pessoas — ou a pessoa — que já estão aqui?",
    "Questa solitudine riguarda il bisogno di più persone, o il bisogno di una connessione più profonda con le persone — o la persona — che sono già qui?",
    "Geht es bei dieser Einsamkeit darum, mehr Menschen zu brauchen, oder um eine tiefere Verbindung mit den Menschen — oder der Person — die bereits da sind?",
])
add_inquiry("loneliness", 0, [
    "¿Estoy desconectado de otros o de mí mismo?",
    "나는 다른 사람들과 단절되어 있는가, 아니면 나 자신과 단절되어 있는가?",
    "我是与他人断开了连接，还是与自己断开了连接？",
    "هل أنا منفصل عن الآخرين أم عن نفسي؟",
    "האם אני מנותק מאחרים או מעצמי?",
    "他者から断絶しているのか、自分自身から断絶しているのか？",
    "Suis-je déconnecté des autres ou de moi-même ?",
    "Estou desconectado dos outros ou de mim mesmo?",
    "Sono disconnesso dagli altri o da me stesso?",
    "Bin ich von anderen oder von mir selbst getrennt?",
])

# ═══ LOVE ═══
add_translations("love", "essence", [
    "Un sentimiento profundo de conexión, cuidado y calidez — una señal de que algo o alguien realmente te importa.",
    "깊은 연결, 돌봄, 따뜻함의 느낌 — 무언가 또는 누군가가 진정으로 당신에게 중요하다는 신호입니다.",
    "一种深深的连接、关怀和温暖的感觉——某人或某事对你真正重要的信号。",
    "شعور عميق بالتواصل والرعاية والدفء — إشارة إلى أن شيئًا أو شخصًا مهم حقًا لك.",
    "תחושה עמוקה של חיבור, דאגה וחום — אות שמשהו או מישהו באמת חשובים לך.",
    "深いつながり、思いやり、温かさの感情 — 何かまたは誰かがあなたにとって本当に大切だというシグナルです。",
    "Un sentiment profond de connexion, de soin et de chaleur — un signal que quelque chose ou quelqu'un compte vraiment pour vous.",
    "Um sentimento profundo de conexão, cuidado e calor — um sinal de que algo ou alguém realmente importa para você.",
    "Un sentimento profondo di connessione, cura e calore — un segnale che qualcosa o qualcuno conta davvero per te.",
    "Ein tiefes Gefühl der Verbundenheit, Fürsorge und Wärme — ein Signal, dass dir etwas oder jemand wirklich wichtig ist.",
])
add_translations("love", "signal", [
    "El amor es tu sistema diciendo: invierte aquí. Profundiza el compromiso y crea vínculos que vale la pena proteger. El amor no es solo calidez — también es lo que hace posible el miedo, el duelo y los celos, porque solo tememos perder lo que amamos. El amor y el miedo son ambos sobre compromiso; el amor profundiza nuestro compromiso, y el miedo aparece cuando percibimos riesgo en lo que amamos.",
    "사랑은 당신의 시스템이 말하는 것입니다: 여기에 투자하라. 헌신을 깊게 하고 보호할 가치가 있는 유대를 만듭니다. 사랑은 단순한 따뜻함이 아닙니다 — 두려움, 비탄, 질투를 가능하게 하는 것이기도 합니다. 왜냐하면 우리는 사랑하는 것만 잃을까 두려워하기 때문입니다. 사랑과 두려움은 모두 헌신에 관한 것입니다.",
    "爱是你的系统在说：投资这里。它加深承诺并创造值得保护的纽带。爱不仅仅是温暖——它也使恐惧、悲痛和嫉妒成为可能，因为我们只害怕失去我们所爱的。爱和恐惧都关乎承诺——爱加深我们的承诺，恐惧出现在我们感知到所爱之物面临风险时。",
    "الحب هو نظامك يقول: استثمر هنا. إنه يعمق الالتزام ويخلق روابط تستحق الحماية. الحب ليس مجرد دفء — إنه أيضًا ما يجعل الخوف والحزن والغيرة ممكنة، لأننا نخشى فقط فقدان ما نحبه. الحب والخوف كلاهما عن الالتزام؛ الحب يعمق التزامنا، والخوف يحدث عندما ندرك خطرًا على ما نحب.",
    "אהבה היא המערכת שלך אומרת: השקע כאן. היא מעמיקה מחויבות ויוצרת קשרים שכדאי להגן עליהם. אהבה אינה רק חום — היא גם מה שהופך פחד, אבל וקנאה לאפשריים, כי אנחנו פוחדים לאבד רק את מה שאנחנו אוהבים. אהבה ופחד שניהם עוסקים במחויבות; אהבה מעמיקה את מחויבותנו, ופחד מתרחש כשאנו חשים סיכון למה שאנו אוהבים.",
    "愛はあなたのシステムが伝えていること：ここに投資せよ。コミットメントを深め、守る価値のある絆を作ります。愛は温かさだけではありません——恐れ、悲嘆、嫉妬を可能にするものでもあります。なぜなら、私たちは愛するものを失うことだけを恐れるからです。愛と恐れはどちらもコミットメントについてです。",
    "L'amour est votre système qui dit : investissez ici. Il approfondit l'engagement et crée des liens qui méritent d'être protégés. L'amour n'est pas seulement de la chaleur — c'est aussi ce qui rend la peur, le deuil et la jalousie possibles, car nous ne craignons de perdre que ce que nous aimons. L'amour et la peur concernent tous deux l'engagement.",
    "O amor é o seu sistema dizendo: invista aqui. Ele aprofunda o compromisso e cria laços que valem a pena proteger. O amor não é apenas calor — é também o que torna o medo, o luto e o ciúme possíveis, porque só tememos perder o que amamos. Amor e medo são ambos sobre compromisso.",
    "L'amore è il tuo sistema che dice: investi qui. Approfondisce l'impegno e crea legami che vale la pena proteggere. L'amore non è solo calore — è anche ciò che rende possibili paura, lutto e gelosia, perché temiamo di perdere solo ciò che amiamo. Amore e paura riguardano entrambi l'impegno.",
    "Liebe ist dein System, das sagt: Investiere hier. Sie vertieft das Engagement und schafft Bindungen, die es wert sind, geschützt zu werden. Liebe ist nicht nur Wärme — sie macht auch Angst, Trauer und Eifersucht möglich, weil wir nur fürchten zu verlieren, was wir lieben. Liebe und Angst handeln beide von Engagement.",
])
add_translations("love", "reflection", [
    "¿Qué cambiaría si siguieras a donde te lleva este sentimiento? Para más, intenta hacer clic en uno de los compañeros mensajeros del Amor en la parte inferior de la pantalla.",
    "이 감정이 이끄는 곳을 따라간다면 무엇이 달라질까요? 더 알아보려면, 화면 하단에서 사랑의 동료 메신저 중 하나를 클릭해 보세요.",
    "如果你跟随这种感觉的指引，会有什么变化？想了解更多，请尝试点击屏幕底部爱的同伴信使之一。",
    "ما الذي سيتغير إذا اتبعت إلى أين يقودك هذا الشعور؟ لمزيد من المعلومات، حاول النقر على أحد رفاق الحب من أسفل الشاشة.",
    "מה ישתנה אם תלך לאן שהרגש הזה מוביל? למידע נוסף, נסה ללחוץ על אחד ממלווי האהבה בתחתית המסך.",
    "この感情が導くところに従ったら、何が変わるでしょうか？もっと知るには、画面下部にある愛の仲間メッセンジャーの一つをクリックしてみてください。",
    "Que changerait le fait de suivre où ce sentiment vous mène ? Pour en savoir plus, essayez de cliquer sur l'un des compagnons messagers de l'Amour en bas de l'écran.",
    "O que mudaria se você seguisse para onde esse sentimento leva? Para mais, tente clicar em um dos companheiros mensageiros do Amor na parte inferior da tela.",
    "Cosa cambierebbe se seguissi dove questo sentimento ti porta? Per saperne di più, prova a cliccare su uno dei compagni messaggeri dell'Amore in fondo allo schermo.",
    "Was würde sich ändern, wenn du diesem Gefühl folgst? Für mehr, versuche, auf einen von Liebes Begleit-Botschaftern am unteren Bildschirmrand zu klicken.",
])
add_inquiry("love", 0, [
    "¿Qué vínculos vale la pena valorar y fortalecer?",
    "어떤 유대가 소중히 여기고 강화할 가치가 있는가?",
    "哪些纽带值得珍惜和加强？",
    "ما الروابط التي تستحق التقدير والتقوية؟",
    "אילו קשרים כדאי לטפח ולחזק?",
    "どの絆を大切にし、強めるべきですか？",
    "Quels liens méritent d'être chéris et renforcés ?",
    "Quais laços valem a pena valorizar e fortalecer?",
    "Quali legami vale la pena custodire e rafforzare?",
    "Welche Bindungen sind es wert, geschätzt und gestärkt zu werden?",
])
add_inquiry("love", 1, [
    "¿Qué me importa tanto que temo perderlo?",
    "잃는 것이 두려울 만큼 나에게 무엇이 소중한가?",
    "我如此在意什么以至于害怕失去它？",
    "ما الذي أهتم به كثيرًا لدرجة أنني أخشى فقدانه؟",
    "מה כל כך חשוב לי שאני פוחד לאבד אותו?",
    "失うことが怖いほど大切にしているものは何ですか？",
    "Qu'est-ce qui m'importe tant que je crains de le perdre ?",
    "O que me importa tanto que temo perdê-lo?",
    "A cosa tengo così tanto da temere di perderlo?",
    "Was ist mir so wichtig, dass ich fürchte, es zu verlieren?",
])

# ═══ JEALOUSY ═══
add_translations("jealousy", "essence", [
    "Una aguda conciencia de lo que otros tienen y tú deseas — una señal sobre posesión, deseo y lo que crees merecer.",
    "다른 사람이 가진 것에 대한 날카로운 인식 — 소유, 욕망, 그리고 자신이 받을 자격이 있다고 믿는 것에 대한 신호입니다.",
    "对他人拥有而你渴望之物的敏锐意识——关于拥有、欲望和你认为自己应得之物的信号。",
    "وعي حاد بما يملكه الآخرون وأنت تريده — إشارة عن الملكية والرغبة وما تؤمن أنك تستحقه.",
    "מודעות חדה למה שיש לאחרים ואתה רוצה — אות על בעלות, רצון ומה שאתה מאמין שמגיע לך.",
    "他者が持っていてあなたが欲しいものへの鋭い気づき — 所有、欲求、そして自分が値すると信じるものについてのシグナルです。",
    "Une conscience aiguë de ce que les autres ont et que vous désirez — un signal sur la possession, le désir et ce que vous croyez mériter.",
    "Uma consciência aguda do que os outros têm e você deseja — um sinal sobre posse, desejo e o que você acredita merecer.",
    "Una consapevolezza acuta di ciò che gli altri hanno e tu desideri — un segnale su possesso, desiderio e ciò che credi di meritare.",
    "Ein scharfes Bewusstsein für das, was andere haben und du willst — ein Signal über Besitz, Verlangen und was du glaubst zu verdienen.",
])
add_translations("jealousy", "signal", [
    "Los celos a menudo se rechazan como algo 'feo', pero llevan información real. Preguntan: ¿qué quiero? ¿Qué siento que me falta? La gratitud y los celos son ambos sobre posesión — ¿qué tenemos? ¿Qué estamos trabajando para tener? ¿Qué merecemos? En lugar de avergonzarte por los celos, intenta escuchar hacia dónde te señalan.",
    "질투는 종종 '못생긴' 것으로 거부되지만, 진짜 정보를 담고 있습니다. 묻습니다: 내가 무엇을 원하는가? 무엇이 부족하다고 느끼는가? 감사와 질투는 모두 소유에 관한 것입니다 — 우리가 가진 것은? 우리가 가지려고 노력하는 것은? 우리가 받을 자격이 있는 것은? 질투를 부끄러워하기보다, 그것이 가리키는 것에 귀 기울여 보세요.",
    "嫉妒常被视为'丑陋'的情感而被拒绝，但它携带着真实的信息。它问：我想要什么？我觉得缺少什么？感恩和嫉妒都关乎拥有——我们拥有什么？我们在努力获取什么？我们值得什么？与其为嫉妒感到羞耻，不如尝试倾听它指向的方向。",
    "غالبًا ما تُرفض الغيرة باعتبارها 'قبيحة'، لكنها تحمل معلومات حقيقية. تسأل: ماذا أريد؟ ما الذي أشعر بأنه ينقصني؟ الامتنان والغيرة كلاهما عن الملكية — ماذا لدينا؟ ماذا نعمل للحصول عليه؟ ماذا نستحق؟ بدلاً من الشعور بالخجل من الغيرة، حاول الاستماع إلى ما تشير إليه.",
    "קנאה נדחית לעיתים קרובות כ'מכוערת', אך היא נושאת מידע אמיתי. היא שואלת: מה אני רוצה? מה אני מרגיש שחסר לי? הכרת תודה וקנאה שתיהן עוסקות בבעלות — מה יש לנו? מה אנחנו עובדים כדי להשיג? מה מגיע לנו? במקום להתבייש בקנאה, נסה להקשיב לאן היא מפנה אותך.",
    "嫉妬はしばしば「醜い」として拒絶されますが、本当の情報を持っています。問いかけます：何が欲しいのか？何が足りないと感じているのか？感謝と嫉妬はどちらも所有についてです — 何を持っているか？何のために努力しているか？何に値するか？嫉妬を恥じるのではなく、それが何を指し示しているかに耳を傾けてみてください。",
    "La jalousie est souvent rejetée comme 'laide', mais elle porte une vraie information. Elle demande : que veux-je ? Qu'est-ce que je sens qui me manque ? La gratitude et la jalousie concernent toutes deux la possession — qu'avons-nous ? Que travaillons-nous à avoir ? Que méritons-nous ? Au lieu de vous culpabiliser pour la jalousie, essayez d'écouter ce qu'elle vous indique.",
    "O ciúme é frequentemente rejeitado como 'feio', mas carrega informação real. Pergunta: o que eu quero? O que sinto que está faltando? Gratidão e ciúme são ambos sobre posse — o que temos? O que estamos trabalhando para ter? O que merecemos? Em vez de se envergonhar pelo ciúme, tente ouvir para onde ele está apontando.",
    "La gelosia è spesso rifiutata come 'brutta', ma porta informazioni reali. Chiede: cosa voglio? Cosa sento che mi manca? Gratitudine e gelosia riguardano entrambe il possesso — cosa abbiamo? Per cosa stiamo lavorando? Cosa meritiamo? Invece di vergognarti della gelosia, prova ad ascoltare verso cosa ti sta indicando.",
    "Eifersucht wird oft als 'hässlich' abgelehnt, aber sie trägt echte Information. Sie fragt: Was will ich? Was fehlt mir? Dankbarkeit und Eifersucht handeln beide von Besitz — was haben wir? Woran arbeiten wir? Was verdienen wir? Anstatt dich für Eifersucht zu schämen, versuche zuzuhören, worauf sie dich hinweist.",
])
add_translations("jealousy", "reflection", [
    "¿Qué te están diciendo estos celos sobre lo que realmente deseas — y es algo por lo que puedes trabajar?",
    "이 질투는 당신이 실제로 원하는 것에 대해 무엇을 말해주고 있나요 — 그리고 그것은 노력할 수 있는 것인가요?",
    "这种嫉妒告诉你关于你真正想要什么——那是你可以努力争取的东西吗？",
    "ما الذي تخبرك به هذه الغيرة عما تريده حقًا — وهل هو شيء يمكنك العمل نحوه؟",
    "מה הקנאה הזו אומרת לך על מה שאתה באמת רוצה — והאם זה משהו שאתה יכול לעבוד לקראתו?",
    "この嫉妬は、あなたが実際に何を望んでいるかについて何を教えていますか——それは努力できることですか？",
    "Que vous dit cette jalousie sur ce que vous voulez vraiment — et est-ce quelque chose vers quoi vous pouvez travailler ?",
    "O que esse ciúme está dizendo sobre o que você realmente quer — e é algo para o qual você pode trabalhar?",
    "Cosa ti sta dicendo questa gelosia su ciò che vuoi davvero — ed è qualcosa verso cui puoi lavorare?",
    "Was sagt dir diese Eifersucht darüber, was du wirklich willst — und ist es etwas, woran du arbeiten kannst?",
])
add_inquiry("jealousy", 0, [
    "¿Deseo lo que otros parecen tener?",
    "다른 사람들이 가진 것처럼 보이는 것을 원하는가?",
    "我想要别人看起来拥有的东西吗？",
    "هل أريد ما يبدو أن الآخرين يملكونه؟",
    "האם אני רוצה את מה שנראה שיש לאחרים?",
    "他の人が持っているように見えるものが欲しいですか？",
    "Est-ce que je veux ce que les autres semblent avoir ?",
    "Eu quero o que os outros parecem ter?",
    "Desidero ciò che gli altri sembrano avere?",
    "Will ich das, was andere zu haben scheinen?",
])
add_inquiry("jealousy", 1, [
    "¿Me estoy quedando atrás de donde quiero estar?",
    "내가 원하는 곳에서 뒤처지고 있는가?",
    "我是否落后于我想要到达的地方？",
    "هل أتأخر عن المكان الذي أريد أن أكون فيه؟",
    "האם אני נשאר מאחור ממקום שבו אני רוצה להיות?",
    "なりたい自分から遅れをとっていますか？",
    "Suis-je en retard par rapport à où je veux être ?",
    "Estou ficando para trás de onde quero estar?",
    "Sto restando indietro rispetto a dove voglio essere?",
    "Bleibe ich hinter dem zurück, wo ich sein möchte?",
])

# ═══ SHAME ═══
add_translations("shame", "essence", [
    "Un sentimiento doloroso de quedarse corto — una señal sobre la brecha entre quién eres y quién tú o tu comunidad espera que seas.",
    "부족함에 대한 고통스러운 감정 — 당신이 누구인지와 당신 또는 공동체가 기대하는 사이의 간극에 대한 신호입니다.",
    "一种痛苦的不够好的感觉——关于你是谁与你或你的社区期望你成为的人之间差距的信号。",
    "شعور مؤلم بالتقصير — إشارة عن الفجوة بين من أنت ومن يتوقع منك أنت أو مجتمعك أن تكون.",
    "תחושה כואבת של אי-עמידה בציפיות — אות על הפער בין מי שאתה לבין מי שאתה או הקהילה שלך מצפה שתהיה.",
    "不十分さの痛みを伴う感情 — あなたが誰であるかと、あなたやコミュニティが期待する姿との間のギャップについてのシグナルです。",
    "Un sentiment douloureux de ne pas être à la hauteur — un signal sur l'écart entre qui vous êtes et qui vous ou votre communauté attend que vous soyez.",
    "Um sentimento doloroso de ficar aquém — um sinal sobre a lacuna entre quem você é e quem você ou sua comunidade espera que seja.",
    "Un sentimento doloroso di non essere all'altezza — un segnale sul divario tra chi sei e chi tu o la tua comunità si aspetta che tu sia.",
    "Ein schmerzhaftes Gefühl des Versagens — ein Signal über die Kluft zwischen dem, wer du bist, und dem, was du oder deine Gemeinschaft von dir erwartet.",
])
add_translations("shame", "signal", [
    "La vergüenza a menudo es mal vista. Sí, puede ser profundamente dolorosa. Puede llevar a la autosupresión o al aislamiento. Pero también juega un papel en el desarrollo moral. Nos alerta sobre la pregunta: ¿estoy viviendo según los estándares de mi comunidad? Cuando se usa con conciencia y compasión, esa pregunta se convierte en una brújula hacia la integridad, no solo la conformidad.",
    "수치심은 종종 비난받습니다. 네, 깊이 고통스러울 수 있습니다. 자기 억압이나 철수로 이어질 수 있습니다. 하지만 도덕 발달에서도 역할을 합니다. 나는 내 공동체의 기준에 맞게 살고 있는가? 라는 질문에 경고를 보냅니다. 인식과 연민으로 사용할 때, 그 질문은 순응이 아닌 진정성을 향한 나침반이 됩니다.",
    "羞耻常常被诟病。是的，它可能极其痛苦。它可能导致自我压抑或退缩。但它在道德发展中也扮演着角色。它提醒我们思考：我是否按照社区的标准生活？当带着觉察和慈悲来运用时，这个问题会成为通向正直的指南针，而非仅仅是服从。",
    "الخجل غالبًا ما يُنتقد. نعم، يمكن أن يكون مؤلمًا بعمق. يمكن أن يؤدي إلى كبت الذات أو الانسحاب. لكنه يلعب أيضًا دورًا في التطور الأخلاقي. إنه ينبهنا إلى السؤال: هل أعيش وفقًا لمعايير مجتمعي؟ عندما يُستخدم بوعي وتعاطف، يصبح ذلك السؤال بوصلة نحو النزاهة، لا مجرد الامتثال.",
    "בושה נתפסת לעיתים קרובות בשלילה. כן, היא יכולה להיות כואבת עמוקות. היא יכולה להוביל לדיכוי עצמי או נסיגה. אך היא גם ממלאת תפקיד בהתפתחות המוסרית. היא מתריעה בפנינו על השאלה: האם אני חי לפי הסטנדרטים של הקהילה שלי? כשמשתמשים בה במודעות וחמלה, השאלה הזו הופכת למצפן לעבר יושרה, לא רק ציות.",
    "恥はしばしば非難されます。はい、深く痛いものです。自己抑制や引きこもりにつながることがあります。しかし、道徳の発達においても役割を果たします。私はコミュニティの基準に沿って生きているか？という問いへの警告です。気づきと思いやりを持って使えば、その問いは服従ではなく誠実さへの羅針盤になります。",
    "La honte est souvent décriée. Oui, elle peut être profondément douloureuse. Elle peut mener à l'auto-suppression ou au repli. Mais elle joue aussi un rôle dans le développement moral. Elle nous alerte sur la question : est-ce que je vis selon les standards de ma communauté ? Utilisée avec conscience et compassion, cette question devient une boussole vers l'intégrité, pas seulement la conformité.",
    "A vergonha é frequentemente mal vista. Sim, pode ser profundamente dolorosa. Pode levar à autossupressão ou retraimento. Mas também desempenha um papel no desenvolvimento moral. Ela nos alerta para a pergunta: estou vivendo de acordo com os padrões da minha comunidade? Quando usada com consciência e compaixão, essa pergunta se torna uma bússola para a integridade, não apenas conformidade.",
    "La vergogna è spesso mal vista. Sì, può essere profondamente dolorosa. Può portare all'auto-soppressione o al ritiro. Ma gioca anche un ruolo nello sviluppo morale. Ci avvisa sulla domanda: sto vivendo secondo gli standard della mia comunità? Quando usata con consapevolezza e compassione, quella domanda diventa una bussola verso l'integrità, non solo la conformità.",
    "Scham wird oft verurteilt. Ja, sie kann zutiefst schmerzhaft sein. Sie kann zu Selbstunterdrückung oder Rückzug führen. Aber sie spielt auch eine Rolle in der moralischen Entwicklung. Sie warnt uns vor der Frage: Lebe ich nach den Standards meiner Gemeinschaft? Wenn sie mit Bewusstsein und Mitgefühl genutzt wird, wird diese Frage zu einem Kompass für Integrität, nicht nur Konformität.",
])
add_translations("shame", "reflection", [
    "¿Según las expectativas de quién te estás midiendo — y son realmente tuyas?",
    "당신은 누구의 기대에 맞춰 자신을 측정하고 있나요 — 그리고 그것은 진정으로 당신의 것인가요?",
    "你在用谁的期望来衡量自己——这些期望真的是你自己的吗？",
    "وفقًا لتوقعات من تقيس نفسك — وهل هي حقًا توقعاتك؟",
    "לפי הציפיות של מי אתה מודד את עצמך — והאם הן באמת שלך?",
    "誰の期待に照らして自分を測っていますか——それは本当にあなた自身のものですか？",
    "Selon les attentes de qui vous mesurez-vous — et sont-elles vraiment les vôtres ?",
    "Pelas expectativas de quem você está se medindo — e elas são realmente suas?",
    "Con le aspettative di chi ti stai misurando — e sono davvero le tue?",
    "An wessen Erwartungen misst du dich — und sind sie wirklich deine eigenen?",
])
add_inquiry("shame", 0, [
    "¿Me he quedado corto ante las expectativas?",
    "나는 기대에 미치지 못했는가?",
    "我是否辜负了期望？",
    "هل أخفقت في تلبية التوقعات؟",
    "האם לא עמדתי בציפיות?",
    "期待に応えられなかったのでしょうか？",
    "Ai-je failli aux attentes ?",
    "Fiquei aquém das expectativas?",
    "Non sono stato all'altezza delle aspettative?",
    "Bin ich den Erwartungen nicht gerecht geworden?",
])
add_inquiry("shame", 1, [
    "¿Estoy viviendo según mis propios estándares?",
    "나는 나 자신의 기준에 맞게 살고 있는가?",
    "我是否按照自己的标准生活？",
    "هل أعيش وفقًا لمعاييري الخاصة؟",
    "האם אני חי לפי הסטנדרטים שלי?",
    "自分の基準に沿って生きていますか？",
    "Est-ce que je vis selon mes propres standards ?",
    "Estou vivendo de acordo com meus próprios padrões?",
    "Sto vivendo secondo i miei standard?",
    "Lebe ich nach meinen eigenen Maßstäben?",
])

# Save progress
with open(F, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"Part 2 done: translated trust through shame (8 emotions). File saved.")
