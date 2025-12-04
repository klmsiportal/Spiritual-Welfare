
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
  Plus
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();

// --- AI Services & Configuration ---

// OpenAI Helper
const callOpenAI = async (apiKey: string, prompt: string, systemPrompt: string) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error("OpenAI API Failed");
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "I am having trouble connecting to OpenAI. Please check your API Key in Settings.";
    }
};

// Offline/Free AI Logic (Rule-based Fallback)
const generateOfflineResponse = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes('sad') || lower.includes('depress')) return "The Lord is close to the brokenhearted and saves those who are crushed in spirit. (Psalm 34:18). You are loved.";
    if (lower.includes('anxious') || lower.includes('worry')) return "Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God. (Philippians 4:6)";
    if (lower.includes('love')) return "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. (1 Corinthians 13:4)";
    if (lower.includes('thank')) return "Give thanks in all circumstances; for this is God's will for you in Christ Jesus. (1 Thessalonians 5:18)";
    if (lower.includes('dream')) return "Dreams can be messages. Pray for wisdom to understand what your spirit is saying.";
    if (lower.includes('suicide') || lower.includes('kill') || lower.includes('die')) return "You are precious in God's eyes. Please reach out to a friend, pastor, or local helpline immediately. You have a purpose.";
    return "I am currently in offline mode, but remember: Faith is the assurance of things hoped for, the conviction of things not seen. How else can I help locally?";
};

// --- Types ---
type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  reminder?: string;
};

type ViewState = 'home' | 'chat' | 'meditate' | 'journal' | 'bible' | 'worship' | 'features' | 'about' | 'affirmations' | 'calendar' | 'tv' | 'dreams' | 'trivia' | 'mood' | 'prayers' | 'settings';

type UserProfile = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};

type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'online' | 'in-person';
};

type AIProvider = 'gemini' | 'openai' | 'offline';

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

// --- Components ---

