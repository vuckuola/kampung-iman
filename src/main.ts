import * as THREE from 'three'
import './style.css'
import { quizzes, zoneLessons, type Quiz, type ZoneId } from './content/lessons'

type KnowledgeOrb = {
  mesh: THREE.Mesh
  zone: ZoneId
  quiz: Quiz
  collected: boolean
}

const zones: Record<ZoneId, { title: string; color: number; position: THREE.Vector3; lesson: string }> = {
  adab: {
    title: 'Adab Courtyard',
    color: 0x22a06b,
    position: new THREE.Vector3(-11, 0, -5),
    lesson: zoneLessons.adab,
  },
  ilmu: {
    title: 'Ilmu Library',
    color: 0x2b6eea,
    position: new THREE.Vector3(0, 0, 9),
    lesson: zoneLessons.ilmu,
  },
  sadaqah: {
    title: 'Sadaqah Garden',
    color: 0xf0a629,
    position: new THREE.Vector3(11, 0, -5),
    lesson: zoneLessons.sadaqah,
  },
}

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <canvas id="game-canvas" aria-label="Kampung Iman WebGL prototype"></canvas>
  <div class="hud">
    <div>
      <h1>Kampung Iman</h1>
      <p>Drive through adab, ilmu, and sadaqah zones. Collect wisdom orbs and answer grounded quizzes.</p>
    </div>
    <div class="stats">
      <span>Score <strong id="score">0</strong></span>
      <span>Orbs <strong id="orbs">0/12</strong></span>
    </div>
  </div>
  <div class="controls">WASD / Arrow keys drive · Space brakes · R resets</div>
  <div class="touch-controls" aria-label="Touch driving controls">
    <button data-key="w">▲</button>
    <button data-key="a">◀</button>
    <button data-key="s">▼</button>
    <button data-key="d">▶</button>
  </div>
  <div class="lesson-card" id="lesson-card">Explore Adab, Ilmu, and Sadaqah zones.</div>
  <dialog id="quiz-modal" class="quiz-modal">
    <form method="dialog" id="quiz-form">
      <p class="eyebrow" id="quiz-zone"></p>
      <h2 id="quiz-question"></h2>
      <div id="quiz-choices" class="quiz-choices"></div>
      <p id="quiz-feedback" class="feedback"></p>
      <button id="continue-button" class="primary" value="continue" disabled>Continue</button>
    </form>
  </dialog>
  <div class="win-card" id="win-card" hidden>
    <h2>Journey Complete</h2>
    <p>You collected every wisdom orb. Keep learning, practicing adab, and helping others.</p>
    <button id="play-again">Play again</button>
  </div>
