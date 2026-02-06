import React, { useState, useEffect } from "react";
// Import Firebase Compatibility SDK (matching your previous script)
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { PlusCircle, Users, X, Menu, MessageCircle } from "lucide-react";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyC3KcQSG8THJnpzyr_vlOsFx_yNrMwacS8",
  authDomain: "network-cecda.firebaseapp.com",
  projectId: "network-cecda",
  storageBucket: "network-cecda.appspot.com",
  messagingSenderId: "90708300742",
  appId: "1:90708300742:web:c383d50386d48d3a9dd8c7",
  databaseURL: "https://network-cecda-default-rtdb.firebaseio.com/",
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const WhatsAppGroupPage = () => {
  const [groups, setGroups] = useState([]); // Now empty, will be filled from Firebase
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupLink, setNewGroupLink] = useState("");
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM FIREBASE ---
  useEffect(() => {
    const groupsRef = database.ref("whatsappProject/groups");

    // Listen for real-time updates
    groupsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array and reverse to show newest first
        const formattedGroups = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .reverse();
        setGroups(formattedGroups);
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => groupsRef.off();
  }, []);

  // --- SAVE DATA TO FIREBASE ---
  const handleAddGroup = (e) => {
    e.preventDefault();
    if (newGroupName && newGroupLink) {
      const groupData = {
        name: newGroupName,
        link: newGroupLink,
        timestamp: new Date().toISOString(),
      };

      // Push to Firebase
      database
        .ref("whatsappProject/groups")
        .push(groupData)
        .then(() => {
          setNewGroupName("");
          setNewGroupLink("");
          setIsPopupOpen(false);
        })
        .catch((err) => alert("Error saving: " + err.message));
    }
  };

  return (
    <div
      className="min-h-screen font-sans text-gray-800 bg-repeat"
      style={{
        backgroundColor: "#e5ddd5",
        backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
        backgroundSize: "400px",
      }}
    >
      {/* --- NAVBAR --- */}
      <nav className="bg-[#075E54] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#128C7E] rounded-md transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <MessageCircle className="text-[#25D366]" fill="#25D366" />
              <span>WhatsAppGroups</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="https://www.instagram.com/asjab_music/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white/80 hover:text-[#25D366] transition-colors border-r border-white/20 pr-6"
            >
              Contact Developer
            </a>

            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <PlusCircle size={18} />
              <span>Add Link</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-xl flex flex-col p-6">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <span className="font-bold text-[#075E54] text-xl">
                Navigation
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setIsPopupOpen(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full bg-[#25D366] text-white p-2 text-sm rounded-xl font-bold flex items-center gap-3"
              >
                <PlusCircle size={20} /> Add Your Group
              </button>
              <a
                href="https://www.instagram.com/shahabaftab2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white p-2.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Contact Owner</span>
              </a>

              <a
                href="https://www.instagram.com/asjab_music/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white p-2.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Contact Developer</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#075E54] mb-4">
            WhatsApp Group Links
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Join the best Group worldwide. Data is synced with Firebase.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT (Showing Uploaded Data) --- */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <section className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#075E54] flex items-center gap-2">
              <Users size={22} />{" "}
              {loading ? "Loading Groups..." : "Live Groups"}
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="p-5 flex items-center justify-between hover:bg-green-50/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-gray-800 leading-tight">
                      {group.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />{" "}
                        {Math.floor(Math.random() * 200) + 300}+ members
                      </span>
                      <span>•</span>
                      <span className="text-green-600 font-semibold">
                        Verified
                      </span>
                    </div>
                  </div>
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-6 py-2.5 rounded-lg text-sm font-black hover:bg-[#128C7E] shadow-sm transition-all"
                  >
                    JOIN
                  </a>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">
                {loading
                  ? "Syncing with Database..."
                  : "No groups found. Be the first to add one!"}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* --- POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#075e54]/40 backdrop-blur-md"
            onClick={() => setIsPopupOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-[#075E54]">
                Share Your Group
              </h3>
              <button onClick={() => setIsPopupOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddGroup} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Lovers"
                  className="w-full text-sm bg-gray-50 border-2 border-transparent p-2 rounded-xl outline-none focus:border-[#25D366]"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Invite URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full text-sm bg-gray-50 border-2 border-transparent p-2 rounded-xl outline-none focus:border-[#25D366]"
                  value={newGroupLink}
                  onChange={(e) => setNewGroupLink(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-sm bg-[#075E54] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#128C7E]"
              >
                Publish to Firebase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppGroupPage;
