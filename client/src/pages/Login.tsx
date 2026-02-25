import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = trpc.auth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        toast.success('Login realizado com sucesso!');
        setLocation('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card className="border-border">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">PB</span>
              </div>
            </div>
            <CardTitle className="text-2xl">PaverBrasil Admin</CardTitle>
            <CardDescription>Acesso exclusivo para administradores</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  Usuário
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-card border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-card border-border text-foreground"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Credenciais de demonstração:
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Usuário: <span className="font-mono">claudineifrigo</span>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Senha: <span className="font-mono">paverbrasil2026</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
