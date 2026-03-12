
export type InterestCategory = 'comedy' | 'music' | 'movies' | 'series' | 'sports' | 'science' | 'nature' | 'general';
export type Language = 'en' | 'hi' | 'mr';

export interface TriviaItem {
    id: string;
    category: InterestCategory;
    content: {
        en: string;
        hi: string;
        mr: string;
    };
}

// ----------------------------------------------------------------------
// 1. CONFIGURATION: Interest Mapping & Stop Words
// ----------------------------------------------------------------------

const STOP_WORDS = new Set([
    'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are',
    'i', 'my', 'me', 'watch', 'watching', 'listen', 'listening', 'play', 'playing', 'love', 'like'
]);

const INTEREST_MAP: Record<string, InterestCategory> = {
    // Comedy
    'comedy': 'comedy', 'standup': 'comedy', 'funny': 'comedy', 'jokes': 'comedy', 'laugh': 'comedy',
    'kapil': 'comedy', 'bass': 'comedy',

    // Music
    'music': 'music', 'song': 'music', 'songs': 'music', 'band': 'music', 'singer': 'music',
    'rap': 'music', 'hiphop': 'music', 'pop': 'music', 'rock': 'music', 'classical': 'music',
    'dhillon': 'music', 'arijit': 'music', 'shreya': 'music', 'rahman': 'music',

    // Movies
    'movie': 'movies', 'movies': 'movies', 'film': 'movies', 'films': 'movies', 'cinema': 'movies',
    'bollywood': 'movies', 'hollywood': 'movies', 'actor': 'movies', 'actress': 'movies',
    'srk': 'movies', 'shahrukh': 'movies', 'salman': 'movies', 'amitabh': 'movies',

    // Series
    'series': 'series', 'show': 'series', 'shows': 'series', 'tv': 'series', 'webseries': 'series',
    'netflix': 'series', 'prime': 'series', 'breaking': 'series', 'friends': 'series', 'office': 'series',

    // Sports
    'sport': 'sports', 'sports': 'sports', 'cricket': 'sports', 'football': 'sports', 'tennis': 'sports',
    'badminton': 'sports', 'kohli': 'sports', 'dhoni': 'sports', 'rohit': 'sports', 'messi': 'sports', 'ronaldo': 'sports',

    // Nature/Science
    'nature': 'nature', 'hiking': 'nature', 'travel': 'nature', 'mountains': 'nature', 'beach': 'nature',
    'science': 'science', 'tech': 'science', 'space': 'science', 'physics': 'science', 'biology': 'science',
    'stars': 'science', 'planet': 'science'
};

// ----------------------------------------------------------------------
// 2. DATASET: Pre-translated Trivia
// ----------------------------------------------------------------------

