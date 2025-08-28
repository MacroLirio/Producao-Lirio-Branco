function $(s){ return document.querySelector(s) }
function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild }
const logoutLink = document.getElementById('logoutLink');
logoutLink?.addEventListener('click', async (e)=>{ e.preventDefault(); await auth.signOut(); location.href='./index.html' });

// Tabs
document.querySelectorAll('[data-tab]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const hash = a.getAttribute('href');
    history.replaceState(null,'',hash);
    renderTab(hash.substring(1));
    document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
  });
});

const params = new URLSearchParams(location.search);
const projectId = params.get('id');
if(!projectId){ alert('Projeto não informado'); location.href='./projects.html' }

let isAdmin = false;
let isOwner = false;
let projectRef = null;

auth.onAuthStateChanged(async (user)=>{
  if(!user){ alert('Faça login'); location.href='./index.html'; return }
  projectRef = db.collection('projects').doc(projectId);
  const [projSnap, userSnap] = await Promise.all([projectRef.get(), db.collection('users').doc(user.uid).get()]);
  const p = projSnap.data();
  if(!p){ alert('Projeto não existe'); location.href='./projects.html'; return }
  $('#projTitle').textContent = p.name || '(sem nome)';
  isOwner = (p.ownerUid === user.uid);
  isAdmin = (userSnap.data()?.role === 'admin');

  if(isAdmin){ $('#financeTab')?.classList.remove('hidden') }

  renderTab((location.hash || '#geral').substring(1));
  document.querySelectorAll('[data-tab]').forEach(x=>{
    if(x.getAttribute('href') === (location.hash || '#geral')) x.classList.add('active');
  });
});

const tabContent = document.getElementById('tabContent');

function renderTab(tab){
  if(tab === 'geral') return renderGeral();
  if(tab === 'atividades') return renderAtividades();
  if(tab === 'cronograma') return renderCronograma();
  if(tab === 'locais') return renderLocais();
  if(tab === 'financeiro') return renderFinanceiro();
  tabContent.innerHTML = '<p>Tab desconhecida.</p>';
}

async function renderGeral(){
  const doc = await projectRef.get();
  const p = doc.data();
  tabContent.innerHTML = `
    <div class="row">
      <div>
        <label>Nome</label>
        <input id="g_name" value="${p.name||''}">
      </div>
      <div>
        <label>Cliente</label>
        <input id="g_client" value="${p.client||''}">
      </div>
    </div>
    <label>Descrição</label>
    <textarea id="g_desc" rows="4">${p.desc||''}</textarea>
    <button id="g_save">Salvar alterações</button>
  `;
  $('#g_save').addEventListener('click', async ()=>{
    try{
      await projectRef.update({
        name: $('#g_name').value.trim(),
        client: $('#g_client').value.trim(),
        desc: $('#g_desc').value.trim()
      });
      alert('Atualizado!');
    }catch(err){ alert('Erro: '+err.message) }
  });
}

function listSub(path, renderRow){
  return projectRef.collection(path).orderBy('createdAt','desc').onSnapshot((snap)=>{
    const tbody = $('#list_'+path+' tbody');
    tbody.innerHTML='';
    snap.forEach(doc=>{
      tbody.appendChild(renderRow(doc.id, doc.data()));
    });
  });
}

let unsubActs, unsubSched, unsubLocs, unsubFinBud, unsubFinExp;

