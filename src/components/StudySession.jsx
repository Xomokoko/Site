import { Clock, BookOpen, Calendar } from 'lucide-react';
import { formatDuration, formatDate } from '../utils/dateHelpers';

const StudySession = ({ session }) => {
  const subjectColors = {
    'Algo': 'from-blue-500 to-cyan-600',
    'Ethnomusicologie': 'from-purple-500 to-pink-600',
    'Gestion de personne': 'from-green-500 to-emerald-600',
    'Proba et stats': 'from-teal-500 to-green-600',
    'Java': 'from-amber-500 to-orange-600',
    'Stats et data science': 'from-lime-500 to-green-600',
    'default': 'from-slate-500 to-gray-600'
  };

  const getSubjectColor = (subject) => {
    return subjectColors[subject] || subjectColors.default;
  };

  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Subject indicator */}
        <div className={`p-3 rounded-xl bg-gradient-to-br ${getSubjectColor(session.subject)} text-white shadow-lg flex-shrink-0`}>
          <BookOpen className="w-6 h-6" />
        </div>

        {/* Session details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-800 mb-1 truncate">
            {session.subject || 'Session d\'étude'}
          </h3>
          
          {session.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formatDuration(session.duration)}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(session.date, 'dd MMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Duration badge */}
        <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
          {formatDuration(session.duration)}
        </div>
      </div>

      {/* Progress bar (optional) */}
      {session.progress !== undefined && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Progression</span>
            <span className="font-semibold">{session.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getSubjectColor(session.subject)} rounded-full transition-all duration-500`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySession;