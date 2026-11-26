import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AUTH_STORAGE_KEY } from '../../lib/constants';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      await supabase.rpc('claim_generated_app_admin');
      const { data: role } = await supabase.rpc('generated_app_role');

      if (role !== 'admin') {
        setError('Acesso negado. Apenas administradores.');
        setLoading(false);
        return;
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data?.session || { token: 'mock-token' }));
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">BarberSaaS Admin</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">Área Restrita</h1>
        <p className="text-sm text-neutral-500 mb-6">Entre com sua conta para gerenciar a barbearia.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barbershop.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-neutral-800 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-neutral-500 hover:text-black transition">
            ← Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
}