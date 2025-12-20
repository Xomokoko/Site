import React, { useEffect, useState } from 'react';

const Cours = () => {
	const [courses, setCourses] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('etudes_courses') || '[]');
		} catch {
			return [];
		}
	});

	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState('');
	const [chapterInput, setChapterInput] = useState('');
	const [chapters, setChapters] = useState([]);

	useEffect(() => {
		localStorage.setItem('etudes_courses', JSON.stringify(courses));
	}, [courses]);

	const addChapter = () => {
		const t = chapterInput.trim();
		if (!t) return;
		setChapters((c) => [...c, { id: Date.now() + Math.random(), title: t, done: false }]);
		setChapterInput('');
	};

	const createCourse = () => {
		const n = name.trim();
		if (!n) return;
		setCourses((c) => [...c, { id: Date.now(), name: n, chapters }]);
		setName('');
		setChapters([]);
		setShowForm(false);
	};

	const toggleChapter = (courseId, chapterId) => {
		setCourses((prev) => prev.map((course) => {
			if (course.id !== courseId) return course;
			return {
				...course,
				chapters: course.chapters.map((ch) => ch.id === chapterId ? { ...ch, done: !ch.done } : ch)
			};
		}));
	};

	const removeCourse = (id) => setCourses((c) => c.filter((x) => x.id !== id));

	return (
		<div className="min-h-screen p-6">

			{courses.length === 0 ? (
				<div className="flex items-center justify-center">
					<div className="w-56 h-56 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
						<button
							onClick={() => setShowForm(true)}
							aria-label="Ajouter un cours"
							className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-4xl font-bold flex items-center justify-center shadow"
						>
							+
						</button>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{courses.map((course) => (
						<div key={course.id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow">
							<div className="flex items-start justify-between">
								<div>
									<div className="font-semibold text-lg">{course.name}</div>
									<div className="mt-2 space-y-2">
										{course.chapters && course.chapters.length > 0 ? (
											course.chapters.map((ch) => (
												<label key={ch.id} className="flex items-center gap-2 text-sm">
													<input
														type="checkbox"
														checked={!!ch.done}
														onChange={() => toggleChapter(course.id, ch.id)}
														className="w-4 h-4"
													/>
													<span className={ch.done ? 'line-through text-slate-400' : ''}>{ch.title}</span>
												</label>
											))
										) : (
											<div className="text-sm text-slate-500">Aucun chapitre</div>
										)}
									</div>
								</div>

								<div className="flex flex-col items-end gap-2">
									<button onClick={() => removeCourse(course.id)} className="text-red-600 hover:underline text-sm">Supprimer</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Ajouter un cours — formulaire */}
			{showForm && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
						<h2 className="text-xl font-semibold mb-4">Nouveau cours</h2>
						<label className="block mb-2 text-sm">Nom du cours</label>
						<input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 px-3 py-2 rounded border dark:bg-slate-800" />

						<label className="block mb-2 text-sm">Ajouter des chapitres</label>
						<div className="flex gap-2 mb-3">
							<input value={chapterInput} onChange={(e) => setChapterInput(e.target.value)} className="flex-1 px-3 py-2 rounded border dark:bg-slate-800" placeholder="Titre du chapitre" />
							<button onClick={addChapter} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded">Ajouter</button>
						</div>

						<div className="mb-4 space-y-2 max-h-40 overflow-auto">
							{chapters.map((ch) => (
								<div key={ch.id} className="text-sm flex items-center justify-between">
									<div>{ch.title}</div>
								</div>
							))}
						</div>

						<div className="flex items-center justify-end gap-2">
							<button onClick={() => { setShowForm(false); setName(''); setChapters([]); setChapterInput(''); }} className="px-3 py-2 rounded">Annuler</button>
							<button onClick={createCourse} className="px-4 py-2 bg-blue-600 text-white rounded">Créer</button>
						</div>
					</div>
				</div>
			)}


			{courses.length > 0 && (
				<div className="fixed bottom-6 right-6">
					<button onClick={() => setShowForm(true)} className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow">+</button>
				</div>
			)}
		</div>
	);
};

export default Cours;
