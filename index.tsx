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
  Mail
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
type ViewState = 'home' | 'topics' | 'meditate' | 'journal' | 'bible' | 'worship' | 'features' | 'about' | 'affirmations' | 'calendar' | 'tv' | 'trivia' | 'mood' | 'prayers' | 'settings' | 'cinema' | 'mysteries' | 'community';

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
    { id: 'video9', title: 'Peaceful Scriptures', type: 'video', url: '1s58rW0_LN4' },
    { id: 'rain', title: 'Soft Rain Audio', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { id: 'rain2', title: 'Thunder & Rain', url: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_9075775960.mp3' },
    { id: 'pads', title: 'Worship Pads Audio', url: 'https://cdn.pixabay.com/download/audio/2024/02/07/audio_c3e031a54f.mp3' },
    { id: 'pads2', title: 'Deep Ambient Pad', url: 'https://cdn.pixabay.com/download/audio/2023/09/06/audio_2d82d44445.mp3' },
];

// --- Components ---

// 1. Sidebar
const Sidebar = ({ activeView, onViewChange, mobileOpen, setMobileOpen, user, onSignOut, onPlayAmbient }: any) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: <Heart className="w-5 h-5" /> },
    { id: 'bible', label: 'Holy Bible', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'worship', label: 'Worship & Music', icon: <Music className="w-5 h-5" /> },
    { id: 'tv', label: 'Gospel TV Live', icon: <Tv className="w-5 h-5" /> },
    { id: 'cinema', label: 'Spiritual Cinema', icon: <Film className="w-5 h-5" /> },
    { id: 'community', label: 'Community Chat', icon: <Users className="w-5 h-5" /> },
    { id: 'topics', label: 'Scripture Guide', icon: <List className="w-5 h-5" /> }, 
    { id: 'mysteries', label: 'Mysteries & Prophecy', icon: <Eye className="w-5 h-5" /> },
    { id: 'meditate', label: 'Meditation', icon: <Wind className="w-5 h-5" /> },
    { id: 'journal', label: 'My Journal', icon: <PenTool className="w-5 h-5" /> },
    { id: 'prayers', label: 'Prayer Wall', icon: <Zap className="w-5 h-5" /> },
    { id: 'about', label: 'About Creator', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
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

        {/* Ambient Music Section */}
        <div className="px-4 py-2">
            <div className="bg-spiritual-50 rounded-xl p-3 border border-spiritual-100">
                <div className="flex items-center gap-2 text-spiritual-700 mb-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Ambient Music</span>
                </div>
                <div className="space-y-1 h-32 overflow-y-auto scrollbar-hide">
                    {AMBIENT_TRACKS.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => onPlayAmbient(t)}
                            className="w-full text-[10px] bg-white border border-spiritual-200 rounded px-2 py-1 text-gray-600 hover:bg-spiritual-100 hover:text-spiritual-700 truncate text-left transition-colors flex items-center gap-2"
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

// 2. Global Player Component (Persistent Music/Video)
const GlobalPlayer = ({ media, onClose }: { media: MediaItem | null, onClose: () => void }) => {
    const [minimized, setMinimized] = useState(false);

    // Auto-minimize ambient tracks
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
            {/* Header / Controls */}
            <div className={`absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-20 ${minimized ? 'hidden' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
                <span className="text-xs text-white font-bold truncate px-2">{media.title}</span>
                <div className="flex gap-2">
                    <button onClick={() => setMinimized(true)} className="text-white hover:text-gray-300"><Minimize2 className="w-4 h-4"/></button>
                    <button onClick={onClose} className="text-white hover:text-red-400"><X className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Minimized View */}
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

            {/* Content (YouTube Embed or Audio) */}
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
            
            {/* Hidden Audio for minimized mode if it's not a video iframe */}
            {minimized && media.type !== 'video' && media.url.includes("http") && (
                <audio src={media.url} autoPlay loop className="hidden" />
            )}
            
             {/* Hidden Iframe for minimized mode if it IS a video */}
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

// 3. Community Chat (Realtime Firestore)
const CommunityChat = ({ user }: { user: FirebaseUser }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const dummyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Subscribe to Firestore messages with increased limit for history
        const q = query(
            collection(db, "chat_messages"), 
            orderBy("createdAt", "desc"), 
            limit(500) // Increased limit to show more history
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
            });
            // Firestore returns newest first (desc), so reverse for chat view (oldest at top)
            setMessages(msgs.reverse());
        }, (error) => {
            console.error("Chat Error:", error);
        });
        
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        dummyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, "chat_messages"), {
                text: newMessage,
                userId: user.uid,
                displayName: user.displayName || "Anonymous",
                photoURL: user.photoURL || "",
                createdAt: serverTimestamp()
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
            alert("Could not send message. Check your connection.");
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        if (timestamp.toDate) return timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        return '';
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-spiritual-100 overflow-hidden">
            <div className="p-4 border-b border-spiritual-100 bg-spiritual-50 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-spiritual-800 flex items-center gap-2">
                    <Users className="w-5 h-5"/> Global Christian Fellowship
                </h2>
                <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    Live Chat
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-20"/>
                        <p>Welcome! Be the first to share a blessing.</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.userId === user.uid;
                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className="shrink-0">
                                {msg.photoURL ? (
                                    <img src={msg.photoURL} className="w-8 h-8 rounded-full border border-gray-200" alt="Av"/>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-spiritual-200 flex items-center justify-center text-spiritual-700 text-xs font-bold">
                                        {msg.displayName?.[0] || 'A'}
                                    </div>
                                )}
                            </div>
                            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm
                                ${isMe ? 'bg-spiritual-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
                            `}>
                                {!isMe && <p className="text-[10px] font-bold text-spiritual-500 mb-1">{msg.displayName}</p>}
                                <p>{msg.text}</p>
                                <p className={`text-[9px] mt-1 text-right opacity-70 ${isMe ? 'text-spiritual-100' : 'text-gray-400'}`}>
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={dummyRef}></div>
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-spiritual-100 flex gap-2">
                <input 
                    className="flex-1 border border-spiritual-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-spiritual-300"
                    placeholder="Share a scripture or testimony..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="bg-spiritual-600 text-white p-2 rounded-full hover:bg-spiritual-700 shadow-md transition-transform hover:scale-105">
                    <Send className="w-5 h-5"/>
                </button>
            </form>
        </div>
    );
};

