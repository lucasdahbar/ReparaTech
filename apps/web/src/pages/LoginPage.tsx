import { FormEvent, useState } from 'react';

import { login } from '../lib/api';
import type { Sessao } from '../types';

type LoginPageProps = {
  onLogin: (sessao: Sessao) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const enviarLogin = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const sessao = await login(email, senha);
      onLogin({
        usuario: sessao.usuario,
        token: sessao.token
      });
    } catch (erroLogin) {
      setErro(erroLogin instanceof Error ? erroLogin.message : 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="login-shell">
      <form className="panel-card form-card login-card" onSubmit={enviarLogin}>
        <div>
          <span className="eyebrow">Acesso interno</span>
          <h1>ReparaTech</h1>
          <p className="helper-text">Entre como administrador, atendente, técnico ou cliente.</p>
        </div>

        <div className="form-grid">
          <label className="full-width">
            <span>E-mail *</span>
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="cliente@demo.com"
              required
            />
          </label>

          <label className="full-width">
            <span>Senha *</span>
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>
        </div>

        <button type="submit" className="button-primary" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        {erro ? <div className="feedback error">{erro}</div> : null}

        <div className="login-demo">
          <strong>Usuários demo</strong>
          <span>cliente@demo.com / cliente123</span>
          <span>atendente@demo.com / atendente123</span>
          <span>tecnico@demo.com / tecnico123</span>
          <span>admin@demo.com / admin123</span>
        </div>
      </form>
    </main>
  );
}