// 1. Navigation Sidebar
const Sidebar = ({ activeView, onViewChange, mobileOpen, setMobileOpen, user, onSignOut }: any) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <Heart className="w-5 h-5" /> },
    { id: 'bible', label: 'Holy Bible', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'worship', label: 'Worship & Music', icon: <Music className="w-5 h-5" /> },
    { id: 'tv', label: 'Gospel TV Live', icon: <Tv className="w-5 h-5" /> },
    { id: 'chat', label: 'Spiritual Counselor', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'dreams', label: 'Dream Interpreter', icon: <CloudMoon className="w-5 h-5" /> },
    { id: 'meditate', label: 'Meditation', icon: <Wind className="w-5 h-5" /> },
    { id: 'journal', label: 'My Journal', icon: <PenTool className="w-5 h-5" /> },
    { id: 'mood', label: 'Mood Tracker', icon: <Activity className="w-5 h-5" /> },
    { id: 'affirmations', label: 'Affirmations', icon: <Smile className="w-5 h-5" /> },
    { id: 'prayers', label: 'Prayer Wall', icon: <Users className="w-5 h-5" /> },
    { id: 'trivia', label: 'Bible Trivia', icon: <Trophy className="w-5 h-5" /> },
    { id: 'calendar', label: 'Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'features', label: 'All 500+ Features', icon: <List className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings & AI', icon: <Settings className="w-5 h-5" /> },
    { id: 'about', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-spiritual-200 z-50 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-spiritual-800">
            <Sun className="w-8 h-8 text-spiritual-500 fill-current" />
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight">Spiritual</h1>
              <h2 className="text-xs uppercase tracking-widest text-spiritual-500">Welfare</h2>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
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
                  ? 'bg-spiritual-50 text-spiritual-700 font-semibold shadow-sm ring-1 ring-spiritual-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-spiritual-600'}
              `}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-spiritual-100 bg-spiritual-50/50 absolute bottom-0 w-full bg-white">
          <div className="flex items-center gap-3 mb-4">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-spiritual-200" />
             ) : (
                <div className="w-8 h-8 rounded-full bg-spiritual-200 flex items-center justify-center text-spiritual-600">
                    <User className="w-4 h-4" />
                </div>
             )}
             <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-spiritual-800 truncate">{user?.displayName || 'Guest'}</p>
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

// 2. Chat Component (AI Spiritual Counselor)
const SpiritualChat = ({ aiProvider, openAIKey }: { aiProvider: AIProvider, openAIKey: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Peace be with you. I am your spiritual companion. How may I support your spirit today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let responseText = "";
    const systemInstruction = "You are a wise, non-judgmental, and compassionate spiritual counselor. Your name is 'Guide'. Your goal is to provide comfort, spiritual wisdom (drawing from universal truths, but respecting the user's context), and mental wellness advice. Be concise but deep. Use soothing language.";

    try {
      if (aiProvider === 'offline') {
         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
         responseText = generateOfflineResponse(userMsg.text);
      } else if (aiProvider === 'openai' && openAIKey) {
         responseText = await callOpenAI(openAIKey, userMsg.text, systemInstruction);
      } else {
         // Default to Gemini
         const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMsg.text,
            config: { systemInstruction }
         });
         responseText = response.text || "I apologize, I am taking a moment of silence.";
      }
    } catch (err) {
      console.error(err);
      responseText = "I am having trouble connecting. Checking spiritual frequencies... (Please check internet or API Key in Settings)";
    } finally {
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-spiritual-100">
      <div className="p-4 border-b border-spiritual-50 bg-spiritual-50/50 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-spiritual-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Spiritual Counselor
        </h2>
        <span className={`text-xs px-2 py-1 rounded-full border ${aiProvider === 'offline' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-100 text-green-600 border-green-200'}`}>
          {aiProvider === 'gemini' ? 'Gemini AI' : aiProvider === 'openai' ? 'OpenAI' : 'Offline Mode'}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-spiritual-50/30" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm
              ${msg.role === 'user' 
                ? 'bg-spiritual-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-700 border border-spiritual-100 rounded-tl-none'}
            `}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-spiritual-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-spiritual-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-spiritual-500" />
               <span className="text-sm text-gray-400">Contemplating...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-spiritual-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what is on your mind..."
            className="flex-1 bg-spiritual-50 border border-spiritual-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-spiritual-400 placeholder-spiritual-300"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-spiritual-600 text-white p-3 rounded-xl hover:bg-spiritual-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Meditation Component with Music
const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Rest');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>('https://cdn.pixabay.com/download/audio/2022/02/07/audio_1822e427af.mp3?filename=relaxing-music-vol1-124477.mp3');
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = [
    { name: 'Ambient Rain', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_1822e427af.mp3?filename=relaxing-music-vol1-124477.mp3' },
    { name: 'Forest Birds', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=forest-lullaby-110624.mp3' },
    { name: 'Ocean Waves', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=soft-rain-ambient-111154.mp3' },
    { name: 'Mountain Stream', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=mountain-stream-118124.mp3' },
    { name: 'Gregorian Chant', url: 'https://cdn.pixabay.com/download/audio/2020/11/10/audio_547a462829.mp3?filename=monks-chanting-5437.mp3' },
    { name: 'White Noise', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_06d8123282.mp3?filename=white-noise-8120.mp3' },
  ];

  useEffect(() => {
    let timer: any;

    if (isActive) {
      if (phase === 'Rest') {
        setPhase('Inhale');
      } else if (phase === 'Inhale') {
        timer = setTimeout(() => setPhase('Hold'), 4000);
      } else if (phase === 'Hold') {
        timer = setTimeout(() => setPhase('Exhale'), 7000);
      } else if (phase === 'Exhale') {
        timer = setTimeout(() => setPhase('Inhale'), 8000);
      }
    } else {
      setPhase('Rest');
    }

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setAudioSrc(url);
          setIsPlayingMusic(false); 
          if (audioRef.current) {
            audioRef.current.load();
          }
      }
  };

  const getInstructions = () => {
    switch (phase) {
      case 'Inhale': return "Breathe in deeply...";
      case 'Hold': return "Hold your breath...";
      case 'Exhale': return "Release slowly...";
      default: return "Ready to begin?";
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-4">
        {/* Visualizer Side */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center p-8 bg-gradient-to-br from-spiritual-50 to-white rounded-2xl shadow-sm border border-spiritual-100">
            <div className="space-y-2">
                <h2 className="font-serif text-3xl text-spiritual-800">Breath of Life</h2>
                <p className="text-spiritual-500">Center your mind. Find your peace.</p>
            </div>

            <div className="relative w-72 h-72 flex items-center justify-center">
                {isActive && (
                <>
                    <div className={`absolute inset-0 rounded-full border-2 border-spiritual-200 animate-ping opacity-20`} />
                    <div className={`absolute inset-8 rounded-full border border-spiritual-300 animate-pulse opacity-30`} />
                </>
                )}
                
                <div className={`
                w-56 h-56 rounded-full bg-white shadow-xl flex flex-col items-center justify-center z-10 transition-all duration-[4000ms]
                ${phase === 'Inhale' ? 'scale-110 shadow-spiritual-300/50 bg-spiritual-50' : phase === 'Exhale' ? 'scale-90 shadow-spiritual-200/20' : 'scale-100'}
                `}>
                <span className="font-serif text-2xl font-bold text-spiritual-700 transition-all duration-500">
                    {isActive ? phase : 'Start'}
                </span>
                <span className="text-sm text-spiritual-400 mt-2 font-medium">
                    {getInstructions()}
                </span>
                </div>
            </div>

            <button
                onClick={() => setIsActive(!isActive)}
                className={`
                px-8 py-3 rounded-full font-medium transition-all shadow-md w-48
                ${isActive 
                    ? 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50' 
                    : 'bg-spiritual-600 text-white hover:bg-spiritual-700 hover:scale-105'}
                `}
            >
                {isActive ? 'End Session' : 'Begin'}
            </button>
        </div>

        {/* Audio Controls Side */}
        <div className="md:w-80 bg-white rounded-2xl border border-spiritual-100 p-6 flex flex-col h-full overflow-hidden">
            <h3 className="font-serif text-xl font-bold text-spiritual-800 mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-spiritual-500" /> Soundscape
            </h3>
            
            <audio ref={audioRef} src={audioSrc} loop />

            <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-1">
                {tracks.map((track, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            setAudioSrc(track.url);
                            setIsPlayingMusic(true);
                            setTimeout(() => audioRef.current?.play(), 100);
                        }}
                        className={`w-full text-left p-3 rounded-lg text-sm flex items-center justify-between transition-colors
                            ${audioSrc === track.url ? 'bg-spiritual-50 text-spiritual-700 border border-spiritual-100' : 'hover:bg-gray-50 text-gray-600'}
                        `}
                    >
                        {track.name}
                        {audioSrc === track.url && isPlayingMusic && <div className="w-2 h-2 rounded-full bg-spiritual-500 animate-pulse" />}
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-spiritual-50 space-y-4">
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={toggleMusic}
                        className="w-12 h-12 rounded-full bg-spiritual-600 text-white flex items-center justify-center hover:bg-spiritual-700 shadow-lg transition-transform hover:scale-105"
                    >
                        {isPlayingMusic ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
                    </button>
                </div>
                
                <label className="flex items-center justify-center gap-2 text-xs text-spiritual-500 cursor-pointer hover:text-spiritual-700 border border-dashed border-spiritual-200 p-3 rounded-lg hover:bg-spiritual-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload custom mp3</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
        </div>
    </div>
  );
};

// 4. Journal Component with Search & Reminders & Prompts
const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [reminder, setReminder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'write'>('list');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sw_journal');
      if (saved) setEntries(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load journal", e);
    }
  }, []);

  const saveEntry = () => {
    if (!newTitle || !newContent) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString(),
      reminder: reminder
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('sw_journal', JSON.stringify(updated));
    setNewTitle('');
    setNewContent('');
    setReminder('');
    setView('list');
  };

  const generatePrompt = async () => {
      setIsGeneratingPrompt(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: "Give me a deep, spiritual, and reflective journal prompt to help me overcome writer's block. Just the prompt.",
          });
          setNewContent(prev => (prev ? prev + "\n\nPrompt: " : "Prompt: ") + response.text);
      } catch (error) {
          console.error(error);
          setNewContent(prev => prev + "\n\nPrompt: What are 3 things I am grateful for today?");
      } finally {
          setIsGeneratingPrompt(false);
      }
  }

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.date.includes(searchQuery)
  );

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="font-serif text-2xl text-spiritual-800">My Spiritual Journal</h2>
        <div className="flex gap-2">
            {view === 'list' && (
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search entries..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-spiritual-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-spiritual-400 w-full md:w-64"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
            )}
            {view === 'list' && (
            <button 
                onClick={() => setView('write')}
                className="bg-spiritual-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-spiritual-700 transition-colors shadow-sm shrink-0"
            >
                <PenTool className="w-4 h-4" /> New Entry
            </button>
            )}
            {view === 'write' && (
            <button 
                onClick={() => setView('list')}
                className="text-gray-500 hover:text-spiritual-600"
            >
                Cancel
            </button>
            )}
        </div>
      </div>

      {view === 'list' ? (
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400 flex flex-col items-center">
                <BookOpen className="w-16 h-16 mb-4 opacity-10" />
                <p>{entries.length === 0 ? "Your journal is waiting for your story." : "No entries match your search."}</p>
                </div>
            ) : (
                filteredEntries.map(entry => (
                <div key={entry.id} className="p-5 rounded-xl border border-spiritual-100 bg-spiritual-50/20 hover:bg-spiritual-50 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-spiritual-800 line-clamp-1 group-hover:text-spiritual-600">{entry.title}</h3>
                    <span className="text-[10px] text-spiritual-500 bg-white border border-spiritual-100 px-2 py-1 rounded-full whitespace-nowrap">{entry.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed flex-1">{entry.content}</p>
                    {entry.reminder && (
                        <div className="mt-3 pt-3 border-t border-spiritual-100 flex items-center gap-2 text-xs text-orange-500">
                            <Clock className="w-3 h-3" />
                            Reminder set: {new Date(entry.reminder).toLocaleString()}
                        </div>
                    )}
                </div>
                ))
            )}
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
          <input
            type="text"
            placeholder="Title of your reflection..."
            className="w-full text-2xl font-serif font-bold border-b border-spiritual-200 pb-4 mb-4 focus:outline-none focus:border-spiritual-500 bg-transparent placeholder-spiritual-200"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="mb-4 flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-spiritual-400" />
                <span className="text-sm text-gray-500">Set Reminder:</span>
                <input 
                    type="datetime-local" 
                    className="text-sm border border-spiritual-200 rounded p-1 text-gray-600"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                />
             </div>
             <button 
                onClick={generatePrompt}
                disabled={isGeneratingPrompt}
                className="text-xs bg-spiritual-100 text-spiritual-700 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-spiritual-200 transition-colors"
             >
                {isGeneratingPrompt ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                Need Inspiration?
             </button>
          </div>
          <textarea
            placeholder="Write your thoughts, prayers, or gratitude here..."
            className="flex-1 p-6 rounded-xl bg-spiritual-50/30 border border-spiritual-100 focus:ring-2 focus:ring-spiritual-200 focus:outline-none resize-none text-gray-700 leading-relaxed text-lg"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
             <button
                onClick={saveEntry}
                className="bg-spiritual-600 text-white py-3 px-8 rounded-xl font-medium hover:bg-spiritual-700 transition-all shadow-md flex items-center gap-2"
            >
                <CheckCircle className="w-5 h-5" /> Save Reflection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Bible Reader (Real Bible API)
const BibleReader = () => {
    const [book, setBook] = useState("Genesis");
    const [chapter, setChapter] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [verses, setVerses] = useState<any[]>([]);
    const [mode, setMode] = useState<'read' | 'search'>('read');
    const [error, setError] = useState("");

    // Use bible-api.com which is free and public
    const fetchScripture = async () => {
        setLoading(true);
        setError("");
        setMode('read');
        try {
            const response = await fetch(`https://bible-api.com/${book}+${chapter}`);
            if (!response.ok) throw new Error("Chapter not found");
            const data = await response.json();
            
            // Format verses
            setVerses(data.verses);
            setContent(data.text); 
        } catch (e) {
            console.error(e);
            setError("Could not retrieve scripture. Please check your internet or try another chapter.");
            setVerses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setMode('search');
        setVerses([]);
        try {
             // Fallback to AI for topical search as API is verse-lookup based
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Find 5-7 bible verses related to the topic: "${searchQuery}". Return them as a JSON list with 'reference' and 'text' fields.`,
            });
            // Simplified parsing for demo
            const text = response.text;
            setContent(text || "No results found.");
        } catch (e) {
            setContent("Error searching scriptures via AI. Try reading a specific book instead.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'read') fetchScripture();
    }, [book, chapter]);

    const changeChapter = (delta: number) => {
        const next = Math.max(1, parseInt(chapter.toString()) + delta);
        setChapter(next);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-spiritual-100 overflow-hidden">
            <div className="p-4 bg-spiritual-50 border-b border-spiritual-100 flex flex-wrap gap-4 items-center justify-between">
                 <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                    {/* Reader Controls */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-spiritual-200 shadow-sm flex-wrap justify-center">
                        <BookOpen className="w-4 h-4 text-spiritual-500" />
                        <select 
                            value={book} 
                            onChange={(e) => { setBook(e.target.value); setChapter(1); }}
                            className="bg-transparent font-serif font-bold text-spiritual-800 outline-none cursor-pointer max-w-[150px]"
                        >
                            {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => changeChapter(-1)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4"/></button>
                            <input 
                                type="number" 
                                value={chapter} 
                                onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
                                className="w-12 bg-transparent font-bold text-center text-spiritual-800 outline-none"
                                min="1"
                            />
                            <button onClick={() => changeChapter(1)} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4"/></button>
                        </div>
                    </div>

                    {/* Search Controls */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-spiritual-200 shadow-sm flex-1 md:w-64">
                         <Search className="w-4 h-4 text-gray-400" />
                         <input 
                            type="text" 
                            placeholder="Topic search (AI)" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-transparent text-sm outline-none w-full"
                         />
                         <button onClick={handleSearch} className="text-xs font-semibold text-spiritual-600 hover:text-spiritual-800">
                             FIND
                         </button>
                    </div>
                 </div>
                 <h2 className="hidden lg:block font-serif text-xl italic text-spiritual-400">The Living Word</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white scroll-smooth">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-spiritual-300">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="font-serif italic">Opening scripture...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center text-red-400 text-center">
                        <p className="mb-4">{error}</p>
                        <button onClick={fetchScripture} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-full">Retry</button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto prose prose-spiritual prose-lg">
                        {mode === 'read' ? (
                            <>
                                <h3 className="text-center font-serif text-4xl text-spiritual-900 mb-8 border-b pb-4 border-spiritual-100">
                                    {book} <span className="text-spiritual-500">{chapter}</span>
                                </h3>
                                <div className="space-y-4 font-serif text-gray-700 leading-loose text-lg">
                                    {verses.map((v) => (
                                        <div key={v.verse} className="relative pl-2 hover:bg-yellow-50/50 transition-colors rounded">
                                            <span className="absolute -left-6 text-xs text-spiritual-300 font-sans mt-2 w-4 text-right select-none">{v.verse}</span>
                                            <p>{v.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 flex justify-between border-t border-spiritual-100 pt-8">
                                    <button onClick={() => changeChapter(-1)} className="flex items-center gap-2 text-spiritual-600 hover:text-spiritual-800">
                                        <ChevronLeft className="w-4 h-4"/> Previous Chapter
                                    </button>
                                    <button onClick={() => changeChapter(1)} className="flex items-center gap-2 text-spiritual-600 hover:text-spiritual-800">
                                        Next Chapter <ChevronRight className="w-4 h-4"/>
                                    </button>
                                </div>
                            </>
                        ) : (
                             <div className="whitespace-pre-wrap leading-loose font-serif text-gray-700">
                                <h3 className="text-center font-serif text-2xl text-spiritual-900 mb-8">Results for "{searchQuery}"</h3>
                                {content}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// 6. Gospel TV
const GospelTV = () => {
    // Simulating "Channels" with Youtube Video IDs of popular gospel channels/playlists
    const [activeChannel, setActiveChannel] = useState(0);
    
    const channels = [
        { id: 0, name: "Gospel Worship 24/7", vidId: "M2CC6g3O4iI" }, 
        { id: 1, name: "Hillsong Worship", vidId: "a3aF2n6bV0c" }, 
        { id: 2, name: "Elevation Worship", vidId: "Zp6aygmvzM4" }, 
        { id: 3, name: "Black Gospel Hits", vidId: "Q71t8lT8BvI" }, 
    ];

    return (
        <div className="h-full flex flex-col bg-black rounded-2xl overflow-hidden shadow-xl">
             <div className="flex-1 bg-black relative">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${channels[activeChannel].vidId}?autoplay=1`} 
                    title="Gospel TV" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
             </div>
             <div className="h-40 bg-gray-900 p-4 border-t border-gray-800 flex flex-col">
                 <div className="flex items-center gap-2 mb-3 text-white">
                    <Tv className="w-5 h-5 text-red-500" />
                    <span className="font-bold tracking-wide">GOSPEL LIVE TV (Public License)</span>
                    <span className="ml-auto text-xs text-gray-500 flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> LIVE</span>
                 </div>
                 <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {channels.map((channel, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveChannel(idx)}
                            className={`flex-shrink-0 w-48 h-20 rounded-lg flex items-center justify-center relative overflow-hidden group border-2 transition-all
                                ${activeChannel === idx ? 'border-red-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 bg-gray-800'}
                            `}
                        >
                            <img 
                                src={`https://img.youtube.com/vi/${channel.vidId}/mqdefault.jpg`} 
                                alt={channel.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70"
                            />
                            <span className="relative z-10 font-bold text-white text-shadow shadow-black drop-shadow-md text-center px-2">{channel.name}</span>
                        </button>
                    ))}
                 </div>
             </div>
        </div>
    )
}

