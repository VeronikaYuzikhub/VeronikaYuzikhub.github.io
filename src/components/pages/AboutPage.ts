// ─────────────────────────────────────────
//  ABOUT PAGE  —  src/components/pages/AboutPage.ts
// ─────────────────────────────────────────

import { renderFooter } from '@/components/Footer'
import type { Router } from '@/utils/router'

export function renderAboutPage(router: Router): HTMLElement {
  const page = document.createElement('div')
  page.id        = 'page-about'
  page.className = 'page'

  page.innerHTML = `
    <div class="page-header">
      <div class="page-title">About<br><em>me</em></div>
    </div>

    <div class="about-layout">

      <!-- Text left -->
      <div class="about-text">
        <p>
          Software engineering student at <em>VSP OTFC ONTU, Odesa</em> —
          Computer Engineering, Junior Bachelor. Budget place, entrance 200/200,
          studying with honours.
        </p>
        <p>
          Inclined towards <em>mathematics and computer science</em> since school —
          worked both in teams and on individual projects, from full-stack web
          to desktop apps and ML pipelines.
        </p>
        <p>
          Worked as a Full-stack Developer at <em>Davydov Consulting</em> (London),
          currently a Software Engineer at <em>S-Engineering</em> and a
          Python mentor at <em>Logika School</em>.
        </p>
        <p>
          I care equally about <em>precision</em> and aesthetics —
          in code, in design, and in the tools I build.
        </p>
        <div class="about-buttons">
          <a href="/cv.pdf" class="btn btn-primary" download>Download CV</a>
          <button class="btn btn-ghost" id="about-see-works">See works</button>
        </div>
      </div>

      <!-- Info right -->
      <div>
        <div class="section-label" style="margin-bottom:20px;">Quick info</div>
        <div style="display:flex;flex-direction:column;gap:0;">

          <div class="skill-row">
            <span class="skill-name">Location</span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--text3);">
              Odesa, Ukraine
            </span>
          </div>
          <div class="skill-row">
            <span class="skill-name">Education</span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--text3);">
              VSP OTFC ONTU · Odesa
            </span>
          </div>
          <div class="skill-row">
            <span class="skill-name">Status</span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--blue);
                         display:flex;align-items:center;gap:6px;">
              <span style="width:6px;height:6px;border-radius:50%;background:var(--blue);
                           box-shadow:0 0 8px var(--blue-glow);display:inline-block;
                           animation:statusPulse 2.5s ease-in-out infinite;"></span>
              Open to work
            </span>
          </div>
          <div class="skill-row">
            <span class="skill-name">Languages</span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--text3);">
              UA · RU · EN · IT · DE · HR
            </span>
          </div>
          <div class="skill-row">
            <span class="skill-name">GitHub</span>
            <a href="https://github.com/VeronikaYuzikhub" target="_blank" rel="noopener"
               style="font-family:var(--font-mono);font-size:10px;color:var(--blue);
                      text-decoration:none;letter-spacing:0.08em;">
              VeronikaYuzikhub
            </a>
          </div>
          <div class="skill-row">
            <span class="skill-name">LinkedIn</span>
            <a href="https://www.linkedin.com/in/veronikayuzik-9292b735b" target="_blank" rel="noopener"
               style="font-family:var(--font-mono);font-size:10px;color:var(--blue);
                      text-decoration:none;letter-spacing:0.08em;">
              veronikayuzik
            </a>
          </div>
          <div class="skill-row">
            <span class="skill-name">Telegram</span>
            <a href="https://t.me/ccccuddlies" target="_blank" rel="noopener"
               style="font-family:var(--font-mono);font-size:10px;color:var(--blue);
                      text-decoration:none;letter-spacing:0.08em;">
              @ccccuddlies
            </a>
          </div>
          <div class="skill-row">
            <span class="skill-name">Email</span>
            <a href="mailto:veronikauzik479@gmail.com"
               style="font-family:var(--font-mono);font-size:10px;color:var(--blue);
                      text-decoration:none;letter-spacing:0.08em;">
              veronikauzik479@gmail.com
            </a>
          </div>

        </div>
      </div>

    </div>

    ${renderFooter()}
  `

  page.querySelector('#about-see-works')
    ?.addEventListener('click', () => router.navigate('works'))

  return page
}
