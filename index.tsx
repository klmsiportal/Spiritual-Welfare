import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Heart, 
  MessageCircle, 
  BookOpen, 
  Wind, 
  User, 
  Menu, 
  X, 
  Send, 
  Sparkles,
  Sun,
  Moon,
  PenTool,
  ChevronRight,
  ChevronLeft,
  Globe,
  Loader2,
  Quote,
  CheckCircle,
  List,
  Star,
  Music,
  Play,
  Pause,
  Upload,
  Search,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Copy,
  LogOut,
  Cross,
  Tv,
  MapPin,
  Clock,
  Mic,
  Smile,
  RefreshCw,
  CloudMoon,
  BrainCircuit,
  Settings,
  Activity,
  Users,
  Trophy,
  WifiOff,
  Plus,
  Server,
  Link,
  Film,
  Zap,
  Eye,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Camera,
  Phone,
  Mail,
  BadgeCheck,
  Download,
  Book,
  Bookmark,
  Calculator,
  Timer,
  FileText,
  Library,
  Lightbulb,
  Compass,
  CheckSquare,
  Headphones,
  Shield,
  Target,
  ArrowRight
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp, Timestamp } from "firebase/firestore";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyC5hFB3ICxzyMrlvtnQl-n-2Dkr2RFsmqc",
  authDomain: "fir-9b1f8.firebaseapp.com",
  projectId: "fir-9b1f8",
  storageBucket: "fir-9b1f8.firebasestorage.app",
  messagingSenderId: "539772525700",
  appId: "1:539772525700:web:25b5a686877ddbf6d176d1",
  measurementId: "G-7FWY3QB5MY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Types ---
type ViewState = 'home' | 'topics' | 'meditate' | 'journal' | 'bible' | 'worship' | 'features' | 'about' | 'affirmations' | 'calendar' | 'tv' | 'trivia' | 'mood' | 'prayers' | 'settings' | 'cinema' | 'mysteries' | 'community' | 'toolbox' | 'treasury' | 'hymnal' | 'promises' | 'names' | 'notes' | 'fasting' | 'tithe' | 'dictionary' | 'plans' | 'audiobible' | 'goals' | 'sermons' | 'verse_explorer' | 'prayer_bank';

type MediaItem = {
    id: string;
    title: string;
    type: 'video' | 'audio';
    url: string; // YouTube ID or Audio URL
    author?: string;
};

type ChatMessage = {
    id: string;
    text: string;
    userId: string;
    displayName: string;
    photoURL: string;
    createdAt: any; 
};

