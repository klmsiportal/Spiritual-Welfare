import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Heart, MessageCircle, BookOpen, Wind, User, Menu, X, Send, Sparkles, Sun, Moon,
  PenTool, ChevronRight, ChevronLeft, Globe, Loader2, Quote, CheckCircle, List,
  Star, Music, Play, Pause, Upload, Search, Calendar, Share2, Facebook, Twitter,
  Copy, LogOut, Cross, Tv, MapPin, Clock, Mic, Smile, RefreshCw, CloudMoon,
  BrainCircuit, Settings, Activity, Users, Trophy, WifiOff, Plus, Server, Link,
  Film, Zap, Eye, Minimize2, Maximize2, Volume2, VolumeX, Camera, Phone, Mail,
  BadgeCheck, Download, Book, Bookmark, Calculator, Timer, FileText, Library,
  Lightbulb, Compass, CheckSquare, Headphones, Shield, Target, ArrowRight, Baby,
  Map, Speaker, Church, Radio, Video, Image, Bell, MicOff, Bot
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface UserProfile {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
    email?: string | null;
}

type ViewState = 'home' | 'bible' | 'tv' | 'community' | 'testimonies' | 'sermons' | 'toolbox' | 'treasury' | 'kids' | 'about' | 'events' | 'notes' | 'fasting' | 'tithe' | 'trivia' | 'journal' | 'goals' | 'hymnal' | 'promises' | 'names' | 'dictionary' | 'plans' | 'prayer_bank' | 'ai_assistant';

