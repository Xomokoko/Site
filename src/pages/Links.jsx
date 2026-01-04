import { ExternalLink, BookOpen, FileText, Globe, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getLinks, saveLink, deleteLink } from '../utils/storage';

const Links = () => {
  const aiAssistants = useMemo(
    () => ({
      title: "AI Assistants",
      color: "from-blue-600 to-indigo-600",
      links: [
        { id: 'ai-1', name: "Le chat", url: "https://chat.mistral.ai/chat", icon: BookOpen },
        { id: 'ai-2', name: "Claude Sonnet", url: "https://claude.ai/new", icon: FileText },
        { id: 'ai-3', name: "Chat GPT", url: "https://chatgpt.com/", icon: Globe },
        { id: 'ai-4', name: "Gemini", url: "https://gemini.google.com/app", icon: Globe }
      ]
    }),
    []
  );

  const [myLinks, setMyLinks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '' });

  useEffect(() => {
    setMyLinks(getLinks());
  }, []);

  const normalizeUrl = (raw) => {
    const url = (raw || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  const handleAddLink = () => {
    const name = newLink.name.trim();
    const url = normalizeUrl(newLink.url);

    if (!name || !url) return;

    try {
      new URL(url);
    } catch {
      return;
    }

    const saved = saveLink({ name, url });
    setMyLinks(prev => [...prev, saved]);
    setNewLink({ name: '', url: '' });
    setShowAddForm(false);
  };

  const handleDeleteMyLink = (id) => {
    deleteLink(id);
    setMyLinks(prev => prev.filter(l => l.id !== id));
  };

  const categories = [
    aiAssistants,
    {
      title: "Mes liens",
      color: "from-blue-600 to-indigo-600",
      links: myLinks.map(l => ({ ...l, icon: Globe }))
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter un lien
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Nouveau lien</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {categories.map((category, idx) => (
            <div key={idx} className="animate-slide-up" style={{ animationDelay: `${0.1 * (idx + 1)}s` }}>
              <h2 className={`text-2xl font-bold font-display mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.links.map((link, linkIdx) => {
                  const Icon = link.icon || Globe;
                  const hostname = (() => { try { return new URL(link.url).hostname; } catch { return link.url; } })();

                  return (
                    <div key={link.id || linkIdx} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center dark:from-slate-700 dark:to-slate-800 overflow-hidden flex-shrink-0">
                          <>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                              alt={`${link.name} favicon`}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const next = e.currentTarget.nextSibling;
                                if (next) next.style.display = 'block';
                              }}
                            />
                            <Icon className="w-6 h-6 text-slate-900 dark:text-slate-200" style={{ display: 'none' }} />
                          </>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{link.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 truncate" title={link.url}>
                            {hostname}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md whitespace-nowrap"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Ouvrir
                        </a>

                        {category.title === 'Mes liens' && (
                          <button
                            onClick={() => handleDeleteMyLink(link.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Links;