// --- Constants ---
const BIBLE_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", 
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", 
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", 
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const AMBIENT_TRACKS = [
    { id: 'video1', title: 'Soaking Worship (YouTube)', type: 'video', url: 'BiG098g8FjQ' }, 
    { id: 'video2', title: 'Piano Prayer (YouTube)', type: 'video', url: 'qjX6s5J5zkw' },
    { id: 'video3', title: 'Holy Spirit Atmosphere', type: 'video', url: '73w3zD3X9b8' },
    { id: 'video4', title: 'Alone With God', type: 'video', url: '1s58rW0_LN4' },
    { id: 'video5', title: 'Secret Place', type: 'video', url: 'j4mR1v_r2F4' },
    { id: 'video6', title: 'Deep Prayer Music', type: 'video', url: 's7j6e1g5d8w' },
    { id: 'video7', title: 'Hillsong Instrumental', type: 'video', url: 'F8T5u6XzZ-U' },
    { id: 'video8', title: 'Prophetic Intercession', type: 'video', url: 'bX1L8_Wl7hM' },
    { id: 'rain', title: 'Soft Rain Audio', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { id: 'pads', title: 'Worship Pads Audio', url: 'https://cdn.pixabay.com/download/audio/2024/02/07/audio_c3e031a54f.mp3' },
    { id: 'pads2', title: 'Deep Ambient Pad', url: 'https://cdn.pixabay.com/download/audio/2023/09/06/audio_2d82d44445.mp3' },
];

// --- New Feature Data ---
const DICTIONARY_TERMS = [
    { term: "Atonement", def: "The reconciliation of God and humankind through Jesus Christ." },
    { term: "Covenant", def: "A sacred agreement or relationship between two parties, most notably between God and His people." },
    { term: "Faith", def: "Confidence in what we hope for and assurance about what we do not see (Hebrews 11:1)." },
    { term: "Grace", def: "The unmerited favor of God toward mankind." },
    { term: "Justification", def: "The action of declaring or making righteous in the sight of God." },
    { term: "Redemption", def: "The action of saving or being saved from sin, error, or evil." },
    { term: "Sanctification", def: "The process of being made holy, resulting in a changed lifestyle." },
    { term: "Trinity", def: "The Christian Godhead as one God in three persons: Father, Son, and Holy Spirit." },
    { term: "Zion", def: "A synonym for Jerusalem, also used to refer to the people of God." },
    { term: "Messiah", def: "The promised deliverer of the Jewish nation prophesied in the Hebrew Bible; Jesus Christ." }
];

const PRAYER_CATEGORIES = [
    { cat: "Warfare", title: "Protection Against Evil", text: "Heavenly Father, I put on the full armor of God. I stand against the wiles of the enemy. I plead the blood of Jesus over my life, my family, and my home. No weapon formed against me shall prosper." },
    { cat: "Healing", title: "Prayer for Health", text: "Lord Jesus, You are the Great Physician. By Your stripes, I am healed. I speak life to every cell in my body. Restore my strength and renew my mind." },
    { cat: "Finance", title: "Financial Breakthrough", text: "Jehovah Jireh, You are my provider. I pray for wisdom in my finances. Open the windows of heaven and pour out a blessing that I cannot contain." },
    { cat: "Family", title: "Family Unity", text: "Lord, bring peace to my home. Let love bind us together. I rebuke the spirit of division and confusion. Let our household serve the Lord." },
    { cat: "Nation", title: "Prayer for Liberia", text: "God of Nations, we lift up Liberia. We pray for peace, leadership, and prosperity. Let righteousness exalt our nation." }
];

// --- Components ---

function BriefcaseIcon({ className }: { className: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
}

// 1. Sidebar
const Sidebar = ({ activeView, onViewChange, mobileOpen, setMobileOpen, user, onSignOut, onPlayAmbient, installAction, canInstall, darkMode, toggleDarkMode }: any) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <Compass className="w-5 h-5" /> },
    { id: 'bible', label: 'Holy Bible', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tv', label: 'Gospel TV', icon: <Tv className="w-5 h-5" /> },
    { id: 'community', label: 'Fellowship', icon: <Users className="w-5 h-5" /> },
    { id: 'toolbox', label: 'Toolbox', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: 'treasury', label: 'Treasury', icon: <Library className="w-5 h-5" /> },
    { id: 'about', label: 'Creator', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-spiritual-200'} border-r z-50 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-spiritual-800">
            <Sun className="w-8 h-8 text-spiritual-500 fill-current" />
            <div>
              <h1 className={`font-serif text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Spiritual</h1>
              <h2 className="text-xs uppercase tracking-widest text-spiritual-500">Welfare</h2>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Ambient Music Section */}
        <div className="px-4 py-2">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-spiritual-50 border-spiritual-100'} rounded-xl p-3 border`}>
                <div className={`flex items-center gap-2 mb-2 ${darkMode ? 'text-gray-300' : 'text-spiritual-700'}`}>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Ambient Music</span>
                </div>
                <div className="space-y-1 h-24 overflow-y-auto scrollbar-hide">
                    {AMBIENT_TRACKS.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => onPlayAmbient(t)}
                            className={`w-full text-[10px] rounded px-2 py-1 truncate text-left transition-colors flex items-center gap-2
                                ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-spiritual-100 border border-spiritual-200'}
                            `}
                        >
                            {t.type === 'video' ? <Tv className="w-3 h-3 text-red-400"/> : <Music className="w-3 h-3 text-blue-400"/>}
                            {t.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide pb-20">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeView === item.id 
                  ? 'bg-spiritual-500 text-white font-semibold shadow-md' 
                  : (darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50 hover:text-spiritual-600')}
              `}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <button 
             onClick={toggleDarkMode}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4 ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {canInstall && (
              <button 
                  onClick={installAction}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold mt-2"
              >
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Install App</span>
              </button>
          )}
        </nav>

        <div className={`p-6 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-spiritual-100 bg-white'} absolute bottom-0 w-full`}>
          <div className="flex items-center gap-3 mb-4">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-spiritual-200" />
             ) : (
                <div className="w-8 h-8 rounded-full bg-spiritual-200 flex items-center justify-center text-spiritual-600">
                    <User className="w-4 h-4" />
                </div>
             )}
             <div className="overflow-hidden flex-1">
                <p className={`text-sm font-bold truncate ${darkMode ? 'text-gray-200' : 'text-spiritual-800'}`}>{user?.displayName || 'Guest'}</p>
                <button onClick={onSignOut} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Sign Out
                </button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 2. Global Player
const GlobalPlayer = ({ media, onClose }: { media: MediaItem | null, onClose: () => void }) => {
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        if (media?.title.includes("Pad") || media?.title.includes("Rain") || media?.title.includes("Ambient") || media?.title.includes("Prayer")) {
            setMinimized(true);
        } else {
            setMinimized(false);
        }
    }, [media]);

    if (!media) return null;

    return (
        <div className={`
            fixed right-4 z-50 transition-all duration-300 shadow-2xl rounded-xl overflow-hidden bg-black border border-gray-800
            ${minimized ? 'bottom-4 w-72 h-20 flex items-center' : 'bottom-4 w-96 h-64 flex flex-col'}
        `}>
            <div className={`absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-20 ${minimized ? 'hidden' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
                <span className="text-xs text-white font-bold truncate px-2">{media.title}</span>
                <div className="flex gap-2">
                    <button onClick={() => setMinimized(true)} className="text-white hover:text-gray-300"><Minimize2 className="w-4 h-4"/></button>
                    <button onClick={onClose} className="text-white hover:text-red-400"><X className="w-4 h-4"/></button>
                </div>
            </div>

            {minimized && (
                 <div className="flex items-center justify-between w-full p-3 bg-gray-900">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center shrink-0">
                            {media.type === 'video' ? <Tv className="w-5 h-5 text-red-500"/> : <Music className="w-5 h-5 text-blue-500"/>}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">{media.title}</span>
                            <span className="text-xs text-gray-400">Now Playing</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setMinimized(false)} className="text-gray-300 hover:text-white"><Maximize2 className="w-5 h-5"/></button>
                        <button onClick={onClose} className="text-gray-300 hover:text-red-400"><X className="w-5 h-5"/></button>
                    </div>
                </div>
            )}

            <div className={`flex-1 relative bg-black ${minimized ? 'hidden' : 'block'}`}>
                 {media.type === 'video' || (media.url && media.url.length === 11 && !media.url.includes("http")) ? (
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${media.url}?autoplay=1&enablejsapi=1&loop=1&playlist=${media.url}`} 
                        title="Media Player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="absolute inset-0"
                    ></iframe>
                 ) : (
                     <div className="h-full flex items-center justify-center bg-gray-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-50"></div>
                        <Music className="w-12 h-12 text-white/50 animate-pulse relative z-10" />
                        <audio src={media.url} controls autoPlay loop className="absolute bottom-0 w-full px-4 mb-4 z-20" />
                     </div>
                 )}
            </div>
            
            {minimized && media.type !== 'video' && media.url.includes("http") && (
                <audio src={media.url} autoPlay loop className="hidden" />
            )}
             {minimized && (media.type === 'video' || !media.url.includes("http")) && (
                <iframe 
                    width="100" 
                    height="100" 
                    src={`https://www.youtube.com/embed/${media.url}?autoplay=1&enablejsapi=1&loop=1&playlist=${media.url}`} 
                    title="Hidden Player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    className="absolute opacity-0 pointer-events-none"
                ></iframe>
            )}
        </div>
    );
};

// 3. New Advanced Explorer Modules

