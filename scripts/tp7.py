#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part 7: stress, overwhelm, contentment, courage, disgust, exhaustion"""
import json, os
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "emotion-constellation-more-info-data.json")
with open(F, "r", encoding="utf-8") as f: data = json.load(f)
L = ["es","ko","zh","ar","he","ja","fr","pt","it","de"]
M = {e["id"]: e for e in data["emotions"]}
def at(eid, fld, t):
    for i, loc in enumerate(L): M[eid]["readMore"][fld][loc] = t[i]
def ai(eid, idx, t):
    for i, loc in enumerate(L): M[eid]["needs"][idx]["inquiry"][loc] = t[i]

# ═══ STRESS ═══
at("stress","essence",[
    "La sensación de estar estirado al límite — una señal de que lo que enfrentas se siente más grande que lo que tienes para enfrentarlo.",
    "너무 얇게 늘어난 느낌 — 직면하는 것이 대처할 수 있는 것보다 크게 느껴진다는 신호입니다.",
    "一种被拉得太薄的感觉——你面对的感觉比你用来面对它的资源更大的信号。",
    "شعور بالتمدد الزائد — إشارة إلى أن ما تواجهه يبدو أكبر مما لديك لمواجهته.",
    "תחושה של מתיחות יתר — אות שמה שאתה מתמודד איתו מרגיש גדול ממה שיש לך להתמודד איתו.",
    "薄く引き伸ばされている感覚 — 直面していることが、対処する手段より大きく感じられるというシグナルです。",
    "Un sentiment d'être étiré à l'extrême — un signal que ce que vous affrontez semble plus grand que ce dont vous disposez pour y faire face.",
    "A sensação de estar esticado demais — um sinal de que o que você enfrenta parece maior do que o que você tem para enfrentá-lo.",
    "La sensazione di essere teso al limite — un segnale che ciò che affronti sembra più grande di ciò che hai per affrontarlo.",
    "Das Gefühl, zu dünn gedehnt zu sein — ein Signal, dass das, was du bewältigst, größer erscheint als das, was du dafür hast."
])
at("stress","signal",[
    "El estrés significa que nuestros desafíos percibidos son mayores que nuestros recursos percibidos. Tres ideas clave: el estrés no es automáticamente malo — como otras emociones, es una señal. Está enraizado en la percepción. Y podemos reducir el estrés reuniendo más recursos. El estrés también es una forma de energía. Cuando cambiamos nuestra mentalidad sobre el estrés, podemos transformarlo de algo que nos agota en algo que alimenta la resiliencia.",
    "스트레스는 인지된 도전이 인지된 자원보다 크다는 것을 의미합니다. 세 가지 핵심 통찰: 스트레스는 자동으로 나쁜 것이 아닙니다 — 다른 감정처럼 신호입니다. 인식에 뿌리를 둡니다. 더 많은 자원을 모아 스트레스를 줄일 수 있습니다. 스트레스는 에너지의 한 형태이기도 합니다. 스트레스에 대한 마인드셋을 바꾸면, 소모시키는 것에서 회복력을 키우는 것으로 변환할 수 있습니다.",
    "压力意味着我们感知到的挑战大于我们感知到的资源。三个关键洞察：压力不是自动的坏事——像其他情绪一样，它是一个信号。它根植于感知。我们可以通过收集更多资源来减少压力。压力也是一种能量形式。当我们转变对压力的心态时，可以把它从消耗我们的东西转化为滋养韧性的力量。",
    "الإجهاد يعني أن تحدياتنا المتصورة أكبر من مواردنا المتصورة. ثلاث رؤى رئيسية: الإجهاد ليس سيئًا تلقائيًا — مثل المشاعر الأخرى، إنه إشارة. إنه متجذر في الإدراك. ويمكننا تقليل الإجهاد بجمع المزيد من الموارد. الإجهاد أيضًا شكل من أشكال الطاقة. عندما نغير عقليتنا حول الإجهاد، يمكننا تحويله من شيء يستنزفنا إلى شيء يغذي المرونة.",
    "לחץ אומר שהאתגרים הנתפסים שלנו גדולים מהמשאבים הנתפסים שלנו. שלוש תובנות מפתח: לחץ אינו רע אוטומטית — כמו רגשות אחרים, הוא אות. הוא מושרש בתפיסה. ואנחנו יכולים להפחית לחץ באיסוף יותר משאבים. לחץ הוא גם צורה של אנרגיה. כשאנחנו משנים את הגישה שלנו ללחץ, אנחנו יכולים להפוך אותו ממשהו שמרוקן לדבר שמזין חוסן.",
    "ストレスは、認知された課題が認知された資源より大きいことを意味します。3つの重要な洞察：ストレスは自動的に悪いものではありません — 他の感情と同様、シグナルです。認知に根ざしています。より多くの資源を集めることでストレスを軽減できます。ストレスはエネルギーの一形態でもあります。ストレスに対するマインドセットを変えると、消耗するものからレジリエンスを養うものに変えられます。",
    "Le stress signifie que nos défis perçus sont plus grands que nos ressources perçues. Trois idées clés : le stress n'est pas automatiquement mauvais — comme d'autres émotions, c'est un signal. Il est ancré dans la perception. Et nous pouvons réduire le stress en rassemblant plus de ressources. Le stress est aussi une forme d'énergie. Quand nous changeons notre mentalité sur le stress, nous pouvons le transformer de quelque chose qui nous épuise en quelque chose qui nourrit la résilience.",
    "Estresse significa que nossos desafios percebidos são maiores que nossos recursos percebidos. Três insights chave: estresse não é automaticamente ruim — como outras emoções, é um sinal. Está enraizado na percepção. E podemos reduzir o estresse reunindo mais recursos. Estresse também é uma forma de energia. Quando mudamos nossa mentalidade sobre estresse, podemos transformá-lo de algo que nos drena em algo que alimenta resiliência.",
    "Lo stress significa che le nostre sfide percepite sono più grandi delle nostre risorse percepite. Tre intuizioni chiave: lo stress non è automaticamente negativo — come altre emozioni, è un segnale. È radicato nella percezione. E possiamo ridurre lo stress raccogliendo più risorse. Lo stress è anche una forma di energia. Quando cambiamo la nostra mentalità sullo stress, possiamo trasformarlo da qualcosa che ci prosciuga in qualcosa che alimenta la resilienza.",
    "Stress bedeutet, dass unsere wahrgenommenen Herausforderungen größer sind als unsere wahrgenommenen Ressourcen. Drei zentrale Erkenntnisse: Stress ist nicht automatisch schlecht — wie andere Emotionen ist er ein Signal. Er wurzelt in der Wahrnehmung. Und wir können Stress verringern, indem wir mehr Ressourcen sammeln. Stress ist auch eine Form von Energie. Wenn wir unsere Einstellung zu Stress ändern, können wir ihn von etwas Erschöpfendem in etwas verwandeln, das Resilienz nährt."
])
at("stress","reflection",[
    "¿Qué recursos — internos o externos — podrías reunir para cambiar este equilibrio?",
    "이 균형을 바꾸기 위해 어떤 자원 — 내적이든 외적이든 — 을 모을 수 있나요?",
    "你可以收集什么资源——内在的或外在的——来改变这个平衡？",
    "ما الموارد — الداخلية أو الخارجية — التي يمكنك جمعها لتغيير هذا التوازن؟",
    "אילו משאבים — פנימיים או חיצוניים — אתה יכול לאסוף כדי לשנות את האיזון הזה?",
    "このバランスを変えるために、どんな資源 — 内的または外的 — を集められますか？",
    "Quelles ressources — internes ou externes — pourriez-vous rassembler pour changer cet équilibre ?",
    "Que recursos — internos ou externos — você poderia reunir para mudar esse equilíbrio?",
    "Quali risorse — interne o esterne — potresti raccogliere per cambiare questo equilibrio?",
    "Welche Ressourcen — innere oder äußere — könntest du sammeln, um dieses Gleichgewicht zu verändern?"
])
ai("stress",0,[
    "¿Son mis desafíos mayores que mis recursos?",
    "내 도전이 내 자원보다 큰가?",
    "我的挑战大于我的资源吗？",
    "هل تحدياتي أكبر من مواردي؟",
    "האם האתגרים שלי גדולים מהמשאבים שלי?",
    "私の課題は資源より大きいですか？",
    "Mes défis sont-ils plus grands que mes ressources ?",
    "Meus desafios são maiores que meus recursos?",
    "Le mie sfide sono più grandi delle mie risorse?",
    "Sind meine Herausforderungen größer als meine Ressourcen?"
])
ai("stress",1,[
    "¿Qué necesito priorizar o soltar?",
    "무엇을 우선시하거나 놓아야 하는가?",
    "我需要优先考虑什么或放下什么？",
    "ما الذي أحتاج لتحديد أولوياته أو التخلي عنه؟",
    "מה אני צריך לתעדף או לשחרר?",
    "何を優先し、何を手放す必要がありますか？",
    "Que dois-je prioriser ou lâcher ?",
    "O que preciso priorizar ou deixar ir?",
    "Cosa devo dare priorità o lasciar andare?",
    "Was muss ich priorisieren oder loslassen?"
])

