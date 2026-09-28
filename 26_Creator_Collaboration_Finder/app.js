(function() {
  const Data = window.SyndicateData;

  // --- STATE ---
  let state = {
    profile: null,
    shortlist: [],
    savedPitches: [],
    lastRoute: '#/',
    filters: { platform: '', size: '', goal: '', field: '', search: '' },
    sort: 'best',
    setupStep: 1
  };

  function loadState() {
    try {
      const saved = localStorage.getItem('syndicate.v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      }
    } catch (e) {
      console.warn("Storage blocked or unavailable.");
    }
  }

  function saveState() {
    try {
      localStorage.setItem('syndicate.v2', JSON.stringify({
        profile: state.profile,
        shortlist: state.shortlist,
        savedPitches: state.savedPitches,
        lastRoute: location.hash || '#/'
      }));
    } catch (e) {}
    updateHeader();
  }

  // --- UTILS ---
  const el = id => document.getElementById(id);
  
  function updateHeader() {
    const savedEl = el('nav-saved');
    if (savedEl) savedEl.textContent = `Saved (${state.shortlist.length})`;
    const profileEl = el('nav-profile');
    if (profileEl) {
      if (state.profile) {
        const initial = state.profile.name ? state.profile.name.substring(0,1).toUpperCase() : '?';
        profileEl.innerHTML = `<div class="flex items-center gap-8"><div class="avatar bg-sage-10" style="width:24px;height:24px;font-size:11px;color:var(--sage);">${initial}</div><span class="mono mono-11" style="color:var(--text);">${state.profile.name}</span></div>`;
        profileEl.className = 'btn btn-secondary';
        profileEl.style.padding = '4px 12px';
      } else {
        profileEl.textContent = 'Create profile';
        profileEl.className = 'btn btn-secondary';
        profileEl.style.padding = '8px 16px';
      }
    }
  }

  function formatNum(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n;
  }

  function getCategoryTint(field) {
    const sage = ["Technical writing", "Systems engineering", "Game development tooling", "Open-source maintainer", "Data journalism", "Science communication"];
    const clay = ["3D concept art", "Illustration", "Architecture and design", "Ceramics or woodworking", "Motion design", "Typography and lettering"];
    const lavender = ["Audio production", "Video essays", "Synth design", "Game composer"];
    if (sage.includes(field)) return 'sage';
    if (clay.includes(field)) return 'clay';
    if (lavender.includes(field)) return 'lavender';
    return 'sage'; // fallback
  }

  // --- SCORING ENGINE ---
  function getTierMidpoint(sizeLabel) {
    if (sizeLabel.includes('Just starting')) return 3000;
    if (sizeLabel.includes('Growing')) return 12000;
    if (sizeLabel.includes('Established')) return 50000;
    if (sizeLabel.includes('Large')) return 150000;
    return 12000;
  }

  function scoreCreator(user, creator) {
    let breakdown = { field: 0, interests: 0, audience: 0, style: 0, goal: 0 };
    
    // 1. Field (0-30)
    let fieldAdj = 0.2; // distant min floor
    if (user.field === creator.field) {
      fieldAdj = 0.7;
    } else if (Data.fieldAdjacency[user.field] && Data.fieldAdjacency[user.field][creator.field]) {
      fieldAdj = Data.fieldAdjacency[user.field][creator.field];
    } else if (Data.fieldAdjacency[creator.field] && Data.fieldAdjacency[creator.field][user.field]) {
      fieldAdj = Data.fieldAdjacency[creator.field][user.field];
    }
    breakdown.field = fieldAdj * 30;

    // 2. Interests (0-20)
    let overlap = 0;
    const userTags = (user.interests || []).map(t => t.toLowerCase());
    const creatorTags = (creator.interests || []).map(t => t.toLowerCase());
    userTags.forEach(ut => {
      let match = creatorTags.includes(ut);
      if (!match) {
        // Check synonyms
        for (const [key, syns] of Object.entries(Data.synonyms)) {
          if ((key === ut || syns.includes(ut)) && (creatorTags.includes(key) || creatorTags.some(ct => syns.includes(ct)))) {
            match = true; break;
          }
        }
      }
      if (match) overlap++;
    });
    breakdown.interests = Math.max(3, Math.min(20, overlap * 6));

    // 3. Audience (0-20)
    const uSize = getTierMidpoint(user.audienceSize || "Growing (5k to 25k)");
    const cSize = creator.audience;
    const ratio = Math.min(uSize, cSize) / Math.max(uSize, cSize);
    let audScore = ratio * 20;
    if (user.goal === "Swap skills and make something together") {
      audScore = Math.max(audScore, 14); // relaxed
    } else if (user.goal === "Appear as a guest on each other's channel" && cSize < (uSize * 0.3)) {
      audScore = Math.min(audScore, 6); // penalized
    }
    breakdown.audience = audScore;

    // 4. Style (0-15)
    let styleScore = 4.5; // min floor 0.3 * 15
    const uPlat = user.platform || "Substack";
    const cPlat = creator.platform;
    if (uPlat === cPlat) {
      styleScore = 15;
    } else if (Data.platformCompatibility[uPlat] && Data.platformCompatibility[uPlat][cPlat]) {
      styleScore = Data.platformCompatibility[uPlat][cPlat] * 15;
    } else if (Data.platformCompatibility[cPlat] && Data.platformCompatibility[cPlat][uPlat]) {
      styleScore = Data.platformCompatibility[cPlat][uPlat] * 15;
    }
    breakdown.style = styleScore;

    // 5. Goal (0-15)
    let goalScore = 2; // distant
    const uGoal = user.goal || "Reach each other's audiences";
    if (creator.openGoals.includes(uGoal)) {
      goalScore = 15;
    } else {
      goalScore = 6; // adjacent assumption if not exact
    }
    breakdown.goal = goalScore;

    const total = Math.round(breakdown.field + breakdown.interests + breakdown.audience + breakdown.style + breakdown.goal);
    return {
      total: Math.min(100, Math.max(0, total)),
      breakdown: {
        field: Math.round(breakdown.field),
        interests: Math.round(breakdown.interests),
        audience: Math.round(breakdown.audience),
        style: Math.round(breakdown.style),
        goal: Math.round(breakdown.goal)
      }
    };
  }

  function getRankedCreators() {
    // If no profile, use default technical writer
    const profile = state.profile || {
      name: "Guest",
      field: "Technical writing",
      interests: ["documentation", "api design", "rust"],
      audienceSize: "Growing (5k to 25k)",
      platform: "Substack",
      goal: "Publish research or open-source work together"
    };

    let results = Data.creators.map(c => {
      const match = scoreCreator(profile, c);
      return { ...c, match };
    });

    if (state.profile && state.profile.name) {
      results = results.filter(c => c.name !== state.profile.name && c.handle !== state.profile.name);
    }

    results.sort((a, b) => {
      if (b.match.total !== a.match.total) return b.match.total - a.match.total;
      return b.audience - a.audience;
    });

    return results;
  }

  function applyFilters(creatorsList) {
    return creatorsList.filter(c => {
      if (state.filters.field && c.field !== state.filters.field) return false;
      if (state.filters.platform && c.platform !== state.filters.platform) return false;
      if (state.filters.search) {
        const s = state.filters.search.toLowerCase();
        return c.name.toLowerCase().includes(s) || c.handle.toLowerCase().includes(s) || c.field.toLowerCase().includes(s);
      }
      return true;
    });
  }

  // --- RENDERERS ---
  const root = el('app-root');

  function renderCard(c) {
    const isSaved = state.shortlist.includes(c.id);
    const tint = getCategoryTint(c.field);
    return `
      <div class="card">
        <div class="card-top-strip strip-${tint}"></div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-12">
            <div class="avatar bg-${tint}-10">${c.initials}</div>
            <div>
              <div class="weight-500 text-16 truncate max-w-68">${c.name}</div>
              <div class="mono mono-11 color-text-2">${c.handle}</div>
            </div>
          </div>
          <button class="btn-icon" data-action="toggle-save" data-id="${c.id}" aria-pressed="${isSaved}" aria-label="Save ${c.name}" style="width:40px;height:40px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isSaved?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
        </div>
        
        <div class="flex items-center gap-8" style="margin-top:12px;font-size:12px;color:var(--text-3);">
          ${c.platform} ${c.verified ? `&middot; <span class="tint-sage flex items-center gap-4"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Verified</span>` : ''} &middot; ${c.timezone}
        </div>
        
        <div class="text-14 color-text-2 bio-clamp" style="margin-top:12px;">${c.bio}</div>
        
        <div class="flex gap-8" style="margin-top:16px;flex-wrap:wrap;">
          ${c.tags.slice(0,3).map(t => `<span class="tag tag-${tint}">${t}</span>`).join('')}
        </div>
        
        <div class="flex justify-between items-center" style="margin-top:24px;border-top:1px solid var(--line);padding-top:16px;">
          <div><div class="mono text-14">${formatNum(c.audience)}</div><div class="mono mono-11 color-text-3">Followers</div></div>
          <div><div class="mono text-14">${c.cadence.split(' ')[0]}</div><div class="mono mono-11 color-text-3">Posts</div></div>
          <div class="text-right"><div class="mono text-14 tint-sage">${c.match.total}%</div><div class="mono mono-11 color-text-3">Match score</div></div>
        </div>
        
        <div class="text-13 color-text-2" style="margin-top:16px;">
          <strong class="color-text">Why you match:</strong> High overlap in ${c.field.toLowerCase()} with a ${c.match.breakdown.audience}% shared audience score.
        </div>
        
        <div class="flex gap-12 mt-auto" style="margin-top:24px;">
          <button class="btn btn-secondary w-full" data-action="open-drawer" data-id="${c.id}" data-tab="why">See why we match</button>
          <button class="btn btn-primary w-full" data-action="open-drawer" data-id="${c.id}" data-tab="message">Write a message</button>
        </div>
      </div>
    `;
  }

  function renderHome() {
    const topMatches = getRankedCreators().slice(0,3);
    
    root.innerHTML = `
      <section class="section">
        <div class="container flex items-center justify-between gap-48 flex-col-mobile" style="flex-direction:row; flex-wrap:wrap;">
          <div style="flex:1; min-width:300px;">
            <div class="mono mono-11 color-text-3" style="margin-bottom:16px;">For independent creators</div>
            <h1 class="display display-56" style="margin-bottom:24px;">Find the creator you should be working with.</h1>
            <p class="text-16 color-text-2 max-w-68" style="margin-bottom:32px;">Stop guessing who shares your audience. Syndicate scores thousands of creators to find your perfect collaboration partner.</p>
            <div class="flex items-center gap-16 flex-wrap">
              <button class="btn btn-primary" data-action="nav" data-path="#/discover">Find my matches</button>
              <button class="btn btn-secondary" data-action="nav" data-path="#/how-it-works">See how it works</button>
            </div>
          </div>
          <div class="hero-visual" style="flex:1; min-width:300px;">
            <div class="hero-card">
              <div class="flex items-center gap-12 mb-16"><div class="avatar bg-sage-10 tint-sage">MT</div><div class="weight-500">Marcus Thorne</div></div>
              <div class="mono text-20 tint-sage">94% Match score</div>
            </div>
            <div class="hero-card" style="border-color:var(--text-3);">
              <div class="flex items-center gap-12 mb-16"><div class="avatar bg-lavender-10 tint-lavender">JR</div><div class="weight-500">Julian Rossi</div></div>
              <div class="mono text-20 tint-sage">88% Match score</div>
            </div>
            <div class="hero-card">
              <div class="flex items-center gap-12 mb-16"><div class="avatar bg-clay-10 tint-clay">SM</div><div class="weight-500">Sofia Mendes</div></div>
              <div class="mono text-20 tint-sage">82% Match score</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-sage-10">
        <div class="container">
          <h2 class="display display-28 text-center" style="margin-bottom:48px;">Popular matches right now</h2>
          <div class="card-grid">
            ${topMatches.map(renderCard).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="display display-36 text-center" style="margin-bottom:64px;">How it works</h2>
          <div class="flex gap-32 flex-col" style="flex-direction:row; flex-wrap:wrap;">
            <div style="flex:1; min-width:200px;"><div class="mono display-28 tint-sage mb-16">01</div><h3 class="text-16 weight-500 mb-8">Tell us about you</h3><p class="color-text-2 text-14">Takes 2 minutes. No account required.</p></div>
            <div style="flex:1; min-width:200px;"><div class="mono display-28 tint-sage mb-16">02</div><h3 class="text-16 weight-500 mb-8">See your best matches</h3><p class="color-text-2 text-14">Ranked by shared interests and audience size.</p></div>
            <div style="flex:1; min-width:200px;"><div class="mono display-28 tint-sage mb-16">03</div><h3 class="text-16 weight-500 mb-8">Send a message that gets read</h3><p class="color-text-2 text-14">Use our proven message drafts to reach out.</p></div>
          </div>
        </div>
      </section>
      
      <section class="section" style="border-top:1px solid var(--line);">
        <div class="container text-center">
          <h2 class="display display-36 mb-32">Find my matches</h2>
          <button class="btn btn-primary" data-action="nav" data-path="#/discover">Start discovering</button>
        </div>
      </section>
    `;
  }

  function renderDiscover() {
    let creators = getRankedCreators();
    creators = applyFilters(creators);
    
    let banner = '';
    if (!state.profile) {
      banner = `<div class="bg-amber-10 tint-amber" style="padding:12px 32px; font-size:13px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        Showing results for a sample profile. Create your own profile to personalise these.
        <button class="btn btn-secondary" style="min-height:32px;padding:4px 12px;font-size:12px;" data-action="go-profile">Create profile</button>
      </div>`;
    }

    root.innerHTML = `
      ${banner}
      <div class="container section">
        <h1 class="display display-36" style="margin-bottom:8px;">Discover collaborators</h1>
        <p class="color-text-2 text-16" style="margin-bottom:32px;">Results are ranked by match score.</p>
        
        <div class="flex justify-between items-center" style="margin-bottom:24px; flex-wrap:wrap; gap:16px;">
          <div class="flex gap-8 items-center" style="flex-wrap:wrap;">
            <div class="relative">
              <input type="text" class="input" placeholder="Search..." id="search-input" value="${state.filters.search}" style="width:240px;padding-left:36px;" data-action="search-input">
              <svg style="position:absolute;left:12px;top:14px;color:var(--text-3);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            ${state.filters.field || state.filters.search ? `<button class="btn btn-secondary" style="border:none;" data-action="clear-filters">Clear filters</button>` : ''}
          </div>
          <div class="color-text-2 text-14">${creators.length} collaborators</div>
        </div>

        ${creators.length === 0 ? `
          <div class="text-center" style="padding:64px 0;border:1px solid var(--line);border-radius:8px;">
            <div class="text-16 weight-500 mb-16">No collaborators match these filters</div>
            <button class="btn btn-secondary" data-action="clear-filters">Clear filters</button>
          </div>
        ` : `
          <div class="card-grid">
            ${creators.map(renderCard).join('')}
          </div>
        `}
      </div>
    `;
  }

  function renderProfile() {
    if (state.profile && state.profile.name !== "Guest" && state.setupStep === 'done') {
      root.innerHTML = `
        <div class="container section">
          <div style="max-width:600px;margin:0 auto;">
            <h1 class="display display-36" style="margin-bottom:32px;">Your profile</h1>
            <div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:32px;">
              <div class="flex items-center gap-16 mb-32">
                <div class="avatar bg-sage-10 text-20" style="width:64px;height:64px;color:var(--sage);">${state.profile.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div class="text-20 weight-500">${state.profile.name}</div>
                  <div class="color-text-2">${state.profile.field}</div>
                </div>
              </div>
              
              <div class="flex flex-col mb-32">
                <div class="flex justify-between items-start py-16" style="border-top:1px solid var(--line);">
                  <div class="mono mono-11 color-text-3" style="width:120px; flex-shrink:0;">Audience Size</div>
                  <div class="text-14 color-text" style="text-align:right;">${state.profile.audienceSize}</div>
                </div>
                <div class="flex justify-between items-start py-16" style="border-top:1px solid var(--line);">
                  <div class="mono mono-11 color-text-3" style="width:120px; flex-shrink:0;">Interests</div>
                  <div class="flex gap-8 flex-wrap justify-end">${(state.profile.interests||[]).map(t=>`<span class="tag tag-sage">${t}</span>`).join('')}</div>
                </div>
                <div class="flex justify-between items-start py-16" style="border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
                  <div class="mono mono-11 color-text-3" style="width:120px; flex-shrink:0;">Primary Goal</div>
                  <div class="text-14 color-text" style="text-align:right;">${state.profile.goal}</div>
                </div>
              </div>

              <div class="flex gap-12 flex-wrap" style="padding-top:8px;">
                <button class="btn btn-primary" data-action="edit-profile">Edit profile</button>
                <button class="btn btn-secondary" data-action="reset-profile">Reset everything</button>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="container section">
        <div style="max-width:600px;margin:0 auto;">
          <h1 class="display display-36" style="margin-bottom:16px;">Your profile</h1>
          <p class="color-text-2 text-16" style="margin-bottom:32px;">Matches are scored locally from these fields.</p>
          
          <div class="mb-32">
            <div class="mono mono-11 color-text-3 mb-8">Or start from an example</div>
            <div class="flex gap-8 flex-wrap">
              <button class="btn btn-secondary" data-action="preset-profile" data-type="writer" style="font-size:12px;min-height:32px;padding:4px 12px;">Technical writer</button>
              <button class="btn btn-secondary" data-action="preset-profile" data-type="audio" style="font-size:12px;min-height:32px;padding:4px 12px;">Audio producer</button>
              <button class="btn btn-secondary" data-action="preset-profile" data-type="3d" style="font-size:12px;min-height:32px;padding:4px 12px;">3D concept artist</button>
            </div>
          </div>

          <div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:32px;">
            <div id="setup-step-1" class="${state.setupStep === 1 ? '' : 'hidden'}">
              <div class="mono mono-11 color-text-3 mb-16">Step 1 of 3</div>
              <h2 class="text-20 weight-500 mb-24">You</h2>
              <div class="flex flex-col gap-16 mb-24">
                <div>
                  <label class="text-13 color-text-2 mb-4" style="display:block;">Name or handle</label>
                  <input type="text" class="input" id="prof-name" placeholder="e.g. @janedoe" value="${state.profile?.name || ''}">
                  <div class="error-message">Required</div>
                </div>
                <div>
                  <label class="text-13 color-text-2 mb-4" style="display:block;">Main field</label>
                  <select class="input" id="prof-field">
                    <option value="">Select...</option>
                    ${Data.fields.map(f => `<option value="${f}" ${state.profile?.field === f ? 'selected' : ''}>${f}</option>`).join('')}
                  </select>
                  <div class="error-message">Required</div>
                </div>
              </div>
              <button class="btn btn-primary" data-action="profile-next" data-step="2" style="margin-top: 16px;">Next step</button>
            </div>

            <div id="setup-step-2" class="${state.setupStep === 2 ? '' : 'hidden'}">
              <div class="mono mono-11 color-text-3 mb-16">Step 2 of 3</div>
              <h2 class="text-20 weight-500 mb-24">Your audience</h2>
              <div class="flex flex-col gap-16 mb-24">
                <div>
                  <label class="text-13 color-text-2 mb-4" style="display:block;">Audience size</label>
                  <select class="input" id="prof-size">
                    <option value="Just starting (under 5k)">Just starting (under 5k)</option>
                    <option value="Growing (5k to 25k)">Growing (5k to 25k)</option>
                    <option value="Established (25k to 100k)">Established (25k to 100k)</option>
                    <option value="Large (100k+)">Large (100k+)</option>
                  </select>
                </div>
                <div>
                  <label class="text-13 color-text-2 mb-4" style="display:block;">Interests (comma separated)</label>
                  <input type="text" class="input" id="prof-tags" placeholder="e.g. rust, systems, open source" value="${(state.profile?.interests||[]).join(', ')}">
                </div>
              </div>
              <div class="flex gap-12" style="margin-top: 24px;">
                <button class="btn btn-secondary" data-action="profile-next" data-step="1">Back</button>
                <button class="btn btn-primary" data-action="profile-next" data-step="3">Next step</button>
              </div>
            </div>

            <div id="setup-step-3" class="${state.setupStep === 3 ? '' : 'hidden'}">
              <div class="mono mono-11 color-text-3 mb-16">Step 3 of 3</div>
              <h2 class="text-20 weight-500 mb-24">Your goal</h2>
              <div class="flex flex-col gap-16 mb-24">
                <select class="input" id="prof-goal">
                  <option value="Reach each other's audiences">Reach each other's audiences</option>
                  <option value="Swap skills and make something together">Swap skills and make something together</option>
                  <option value="Publish research or open-source work together">Publish research or open-source work together</option>
                  <option value="Appear as a guest on each other's channel">Appear as a guest on each other's channel</option>
                </select>
              </div>
              <div class="flex gap-12" style="margin-top: 24px; flex-wrap: wrap;">
                <button class="btn btn-secondary" data-action="profile-next" data-step="2">Back</button>
                <button class="btn btn-primary" data-action="save-profile">Show my matches</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProjects() {
    root.innerHTML = `
      <div class="container section">
        <h1 class="display display-36 mb-32">Projects</h1>
        ${state.savedPitches.length === 0 ? 
          `<p class="color-text-2 mb-24 text-16">No saved message drafts yet.</p><button class="btn btn-primary" data-action="nav" data-path="#/discover">Find matches</button>` :
          `<div class="flex flex-col gap-16">
            ${state.savedPitches.map((p, i) => `
              <div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:24px;">
                <div class="flex justify-between items-start mb-16 flex-wrap gap-16">
                  <div>
                    <div class="weight-500 text-16">${p.creatorName}</div>
                    <div class="mono mono-11 color-text-2" style="margin-top:4px;">Saved on ${p.date} &middot; ${p.tone}</div>
                  </div>
                  <div class="flex gap-8">
                    <button class="btn btn-secondary" data-action="copy-project" data-index="${i}">Copy message</button>
                    <button class="btn btn-secondary" data-action="delete-project" data-index="${i}">Delete</button>
                  </div>
                </div>
                <div class="color-text-2 text-14" style="white-space:pre-wrap; background:var(--bg); padding:16px; border-radius:6px; border:1px solid var(--line);">${p.text}</div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
    `;
  }

  function renderHowItWorks() {
    root.innerHTML = `
      <div class="container section max-w-68" style="margin: 0 auto;">
        <h1 class="display display-36 mb-32">How the match score works</h1>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">Syndicate uses a 100-point algorithm to find collaborators that actually make sense. Here is exactly how we calculate it.</p>
        
        <h2 class="text-20 weight-500 mb-16">1. Related field (up to 30 points)</h2>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">We compare your main field to theirs. Identical fields get 21 points. Closely adjacent fields (like 3D concept art and Game development tooling) score up to 28.5 points to encourage cross-pollination. Distant fields get a minimum of 6 points.</p>

        <h2 class="text-20 weight-500 mb-16">2. Shared interests (up to 20 points)</h2>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">We look at your specific tags and map synonyms (e.g. "rust" matches "systems"). The more overlap, the higher the score.</p>

        <h2 class="text-20 weight-500 mb-16">3. Similar audience size (up to 20 points)</h2>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">A straight ratio of your audience sizes. This is relaxed if your goal is "Swap skills", but heavily penalised for "Guest appearance" if there's a massive mismatch.</p>

        <h2 class="text-20 weight-500 mb-16">4. Content style fit (up to 15 points)</h2>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">We score how well your primary platforms mix. A Podcast and a YouTube channel mix very well; GitHub and Instagram less so.</p>

        <h2 class="text-20 weight-500 mb-16">5. Goal fit (up to 15 points)</h2>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">If they have explicitly stated they are open to your specific goal, you get full points.</p>

        <div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:32px;margin-top:64px;">
          <h3 class="weight-500 mb-24 text-20">Glossary</h3>
          <table class="w-full text-14 text-left" style="border-collapse: collapse;">
            <tr style="border-bottom:1px solid var(--line);"><th class="pb-8" style="padding-bottom:16px;">Term</th><th class="pb-8 color-text-2 font-normal" style="padding-bottom:16px;">Meaning</th></tr>
            <tr style="border-bottom:1px solid var(--line);"><td class="py-8" style="padding:16px 0;">Match score</td><td class="py-8 color-text-2" style="padding:16px 0;">The total 0-100 compatibility rating.</td></tr>
            <tr><td class="py-8" style="padding:16px 0;">Shared audience</td><td class="py-8 color-text-2" style="padding:16px 0;">The estimated percentage of your followers who already follow them.</td></tr>
          </table>
        </div>
      </div>
    `;
  }

  function renderHelp() {
    root.innerHTML = `
      <div class="container section max-w-68" style="margin: 0 auto;">
        <h1 class="display display-36 mb-32">Help & Support</h1>
        <p class="text-16 color-text-2 mb-32" style="line-height:1.7;">Need assistance? Reach out at support@syndicate-example.com.</p>
        
        <h2 class="text-20 weight-500 mb-16">Keyboard shortcuts</h2>
        <ul class="text-16 color-text-2" style="padding-left:24px; line-height:2.2;">
          <li><strong>/</strong> : Focus search on Discover</li>
          <li><strong>Esc</strong> : Close drawers, modals, and clear search</li>
          <li><strong>Tab</strong> : Navigate interactive elements</li>
        </ul>
      </div>
    `;
  }

  function renderShortlist() {
    let creators = getRankedCreators().filter(c => state.shortlist.includes(c.id));
    
    root.innerHTML = `
      <div class="container section">
        <div class="flex justify-between items-center mb-32 flex-wrap gap-16">
          <h1 class="display display-36">Saved collaborators</h1>
          ${creators.length > 0 ? `<button class="btn btn-secondary" data-action="copy-saved">Copy my saved list</button>` : ''}
        </div>
        ${creators.length === 0 ? 
          `<p class="color-text-2 mb-24 text-16">Nothing saved yet.</p><button class="btn btn-primary" data-action="nav" data-path="#/discover">Go to Discover</button>` :
          `<div class="card-grid">${creators.map(renderCard).join('')}</div>`
        }
      </div>
    `;
  }


  // --- DRAWER LOGIC ---
  function renderDrawer(cId, tab) {
    const creator = Data.creators.find(c => c.id === cId);
    if (!creator) return;
    const profile = state.profile || { name: "Guest", field: "Technical writing", interests: ["rust"], audienceSize: "Growing (5k to 25k)", platform: "Substack", goal: "Swap skills and make something together" };
    const score = scoreCreator(profile, creator);
    const tint = getCategoryTint(creator.field);

    const overlayEl = el('overlay-container');
    overlayEl.innerHTML = `
      <div class="drawer open" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer-header flex justify-between items-start">
          <div class="flex gap-12">
            <div class="avatar bg-${tint}-10">${creator.initials}</div>
            <div>
              <div class="weight-500 text-16" id="drawer-title">${creator.name}</div>
              <div class="mono mono-11 color-text-2">${creator.handle}</div>
            </div>
          </div>
          <div class="flex gap-16 items-center">
            <div class="mono text-24 tint-sage">${score.total}%</div>
            <button class="btn-icon" data-action="close-overlays" aria-label="Close drawer"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          </div>
        </div>
        
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="${tab==='why'}" data-action="switch-tab" data-tab="why">Why you match</button>
          <button class="tab" role="tab" aria-selected="${tab==='ideas'}" data-action="switch-tab" data-tab="ideas">Project ideas</button>
          <button class="tab" role="tab" aria-selected="${tab==='message'}" data-action="switch-tab" data-tab="message">Message draft</button>
        </div>

        <div class="drawer-content">
          <div class="tabpanel ${tab==='why' ? 'active' : ''}" id="panel-why">
            <div class="mb-32">
              ${Object.entries(score.breakdown).map(([k,v]) => `
                <div class="flex justify-between items-center mb-8">
                  <div class="text-14 color-text-2" style="text-transform:capitalize;">${k === 'interests' ? 'Shared interests' : k === 'audience' ? 'Similar audience size' : k === 'field' ? 'Related field' : k === 'style' ? 'Content style fit' : 'Goal fit'}</div>
                  <div class="flex items-center gap-12">
                    <div class="mono text-14">${v}</div>
                    <div style="width:100px;height:2px;background:var(--line);border-radius:1px;"><div style="width:${(v/(k==='field'?30:k==='interests'||k==='audience'?20:15))*100}%;height:100%;background:var(--sage);"></div></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <h3 class="mono mono-11 color-text-3 mb-8">Shared audience</h3>
            <p class="text-14 color-text-2 mb-24">Based on overlapping niches, roughly ${(creator.sharedAudience*100).toFixed(0)}% of your audience follows them too. Cross-promotion could yield meaningful conversion without feeling unbalanced.</p>

            <h3 class="mono mono-11 color-text-3 mb-8">What you each bring</h3>
            <div class="flex gap-24 mb-24 text-14 color-text-2">
              <div style="flex:1;"><strong>You:</strong><br/>${profile.field} expertise<br/>${profile.audienceSize} reach</div>
              <div style="flex:1;"><strong>Them:</strong><br/>${creator.field} mastery<br/>Highly engaged ${creator.platform} audience</div>
            </div>

            <h3 class="mono mono-11 color-text-3 mb-8">Things to watch out for</h3>
            <p class="text-14 color-text-2 mb-24">They post on a ${creator.cadence.toLowerCase()}, which might require asynchronous coordination if your pace differs. Additionally, ${creator.platform} audiences expect native formats.</p>
          </div>

          <div class="tabpanel ${tab==='ideas' ? 'active' : ''}" id="panel-ideas">
            <div class="accordion-item open mb-16" style="border:1px solid var(--line);border-radius:8px;padding:0 16px;">
              <button class="accordion-header" data-action="toggle-accordion">Made together <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg></button>
              <div class="accordion-content text-14">
                <div class="weight-500 mb-8 color-text">A shared media piece combining ${creator.tags[0]} and your focus.</div>
                <div class="color-text-2 mb-16">Time needed: 12 to 16 hours in total, split 60/40.</div>
                <table class="w-full text-13 mb-16" style="text-align:left;"><tr><th class="color-text weight-500 pb-8">You</th><th class="color-text weight-500 pb-8">Them</th></tr><tr><td class="color-text-2">Content framing, day 0</td><td class="color-text-2">Production edit, day 3</td></tr></table>
                <button class="btn btn-secondary w-full" data-action="switch-tab" data-tab="message">Use this idea</button>
              </div>
            </div>
            <div class="accordion-item mb-16" style="border:1px solid var(--line);border-radius:8px;padding:0 16px;">
              <button class="accordion-header" data-action="toggle-accordion">A shared resource <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg></button>
              <div class="accordion-content text-14">
                <div class="weight-500 mb-8 color-text">An open-source toolkit or guide.</div>
                <div class="color-text-2 mb-16">Time needed: 4 to 8 hours.</div>
                <button class="btn btn-secondary w-full" data-action="switch-tab" data-tab="message">Use this idea</button>
              </div>
            </div>
          </div>

          <div class="tabpanel ${tab==='message' ? 'active' : ''}" id="panel-message">
            <div class="flex gap-4 p-4 mb-16" style="background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:4px;" id="tone-toggle-container">
              <button class="btn" data-action="switch-tone" data-tone="casual" data-id="${cId}" style="flex:1;min-height:32px;background:var(--elevated);border:1px solid var(--line);color:var(--text);">Casual message</button>
              <button class="btn" data-action="switch-tone" data-tone="formal" data-id="${cId}" style="flex:1;min-height:32px;color:var(--text-2);background:transparent;border:none;">Formal proposal</button>
            </div>
            <textarea id="draft-text" class="input" style="height:280px;margin-bottom:16px;">Hey ${creator.name.split(' ')[0]},
I've been following your work on ${creator.platform} and really respect your approach to ${creator.tags[0]}. Our audiences share a lot of the same interests.

I had an idea for a joint piece where I handle the technical framing and you drive the production. It would take about 12 hours total.

Let me know if you have bandwidth for a quick 20-minute chat this week to explore it.</textarea>
            <div class="flex gap-12 flex-wrap">
              <button class="btn btn-primary" style="flex:1;" data-action="copy-draft">Copy message</button>
              <button class="btn btn-secondary" style="flex:1;" data-action="save-draft">Save to Projects</button>
            </div>
          </div>
        </div>
      </div>
    `;
    el('backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap setup
    const drawer = el('drawer');
    const focusable = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  // --- ROUTER ---
  function router() {
    const hash = location.hash || '#/';
    state.lastRoute = hash;
    saveState();
    
    if (hash === '#/') renderHome();
    else if (hash === '#/discover') renderDiscover();
    else if (hash === '#/profile') renderProfile();
    else if (hash === '#/shortlist') renderShortlist();
    else if (hash === '#/projects') renderProjects();
    else if (hash === '#/how-it-works') renderHowItWorks();
    else if (hash === '#/help') renderHelp();
    else { root.innerHTML = `<div class="container section"><h1 class="display display-36">Coming soon</h1></div>`; }
    
    window.scrollTo(0,0);
  }

  // --- EVENT DELEGATION ---
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    
    if (action === 'nav') {
      location.hash = btn.getAttribute('data-path');
      el('mobile-menu')?.classList.add('hidden');
    }
    else if (action === 'go-profile') {
      location.hash = '#/profile';
      el('mobile-menu')?.classList.add('hidden');
    }
    else if (action === 'toggle-menu') {
      el('mobile-menu')?.classList.toggle('hidden');
    }
    else if (action === 'close-menu') {
      el('mobile-menu')?.classList.add('hidden');
    }
    else if (action === 'preset-profile') {
      const type = btn.getAttribute('data-type');
      state.profile = {
        name: type === 'writer' ? '@techwriter' : type === 'audio' ? '@audioprod' : '@3dartist',
        field: type === 'writer' ? 'Technical writing' : type === 'audio' ? 'Audio production' : '3D concept art',
        audienceSize: 'Growing (5k to 25k)',
        interests: ['design', 'systems'],
        goal: 'Swap skills and make something together'
      };
      state.setupStep = 3;
      renderProfile();
    }
    else if (action === 'profile-next') {
      const step = parseInt(btn.getAttribute('data-step'));
      if (step === 2) {
        if (!el('prof-name').value || !el('prof-field').value) {
          if(!el('prof-name').value) el('prof-name').classList.add('error');
          if(!el('prof-field').value) el('prof-field').classList.add('error');
          return;
        }
        state.profile = { ...state.profile, name: el('prof-name').value, field: el('prof-field').value };
      }
      if (step === 3) {
        state.profile = { ...state.profile, audienceSize: el('prof-size').value, interests: el('prof-tags').value.split(',').map(s=>s.trim()) };
      }
      state.setupStep = step;
      renderProfile();
    }
    else if (action === 'save-profile') {
      state.profile = { ...state.profile, goal: el('prof-goal').value };
      state.setupStep = 'done';
      saveState();
      showToast("Profile saved.");
      location.hash = '#/discover';
    }
    else if (action === 'edit-profile') {
      state.setupStep = 1;
      renderProfile();
    }
    else if (action === 'reset-profile') {
      if (btn.textContent === 'Reset everything') {
        btn.textContent = 'Reset? Yes';
        btn.style.color = 'var(--clay)';
        btn.style.borderColor = 'var(--clay)';
      } else {
        state.profile = null;
        state.setupStep = 1;
        saveState();
        renderProfile();
        showToast("Profile reset.");
      }
    }
    else if (action === 'toggle-save') {
      const id = btn.getAttribute('data-id');
      if (state.shortlist.includes(id)) state.shortlist = state.shortlist.filter(x => x !== id);
      else state.shortlist.push(id);
      saveState();
      btn.setAttribute('aria-pressed', state.shortlist.includes(id));
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${state.shortlist.includes(id)?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`;
    }
    else if (action === 'open-drawer') {
      renderDrawer(btn.getAttribute('data-id'), btn.getAttribute('data-tab'));
    }
    else if (action === 'close-overlays') {
      el('overlay-container').innerHTML = '';
      el('backdrop').classList.remove('open');
      document.body.style.overflow = '';
    }
    else if (action === 'switch-tab') {
      const tab = btn.getAttribute('data-tab');
      const drawer = btn.closest('.drawer');
      if (drawer) {
        drawer.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.getAttribute('data-tab') === tab));
        drawer.querySelectorAll('.tabpanel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
      }
    }
    else if (action === 'switch-tone') {
      const tone = btn.getAttribute('data-tone');
      const cId = btn.getAttribute('data-id');
      const creator = Data.creators.find(c => c.id === cId);
      
      const container = el('tone-toggle-container');
      container.querySelectorAll('.btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.border = 'none';
        b.style.color = 'var(--text-2)';
      });
      btn.style.background = 'var(--elevated)';
      btn.style.border = '1px solid var(--line)';
      btn.style.color = 'var(--text)';

      const draft = el('draft-text');
      if (tone === 'casual') {
        draft.value = `Hey ${creator.name.split(' ')[0]},\nI've been following your work on ${creator.platform} and really respect your approach to ${creator.tags[0]}. Our audiences share a lot of the same interests.\n\nI had an idea for a joint piece where I handle the technical framing and you drive the production. It would take about 12 hours total.\n\nLet me know if you have bandwidth for a quick 20-minute chat this week to explore it.`;
      } else {
        draft.value = `Subject: Proposal for a joint collaboration\n\nHi ${creator.name.split(' ')[0]},\n\nMy name is ${state.profile?.name || 'Creator'} and I create content about ${state.profile?.field || 'my field'}. I admire your consistency and quality on ${creator.platform}, especially regarding ${creator.tags[0]}.\n\nI am proposing a structured collaboration: a shared media piece where we split the workload 60/40. This would take roughly 12 to 16 hours and allow us to tap into each other's audiences directly.\n\nPlease let me know if you are open to a brief 20-minute introductory call this week to discuss feasibility.`;
      }
    }
    else if (action === 'toggle-accordion') {
      const item = btn.closest('.accordion-item');
      item.classList.toggle('open');
    }
    else if (action === 'copy-draft') {
      const txt = el('draft-text').value;
      try {
        navigator.clipboard.writeText(txt);
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied`;
        setTimeout(() => btn.textContent = 'Copy message', 2000);
      } catch(e) {}
    }
    else if (action === 'save-draft') {
      const txt = el('draft-text').value;
      const creatorName = el('drawer-title').textContent;
      const toneBtn = el('tone-toggle-container').querySelector('.btn[style*="var(--elevated)"]');
      const tone = toneBtn ? toneBtn.textContent : "Casual message";
      state.savedPitches.push({ creatorName, tone, text: txt, date: new Date().toLocaleDateString() });
      saveState();
      showToast("Saved to Projects.");
    }
    else if (action === 'copy-project') {
      const index = parseInt(btn.getAttribute('data-index'));
      const p = state.savedPitches[index];
      try {
        navigator.clipboard.writeText(p.text);
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied`;
        setTimeout(() => btn.textContent = 'Copy message', 2000);
      } catch(e) {}
    }
    else if (action === 'delete-project') {
      if (btn.textContent === 'Delete') {
        btn.textContent = 'Delete? Yes';
        btn.style.color = 'var(--clay)';
        btn.style.borderColor = 'var(--clay)';
      } else {
        const index = parseInt(btn.getAttribute('data-index'));
        state.savedPitches.splice(index, 1);
        saveState();
        renderProjects();
        showToast("Deleted draft.");
      }
    }
    else if (action === 'clear-filters') {
      state.filters = { platform: '', size: '', goal: '', field: '', search: '' };
      renderDiscover();
    }
    else if (action === 'copy-saved') {
      const creators = getRankedCreators().filter(c => state.shortlist.includes(c.id));
      const list = creators.map(c => {
        return `${c.name} (${c.handle}) - ${c.match.total}% match`;
      }).join('\n');
      try {
        navigator.clipboard.writeText(list);
        showToast("Copied saved list.");
      } catch(e) {}
    }
  });

  document.body.addEventListener('input', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      e.target.classList.remove('error');
    }
    if (e.target.getAttribute('data-action') === 'search-input') {
      state.filters.search = e.target.value;
      renderDiscover();
      const newInp = el('search-input');
      if (newInp) { newInp.focus(); newInp.setSelectionRange(newInp.value.length, newInp.value.length); }
    }
  });

  window.addEventListener('hashchange', router);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = el('overlay-container');
      if (overlay && overlay.innerHTML !== '') {
        el('overlay-container').innerHTML = '';
        el('backdrop').classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  function showToast(msg) {
    const t = el('toast');
    t.textContent = msg;
    t.classList.add('open');
    setTimeout(() => t.classList.remove('open'), 2400);
  }

  // --- INIT ---
  loadState();
  updateHeader();
  router();

  console.assert(Data.creators.length === 16, "Catalog length is correct");

})();
