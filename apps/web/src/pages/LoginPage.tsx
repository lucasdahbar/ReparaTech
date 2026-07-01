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
      setErro(erroLogin instanceof Error ? erroLogin.message : 'Nao foi possivel realizar o login.');
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
          <p className="helper-text">Entre como administrador, atendente ou tecnico. A consulta do cliente continua publica.</p>
        </div>

        <div className="form-grid">
          <label className="full-width">
            <span>E-mail *</span>
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="tecnico@repairatech.local"
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
          <strong>Usuarios demo</strong>
          <span>admin@repairatech.local / admin123</span>
          <span>atendente@repairatech.local / atendente123</span>
          <span>tecnico@repairatech.local / tecnico123</span>
        </div>
      </form>
    </main>
  );
}