type MediaItem = {
    id: string;
    title: string;
    type: 'video' | 'audio';
    url: string;
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
    { id: 'video1', title: 'Soaking Worship (YouTube)', type: 'video' as const, url: 'BiG098g8FjQ' }, 
    { id: 'video2', title: 'Piano Prayer (YouTube)', type: 'video' as const, url: 'qjX6s5J5zkw' },
    { id: 'video3', title: 'Holy Spirit Atmosphere', type: 'video' as const, url: '73w3zD3X9b8' },
    { id: 'rain', title: 'Soft Rain Audio', type: 'audio' as const, url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { id: 'pads', title: 'Worship Pads Audio', type: 'audio' as const, url: 'https://cdn.pixabay.com/download/audio/2024/02/07/audio_c3e031a54f.mp3' },
];

const DICTIONARY_TERMS = [
    { term: "Abba", def: "Aramaic for 'Father', expressing intimacy with God." },
    { term: "Atonement", def: "Reconciliation of God and humankind through Jesus Christ." },
    { term: "Grace", def: "Unmerited favor of God toward mankind." },
    { term: "Justification", def: "Action of declaring righteous in the sight of God." },
    { term: "Sanctification", def: "Process of being made holy." },
    { term: "Propitiation", def: "The act of appeasing the wrath of God." },
    { term: "Redemption", def: "The action of saving or being saved from sin, error, or evil." },
    { term: "Regeneration", def: "Spiritual rebirth; being born again." },
    { term: "Repentance", def: "Sincere regret or remorse; turning away from sin." },
    { term: "Resurrection", def: "Christ's rising from the dead." },
    { term: "Revelation", def: "God's disclosure of Himself and His will to His creatures." },
    { term: "Righteousness", def: "The quality of being morally right or justifiable." },
    { term: "Salvation", def: "Deliverance from sin and its consequences." },
    { term: "Sanctuary", def: "A holy place; the temple of God." },
    { term: "Sovereignty", def: "God's supreme power and authority." },
    { term: "Trinity", def: "The Christian Godhead as one God in three persons: Father, Son, and Holy Spirit." },
    { term: "Zion", def: "A synonym for Jerusalem, also used to refer to the people of God." }
];

const HYMNS = [
    { title: "Amazing Grace", lyrics: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see." },
    { title: "Holy, Holy, Holy", lyrics: "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!" },
    { title: "Great is Thy Faithfulness", lyrics: "Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not\nAs Thou hast been Thou forever wilt be." },
    { title: "It Is Well With My Soul", lyrics: "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou has taught me to say,\nIt is well, it is well, with my soul." }
];

const PROMISES = [
    { verse: "Jeremiah 29:11", text: "For I know the plans I have for you..." },
    { verse: "Philippians 4:13", text: "I can do all things through Christ..." },
    { verse: "Romans 8:28", text: "And we know that in all things God works for the good..." },
    { verse: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength..." },
    { verse: "Joshua 1:9", text: "Have I not commanded you? Be strong and courageous..." },
    { verse: "Matthew 11:28", text: "Come to me, all you who are weary and burdened..." },
    { verse: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing." }
];

const NAMES_OF_GOD = [
    { name: "Jehovah Jireh", meaning: "The Lord Will Provide" },
    { name: "Jehovah Rapha", meaning: "The Lord Who Heals" },
    { name: "Jehovah Nissi", meaning: "The Lord My Banner" },
    { name: "Jehovah Shalom", meaning: "The Lord Is Peace" },
    { name: "El Shaddai", meaning: "Lord God Almighty" },
    { name: "Elohim", meaning: "God the Creator" },
    { name: "Adonai", meaning: "Lord, Master" },
    { name: "Yahweh", meaning: "I AM" }
];

const KIDS_STORIES = [
    { title: "David & Goliath", text: "A young shepherd boy defeated a giant with a sling and a stone because he trusted God." },
    { title: "Noah's Ark", text: "Noah built a big boat to save his family and animals from the flood." },
    { title: "Daniel in the Lions' Den", text: "Daniel prayed to God, and God sent an angel to shut the lions' mouths." },
    { title: "Jonah and the Whale", text: "Jonah ran from God but was swallowed by a big fish until he prayed." }
];

const SERMONS = [
    { id: 's1', title: 'The Power of Faith', speaker: 'Bishop T.D. Jakes', url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3' },
    { id: 's2', title: 'Walking in Victory', speaker: 'Pastor Joel Osteen', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_7e4529c322.mp3' },
    { id: 's3', title: 'Grace Abounds', speaker: 'Joseph Prince', url: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_550d815533.mp3' }
];

const EVENTS = [
    { date: 'Dec 24', title: 'Christmas Eve Service', time: '6:00 PM' },
    { date: 'Dec 31', title: 'Watch Night Service', time: '10:00 PM' },
    { date: 'Jan 1', title: 'New Year Celebration', time: '10:00 AM' },
    { date: 'Sun', title: 'Weekly Worship', time: '9:00 AM' }
];

// --- Helper Components ---
function BriefcaseIcon({ className }: { className: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
}

// Sidebar Component
const Sidebar = ({ activeView, onViewChange, mobileOpen, setMobileOpen, user, onSignOut, onPlayAmbient, installAction, canInstall, darkMode, toggleDarkMode }: any) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <Compass className="w-5 h-5" /> },
    { id: 'ai_assistant', label: 'AI Spiritual Assistant', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { id: 'bible', label: 'Holy Bible', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tv', label: 'Gospel TV', icon: <Tv className="w-5 h-5" /> },
    { id: 'community', label: 'Chat Fellowship', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'testimonies', label: 'Testimony Wall', icon: <Users className="w-5 h-5" /> },
    { id: 'sermons', label: 'Sermon Archive', icon: <Headphones className="w-5 h-5" /> },
    { id: 'events', label: 'Church Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'toolbox', label: 'Toolbox', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: 'treasury', label: 'Treasury', icon: <Library className="w-5 h-5" /> },
    { id: 'kids', label: 'Kids Corner', icon: <Baby className="w-5 h-5" /> },
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
              <h2 className="text-xs uppercase tracking-widest text-spiritual-500">Welfare 2025</h2>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Ambient Music */}
        <div className="px-4 py-2">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-spiritual-50 border-spiritual-100'} rounded-xl p-3 border`}>
                <div className={`flex items-center gap-2 mb-2 ${darkMode ? 'text-gray-300' : 'text-spiritual-700'}`}>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Ambient Prayer</span>
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
              onClick={() => { onViewChange(item.id); setMobileOpen(false); }}
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
          
          <button onClick={toggleDarkMode} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4 ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          {canInstall && (
              <button onClick={installAction} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold mt-2">
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
                    <LogOut className="w-3 h-3" /> {user?.isAnonymous ? 'Exit Guest' : 'Sign Out'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- AI Components ---

const SpiritualAssistant = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Blessings! I am your Spiritual AI Assistant. I can help with prayer, scripture explanations, sermon ideas, or just a listening ear. How may I serve you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      // Use Gemini if available
      let aiResponseText = "";
      if (process.env.API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMsg,
            config: {
                systemInstruction: "You are a gentle, biblical, uplifting Christian assistant designed for the Spiritual Welfare platform. Your tone is loving, encouraging, and scripture-based."
            }
          });
          aiResponseText = response.text || "Peace be with you.";
      } else {
          // Offline / No Key Mode
          await new Promise(r => setTimeout(r, 1500));
          aiResponseText = "God loves you deeply. I am currently in 'Offline Mode' because no API Key was detected. Please configure the API Key for full AI features.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I am having trouble connecting to the spiritual network right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-purple-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full"><Sparkles className="w-5 h-5"/></div>
          <div>
            <h2 className="font-bold text-lg">Spiritual AI</h2>
            <p className="text-xs text-purple-200">Powered by Gospel Intelligence</p>
          </div>
        </div>
        <button onClick={() => setMessages([{ role: 'assistant', content: "Blessings! How may I serve you today?" }])} className="p-2 hover:bg-white/20 rounded-full" title="Reset Chat">
            <RefreshCw className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.role === 'assistant' && (
                <button 
                    onClick={() => speak(m.content)} 
                    className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
                >
                    {isSpeaking ? <VolumeX className="w-3 h-3"/> : <Volume2 className="w-3 h-3"/>} 
                    {isSpeaking ? "Stop" : "Listen"}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600"/>
                <span className="text-xs text-gray-500">Praying on it...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
          <input 
            className="flex-1 bg-transparent border-none outline-none text-sm px-2"
            placeholder="Ask for prayer, verses, or guidance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={isLoading} className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {["Generate a sermon on Hope", "Find verses about anxiety", "Write a prayer for my family", "Explain John 3:16"].map((suggestion, i) => (
                <button 
                    key={i} 
                    onClick={() => setInput(suggestion)} 
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full whitespace-nowrap border border-gray-200"
                >
                    {suggestion}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// Feature Components

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
                    <button key={t.id} onClick={() => onViewChange(t.id as ViewState)} className="bg-gray-50 hover:bg-blue-50 hover:scale-105 transition-all p-6 rounded-2xl border border-gray-200 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md">
                        <div className="p-3 bg-white rounded-full shadow-sm">{t.icon}</div>
                        <h3 className="font-bold text-gray-800">{t.title}</h3>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

const TreasuryHub = ({ onViewChange }: { onViewChange: (v: ViewState) => void }) => {
    const items = [
        { id: 'hymnal', title: 'Hymnal', icon: <Music className="w-6 h-6 text-indigo-500"/>, desc: 'Classic Hymns' },
        { id: 'promises', title: 'God\'s Promises', icon: <Heart className="w-6 h-6 text-rose-500"/>, desc: 'Bible Promises' },
        { id: 'names', title: 'Names of God', icon: <CrownIcon className="w-6 h-6 text-yellow-500"/>, desc: 'Hebrew Names' },
        { id: 'dictionary', title: 'Bible Dictionary', icon: <Book className="w-6 h-6 text-emerald-500"/>, desc: 'Terms & Definitions' },
        { id: 'plans', title: 'Reading Plans', icon: <Calendar className="w-6 h-6 text-blue-500"/>, desc: 'Track Progress' },
        { id: 'prayer_bank', title: 'Prayer Bank', icon: <Shield className="w-6 h-6 text-purple-500"/>, desc: 'Warfare Prayers' },
    ];

    function CrownIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg> }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full overflow-y-auto">
            <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800"><Library className="w-8 h-8"/> Spiritual Treasury</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(t => (
                    <button key={t.id} onClick={() => onViewChange(t.id as ViewState)} className="bg-gray-50 hover:bg-amber-50 hover:scale-105 transition-all p-6 rounded-2xl border border-gray-200 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md">
                        <div className="p-3 bg-white rounded-full shadow-sm">{t.icon}</div>
                        <h3 className="font-bold text-gray-800">{t.title}</h3>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Explorer Edition Modules

const TestimonyWall = () => {
    const [testimonies, setTestimonies] = useState([
        { user: "Sarah J.", text: "God healed my mother after the doctors said there was no hope!", date: "2 days ago" },
        { user: "David K.", text: "I finally got the job I was praying for. Jehovah Jireh provides!", date: "1 week ago" }
    ]);
    const [input, setInput] = useState("");

    const addTestimony = () => {
        if (!input.trim()) return;
        setTestimonies([{ user: "Guest Believer", text: input, date: "Just now" }, ...testimonies]);
        setInput("");
    };

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Users className="w-6 h-6 text-indigo-600"/> Testimony Wall</h2>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {testimonies.map((t, i) => (
                    <div key={i} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-indigo-900">{t.user}</span>
                            <span className="text-xs text-indigo-400">{t.date}</span>
                        </div>
                        <p className="text-gray-700">{t.text}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    className="flex-1 border p-2 rounded-lg" 
                    placeholder="Share your testimony..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={addTestimony} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Post</button>
            </div>
        </div>
    );
};

const SermonArchive = ({ onPlay }: { onPlay: (m: MediaItem) => void }) => {
    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Headphones className="w-6 h-6 text-red-600"/> Sermon Archive</h2>
            <div className="space-y-3 overflow-y-auto">
                {SERMONS.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-full"><Speaker className="w-5 h-5"/></div>
                            <div>
                                <h3 className="font-bold text-gray-900">{s.title}</h3>
                                <p className="text-xs text-gray-500">{s.speaker}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => onPlay({ id: s.id, title: s.title, type: 'audio', url: s.url })} 
                            className="bg-white text-red-600 p-2 rounded-full border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const KidsCorner = () => {
    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
            <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Baby className="w-6 h-6 text-yellow-500"/> Kids Bible Corner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                {KIDS_STORIES.map((s, i) => (
                    <div key={i} className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200">
                        <h3 className="font-bold text-yellow-800 text-lg mb-2">{s.title}</h3>
                        <p className="text-gray-700 text-sm">{s.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ChurchEvents = () => {
    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 p-6">
             <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-600"/> Church Events</h2>
             <div className="space-y-4 overflow-y-auto">
                {EVENTS.map((e, i) => (
                    <div key={i} className="flex gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="bg-white p-3 rounded-lg text-center min-w-[60px] shadow-sm">
                            <div className="text-xs text-blue-500 font-bold uppercase">{e.date.split(' ')[0]}</div>
                            <div className="text-xl font-bold text-gray-800">{e.date.split(' ')[1] || e.date}</div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{e.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {e.time}</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

const Hymnal = () => (
    <div className="bg-white rounded-2xl h-full p-6 overflow-y-auto">
         <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2"><Music className="w-6 h-6 text-indigo-600"/> Hymnal</h2>
         <div className="space-y-6">
             {HYMNS.map((h, i) => (
                 <div key={i} className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                     <h3 className="font-bold text-xl text-indigo-900 mb-2">{h.title}</h3>
                     <p className="font-serif whitespace-pre-line text-gray-700">{h.lyrics}</p>
                 </div>
             ))}
         </div>
    </div>
);

const Promises = () => (
    <div className="bg-white rounded-2xl h-full p-6 overflow-y-auto">
         <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2"><Heart className="w-6 h-6 text-rose-600"/> God's Promises</h2>
         <div className="grid gap-4">
             {PROMISES.map((p, i) => (
                 <div key={i} className="p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors">
                     <span className="text-xs font-bold text-rose-500 uppercase tracking-wide">{p.verse}</span>
                     <p className="font-serif text-lg text-gray-800 mt-1">"{p.text}"</p>
                 </div>
             ))}
         </div>
    </div>
);

// --- Existing Components Refined ---

const CreatorProfile = () => {
    const [photo, setPhoto] = useState<string | null>(localStorage.getItem('creator_photo'));

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setPhoto(ev.target.result as string);
                    localStorage.setItem('creator_photo', ev.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white rounded-2xl h-full p-8 flex flex-col items-center justify-center text-center">
            <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-xl mb-6 relative">
                    {photo ? (
                        <img src={photo} alt="Creator" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <User className="w-16 h-16" />
                        </div>
                    )}
                </div>
                <label className="absolute bottom-6 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
            </div>

            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-2">
                Akin S. Sokpah 
                <BadgeCheck className="w-6 h-6 text-blue-500" fill="currentColor" color="white" />
            </h1>
            <p className="text-spiritual-600 font-medium mb-6 uppercase tracking-widest text-sm">Creator & Developer</p>
            
            <div className="grid gap-4 w-full max-w-md">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Phone className="w-5 h-5" /></div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase">Contact</p>
                        <p className="font-bold text-gray-800">+231 889 183 557</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-red-100 p-2 rounded-full text-red-600"><Mail className="w-5 h-5" /></div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="font-bold text-gray-800">sokpahakinsaye@gmail.com</p>
                    </div>
                </div>
                <a href="https://www.facebook.com/profile.php?id=61583456361691" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <div className="bg-white/20 p-2 rounded-full"><Facebook className="w-5 h-5" /></div>
                    <div className="text-left">
                        <p className="text-xs text-blue-100 uppercase">Social Media</p>
                        <p className="font-bold">Connect on Facebook</p>
                    </div>
                </a>
            </div>
            <p className="mt-8 text-gray-400 text-sm">© 2025 Spiritual Welfare. All Rights Reserved.</p>
        </div>
    );
};

const BibleReader = () => {
    const [book, setBook] = useState("John");
    const [chapter, setChapter] = useState(1);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchChapter = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://bible-api.com/${book}+${chapter}?translation=kjv`);
            const data = await res.json();
            setText(data.text || "Chapter not found.");
        } catch (e) {
            setText("Error loading Bible. Please check internet.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchChapter(); }, [book, chapter]);

    return (
        <div className="bg-white rounded-2xl h-full flex flex-col border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-spiritual-50 p-4 border-b border-spiritual-100 flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {BIBLE_BOOKS.map(b => (
                        <button key={b} onClick={() => { setBook(b); setChapter(1); }} className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${book === b ? 'bg-spiritual-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-spiritual-100'}`}>
                            {b}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="font-serif text-2xl font-bold text-gray-900">{book} {chapter}</h2>
                        <div className="flex gap-1">
                            <button onClick={() => setChapter(Math.max(1, chapter - 1))} className="p-1 hover:bg-gray-200 rounded"><ChevronLeft className="w-5 h-5"/></button>
                            <button onClick={() => setChapter(chapter + 1)} className="p-1 hover:bg-gray-200 rounded"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                    <input 
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-spiritual-200 focus:outline-none" 
                        placeholder="Search for a verse keyword..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white relative">
                {loading ? (
                    <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-spiritual-500" /></div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <p className="font-serif text-xl leading-loose text-gray-800">
                           {search ? 
                                text.split('\n').filter(l => l.toLowerCase().includes(search.toLowerCase())).join('\n\n...') 
                                : text}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Global Media Player Component
const GlobalPlayer = ({ media, onClose }: { media: MediaItem | null, onClose: () => void }) => {
    if (!media) return null;

    const isYoutubeId = media.type === 'video' && /^[a-zA-Z0-9_-]{11}$/.test(media.url);

    return (
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
            <div className="max-w-7xl mx-auto p-2 md:p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-64">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${media.type === 'video' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                        {media.type === 'video' ? <Tv className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                    </div>
                    <div className="overflow-hidden min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{media.title}</h4>
                        <p className="text-xs text-gray-500 truncate">Now Playing</p>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 justify-center items-center max-w-xl">
                    {media.type === 'audio' ? (
                        <audio controls autoPlay className="w-full h-10">
                            <source src={media.url} type="audio/mpeg" />
                        </audio>
                    ) : (
                        <div className="relative h-24 aspect-video bg-black rounded-lg overflow-hidden">
                             {isYoutubeId ? (
                                <iframe 
                                    src={`https://www.youtube.com/embed/${media.url}?autoplay=1`}
                                    title={media.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                             ) : (
                                <video controls autoPlay className="w-full h-full">
                                    <source src={media.url} type="video/mp4" />
                                </video>
                             )}
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full shrink-0">
                    <X className="w-6 h-6" />
                </button>
            </div>
             <div className="md:hidden">
                 {media.type === 'video' ? (
                     <div className="p-2 bg-black">
                        {isYoutubeId ? (
                            <iframe 
                                src={`https://www.youtube.com/embed/${media.url}?autoplay=1`}
                                className="w-full aspect-video rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video controls autoPlay className="w-full aspect-video rounded-lg">
                                <source src={media.url} type="video/mp4" />
                            </video>
                        )}
                     </div>
                 ) : (
                    <div className="px-4 pb-2">
                        <audio controls autoPlay className="w-full h-10">
                            <source src={media.url} type="audio/mpeg" />
                        </audio>
                    </div>
                 )}
            </div>
        </div>
    );
};

// Landing Page (Guest Mode)
const LandingPage = ({ onLogin, onGuest }: any) => (
    <div className="min-h-screen bg-gradient-to-br from-spiritual-50 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-md w-full text-center space-y-8">
            <div className="mx-auto w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all duration-500">
                <Sun className="w-12 h-12 text-spiritual-500 fill-current" />
            </div>
            
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">Spiritual Welfare</h1>
                <p className="text-spiritual-600 font-medium tracking-widest uppercase text-sm">Liberia's #1 Gospel App</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white space-y-4">
                <button onClick={onLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-all shadow-sm group">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                    <span>Sign in with Google</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button onClick={onGuest} className="w-full bg-spiritual-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-spiritual-700 transition-all shadow-md shadow-spiritual-200">
                    Continue as Guest
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                 <div className="flex flex-col items-center gap-1"><BookOpen className="w-4 h-4"/> Holy Bible</div>
                 <div className="flex flex-col items-center gap-1"><Tv className="w-4 h-4"/> Gospel TV</div>
                 <div className="flex flex-col items-center gap-1"><Sparkles className="w-4 h-4"/> AI Assistant</div>
            </div>
        </div>
        
        <div className="absolute bottom-6 text-center text-gray-400 text-xs">
            <p>Created by Akin S. Sokpah • 2025</p>
        </div>
    </div>
);

// Main App
export default function App() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [view, setView] = useState<ViewState>('home');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Initialize user from local storage
        const storedUser = localStorage.getItem('spiritual_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPrompt(e);
        });
    }, []);

    const handleGoogleLogin = async () => {
        // Mock Google Login for demo purposes
        const mockUser: UserProfile = {
            uid: '12345',
            displayName: 'Faithful Believer',
            photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faithful',
            isAnonymous: false,
            email: 'believer@example.com'
        };
        setUser(mockUser);
        localStorage.setItem('spiritual_user', JSON.stringify(mockUser));
    };

    const handleGuest = () => {
        const guestUser: UserProfile = { 
            uid: `guest-${Date.now()}`,
            displayName: "Guest Believer", 
            isAnonymous: true, 
            photoURL: "" 
        };
        setUser(guestUser);
    };

    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem('spiritual_user');
    };

    const installApp = () => {
        if (installPrompt) {
            installPrompt.prompt();
            setInstallPrompt(null);
        }
    };

    const renderView = () => {
        switch(view) {
            case 'bible': return <BibleReader />;
            case 'ai_assistant': return <SpiritualAssistant />;
            case 'toolbox': return <ToolboxHub onViewChange={setView} />;
            case 'treasury': return <TreasuryHub onViewChange={setView} />;
            case 'about': return <CreatorProfile />;
            case 'sermons': return <SermonArchive onPlay={setCurrentMedia} />;
            case 'kids': return <KidsCorner />;
            case 'testimonies': return <TestimonyWall />;
            case 'events': return <ChurchEvents />;
            case 'dictionary': return <div className="p-4 h-full bg-white rounded-2xl border border-gray-100"><h2 className="font-bold text-2xl mb-4">Bible Dictionary</h2><div className="space-y-2">{DICTIONARY_TERMS.map((d,i)=><div key={i} className="p-3 bg-gray-50 rounded"><strong>{d.term}:</strong> {d.def}</div>)}</div></div>;
            case 'hymnal': return <Hymnal />;
            case 'promises': return <Promises />;
            case 'prayer_bank': return <div className="p-4 h-full bg-white rounded-2xl"><h2 className="font-bold text-2xl mb-4">Prayer Bank</h2><div className="space-y-4">{[{title: "Healing", text: "Lord, heal me..."}].map((p,i)=><div key={i} className="p-4 bg-purple-50 rounded"><strong>{p.title}</strong><p>{p.text}</p></div>)}</div></div>;
            default: return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Welcome Card */}
                    <div className="col-span-full bg-gradient-to-r from-spiritual-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <h2 className="font-serif text-3xl font-bold mb-2">Welcome, {user?.displayName?.split(' ')[0]}!</h2>
                        <p className="opacity-90 max-w-lg text-lg">"The Lord bless thee, and keep thee: The Lord make his face shine upon thee." - Numbers 6:24</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setView('bible')} className="bg-white text-spiritual-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90 transition shadow-lg">Read Word</button>
                            <button onClick={() => setView('ai_assistant')} className="bg-spiritual-700 bg-opacity-40 text-white border border-white/20 px-5 py-2 rounded-xl font-bold text-sm hover:bg-opacity-60 transition flex items-center gap-2">
                                <Sparkles className="w-4 h-4"/> AI Assistant
                            </button>
                        </div>
                    </div>

                    {/* Quick Action Cards */}
                    <div onClick={() => setView('tv')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                        <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-100 transition"><Tv className="w-6 h-6"/></div>
                        <h3 className="font-bold text-gray-900 text-lg">Gospel TV</h3>
                        <p className="text-gray-500 text-sm mt-1">Watch 24/7 Worship & Praise</p>
                    </div>

                    <div onClick={() => setView('ai_assistant')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                        <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 mb-4 group-hover:bg-purple-100 transition"><Bot className="w-6 h-6"/></div>
                        <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
                        <p className="text-gray-500 text-sm mt-1">Prayer, Sermons & Advice</p>
                    </div>

                    <div onClick={() => setView('community')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                        <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center text-green-500 mb-4 group-hover:bg-green-100 transition"><MessageCircle className="w-6 h-6"/></div>
                        <h3 className="font-bold text-gray-900 text-lg">Live Fellowship</h3>
                        <p className="text-gray-500 text-sm mt-1">Chat with believers worldwide</p>
                    </div>

                    {/* Verse of the Moment */}
                    <div className="col-span-full md:col-span-2 bg-spiritual-50 rounded-2xl p-6 border border-spiritual-100 flex items-start gap-4">
                        <Quote className="w-10 h-10 text-spiritual-300 flex-shrink-0" />
                        <div>
                            <p className="font-serif text-xl text-spiritual-900 italic mb-2">"For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end."</p>
                            <p className="font-bold text-spiritual-600 uppercase text-xs tracking-wider">Jeremiah 29:11</p>
                        </div>
                    </div>
                </div>
            );
        }
    };

    if (!user) return <LandingPage onLogin={handleGoogleLogin} onGuest={handleGuest} />;

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-[#f4f7fb]'} font-sans text-gray-900 overflow-hidden`}>
            <Sidebar 
                activeView={view} 
                onViewChange={setView} 
                mobileOpen={mobileOpen} 
                setMobileOpen={setMobileOpen}
                user={user}
                onSignOut={handleSignOut}
                onPlayAmbient={setCurrentMedia}
                installAction={installApp}
                canInstall={!!installPrompt}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
            />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20">
                    <div className="flex items-center gap-2">
                        <Sun className="w-6 h-6 text-spiritual-500 fill-current" />
                        <span className="font-serif font-bold text-lg">Spiritual</span>
                    </div>
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide pb-24">
                    {renderView()}
                </div>

                <GlobalPlayer media={currentMedia} onClose={() => setCurrentMedia(null)} />
            </main>
        </div>
    );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);