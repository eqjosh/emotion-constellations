#!/usr/bin/env python3
"""
Reads the existing English-only wisdom JSON and adds translations for all locales.
Uses compact translation tables to keep the script manageable.
"""
import json
import os
import copy

INPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "emotion-constellation-more-info-data.json")
OUTPUT = INPUT  # overwrite in place

with open(INPUT, "r", encoding="utf-8") as f:
    data = json.load(f)

LOCALES = ["es","ko","zh","ar","he","ja","fr","pt","it","de"]

# ────────────────────────────────────────────────────────────────────
# NEED translations
# ────────────────────────────────────────────────────────────────────
NEED_LABELS = {
  "safety":     ["Seguridad","안전","安全","أمان","ביטחון","安全","Sécurité","Segurança","Sicurezza","Sicherheit"],
  "belonging":  ["Pertenencia","소속감","归属","انتماء","שייכות","帰属","Appartenance","Pertencimento","Appartenenza","Zugehörigkeit"],
  "autonomy":   ["Autonomía","자율성","自主","استقلالية","אוטונומיה","自律","Autonomie","Autonomia","Autonomia","Autonomie"],
  "achievement":["Logro","성취","成就","إنجاز","הישג","達成","Accomplissement","Realização","Realizzazione","Leistung"],
  "meaning":    ["Significado","의미","意义","معنى","משמעות","意味","Sens","Significado","Significato","Sinn"],
  "growth":     ["Crecimiento","성장","成长","نمو","צמיחה","成長","Croissance","Crescimento","Crescita","Wachstum"],
}

