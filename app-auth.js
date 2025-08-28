// Utils
function $(sel){ return document.querySelector(sel) }
function show(el){ el.classList.remove('hidden') }
function hide(el){ el.classList.add('hidden') }

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const logoutLink = document.getElementById('logoutLink');
const goProjects = document.getElementById('goProjects');

async function getUserRole(uid){
  if(!uid) return null;
  try{
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data().role || 'user' : 'user';
  }catch(e){
    console.error('role error', e); 
    return 'user';
  }
}

auth.onAuthStateChanged(async (user)=>{
  const emailEl = $('#userEmail'), uidEl = $('#userUid'), roleEl = $('#userRole');
  if(user){
    if(logoutLink) show(logoutLink);
    if(goProjects) show(goProjects);
    if(emailEl) emailEl.textContent = user.email;
    if(uidEl) uidEl.textContent = user.uid;

    // garante que o doc de usuário exista
    const ref = db.collection('users').doc(user.uid);
    const snap = await ref.get();
    if(!snap.exists){
      await ref.set({ email: user.email, role: 'user', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    }
    const role = await getUserRole(user.uid);
    if(roleEl) roleEl.textContent = role;

  }else{
    if(emailEl) emailEl.textContent = '—';
    if(uidEl) uidEl.textContent = '—';
    if(roleEl) roleEl.textContent = 'desconhecido';
    if(logoutLink) hide(logoutLink);
    if(goProjects) hide(goProjects);
  }
});

if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPassword').value;
    try{
      await auth.signInWithEmailAndPassword(email, pass);
      alert('Login ok!'); 
    }catch(err){
      alert('Erro ao entrar: '+ err.message);
    }
  });
}

if(signupForm){
  signupForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const pass  = document.getElementById('signupPassword').value;
    try{
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      await db.collection('users').doc(cred.user.uid).set({
        email, role:'user', createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Conta criada! Faça login se necessário.');
    }catch(err){
      alert('Erro ao criar conta: '+ err.message);
    }
  });
}

if(logoutLink){
  logoutLink.addEventListener('click', async (e)=>{
    e.preventDefault();
    await auth.signOut();
    alert('Você saiu.');
  });
}

if(goProjects){
  goProjects.addEventListener('click', ()=> location.href = './projects.html');
}