// 4. Creator Profile Component
const CreatorProfile = () => {
    // Placeholder image that can be replaced by user upload. 
    // Since I cannot read local files from prompt, we start with a generic silhouette or placeholder
    const [image, setImage] = useState<string>("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImage(ev.target.result as string);
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
                                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Akin S. Sokpah</h1>
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
                                    <span className="font-semibold">+231 88 918 3557</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Mail className="w-5 h-5 text-spiritual-500" />
                                    <span className="font-semibold">sokpahakinsaye@gmail.com</span>
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

                            <div className="mt-8 grid grid-cols-3 gap-4">
                                <div className="bg-spiritual-50 p-4 rounded-2xl text-center border border-spiritual-100">
                                    <span className="block text-2xl font-bold text-spiritual-800">100%</span>
                                    <span className="text-xs text-spiritual-500 uppercase tracking-wide font-bold">Gospel</span>
                                </div>
                                <div className="bg-spiritual-50 p-4 rounded-2xl text-center border border-spiritual-100">
                                    <span className="block text-2xl font-bold text-spiritual-800">24/7</span>
                                    <span className="text-xs text-spiritual-500 uppercase tracking-wide font-bold">Worship</span>
                                </div>
                                <div className="bg-spiritual-50 p-4 rounded-2xl text-center border border-spiritual-100">
                                    <span className="block text-2xl font-bold text-spiritual-800">Free</span>
                                    <span className="text-xs text-spiritual-500 uppercase tracking-wide font-bold">Forever</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. Mysteries & Prophecy (Hardcoded Static Content - No AI)
const Mysteries = () => {
    // Static content library
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
        color: "bg-spiritual-50 text-spiritual-800"
    }));

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 h-full flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Topics */}
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
            
            {/* Content Area */}
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