NEED_DESCS = {
  "safety": [
    "En lo más profundo de nuestra arquitectura neuronal, el impulso de seguridad es primordial. Nuestros cerebros están diseñados para detectar y responder a las amenazas, a menudo antes de que seamos conscientes de ellas.",
    "우리 신경 구조 깊숙이, 안전에 대한 욕구는 가장 근본적입니다. 우리의 뇌는 위협을 감지하고 반응하도록 설계되어 있으며, 종종 우리가 의식하기도 전에 작동합니다.",
    "在我们神经结构的深处，对安全的驱动是最基本的。我们的大脑天生就能检测和应对威胁，往往在我们意识到之前就已经做出反应。",
    "في أعماق بنيتنا العصبية، تعد الحاجة إلى الأمان أساسية. أدمغتنا مصممة لاكتشاف التهديدات والاستجابة لها، غالبًا قبل أن ندرك ذلك بوعي.",
    "עמוק בארכיטקטורה העצבית שלנו, הדחף לביטחון הוא ראשוני. המוח שלנו מחווט לזהות ולהגיב לאיומים, לעיתים קרובות לפני שאנחנו מודעים לכך באופן מודע.",
    "私たちの神経構造の奥深くに、安全への欲求があります。脳は脅威を察知し反応するように設計されており、意識する前に作動することがよくあります。",
    "Au plus profond de notre architecture neuronale, le besoin de sécurité est primordial. Nos cerveaux sont programmés pour détecter et répondre aux menaces, souvent avant que nous en soyons consciemment conscients.",
    "No fundo de nossa arquitetura neural, o impulso de segurança é primário. Nossos cérebros são programados para detectar e responder a ameaças, muitas vezes antes de termos consciência delas.",
    "Nel profondo della nostra architettura neurale, l'impulso alla sicurezza è primario. I nostri cervelli sono programmati per rilevare e rispondere alle minacce, spesso prima che ne siamo coscientemente consapevoli.",
    "Tief in unserer neuronalen Architektur ist der Drang nach Sicherheit grundlegend. Unsere Gehirne sind darauf ausgerichtet, Bedrohungen zu erkennen und darauf zu reagieren, oft bevor wir uns dessen bewusst sind.",
  ],
  "belonging": [
    "Estas emociones sociales son profundas. Moldean el comportamiento, los valores e incluso la autoimagen. Nos invitan a reflexionar sobre cómo y dónde buscamos conexión.",
    "이 사회적 감정은 매우 깊습니다. 행동, 가치관, 심지어 자아상까지 형성합니다. 우리가 어디서 어떻게 연결을 추구하는지 성찰하도록 초대합니다.",
    "这些社会情感根深蒂固。它们塑造行为、价值观，甚至自我形象。它们邀请我们反思如何以及在哪里寻求连接。",
    "هذه المشاعر الاجتماعية عميقة الجذور. إنها تشكل السلوك والقيم وحتى صورة الذات. إنها تدعونا للتأمل في كيفية وأين نبحث عن التواصل.",
    "הרגשות החברתיים האלה עמוקים. הם מעצבים התנהגות, ערכים, ואפילו דימוי עצמי. הם מזמינים התבוננות על איך ואיפה אנחנו מחפשים חיבור.",
    "これらの社会的感情は深く根づいています。行動、価値観、さらには自己イメージを形作ります。私たちがどこで、どのようにつながりを求めているかを振り返るよう促します。",
    "Ces émotions sociales sont profondes. Elles façonnent le comportement, les valeurs, même l'image de soi. Elles invitent à réfléchir sur comment et où nous cherchons la connexion.",
    "Essas emoções sociais são profundas. Elas moldam comportamento, valores e até autoimagem. Elas nos convidam a refletir sobre como e onde buscamos conexão.",
    "Queste emozioni sociali sono profonde. Modellano il comportamento, i valori, persino l'immagine di sé. Ci invitano a riflettere su come e dove cerchiamo connessione.",
    "Diese sozialen Emotionen sind tiefgreifend. Sie formen Verhalten, Werte und sogar das Selbstbild. Sie laden zur Reflexion darüber ein, wie und wo wir Verbindung suchen.",
  ],
  "autonomy": [
    "La autonomía es una necesidad silenciosa, hasta que se nos arrebata; entonces las emociones estallan. Estas señales nos impulsan a recuperar la autoría de nuestras propias vidas.",
    "자율성은 조용한 욕구이지만, 빼앗기면 감정이 폭발합니다. 이 신호들은 우리 삶의 주인이 되도록 우리를 밀어줍니다.",
    "自主是一种安静的需求，直到它被夺走；然后情绪会爆发。这些信号推动我们重新掌握自己生活的主导权。",
    "الاستقلالية حاجة هادئة، حتى تُسلب منا؛ عندها تشتعل المشاعر. هذه الإشارات تدفعنا لاستعادة تأليف حياتنا الخاصة.",
    "אוטונומיה היא צורך שקט, עד שלוקחים אותו; אז הרגשות מתלקחים. האותות האלה דוחפים אותנו להשיב את הבעלות על חיינו.",
    "自律性は静かな欲求ですが、奪われると感情が爆発します。これらのシグナルは、自分の人生の主導権を取り戻すよう私たちを後押しします。",
    "L'autonomie est un besoin silencieux, jusqu'à ce qu'elle nous soit retirée ; alors les émotions s'enflamment. Ces signaux nous poussent à reprendre la direction de nos propres vies.",
    "A autonomia é uma necessidade silenciosa, até ser tirada de nós; então as emoções explodem. Esses sinais nos impulsionam a retomar a autoria de nossas próprias vidas.",
    "L'autonomia è un bisogno silenzioso, finché non viene tolta; allora le emozioni esplodono. Questi segnali ci spingono a riappropriarci della nostra vita.",
    "Autonomie ist ein stilles Bedürfnis, bis sie weggenommen wird; dann flammen die Emotionen auf. Diese Signale treiben uns an, die Urheberschaft über unser eigenes Leben zurückzugewinnen.",
  ],
  "achievement": [
    "Esta familia de emociones energiza la acción y nos pide recalibrar. Nos guían a través de la ambición, la preparación y el desafío.",
    "이 감정의 가족은 행동에 에너지를 불어넣고 재조정을 요청합니다. 야망, 준비, 도전을 통해 우리를 안내합니다.",
    "这一类情感激发行动并要求我们重新校准。它们引导我们经历抱负、准备和挑战。",
    "هذه العائلة من المشاعر تنشط الفعل وتطلب منا إعادة المعايرة. إنها ترشدنا عبر الطموح والاستعداد والتحدي.",
    "משפחת הרגשות הזו מפעילה פעולה ומבקשת מאיתנו לכייל מחדש. הם מנחים אותנו דרך שאיפה, מוכנות ואתגר.",
    "この感情の家族は行動を活性化し、再調整を求めます。野心、準備、挑戦を通じて私たちを導きます。",
    "Cette famille d'émotions dynamise l'action et nous demande de recalibrer. Elles nous guident à travers l'ambition, la préparation et le défi.",
    "Essa família de emoções energiza a ação e nos pede para recalibrar. Elas nos guiam através da ambição, prontidão e desafio.",
    "Questa famiglia di emozioni energizza l'azione e ci chiede di ricalibrare. Ci guidano attraverso ambizione, prontezza e sfida.",
    "Diese Familie von Emotionen belebt das Handeln und fordert uns zur Neukalibrierung auf. Sie leiten uns durch Ehrgeiz, Bereitschaft und Herausforderung.",
  ],
  "meaning": [
    "Estas emociones reflejan la búsqueda de algo más allá de la supervivencia, de aquello que hace que la vida se sienta significativa. Nos orientan hacia valores y visión.",
    "이 감정들은 생존을 넘어선 무언가, 삶을 의미있게 만드는 것에 대한 탐색을 반영합니다. 가치와 비전을 향해 우리를 이끕니다.",
    "这些情感反映了对超越生存的追求，对让生命感到有意义的事物的追寻。它们引导我们走向价值观和愿景。",
    "تعكس هذه المشاعر البحث عن شيء يتجاوز البقاء، عما يجعل الحياة ذات معنى. إنها توجهنا نحو القيم والرؤية.",
    "רגשות אלה משקפים את החיפוש אחר משהו מעבר להישרדות, אחר מה שגורם לחיים להרגיש משמעותיים. הם מכוונים אותנו לעבר ערכים וחזון.",
    "これらの感情は、生存を超えた何か、人生を意味あるものにするものへの探求を反映しています。価値観とビジョンへと私たちを導きます。",
    "Ces émotions reflètent la recherche de quelque chose au-delà de la survie, de ce qui donne un sens à la vie. Elles nous orientent vers les valeurs et la vision.",
    "Essas emoções refletem a busca por algo além da sobrevivência, pelo que faz a vida parecer significativa. Elas nos orientam em direção a valores e visão.",
    "Queste emozioni riflettono la ricerca di qualcosa oltre la sopravvivenza, di ciò che rende la vita significativa. Ci orientano verso valori e visione.",
    "Diese Emotionen spiegeln die Suche nach etwas jenseits des Überlebens wider, nach dem, was das Leben sinnvoll erscheinen lässt. Sie orientieren uns an Werten und Visionen.",
  ],
  "growth": [
    "El crecimiento rara vez es lineal. Estos sentimientos a menudo vienen en oleadas, señalándonos hacia la incomodidad que precede al discernimiento.",
    "성장은 거의 선형적이지 않습니다. 이 감정들은 종종 파도처럼 밀려와, 통찰에 앞서는 불편함을 향해 우리를 안내합니다.",
    "成长很少是线性的。这些感受常常如波浪般涌来，指向领悟之前的不适。",
    "النمو نادرًا ما يكون خطيًا. هذه المشاعر غالبًا تأتي في موجات، تشير إلى الانزعاج الذي يسبق البصيرة.",
    "צמיחה היא לעיתים רחוקות לינארית. תחושות אלה מגיעות לעיתים קרובות בגלים, ומצביעות לנו לעבר אי-הנוחות שקודמת לתובנה.",
    "成長は直線的であることはめったにありません。これらの感情は波のように押し寄せ、洞察に先立つ不快感へと私たちを導きます。",
    "La croissance est rarement linéaire. Ces sentiments arrivent souvent par vagues, nous dirigeant vers l'inconfort qui précède la prise de conscience.",
    "O crescimento raramente é linear. Esses sentimentos frequentemente vêm em ondas, apontando-nos para o desconforto que precede a compreensão.",
    "La crescita è raramente lineare. Questi sentimenti arrivano spesso a ondate, indicandoci il disagio che precede la comprensione.",
    "Wachstum ist selten linear. Diese Gefühle kommen oft in Wellen und weisen uns auf das Unbehagen hin, das der Erkenntnis vorausgeht.",
  ],
}

