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
    <div class="joystick" id="joystick" aria-label="Drag to steer and drive">
      <div class="joystick-knob" id="joystick-knob"></div>
    </div>
    <div class="touch-actions">
      <button id="touch-brake" aria-label="Brake">Brake</button>
      <button id="touch-reset" aria-label="Reset car">Reset</button>
    </div>
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
const joystick = document.querySelector<HTMLElement>('#joystick')!
const joystickKnob = document.querySelector<HTMLElement>('#joystick-knob')!
const touchBrake = document.querySelector<HTMLButtonElement>('#touch-brake')!
const touchReset = document.querySelector<HTMLButtonElement>('#touch-reset')!

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfe7ff)
scene.fog = new THREE.Fog(0xbfe7ff, 35, 85)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 160)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xbfe7ff, 1)
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
const windshield = new THREE.Mesh(
  new THREE.BoxGeometry(1.18, 0.08, 0.74),
  new THREE.MeshStandardMaterial({ color: 0x86d7ff, roughness: 0.18, metalness: 0.05 }),
)
windshield.position.set(0, 1.54, 0.38)
windshield.rotation.x = -0.42
car.add(windshield)
const roofRack = new THREE.Group()
;[-0.42, 0.42].forEach((x) => {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.35), new THREE.MeshStandardMaterial({ color: 0x5b3b2e, roughness: 0.7 }))
  rail.position.set(x, 1.56, -0.28)
  rail.castShadow = true
  roofRack.add(rail)
})
roofRack.position.y = 0.08
car.add(roofRack)
;[-0.58, 0.58].forEach((x) => {
  const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 8), new THREE.MeshStandardMaterial({ color: 0xfff2a8, emissive: 0xffc65a, emissiveIntensity: 0.9 }))
  headlight.position.set(x, 0.74, 1.62)
  car.add(headlight)
})
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


function addFenceLine(startX: number, z: number, count: number, spacing: number, color = 0xd9b06f) {
  for (let i = 0; i < count; i += 1) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.16), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }))
    post.position.set(startX + i * spacing, 0.4, z)
    post.castShadow = true
    scene.add(post)
    if (i < count - 1) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(spacing, 0.12, 0.12), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }))
      rail.position.set(startX + i * spacing + spacing / 2, 0.62, z)
      rail.castShadow = true
      scene.add(rail)
    }
  }
}

function addArchGate(x: number, z: number, color: number, rotation = 0) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.74 })
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.5, 0.45), material)
  left.position.set(-1.35, 1.25, 0)
  const right = left.clone()
  right.position.x = 1.35
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.42, 0.5), material)
  lintel.position.y = 2.55
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.15, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), material)
  dome.position.y = 2.72
  group.add(left, right, lintel, dome)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
}

function addLantern(x: number, z: number, color = 0xffd166) {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.1, 8), new THREE.MeshStandardMaterial({ color: 0x5b3b2e }))
  pole.position.set(x, 1.05, z)
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.75, roughness: 0.4 }))
  lamp.position.set(x, 2.26, z)
  pole.castShadow = true
  lamp.castShadow = true
  scene.add(pole, lamp)
}

function addBookStack(x: number, z: number) {
  const colors = [0x2b6eea, 0xffd166, 0x22a06b, 0xd84b38]
  colors.forEach((color, i) => {
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.52), new THREE.MeshStandardMaterial({ color, roughness: 0.65 }))
    book.position.set(x, 0.15 + i * 0.17, z)
    book.rotation.y = (i - 1.5) * 0.16
    book.castShadow = true
    scene.add(book)
  })
}

function addPlanter(x: number, z: number) {
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.34, 0.62), new THREE.MeshStandardMaterial({ color: 0x9b623a, roughness: 0.75 }))
  box.position.set(x, 0.2, z)
  const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.9, 6), new THREE.MeshStandardMaterial({ color: 0x2f8f46, roughness: 0.82 }))
  sprout.position.set(x, 0.83, z)
  box.castShadow = true
  sprout.castShadow = true
  scene.add(box, sprout)
}

function addFountain(x: number, z: number) {
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.25, 0.36, 24), new THREE.MeshStandardMaterial({ color: 0xd6e3dd, roughness: 0.62 }))
  basin.position.set(x, 0.18, z)
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0x86d7ff, transparent: true, opacity: 0.72, roughness: 0.12 }))
  water.position.set(x, 0.4, z)
  const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 12), new THREE.MeshStandardMaterial({ color: 0x86d7ff, emissive: 0x2b6eea, emissiveIntensity: 0.35, transparent: true, opacity: 0.65 }))
  jet.position.set(x, 1.0, z)
  basin.castShadow = true
  scene.add(basin, water, jet)
}