# ═══ OVERWHELM ═══
at("overwhelm","essence",[
    "Una sensación de inundación de demasiado, demasiado rápido — una señal de que tu sistema necesita que desaceleres y recuperes algo de control.",
    "너무 많고, 너무 빠르다는 넘치는 감각 — 당신의 시스템이 속도를 늦추고 통제를 되찾아야 한다는 신호입니다.",
    "一种被太多、太快淹没的感觉——你的系统需要你放慢脚步并重新获得一些控制的信号。",
    "إحساس طاغٍ بالكثير جدًا، بسرعة كبيرة — إشارة إلى أن نظامك يحتاج منك أن تبطئ وتستعيد بعض السيطرة.",
    "תחושה מציפה של יותר מדי, מהר מדי — אות שהמערכת שלך צריכה שתאט ותשיג מחדש שליטה.",
    "多すぎる、速すぎるという溢れる感覚 — システムがスローダウンしてコントロールを取り戻す必要があるというシグナルです。",
    "Une sensation d'inondation de trop, trop vite — un signal que votre système a besoin que vous ralentissiez et repreniez un peu de contrôle.",
    "Uma sensação de inundação de demais, rápido demais — um sinal de que seu sistema precisa que você desacelere e recupere algum controle.",
    "Una sensazione di inondazione di troppo, troppo veloce — un segnale che il tuo sistema ha bisogno che tu rallenti e riacquisti un po' di controllo.",
    "Ein überflutetes Gefühl von zu viel, zu schnell — ein Signal, dass dein System braucht, dass du langsamer wirst und etwas Kontrolle zurückgewinnst."
])
at("overwhelm","signal",[
    "Cuando la abrumación golpea, tu visión se estrecha. Podrías estar pensando en segundos o minutos, quizás horas. Tu cerebro entra en modo triaje. La abrumación conecta seguridad (algo es demasiado para mi sistema) y autonomía (he perdido el poder de elegir). El primer paso es reducir la entrada — no resolver todo, sino encontrar una cosa que puedas controlar. Incluso un pequeño ejercicio de agencia comienza a restaurar el equilibrio.",
    "압도감이 닥치면 시야가 좁아집니다. 초 단위나 분 단위, 기껏해야 시간 단위로 생각하게 됩니다. 뇌가 응급 분류 모드에 들어갑니다. 압도감은 안전(무언가가 내 시스템에 과도하다)과 자율성(선택의 힘을 잃었다)을 연결합니다. 첫 번째 단계는 입력을 줄이는 것입니다 — 모든 것을 해결하는 것이 아니라 통제할 수 있는 한 가지를 찾는 것. 작은 주도권 행사도 균형을 회복하기 시작합니다.",
    "当压倒感来袭时，你的视野变窄。你可能以秒或分钟计算，也许是小时。你的大脑进入分类模式。压倒感连接安全（某些东西对我的系统来说太多了）和自主（我失去了选择的力量）。第一步是减少输入——不是解决一切，而是找到你能控制的一件事。即使一个小小的主动行为也开始恢复平衡。",
    "عندما يضرب الإرهاق، تضيق رؤيتك. قد تفكر بالثواني أو الدقائق، ربما الساعات. دماغك يدخل وضع الفرز. الإرهاق يربط الأمان (شيء ما كثير جدًا على نظامي) والاستقلالية (فقدت القدرة على الاختيار). الخطوة الأولى هي تقليل المدخلات — ليس لحل كل شيء، بل لإيجاد شيء واحد يمكنك التحكم فيه. حتى ممارسة صغيرة للإرادة تبدأ في استعادة التوازن.",
    "כשהצפה פוגעת, שדה הראייה שלך מצטמצם. אתה עשוי לחשוב בשניות או דקות, אולי שעות. המוח נכנס למצב טריאג׳. הצפה מגשרת בין ביטחון (משהו מוגזם למערכת שלי) לאוטונומיה (איבדתי את הכוח לבחור). הצעד הראשון הוא להפחית קלט — לא לפתור הכול, אלא למצוא דבר אחד שאתה יכול לשלוט בו. אפילו מעשה קטן של שליטה מתחיל לשקם איזון.",
    "圧倒されると、視野が狭まります。秒単位や分単位、せいぜい時間単位で考えるかもしれません。脳がトリアージモードに入ります。圧倒は安全（何かが自分のシステムにとって過剰）と自律性（選ぶ力を失った）を橋渡しします。最初のステップは入力を減らすこと — すべてを解決するのではなく、コントロールできる一つを見つけること。小さな主体性の行使でもバランスの回復が始まります。",
    "Quand la submersion frappe, votre vision se rétrécit. Vous pensez peut-être en secondes ou minutes, peut-être en heures. Votre cerveau entre en mode triage. La submersion relie sécurité (quelque chose est trop pour mon système) et autonomie (j'ai perdu le pouvoir de choisir). Le premier pas est de réduire l'entrée — pas de tout résoudre, mais de trouver une chose que vous pouvez contrôler. Même un petit exercice d'agentivité commence à restaurer l'équilibre.",
    "Quando a sobrecarga atinge, sua visão se estreita. Você pode estar pensando em segundos ou minutos, talvez horas. Seu cérebro entra em modo de triagem. A sobrecarga conecta segurança (algo é demais para meu sistema) e autonomia (perdi o poder de escolher). O primeiro passo é reduzir a entrada — não resolver tudo, mas encontrar uma coisa que você pode controlar. Até um pequeno exercício de agência começa a restaurar o equilíbrio.",
    "Quando la sopraffazione colpisce, la tua visione si restringe. Potresti pensare in secondi o minuti, forse ore. Il tuo cervello entra in modalità triage. La sopraffazione collega sicurezza (qualcosa è troppo per il mio sistema) e autonomia (ho perso il potere di scegliere). Il primo passo è ridurre l'input — non risolvere tutto, ma trovare una cosa che puoi controllare. Anche un piccolo esercizio di agentività inizia a ripristinare l'equilibrio.",
    "Wenn Überwältigung zuschlägt, verengt sich dein Blickfeld. Du denkst vielleicht in Sekunden oder Minuten, vielleicht Stunden. Dein Gehirn geht in den Triage-Modus. Überwältigung verbindet Sicherheit (etwas ist zu viel für mein System) und Autonomie (ich habe die Macht zu wählen verloren). Der erste Schritt ist, den Input zu reduzieren — nicht alles zu lösen, sondern eine Sache zu finden, die du kontrollieren kannst. Selbst eine kleine Ausübung von Handlungsfähigkeit beginnt, das Gleichgewicht wiederherzustellen."
])
at("overwhelm","reflection",[
    "¿Qué cosa podrías dejar de lado ahora mismo para crear un poco de espacio?",
    "지금 당장 내려놓을 수 있는 한 가지는 무엇인가요?",
    "你现在可以放下什么来创造一点空间？",
    "ما الشيء الواحد الذي يمكنك وضعه جانبًا الآن لخلق مساحة صغيرة؟",
    "מה דבר אחד שאתה יכול להניח עכשיו כדי ליצור קצת מרחב?",
    "少しの余裕を作るために、今すぐ置くことができるものは何ですか？",
    "Quelle chose pourriez-vous poser maintenant pour créer un peu d'espace ?",
    "O que você poderia deixar de lado agora para criar um pouco de espaço?",
    "Cosa potresti mettere giù adesso per creare un po' di spazio?",
    "Was könntest du jetzt ablegen, um ein wenig Raum zu schaffen?"
])
ai("overwhelm",0,[
    "¿Qué es demasiado ahora mismo?",
    "지금 당장 무엇이 너무 많은가?",
    "现在什么太多了？",
    "ما الذي هو كثير جدًا الآن؟",
    "מה יותר מדי עכשיו?",
    "今、何が多すぎますか？",
    "Qu'est-ce qui est trop en ce moment ?",
    "O que é demais agora?",
    "Cosa è troppo adesso?",
    "Was ist gerade zu viel?"
])
ai("overwhelm",1,[
    "¿Dónde he perdido la capacidad de elegir?",
    "어디서 선택할 능력을 잃었는가?",
    "我在哪里失去了选择的能力？",
    "أين فقدت القدرة على الاختيار؟",
    "היכן איבדתי את היכולת לבחור?",
    "どこで選ぶ能力を失いましたか？",
    "Où ai-je perdu la capacité de choisir ?",
    "Onde perdi a capacidade de escolher?",
    "Dove ho perso la capacità di scegliere?",
    "Wo habe ich die Fähigkeit zu wählen verloren?"
])

