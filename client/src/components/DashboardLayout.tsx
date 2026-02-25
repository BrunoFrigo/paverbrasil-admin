import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  StickyNote,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const logoutMutation = trpc.auth.logout.useMutation();
  const { data: user } = trpc.auth.me.useQuery();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logout realizado com sucesso!');
      setLocation('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Clientes', icon: Users, href: '/clientes' },
    { label: 'Produtos', icon: Package, href: '/produtos' },
    { label: 'Pedidos', icon: FileText, href: '/pedidos' },
    { label: 'Anotações', icon: StickyNote, href: '/anotacoes' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">PB</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">PaverBrasil</h1>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-foreground">{user?.name || 'Administrador'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4" />
            {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-foreground"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex-1 ml-4">
            <h2 className="text-lg font-semibold text-foreground">PaverBrasil Admin</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