// Bible Dictionary
const BibleDictionary = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filtered = DICTIONARY_TERMS.filter(t => t.term.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Book className="w-6 h-6 text-emerald-600"/> Bible Dictionary</h2>
            <input 
                className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                placeholder="Search definition (e.g. Grace)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto space-y-3">
                {filtered.map((item, idx) => (
                    <div key={idx} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <h3 className="font-bold text-emerald-900 text-lg">{item.term}</h3>
                        <p className="text-gray-700 font-serif leading-relaxed mt-1">{item.def}</p>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-center text-gray-400">No definitions found.</p>}
            </div>
        </div>
    );
};

// Reading Plans
const ReadingPlans = () => {
    const [plan, setPlan] = useState<'yearly' | 'nt90' | 'proverbs'>('yearly');
    // Simulated persistence key
    const getStoredProgress = (key: string) => {
        try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const [progress, setProgress] = useState<number[]>(getStoredProgress(`plan_${plan}`));

    const toggleDay = (day: number) => {
        let newProg;
        if (progress.includes(day)) newProg = progress.filter(d => d !== day);
        else newProg = [...progress, day];
        setProgress(newProg);
        localStorage.setItem(`plan_${plan}`, JSON.stringify(newProg));
    };

    const getPlanData = () => {
        if (plan === 'yearly') return { title: "Bible in a Year", days: 365, prefix: "Day" };
        if (plan === 'nt90') return { title: "New Testament (90 Days)", days: 90, prefix: "Day" };
        return { title: "Proverbs (Monthly)", days: 31, prefix: "Proverb" };
    };

    const data = getPlanData();

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-600"/> Reading Plans</h2>
                <select value={plan} onChange={(e) => {setPlan(e.target.value as any); setProgress(getStoredProgress(`plan_${e.target.value}`))}} className="border p-2 rounded-lg text-sm">
                    <option value="yearly">Bible in a Year</option>
                    <option value="nt90">NT in 90 Days</option>
                    <option value="proverbs">Proverbs Monthly</option>
                </select>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-4 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-blue-900">{data.title}</h3>
                    <p className="text-xs text-blue-600">{progress.length} / {data.days} Completed</p>
                </div>
                <div className="text-2xl font-bold text-blue-500">{Math.round((progress.length / data.days) * 100)}%</div>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 md:grid-cols-5 gap-3 content-start">
                {Array.from({length: data.days}).map((_, i) => {
                    const day = i + 1;
                    const done = progress.includes(day);
                    return (
                        <button 
                            key={day} 
                            onClick={() => toggleDay(day)}
                            className={`p-2 rounded-lg text-sm font-bold border transition-all ${done ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                        >
                            {done && <CheckCircle className="w-3 h-3 inline mr-1"/>}
                            {data.prefix} {day}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

// Prayer Bank
const PrayerBank = () => {
    const [category, setCategory] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-purple-600"/> Prayer Warfare Room</h2>
            
            {category ? (
                <div className="flex-1 overflow-y-auto">
                    <button onClick={() => setCategory(null)} className="mb-4 text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Back to Categories</button>
                    <div className="space-y-6">
                        {PRAYER_CATEGORIES.filter(c => c.cat === category).map((p, i) => (
                            <div key={i} className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                <h3 className="font-bold text-purple-900 text-xl mb-3">{p.title}</h3>
                                <p className="font-serif text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">{p.text}</p>
                                <div className="mt-4 flex gap-2 justify-end">
                                    <button className="text-xs font-bold text-purple-600 bg-white px-3 py-1 rounded-full border border-purple-200" onClick={() => navigator.clipboard.writeText(p.text)}>Copy Prayer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from(new Set(PRAYER_CATEGORIES.map(p => p.cat))).map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} className="p-6 rounded-xl bg-gray-50 hover:bg-purple-50 hover:scale-105 transition-all border border-gray-200 text-left group">
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-purple-700">{cat} Prayers</h3>
                            <p className="text-sm text-gray-500 mt-1">Access powerful prayers for {cat.toLowerCase()}.</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Spiritual Goals
const SpiritualGoals = () => {
    const goals = [
        { id: 'pray', label: 'Morning Prayer', icon: <Wind className="w-5 h-5 text-blue-500"/> },
        { id: 'read', label: 'Read Bible Chapter', icon: <BookOpen className="w-5 h-5 text-emerald-500"/> },
        { id: 'worship', label: '10 Mins Worship', icon: <Music className="w-5 h-5 text-rose-500"/> },
        { id: 'kindness', label: 'Act of Kindness', icon: <Heart className="w-5 h-5 text-pink-500"/> }
    ];
    const [completed, setCompleted] = useState<string[]>([]);

    const toggle = (id: string) => {
        if (completed.includes(id)) setCompleted(completed.filter(c => c !== id));
        else setCompleted([...completed, id]);
    };

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-2 flex items-center gap-2"><Target className="w-6 h-6 text-red-500"/> Spiritual Goals</h2>
            <p className="text-gray-500 mb-6">"Discipline yourself for the purpose of godliness." - 1 Tim 4:7</p>
            
            <div className="space-y-4">
                {goals.map(g => {
                    const isDone = completed.includes(g.id);
                    return (
                        <button key={g.id} onClick={() => toggle(g.id)} className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${isDone ? 'bg-white' : 'bg-white shadow-sm'}`}>{g.icon}</div>
                                <span className={`font-bold text-lg ${isDone ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>{g.label}</span>
                            </div>
                            {isDone ? <CheckCircle className="w-6 h-6 text-green-500"/> : <div className="w-6 h-6 rounded-full border-2 border-gray-300"/>}
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-spiritual-600 to-spiritual-500 rounded-2xl text-white text-center">
                <div className="text-4xl font-bold mb-1">{Math.round((completed.length / goals.length) * 100)}%</div>
                <div className="text-sm opacity-90">Daily Completion</div>
            </div>
        </div>
    );
};

// 4. Hubs (Updated)

const ToolboxHub = ({ onViewChange }: { onViewChange: (v: ViewState) => void }) => {
    const tools = [
        { id: 'notes', title: 'Sermon Notes', icon: <FileText className="w-6 h-6 text-blue-500"/>, desc: 'Digital Notepad' },
        { id: 'fasting', title: 'Fasting Timer', icon: <Timer className="w-6 h-6 text-purple-500"/>, desc: 'Track your fast' },
        { id: 'tithe', title: 'Tithe Calc', icon: <Calculator className="w-6 h-6 text-green-500"/>, desc: '10% Calculator' },
        { id: 'trivia', title: 'Bible Trivia', icon: <BrainCircuit className="w-6 h-6 text-orange-500"/>, desc: 'Test Knowledge' },
        { id: 'journal', title: 'My Journal', icon: <PenTool className="w-6 h-6 text-pink-500"/>, desc: 'Daily Diary' },
        { id: 'goals', title: 'Spiritual Goals', icon: <Target className="w-6 h-6 text-red-500"/>, desc: 'Habit Tracker' },
    ];
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full overflow-y-auto">
            <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800"><BriefcaseIcon className="w-8 h-8"/> Christian Toolbox</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {tools.map(t => (
                    <button key={t.id} onClick={() => onViewChange(t.id as ViewState)} className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all text-left group">
                        <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            {t.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{t.title}</h3>
                        <p className="text-sm text-gray-500">{t.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

const TreasuryHub = ({ onViewChange }: { onViewChange: (v: ViewState) => void }) => {
    const items = [
        { id: 'dictionary', title: 'Bible Dictionary', icon: <Book className="w-6 h-6 text-emerald-500"/>, desc: 'A-Z Glossary' },
        { id: 'prayer_bank', title: 'Prayer Warfare', icon: <Shield className="w-6 h-6 text-purple-500"/>, desc: 'Powerful Prayers' },
        { id: 'plans', title: 'Reading Plans', icon: <Calendar className="w-6 h-6 text-blue-500"/>, desc: 'Track Progress' },
        { id: 'hymnal', title: 'Digital Hymnal', icon: <Music className="w-6 h-6 text-rose-500"/>, desc: 'Classic Lyrics' },
        { id: 'promises', title: '100 Promises', icon: <Star className="w-6 h-6 text-amber-500"/>, desc: 'Biblical Truths' },
        { id: 'names', title: 'Names of God', icon: <Globe className="w-6 h-6 text-teal-500"/>, desc: 'Hebrew Meanings' },
        { id: 'topics', title: 'Topic Guide', icon: <List className="w-6 h-6 text-indigo-500"/>, desc: 'Scripture Search' },
        { id: 'mysteries', title: 'Deep Mysteries', icon: <Eye className="w-6 h-6 text-violet-500"/>, desc: 'Prophecy' },
        { id: 'bible', title: 'Bible Stories', icon: <BookOpen className="w-6 h-6 text-cyan-500"/>, desc: 'Famous Events' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full overflow-y-auto">
            <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800"><Library className="w-8 h-8"/> Spiritual Treasury</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(t => (
                    <button key={t.id} onClick={() => onViewChange(t.id as ViewState)} className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all text-left group">
                        <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            {t.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">{t.title}</h3>
                        <p className="text-sm text-gray-500">{t.desc}</p>
                    </button>
                ))}
            </div>
             <div className="mt-8 text-center text-xs text-gray-400">
                10,000+ Resources and growing daily.
            </div>
        </div>
    );
}

// 5. Existing Components Refined

const CreatorProfile = () => {
    const [image, setImage] = useState<string>(() => {
        try {
            return localStorage.getItem("creator_profile_pic") || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        } catch {
            return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        }
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    const result = ev.target.result as string;
                    setImage(result);
                    try {
                        localStorage.setItem("creator_profile_pic", result);
                    } catch (err) {
                        console.error("Failed to save image", err);
                    }
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-full overflow-y-auto pb-20">
            <div className="bg-white rounded-3xl shadow-xl border border-spiritual-100 overflow-hidden">
                <div className="bg-gradient-to-r from-spiritual-800 to-spiritual-600 h-48 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>
                
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 -mt-16 items-start">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gray-200 relative">
                                <img 
                                    src={image} 
                                    alt="Akin S. Sokpah" 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                />
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white mb-1" />
                                    <span className="sr-only">Upload Photo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 pt-4 md:pt-16">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 font-serif flex items-center gap-2">
                                        Akin S. Sokpah
                                        <BadgeCheck className="w-6 h-6 text-blue-500 fill-current" />
                                    </h1>
                                    <p className="text-spiritual-600 font-medium flex items-center gap-1">
                                        <MapPin className="w-4 h-4"/> Liberia, West Africa
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6 text-gray-600 leading-relaxed font-serif text-lg">
                                "I created Spiritual Welfare with a vision to merge technology and faith. 
                                My goal is to provide a sanctuary where believers can access the word of God, worship, and fellowship freely."
                            </p>

                            <div className="mt-6 space-y-2">
                                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Phone className="w-5 h-5 text-spiritual-500" />
                                    <a href="tel:+231889183557" className="font-semibold hover:text-spiritual-600">+231 88 918 3557</a>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Mail className="w-5 h-5 text-spiritual-500" />
                                    <a href="mailto:sokpahakinsaye@gmail.com" className="font-semibold hover:text-spiritual-600">sokpahakinsaye@gmail.com</a>
                                </div>
                                <a 
                                    href="https://www.facebook.com/profile.php?id=61583456361691" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                    <span className="font-semibold">Connect on Facebook</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Hymnal = () => {
    const hymns = [
        { title: "Amazing Grace", lyrics: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see." },
        { title: "How Great Thou Art", lyrics: "O Lord my God, When I in awesome wonder,\nConsider all the worlds Thy Hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed." },
        { title: "It Is Well With My Soul", lyrics: "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou has taught me to say,\nIt is well, it is well, with my soul." },
        { title: "Holy, Holy, Holy", lyrics: "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!" },
        { title: "Blessed Assurance", lyrics: "Blessed assurance, Jesus is mine!\nOh, what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood." },
        { title: "The Old Rugged Cross", lyrics: "On a hill far away stood an old rugged cross,\nThe emblem of suffering and shame;\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain." },
    ];
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2"><Music className="w-6 h-6 text-indigo-500"/> Digital Hymnal</h2>
                <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-indigo-600">Back to List</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                {selected === null ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hymns.map((h, i) => (
                            <button key={i} onClick={() => setSelected(i)} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md transition-all text-left">
                                <span className="font-bold text-gray-800 text-lg block">{h.title}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Classic Hymn</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-serif text-3xl font-bold text-indigo-900 mb-6">{hymns[selected].title}</h3>
                        <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-700">{hymns[selected].lyrics}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Promises = () => {
    const promises = [
        "I am with you always. (Matthew 28:20)",
        "I will give you rest. (Matthew 11:28)",
        "I will supply all your needs. (Philippians 4:19)",
        "My grace is sufficient for you. (2 Corinthians 12:9)",
        "I will never leave you nor forsake you. (Hebrews 13:5)",
        "All things work together for good. (Romans 8:28)",
        "If we confess our sins, He is faithful to forgive. (1 John 1:9)",
        "I go to prepare a place for you. (John 14:2)",
        "Ask, and it will be given to you. (Matthew 7:7)",
        "Peace I leave with you; my peace I give you. (John 14:27)"
    ];

    return (
        <div className="bg-white rounded-2xl h-full p-6 border border-gray-100 overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2"><Star className="w-6 h-6 text-amber-500"/> 100 Promises of God</h2>
            <div className="grid grid-cols-1 gap-3">
                {promises.map((p, i) => (
                    <div key={i} className="p-4 rounded-lg bg-amber-50 border border-amber-100 text-amber-900 font-serif font-medium">
                        {p}
                    </div>
                ))}
            </div>
            <p className="text-center text-gray-400 mt-8 text-sm">And 90 more available in the full version...</p>
        </div>
    );
};

const SermonNotes = () => {
    const [note, setNote] = useState(() => localStorage.getItem('sermon_notes') || '');
    const saveNote = (val: string) => {
        setNote(val);
        localStorage.setItem('sermon_notes', val);
    };

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-blue-500"/> Sermon Notepad</h2>
            <textarea 
                className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none font-serif text-lg leading-relaxed"
                placeholder="Write your sermon notes here. They will be saved automatically..."
                value={note}
                onChange={(e) => saveNote(e.target.value)}
            />
            <p className="text-right text-xs text-gray-400 mt-2">Auto-saved to device</p>
        </div>
    );
};

const FastingTimer = () => {
    const [active, setActive] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: any = null;
        if (active) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!active && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [active, seconds]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col items-center justify-center border border-gray-100 p-6">
            <Timer className="w-16 h-16 text-purple-500 mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Fasting Timer</h2>
            <p className="text-gray-500 mb-8">"When you fast, do not look somber..." - Matt 6:16</p>
            
            <div className="text-6xl font-mono font-bold text-gray-800 mb-8 tracking-wider">
                {formatTime(seconds)}
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setActive(!active)}
                    className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 ${active ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {active ? 'Stop Fast' : 'Start Fast'}
                </button>
                <button onClick={() => {setActive(false); setSeconds(0)}} className="px-8 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                    Reset
                </button>
            </div>
        </div>
    );
};

const BibleTrivia = () => {
    const questions = [
        { q: "Who built the Ark?", options: ["Moses", "Noah", "David", "Jesus"], a: "Noah" },
        { q: "What is the first book of the Bible?", options: ["Genesis", "Exodus", "Matthew", "Revelation"], a: "Genesis" },
        { q: "Who defeated Goliath?", options: ["Saul", "Solomon", "David", "Samson"], a: "David" },
        { q: "Where was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"], a: "Bethlehem" },
        { q: "Who betrayed Jesus?", options: ["Peter", "John", "Judas", "Thomas"], a: "Judas" }
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const handleAnswer = (opt: string) => {
        if (opt === questions[current].a) {
            setScore(score + 1);
        }
        const next = current + 1;
        if (next < questions.length) {
            setCurrent(next);
        } else {
            setShowScore(true);
        }
    };

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col items-center justify-center p-6 border border-gray-100">
            {showScore ? (
                <div className="text-center animate-in zoom-in">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-xl text-gray-600">You scored {score} out of {questions.length}</p>
                    <button onClick={() => {setCurrent(0); setScore(0); setShowScore(false)}} className="mt-6 px-6 py-2 bg-spiritual-600 text-white rounded-full">Play Again</button>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-4 uppercase">
                        <span>Question {current + 1}/{questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">{questions[current].q}</h2>
                    <div className="space-y-3">
                        {questions[current].options.map(opt => (
                            <button 
                                key={opt}
                                onClick={() => handleAnswer(opt)}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-spiritual-50 hover:border-spiritual-200 hover:text-spiritual-700 font-bold transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Mysteries = () => {
    const library: Record<string, string> = {
        "The Book of Revelation": "The Book of Revelation is the final book of the New Testament. It was written by John the Apostle on the island of Patmos. It describes prophetic visions of the end times, the ultimate victory of Jesus Christ over evil, and the establishment of the New Heaven and New Earth. Key themes include the Seven Seals, the Seven Trumpets, the Beast, and the return of the King.",
        "Angels & Demons": "The Bible teaches that spiritual warfare is real (Ephesians 6:12). Angels are ministering spirits sent to serve those who will inherit salvation (Hebrews 1:14). Demons are fallen angels who rebelled with Lucifer. Believers are given authority over the enemy through the name of Jesus Christ.",
        "Heaven & Hell": "Heaven is the dwelling place of God, a place of eternal joy, worship, and peace prepared for those who love Him. Hell is described as a place of separation from God. Jesus spoke more about hell than anyone else in scripture, warning us to choose life.",
        "The Antichrist": "Scripture warns of a figure of lawlessness who will deceive many before the return of Christ (2 Thessalonians 2). He will oppose God and exalt himself. Believers are called to be watchful, rooted in truth, and not deceived by false signs and wonders.",
        "Prophecies Fulfilled": "The Bible contains hundreds of prophecies that have already been fulfilled, particularly concerning the birth, life, death, and resurrection of Jesus. For example, Isaiah 53 accurately predicted the suffering servant centuries before Christ was born.",
    };

    const topics = Object.keys(library).map(t => ({ 
        title: t, 
        desc: "Biblical truth regarding this mystery.",
    }));

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 h-full flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/3 bg-spiritual-50 p-6 border-r border-spiritual-100 overflow-y-auto">
                <h2 className="font-serif text-2xl font-bold text-spiritual-900 mb-6 flex items-center gap-2">
                    <Eye className="w-6 h-6"/> Deep Mysteries
                </h2>
                <div className="space-y-3">
                    {topics.map(t => (
                        <button 
                            key={t.title}
                            onClick={() => setSelectedTopic(t.title)}
                            className={`w-full text-left p-4 rounded-xl transition-all border border-transparent hover:shadow-md
                                ${selectedTopic === t.title ? 'bg-white shadow-md border-spiritual-200 ring-1 ring-spiritual-100' : 'hover:bg-white'}
                            `}
                        >
                            <h3 className="font-bold text-gray-800">{t.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-white relative">
                {!selectedTopic ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 opacity-60">
                        <Eye className="w-24 h-24 mb-4" />
                        <p className="text-lg">Select a mystery to reveal the truth.</p>
                        <p className="text-sm italic">"For nothing is hidden that will not be made manifest..."</p>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="font-serif text-4xl text-spiritual-900 font-bold mb-6">{selectedTopic}</h2>
                        <div className="prose prose-lg prose-spiritual text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                            {library[selectedTopic]}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TopicGuide = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const topics = [
        { name: "Anxiety", verse: "Philippians 4:6-7", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
        { name: "Fear", verse: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you." },
        { name: "Sadness", verse: "Psalm 34:18", text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit." },
        { name: "Strength", verse: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles." },
        { name: "Love", verse: "1 Corinthians 13:4-7", text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud." },
        { name: "Forgiveness", verse: "Ephesians 4:32", text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you." },
    ];

    const filtered = topics.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-spiritual-100 shadow-sm p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><List className="w-6 h-6 text-spiritual-600"/> Scripture Topic Guide</h2>
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                    <input 
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spiritual-200 focus:outline-none"
                        placeholder="Search for a feeling (e.g., Fear, Love)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-20">
                {filtered.map(t => (
                    <div key={t.name} className="p-5 bg-spiritual-50 rounded-xl border border-spiritual-100 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-spiritual-800 text-lg mb-1">{t.name}</h3>
                        <p className="text-sm font-bold text-spiritual-500 mb-2">{t.verse}</p>
                        <p className="text-gray-700 italic font-serif">"{t.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BibleReader = () => {
    const [book, setBook] = useState("Genesis");
    const [chapter, setChapter] = useState(1);
    const [verses, setVerses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchScripture = async (b: string, c: number) => {
        setLoading(true);
        try {
            const response = await fetch(`https://bible-api.com/${b}+${c}`);
            const data = await response.json();
            setVerses(data.verses || []);
        } catch (e) {
            setVerses([{text: "Error loading scripture. Please check internet connection.", verse: 1}]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScripture(book, chapter);
    }, [book, chapter]);

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-spiritual-100 overflow-hidden">
             <div className="p-4 flex gap-2 items-center justify-center bg-white border-b border-gray-100 shadow-sm z-10">
                <select value={book} onChange={(e) => {setBook(e.target.value); setChapter(1)}} className="p-2 border rounded font-serif">
                    {BIBLE_BOOKS.map(b => <option key={b}>{b}</option>)}
                </select>
                <input type="number" value={chapter} onChange={(e) => setChapter(Number(e.target.value))} className="w-16 p-2 border rounded text-center" min="1"/>
                <button onClick={() => fetchScripture(book, chapter)} className="bg-spiritual-600 text-white p-2 rounded"><RefreshCw className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-lg prose-spiritual max-w-none">
                {loading ? <div className="flex justify-center pt-20"><Loader2 className="animate-spin w-8 h-8"/></div> : (
                    <div>
                        <h1 className="text-center font-serif text-4xl mb-8">{book} {chapter}</h1>
                        {verses.map(v => (
                            <p key={v.verse} className="mb-4 relative pl-4 hover:bg-yellow-50 transition-colors p-2 rounded cursor-pointer group">
                                <span className="absolute left-0 text-xs text-spiritual-400 font-sans top-3">{v.verse}</span>
                                <span className="font-serif text-gray-800 text-xl leading-relaxed">{v.text}</span>
                                <button className="hidden group-hover:block absolute right-0 top-0 text-xs text-spiritual-400 p-1"><Bookmark className="w-4 h-4" /></button>
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// 6. Dashboard (Expanded - Super App Style)
const Dashboard = ({ onViewChange, user }: { onViewChange: (view: ViewState) => void, user: FirebaseUser }) => {
    const copyLink = () => {
        navigator.clipboard.writeText("https://spiritual-welfare.vercel.app/");
        alert("Link copied! Share it on WhatsApp or Facebook.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
             {/* Header Card */}
             <div className="bg-gradient-to-r from-spiritual-700 to-spiritual-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                     <h1 className="font-serif text-4xl font-bold mb-2">Welcome, {user.displayName?.split(' ')[0]}</h1>
                     <p className="text-spiritual-100 mb-6 max-w-lg font-serif italic text-lg">"The Lord bless you and keep you; the Lord make his face shine on you..." - Numbers 6:24</p>
                     <div className="flex gap-3">
                        <button onClick={copyLink} className="bg-white text-spiritual-900 hover:bg-spiritual-50 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg transform hover:-translate-y-1">
                            <Share2 className="w-4 h-4"/> Share Gospel
                        </button>
                        <button onClick={() => onViewChange('toolbox')} className="bg-spiritual-800 border border-spiritual-600 hover:bg-spiritual-700 px-6 py-3 rounded-full text-sm font-bold transition-all">
                            Open Toolbox
                        </button>
                     </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
             </div>

             {/* Daily Word */}
             <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                 <div className="bg-amber-100 p-3 rounded-xl"><Quote className="w-8 h-8 text-amber-600"/></div>
                 <div>
                     <h3 className="font-bold text-amber-900 mb-2 uppercase tracking-wide text-xs">Verse of the Day</h3>
                     <p className="text-amber-900 font-serif text-xl leading-relaxed">"Faith is taking the first step even when you don't see the whole staircase."</p>
                 </div>
             </div>
             
             {/* Quick Actions Grid */}
             <div>
                <h3 className="font-bold text-gray-800 text-lg mb-4 ml-1">Explore Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'bible', title: 'Holy Bible', icon: <BookOpen className="text-emerald-500"/>, color: 'bg-emerald-50' },
                        { id: 'prayer_bank', title: 'Prayer Room', icon: <Shield className="text-purple-500"/>, color: 'bg-purple-50' },
                        { id: 'tv', title: 'Gospel TV', icon: <Tv className="text-rose-500"/>, color: 'bg-rose-50' },
                        { id: 'community', title: 'Fellowship', icon: <Users className="text-indigo-500"/>, color: 'bg-indigo-50' },
                        { id: 'plans', title: 'Reading Plans', icon: <Calendar className="text-blue-500"/>, color: 'bg-blue-50' },
                        { id: 'dictionary', title: 'Dictionary', icon: <Book className="text-teal-500"/>, color: 'bg-teal-50' },
                        { id: 'hymnal', title: 'Hymnal', icon: <Music className="text-pink-500"/>, color: 'bg-pink-50' },
                        { id: 'goals', title: 'Goals', icon: <Target className="text-orange-500"/>, color: 'bg-orange-50' },
                    ].map(f => (
                        <button key={f.id} onClick={() => onViewChange(f.id as ViewState)} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-left group hover:-translate-y-1">
                            <div className={`${f.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                {React.cloneElement(f.icon as any, { className: `w-5 h-5 ${f.icon.props.className}` })}
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{f.title}</span>
                        </button>
                    ))}
                </div>
             </div>
        </div>
    );
};

// 7. Community Chat (Unchanged but type checked)
const CommunityChat = ({ user }: { user: FirebaseUser }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const dummyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, "chat_messages"), orderBy("createdAt", "desc"), limit(100));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
            });
            setMessages(msgs.reverse());
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => { dummyRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await addDoc(collection(db, "chat_messages"), {
            text: newMessage,
            userId: user.uid,
            displayName: user.displayName || "Anonymous",
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp()
        });
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5"/> Global Fellowship
                </h2>
                <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Live
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => {
                    const isMe = msg.userId === user.uid;
                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className="shrink-0">
                                {msg.photoURL ? <img src={msg.photoURL} className="w-8 h-8 rounded-full" alt="Av"/> : <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{msg.displayName?.[0]}</div>}
                            </div>
                            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-spiritual-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={dummyRef}></div>
            </div>
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-spiritual-300" placeholder="Share a blessing..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className="bg-spiritual-600 text-white p-2 rounded-full"><Send className="w-5 h-5"/></button>
            </form>
        </div>
    );
};

// 8. Video Components
const GospelTV = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const channels = [
        { name: "Gospel Worship 24/7", vidId: "M2CC6g3O4iI" }, 
        { name: "Hillsong Worship", vidId: "a3aF2n6bV0c" }, 
        { name: "Elevation Worship", vidId: "Zp6aygmvzM4" }, 
        { name: "Black Gospel Hits", vidId: "Q71t8lT8BvI" },
        { name: "Instrumental Prayer", vidId: "s7j6e1g5d8w" },
        { name: "Gaither Music", vidId: "tC3SWA1pE_k" },
        { name: "Tasha Cobbs", vidId: "L8fD-s4a7aQ" },
        { name: "Maverick City", vidId: "N1o8t6vD8_c" },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
             <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Tv className="w-6 h-6 text-red-500"/> Live Gospel TV</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
                 {channels.map((c, i) => (
                     <button key={i} onClick={() => setMedia({ id: String(i), title: c.name, type: 'video', url: c.vidId })} className="aspect-video bg-gray-100 rounded-lg relative group overflow-hidden">
                         <img src={`https://img.youtube.com/vi/${c.vidId}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Play className="text-white w-8 h-8"/></div>
                         <span className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-xs p-1 truncate">{c.name}</span>
                     </button>
                 ))}
             </div>
        </div>
    );
};

const SpiritualCinema = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const movies = [
        { id: '1', title: "The Life of Jesus", url: "47MwVJ6y_oI" },
        { id: '2', title: "War Room Clips", url: "V1pZf5Q9eQA" },
        { id: '3', title: "God's Not Dead", url: "M1M_d55_H_o" },
        { id: '4', title: "The Chosen", url: "craeyJdrCsE" },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <h2 className="font-serif text-3xl text-gray-800 font-bold mb-6 flex items-center gap-2"><Film className="w-8 h-8 text-spiritual-600"/> Spiritual Cinema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                {movies.map(movie => (
                    <div key={movie.id} className="group cursor-pointer" onClick={() => setMedia({ id: movie.id, title: movie.title, type: 'video', url: movie.url })}>
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                            <img src={`https://img.youtube.com/vi/${movie.url}/mqdefault.jpg`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center"><Play className="w-8 h-8 text-white"/></div>
                        </div>
                        <h3 className="font-bold text-gray-800">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Worship = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const songs = [
        { id: "1", title: "Oceans", vidId: "OP-00EwLdiU" },
        { id: "2", title: "Way Maker", vidId: "iJCV_2H9xD0" },
        { id: "3", title: "10,000 Reasons", vidId: "DXDGE_lRI0E" },
    ];
    return (
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
             <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Music className="w-6 h-6 text-blue-500"/> Worship Music</h2>
             <div className="space-y-3">
                 {songs.map(s => (
                     <button key={s.id} onClick={() => setMedia({ id: s.id, title: s.title, type: 'video', url: s.vidId })} className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group border border-transparent hover:border-gray-100">
                         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Play className="w-5 h-5 ml-1 fill-current"/></div>
                         <div><h3 className="font-bold text-gray-800">{s.title}</h3></div>
                     </button>
                 ))}
             </div>
        </div>
    );
};

// 9. Login / Landing Page (SEO Optimized)
const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-spiritual-900 to-spiritual-700 text-white">
                <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                            <Sun className="w-10 h-10 text-yellow-400" />
                            <h1 className="font-serif text-3xl font-bold">Spiritual Welfare</h1>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">Your Digital Sanctuary for <span className="text-yellow-400">Faith</span> & Fellowship.</h2>
                        <p className="text-spiritual-100 text-lg mb-8 leading-relaxed">
                            Join thousands of believers accessing the Holy Bible, Live Gospel TV, and 24/7 Prayer Support. Created by Akin S. Sokpah to bring the Gospel to Liberia and the world.
                        </p>
                        <button onClick={onLogin} className="bg-white text-spiritual-900 hover:bg-spiritual-50 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mx-auto md:mx-0">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                            Start Your Journey
                        </button>
                    </div>
                    <div className="md:w-1/2">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                             <div className="bg-white rounded-xl p-6 text-gray-800">
                                 <h3 className="font-bold text-spiritual-600 uppercase text-xs mb-2">Verse of the Moment</h3>
                                 <p className="font-serif text-2xl leading-relaxed mb-4">"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."</p>
                                 <p className="text-right font-bold text-gray-500">- Jeremiah 29:11</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section (Content for SEO) */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h3 className="text-spiritual-600 font-bold uppercase tracking-widest mb-2">Features</h3>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Everything You Need to Grow Spiritually</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Holy Bible Online", icon: <BookOpen className="w-8 h-8 text-blue-500"/>, desc: "Read the King James Version (KJV) and other translations completely free. Access daily reading plans to read the Bible in a year." },
                        { title: "24/7 Gospel TV", icon: <Tv className="w-8 h-8 text-red-500"/>, desc: "Watch live worship sessions, sermons, and Christian movies. Featuring hillsong, local Liberian gospel, and instrumental prayer music." },
                        { title: "Prayer Wall", icon: <Shield className="w-8 h-8 text-purple-500"/>, desc: "Submit prayer requests and join a community of prayer warriors. Find prayers for healing, finance, and family protection." }
                    ].map((f, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                            <div className="mb-4">{f.icon}</div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{f.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section (Rich Snippets for Google) */}
            <div className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is Spiritual Welfare free to use?", a: "Yes, Spiritual Welfare is completely free. Our mission is to spread the Gospel without cost." },
                            { q: "Who created Spiritual Welfare?", a: "The platform was created by Akin S. Sokpah, a developer from Liberia dedicated to digital evangelism." },
                            { q: "Can I use the app offline?", a: "Many features like the Bible reader and Journal work offline once loaded. Live TV and Chat require an internet connection." },
                            { q: "How can I contact the creator?", a: "You can reach Akin S. Sokpah via email at sokpahakinsaye@gmail.com or on Facebook." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-900 text-gray-400 py-12 text-center">
                <p>&copy; 2024 Spiritual Welfare. Created by Akin S. Sokpah.</p>
                <div className="flex justify-center gap-4 mt-4">
                    <a href="#" className="hover:text-white">Facebook</a>
                    <a href="#" className="hover:text-white">Contact</a>
                    <a href="#" className="hover:text-white">Privacy</a>
                </div>
            </div>
        </div>
    );
};

// 10. Main App
const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoadingAuth(false);
    });
    const handleBeforeInstallPrompt = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => { unsubscribe(); window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); };
  }, []);

  const handleGoogleLogin = async () => {
      try { await signInWithPopup(auth, googleProvider); } catch (error) { console.error("Login failed", error); }
  };
  const handleSignOut = () => signOut(auth);
  const handleInstallClick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
  };
  const playAmbient = (track: any) => setCurrentMedia({ id: track.id, title: `Ambient: ${track.title}`, type: track.type || 'audio', url: track.url });

  if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-spiritual-50"><Loader2 className="w-10 h-10 text-spiritual-500 animate-spin" /></div>;
  if (!user) return <LandingPage onLogin={handleGoogleLogin} />;

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Dashboard onViewChange={setActiveView} user={user} />;
      case 'toolbox': return <ToolboxHub onViewChange={setActiveView} />;
      case 'treasury': return <TreasuryHub onViewChange={setActiveView} />;
      
      // Tools
      case 'notes': return <SermonNotes />;
      case 'fasting': return <FastingTimer />;
      case 'tithe': return <div className="p-8 text-center text-gray-500">Tithe Calculator coming soon.</div>;
      case 'trivia': return <BibleTrivia />;
      case 'dictionary': return <BibleDictionary />;
      case 'plans': return <ReadingPlans />;
      case 'prayer_bank': return <PrayerBank />;
      case 'goals': return <SpiritualGoals />;
      
      // Treasury Items
      case 'hymnal': return <Hymnal />;
      case 'promises': return <Promises />;
      case 'names': return <div className="p-8 text-center text-gray-500">Names of God coming soon.</div>;
      
      // Existing
      case 'topics': return <TopicGuide />;
      case 'community': return <CommunityChat user={user} />;
      case 'cinema': return <SpiritualCinema setMedia={setCurrentMedia} />;
      case 'mysteries': return <Mysteries />;
      case 'bible': return <BibleReader />;
      case 'worship': return <Worship setMedia={setCurrentMedia} />;
      case 'tv': return <GospelTV setMedia={setCurrentMedia} />;
      case 'about': return <CreatorProfile />;
      default: return <Dashboard onViewChange={setActiveView} user={user} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-spiritual-50 text-gray-900'} font-sans overflow-hidden`}>
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onSignOut={handleSignOut}
        onPlayAmbient={playAmbient}
        installAction={handleInstallClick}
        canInstall={!!deferredPrompt}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
         <header className={`h-16 flex items-center justify-between px-4 border-b shrink-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-spiritual-100'}`}>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-serif font-bold text-lg capitalize flex items-center gap-2">
               {/* Optional Header Content */}
               <span className={darkMode ? 'text-gray-200' : 'text-spiritual-800'}>{activeView.replace('_', ' ')}</span>
            </div>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 scrollbar-hide">
            {renderContent()}
          </div>

          <GlobalPlayer media={currentMedia} onClose={() => setCurrentMedia(null)} />
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);