# ═══ CONTENTMENT ═══
at("contentment","essence",[
    "Un sentimiento tranquilo y asentado de que las cosas son suficientes — una señal de alineación entre tu vida y tus valores.",
    "사물이 충분하다는 조용하고 안정된 느낌 — 삶과 가치관 사이의 정렬 신호입니다.",
    "一种安静、安定的足够感——你的生活与价值观之间和谐一致的信号。",
    "شعور هادئ ومستقر بأن الأمور كافية — إشارة إلى التوافق بين حياتك وقيمك.",
    "תחושה שקטה ומיושבת שהדברים מספיקים — אות של התאמה בין חייך לערכיך.",
    "物事が十分であるという静かで落ち着いた感覚 — 人生と価値観の間の調和のシグナルです。",
    "Un sentiment calme et posé que les choses sont suffisantes — un signal d'alignement entre votre vie et vos valeurs.",
    "Um sentimento calmo e assentado de que as coisas são suficientes — um sinal de alinhamento entre sua vida e seus valores.",
    "Un sentimento quieto e assestato che le cose sono abbastanza — un segnale di allineamento tra la tua vita e i tuoi valori.",
    "Ein ruhiges, gesetztes Gefühl, dass die Dinge genug sind — ein Signal der Übereinstimmung zwischen deinem Leben und deinen Werten."
])
at("contentment","signal",[
    "Satisfacción y agitación son compañeras — a veces nos sentimos en paz, y a veces la falta de paz nos impulsa al cambio. La satisfacción es fácil de pasar por alto porque no exige atención como las emociones urgentes. Pero es una señal profunda: algo está bien. Conecta seguridad (las cosas están asentadas) y significado (esto se alinea con lo que importa). En una cultura obsesionada con más, la satisfacción pregunta: ¿y si esto es suficiente?",
    "만족과 불안은 짝입니다 — 때로는 평화를 느끼고, 때로는 평화의 부재가 변화를 향해 밀어줍니다. 만족은 긴급한 감정처럼 주의를 요구하지 않기 때문에 간과하기 쉽습니다. 하지만 심오한 신호입니다: 무언가가 맞습니다. 안전(사물이 안정되어 있다)과 의미(이것이 중요한 것과 일치한다)를 연결합니다. 더 많은 것에 집착하는 문화에서 만족은 묻습니다: 이것이면 충분하다면?",
    "满足和不安是伙伴——有时我们感到平静，有时平静的缺乏推动我们改变。满足很容易被忽视，因为它不像紧迫的情绪那样要求关注。但它是一个深刻的信号：某些东西是对的。它连接安全（事物安定了）和意义（这与重要的事一致）。在一个痴迷于更多的文化中，满足问：如果这已经足够了呢？",
    "الرضا والانزعاج شريكان — أحيانًا نشعر بالسلام، وأحيانًا غياب السلام يدفعنا نحو التغيير. الرضا سهل التجاهل لأنه لا يطلب الانتباه كما تفعل المشاعر الملحة. لكنه إشارة عميقة: شيء ما صحيح. يربط الأمان (الأمور مستقرة) والمعنى (هذا يتوافق مع ما يهم). في ثقافة مهووسة بالمزيد، الرضا يسأل: ماذا لو كان هذا كافيًا؟",
    "שביעות רצון ואי-שקט הם שותפים — לפעמים אנחנו מרגישים בשלום, ולפעמים חוסר שלום דוחף אותנו לשינוי. שביעות רצון קל להתעלם ממנה כי היא לא דורשת תשומת לב כמו רגשות דחופים. אבל היא אות עמוק: משהו נכון. היא מגשרת בין ביטחון (דברים מיושבים) למשמעות (זה מתיישב עם מה שחשוב). בתרבות אובססיבית ליותר, שביעות רצון שואלת: מה אם זה מספיק?",
    "満足と焦燥はパートナーです — 時に平和を感じ、時に平和の欠如が変化へと促します。満足は見落としやすいです。緊急の感情のように注意を要求しないからです。しかし深いシグナルです：何かが正しい。安全（物事が落ち着いている）と意味（大切なものと一致している）を橋渡しします。もっとに執着する文化の中で、満足は問います：これで十分だとしたら？",
    "Contentement et agitation sont partenaires — parfois nous nous sentons en paix, et parfois l'absence de paix nous pousse vers le changement. Le contentement est facile à ignorer car il n'exige pas d'attention comme les émotions urgentes. Mais c'est un signal profond : quelque chose est juste. Il relie sécurité (les choses sont apaisées) et sens (cela s'aligne avec ce qui compte). Dans une culture obsédée par le plus, le contentement demande : et si c'était suffisant ?",
    "Contentamento e agitação são parceiros — às vezes nos sentimos em paz, e às vezes a falta de paz nos empurra para a mudança. O contentamento é fácil de ignorar porque não exige atenção como as emoções urgentes. Mas é um sinal profundo: algo está certo. Conecta segurança (as coisas estão assentadas) e significado (isso se alinha com o que importa). Em uma cultura obcecada com mais, o contentamento pergunta: e se isso for suficiente?",
    "Contentezza e agitazione sono partner — a volte ci sentiamo in pace, e a volte la mancanza di pace ci spinge verso il cambiamento. La contentezza è facile da trascurare perché non richiede attenzione come le emozioni urgenti. Ma è un segnale profondo: qualcosa è giusto. Collega sicurezza (le cose sono stabili) e significato (questo è allineato con ciò che conta). In una cultura ossessionata dal di più, la contentezza chiede: e se questo fosse abbastanza?",
    "Zufriedenheit und Unruhe sind Partner — manchmal fühlen wir Frieden, und manchmal treibt uns das Fehlen von Frieden zur Veränderung. Zufriedenheit ist leicht zu übersehen, weil sie nicht so Aufmerksamkeit fordert wie dringende Emotionen. Aber es ist ein tiefes Signal: Etwas stimmt. Es verbindet Sicherheit (die Dinge sind beruhigt) und Sinn (das stimmt mit dem überein, was zählt). In einer Kultur, die von Mehr besessen ist, fragt Zufriedenheit: Was, wenn das genug ist?"
])
at("contentment","reflection",[
    "¿Puedes hacer una pausa y recibir plenamente este sentimiento — sin buscar inmediatamente lo siguiente?",
    "잠시 멈추고 이 느낌을 온전히 받아들일 수 있나요 — 즉시 다음 것을 향하지 않고?",
    "你能暂停并完全接受这种感觉吗——而不是立即去追求下一件事？",
    "هل يمكنك التوقف وتلقي هذا الشعور بالكامل — دون التمدد فورًا نحو الشيء التالي؟",
    "האם אתה יכול לעצור ולקבל את ההרגשה הזו במלואה — בלי מיד לפנות לדבר הבא?",
    "この感覚を十分に受け止めて立ち止まれますか — すぐに次のことに手を伸ばさずに？",
    "Pouvez-vous faire une pause et recevoir pleinement ce sentiment — sans immédiatement chercher la chose suivante ?",
    "Você pode pausar e receber plenamente esse sentimento — sem imediatamente buscar a próxima coisa?",
    "Puoi fermarti e ricevere pienamente questa sensazione — senza cercare subito la prossima cosa?",
    "Kannst du innehalten und dieses Gefühl voll empfangen — ohne sofort nach dem Nächsten zu greifen?"
])
ai("contentment",0,[
    "¿Qué está asentado y en paz ahora mismo?",
    "지금 무엇이 안정되고 평화로운가?",
    "现在什么是安定和平的？",
    "ما الذي مستقر وفي سلام الآن؟",
    "מה מיושב ובשלום עכשיו?",
    "今、何が落ち着いて穏やかですか？",
    "Qu'est-ce qui est apaisé et en paix en ce moment ?",
    "O que está assentado e em paz agora?",
    "Cosa è stabile e in pace adesso?",
    "Was ist gerade beruhigt und friedlich?"
])
ai("contentment",1,[
    "¿Estoy alineado con lo que importa?",
    "중요한 것과 정렬되어 있는가?",
    "我与重要的事一致吗？",
    "هل أنا متوافق مع ما يهم؟",
    "האם אני מתיישר עם מה שחשוב?",
    "大切なものと一致していますか？",
    "Suis-je aligné avec ce qui compte ?",
    "Estou alinhado com o que importa?",
    "Sono allineato con ciò che conta?",
    "Bin ich auf das ausgerichtet, was zählt?"
])