`

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')!
const scoreElement = document.querySelector<HTMLElement>('#score')!
const orbsElement = document.querySelector<HTMLElement>('#orbs')!
const lessonCard = document.querySelector<HTMLElement>('#lesson-card')!
const quizModal = document.querySelector<HTMLDialogElement>('#quiz-modal')!
const quizZone = document.querySelector<HTMLElement>('#quiz-zone')!
const quizQuestion = document.querySelector<HTMLElement>('#quiz-question')!
const quizChoices = document.querySelector<HTMLElement>('#quiz-choices')!
const quizFeedback = document.querySelector<HTMLElement>('#quiz-feedback')!
const continueButton = document.querySelector<HTMLButtonElement>('#continue-button')!
const winCard = document.querySelector<HTMLElement>('#win-card')!
const playAgainButton = document.querySelector<HTMLButtonElement>('#play-again')!

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfe7ff)
scene.fog = new THREE.Fog(0xbfe7ff, 35, 85)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 160)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const hemi = new THREE.HemisphereLight(0xffffff, 0x7a5f3b, 1.8)
scene.add(hemi)

const sun = new THREE.DirectionalLight(0xfff4d6, 2.2)
sun.position.set(16, 22, 10)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.left = -35
sun.shadow.camera.right = 35
sun.shadow.camera.top = 35
sun.shadow.camera.bottom = -35
scene.add(sun)

const ground = new THREE.Mesh(
  new THREE.BoxGeometry(70, 0.4, 70),
  new THREE.MeshStandardMaterial({ color: 0x8fca6b, roughness: 0.9 }),
)
ground.receiveShadow = true
ground.position.y = -0.22
scene.add(ground)

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x665a4b, roughness: 0.85 })
const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(7, 0.05, 52), roadMaterial)
mainRoad.position.set(0, 0.03, 0)
mainRoad.receiveShadow = true
scene.add(mainRoad)
const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(36, 0.052, 6), roadMaterial)
crossRoad.position.set(0, 0.04, -5)
crossRoad.receiveShadow = true
scene.add(crossRoad)

const car = new THREE.Group()
const body = new THREE.Mesh(
  new THREE.BoxGeometry(1.9, 0.65, 3.1),
  new THREE.MeshStandardMaterial({ color: 0xd84b38, roughness: 0.55 }),
)
body.position.y = 0.72
body.castShadow = true
car.add(body)
const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1.35, 0.55, 1.35),
  new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.45 }),
)
cabin.position.set(0, 1.22, -0.28)
cabin.castShadow = true
car.add(cabin)
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2433, roughness: 0.8 })
const wheelMeshes: THREE.Mesh[] = []
;[
  [-1.05, 0.43, 1.0],
  [1.05, 0.43, 1.0],
  [-1.05, 0.43, -1.05],
  [1.05, 0.43, -1.05],
].forEach(([x, y, z]) => {
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.28, 16), wheelMaterial)
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(x, y, z)
  wheel.castShadow = true
  wheelMeshes.push(wheel)
  car.add(wheel)
})
car.position.set(0, 0, 0)
scene.add(car)

function addLowPolyTree(x: number, z: number, scale = 1) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, 1.2 * scale, 5),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b }),
  )
  trunk.position.set(x, 0.6 * scale, z)
  trunk.castShadow = true
  scene.add(trunk)
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.9 * scale, 1.7 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x2f8f46, roughness: 0.8 }),
  )
  leaves.position.set(x, 1.85 * scale, z)
  leaves.castShadow = true
  scene.add(leaves)
}


function makeLabelSprite(text: string, color: string) {
  const labelCanvas = document.createElement('canvas')
  labelCanvas.width = 512
  labelCanvas.height = 128
  const ctx = labelCanvas.getContext('2d')!
  ctx.fillStyle = 'rgba(255,251,226,0.92)'
  ctx.strokeStyle = color
  ctx.lineWidth = 10
  ctx.roundRect(16, 18, 480, 92, 28)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#173a30'
  ctx.font = '800 42px Inter, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 64)
  const texture = new THREE.CanvasTexture(labelCanvas)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(5.6, 1.4, 1)
  return sprite
}

function addRamp(x: number, z: number, rotation = 0) {
  const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.35, 3.0),
    new THREE.MeshStandardMaterial({ color: 0xb98655, roughness: 0.75 }),
  )
  ramp.position.set(x, 0.15, z)
  ramp.rotation.set(-0.16, rotation, 0)
  ramp.castShadow = true
  ramp.receiveShadow = true
  scene.add(ramp)
}

type PickupParticle = { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; maxLife: number }
const pickupParticles: PickupParticle[] = []
const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xf0a629, emissiveIntensity: 0.9 })
function burstAt(position: THREE.Vector3, color: number) {
  for (let i = 0; i < 22; i += 1) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), particleMaterial.clone())
    ;(mesh.material as THREE.MeshStandardMaterial).color.setHex(color)
    ;(mesh.material as THREE.MeshStandardMaterial).emissive.setHex(color)
    mesh.position.copy(position)
    const angle = (i / 22) * Math.PI * 2
    pickupParticles.push({
      mesh,
      velocity: new THREE.Vector3(Math.cos(angle) * (1.2 + Math.random()), 1.6 + Math.random() * 1.2, Math.sin(angle) * (1.2 + Math.random())),
      life: 0.8,
      maxLife: 0.8,
    })
    scene.add(mesh)
  }
}

function addBuilding(position: THREE.Vector3, color: number, label: string) {
  const group = new THREE.Group()
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(5.4, 2.2, 4.6),
    new THREE.MeshStandardMaterial({ color, roughness: 0.75 }),
  )
  base.position.y = 1.1
  base.castShadow = true
  group.add(base)
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.8, 1.4, 4),
    new THREE.MeshStandardMaterial({ color: 0x5b3b2e, roughness: 0.85 }),
  )
  roof.position.y = 2.9
  roof.rotation.y = Math.PI / 4
  roof.castShadow = true
  group.add(roof)
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.18, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xfffbdf, roughness: 0.6 }),
  )
  sign.position.set(0, 2.05, 2.48)
  group.add(sign)
  const labelSprite = makeLabelSprite(label, `#${color.toString(16).padStart(6, '0')}`)
  labelSprite.position.set(0, 4.05, 2.35)
  group.add(labelSprite)
  group.position.copy(position)
  group.userData.label = label
  scene.add(group)
}