export const TRIVIA_DATASET: TriviaItem[] = [
    // Comedy
    {
        id: 'c1', category: 'comedy',
        content: {
            en: "Laughter increases immune cells and infection-fighting antibodies, causing improved resistance to disease.",
            hi: "हँसी प्रतिरक्षा कोशिकाओं और संक्रमण से लड़ने वाले एंटीबॉडी को बढ़ाती है, जिससे बीमारियों से प्रतिरोधक क्षमता बढ़ती है।",
            mr: "हसल्यामुळे रोगप्रतिकारक पेशी आणि संसर्गाशी लढणाऱ्या अँटीबॉडीज वाढतात, ज्यामुळे रोगांचा प्रतिकार करण्याची क्षमता सुधारते."
        }
    },
    {
        id: 'c2', category: 'comedy',
        content: {
            en: "A good hearty laugh relieves physical tension and stress, leaving your muscles relaxed for up to 45 minutes after.",
            hi: "एक अच्छी हँसी शारीरिक तनाव को दूर करती है, जिससे आपकी मांसपेशियां 45 मिनट तक आराम महसूस करती हैं।",
            mr: "मनसोक्त हसल्याने शारीरिक ताण आणि तणाव दूर होतो, आणि त्यानंतर 45 मिनिटांपर्यंत तुमचे स्नायू शिथिल राहतात."
        }
    },

    // Music
    {
        id: 'm1', category: 'music',
        content: {
            en: "Listening to music can initiate the release of dopamine, the 'feel-good' neurotransmitter in your brain.",
            hi: "संगीत सुनने से आपके मस्तिष्क में 'अच्छा महसूस कराने वाला' न्यूरोट्रांसमीटर, डोपामाइन रिलीज हो सकता है।",
            mr: "संगीत ऐकल्याने तुमच्या मेंदूमध्ये 'फिल-गुड' न्यूरोट्रांसमीटर, डोपामाइन स्रावित होण्यास सुरुवात होऊ शकते."
        }
    },
    {
        id: 'm2', category: 'music',
        content: {
            en: "Your hearbeat changes and mimics the music you listen to.",
            hi: "आपकी धड़कन बदलती है और उस संगीत की नकल करती है जिसे आप सुनते हैं।",
            mr: "तुमच्या हृदयाचे ठोके बदलतात आणि तुम्ही ऐकत असलेल्या संगीताच्या तालाशी जुळवून घेतात."
        }
    },

    // Movies
    {
        id: 'mv1', category: 'movies',
        content: {
            en: "Watching movies can provide 'Cinema Therapy', allowing you to process suppressed emotions in a safe space.",
            hi: "फिल्में देखना 'सिनेमा थेरेपी' प्रदान कर सकता है, जिससे आप दबी हुई भावनाओं को सुरक्षित जगह में महसूस कर सकते हैं।",
            mr: "चित्रपट पाहणे 'सिनेमा थेरपी' देऊ शकते, ज्यामुळे तुम्हाला तुमच्या दडपलेल्या भावना सुरक्षितपणे व्यक्त करता येतात."
        }
    },

    // Series
    {
        id: 's1', category: 'series',
        content: {
            en: "Following a long TV series can create a sense of belonging and parasocial connection, reducing loneliness.",
            hi: "एक लंबी टीवी सीरीज देखने से अपनेपन का अहसास हो सकता है और अकेलापन कम हो सकता है।",
            mr: "दीर्घकालीन टीव्ही मालिका पाहिल्याने आपलेपणाची भावना निर्माण होऊ शकते आणि एकटेपणा कमी होऊ शकतो."
        }
    },

    // Sports
    {
        id: 'sp1', category: 'sports',
        content: {
            en: "Regular physical activity like sports is one of the most effective ways to reduce symptoms of anxiety.",
            hi: "खेल जैसी नियमित शारीरिक गतिविधि चिंता के लक्षणों को कम करने के सबसे प्रभावी तरीकों में से एक है।",
            mr: "खेळासारखी नियमित शारीरिक हालचाल चिंतेची लक्षणे कमी करण्याचा सर्वात प्रभावी मार्ग आहे."
        }
    },

    // Nature
    {
        id: 'n1', category: 'nature',
        content: {
            en: "Spending just 20 minutes in nature can significantly lower cortisol (stress hormone) levels.",
            hi: "प्रकृति में केवल 20 मिनट बिताने से कोर्टिसोल (तनाव हार्मोन) का स्तर काफी कम हो सकता है।",
            mr: "nisargat फक्त 20 मिनिटे घालवल्याने कोर्टीनसोल (तणाव संप्रेरक) ची पातळी लक्षणीयरीत्या कमी होऊ शकते."
        }
    },

    // General (Fallback)
    {
        id: 'g1', category: 'general',
        content: {
            en: "Practicing gratitude daily is linked to higher levels of happiness and lower rates of stress.",
            hi: "प्रतिदिन कृतज्ञता का अभ्यास करने से खुशी का स्तर बढ़ता है और तनाव कम होता है।",
            mr: "दररोज कृतज्ञता व्यक्त करणे हे अधिक आनंद आणि कमी तणावाशी जोडलेले आहे."
        }
    }
];


// ----------------------------------------------------------------------
// 3. LOGIC: Extraction & Selection
// ----------------------------------------------------------------------

export function extractInterestTags(profileText: string = ""): InterestCategory[] {
    if (!profileText) return ['general'];

    const normalized = profileText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
    const words = normalized.split(/\s+/).map(w => w.trim()).filter(w => w.length > 2);

    const tags = new Set<InterestCategory>();

    words.forEach(word => {
        if (STOP_WORDS.has(word)) return;
        if (INTEREST_MAP[word]) {
            tags.add(INTEREST_MAP[word]);
        }
        // Partial match check (e.g. "breaking" matches "breaking bad" key concept if mapped simple)
        // For simplicity/perf, we stick to direct map lookup defined above.
    });

    if (tags.size === 0) return ['general'];
    return Array.from(tags);
}

export function getDailyTrivia(tags: InterestCategory[]): TriviaItem | null {
    if (!tags || tags.length === 0) tags = ['general'];

    // Filter dataset by user interests
    const relevantTrivia = TRIVIA_DATASET.filter(item =>
        tags.includes(item.category) || item.category === 'general'
    );

    if (relevantTrivia.length === 0) return null;

    // Deterministic rotation based on Date
    // This ensures the same trivia appears for the whole day without storage (unless we want to persist "seen")
    // Formula: (DayOfYear + TagIndex) % PoolSize

    const date = new Date();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    const index = dayOfYear % relevantTrivia.length;
    return relevantTrivia[index];
}
