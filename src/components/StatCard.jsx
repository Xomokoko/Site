import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1">{title}</p>
        <p className="text-3xl font-bold font-display text-slate-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;