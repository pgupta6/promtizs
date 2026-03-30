import { Zap, LogOut, History, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onHistoryClick?: () => void;
  showHistory?: boolean;
}

export function Header({ onHistoryClick, showHistory }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Promt<span className="text-primary-400">izS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showHistory
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-300 hidden sm:inline">{user.full_name || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="text-gray-400 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
