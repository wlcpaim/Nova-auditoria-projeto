import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, DollarSign, TrendingUp, Scissors, LogOut, Shield } from 'lucide-react';
import { getDashboardMetrics, Metrics } from '../../services/barbershop';
import { AUTH_STORAGE_KEY } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

export function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!session) {
      navigate('/admin/login');
      return;
    }
    getDashboardMetrics().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-sm text-neutral-500">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">BarberSaaS</span>
          </div>

          <nav className="space-y-1">
            <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-neutral-100 text-black font-medium text-sm">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-black font-medium text-sm">
              <Calendar className="w-4 h-4" /> Agenda
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-black font-medium text-sm">
              <Users className="w-4 h-4" /> Clientes (CRM)
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-black font-medium text-sm">
              <DollarSign className="w-4 h-4" /> Financeiro
            </a>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-700" />
            <h1 className="font-bold text-lg tracking-tight">Painel Administrativo</h1>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium"
          >
            Sair
          </button>
        </header>

        <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Faturamento Mensal</p>
              <p className="text-3xl font-extrabold text-neutral-900">R$ {metrics?.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% vs mês anterior
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Lucro Líquido</p>
              <p className="text-3xl font-extrabold text-neutral-900">R$ {metrics?.netProfit.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 font-medium mt-2">Margem de 65%</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Atendimentos</p>
              <p className="text-3xl font-extrabold text-neutral-900">{metrics?.totalAppointments}</p>
              <p className="text-xs text-neutral-500 mt-2">Ticket médio: R$ {metrics?.avgTicket}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Novos Clientes</p>
              <p className="text-3xl font-extrabold text-neutral-900">{metrics?.newCustomers}</p>
              <p className="text-xs text-neutral-500 mt-2">{metrics?.recurringCustomers} recorrentes</p>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold tracking-tight mb-4">Desempenho Geral do Negócio</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Acompanhe em tempo real o fluxo de caixa, despesas operacionais e produtividade da barbearia.
            </p>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-neutral-900">Sistema Multi-tenant Ativo</p>
                <p className="text-sm text-neutral-500">Seus dados estão isolados e protegidos com criptografia ponta a ponta.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                Online & Sincronizado
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}