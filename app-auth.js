import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Pegando elementos da página
const loginEmail   = document.querySelector('#login-email');
const loginSenha   = document.querySelector('#login-senha');
const btnEntrar    = document.querySelector('#btn-entrar');
const btnEsqueci   = document.querySelector('#btn-esqueci');   // novo

const cadEmail     = document.querySelector('#cad-email');
const cadSenha     = document.querySelector('#cad-senha');
const btnCadastrar = document.querySelector('#btn-cadastrar');

const msg          = document.querySelector('#msg');            // área de mensagens

function mostraMsg(texto, tipo='erro') {
  if (!msg) { alert(texto); return; }
  msg.textContent = texto;
  msg.style.display = 'block';
  msg.style.background = tipo === 'ok' ? '#e8f7ee' : '#fde8e8';
  msg.style.color = tipo === 'ok' ? '#0f5132' : '#842029';
  msg.style.border = '1px solid ' + (tipo === 'ok' ? '#badbcc' : '#f5c2c7');
}

// Tradução de erros comuns
function traduz(err) {
  const m = String(err?.code || err?.message || err);
  if (m.includes('auth/invalid-email')) return 'E-mail inválido.';
  if (m.includes('auth/missing-password')) return 'Digite a senha.';
  if (m.includes('auth/weak-password')) return 'Senha fraca (mín. 6).';
  if (m.includes('auth/email-already-in-use')) return 'E-mail já cadastrado. Clique em Entrar.';
  if (m.includes('auth/invalid-credential') || m.includes('auth/wrong-password')) return 'E-mail ou senha incorretos.';
  if (m.includes('auth/too-many-requests')) return 'Muitas tentativas. Tente novamente em alguns minutos.';
  if (m.includes('auth/unauthorized-domain')) return 'Domínio não autorizado. Adicione macrolirio.github.io em Authentication → Settings → Authorized domains.';
  return m;
}

// LOGIN
if (btnEntrar) {
  btnEntrar.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      mostraMsg('Entrando...', 'ok');
      await signInWithEmailAndPassword(auth, loginEmail.value, loginSenha.value);
      mostraMsg('Login ok! Redirecionando...', 'ok');
      window.location.href = './project.html';
    } catch (err) {
      console.error(err);
      mostraMsg('Erro ao entrar: ' + traduz(err));
    }
  });
}

// ESQUECI A SENHA
if (btnEsqueci) {
  btnEsqueci.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      if (!loginEmail.value) { mostraMsg('Digite seu e-mail para receber o link.'); return; }
      await sendPasswordResetEmail(auth, loginEmail.value);
      mostraMsg('Enviamos um link de redefinição para: ' + loginEmail.value, 'ok');
    } catch (err) {
      console.error(err);
      mostraMsg('Erro ao enviar e-mail: ' + traduz(err));
    }
  });
}

// CADASTRO
if (btnCadastrar) {
  btnCadastrar.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      mostraMsg('Criando conta...', 'ok');
      await createUserWithEmailAndPassword(auth, cadEmail.value, cadSenha.value);
      mostraMsg('Conta criada! Agora faça login.', 'ok');
    } catch (err) {
      console.error(err);
      mostraMsg('Erro ao criar conta: ' + traduz(err));
    }
  });
}

// LOGOUT (usado no project.html)
const btnSair = document.querySelector('#btn-sair');
if (btnSair) {
  btnSair.addEventListener('click', async () =>