function addSmallHouse(x: number, z: number, color: number) {
  const group = new THREE.Group()
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 2.0), new THREE.MeshStandardMaterial({ color, roughness: 0.78 }))
  base.position.y = 0.68
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.95, 4), new THREE.MeshStandardMaterial({ color: 0x8c4b31, roughness: 0.85 }))
  roof.position.y = 1.72
  roof.rotation.y = Math.PI / 4
  group.add(base, roof)
  group.position.set(x, 0, z)
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
}

function addZoneSetDressing(id: ZoneId, position: THREE.Vector3, color: number) {
  addArchGate(position.x, position.z + 6.3, color, Math.PI)
  addLantern(position.x - 4.6, position.z + 4.4, color)
  addLantern(position.x + 4.6, position.z + 4.4, color)
  if (id === 'adab') {
    addFountain(position.x - 5.2, position.z - 0.6)
    addFenceLine(position.x - 7, position.z - 5.6, 8, 1.8, 0xd9b06f)
  }
  if (id === 'ilmu') {
    addBookStack(position.x - 5.5, position.z + 0.4)
    addBookStack(position.x + 5.1, position.z - 1.8)
    addBookStack(position.x + 3.2, position.z + 4.6)
  }
  if (id === 'sadaqah') {
    ;[-5.4, -3.6, 3.6, 5.4].forEach((dx) => addPlanter(position.x + dx, position.z + 1.2))
    addFenceLine(position.x - 7.2, position.z - 5.6, 9, 1.8, 0x9b623a)
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
  addZoneSetDressing(id as ZoneId, zone.position, zone.color)
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
;[[-22, -20, 0xd9b06f], [-18, 14, 0xe9a66b], [20, -18, 0xffd166], [23, 15, 0xc1d9a3], [-25, 4, 0xf2c2a0], [25, -2, 0x9bc6d8]].forEach(([x, z, color]) => addSmallHouse(x, z, color))

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
const touchInput = { throttle: 0, steer: 0, brake: false, activePointerId: -1 }
function setJoystickFromPointer(event: PointerEvent) {
  const rect = joystick.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const max = rect.width * 0.34
  const dx = THREE.MathUtils.clamp(event.clientX - cx, -max, max)
  const dy = THREE.MathUtils.clamp(event.clientY - cy, -max, max)
  touchInput.steer = THREE.MathUtils.clamp(dx / max, -1, 1)
  touchInput.throttle = THREE.MathUtils.clamp(-dy / max, -1, 1)
  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`
}
joystick.addEventListener('pointerdown', (event) => {
  event.preventDefault()
  touchInput.activePointerId = event.pointerId
  joystick.setPointerCapture(event.pointerId)
  setJoystickFromPointer(event)
})
joystick.addEventListener('pointermove', (event) => {
  if (event.pointerId === touchInput.activePointerId) setJoystickFromPointer(event)
})
function releaseJoystick(event?: PointerEvent) {
  if (event && event.pointerId !== touchInput.activePointerId) return
  touchInput.activePointerId = -1
  touchInput.throttle = 0
  touchInput.steer = 0
  joystickKnob.style.transform = 'translate(0, 0)'
}
joystick.addEventListener('pointerup', releaseJoystick)
joystick.addEventListener('pointercancel', releaseJoystick)
touchBrake.addEventListener('pointerdown', (event) => { event.preventDefault(); touchInput.brake = true })
touchBrake.addEventListener('pointerup', () => { touchInput.brake = false })
touchBrake.addEventListener('pointercancel', () => { touchInput.brake = false })
touchReset.addEventListener('click', resetCar)

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
  const forward = keys.has('w') || keys.has('arrowup') || touchInput.throttle > 0.16
  const backward = keys.has('s') || keys.has('arrowdown') || touchInput.throttle < -0.28
  const left = keys.has('a') || keys.has('arrowleft')
  const right = keys.has('d') || keys.has('arrowright')
  const braking = keys.has(' ') || touchInput.brake

  const touchAccel = Math.abs(touchInput.throttle) > 0.16 ? touchInput.throttle * 10 : 0
  const acceleration = touchAccel || (forward ? 10 : backward ? -7 : 0)
  speed += acceleration * dt
  speed *= braking ? 0.84 : 0.975
  speed = THREE.MathUtils.clamp(speed, -8, 13)

  wheelMeshes.forEach((wheel) => {
    wheel.rotation.x += speed * dt * 2.4
  })

  const keyboardSteering = (left ? 1 : 0) + (right ? -1 : 0)
  const steering = Math.abs(touchInput.steer) > 0.08 ? -touchInput.steer : keyboardSteering
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
  const mobile = window.innerWidth < 720
  const behind = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y)).multiplyScalar(mobile ? -10 : -8)
  const targetPosition = car.position.clone().add(behind).add(new THREE.Vector3(0, mobile ? 6.2 : 5.2, 0))
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
