function $(s){ return document.querySelector(s) }
function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild }

const tableBody = document.querySelector('#projectsTable tbody');
const form = document.getElementById('newProjectForm');
const logoutLink = document.getElementById('logoutLink');

logoutLink?.addEventListener('click', async (e)=>{ e.preventDefault(); await auth.signOut(); location.href='./index.html' });

auth.onAuthStateChanged(async (user)=>{
  if(!user){ alert('Faça login para acessar projetos.'); location.href='./index.html'; return }
  const role = await db.collection('users').doc(user.uid).get().then(d => d.data()?.role || 'user');

  // Listar projetos: se admin, lista todos; senão, apenas do usuário
  let query = db.collection('projects').orderBy('createdAt','desc').limit(50);
  if(role !== 'admin'){
    query = query.where('ownerUid','==',user.uid);
  }
  query.onSnapshot((snap)=>{
    tableBody.innerHTML = '';
    snap.forEach(doc=>{
      const p = doc.data();
      const tr = el(`<tr>
        <td>${p.name || '(sem nome)'}</td>
        <td>${p.client || '-'}</td>
        <td>${p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : '-'}</td>
        <td><a href="./project.html?id=${doc.id}">Abrir</a></td>
      </tr>`);
      tableBody.appendChild(tr);
    });
  });
});

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const user = auth.currentUser;
  if(!user){ alert('Faça login'); return }
  const name = document.getElementById('projectName').value.trim();
  const client = document.getElementById('projectClient').value.trim();
  const desc = document.getElementById('projectDesc').value.trim();
  try{
    const doc = await db.collection('projects').add({
      name, client, desc,
      ownerUid: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    location.href = `./project.html?id=${doc.id}`;
  }catch(err){
    alert('Erro ao criar: '+ err.message);
  }
});