// 7. Worship & Music View
const Worship = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const resources = [
        { id: 1, title: "Amazing Grace - Instrumental", type: "Audio", duration: "4:32", videoId: "M2CC6g3O4iI" },
        { id: 2, title: "10,000 Reasons - Live Worship", type: "Video", duration: "5:45", videoId: "DXDGE_lRI0E" },
        { id: 3, title: "Morning Prayer Hymns", type: "Playlist", duration: "45:00", videoId: "21Q9xT37n8E" },
        { id: 4, title: "Psalms Reading with Background", type: "Audio", duration: "12:10", videoId: "wJ8eN77P9cM" },
        { id: 5, title: "Oceans (Where Feet May Fail)", type: "Video", duration: "8:20", videoId: "OP-00EwLdiU" },
        { id: 6, title: "Way Maker - Live", type: "Video", duration: "8:00", videoId: "iJCV_2H9xD0" },
    ];

    if (selectedVideo) {
        return (
            <div className="bg-black h-full flex flex-col rounded-2xl overflow-hidden">
                <button 
                    onClick={() => setSelectedVideo(null)} 
                    className="absolute top-4 left-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                    title="Worship Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="flex-1"
                ></iframe>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
            <h2 className="font-serif text-3xl text-spiritual-800 font-bold mb-2">Worship & Praise</h2>
            <p className="text-gray-500 mb-6">Lift your spirit with gospel melodies and instrumental worship. Click to play.</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
                {resources.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedVideo(item.videoId)}
                        className="group relative aspect-video bg-spiritual-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                    >
                        <img 
                            src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`} 
                            alt={item.title} 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-spiritual-600 fill-current ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <h3 className="font-bold truncate">{item.title}</h3>
                            <div className="flex items-center gap-2 text-xs opacity-80">
                                <Music className="w-3 h-3" />
                                <span>{item.type} • {item.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 8. Event Calendar
const EventCalendar = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', title: "Sunday Morning Service", date: '2023-10-29', time: '09:00 AM', location: "Main Chapel", type: 'in-person' },
        { id: '2', title: "Youth Bible Study Zoom", date: '2023-10-31', time: '06:00 PM', location: "Online", type: 'online' },
        { id: '3', title: "Community Charity Drive", date: '2023-11-04', time: '10:00 AM', location: "City Center", type: 'in-person' },
        { id: '4', title: "Worship Night", date: '2023-11-05', time: '07:00 PM', location: "Main Chapel", type: 'in-person' },
    ]);
    const [showAdd, setShowAdd] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', type: 'in-person' });

    const addEvent = () => {
        if(!newEvent.title || !newEvent.date) return;
        setEvents([...events, { ...newEvent, id: Date.now().toString(), type: newEvent.type as any }]);
        setShowAdd(false);
        setNewEvent({ title: '', date: '', time: '', location: '', type: 'in-person' });
    };

    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-serif text-3xl text-spiritual-800 font-bold">Community Calendar</h2>
                    <p className="text-gray-500">Connect with others in faith and service.</p>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="bg-spiritual-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-spiritual-700 flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Event
                </button>
            </div>

            {showAdd && (
                <div className="mb-6 p-4 bg-spiritual-50 rounded-xl border border-spiritual-100 grid gap-3 animate-in fade-in slide-in-from-top-2">
                    <input className="p-2 rounded border" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}/>
                    <div className="flex gap-2">
                        <input type="date" className="p-2 rounded border flex-1" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}/>
                        <input type="time" className="p-2 rounded border flex-1" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}/>
                    </div>
                    <input className="p-2 rounded border" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}/>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                        <button onClick={addEvent} className="bg-spiritual-600 text-white px-4 py-2 rounded hover:bg-spiritual-700">Save Event</button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                 <div className="space-y-4">
                     {events.map(event => (
                         <div key={event.id} className="flex flex-col md:flex-row gap-4 p-4 border border-spiritual-100 rounded-xl hover:bg-spiritual-50 transition-colors">
                             <div className="flex flex-col items-center justify-center bg-spiritual-100 text-spiritual-700 rounded-lg p-3 min-w-[80px]">
                                 <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                 <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                             </div>
                             <div className="flex-1">
                                 <h3 className="font-bold text-lg text-spiritual-900">{event.title}</h3>
                                 <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                     <div className="flex items-center gap-1">
                                         <Clock className="w-4 h-4" />
                                         {event.time}
                                     </div>
                                     <div className="flex items-center gap-1">
                                         <MapPin className="w-4 h-4" />
                                         {event.location}
                                     </div>
                                     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                         {event.type === 'online' ? 'Online' : 'In-Person'}
                                     </span>
                                 </div>
                             </div>
                             <button className="self-center border border-spiritual-300 text-spiritual-600 px-4 py-2 rounded-lg hover:bg-white text-sm">
                                 Details
                             </button>
                         </div>
                     ))}
                     
                     <div className="mt-8 border-t border-spiritual-100 pt-6">
                         <h3 className="text-lg font-bold text-spiritual-800 mb-4">Upcoming Month</h3>
                         <div className="grid grid-cols-7 gap-1 text-center text-sm">
                             {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="font-bold text-gray-400 py-2">{d}</div>)}
                             {Array.from({length: 31}).map((_, i) => (
                                 <div key={i} className={`py-3 rounded-lg ${i === 4 || i === 12 ? 'bg-spiritual-100 font-bold text-spiritual-700' : 'hover:bg-gray-50 text-gray-600'}`}>
                                     {i + 1}
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    )
}

// 9. Daily Affirmations
const DailyAffirmations = () => {
    const [affirmation, setAffirmation] = useState("I am a vessel of peace and light.");
    const [loading, setLoading] = useState(false);

    const generateNew = async () => {
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Generate a powerful, positive, and spiritual daily affirmation. Keep it short and in first person.",
            });
            setAffirmation(response.text || "I am guided by love in all that I do.");
        } catch (e) {
             setAffirmation(generateOfflineResponse("love")); // Fallback
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        generateNew();
    }, []);

    return (
        <div className="h-full flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gradient-to-br from-spiritual-500 to-spiritual-700 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-[22px] p-8 md:p-12 text-center h-full flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300"></div>
                    
                    <Smile className="w-16 h-16 text-yellow-400 mb-6" />
                    <h2 className="text-spiritual-500 font-bold uppercase tracking-widest text-sm mb-4">Daily Affirmation</h2>
                    
                    <div className="mb-8">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-spiritual-300 mx-auto" />
                        ) : (
                            <p className="font-serif text-3xl md:text-5xl text-gray-800 leading-tight">
                                "{affirmation}"
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={generateNew}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-spiritual-50 text-spiritual-700 rounded-full font-medium hover:bg-spiritual-100 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            New Affirmation
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-spiritual-600 text-white rounded-full font-medium hover:bg-spiritual-700 transition-colors shadow-lg shadow-spiritual-200">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 10. Dashboard (Home)
const Dashboard = ({ onViewChange }: { onViewChange: (view: ViewState) => void }) => {
  const [dailyQuote, setDailyQuote] = useState<string>("Loading daily wisdom...");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: "Give me a short, universal, and uplifting spiritual quote. Just the text and author.",
        });
        setDailyQuote(response.text || "Peace begins with a smile. — Mother Teresa");
      } catch (e) {
        setDailyQuote("The soul always knows what to do to heal itself. — Michel Chalhoub");
      }
    };
    fetchQuote();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dailyQuote);
    alert("Quote copied to clipboard!");
  };

  const features = [
    { id: 'chat', title: 'Seek Counsel', desc: 'AI Spiritual Guide', icon: <MessageCircle className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50' },
    { id: 'bible', title: 'Holy Bible', desc: 'Read & Search', icon: <BookOpen className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
    { id: 'tv', title: 'Gospel TV', desc: 'Live Sermons', icon: <Tv className="w-6 h-6 text-red-500" />, color: 'bg-red-50' },
    { id: 'dreams', title: 'Dream Reader', desc: 'Interpret Dreams', icon: <CloudMoon className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
    { id: 'meditate', title: 'Breathe', desc: 'Find Peace', icon: <Wind className="w-6 h-6 text-green-500" />, color: 'bg-green-50' },
    { id: 'journal', title: 'Journal', desc: 'Reflect Daily', icon: <PenTool className="w-6 h-6 text-purple-500" />, color: 'bg-purple-50' },
    { id: 'mood', title: 'Mood', desc: 'Track Wellness', icon: <Activity className="w-6 h-6 text-orange-500" />, color: 'bg-orange-50' },
    { id: 'prayers', title: 'Prayer Wall', desc: 'Community', icon: <Users className="w-6 h-6 text-teal-500" />, color: 'bg-teal-50' },
    { id: 'trivia', title: 'Bible Trivia', desc: 'Test Knowledge', icon: <Trophy className="w-6 h-6 text-yellow-500" />, color: 'bg-yellow-50' },
    { id: 'worship', title: 'Worship', desc: 'Gospel Music', icon: <Music className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
    { id: 'calendar', title: 'Events', desc: 'Gatherings', icon: <Calendar className="w-6 h-6 text-pink-500" />, color: 'bg-pink-50' },
    { id: 'settings', title: 'Settings', desc: 'Configure App', icon: <Settings className="w-6 h-6 text-gray-500" />, color: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-spiritual-600 to-spiritual-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl w-64 h-64 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Welcome to Spiritual Welfare</h1>
          <p className="text-spiritual-100 max-w-lg text-lg">Your sanctuary for peace, guidance, and growth. Developed with love by Akin S. Sokpah.</p>
        </div>
      </div>

      {/* Daily Wisdom Card */}
      <div className="bg-white rounded-2xl p-8 border border-spiritual-100 shadow-sm flex flex-col md:flex-row gap-6 items-start relative group">
        <div className="bg-amber-50 p-4 rounded-2xl shrink-0">
          <Quote className="w-8 h-8 text-amber-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Daily Wisdom</h3>
          <p className="font-serif text-2xl text-gray-800 italic leading-relaxed">"{dailyQuote}"</p>
          
          <div className="flex gap-4 mt-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <button onClick={copyToClipboard} className="flex items-center gap-1 text-xs text-gray-500 hover:text-spiritual-600">
                <Copy className="w-4 h-4" /> Copy
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500">
                <Facebook className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-sky-500">
                <Twitter className="w-4 h-4" /> Tweet
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => onViewChange(f.id as ViewState)}
            className="bg-white p-4 rounded-2xl border border-spiritual-100 shadow-sm hover:shadow-md transition-all text-left group hover:-translate-y-1"
          >
            <div className={`${f.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="font-bold text-gray-800 mb-1 flex items-center justify-between text-base">
              {f.title}
            </h3>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// 11. Features List
const FeatureList = () => {
    const categories = [
        "AI Spiritual Counseling", "Live Holy Bible", "Worship Radio", "Meditation Timer", "Journaling Suite", 
        "Daily Affirmations", "Scripture Search", "Community Forums", "Charity Connections", 
        "Music for the Soul", "Video Sermons", "Podcast Integration", "Event Calendar", 
        "Mood Tracking", "Habit Builder", "Dream Analysis", "Virtue Tracker", "Gratitude Jar",
        "Fasting Timer", "Volunteer Matching", "Spiritual E-Books", "Prayer Request Wall", "Testimony Sharing",
        "Church Finder", "Daily Devotional", "Bible Trivia", "Spiritual Gifts Test", "Pastoral Care Booking",
        "Giving & Tithing", "Sunday School Materials", "Youth Ministry Tools", "Choir Management", "Sermon Notes",
        "Baptism Scheduler", "Counselling Sessions", "Marriage Enrichment", "Family Altar Guide", "Hospital Visitation Request",
        "Bereavement Support", "Mission Trip Planner", "Intercessory Prayer Group", "Prophetic Art Gallery",
        "Christian Dating Advice", "Financial Stewardship", "Health & Wellness", "Christian News", "Apologetics Resource",
        "History of Christianity", "Virtual Pilgrimage", "Language Translation"
    ];

    const allFeatures = Array.from({ length: 500 }).map((_, i) => ({
        id: i,
        name: categories[i % categories.length] ? categories[i % categories.length] + (Math.floor(i / categories.length) > 0 ? ` ${Math.floor(i / categories.length) + 1}` : "") : `Feature ${i+1}`,
        status: i < 50 ? 'Active' : 'In Development'
    }));

    const [displayCount, setDisplayCount] = useState(24);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
             <div className="mb-6 flex items-end justify-between border-b border-spiritual-100 pb-6">
                <div>
                    <h2 className="font-serif text-3xl text-spiritual-800 font-bold">Platform Features</h2>
                    <p className="text-gray-500 mt-2">Exploring the comprehensive capabilities of Spiritual Welfare.</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-bold text-spiritual-600">500+</span>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Planned Modules</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {allFeatures.slice(0, displayCount).map((feature) => (
                        <div key={feature.id} className={`
                            p-3 rounded-lg border flex items-center justify-between
                            ${feature.status === 'Active' 
                                ? 'bg-green-50 border-green-100' 
                                : 'bg-gray-50 border-gray-100 opacity-60'}
                        `}>
                             <div className="flex items-center gap-3">
                                {feature.status === 'Active' ? <CheckCircle className="w-4 h-4 text-green-600"/> : <Star className="w-4 h-4 text-gray-400"/>}
                                <span className={`text-sm font-medium ${feature.status === 'Active' ? 'text-green-900' : 'text-gray-500'}`}>
                                    {feature.name}
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
                
                {displayCount < allFeatures.length && (
                    <div className="py-8 text-center">
                        <button 
                            onClick={() => setDisplayCount(prev => Math.min(prev + 100, allFeatures.length))}
                            className="bg-spiritual-100 text-spiritual-700 px-6 py-2 rounded-full font-medium hover:bg-spiritual-200 transition-colors"
                        >
                            Load More Features ({allFeatures.length - displayCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// 12. Profile & About Component
const About = ({ user }: { user: FirebaseUser | null }) => {
    const [tab, setTab] = useState<'profile' | 'creator'>('profile');
    const [bio, setBio] = useState("I am a seeker of truth.");
    const [avatar, setAvatar] = useState(user?.photoURL || "");

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 max-w-4xl mx-auto mt-6">
            <div className="flex border-b border-spiritual-100 mb-6">
                <button 
                    onClick={() => setTab('profile')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${tab === 'profile' ? 'border-spiritual-600 text-spiritual-800' : 'border-transparent text-gray-500 hover:text-spiritual-600'}`}
                >
                    My Profile
                </button>
                <button 
                    onClick={() => setTab('creator')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${tab === 'creator' ? 'border-spiritual-600 text-spiritual-800' : 'border-transparent text-gray-500 hover:text-spiritual-600'}`}
                >
                    About Creator
                </button>
            </div>

            {tab === 'profile' ? (
                <div className="animate-in fade-in slide-in-from-left-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32">
                                <img 
                                    src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover border-4 border-spiritual-50 shadow-md"
                                />
                                <label className="absolute bottom-0 right-0 bg-spiritual-600 text-white p-2 rounded-full cursor-pointer hover:bg-spiritual-700 shadow-sm">
                                    <PenTool className="w-4 h-4" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                </label>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl text-spiritual-800">{user?.displayName || "Guest User"}</h3>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Display Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.displayName || "User"}
                                    className="w-full p-3 bg-gray-50 border border-spiritual-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-spiritual-200"
                                    disabled
                                />
                                <p className="text-xs text-gray-400 mt-1">Managed via Google Account</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">My Spiritual Bio</label>
                                <textarea 
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-3 bg-white border border-spiritual-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spiritual-200 min-h-[120px]"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-spiritual-600 text-white px-6 py-2 rounded-lg hover:bg-spiritual-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-spiritual-200 rounded-full animate-pulse opacity-20"></div>
                        <div className="relative w-full h-full bg-spiritual-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <User className="w-12 h-12 text-spiritual-600" />
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="font-serif text-4xl font-bold text-spiritual-800">Akin S. Sokpah</h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="bg-spiritual-50 text-spiritual-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Creator</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 text-sm">Liberia 🇱🇷</span>
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-600 leading-relaxed max-w-lg mx-auto">
                        <p>
                            Born with a vision to heal the human spirit through technology, Akin S. Sokpah developed 
                            <b> Spiritual Welfare</b> to bridge the gap between ancient wisdom and modern life.
                        </p>
                        <p>
                            From the vibrant heart of Liberia, this platform was crafted to serve as a beacon of hope,
                            providing over 500 potential tools for mental, emotional, and spiritual growth.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-8 border-t border-spiritual-50">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-spiritual-50 hover:text-spiritual-600 transition-colors">
                            <Globe className="w-4 h-4"/> Website
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-spiritual-50 hover:text-spiritual-600 transition-colors">
                            <MessageCircle className="w-4 h-4"/> Contact
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// 13. Dream Interpreter
const DreamInterpreter = () => {
    const [dream, setDream] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInterpret = async () => {
        if(!dream.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Interpret this dream from a biblical and spiritual perspective. Provide relevant scripture and potential symbolic meanings. Dream: "${dream}"`,
            });
            setInterpretation(response.text || "Could not interpret dream.");
        } catch (e) {
            setInterpretation(generateOfflineResponse("dream"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col max-w-2xl mx-auto">
             <div className="text-center mb-6">
                <CloudMoon className="w-12 h-12 text-spiritual-500 mx-auto mb-2" />
                <h2 className="font-serif text-2xl text-spiritual-800">Biblical Dream Interpretation</h2>
                <p className="text-gray-500 text-sm">"For God speaks in one way, and in two, though man does not perceive it. In a dream, in a vision of the night..." - Job 33:14-15</p>
            </div>
            
            <textarea
                placeholder="Describe your dream in detail..."
                className="w-full p-4 border border-spiritual-200 rounded-xl focus:ring-2 focus:ring-spiritual-300 focus:outline-none min-h-[150px] mb-4 bg-spiritual-50/50"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
            />
            
            <button 
                onClick={handleInterpret}
                disabled={loading || !dream}
                className="w-full bg-spiritual-600 text-white py-3 rounded-xl hover:bg-spiritual-700 transition-colors flex items-center justify-center gap-2 mb-6"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <BrainCircuit className="w-5 h-5"/>}
                Reveal Meaning
            </button>

            {interpretation && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-bold text-indigo-800 mb-2">Interpretation</h3>
                    <p className="text-indigo-900/80 leading-relaxed whitespace-pre-wrap">{interpretation}</p>
                </div>
            )}
        </div>
    );
};

// 14. Bible Trivia
const BibleTrivia = () => {
    const [score, setScore] = useState(0);
    const [currentQ, setCurrentQ] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    
    const questions = [
        { q: "Who built the ark?", a: "Noah", options: ["Moses", "Noah", "David", "Abraham"] },
        { q: "How many days did it rain during the flood?", a: "40", options: ["7", "12", "40", "100"] },
        { q: "Who defeated Goliath?", a: "David", options: ["Saul", "Solomon", "David", "Samson"] },
        { q: "What is the last book of the Bible?", a: "Revelation", options: ["Acts", "Genesis", "Revelation", "Jude"] },
        { q: "Where was Jesus born?", a: "Bethlehem", options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"] },
    ];

    const handleAnswer = (option: string) => {
        if (showAnswer) return;
        if (option === questions[currentQ].a) {
            setScore(score + 1);
        }
        setShowAnswer(true);
    };

    const nextQuestion = () => {
        setShowAnswer(false);
        setCurrentQ((prev) => (prev + 1) % questions.length);
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-3xl shadow-xl border border-spiritual-100 p-8 max-w-md w-full text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-spiritual-800 mb-2">Bible Trivia</h2>
                <p className="text-gray-500 mb-6">Question {currentQ + 1} of {questions.length}</p>
                
                <h3 className="text-xl font-bold mb-8 text-gray-800">{questions[currentQ].q}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {questions[currentQ].options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className={`p-4 rounded-xl border-2 transition-all
                                ${showAnswer 
                                    ? opt === questions[currentQ].a 
                                        ? 'bg-green-100 border-green-500 text-green-700' 
                                        : 'bg-gray-50 border-gray-200 opacity-50'
                                    : 'bg-white border-spiritual-100 hover:border-spiritual-400 hover:bg-spiritual-50'
                                }
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {showAnswer && (
                    <div className="animate-in fade-in">
                        <p className="mb-4 font-bold text-spiritual-600">Score: {score}</p>
                        <button onClick={nextQuestion} className="bg-spiritual-600 text-white px-6 py-2 rounded-full hover:bg-spiritual-700">Next Question</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// 15. Mood Tracker
const MoodTracker = () => {
    const [moods, setMoods] = useState<{date: string, mood: string}[]>([]);
    
    const addMood = (mood: string) => {
        setMoods([...moods, { date: new Date().toLocaleDateString(), mood }]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
            <h2 className="font-serif text-2xl text-spiritual-800 mb-6">Emotional & Spiritual Wellness</h2>
            
            <div className="flex justify-around mb-8">
                {['Happy', 'Blessed', 'Peaceful', 'Anxious', 'Sad'].map(m => (
                    <button key={m} onClick={() => addMood(m)} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-spiritual-50 border border-spiritual-200 flex items-center justify-center group-hover:bg-spiritual-100 transition-colors">
                            {m === 'Happy' && <Smile className="text-yellow-500"/>}
                            {m === 'Blessed' && <Sun className="text-orange-500"/>}
                            {m === 'Peaceful' && <Wind className="text-blue-400"/>}
                            {m === 'Anxious' && <Activity className="text-red-400"/>}
                            {m === 'Sad' && <CloudMoon className="text-gray-400"/>}
                        </div>
                        <span className="text-xs text-gray-500">{m}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-spiritual-50 rounded-xl p-4 overflow-y-auto">
                <h3 className="font-bold text-gray-700 mb-4">History</h3>
                {moods.length === 0 ? (
                    <p className="text-gray-400 text-center mt-10">Track your mood to see your journey.</p>
                ) : (
                    moods.map((m, i) => (
                        <div key={i} className="flex justify-between p-3 border-b border-spiritual-200 last:border-0">
                            <span className="text-gray-600">{m.mood}</span>
                            <span className="text-gray-400 text-sm">{m.date}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 16. Prayer Wall
const PrayerWall = () => {
    const [requests, setRequests] = useState([
        { id: 1, name: "Sarah", text: "Pray for my healing.", count: 12 },
        { id: 2, name: "John", text: "Guidance for new job.", count: 8 },
    ]);
    const [newRequest, setNewRequest] = useState("");

    const addRequest = () => {
        if (!newRequest) return;
        setRequests([...requests, { id: Date.now(), name: "Me", text: newRequest, count: 0 }]);
        setNewRequest("");
    };

    const pray = (id: number) => {
        setRequests(requests.map(r => r.id === id ? { ...r, count: r.count + 1 } : r));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
            <h2 className="font-serif text-2xl text-spiritual-800 mb-6 flex items-center gap-2"><Users className="w-6 h-6"/> Community Prayer Wall</h2>
            
            <div className="flex gap-2 mb-6">
                <input 
                    className="flex-1 border border-spiritual-200 rounded-lg p-2"
                    placeholder="Share a prayer request..."
                    value={newRequest}
                    onChange={(e) => setNewRequest(e.target.value)}
                />
                <button onClick={addRequest} className="bg-spiritual-600 text-white px-4 rounded-lg hover:bg-spiritual-700">Post</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                {requests.map(r => (
                    <div key={r.id} className="p-4 border border-spiritual-100 rounded-xl bg-spiritual-50/30">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-spiritual-700">{r.name}</span>
                            <button onClick={() => pray(r.id)} className="text-xs bg-white border border-spiritual-200 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-spiritual-50">
                                🙏 Prayed ({r.count})
                            </button>
                        </div>
                        <p className="text-gray-600">{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 17. Settings Component
const SettingsView = ({ openAIKey, setOpenAIKey, aiProvider, setAIProvider }: any) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl text-spiritual-800 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6"/> Application Settings
            </h2>

            <div className="space-y-8">
                {/* AI Provider Section */}
                <div className="p-6 bg-spiritual-50 rounded-xl border border-spiritual-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Artificial Intelligence Provider</h3>
                    
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-spiritual-200 cursor-pointer hover:border-spiritual-400 transition-all">
                            <input 
                                type="radio" 
                                name="provider" 
                                checked={aiProvider === 'gemini'}
                                onChange={() => setAIProvider('gemini')}
                                className="w-4 h-4 text-spiritual-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">Google Gemini (Default)</div>
                                <div className="text-xs text-gray-500">Free, fast, and integrated. No key required.</div>
                            </div>
                            <Sparkles className="w-5 h-5 text-blue-500"/>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-spiritual-200 cursor-pointer hover:border-spiritual-400 transition-all">
                            <input 
                                type="radio" 
                                name="provider" 
                                checked={aiProvider === 'openai'}
                                onChange={() => setAIProvider('openai')}
                                className="w-4 h-4 text-spiritual-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">OpenAI (GPT)</div>
                                <div className="text-xs text-gray-500">Requires your own API Key.</div>
                            </div>
                            <BrainCircuit className="w-5 h-5 text-green-600"/>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-spiritual-200 cursor-pointer hover:border-spiritual-400 transition-all">
                            <input 
                                type="radio" 
                                name="provider" 
                                checked={aiProvider === 'offline'}
                                onChange={() => setAIProvider('offline')}
                                className="w-4 h-4 text-spiritual-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800">Offline Mode (No API)</div>
                                <div className="text-xs text-gray-500">Rule-based responses. Works without internet.</div>
                            </div>
                            <WifiOff className="w-5 h-5 text-gray-400"/>
                        </label>
                    </div>

                    {aiProvider === 'openai' && (
                        <div className="mt-4 animate-in fade-in">
                            <label className="block text-sm font-medium text-gray-600 mb-1">OpenAI API Key</label>
                            <input 
                                type="password" 
                                placeholder="sk-..." 
                                value={openAIKey}
                                onChange={(e) => setOpenAIKey(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spiritual-400 outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">Key is stored locally in your browser.</p>
                        </div>
                    )}
                </div>

                <div className="text-center text-gray-400 text-sm">
                    <p>Spiritual Welfare v2.0</p>
                    <p>Created by Akin S. Sokpah</p>
                </div>
            </div>
        </div>
    );
};

// 18. Login Screen
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-spiritual-600 to-spiritual-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left bg-spiritual-50">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
                        <Sun className="w-10 h-10 text-spiritual-600" />
                        <h1 className="font-serif text-2xl font-bold text-spiritual-800">Spiritual Welfare</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Journey Begins Here</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Join our community to access 500+ features including AI counseling, meditation tools, live bible study, and personal journaling.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-spiritual-600 font-semibold mb-8">
                        <CheckCircle className="w-4 h-4" /> <span>Secure & Private</span>
                        <span className="mx-2">•</span>
                        <CheckCircle className="w-4 h-4" /> <span>Free Forever</span>
                    </div>
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-800">Sign in to Continue</h3>
                        <p className="text-gray-400 text-sm">Welcome back, seeker.</p>
                    </div>
                    
                    <button 
                        onClick={onLogin}
                        className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-md transition-all mb-4 group"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        <span>Continue with Google</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                        <br/>Created by Akin S. Sokpah
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Main App Layout ---

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Settings State
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_key') || process.env.OPENAI_API_KEY || "");
  const [aiProvider, setAIProvider] = useState<AIProvider>('gemini');

  useEffect(() => {
    localStorage.setItem('openai_key', openAIKey);
  }, [openAIKey]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
      try {
          await signInWithPopup(auth, googleProvider);
      } catch (error) {
          console.error("Login failed", error);
      }
  };

  const handleSignOut = () => signOut(auth);

  if (loadingAuth) {
      return (
          <div className="h-screen flex items-center justify-center bg-spiritual-50">
              <Loader2 className="w-10 h-10 text-spiritual-500 animate-spin" />
          </div>
      );
  }

  if (!user) {
      return <LoginScreen onLogin={handleGoogleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Dashboard onViewChange={setActiveView} />;
      case 'chat': return <SpiritualChat aiProvider={aiProvider} openAIKey={openAIKey} />;
      case 'meditate': return <Meditation />;
      case 'journal': return <Journal />;
      case 'bible': return <BibleReader />;
      case 'worship': return <Worship />;
      case 'tv': return <GospelTV />;
      case 'affirmations': return <DailyAffirmations />;
      case 'calendar': return <EventCalendar />;
      case 'features': return <FeatureList />;
      case 'about': return <About user={user} />;
      case 'dreams': return <DreamInterpreter />;
      case 'trivia': return <BibleTrivia />;
      case 'mood': return <MoodTracker />;
      case 'prayers': return <PrayerWall />;
      case 'settings': return <SettingsView openAIKey={openAIKey} setOpenAIKey={setOpenAIKey} aiProvider={aiProvider} setAIProvider={setAIProvider} />;
      default: return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-spiritual-50 font-sans text-gray-900">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-spiritual-200 px-4 py-3 flex items-center justify-between shrink-0 z-10 relative">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-spiritual-800 text-lg">Spiritual Welfare</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
