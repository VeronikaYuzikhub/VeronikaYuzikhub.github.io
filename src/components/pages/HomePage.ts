// ─────────────────────────────────────────
//  HOME PAGE  —  src/components/pages/HomePage.ts
// ─────────────────────────────────────────

import { PROJECTS } from '@/data'
import { renderFooter } from '@/components/Footer'
import type { Router } from '@/utils/router'

export function renderHomePage(router: Router): HTMLElement {
  const page = document.createElement('div')
  page.id        = 'page-home'
  page.className = 'page'

  page.innerHTML = `
    <!-- ── Hero ── -->
    <section class="hero">
      <div class="hero-left">
        <div class="eyebrow">software engineer · designer · Odesa</div>
        <div class="hero-name">Veronika</div>
        <div class="hero-lastname">Yuzik.</div>
        <p class="hero-desc">
          Engineering automation, ML pipelines, and 3D tools —
          built with precision and care for how they look and feel.
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary" id="home-see-works">See works</button>
          <button class="btn btn-ghost"   id="home-about">About me</button>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-3d-hint">drag · rotate</div>
      </div>
    </section>

    <!-- ── Featured preview ── -->
    <div class="home-preview">
      <div class="eyebrow section-label">featured work</div>
      <div class="preview-grid">
        ${PROJECTS.map((p, i) => `
          <div class="glass preview-card" data-project="${p.id}">
            <div class="preview-card-num" style="color:${i % 2 === 0 ? 'var(--blue)' : 'var(--pink)'}">
              ${p.index}
            </div>
            <div class="preview-card-name">${p.title}${p.titleAccent ? ` <em>${p.titleAccent}</em>` : ''}</div>
            <div class="preview-card-sub">${p.shortDesc}</div>
            <div class="preview-card-link" style="color:${i % 2 === 0 ? 'var(--blue)' : 'var(--pink)'}">
              View
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${renderFooter()}
  `

  // ── Bind buttons ────────────────────────
  page.querySelector('#home-see-works')
    ?.addEventListener('click', () => router.navigate('works'))

  page.querySelector('#home-about')
    ?.addEventListener('click', () => router.navigate('about'))

  page.querySelectorAll<HTMLElement>('.preview-card').forEach(card => {
    card.addEventListener('click', () => router.navigate('works'))
  })

  return page
}