const knowledgeOrbs: KnowledgeOrb[] = []

Object.entries(zones).forEach(([id, zone]) => {
  addBuilding(zone.position, zone.color, zone.title)
  const marker = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 4.8, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: zone.color, transparent: true, opacity: 0.22 }),
  )
  marker.position.set(zone.position.x, 0.08, zone.position.z)
  scene.add(marker)

  quizzes[id as ZoneId].forEach((quiz, index, zoneQuizzes) => {
    const angle = (index / zoneQuizzes.length) * Math.PI * 2 + (id === 'ilmu' ? Math.PI / 2 : 0)
    const radius = id === 'ilmu' ? 4.4 : 3.7
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.45, 1),
      new THREE.MeshStandardMaterial({ color: 0xfff3a3, emissive: zone.color, emissiveIntensity: 0.7, roughness: 0.2 }),
    )
    orb.position.set(zone.position.x + Math.cos(angle) * radius, 1.1, zone.position.z + Math.sin(angle) * radius)
    orb.castShadow = true
    scene.add(orb)
    knowledgeOrbs.push({ mesh: orb, zone: id as ZoneId, quiz, collected: false })
  })
})

addRamp(-5, -18, 0.35)
addRamp(7, 18, -0.25)
addRamp(18, 4, 1.35)

for (let i = 0; i < 42; i += 1) {
  const x = (Math.random() - 0.5) * 62
  const z = (Math.random() - 0.5) * 62
  if (Math.abs(x) < 6 || Math.abs(z + 5) < 5) continue
  addLowPolyTree(x, z, 0.75 + Math.random() * 0.55)
}

const keys = new Set<string>()
let speed = 0
let score = 0
let collected = 0
let activeOrb: KnowledgeOrb | null = null
let pausedForQuiz = false
let finished = false
const clock = new THREE.Clock()

window.addEventListener('keydown', (event) => {
  keys.add(event.key.toLowerCase())
  if (event.key.toLowerCase() === 'r') resetCar()
})
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()))
window.addEventListener('resize', resize)
document.querySelectorAll<HTMLButtonElement>('.touch-controls button').forEach((button) => {
  const key = button.dataset.key!
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); keys.add(key) })
  button.addEventListener('pointerup', () => keys.delete(key))
  button.addEventListener('pointerleave', () => keys.delete(key))
})

function resetCar() {
  car.position.set(0, 0, 0)
  car.rotation.set(0, 0, 0)
  speed = 0
  body.rotation.set(0, 0, 0)
  cabin.rotation.set(0, 0, 0)
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function updateVehicle(dt: number) {
  if (pausedForQuiz) return
  const forward = keys.has('w') || keys.has('arrowup')
  const backward = keys.has('s') || keys.has('arrowdown')
  const left = keys.has('a') || keys.has('arrowleft')
  const right = keys.has('d') || keys.has('arrowright')
  const braking = keys.has(' ')

  const acceleration = forward ? 10 : backward ? -7 : 0
  speed += acceleration * dt
  speed *= braking ? 0.84 : 0.975
  speed = THREE.MathUtils.clamp(speed, -8, 13)

  wheelMeshes.forEach((wheel) => {
    wheel.rotation.x += speed * dt * 2.4
  })

  const steering = (left ? 1 : 0) + (right ? -1 : 0)
  const turnStrength = THREE.MathUtils.clamp(Math.abs(speed) / 7, 0.2, 1)
  car.rotation.y += steering * turnStrength * dt * 2.5 * Math.sign(speed || 1)
  body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, steering * 0.10 * turnStrength, 0.12)
  cabin.rotation.z = THREE.MathUtils.lerp(cabin.rotation.z, steering * 0.07 * turnStrength, 0.12)
  body.position.y = 0.72 + Math.sin(clock.elapsedTime * 9) * Math.min(Math.abs(speed) / 90, 0.045)

  const direction = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y))
  car.position.addScaledVector(direction, speed * dt)
  car.position.x = THREE.MathUtils.clamp(car.position.x, -31, 31)
  car.position.z = THREE.MathUtils.clamp(car.position.z, -31, 31)

  const currentZone = Object.values(zones).find((zone) => car.position.distanceTo(zone.position) < 6.5)
  lessonCard.textContent = currentZone ? `${currentZone.title}: ${zoneLessons[(Object.keys(zones) as ZoneId[]).find((id) => zones[id] === currentZone)!]}` : 'Follow the glowing orbs. Each one unlocks a short quiz and a wisdom point.'
}