// 6. Scripture Topic Guide (Replaces AI Chat)
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

// 7. Spiritual Cinema
const SpiritualCinema = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const movies = [
        { id: '1', title: "The Life of Jesus (Gospel of John)", url: "47MwVJ6y_oI", duration: "2h 53m" },
        { id: '2', title: "War Room (Prayer Clips)", url: "V1pZf5Q9eQA", duration: "Highlight" },
        { id: '3', title: "God's Not Dead (Clip)", url: "M1M_d55_H_o", duration: "Highlight" },
        { id: '4', title: "The Chosen - Episode 1 (Official)", url: "craeyJdrCsE", duration: "54m" },
        { id: '5', title: "Passion of the Christ (Scene)", url: "0B5u8JgS0wA", duration: "Clip" },
        { id: '6', title: "Why I Follow Jesus (Testimony)", url: "K48-52_5y6w", duration: "12m" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
            <h2 className="font-serif text-3xl text-spiritual-800 font-bold mb-6 flex items-center gap-2">
                <Film className="w-8 h-8 text-spiritual-600"/> Spiritual Cinema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
                {movies.map(movie => (
                    <div key={movie.id} className="group cursor-pointer" onClick={() => setMedia({ id: movie.id, title: movie.title, type: 'video', url: movie.url })}>
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                            <img 
                                src={`https://img.youtube.com/vi/${movie.url}/mqdefault.jpg`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-5 h-5 text-spiritual-600 ml-1 fill-current"/>
                                </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {movie.duration}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-spiritual-600 transition-colors">{movie.title}</h3>
                        <p className="text-sm text-gray-500">Watch Now</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 8. Updated Bible Reader with Stories
const BibleReader = () => {
    const [book, setBook] = useState("Genesis");
    const [chapter, setChapter] = useState(1);
    const [verses, setVerses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'read' | 'stories'>('read');
    
    // Stories Preset
    const stories = [
        { title: "Creation", book: "Genesis", ch: 1 },
        { title: "Noah's Ark", book: "Genesis", ch: 6 },
        { title: "David & Goliath", book: "1 Samuel", ch: 17 },
        { title: "Daniel in Lions' Den", book: "Daniel", ch: 6 },
        { title: "Birth of Jesus", book: "Luke", ch: 2 },
        { title: "Sermon on the Mount", book: "Matthew", ch: 5 },
        { title: "The Crucifixion", book: "John", ch: 19 },
        { title: "Resurrection", book: "John", ch: 20 },
    ];

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
        if (mode === 'read') fetchScripture(book, chapter);
    }, [book, chapter]);

    const loadStory = (s: any) => {
        setBook(s.book);
        setChapter(s.ch);
        setMode('read');
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-spiritual-100 overflow-hidden">
             <div className="p-4 bg-spiritual-50 border-b border-spiritual-100 flex gap-4 overflow-x-auto">
                <button onClick={() => setMode('read')} className={`px-4 py-2 rounded-lg font-bold text-sm ${mode === 'read' ? 'bg-white shadow text-spiritual-700' : 'text-gray-500'}`}>Read Bible</button>
                <button onClick={() => setMode('stories')} className={`px-4 py-2 rounded-lg font-bold text-sm ${mode === 'stories' ? 'bg-white shadow text-spiritual-700' : 'text-gray-500'}`}>Famous Stories</button>
             </div>

             {mode === 'stories' ? (
                 <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
                    {stories.map(s => (
                        <button key={s.title} onClick={() => loadStory(s)} className="p-6 bg-white border border-spiritual-100 rounded-xl hover:shadow-lg hover:border-spiritual-300 transition-all text-left group">
                            <BookOpen className="w-8 h-8 text-spiritual-400 mb-4 group-hover:scale-110 transition-transform"/>
                            <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
                            <p className="text-sm text-gray-500">{s.book} {s.ch}</p>
                        </button>
                    ))}
                 </div>
             ) : (
                <>
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
                                    <p key={v.verse} className="mb-4 relative pl-4"><span className="absolute left-0 text-xs text-spiritual-400 font-sans top-1">{v.verse}</span><span className="font-serif text-gray-800 text-xl leading-relaxed">{v.text}</span></p>
                                ))}
                            </div>
                        )}
                    </div>
                </>
             )}
        </div>
    );
};

