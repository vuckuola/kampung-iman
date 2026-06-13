export function mountApp() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `
  <canvas id="game-canvas" aria-label="Kampung Iman WebGL prototype"></canvas>
  <section class="start-screen" id="start-screen">
    <div class="start-panel">
      <div class="start-copy">
        <p class="eyebrow">Kampung Iman Adventure</p>
        <h2>Masuk ke desa belajar yang damai</h2>
        <p class="start-subtitle">Jelajahi Adab, Ilmu, dan Sadaqah lewat aktivitas kecil yang hangat, positif, dan ramah anak.</p>
      </div>
      <div class="start-grid">
        <div class="character-preview" id="character-preview" aria-hidden="true">
          <span class="preview-sun"></span>
          <span class="preview-path"></span>
          <span class="preview-kid preview-girl"></span>
          <span class="preview-label">Calm village mode</span>
        </div>
        <div class="start-form-card">
          <label>Nama anak
            <input id="player-name" maxlength="18" placeholder="contoh: Aisyah" value="Aisyah" />
          </label>
          <div class="character-picks" role="group" aria-label="Pilih karakter">
            <button class="character-pick selected" data-character="girl" aria-pressed="true"><span>Hijab</span><small>Anak perempuan</small></button>
            <button class="character-pick" data-character="boy" aria-pressed="false"><span>Kufi</span><small>Anak laki-laki</small></button>
          </div>
        </div>
      </div>
      <div class="setup-checklist" aria-label="Game setup checklist">
        <span><i></i> Warm village</span>
        <span><i></i> Parent-safe quests</span>
        <span><i></i> Optional sound</span>
      </div>
      <button class="primary start-primary" id="start-game">Mulai Jelajah</button>
      <p class="start-note">Keyboard atau joystick touchscreen. Semua feedback lembut, tidak menghukum.</p>
    </div>
  </section>
  <div class="hud">
    <div>
      <h1>Kampung Iman</h1>
      <p>Choose a syar'i kid character, walk through adab, ilmu, and sadaqah activity scenes, then answer grounded quests.</p>
    </div>
    <div class="stats">
      <span>Player <strong id="player-label">Aisyah</strong></span>
      <span>Zone <strong id="current-zone">Village</strong></span>
      <span>Score <strong id="score">0</strong></span>
      <span>Lessons <strong id="orbs">0/12</strong></span>
    </div>
  </div>
  <button class="audio-toggle" id="audio-toggle">Sound Off</button>
  <div class="controls">WASD / Arrow keys move · Space slows · R resets · Tap activities for quests</div>
  <div class="touch-controls" aria-label="Touch movement controls">
    <div class="joystick" id="joystick" aria-label="Drag to steer and drive">
      <div class="joystick-knob" id="joystick-knob"></div>
    </div>
    <div class="touch-actions">
      <button id="touch-brake" aria-label="Brake">Brake</button>
      <button id="touch-reset" aria-label="Reset player">Reset</button>
    </div>
  </div>
  <div class="lesson-card" id="lesson-card">Explore Adab, Ilmu, and Sadaqah zones.</div>
  <dialog id="quiz-modal" class="quiz-modal">
    <form method="dialog" id="quiz-form">
      <p class="eyebrow" id="quiz-zone"></p>
      <h2 id="quiz-question"></h2>
      <div id="quiz-choices" class="quiz-choices"></div>
      <p id="quiz-feedback" class="feedback"></p>
      <p id="quiz-source" class="source-badge"></p>
      <button id="continue-button" class="primary" value="continue" disabled>Continue</button>
    </form>
  </dialog>
  <div class="win-card" id="win-card" hidden>
    <div class="reward-badge">★</div>
    <p class="eyebrow">Alhamdulillah</p>
    <h2>Journey Complete</h2>
    <p>You completed every learning activity. Keep practicing adab, seeking knowledge, and helping others.</p>
    <button id="play-again">Play again</button>
  </div>
`
}

export function getUIElements() {
  return {
    canvas: document.querySelector<HTMLCanvasElement>('#game-canvas')!,
    scoreElement: document.querySelector<HTMLElement>('#score')!,
    currentZoneElement: document.querySelector<HTMLElement>('#current-zone')!,
    playerLabel: document.querySelector<HTMLElement>('#player-label')!,
    orbsElement: document.querySelector<HTMLElement>('#orbs')!,
    lessonCard: document.querySelector<HTMLElement>('#lesson-card')!,
    quizModal: document.querySelector<HTMLDialogElement>('#quiz-modal')!,
    quizZone: document.querySelector<HTMLElement>('#quiz-zone')!,
    quizQuestion: document.querySelector<HTMLElement>('#quiz-question')!,
    quizChoices: document.querySelector<HTMLElement>('#quiz-choices')!,
    quizFeedback: document.querySelector<HTMLElement>('#quiz-feedback')!,
    quizSource: document.querySelector<HTMLElement>('#quiz-source')!,
    continueButton: document.querySelector<HTMLButtonElement>('#continue-button')!,
    winCard: document.querySelector<HTMLElement>('#win-card')!,
    playAgainButton: document.querySelector<HTMLButtonElement>('#play-again')!,
    startScreen: document.querySelector<HTMLElement>('#start-screen')!,
    startGameButton: document.querySelector<HTMLButtonElement>('#start-game')!,
    playerNameInput: document.querySelector<HTMLInputElement>('#player-name')!,
    audioToggle: document.querySelector<HTMLButtonElement>('#audio-toggle')!,
    joystick: document.querySelector<HTMLElement>('#joystick')!,
    joystickKnob: document.querySelector<HTMLElement>('#joystick-knob')!,
    touchBrake: document.querySelector<HTMLButtonElement>('#touch-brake')!,
    touchReset: document.querySelector<HTMLButtonElement>('#touch-reset')!,
  }
}

export type UIElements = ReturnType<typeof getUIElements>
