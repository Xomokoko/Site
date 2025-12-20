import { useState } from 'react';
import { Check, Trash2, Plus, Circle } from 'lucide-react';

const TodoList = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask({
        title: newTask,
        subject: newTaskSubject
      });
      setNewTask('');
      setNewTaskSubject('');
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-white">
        Mes tâches
      </h2>

      {/* Add task form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="input-field"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskSubject}
              onChange={(e) => setNewTaskSubject(e.target.value)}
              placeholder="Matière (optionnel)"
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </button>
          </div>
        </div>
      </form>

      {/* Pending tasks */}
      {pendingTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-200 mb-3 uppercase tracking-wider">
            À faire ({pendingTasks.length})
          </h3>

          
          <div className="space-y-2">
            {pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-200 mb-3 uppercase tracking-wider">
            Terminées ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Circle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        </div>
      )}
    </div>
  );
};

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 group ${
        task.completed
          ? 'bg-slate-50 border-slate-200'
          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        {task.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium transition-all duration-300 ${
            task.completed
              ? 'text-slate-400 line-through'
              : 'text-slate-700'
          }`}
        >
          {task.title}
        </p>
        {task.subject && (
          <p className="text-xs text-slate-500 mt-1">
            {task.subject}
          </p>
        )}
      </div>

      <button
        onClick={onDelete}
        className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TodoList;