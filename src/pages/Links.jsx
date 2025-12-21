import { ExternalLink, BookOpen, FileText, Globe, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Links = () => {
  const [linkCategories, setLinkCategories] = useState([
    {
      title: "AI Assistants",  
      color: "from-blue-600 to-indigo-600",
      links: [
        { name: "Le chat", url: "https://chat.mistral.ai/chat", icon: BookOpen },
        { name: "Claude Sonnet", url: "https://claude.ai/new", icon: FileText },
        { name: "Chat GPT", url: "https://chatgpt.com/", icon: Globe },
        { name: "Gemini", url: "https://gemini.google.com/app", icon: Globe },
      ]
    },
    {
      title: "Mes liens",
      color: "from-blue-600 to-indigo-600",
      links: [
        { name: "Système informatique", url: "https://shelled-columnist-614.notion.site/LINFO1123-SYNTHESE-SYST-MES-INFORMATIQUES-a8727ee10a1149ce90df406b7214fccc", icon: BookOpen },
      ]
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', categoryIndex: 0 });

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const updatedCategories = [...linkCategories];
      updatedCategories[newLink.categoryIndex].links.push({
        name: newLink.name,
        url: newLink.url,
        icon: Globe
      });
      setLinkCategories(updatedCategories);
      setNewLink({ name: '', url: '', categoryIndex: 0 });
      setShowAddForm(false);
    }
  };

  const handleDeleteLink = (categoryIdx, linkIdx) => {
    const updatedCategories = [...linkCategories];
    updatedCategories[categoryIdx].links.splice(linkIdx, 1);
    setLinkCategories(updatedCategories);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bouton d'ajout */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter un lien
          </button>
        </div>

        {/* Formulaire d'ajout */}
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
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={newLink.categoryIndex}
                  onChange={(e) => setNewLink({ ...newLink, categoryIndex: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                >
                  {linkCategories.map((cat, idx) => (
                    <option key={idx} value={idx}>{cat.title}</option>
                  ))}
                </select>
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

        {/* Catégories de liens */}
        <div className="space-y-8">
          {linkCategories.map((category, idx) => (
            <div key={idx} className="animate-slide-up" style={{ animationDelay: `${0.1 * (idx + 1)}s` }}>
              <h2 className={`text-2xl font-bold font-display mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.links.map((link, linkIdx) => {
                  const Icon = link.icon;
                  const hostname = (() => { try { return new URL(link.url).hostname; } catch { return link.url; } })();
                  return (
                    <div key={linkIdx} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center dark:from-slate-700 dark:to-slate-800 overflow-hidden flex-shrink-0">
                          {(() => {
                            if (hostname && (hostname.includes('notion') || hostname.includes('notion.so') || hostname.includes('notion.site'))) {
                              return (
                                <div className="w-6 h-6 flex items-center justify-center bg-black text-white rounded-sm text-sm font-semibold">N</div>
                              );
                            }
                            return (
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
                            );
                          })()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold truncate">{link.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 truncate" title={link.url}>{hostname}</div>
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
                        <button
                          onClick={() => handleDeleteLink(idx, linkIdx)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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