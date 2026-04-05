'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/assignments',  label: 'Assignments', icon: ClipboardList   },
  { href: '/lessons',      label: 'Lessons',     icon: BookOpen        },
  { href: '/settings',     label: 'Settings',    icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-slate-100 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">ELE 212</div>
            <div className="text-xs text-slate-400 leading-tight">Circuit Theory</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Spring 2026</p>
        <p className="text-xs text-slate-400">Prof. Swaszek · URI</p>
      </div>
    </aside>
  );
}
