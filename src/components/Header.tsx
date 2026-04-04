import { LogOut, History, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onHistoryClick?: () => void;
  showHistory?: boolean;
  onSignIn?: () => void;
  onLogoClick?: () => void;
}

export function Header({ onHistoryClick, showHistory, onSignIn, onLogoClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-slate-950/70 backdrop-blur-xl shadow-lg shadow-black/10 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <span className="text-white font-extrabold text-sm leading-none">P</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Promt<span className="gradient-text">izS</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          {user && onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showHistory
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
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
                  <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full ring-2 ring-white/10" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-300 hidden sm:inline">{user.full_name || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="text-gray-500 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : onSignIn ? (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-1.5 gradient-btn text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-px"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