# ═══ COURAGE ═══
at("courage","essence",[
    "Una determinación de avanzar a pesar de la incertidumbre o el riesgo — una señal de que algo te importa lo suficiente como para enfrentar el miedo.",
    "불확실성이나 위험에도 불구하고 앞으로 나아가려는 결의 — 두려움을 마주할 만큼 중요한 무언가가 있다는 신호입니다.",
    "尽管不确定或有风险仍然前进的决心——某些东西足够重要，值得面对恐惧的信号。",
    "عزم على المضي قدمًا رغم عدم اليقين أو الخطر — إشارة إلى أن شيئًا ما يهمك بما يكفي لمواجهة الخوف.",
    "נחישות להתקדם למרות אי-ודאות או סיכון — אות שמשהו חשוב לך מספיק כדי להתמודד עם הפחד.",
    "不確実性やリスクにもかかわらず前に進む決意 — 恐れに向き合うほど大切なものがあるというシグナルです。",
    "Une résolution d'avancer malgré l'incertitude ou le risque — un signal que quelque chose vous importe assez pour affronter la peur.",
    "Uma determinação de seguir em frente apesar da incerteza ou risco — um sinal de que algo importa o suficiente para enfrentar o medo.",
    "Una determinazione ad andare avanti nonostante l'incertezza o il rischio — un segnale che qualcosa ti importa abbastanza da affrontare la paura.",
    "Eine Entschlossenheit, trotz Unsicherheit oder Risiko voranzugehen — ein Signal, dass dir etwas wichtig genug ist, um der Angst zu begegnen."
])
at("courage","signal",[
    "El coraje es la pareja sentimental del miedo. No son opuestos — surgen de la misma raíz: importar profundamente por algo. El miedo dice 'esto está en riesgo' y el coraje dice 'vale la pena el riesgo'. El coraje conecta seguridad y crecimiento porque requiere reconocer el peligro (seguridad) mientras eliges avanzar de todos modos (crecimiento). La ansiedad puede transformarse en compromiso, claridad y valentía cuando encuentras un camino hacia adelante.",
    "용기는 두려움의 감정 짝입니다. 대립이 아닙니다 — 같은 뿌리에서 나옵니다: 무언가를 깊이 소중히 여기는 것. 두려움은 '이것이 위험하다'고 말하고, 용기는 '위험을 감수할 가치가 있다'고 말합니다. 용기는 위험을 인정하면서(안전) 어쨌든 앞으로 나아가기를 선택하기(성장) 때문에 안전과 성장을 연결합니다. 앞으로의 길을 찾으면 불안은 헌신, 명확함, 용기로 변할 수 있습니다.",
    "勇气是恐惧的情感伴侣。它们不是对立面——来自同一根源：深深在意某事。恐惧说'这有风险'，勇气说'值得冒险'。勇气连接安全和成长，因为它要求承认危险（安全）同时选择向前（成长）。当你找到一条前进的路时，焦虑可以转化为承诺、清晰和勇气。",
    "الشجاعة هي الشريك العاطفي للخوف. ليسا نقيضين — ينبعان من نفس الجذر: الاهتمام العميق بشيء ما. الخوف يقول 'هذا في خطر' والشجاعة تقول 'يستحق المخاطرة'. الشجاعة تربط الأمان والنمو لأنها تتطلب الاعتراف بالخطر (الأمان) مع اختيار المضي قدمًا على أي حال (النمو). يمكن أن يتحول القلق إلى التزام ووضوح وشجاعة عندما تجد طريقًا للأمام.",
    "אומץ הוא בן הזוג הרגשי של פחד. הם אינם הפכים — הם צומחים מאותו שורש: איכפתיות עמוקה. פחד אומר 'זה בסכנה' ואומץ אומר 'שווה את הסיכון'. אומץ מגשר בין ביטחון לצמיחה כי הוא דורש הכרה בסכנה (ביטחון) תוך בחירה להתקדם בכל זאת (צמיחה). חרדה יכולה להפוך למחויבות, בהירות ואומץ כשאתה מוצא דרך קדימה.",
    "勇気は恐れの感情のパートナーです。対立するものではありません — 同じ根から生まれます：何かを深く大切にすること。恐れは「これが危うい」と言い、勇気は「リスクに値する」と言います。勇気は安全と成長を橋渡しします。危険を認識し（安全）、それでも前に進むことを選ぶ（成長）からです。前進の道を見つけると、不安はコミットメント、明晰さ、勇気に変わります。",
    "Le courage est le partenaire émotionnel de la peur. Ils ne sont pas opposés — ils naissent de la même racine : se soucier profondément de quelque chose. La peur dit 'c'est menacé' et le courage dit 'ça vaut le risque'. Le courage relie sécurité et croissance car il exige de reconnaître le danger (sécurité) tout en choisissant d'avancer quand même (croissance). L'anxiété peut se transformer en engagement, clarté et courage quand vous trouvez un chemin.",
    "A coragem é a parceira emocional do medo. Não são opostos — surgem da mesma raiz: importar-se profundamente com algo. O medo diz 'isso está em risco' e a coragem diz 'vale o risco'. A coragem conecta segurança e crescimento porque requer reconhecer o perigo (segurança) enquanto escolhe avançar mesmo assim (crescimento). A ansiedade pode se transformar em compromisso, clareza e coragem quando você encontra um caminho adiante.",
    "Il coraggio è il partner emotivo della paura. Non sono opposti — nascono dalla stessa radice: tenere profondamente a qualcosa. La paura dice 'questo è a rischio' e il coraggio dice 'vale il rischio'. Il coraggio collega sicurezza e crescita perché richiede di riconoscere il pericolo (sicurezza) scegliendo comunque di andare avanti (crescita). L'ansia può trasformarsi in impegno, chiarezza e coraggio quando trovi una via davanti.",
    "Mut ist der emotionale Partner der Angst. Sie sind keine Gegensätze — sie entspringen derselben Wurzel: etwas zutiefst wichtig zu nehmen. Angst sagt 'das ist gefährdet' und Mut sagt 'es ist das Risiko wert'. Mut verbindet Sicherheit und Wachstum, weil er verlangt, die Gefahr anzuerkennen (Sicherheit), während man trotzdem vorwärts geht (Wachstum). Angst kann sich in Engagement, Klarheit und Mut verwandeln, wenn du einen Weg nach vorn findest."
])
at("courage","reflection",[
    "¿Qué miedo estás dispuesto a acompañar para poder crecer?",
    "성장하기 위해 어떤 두려움과 함께 걸어갈 의향이 있나요?",
    "你愿意与什么恐惧同行以便成长？",
    "ما الخوف الذي أنت مستعد لمرافقته من أجل النمو؟",
    "איזה פחד אתה מוכן ללכת לצידו כדי לגדול?",
    "成長のために、どの恐れと共に歩む覚悟がありますか？",
    "Quelle peur êtes-vous prêt à accompagner pour grandir ?",
    "Que medo você está disposto a caminhar ao lado para crescer?",
    "Quale paura sei disposto ad accompagnare per crescere?",
    "Welche Angst bist du bereit, an deiner Seite zu haben, um zu wachsen?"
])
ai("courage",0,[
    "¿Qué estoy dispuesto a arriesgar por lo que me importa?",
    "내가 소중히 여기는 것을 위해 무엇을 기꺼이 감수할 것인가?",
    "我愿意为在乎的东西冒什么风险？",
    "ما الذي أنا مستعد للمخاطرة به من أجل ما أهتم به؟",
    "מה אני מוכן לסכן למען מה שאכפת לי?",
    "大切なもののために何をリスクにかける覚悟がありますか？",
    "Que suis-je prêt à risquer pour ce qui m'importe ?",
    "O que estou disposto a arriscar pelo que me importa?",
    "Cosa sono disposto a rischiare per ciò che mi sta a cuore?",
    "Was bin ich bereit zu riskieren für das, was mir wichtig ist?"
])
ai("courage",1,[
    "¿Qué se hace posible si atravieso este miedo?",
    "이 두려움을 뚫고 나아가면 무엇이 가능해지는가?",
    "如果我穿越这个恐惧，什么变得可能？",
    "ما الذي يصبح ممكنًا إذا تحركت عبر هذا الخوف؟",
    "מה נעשה אפשרי אם אעבור דרך הפחד הזה?",
    "この恐れを通り抜けると、何が可能になりますか？",
    "Que devient possible si je traverse cette peur ?",
    "O que se torna possível se eu atravessar esse medo?",
    "Cosa diventa possibile se attraverso questa paura?",
    "Was wird möglich, wenn ich durch diese Angst hindurchgehe?"
])

