import { auth } from './firebase-init.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Pega elementos do HTML
const loginEmail   = document.querySelector('#login-email');
const loginSenha   = document.querySelector('#login-senha');
const btnEntrar    = document.querySelector('#btn-entrar');

const cadEmail     = document.querySelector('#cad-email');
const cadSenha     = document.querySelector('#cad-senha');
const btnCadastrar = document.querySelector('#btn-cadastrar');

const btnSair      = document.querySelector('#btn-sair'); // existe no project.html

// LOGIN
if (btnEntrar) {
  btnEntrar.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail.value, loginSenha.value);
      window.location.href = './project.html';
    } catch (err) {
      alert('Erro ao entrar: ' + traduz(err.message));
      console.error(err);
    }
  });
}

// CADASTRO
if (btnCadastrar) {
  btnCadastrar.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, cadEmail.value, cadSenha.value);
      alert('Conta criada! Agora faça login.');
    } catch (err) {
      alert('Erro ao criar conta: ' + traduz(err.message));
      console.error(err);
    }
  });
}

// LOGOUT
if (btnSair) {
  btnSair.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = './index.html';
  });
}

// Protege a página de projetos (só entra logado)
onAuthStateChanged(auth, (user) => {
  const estaNaProject = location.pathname.endsWith('/project.html') || location.href.includes('project.html');
  if (estaNaProject && !user) {
    window.location.href = './index.html';
  }
});

// Mens
