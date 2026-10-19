(() => {
  const config = window.SITE_CONFIG || { telegramUrl: "https://t.me/", apps: [] };
  const grid = document.getElementById("appGrid"), search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter"), empty = document.getElementById("emptyState");
  const count = document.getElementById("appCount"), dialog = document.getElementById("appDialog");
  const dialogContent = document.getElementById("dialogContent");
  const labels = {games:"ألعاب",tools:"أدوات",mods:"مودات",apps:"تطبيقات"};
  const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const tg = /^https:\/\/t\.me\/[A-Za-z0-9_]+\/?$/.test(config.telegramUrl||"") ? config.telegramUrl : "https://t.me/";
  document.querySelectorAll(".telegram").forEach(a=>a.href=tg);
  document.getElementById("year").textContent = new Date().getFullYear();
  function icon(app){return app.iconUrl&&/^https:\/\//i.test(app.iconUrl)?`<img src="${esc(app.iconUrl)}" alt="" loading="lazy">`:esc((app.iconText||app.name||"B").slice(0,1).toUpperCase())}
  function render(){
    const term=search.value.trim().toLocaleLowerCase();
    const filtered=(config.apps||[]).filter(a=>[a.name,a.description,labels[a.category],a.version].join(" ").toLocaleLowerCase().includes(term)&&(category.value==="all"||a.category===category.value));
    count.textContent=`${filtered.length} تطبيق`; empty.hidden=filtered.length>0;
    grid.innerHTML=filtered.map(a=>`<article class="app-card"><div class="app-top"><div class="app-icon">${icon(a)}</div><div><div class="app-name">${esc(a.name)}</div><div class="app-category">${esc(labels[a.category]||"تطبيق")}</div></div></div><p class="app-desc">${esc(a.description||"لا يوجد وصف بعد.")}</p><div class="meta"><span class="pill">v${esc(a.version||"—")}</span><span class="pill">${esc(a.size||"الحجم غير محدد")}</span><span class="pill">${esc(a.updated||"—")}</span></div><div class="card-actions"><button class="button details" data-details="${esc(a.id)}">التفاصيل</button>${a.downloadUrl&&/^https:\/\//i.test(a.downloadUrl)?`<a class="button download" href="${esc(a.downloadUrl)}" target="_blank" rel="noopener">تحميل APK ↓</a>`:`<button class="button download" data-details="${esc(a.id)}">رابط التحميل قريبًا</button>`}</div></article>`).join("");
  }
  function details(id){
    const a=(config.apps||[]).find(x=>x.id===id); if(!a)return;
    const changes=Array.isArray(a.changelog)?a.changelog:[];
    dialogContent.innerHTML=`<div class="dialog-icon">${icon(a)}</div><h2 class="dialog-title">${esc(a.name)}</h2><div class="app-category">${esc(labels[a.category]||"تطبيق")} · الإصدار ${esc(a.version||"—")}</div><p class="dialog-desc">${esc(a.description||"")}</p><div class="meta"><span class="pill">الحجم: ${esc(a.size||"غير محدد")}</span><span class="pill">التحديث: ${esc(a.updated||"—")}</span></div><div class="version-list"><b>سجل التحديثات</b>${changes.length?changes.map((x,i)=>`<div class="version-row"><span>${esc(x)}</span><span>${i===0?"الأحدث":""}</span></div>`).join(""):"<p class='dialog-desc'>لا توجد تفاصيل تحديثات بعد.</p>"}</div><div class="notice">تحقق من مصدر الملف وأذوناته قبل التثبيت. لا تثبّت APK لا تثق به.</div>${a.downloadUrl&&/^https:\/\//i.test(a.downloadUrl)?`<a class="button primary" style="margin-top:16px;width:100%" href="${esc(a.downloadUrl)}" target="_blank" rel="noopener">تحميل APK ↓</a>`:"<p class='dialog-desc'>لم تتم إضافة رابط تنزيل لهذا التطبيق بعد.</p>"}`;
    if(typeof dialog.showModal==="function")dialog.showModal();
  }
  grid.addEventListener("click",e=>{const b=e.target.closest("[data-details]");if(b)details(b.dataset.details)});
  search.addEventListener("input",render); category.addEventListener("change",render); render();
})();