import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const $ = (sel) => document.querySelector(sel);
const msgBox = $('#msg');

function showMsg(text, type='erro') {
  if (!msgBox) { alert(text); return; }
  msgBox.textContent = text;
  msgBox.style.display = 'block';
  msgBox.style.background = type === 'ok' ? '#e8f7ee' : '#fde8e8';
  msgBox.style.color = type === 'ok' ? '#0f5132' : '#842029';
  msgBox.style.border = '1px solid ' + (type === 'ok' ? '#badbcc' : '#f5c2c7');
}

function t(err) {
  const m = String(err?.code || err?.message || err);
  if (m.includes('auth/invalid-api-key') || m.includes('api-key-not-valid')) return 'API key inválida. Verifique o firebaseConfig no firebase-init.js.';
  if (m.includes('auth/invalid-email')) return 'E-mail inválido.';
  if (m.includes('auth/missing-password')) return 'Digite a senha.';
  if (m.includes('auth/weak-password')) return 'Senha fraca (mín. 6).';
  if (m.includes('auth/email-already-in-use')) return 'E-mail já cadastrado. Use Entrar.';
  if (m.includes('auth/invalid-credential') || m.includes('auth/wrong-password')) return 'E-mail ou senha incorretos.';
  if (m.includes('auth/too-many-requests')) return 'Muitas tentativas. Tente novamente em alguns minutos.';
  if (m.includes('auth/unauthorized-domain')) return 'Domínio não autorizado. Adicione macrolirio.github.io nos Domínios autorizados.';
  return m;
}

// Sinais de vida
console.log("app-auth.js carregado");

// ENTRAR
$('#btn-entrar')?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    showMsg('Entrando...', 'ok');
    const email = $('#login-email')?.value || '';
    const senha = $('#login-senha')?.value || '';
    await signInWithEmailAndPassword(auth, email, senha);
    showMsg('Login ok! Redirecionando...', 'ok');
    window.location.href = './project.html';
  } catch (err) {
    console.error(err);
    showMsg('Erro ao entrar: ' + t(err));
  }
});

// ESQUECI A SENHA
$('#btn-esqueci')?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const email = $('#login-email')?.value || '';
    if (!email) { showMsg('Digite seu e-mail para receber o link.'); return; }
    await sendPasswordResetEmail(auth, email);
    showMsg('Enviamos um link de redefinição para: ' + email, 'ok');
  } catch (err) {
    console.error(err);
    showMsg('Erro ao enviar e-mail: ' + t(err));
  }
});

// CADASTRO
$('#btn-cadastrar')?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    showMsg('Criando conta...', 'ok');
    const email = $('#cad-email')?.value || '';
    const senha = $('#cad-senha')?.value || '';
    await createUserWithEmailAndPassword(auth, email, senha);
    showMsg('Conta criada! Agora faça login.', 'ok');
  } catch (err) {
    console.error(err);
    showMsg('Erro ao criar conta: ' + t(err));
  }
});

// LOGOUT (na página protegida)
$('#btn-sair')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = './index.html';
});

// Protege project.html
onAuthStateChanged(auth, (user) => {
  const naProject = location.pathname.endsWith('/project.html') || location.href.includes('project.html');
  if (naProject && !user) window.location.href = './index.html';
});
