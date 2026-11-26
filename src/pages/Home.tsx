import React, { useEffect, useState } from 'react';
import { Scissors, Calendar, ShieldCheck, Clock, CheckCircle2, Star, ArrowRight, User } from 'lucide-react';
import { getServices, createAppointment, Service } from '../services/barbershop';

export function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !name || !date) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await createAppointment({
        customer_name: name,
        customer_phone: phone,
        date,
        status: 'pending',
        service_id: selectedService
      });
      setSuccess(true);
    } catch (err) {
      alert('Erro ao realizar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">BarberSaaS</span>
          </div>
          <a
            href="/admin/login"
            className="text-sm font-medium text-neutral-600 hover:text-black transition"
          >
            Área do Barbeiro
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-6">
            <Star className="w-3.5 h-3.5 fill-black text-black" /> Barbearia Premium & Moderna
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Estilo e precisão em cada corte.
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Agende seu horário online em segundos. Profissionais altamente qualificados, ambiente sofisticado e atendimento impecável.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#agendar"
              className="px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-neutral-800 transition flex items-center gap-2"
            >
              Agendar Horário <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-3 px-4 py-2 border border-neutral-200 rounded-xl bg-white">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="User" />
              </div>
              <div className="text-xs font-medium">
                <p className="font-bold text-black">+1.500 Clientes</p>
                <p className="text-neutral-500">Satisfeitos este mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card Form */}
        <div id="agendar" className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Agende seu Atendimento</h2>
          <p className="text-sm text-neutral-500 mb-6">Escolha o serviço e o melhor horário para você.</p>

          {success ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Agendamento Confirmado!</h3>
              <p className="text-sm text-neutral-600 mb-6">Aguardamos você na barbearia no horário marcado.</p>
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-lg text-sm transition"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Serviço</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  required
                >
                  <option value="">Selecione um serviço...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — R$ {s.price} ({s.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Seu Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-neutral-800 transition text-sm disabled:opacity-50"
              >
                {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-8 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} BarberSaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}