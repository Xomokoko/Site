import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Calendar, Clock, BookOpen, Target } from 'lucide-react';

const PlanningWizard = ({ onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    courses: [],
    courseName: '',
    courseHours: 1,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    coursesPerDay: 2,
    daysOfWeek: {
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: false,
      dimanche: false
    }
  });

  const addCourse = () => {
    if (formData.courseName.trim()) {
      setFormData({
        ...formData,
        courses: [...formData.courses, {
          name: formData.courseName,
          hours: formData.courseHours
        }],
        courseName: '',
        courseHours: 1
      });
    }
  };

  const removeCourse = (index) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter((_, i) => i !== index)
    });
  };

  const toggleDay = (day) => {
    setFormData({
      ...formData,
      daysOfWeek: {
        ...formData.daysOfWeek,
        [day]: !formData.daysOfWeek[day]
      }
    });
  };

  const handleGenerate = () => {
    onGenerate(formData);
    onClose();
  };

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
              Créer mon planning
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Étape {step} sur {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Courses */}
          {step === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Quels cours voulez-vous étudier ?
                  </h3>
                </div>
              </div>

              {/* Add Course Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Nom du cours
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addCourse()}
                    placeholder="Ex: Mathématiques, Physique..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Nombre d'heures à étudier
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.courseHours}
                    onChange={(e) => setFormData({ ...formData, courseHours: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={addCourse}
                  className="btn-primary w-full"
                  disabled={!formData.courseName.trim()}
                >
                  + Ajouter le cours
                </button>
              </div>

              {/* Course List */}
              {formData.courses.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    Cours ajoutés ({formData.courses.length})
                  </h4>
                  {formData.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-blue-50 dark:bg-slate-700 rounded-xl"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {course.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {course.hours}h d'étude
                        </div>
                      </div>
                      <button
                        onClick={() => removeCourse(index)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Total: {formData.courses.reduce((sum, c) => sum + c.hours, 0)} heures
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date Range */}
          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Sur quelle période ?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Définissez vos dates de début et de fin
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Days of Week */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
                  Jours disponibles pour étudier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(formData.daysOfWeek).map(([day, selected]) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`p-3 rounded-xl font-medium transition-all ${
                        selected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Time Slots */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Quels horaires préférez-vous ?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Définissez votre plage horaire quotidienne
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Préférences d'étude
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Combien de matières par jour ?
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Nombre de matières par jour
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.coursesPerDay}
                  onChange={(e) => setFormData({ ...formData, coursesPerDay: parseInt(e.target.value) })}
                  className="input-field"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Recommandé: 2-3 matières par jour pour une meilleure concentration
                </p>
              </div>

              {/* Summary */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-700 rounded-xl">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">
                  📋 Récapitulatif
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• {formData.courses.length} cours à planifier</li>
                  <li>• {formData.courses.reduce((sum, c) => sum + c.hours, 0)} heures d'étude au total</li>
                  <li>• Du {formData.startDate} au {formData.endDate}</li>
                  <li>• De {formData.startTime} à {formData.endTime}</li>
                  <li>• {formData.coursesPerDay} matière(s) par jour</li>
                  <li>• {Object.values(formData.daysOfWeek).filter(Boolean).length} jours par semaine</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Précédent
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && formData.courses.length === 0) ||
                (step === 2 && (!formData.startDate || !formData.endDate))
              }
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="btn-primary flex items-center gap-2"
            >
              Générer mon planning
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningWizard;