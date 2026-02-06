import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {
  Trash2,
  Download,
  Upload,
  Database,
  AlertTriangle,
  Edit3,
  Check,
  X,
} from "lucide-react";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3KcQSG8THJnpzyr_vlOsFx_yNrMwacS8",
  authDomain: "network-cecda.firebaseapp.com",
  projectId: "network-cecda",
  storageBucket: "network-cecda.appspot.com",
  messagingSenderId: "90708300742",
  appId: "1:90708300742:web:c383d50386d48d3a9dd8c7",
  databaseURL: "https://network-cecda-default-rtdb.firebaseio.com/",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", link: "" });
  const fileInputRef = useRef(null);
  useEffect(() => {
    const groupsRef = database.ref("whatsappProject/groups");
    groupsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedGroups = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .reverse();
        setGroups(formattedGroups);
      } else {
        setGroups([]);
      }
      setLoading(false);
    });
    return () => groupsRef.off();
  }, []);

  const startEditing = (group) => {
    setEditingId(group.id);
    setEditForm({ name: group.name, link: group.link });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: "", link: "" });
  };

  const handleUpdate = (id) => {
    database
      .ref(`whatsappProject/groups/${id}`)
      .update({
        name: editForm.name,
        link: editForm.link,
      })
      .then(() => setEditingId(null))
      .catch((err) => alert("Update failed: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      database
        .ref(`whatsappProject/groups/${id}`)
        .remove()
        .catch((err) => alert("Delete failed: " + err.message));
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(groups, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute(
      "download",
      `backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    linkElement.click();
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (
          Array.isArray(json) &&
          window.confirm(`Restore ${json.length} groups?`)
        ) {
          const groupsRef = database.ref("whatsappProject/groups");
          json.forEach((item) => {
            const { id, ...cleanData } = item;
            groupsRef.push(cleanData);
          });
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      {/* Navigation - Stacked on Mobile */}
      <nav className="bg-slate-900 text-white shadow-lg p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Database size={24} className="text-blue-400" />
            <h1 className="text-lg md:text-xl font-black uppercase tracking-widest">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBackup}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all"
            >
              <Download size={16} /> Backup
            </button>
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all"
            >
              <Upload size={16} /> Restore
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600">
            <p className="text-gray-500 text-xs font-bold uppercase">
              Total Database Entries
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">
              {groups.length}
            </h2>
          </div>
          <div className="bg-amber-50 p-4 md:p-6 rounded-2xl shadow-sm border border-amber-200 flex items-start md:items-center gap-4">
            <AlertTriangle className="text-amber-600 shrink-0" size={24} />
            <p className="text-xs md:text-sm text-amber-800">
              <strong>Editor Mode:</strong> Modify names and links directly in
              the list. Changes sync instantly to the database.
            </p>
          </div>
        </div>

        {/* Data Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-gray-50 border-b border-gray-200 p-4 text-xs font-bold text-gray-500 uppercase">
            <div className="col-span-4">Group Name</div>
            <div className="col-span-5">WhatsApp Link</div>
            <div className="col-span-3 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : groups.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                No groups found.
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex flex-col md:grid md:grid-cols-12 gap-4 p-4 transition-colors ${
                    editingId === group.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Name Column */}
                  <div className="col-span-4">
                    <label className="md:hidden text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      Group Name
                    </label>
                    {editingId === group.id ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className="font-bold text-gray-800 block">
                        {group.name}
                      </span>
                    )}
                  </div>

                  {/* Link Column */}
                  <div className="col-span-5 overflow-hidden">
                    <label className="md:hidden text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      WhatsApp Link
                    </label>
                    {editingId === group.id ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={editForm.link}
                        onChange={(e) =>
                          setEditForm({ ...editForm, link: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-sm text-blue-600 truncate block bg-blue-50 md:bg-transparent p-2 md:p-0 rounded">
                        {group.link}
                      </span>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-3 flex justify-end md:justify-center items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    {editingId === group.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(group.id)}
                          className="flex-1 md:flex-none p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex justify-center"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 md:flex-none p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 flex justify-center"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(group)}
                          className="flex-1 md:flex-none p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex justify-center"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