# ═══ DISGUST ═══
at("disgust","essence",[
    "Un rechazo visceral — una señal de que algo ha cruzado un límite de lo que se siente aceptable o seguro.",
    "본능적인 반발 — 수용 가능하거나 안전하다고 느끼는 경계를 무언가가 넘었다는 신호입니다.",
    "一种本能的退缩——某些东西越过了你感到可以接受或安全的界限的信号。",
    "نفور غريزي — إشارة إلى أن شيئًا ما تجاوز حدود ما يبدو مقبولاً أو آمنًا.",
    "נסיגה אינסטינקטיבית — אות שמשהו חצה גבול של מה שמרגיש מקובל או בטוח.",
    "本能的な拒絶反応 — 受け入れられる、または安全だと感じる境界を何かが越えたというシグナルです。",
    "Un recul viscéral — un signal que quelque chose a franchi une limite de ce qui semble acceptable ou sûr.",
    "Um recuo visceral — um sinal de que algo cruzou um limite do que parece aceitável ou seguro.",
    "Un riflesso viscerale di rigetto — un segnale che qualcosa ha oltrepassato un confine di ciò che sembra accettabile o sicuro.",
    "Ein instinktives Zurückweichen — ein Signal, dass etwas eine Grenze dessen überschritten hat, was sich akzeptabel oder sicher anfühlt."
])
at("disgust","signal",[
    "El asco evolucionó para protegernos de la contaminación, pero se extiende mucho más allá de lo físico. Confianza y asco son compañeros: la confianza nos dice que las reglas están en su lugar y la situación es segura; el asco nos dice que las reglas han sido violadas o la situación no es segura. El asco también tiene una dimensión moral — los investigadores lo llaman 'asco moral' porque responde a violaciones éticas. Su función de supervivencia es evitar la toxicidad, ya sea física, social o moral.",
    "역겨움은 오염으로부터 보호하기 위해 진화했지만, 물리적인 것을 훨씬 넘어섭니다. 신뢰와 역겨움은 짝입니다: 신뢰는 규칙이 있고 상황이 안전하다고 말하고, 역겨움은 규칙이 위반되었거나 상황이 안전하지 않다고 말합니다. 역겨움에는 도덕적 차원도 있습니다 — 연구자들은 윤리적 위반에 반응하기 때문에 '도덕적 역겨움'이라고 부릅니다. 생존 기능은 신체적, 사회적, 도덕적 독성을 피하는 것입니다.",
    "厌恶进化为保护我们免受污染，但它远远超越了物理层面。信任和厌恶是伙伴：信任告诉我们规则到位且情况安全；厌恶告诉我们规则被违反或情况不安全。厌恶还有道德维度——研究者称之为'道德厌恶'因为它回应道德违反。其生存功能是避免毒害，无论是身体的、社会的还是道德的。",
    "الاشمئزاز تطور لحمايتنا من التلوث، لكنه يمتد إلى ما هو أبعد من المادي. الثقة والاشمئزاز شريكان: الثقة تخبرنا أن القواعد موجودة والوضع آمن؛ الاشمئزاز يخبرنا أن القواعد انتُهكت أو الوضع ليس آمنًا. للاشمئزاز أيضًا بُعد أخلاقي — يسميه الباحثون 'الاشمئزاز الأخلاقي' لأنه يستجيب للانتهاكات الأخلاقية. وظيفته البقائية هي تجنب السمية، سواء كانت جسدية أو اجتماعية أو أخلاقية.",
    "גועל התפתח כדי להגן עלינו מזיהום, אבל הוא משתרע הרבה מעבר לפיזי. אמון וגועל הם שותפים: אמון אומר לנו שהכללים במקום והמצב בטוח; גועל אומר לנו שכללים הופרו או שהמצב אינו בטוח. לגועל יש גם ממד מוסרי — חוקרים קוראים לו 'גועל מוסרי' כי הוא מגיב להפרות אתיות. תפקיד ההישרדות שלו הוא להימנע מרעילות, בין אם פיזית, חברתית או מוסרית.",
    "嫌悪は汚染から身を守るために進化しましたが、物理的なものをはるかに超えます。信頼と嫌悪はパートナーです：信頼はルールが守られ状況が安全だと教え、嫌悪はルールが破られたか状況が安全でないと教えます。嫌悪には道徳的次元もあります — 研究者は倫理的違反に反応するため「道徳的嫌悪」と呼びます。その生存機能は、身体的、社会的、道徳的な毒性を避けることです。",
    "Le dégoût a évolué pour nous protéger de la contamination, mais il s'étend bien au-delà du physique. Confiance et dégoût sont partenaires : la confiance nous dit que les règles sont en place et la situation est sûre ; le dégoût nous dit que les règles ont été violées ou que la situation n'est pas sûre. Le dégoût a aussi une dimension morale — les chercheurs l'appellent 'dégoût moral' car il répond aux violations éthiques. Sa fonction de survie est d'éviter la toxicité, qu'elle soit physique, sociale ou morale.",
    "A repulsa evoluiu para nos proteger da contaminação, mas se estende muito além do físico. Confiança e repulsa são parceiros: a confiança nos diz que as regras estão em vigor e a situação é segura; a repulsa nos diz que regras foram violadas ou a situação não é segura. A repulsa também tem uma dimensão moral — pesquisadores chamam de 'repulsa moral' porque responde a violações éticas. Sua função de sobrevivência é evitar toxicidade, seja física, social ou moral.",
    "Il disgusto si è evoluto per proteggerci dalla contaminazione, ma si estende ben oltre il fisico. Fiducia e disgusto sono partner: la fiducia ci dice che le regole sono al loro posto e la situazione è sicura; il disgusto ci dice che le regole sono state violate o la situazione non è sicura. Il disgusto ha anche una dimensione morale — i ricercatori lo chiamano 'disgusto morale' perché risponde a violazioni etiche. La sua funzione di sopravvivenza è evitare la tossicità, fisica, sociale o morale.",
    "Ekel hat sich entwickelt, um uns vor Kontamination zu schützen, aber er reicht weit über das Physische hinaus. Vertrauen und Ekel sind Partner: Vertrauen sagt uns, dass die Regeln gelten und die Situation sicher ist; Ekel sagt uns, dass Regeln verletzt wurden oder die Situation nicht sicher ist. Ekel hat auch eine moralische Dimension — Forscher nennen es 'moralischen Ekel', weil er auf ethische Verstöße reagiert. Seine Überlebensfunktion ist es, Toxizität zu vermeiden, ob physisch, sozial oder moralisch."
])
at("disgust","reflection",[
    "¿Qué límite se ha cruzado aquí — y qué te dice eso sobre tus valores?",
    "여기서 어떤 경계가 넘어졌나요 — 그리고 그것이 당신의 가치관에 대해 무엇을 말해주나요?",
    "这里什么界限被越过了——这对你的价值观说了什么？",
    "ما الحدود التي تم تجاوزها هنا — وماذا يخبرك ذلك عن قيمك؟",
    "איזה גבול נחצה כאן — ומה זה אומר לך על הערכים שלך?",
    "ここでどんな境界が越えられましたか — それはあなたの価値観について何を教えていますか？",
    "Quelle limite a été franchie ici — et qu'est-ce que cela vous dit sur vos valeurs ?",
    "Que limite foi cruzado aqui — e o que isso diz sobre seus valores?",
    "Quale confine è stato oltrepassato qui — e cosa ti dice sui tuoi valori?",
    "Welche Grenze wurde hier überschritten — und was sagt dir das über deine Werte?"
])
ai("disgust",0,[
    "¿Qué reglas se han violado? ¿Es segura esta situación?",
    "어떤 규칙이 위반되었는가? 이 상황은 안전한가?",
    "什么规则被违反了？这种情况安全吗？",
    "ما القواعد التي انتُهكت؟ هل هذا الوضع آمن؟",
    "אילו כללים הופרו? האם המצב הזה בטוח?",
    "どのルールが破られましたか？この状況は安全ですか？",
    "Quelles règles ont été violées ? Cette situation est-elle sûre ?",
    "Que regras foram violadas? Esta situação é segura?",
    "Quali regole sono state violate? Questa situazione è sicura?",
    "Welche Regeln wurden verletzt? Ist diese Situation sicher?"
])
ai("disgust",1,[
    "¿Esto se alinea con los valores de mi comunidad?",
    "이것이 내 공동체의 가치관과 일치하는가?",
    "这与我社区的价值观一致吗？",
    "هل يتوافق هذا مع قيم مجتمعي؟",
    "האם זה מתיישב עם ערכי הקהילה שלי?",
    "これは私のコミュニティの価値観と一致していますか？",
    "Cela s'aligne-t-il avec les valeurs de ma communauté ?",
    "Isso se alinha com os valores da minha comunidade?",
    "Questo è in linea con i valori della mia comunità?",
    "Stimmt das mit den Werten meiner Gemeinschaft überein?"
])