function updateCamera(dt: number) {
  const behind = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y)).multiplyScalar(-8)
  const targetPosition = car.position.clone().add(behind).add(new THREE.Vector3(0, 5.2, 0))
  camera.position.lerp(targetPosition, 1 - Math.pow(0.001, dt))
  camera.lookAt(car.position.x, car.position.y + 1.1, car.position.z)
}

function checkOrbs() {
  if (pausedForQuiz) return
  knowledgeOrbs.forEach((orb) => {
    if (orb.collected) return
    if (orb.mesh.position.distanceTo(car.position) < 1.7) openQuiz(orb)
  })
}

function openQuiz(orb: KnowledgeOrb) {
  activeOrb = orb
  pausedForQuiz = true
  speed = 0
  quizZone.textContent = zones[orb.zone].title
  quizQuestion.textContent = orb.quiz.question
  quizFeedback.textContent = ''
  continueButton.disabled = true
  quizChoices.innerHTML = ''
  orb.quiz.choices.forEach((choice, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = choice
    button.addEventListener('click', () => answerQuiz(index))
    quizChoices.append(button)
  })
  quizModal.showModal()
}

function answerQuiz(index: number) {
  if (!activeOrb) return
  const correct = index === activeOrb.quiz.answer
  score += correct ? 100 : 25
  collected += 1
  activeOrb.collected = true
  activeOrb.mesh.visible = false
  burstAt(activeOrb.mesh.position, zones[activeOrb.zone].color)
  quizFeedback.textContent = `${correct ? 'Correct!' : 'Good try.'} ${activeOrb.quiz.explanation}`
  quizFeedback.className = correct ? 'feedback correct' : 'feedback'
  Array.from(quizChoices.children).forEach((child, childIndex) => {
    const button = child as HTMLButtonElement
    button.disabled = true
    if (childIndex === activeOrb?.quiz.answer) button.classList.add('right-answer')
  })
  scoreElement.textContent = String(score)
  orbsElement.textContent = `${collected}/${knowledgeOrbs.length}`
  if (collected >= knowledgeOrbs.length) {
    finished = true
    winCard.hidden = false
  }
  continueButton.disabled = false
}

continueButton.addEventListener('click', () => {
  pausedForQuiz = finished
  activeOrb = null
})

playAgainButton.addEventListener('click', () => {
  knowledgeOrbs.forEach((orb) => { orb.collected = false; orb.mesh.visible = true })
  score = 0
  collected = 0
  finished = false
  pausedForQuiz = false
  activeOrb = null
  scoreElement.textContent = '0'
  orbsElement.textContent = `0/${knowledgeOrbs.length}`
  winCard.hidden = true
  resetCar()
})

function animate() {
  const dt = Math.min(clock.getDelta(), 0.033)
  updateVehicle(dt)
  knowledgeOrbs.forEach((orb, index) => {
    if (orb.collected) return
    orb.mesh.rotation.y += dt * 1.6
    orb.mesh.rotation.x += dt * 0.7
    const pulse = 1 + Math.sin(clock.elapsedTime * 4 + index) * 0.08
    orb.mesh.scale.setScalar(pulse)
    orb.mesh.position.y = 1.1 + Math.sin(clock.elapsedTime * 2 + index) * 0.18
  })
  pickupParticles.forEach((particle, index) => {
    particle.life -= dt
    particle.velocity.y -= dt * 2.2
    particle.mesh.position.addScaledVector(particle.velocity, dt)
    particle.mesh.scale.setScalar(Math.max(0.05, particle.life / particle.maxLife))
    if (particle.life <= 0) {
      scene.remove(particle.mesh)
      pickupParticles.splice(index, 1)
    }
  })
  checkOrbs()
  updateCamera(dt)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

resize()
resetCar()
animate()
