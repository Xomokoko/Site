import React from 'react';
import { ExternalLink, BookOpen, FileText, Globe } from 'lucide-react';

const Links = () => {
  const linkCategories = [
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
      title: "Synthèse",
      color: "from-blue-600 to-indigo-600",
      links: [
        { name: "Système informatique", url: "https://shelled-columnist-614.notion.site/LINFO1123-SYNTHESE-SYST-MES-INFORMATIQUES-a8727ee10a1149ce90df406b7214fccc", icon: BookOpen },
      ]
    },

  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Titre de la page */}
        <div className="mb-8 animate-slide-up">
        </div>

        {/* Catégories de liens */}
        <div className="space-y-8">
          {linkCategories.map((category, idx) => (
            <div key={idx} className="animate-slide-up" style={{ animationDelay: `${0.1 * (idx + 1)}s` }}>
              {/* Titre de la catégorie */}
              <h2 className={`text-2xl font-bold font-display mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.title}
              </h2>

              {/* Grille de liens */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.links.map((link, linkIdx) => {
                  const Icon = link.icon;
                  const hostname = (() => { try { return new URL(link.url).hostname; } catch { return link.url; } })();
                  return (
                    <div key={linkIdx} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center dark:from-slate-700 dark:to-slate-800 overflow-hidden">
                          {(() => {
                            const hostname = (() => { try { return new URL(link.url).hostname; } catch { return link.url; } })();
                            if (hostname && (hostname.includes('notion') || hostname.includes('notion.so') || hostname.includes('notion.site'))) {
                              return (
                                <>
                                  <div className="w-6 h-6 flex items-center justify-center bg-black text-white rounded-sm text-sm font-semibold">N</div>
                                  <Icon className="w-6 h-6 text-slate-900 dark:text-slate-200" style={{ display: 'none' }} />
                                </>
                              );
                            }

                            return (
                              <>
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                                  alt={`${link.name} favicon`}
                                  className="w-6 h-6 object-contain"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; const next = e.currentTarget.nextSibling; if (next) next.style.display = 'block'; }}
                                />
                                <Icon className="w-6 h-6 text-slate-900 dark:text-slate-200" style={{ display: 'none' }} />
                              </>
                            );
                          })()}
                        </div>
                        <div>
                          <div className="font-semibold">{link.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 truncate" title={link.url}>{hostname}</div>
                        </div>
                      </div>

                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir
                      </a>
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