# ═══ EXHAUSTION ═══
at("exhaustion","essence",[
    "Un agotamiento profundo de energía — una señal de que has estado dando más de lo que recibes, y algo fundamental está desequilibrado.",
    "에너지의 깊은 고갈 — 받는 것보다 더 많이 주어왔고, 근본적인 무언가가 불균형하다는 신호입니다.",
    "能量的深度耗竭——你给予的多于接收的，某些根本性的东西失衡了的信号。",
    "استنزاف عميق للطاقة — إشارة إلى أنك كنت تعطي أكثر مما تتلقى، وشيء أساسي غير متوازن.",
    "דלדול עמוק של אנרגיה — אות שנתת יותר ממה שקיבלת, ומשהו יסודי לא מאוזן.",
    "エネルギーの深い枯渇 — 受け取る以上に与え続け、何か根本的なものがバランスを崩しているというシグナルです。",
    "Un épuisement profond d'énergie — un signal que vous avez donné plus que vous n'avez reçu, et quelque chose de fondamental est déséquilibré.",
    "Um esgotamento profundo de energia — um sinal de que você tem dado mais do que recebe, e algo fundamental está desequilibrado.",
    "Un profondo esaurimento di energia — un segnale che hai dato più di quanto hai ricevuto, e qualcosa di fondamentale è squilibrato.",
    "Eine tiefe Erschöpfung der Energie — ein Signal, dass du mehr gegeben hast als du erhalten hast, und etwas Grundlegendes aus dem Gleichgewicht ist."
])
at("exhaustion","signal",[
    "El agotamiento no se trata solo de trabajar demasiado duro. Los verdaderos impulsores son emocionales: el burnout ocurre cuando tu esfuerzo se siente fútil, cuando no te sientes visto, apoyado o exitoso. No se trata de cuántas horas trabajaste — se trata de cuántas horas sintieron que no importaban. El agotamiento conecta logro (empujar sin retorno), significado (el propósito ha desaparecido) y pertenencia (hacerlo solo). Lo opuesto al burnout no es descanso — es motivación sostenible alineada con tus valores.",
    "탈진은 단지 너무 열심히 일하는 것이 아닙니다. 진짜 동인은 감정적입니다: 번아웃은 노력이 헛되게 느껴질 때, 인정받지 못하거나 지지받지 못하거나 성공하지 못한다고 느낄 때 발생합니다. 몇 시간 일했는지가 아니라, 몇 시간이 무의미하게 느껴졌는지가 문제입니다. 탈진은 성취(보답 없는 밀어붙임), 의미(목적 상실), 소속(혼자 하기)를 연결합니다. 번아웃의 반대는 휴식이 아닙니다 — 가치관과 맞춰진 지속 가능한 동기부여입니다.",
    "耗竭不仅仅是工作太辛苦。真正的驱动因素是情感性的：倦怠发生在你的努力感觉徒劳时，当你感到不被看见、不被支持或不成功时。不是你工作了多少小时——而是有多少小时感觉不重要。耗竭连接成就（没有回报地推进）、意义（目的消失了）和归属（独自承担）。倦怠的对立面不是休息——是与你的价值观一致的可持续动力。",
    "الإرهاق ليس فقط عن العمل بجد. المحركات الحقيقية عاطفية: الاحتراق يحدث عندما يبدو مجهودك عبثيًا، عندما لا تشعر بأنك مرئي أو مدعوم أو ناجح. ليس عن عدد الساعات التي عملتها — بل عن عدد الساعات التي شعرت أنها لم تكن مهمة. الإرهاق يربط الإنجاز (الدفع بلا عائد) والمعنى (الغرض اختفى) والانتماء (القيام بذلك وحيدًا). عكس الاحتراق ليس الراحة — إنه الدافع المستدام المتوافق مع قيمك.",
    "תשישות לא מתייחסת רק לעבודה קשה מדי. המניעים האמיתיים הם רגשיים: שחיקה קורית כשהמאמץ שלך מרגיש חסר תועלת, כשאתה לא מרגיש נראה, נתמך או מוצלח. זה לא כמה שעות עבדת — אלא כמה שעות הרגישו שהן לא חשובות. תשישות מגשרת בין הישג (לדחוף בלי תמורה), משמעות (המטרה נעלמה) ושייכות (לעשות את זה לבד). ההפך של שחיקה אינו מנוחה — אלא מוטיבציה בת-קיימא המתיישרת עם הערכים שלך.",
    "疲弊は単に働きすぎることではありません。本当の原動力は感情的なものです：燃え尽きは、努力が無駄に感じるとき、認められず、支えられず、成功していないと感じるときに起こります。何時間働いたかではなく、何時間が無意味に感じられたかです。疲弊は達成（見返りのない努力）、意味（目的の消失）、帰属（一人でやること）を橋渡しします。燃え尽きの反対は休息ではなく、価値観に沿った持続可能なモチベーションです。",
    "L'épuisement ne concerne pas seulement le fait de travailler trop dur. Les vrais moteurs sont émotionnels : le burnout survient quand votre effort semble futile, quand vous ne vous sentez pas vu, soutenu ou en réussite. Ce n'est pas le nombre d'heures travaillées — c'est combien d'heures ont semblé ne pas compter. L'épuisement relie accomplissement (pousser sans retour), sens (le but a disparu) et appartenance (le faire seul). L'opposé du burnout n'est pas le repos — c'est une motivation durable alignée sur vos valeurs.",
    "Exaustão não é apenas sobre trabalhar demais. Os verdadeiros motivadores são emocionais: burnout acontece quando seu esforço parece fútil, quando você não se sente visto, apoiado ou bem-sucedido. Não é sobre quantas horas trabalhou — é sobre quantas horas pareceram não importar. Exaustão conecta conquista (empurrar sem retorno), significado (o propósito desapareceu) e pertencimento (fazer sozinho). O oposto do burnout não é descanso — é motivação sustentável alinhada com seus valores.",
    "L'esaurimento non riguarda solo il lavorare troppo duramente. I veri motori sono emotivi: il burnout accade quando il tuo sforzo sembra futile, quando non ti senti visto, supportato o di successo. Non si tratta di quante ore hai lavorato — ma di quante ore sono sembrate non importare. L'esaurimento collega realizzazione (spingere senza ritorno), significato (lo scopo è svanito) e appartenenza (farlo da solo). L'opposto del burnout non è il riposo — è la motivazione sostenibile allineata ai tuoi valori.",
    "Erschöpfung geht nicht nur darum, zu hart zu arbeiten. Die wahren Treiber sind emotional: Burnout geschieht, wenn deine Anstrengung sinnlos erscheint, wenn du dich nicht gesehen, unterstützt oder erfolgreich fühlst. Es geht nicht darum, wie viele Stunden du gearbeitet hast — sondern wie viele Stunden sich bedeutungslos anfühlten. Erschöpfung verbindet Leistung (Antreiben ohne Ertrag), Sinn (der Zweck ist verschwunden) und Zugehörigkeit (es allein tun). Das Gegenteil von Burnout ist nicht Ruhe — es ist nachhaltige Motivation, die mit deinen Werten übereinstimmt."
])
at("exhaustion","reflection",[
    "¿Qué necesidad está más agotada ahora mismo — significado, reconocimiento, conexión o control?",
    "지금 가장 고갈된 욕구는 무엇인가요 — 의미, 인정, 연결, 통제?",
    "现在哪种需求最耗竭——意义、认可、连接还是控制？",
    "ما الحاجة الأكثر استنزافًا الآن — المعنى، التقدير، التواصل، أم السيطرة؟",
    "איזה צורך הכי מדולדל עכשיו — משמעות, הכרה, חיבור, או שליטה?",
    "今最も枯渇している欲求は何ですか — 意味、認知、つながり、それともコントロール？",
    "Quel besoin est le plus épuisé en ce moment — le sens, la reconnaissance, la connexion ou le contrôle ?",
    "Qual necessidade está mais esgotada agora — significado, reconhecimento, conexão ou controle?",
    "Quale bisogno è più esaurito adesso — significato, riconoscimento, connessione o controllo?",
    "Welches Bedürfnis ist gerade am meisten erschöpft — Sinn, Anerkennung, Verbindung oder Kontrolle?"
])
ai("exhaustion",0,[
    "¿He estado empujando demasiado fuerte sin retorno?",
    "보상 없이 너무 세게 밀어붙이고 있었는가?",
    "我是否一直在没有回报地过度努力？",
    "هل كنت أدفع بشدة بلا عائد؟",
    "האם דחפתי חזק מדי בלי תמורה?",
    "見返りなく頑張りすぎていませんか？",
    "Ai-je poussé trop fort sans retour ?",
    "Tenho empurrado demais sem retorno?",
    "Ho spinto troppo forte senza ritorno?",
    "Habe ich zu hart ohne Ertrag gearbeitet?"
])
ai("exhaustion",1,[
    "¿Ha desaparecido el propósito detrás de mi esfuerzo?",
    "내 노력 뒤의 목적이 사라졌는가?",
    "我努力背后的目的消失了吗？",
    "هل اختفى الغرض وراء مجهودي؟",
    "האם המטרה מאחורי המאמץ שלי נעלמה?",
    "努力の背後にある目的は消えましたか？",
    "Le but derrière mon effort a-t-il disparu ?",
    "O propósito por trás do meu esforço desapareceu?",
    "Lo scopo dietro il mio sforzo è svanito?",
    "Ist der Zweck hinter meiner Anstrengung verschwunden?"
])
ai("exhaustion",2,[
    "¿Estoy tratando de hacer esto solo?",
    "혼자서 이것을 하려고 하고 있는가?",
    "我是否在试图独自完成这件事？",
    "هل أحاول القيام بهذا وحدي؟",
    "האם אני מנסה לעשות את זה לבד?",
    "これを一人でやろうとしていませんか？",
    "Est-ce que j'essaie de faire ça seul ?",
    "Estou tentando fazer isso sozinho?",
    "Sto cercando di farlo da solo?",
    "Versuche ich, das allein zu tun?"
])

# ═══ SAVE ═══
with open(F, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Part 7 done: stress, overwhelm, contentment, courage, disgust, exhaustion")