# Apply need translations
for need in data["needs"]:
    nid = need["id"]
    if nid in NEED_LABELS:
        for i, loc in enumerate(LOCALES):
            need["label"][loc] = NEED_LABELS[nid][i]
    if nid in NEED_DESCS:
        for i, loc in enumerate(LOCALES):
            need["description"][loc] = NEED_DESCS[nid][i]

print(f"Translated {len(data['needs'])} needs.")

# ────────────────────────────────────────────────────────────────────
# EMOTION translations
# Each emotion: [es,ko,zh,ar,he,ja,fr,pt,it,de] for label, essence, signal, reflection
# And per-need inquiry translations
# ────────────────────────────────────────────────────────────────────

EMOTION_LABELS = {
  "trust":["Confianza","신뢰","信任","ثقة","אמון","信頼","Confiance","Confiança","Fiducia","Vertrauen"],
  "fear":["Miedo","두려움","恐惧","خوف","פחד","恐れ","Peur","Medo","Paura","Angst"],
  "vigilance":["Vigilancia","경계","警觉","يقظة","ערנות","警戒","Vigilance","Vigilância","Vigilanza","Wachsamkeit"],
  "surprise":["Sorpresa","놀라움","惊讶","مفاجأة","הפתעה","驚き","Surprise","Surpresa","Sorpresa","Überraschung"],
  "loneliness":["Soledad","외로움","孤独","وحدة","בדידות","孤独","Solitude","Solidão","Solitudine","Einsamkeit"],
  "love":["Amor","사랑","爱","حب","אהבה","愛","Amour","Amor","Amore","Liebe"],
  "jealousy":["Celos","질투","嫉妒","غيرة","קנאה","嫉妬","Jalousie","Ciúme","Gelosia","Eifersucht"],
  "shame":["Vergüenza","수치심","羞耻","خجل","בושה","恥","Honte","Vergonha","Vergogna","Scham"],
  "frustrated":["Frustración","좌절","挫折","إحباط","תסכול","欲求不満","Frustration","Frustração","Frustrazione","Frustration"],
  "guilty":["Culpa","죄책감","内疚","ذنب","אשמה","罪悪感","Culpabilité","Culpa","Colpa","Schuld"],
  "free":["Libertad","자유","自由","حرية","חופש","自由","Liberté","Liberdade","Libertà","Freiheit"],
  "trapped":["Atrapado","갇힘","困住","حصار","לכוד","閉塞感","Piégé","Aprisionado","Intrappolato","Gefangen"],
  "anger":["Ira","분노","愤怒","غضب","כעס","怒り","Colère","Raiva","Rabbia","Wut"],
  "excitement":["Entusiasmo","흥분","兴奋","حماس","התרגשות","興奮","Enthousiasme","Entusiasmo","Entusiasmo","Begeisterung"],
  "urgency":["Urgencia","긴박감","紧迫","إلحاح","דחיפות","緊迫感","Urgence","Urgência","Urgenza","Dringlichkeit"],
  "pride":["Orgullo","자부심","骄傲","فخر","גאווה","誇り","Fierté","Orgulho","Orgoglio","Stolz"],
  "doubt":["Duda","의심","怀疑","شك","ספק","疑念","Doute","Dúvida","Dubbio","Zweifel"],
  "awe":["Asombro","경외","敬畏","رهبة","יראה","畏敬","Émerveillement","Admiração","Meraviglia","Ehrfurcht"],
  "despair":["Desesperación","절망","绝望","يأس","ייאוש","絶望","Désespoir","Desespero","Disperazione","Verzweiflung"],
  "inspiration":["Inspiración","영감","灵感","إلهام","השראה","インスピレーション","Inspiration","Inspiração","Ispirazione","Inspiration"],
  "emptiness":["Vacío","공허","空虚","فراغ","ריקנות","空虚","Vide","Vazio","Vuoto","Leere"],
  "delight":["Deleite","기쁨","欣喜","بهجة","עונג","歓喜","Enchantement","Encantamento","Delizia","Entzücken"],
  "curiosity":["Curiosidad","호기심","好奇","فضول","סקרנות","好奇心","Curiosité","Curiosidade","Curiosità","Neugier"],
  "joy":["Alegría","기쁨","喜悦","فرح","שמחה","喜び","Joie","Alegria","Gioia","Freude"],
  "impatience":["Impaciencia","조급함","急躁","نفاد صبر","חוסר סבלנות","焦り","Impatience","Impaciência","Impazienza","Ungeduld"],
  "depression":["Depresión","우울","抑郁","اكتئاب","דיכאון","うつ","Dépression","Depressão","Depressione","Depression"],
  "boredom":["Aburrimiento","지루함","无聊","ملل","שעמום","退屈","Ennui","Tédio","Noia","Langeweile"],
  "sadness":["Tristeza","슬픔","悲伤","حزن","עצב","悲しみ","Tristesse","Tristeza","Tristezza","Traurigkeit"],
  "anxiety":["Ansiedad","불안","焦虑","قلق","חרדה","不安","Anxiété","Ansiedade","Ansia","Angstgefühl"],
  "gratitude":["Gratitud","감사","感恩","امتنان","הכרת תודה","感謝","Gratitude","Gratidão","Gratitudine","Dankbarkeit"],
  "hope":["Esperanza","희망","希望","أمل","תקווה","希望","Espoir","Esperança","Speranza","Hoffnung"],
  "compassion":["Compasión","연민","同情","تعاطف","חמלה","思いやり","Compassion","Compaixão","Compassione","Mitgefühl"],
  "grief":["Duelo","비탄","悲痛","حداد","אבל","悲嘆","Deuil","Luto","Lutto","Trauer"],
  "stress":["Estrés","스트레스","压力","ضغط","לחץ","ストレス","Stress","Estresse","Stress","Stress"],
  "overwhelm":["Agobio","압도감","不堪重负","إرهاق","הצפה","圧倒","Submersion","Sobrecarga","Sopraffazione","Überwältigung"],
  "contentment":["Serenidad","만족","满足","رضا","שלווה","満足","Contentement","Contentamento","Appagamento","Zufriedenheit"],
  "courage":["Valentía","용기","勇气","شجاعة","אומץ","勇気","Courage","Coragem","Coraggio","Mut"],
  "disgust":["Asco","혐오","厌恶","اشمئزاز","גועל","嫌悪","Dégoût","Nojo","Disgusto","Ekel"],
  "exhaustion":["Agotamiento","소진","疲惫","إنهاك","תשישות","疲弊","Épuisement","Exaustão","Esaurimento","Erschöpfung"],
}

# Apply emotion label translations
for emo in data["emotions"]:
    eid = emo["id"]
    if eid in EMOTION_LABELS:
        for i, loc in enumerate(LOCALES):
            emo["label"][loc] = EMOTION_LABELS[eid][i]

print(f"Translated labels for {len(data['emotions'])} emotions.")

# Now we need essence, signal, reflection, and inquiry translations.
# These are long strings. We'll load them from a separate JSON file.
# For now, let's build the translation data structure and write it.

# We'll create a helper that adds translations from a lookup table.
# The lookup table will be a separate JSON file we generate.

# Instead, let's do it inline but using exec to load from a data file.
# Actually, let's just use a separate data file approach.

print("Phase 1 complete. Need to run part 2 for readMore + inquiry translations.")
print(f"Writing intermediate output to {OUTPUT}")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done with labels + need translations. Part 2 will add readMore and inquiry translations.")