function renderAtividades(){
  tabContent.innerHTML = `
    <div class="row">
      <div class="card">
        <h2>Nova Atividade</h2>
        <label>Título</label><input id="a_title">
        <label>Responsável</label><input id="a_owner">
        <label>Data</label><input id="a_date" type="date">
        <label>Descrição</label><textarea id="a_desc" rows="3"></textarea>
        <button id="a_add">Adicionar</button>
      </div>
      <div class="card">
        <h2>Lista de Atividades</h2>
        <table class="table" id="list_activities"><thead><tr><th>Título</th><th>Resp.</th><th>Data</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
  `;
  $('#a_add').addEventListener('click', async ()=>{
    try{
      await projectRef.collection('activities').add({
        title: $('#a_title').value.trim(),
        owner: $('#a_owner').value.trim(),
        date: $('#a_date').value,
        desc: $('#a_desc').value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      $('#a_title').value = $('#a_owner').value = $('#a_date').value = $('#a_desc').value = '';
    }catch(err){ alert('Erro: '+err.message) }
  });
  unsubActs?.(); // cancel previous listener
  unsubActs = listSub('activities',(id,d)=> el(`<tr><td>${d.title||''}</td><td>${d.owner||''}</td><td>${d.date||''}</td></tr>`));
}

function renderCronograma(){
  tabContent.innerHTML = `
    <div class="row">
      <div class="card">
        <h2>Nova Etapa</h2>
        <label>Marco</label><input id="s_milestone">
        <label>Início</label><input id="s_start" type="date">
        <label>Fim</label><input id="s_end" type="date">
        <button id="s_add">Adicionar</button>
      </div>
      <div class="card">
        <h2>Cronograma</h2>
        <table class="table" id="list_schedule"><thead><tr><th>Marco</th><th>Início</th><th>Fim</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
  `;
  $('#s_add').addEventListener('click', async ()=>{
    try{
      await projectRef.collection('schedule').add({
        milestone: $('#s_milestone').value.trim(),
        start: $('#s_start').value,
        end: $('#s_end').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      $('#s_milestone').value = $('#s_start').value = $('#s_end').value = '';
    }catch(err){ alert('Erro: '+err.message) }
  });
  unsubSched?.();
  unsubSched = listSub('schedule',(id,d)=> el(`<tr><td>${d.milestone||''}</td><td>${d.start||''}</td><td>${d.end||''}</td></tr>`));
}

function renderLocais(){
  tabContent.innerHTML = `
    <div class="row">
      <div class="card">
        <h2>Novo Local</h2>
        <label>Nome do local</label><input id="l_name">
        <label>Endereço</label><input id="l_address">
        <button id="l_add">Adicionar</button>
      </div>
      <div class="card">
        <h2>Locais</h2>
        <table class="table" id="list_locations"><thead><tr><th>Local</th><th>Endereço</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
  `;
  $('#l_add').addEventListener('click', async ()=>{
    try{
      await projectRef.collection('locations').add({
        name: $('#l_name').value.trim(),
        address: $('#l_address').value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      $('#l_name').value = $('#l_address').value = '';
    }catch(err){ alert('Erro: '+err.message) }
  });
  unsubLocs?.();
  unsubLocs = listSub('locations',(id,d)=> el(`<tr><td>${d.name||''}</td><td>${d.address||''}</td></tr>`));
}

function renderFinanceiro(){
  if(!isAdmin){
    tabContent.innerHTML = '<p>Somente administradores podem ver o Financeiro.</p>';
    return;
  }
  tabContent.innerHTML = `
    <div class="row">
      <div class="card">
        <h2>Orçamento (Receitas)</h2>
        <label>Descrição</label><input id="f_b_desc">
        <label>Valor (R$)</label><input id="f_b_value" type="number" step="0.01">
        <button id="f_b_add">Adicionar receita</button>
        <table class="table" id="list_finance_budget"><thead><tr><th>Descrição</th><th>Valor</th></tr></thead><tbody></tbody></table>
      </div>
      <div class="card">
        <h2>Despesas</h2>
        <label>Descrição</label><input id="f_e_desc">
        <label>Valor (R$)</label><input id="f_e_value" type="number" step="0.01">
        <button id="f_e_add">Adicionar despesa</button>
        <table class="table" id="list_finance_expense"><thead><tr><th>Descrição</th><th>Valor</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
  `;

  $('#f_b_add').addEventListener('click', async ()=>{
    try{
      await projectRef.collection('finance').add({
        kind:'budget', desc: $('#f_b_desc').value.trim(),
        value: parseFloat($('#f_b_value').value||'0'),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      $('#f_b_desc').value = $('#f_b_value').value = '';
    }catch(err){ alert('Erro: '+err.message) }
  });
  $('#f_e_add').addEventListener('click', async ()=>{
    try{
      await projectRef.collection('finance').add({
        kind:'expense', desc: $('#f_e_desc').value.trim(),
        value: parseFloat($('#f_e_value').value||'0'),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      $('#f_e_desc').value = $('#f_e_value').value = '';
    }catch(err){ alert('Erro: '+err.message) }
  });

  unsubFinBud?.();
  unsubFinExp?.();
  const renderRow = (d)=> el(`<tr><td>${d.desc||''}</td><td>R$ ${Number(d.value||0).toFixed(2)}</td></tr>`);
  db.collection('projects').doc(projectId).collection('finance')
    .where('kind','==','budget').orderBy('createdAt','desc')
    .onSnapshot((snap)=>{
      const tbody = $('#list_finance_budget tbody'); tbody.innerHTML='';
      snap.forEach(doc=> tbody.appendChild(renderRow(doc.data())) );
    });
  db.collection('projects').doc(projectId).collection('finance')
    .where('kind','==','expense').orderBy('createdAt','desc')
    .onSnapshot((snap)=>{
      const tbody = $('#list_finance_expense tbody'); tbody.innerHTML='';
      snap.forEach(doc=> tbody.appendChild(renderRow(doc.data())) );
    });
}