// 9. Dashboard
const Dashboard = ({ onViewChange }: { onViewChange: (view: ViewState) => void }) => {
    const features = [
        { id: 'topics', title: 'Scripture Guide', desc: 'Find Biblical Answers', icon: <List className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50' },
        { id: 'community', title: 'Global Chat', desc: 'Fellowship', icon: <Users className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
        { id: 'cinema', title: 'Cinema', desc: 'Spiritual Movies', icon: <Film className="w-6 h-6 text-red-500" />, color: 'bg-red-50' },
        { id: 'mysteries', title: 'Mysteries', desc: 'Prophecy & Truth', icon: <Eye className="w-6 h-6 text-purple-500" />, color: 'bg-purple-50' },
        { id: 'bible', title: 'Bible', desc: 'Read Scriptures', icon: <BookOpen className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
        { id: 'worship', title: 'Worship', desc: 'Music Player', icon: <Music className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
        { id: 'tv', title: 'Gospel TV', desc: 'Live Channels', icon: <Tv className="w-6 h-6 text-red-600" />, color: 'bg-red-50' },
        { id: 'journal', title: 'Journal', desc: 'Write Thoughts', icon: <PenTool className="w-6 h-6 text-green-500" />, color: 'bg-green-50' },
        { id: 'about', title: 'About Creator', desc: 'Akin S. Sokpah', icon: <User className="w-6 h-6 text-cyan-500" />, color: 'bg-cyan-50' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
             <div className="bg-gradient-to-r from-spiritual-600 to-spiritual-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                 <h1 className="font-serif text-3xl font-bold mb-2">Welcome to Spiritual Welfare</h1>
                 <p className="text-spiritual-100">Your digital sanctuary for Gospel, Worship, and Truth.</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

// 10. Gospel TV (Connects to Global Player)
const GospelTV = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const channels = [
        { name: "Gospel Worship 24/7", vidId: "M2CC6g3O4iI" }, 
        { name: "Hillsong Worship", vidId: "a3aF2n6bV0c" }, 
        { name: "Elevation Worship", vidId: "Zp6aygmvzM4" }, 
        { name: "Black Gospel Hits", vidId: "Q71t8lT8BvI" },
        { name: "Instrumental Prayer", vidId: "s7j6e1g5d8w" },
        { name: "Gaither Music", vidId: "tC3SWA1pE_k" },
        { name: "Tasha Cobbs Leonard", vidId: "L8fD-s4a7aQ" },
        { name: "Maverick City", vidId: "N1o8t6vD8_c" },
        { name: "Bethel Music", vidId: "gn5CMSSAx_c" },
        { name: "Upper Room", vidId: "j4mR1v_r2F4" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
             <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Tv className="w-6 h-6 text-red-500"/> Live Gospel TV</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto">
                 {channels.map((c, i) => (
                     <button key={i} onClick={() => setMedia({ id: String(i), title: c.name, type: 'video', url: c.vidId })} className="aspect-video bg-gray-100 rounded-lg relative group overflow-hidden">
                         <img src={`https://img.youtube.com/vi/${c.vidId}/mqdefault.jpg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Play className="text-white w-8 h-8"/>
                         </div>
                         <span className="absolute bottom-0 left-0 w-full bg-black/70 text-white text-xs p-1 truncate">{c.name}</span>
                     </button>
                 ))}
             </div>
        </div>
    );
};

// 11. Worship (Connects to Global Player)
const Worship = ({ setMedia }: { setMedia: (m: MediaItem) => void }) => {
    const songs = [
        { id: "1", title: "Oceans (Hillsong)", vidId: "OP-00EwLdiU" },
        { id: "2", title: "Way Maker", vidId: "iJCV_2H9xD0" },
        { id: "3", title: "10,000 Reasons", vidId: "DXDGE_lRI0E" },
        { id: "4", title: "Goodness of God", vidId: "-f4MUUMwmV4" },
        { id: "5", title: "Jireh", vidId: "mC-zbMKp6fo" },
        { id: "6", title: "What A Beautiful Name", vidId: "nQWFzMvCfLE" },
    ];
    
    return (
         <div className="bg-white rounded-2xl shadow-sm border border-spiritual-100 p-6 h-full flex flex-col">
             <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><Music className="w-6 h-6 text-blue-500"/> Worship Music</h2>
             <div className="space-y-3">
                 {songs.map(s => (
                     <button key={s.id} onClick={() => setMedia({ id: s.id, title: s.title, type: 'video', url: s.vidId })} className="w-full flex items-center gap-4 p-3 hover:bg-spiritual-50 rounded-xl transition-colors text-left group border border-transparent hover:border-spiritual-100">
                         <div className="w-12 h-12 bg-spiritual-100 rounded-full flex items-center justify-center text-spiritual-600 group-hover:bg-spiritual-600 group-hover:text-white transition-colors">
                             <Play className="w-5 h-5 ml-1 fill-current"/>
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800">{s.title}</h3>
                             <p className="text-xs text-gray-500">Click to play in background</p>
                         </div>
                     </button>
                 ))}
             </div>
        </div>
    );
};

const Journal = () => <div className="p-8 bg-white rounded-2xl text-center"><PenTool className="w-16 h-16 mx-auto mb-4 text-spiritual-300"/><h2 className="text-2xl font-serif">Journal Feature</h2><p>Coming Soon: Write your daily prayers.</p></div>;
const Meditation = () => <div className="p-8 bg-white rounded-2xl text-center"><Wind className="w-16 h-16 mx-auto mb-4 text-green-300"/><h2 className="text-2xl font-serif">Breathing</h2><p>Inhale Peace, Exhale Worry.</p></div>;
const PrayerWall = () => <div className="p-8 bg-white rounded-2xl text-center"><Zap className="w-16 h-16 mx-auto mb-4 text-yellow-300"/><h2 className="text-2xl font-serif">Prayer Wall</h2><p>Post your requests here.</p></div>;

// 12. Login Screen
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
                        Join our community to access features including live bible study, worship, fellowship, and personal journaling.
                    </p>
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                    <button 
                        onClick={onLogin}
                        className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:shadow-md transition-all mb-4 group"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        <span>Continue with Google</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-6">Created by Akin S. Sokpah</p>
                </div>
            </div>
        </div>
    );
};

// 13. Main App
const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);

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

  // Load Ambient Track
  const playAmbient = (track: any) => {
      setCurrentMedia({
          id: track.id,
          title: `Ambient: ${track.title}`,
          type: track.type || 'audio',
          url: track.url
      });
  };

  if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-spiritual-50"><Loader2 className="w-10 h-10 text-spiritual-500 animate-spin" /></div>;
  if (!user) return <LoginScreen onLogin={handleGoogleLogin} />;

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <Dashboard onViewChange={setActiveView} />;
      case 'topics': return <TopicGuide />;
      case 'community': return <CommunityChat user={user} />;
      case 'cinema': return <SpiritualCinema setMedia={setCurrentMedia} />;
      case 'mysteries': return <Mysteries />;
      case 'bible': return <BibleReader />;
      case 'worship': return <Worship setMedia={setCurrentMedia} />;
      case 'tv': return <GospelTV setMedia={setCurrentMedia} />;
      case 'meditate': return <Meditation />;
      case 'journal': return <Journal />;
      case 'prayers': return <PrayerWall />;
      case 'about': return <CreatorProfile />;
      default: return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-spiritual-50 font-sans text-gray-900 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onSignOut={handleSignOut}
        onPlayAmbient={playAmbient}
      />

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="lg:hidden bg-white border-b border-spiritual-200 px-4 py-3 flex items-center justify-between shrink-0 z-10 relative">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-spiritual-800 text-lg">Spiritual Welfare</span>
          <div className="w-6" />
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth pb-32">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>

        {/* Global Player (Fixed at bottom right) */}
        <GlobalPlayer media={currentMedia} onClose={() => setCurrentMedia(null)} />
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);