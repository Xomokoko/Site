import React, { useEffect, useState } from 'react';
import { Star, Plus, Trash2, Pencil, Check, X } from 'lucide-react';

const STORAGE_KEY = 'etudes_courses';

const safeLoad = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeCourses = (list) =>
  (list || [])
    .map((c, i) => ({
      id: c?.id ?? Date.now() + i,
      name: String(c?.name || '').trim(),
      favorite: !!c?.favorite,
      chapters: Array.isArray(c?.chapters)
        ? c.chapters
            .map((ch, j) => ({
              id: ch?.id ?? `${Date.now()}-${j}`,
              title: String(ch?.title || '').trim(),
              done: !!ch?.done
            }))
            .filter((ch) => ch.title)
        : []
    }))
    .filter((c) => c.name);

const Cours = () => {
  const [courses, setCourses] = useState(() => normalizeCourses(safeLoad()));

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCourseName, setEditingCourseName] = useState('');

  const [editingChapter, setEditingChapter] = useState({ courseId: null, chapterId: null });
  const [editingChapterTitle, setEditingChapterTitle] = useState('');

  const [addingChapterFor, setAddingChapterFor] = useState(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('coursesUpdated'));
  }, [courses]);

  const createCourse = () => {
    if (!name.trim()) return;
    setCourses((p) => [...p, { id: Date.now(), name: name.trim(), favorite: false, chapters: [] }]);
    setName('');
    setShowForm(false);
  };

  const toggleFavorite = (id) => setCourses((p) => p.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));

  const removeCourse = (id) => setCourses((p) => p.filter((c) => c.id !== id));

  const startEditCourse = (c) => {
    setEditingCourseId(c.id);
    setEditingCourseName(c.name);
  };

  const saveEditCourse = (id) => {
    if (!editingCourseName.trim()) return;
    setCourses((p) => p.map((c) => (c.id === id ? { ...c, name: editingCourseName.trim() } : c)));
    setEditingCourseId(null);
    setEditingCourseName('');
  };

  const startEditChapter = (courseId, ch) => {
    setEditingChapter({ courseId, chapterId: ch.id });
    setEditingChapterTitle(ch.title);
  };

  const saveEditChapter = (courseId, chapterId) => {
    if (!editingChapterTitle.trim()) return;
    setCourses((p) =>
      p.map((c) =>
        c.id !== courseId
          ? c
          : {
              ...c,
              chapters: c.chapters.map((ch) => (ch.id === chapterId ? { ...ch, title: editingChapterTitle.trim() } : ch))
            }
      )
    );
    setEditingChapter({ courseId: null, chapterId: null });
    setEditingChapterTitle('');
  };

  const deleteChapter = (courseId, chapterId) =>
    setCourses((p) => p.map((c) => (c.id !== courseId ? c : { ...c, chapters: c.chapters.filter((ch) => ch.id !== chapterId) })));

  const toggleChapterDone = (courseId, chapterId) =>
    setCourses((p) =>
      p.map((c) =>
        c.id !== courseId ? c : { ...c, chapters: c.chapters.map((ch) => (ch.id === chapterId ? { ...ch, done: !ch.done } : ch)) }
      )
    );

  const addChapter = (courseId) => {
    if (!newChapterTitle.trim()) return;
    setCourses((p) =>
      p.map((c) =>
        c.id !== courseId ? c : { ...c, chapters: [...c.chapters, { id: Date.now(), title: newChapterTitle.trim(), done: false }] }
      )
    );
    setAddingChapterFor(null);
    setNewChapterTitle('');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 rounded-lg bg-white text-slate-900 border border-slate-200 shadow-sm dark:bg-slate-800 dark:text-white dark:border-slate-700"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 min-w-0">
                {editingCourseId === course.id ? (
                  <>
                    <input
                      value={editingCourseName}
                      onChange={(e) => setEditingCourseName(e.target.value)}
                      className="input-field !py-1 !px-2 !text-sm"
                      autoFocus
                    />
                    <button onClick={() => saveEditCourse(course.id)}>
                      <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCourseId(null);
                        setEditingCourseName('');
                      }}
                    >
                      <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="font-semibold truncate">{course.name}</div>
                    <button onClick={() => toggleFavorite(course.id)}>
                      <Star
                        className={`w-4 h-4 ${course.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 dark:text-slate-400'}`}
                      />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => startEditCourse(course)}>
                  <Pencil className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
                <button onClick={() => removeCourse(course.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {course.chapters.map((ch) => {
                const isEditing = editingChapter.courseId === course.id && editingChapter.chapterId === ch.id;

                return (
                  <div key={ch.id} className="group flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          value={editingChapterTitle}
                          onChange={(e) => setEditingChapterTitle(e.target.value)}
                          className="input-field !py-1 !px-2 !text-sm flex-1"
                          autoFocus
                        />
                        <button onClick={() => saveEditChapter(course.id, ch.id)}>
                          <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingChapter({ courseId: null, chapterId: null });
                            setEditingChapterTitle('');
                          }}
                        >
                          <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={!!ch.done}
                          onChange={() => toggleChapterDone(course.id, ch.id)}
                          className="w-4 h-4 rounded border-slate-400 bg-transparent accent-blue-500 cursor-pointer"
                          title="Marquer comme fait"
                        />
                        <span className={`flex-1 truncate ${ch.done ? 'line-through text-slate-400' : ''}`}>{ch.title}</span>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditChapter(course.id, ch)}>
                            <Pencil className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          <button onClick={() => deleteChapter(course.id, ch.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {addingChapterFor === course.id ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="input-field !py-1 !px-2 !text-sm flex-1"
                    autoFocus
                    placeholder="Nouveau chapitre"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addChapter(course.id);
                      if (e.key === 'Escape') {
                        setAddingChapterFor(null);
                        setNewChapterTitle('');
                      }
                    }}
                  />
                  <button onClick={() => addChapter(course.id)}>
                    <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  </button>
                  <button
                    onClick={() => {
                      setAddingChapterFor(null);
                      setNewChapterTitle('');
                    }}
                  >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingChapterFor(course.id)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un chapitre
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-3xl shadow-lg"
      >
        +
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white p-6 rounded-lg w-full max-w-md border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4">Nouveau cours</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mb-3"
              placeholder="Nom du cours"
              onKeyDown={(e) => {
                if (e.key === 'Enter') createCourse();
                if (e.key === 'Escape') {
                  setShowForm(false);
                  setName('');
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setName('');
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button onClick={createCourse} className="btn-primary">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cours;
