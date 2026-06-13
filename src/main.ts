import * as THREE from 'three'
import './style.css'
import { quizzes, type Quiz, type ZoneId } from './content/lessons'
import { mountApp, getUIElements } from './ui/dom'
import { zones } from './scene/zones'

type KnowledgeOrb = {
  mesh: THREE.Object3D
  zone: ZoneId
  quiz: Quiz
  collected: boolean
}

mountApp()
const {
  canvas,
  scoreElement,
  currentZoneElement,
  playerLabel,
  orbsElement,
  lessonCard,
  quizModal,
  quizZone,
  quizQuestion,
  quizChoices,
  quizFeedback,
  quizSource,
  continueButton,
  winCard,
  playAgainButton,
  startScreen,
  startGameButton,
  playerNameInput,
  audioToggle,
  joystick,
  joystickKnob,
  touchBrake,
  touchReset,
} = getUIElements()

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfe7ff)
scene.fog = new THREE.Fog(0xbfe7ff, 35, 85)

const textureLoader = new THREE.TextureLoader()
textureLoader.load('./assets/kampung-iman-skybox.png', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace
  scene.background = texture
})

function createCanvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = size
  textureCanvas.height = size
  const ctx = textureCanvas.getContext('2d')!
  draw(ctx, size)
  const texture = new THREE.CanvasTexture(textureCanvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function repeated(texture: THREE.Texture, x: number, y: number) {
  const clone = texture.clone()
  clone.wrapS = THREE.RepeatWrapping
  clone.wrapT = THREE.RepeatWrapping
  clone.repeat.set(x, y)
  clone.needsUpdate = true
  return clone
}

const grassTexture = createCanvasTexture(256, (ctx, size) => {
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#8fca6b')
  gradient.addColorStop(1, '#5fa25d')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 120; i += 1) {
    const x = (i * 37) % size
    const y = (i * 71) % size
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,237,158,0.18)' : 'rgba(27,91,52,0.18)'
    ctx.lineWidth = 1 + (i % 2)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 8, y - 13)
    ctx.stroke()
  }
})

const roadTexture = createCanvasTexture(256, (ctx, size) => {
  ctx.fillStyle = '#665a4b'
  ctx.fillRect(0, 0, size, size)
  for (let y = 0; y < size; y += 34) {
    for (let x = 0; x < size; x += 52) {
      ctx.fillStyle = (x + y) % 3 ? 'rgba(255,244,214,0.08)' : 'rgba(35,27,20,0.10)'
      ctx.fillRect(x + ((y / 34) % 2) * 18, y, 42, 22)
    }
  }
  ctx.strokeStyle = 'rgba(255,251,226,0.12)'
  ctx.lineWidth = 2
  for (let y = 0; y < size; y += 34) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke()
  }
})

const plasterTexture = createCanvasTexture(256, (ctx, size) => {
  ctx.fillStyle = '#e8c27c'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 180; i += 1) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.12)' : 'rgba(119,71,38,0.10)'
    ctx.beginPath()
    ctx.arc((i * 47) % size, (i * 83) % size, 1 + (i % 4), 0, Math.PI * 2)
    ctx.fill()
  }
})

const roofTexture = createCanvasTexture(256, (ctx, size) => {
  ctx.fillStyle = '#6b3f30'
  ctx.fillRect(0, 0, size, size)
  for (let y = 0; y < size; y += 28) {
    for (let x = -20; x < size; x += 40) {
      ctx.fillStyle = 'rgba(255,209,102,0.12)'
      ctx.beginPath()
      ctx.ellipse(x + ((y / 28) % 2) * 20, y, 24, 11, 0, 0, Math.PI)
      ctx.fill()
    }
  }
})

const woodTexture = createCanvasTexture(256, (ctx, size) => {
  ctx.fillStyle = '#8b5a2b'
  ctx.fillRect(0, 0, size, size)
  for (let x = 0; x < size; x += 18) {
    ctx.strokeStyle = x % 36 ? 'rgba(255,222,154,0.18)' : 'rgba(54,31,18,0.18)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 12, 80, x - 12, 160, x + 8, size); ctx.stroke()
  }
})

const leafTexture = createCanvasTexture(128, (ctx, size) => {
  ctx.fillStyle = '#2f8f46'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 60; i += 1) {
    ctx.strokeStyle = i % 2 ? 'rgba(180,240,150,0.24)' : 'rgba(8,72,38,0.2)'
    ctx.beginPath(); ctx.moveTo((i * 29) % size, (i * 17) % size); ctx.lineTo(((i * 29) % size) + 16, ((i * 17) % size) - 9); ctx.stroke()
  }
})

const carPaintTexture = createCanvasTexture(128, (ctx, size) => {
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#ff7058')
  gradient.addColorStop(0.5, '#d84b38')
  gradient.addColorStop(1, '#9d2f25')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = 'rgba(255,255,255,0.16)'
  ctx.fillRect(0, 18, size, 10)
})
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
  new THREE.MeshStandardMaterial({ color: 0x8fca6b, map: repeated(grassTexture, 18, 18), roughness: 0.95 }),
)
ground.receiveShadow = true
ground.position.y = -0.22
scene.add(ground)

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x665a4b, map: repeated(roadTexture, 2, 12), roughness: 0.88 })
const mainRoad = new THREE.Mesh(new THREE.BoxGeometry(7, 0.05, 52), roadMaterial)
mainRoad.position.set(0, 0.03, 0)
mainRoad.receiveShadow = true
scene.add(mainRoad)
const crossRoad = new THREE.Mesh(new THREE.BoxGeometry(36, 0.052, 6), roadMaterial)
crossRoad.position.set(0, 0.04, -5)
crossRoad.receiveShadow = true
scene.add(crossRoad)
addSoftPath(-7.6, -5, 12, 3.2, 0.08)
addSoftPath(0, 8.2, 3.3, 14, -0.05)
addSoftPath(7.8, -5, 12, 3.2, -0.08)

for (let z = -24; z <= 24; z += 4) {
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.065, 1.7), new THREE.MeshStandardMaterial({ color: 0xfff4d6, roughness: 0.7 }))
  stripe.position.set(0, 0.085, z)
  stripe.receiveShadow = true
  scene.add(stripe)
}
for (let x = -15; x <= 15; x += 4) {
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.066, 0.3), new THREE.MeshStandardMaterial({ color: 0xfff4d6, roughness: 0.7 }))
  stripe.position.set(x, 0.09, -5)
  stripe.receiveShadow = true
  scene.add(stripe)
}

const car = new THREE.Group()
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.62, 0.74, 1.45, 16),
  new THREE.MeshStandardMaterial({ color: 0x2b6eea, map: repeated(plasterTexture, 1, 1), roughness: 0.72 }),
)
body.position.y = 0.95
body.castShadow = true
car.add(body)
const cabin = new THREE.Mesh(
  new THREE.SphereGeometry(0.38, 18, 12),
  new THREE.MeshStandardMaterial({ color: 0xd9a06d, roughness: 0.78 }),
)
cabin.position.set(0, 1.85, 0)
cabin.castShadow = true
car.add(cabin)
const scarf = new THREE.Mesh(
  new THREE.ConeGeometry(0.55, 0.92, 18),
  new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.76 }),
)
scarf.position.set(0, 1.72, -0.03)
scarf.castShadow = true
car.add(scarf)
const cap = new THREE.Mesh(
  new THREE.CylinderGeometry(0.39, 0.39, 0.18, 18),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.66 }),
)
cap.position.set(0, 2.15, 0)
cap.castShadow = true
cap.visible = false
car.add(cap)
const backpack = new THREE.Mesh(
  new THREE.BoxGeometry(0.46, 0.72, 0.18),
  new THREE.MeshStandardMaterial({ color: 0x14523e, map: repeated(carPaintTexture, 1, 1), roughness: 0.72 }),
)
backpack.position.set(0, 1.08, -0.63)
backpack.castShadow = true
car.add(backpack)
const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.62, 10), new THREE.MeshStandardMaterial({ color: 0x1d2433, roughness: 0.82 }))
const rightLeg = leftLeg.clone()
leftLeg.position.set(-0.24, 0.32, 0)
rightLeg.position.set(0.24, 0.32, 0)
leftLeg.castShadow = rightLeg.castShadow = true
car.add(leftLeg, rightLeg)
const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.78, 10), new THREE.MeshStandardMaterial({ color: 0xd9a06d, roughness: 0.78 }))
const rightArm = leftArm.clone()
leftArm.position.set(-0.68, 1.08, 0.05)
rightArm.position.set(0.68, 1.08, 0.05)
leftArm.rotation.z = 0.28
rightArm.rotation.z = -0.28
leftArm.castShadow = rightArm.castShadow = true
car.add(leftArm, rightArm)
const characterShadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.95, 32),
  new THREE.MeshBasicMaterial({ color: 0x173a30, transparent: true, opacity: 0.18 }),
)
characterShadow.rotation.x = -Math.PI / 2
characterShadow.position.y = 0.015
car.add(characterShadow)
const wheelMeshes: THREE.Mesh[] = []
car.position.set(0, 0, 0)
scene.add(car)

type CharacterChoice = 'girl' | 'boy'
let selectedCharacter: CharacterChoice = 'girl'
let playerName = 'Aisyah'
let gameStarted = false
function applyCharacterChoice(choice: CharacterChoice) {
  selectedCharacter = choice
  const robe = body.material as THREE.MeshStandardMaterial
  if (choice === 'girl') {
    robe.color.setHex(0x7b5fd6)
    scarf.visible = true
    cap.visible = false
    playerNameInput.value = playerNameInput.value || 'Aisyah'
  } else {
    robe.color.setHex(0x2b6eea)
    scarf.visible = false
    cap.visible = true
    playerNameInput.value = playerNameInput.value || 'Raihan'
  }
}

type Collider = { center: THREE.Vector3; radius: number; label: string }
const colliders: Collider[] = []
function addCollider(center: THREE.Vector3, radius: number, label: string) {
  colliders.push({ center: center.clone(), radius, label })
}

function addLowPolyTree(x: number, z: number, scale = 1) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, 1.2 * scale, 5),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b, map: repeated(woodTexture, 1, 3), roughness: 0.82 }),
  )
  trunk.position.set(x, 0.6 * scale, z)
  trunk.castShadow = true
  scene.add(trunk)
  addCollider(new THREE.Vector3(x, 0, z), 0.62 * scale, 'tree')
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.9 * scale, 1.7 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x2f8f46, map: repeated(leafTexture, 1, 1), roughness: 0.84 }),
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
  addCollider(new THREE.Vector3(x, 0, z), 2.5, 'ramp')
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
  const material = new THREE.MeshStandardMaterial({ color, map: repeated(plasterTexture, 1, 2), roughness: 0.74 })
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
  addCollider(new THREE.Vector3(x, 0, z), 1.7, 'arch gate')
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
  addCollider(new THREE.Vector3(x, 0, z), 0.85, 'planter')
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
  addCollider(new THREE.Vector3(x, 0, z), 1.35, 'fountain')
}

function addSmallHouse(x: number, z: number, color: number) {
  const group = new THREE.Group()
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 2.0), new THREE.MeshStandardMaterial({ color, map: repeated(plasterTexture, 1, 1), roughness: 0.78 }))
  base.position.y = 0.68
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.95, 4), new THREE.MeshStandardMaterial({ color: 0x8c4b31, map: repeated(roofTexture, 1, 1), roughness: 0.85 }))
  roof.position.y = 1.72
  roof.rotation.y = Math.PI / 4
  group.add(base, roof)
  group.position.set(x, 0, z)
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 1.9, 'house')
}


function addBench(x: number, z: number, rotation = 0) {
  const group = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: 0x9b623a, map: repeated(woodTexture, 1, 1), roughness: 0.78 })
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.18, 0.42), wood)
  seat.position.y = 0.48
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.16, 0.36), wood)
  back.position.set(0, 0.82, -0.28)
  back.rotation.x = -0.16
  ;[-0.55, 0.55].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.48, 8), wood)
    leg.position.set(lx, 0.24, 0.12)
    group.add(leg)
  })
  group.add(seat, back)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 0.9, 'bench')
}

function addSignpost(x: number, z: number, text: string, color: number, rotation = 0) {
  const group = new THREE.Group()
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.45, 8), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, map: repeated(woodTexture, 1, 2), roughness: 0.82 }))
  post.position.y = 0.72
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.5, 0.12), new THREE.MeshStandardMaterial({ color: 0xfffbdf, roughness: 0.66 }))
  board.position.y = 1.34
  const label = makeLabelSprite(text, `#${color.toString(16).padStart(6, '0')}`)
  label.position.set(0, 1.78, 0.08)
  label.scale.set(1.65, 0.42, 1)
  group.add(post, board, label)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 0.42, 'signpost')
}

function addFlowerBed(x: number, z: number, color = 0xffd166) {
  const group = new THREE.Group()
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.98, 0.18, 18), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.84 }))
  soil.position.y = 0.1
  group.add(soil)
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.38, 6), new THREE.MeshStandardMaterial({ color: 0x2f8f46, roughness: 0.8 }))
    stem.position.set(Math.cos(angle) * 0.42, 0.32, Math.sin(angle) * 0.32)
    const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshStandardMaterial({ color: i % 2 ? color : 0xf2a0b8, roughness: 0.7 }))
    bloom.position.set(stem.position.x, 0.56, stem.position.z)
    group.add(stem, bloom)
  }
  group.position.set(x, 0, z)
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 0.85, 'flower bed')
}

function addChalkboard(x: number, z: number, rotation = 0) {
  const group = new THREE.Group()
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.15, 0.12), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, map: repeated(woodTexture, 1, 1), roughness: 0.8 }))
  frame.position.y = 1.15
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.9, 0.13), new THREE.MeshStandardMaterial({ color: 0x14523e, roughness: 0.92 }))
  board.position.set(0, 1.16, 0.02)
  ;[-0.7, 0.7].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 }))
    leg.position.set(lx, 0.42, 0)
    group.add(leg)
  })
  group.add(frame, board)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 1.05, 'chalkboard')
}

function addMarketStall(x: number, z: number, rotation = 0) {
  const group = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: 0x9b623a, map: repeated(woodTexture, 1, 1), roughness: 0.8 })
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.62, 0.9), wood)
  counter.position.y = 0.42
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.18, 1.28), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.72 }))
  canopy.position.y = 1.72
  ;[-0.9, 0.9].forEach((lx) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 1.5, 8), wood)
    pole.position.set(lx, 0.95, -0.32)
    group.add(pole)
  })
  for (let i = 0; i < 4; i += 1) {
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf0a629 : 0x8fca6b, roughness: 0.65 }))
    fruit.position.set(-0.62 + i * 0.42, 0.86, 0.03)
    group.add(fruit)
  }
  group.add(counter, canopy)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 1.35, 'market stall')
}

function addDonationBox(x: number, z: number) {
  const group = new THREE.Group()
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.62, 0.68), new THREE.MeshStandardMaterial({ color: 0x2f7d5c, roughness: 0.72 }))
  box.position.y = 0.36
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.1, 0.76), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.64 }))
  lid.position.y = 0.72
  group.add(box, lid)
  group.position.set(x, 0, z)
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 0.72, 'donation box')
}

function addWaterStand(x: number, z: number) {
  const stand = new THREE.Group()
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.8, 14), new THREE.MeshStandardMaterial({ color: 0x8ecae6, roughness: 0.46 }))
  base.position.y = 0.44
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.28, 12), new THREE.MeshStandardMaterial({ color: 0xfffbdf, roughness: 0.5 }))
  cup.position.set(0.42, 0.62, 0)
  stand.add(base, cup)
  stand.position.set(x, 0, z)
  stand.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(stand)
  addCollider(new THREE.Vector3(x, 0, z), 0.58, 'water stand')
}

function addSandalRack(x: number, z: number, rotation = 0) {
  const group = new THREE.Group()
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 0.48), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, map: repeated(woodTexture, 1, 1), roughness: 0.82 }))
  rack.position.y = 0.22
  ;[-0.32, 0.28].forEach((sx) => {
    const sandal = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.46), new THREE.MeshStandardMaterial({ color: 0x5b3b2e, roughness: 0.76 }))
    sandal.position.set(sx, 0.37, 0.02)
    group.add(sandal)
  })
  group.add(rack)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
  addCollider(new THREE.Vector3(x, 0, z), 0.72, 'sandal rack')
}

function addBroom(x: number, z: number, rotation = 0) {
  const group = new THREE.Group()
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 }))
  handle.position.y = 0.75
  handle.rotation.z = 0.32
  const brush = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 8), new THREE.MeshStandardMaterial({ color: 0xd9b06f, roughness: 0.86 }))
  brush.position.set(0.2, 0.18, 0)
  brush.rotation.z = 0.32
  group.add(handle, brush)
  group.position.set(x, 0, z)
  group.rotation.y = rotation
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  scene.add(group)
}

function addSoftPath(x: number, z: number, width: number, depth: number, rotation = 0) {
  const path = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.035, depth),
    new THREE.MeshStandardMaterial({ color: 0xd9b06f, map: repeated(roadTexture, Math.max(1, width / 5), Math.max(1, depth / 5)), roughness: 0.9 }),
  )
  path.position.set(x, 0.075, z)
  path.rotation.y = rotation
  path.receiveShadow = true
  scene.add(path)
}

function addZoneGroundPatch(position: THREE.Vector3, color: number) {
  const patch = new THREE.Mesh(
    new THREE.CylinderGeometry(7.2, 7.8, 0.05, 48),
    new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.18, roughness: 0.86 }),
  )
  patch.position.set(position.x, 0.065, position.z)
  patch.receiveShadow = true
  scene.add(patch)
}

function addZoneSetDressing(id: ZoneId, position: THREE.Vector3, color: number) {
  addZoneGroundPatch(position, color)
  addArchGate(position.x, position.z + 6.3, color, Math.PI)
  addLantern(position.x - 4.6, position.z + 4.4, color)
  addLantern(position.x + 4.6, position.z + 4.4, color)
  addSignpost(position.x - 3.6, position.z + 5.2, id === 'adab' ? 'Kindness' : id === 'ilmu' ? 'Learn' : 'Help', color, -0.2)
  if (id === 'adab') {
    addFountain(position.x - 5.2, position.z - 0.6)
    addFenceLine(position.x - 7, position.z - 5.6, 8, 1.8, 0xd9b06f)
    addBench(position.x + 3.6, position.z - 2.6, -0.5)
    addSandalRack(position.x + 5.1, position.z + 0.2, 0.4)
    addWaterStand(position.x - 1.9, position.z - 4.3)
    addBroom(position.x + 1.7, position.z + 3.1, 0.8)
    addFlowerBed(position.x - 3.0, position.z + 2.8, 0xf2a0b8)
  }
  if (id === 'ilmu') {
    addBookStack(position.x - 5.5, position.z + 0.4)
    addBookStack(position.x + 5.1, position.z - 1.8)
    addBookStack(position.x + 3.2, position.z + 4.6)
    addChalkboard(position.x - 3.9, position.z - 3.6, 0.25)
    addBench(position.x + 4.5, position.z + 2.3, 0.45)
    addFlowerBed(position.x - 0.5, position.z - 5.0, 0x8ecae6)
  }
  if (id === 'sadaqah') {
    ;[-5.4, -3.6, 3.6, 5.4].forEach((dx) => addPlanter(position.x + dx, position.z + 1.2))
    addFenceLine(position.x - 7.2, position.z - 5.6, 9, 1.8, 0x9b623a)
    addMarketStall(position.x - 4.6, position.z - 2.4, 0.35)
    addDonationBox(position.x + 3.8, position.z - 3.6)
    addWaterStand(position.x + 5.5, position.z + 3.5)
    addFlowerBed(position.x + 0.5, position.z + 4.6, 0xffd166)
  }
}

function addBuilding(position: THREE.Vector3, color: number, label: string) {
  const group = new THREE.Group()
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(5.4, 2.2, 4.6),
    new THREE.MeshStandardMaterial({ color, map: repeated(plasterTexture, 2, 1), roughness: 0.76 }),
  )
  base.position.y = 1.1
  base.castShadow = true
  group.add(base)
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.8, 1.4, 4),
    new THREE.MeshStandardMaterial({ color: 0x5b3b2e, map: repeated(roofTexture, 2, 2), roughness: 0.86 }),
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
  addCollider(position, 4.05, label)
}


function createQuestScene(zone: ZoneId, quiz: Quiz, position: THREE.Vector3) {
  const color = zones[zone].color
  const group = new THREE.Group()
  group.position.copy(position)
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 1.12, 0.18, 28),
    new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.78, emissive: color, emissiveIntensity: 0.12, roughness: 0.65 }),
  )
  base.position.y = 0.12
  const npcBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.28, 0.82, 14),
    new THREE.MeshStandardMaterial({ color: zone === 'sadaqah' ? 0xf0a629 : zone === 'ilmu' ? 0x2b6eea : 0x22a06b, roughness: 0.75 }),
  )
  npcBody.position.set(-0.34, 0.72, 0)
  const npcHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), new THREE.MeshStandardMaterial({ color: 0xd9a06d, roughness: 0.8 }))
  npcHead.position.set(-0.34, 1.24, 0)
  const activity = new THREE.Group()
  if (zone === 'ilmu') {
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.46), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.58 }))
    book.position.set(0.32, 0.48, 0)
    activity.add(book)
  } else if (zone === 'sadaqah') {
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.42), new THREE.MeshStandardMaterial({ color: 0x9b623a, map: repeated(woodTexture, 1, 1), roughness: 0.8 }))
    basket.position.set(0.34, 0.45, 0)
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.62 }))
    fruit.position.set(0.24, 0.76, 0.08)
    activity.add(basket, fruit)
  } else {
    const salam = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 10, 24), new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0x22a06b, emissiveIntensity: 0.35 }))
    salam.position.set(0.34, 0.82, 0)
    activity.add(salam)
  }
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.035, 8, 48), new THREE.MeshStandardMaterial({ color: 0xfff3a3, emissive: color, emissiveIntensity: 0.55 }))
  halo.rotation.x = Math.PI / 2
  halo.position.y = 0.18
  const label = makeLabelSprite(zone === 'adab' ? 'Kindness' : zone === 'ilmu' ? 'Learn' : 'Help', `#${color.toString(16).padStart(6, '0')}`)
  label.position.set(0, 1.95, 0)
  label.scale.set(2.4, 0.62, 1)
  group.add(base, npcBody, npcHead, activity, halo, label)
  group.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.castShadow = true })
  group.userData.title = quiz.question
  return group
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
    const activity = createQuestScene(id as ZoneId, quiz, new THREE.Vector3(zone.position.x + Math.cos(angle) * radius, 0, zone.position.z + Math.sin(angle) * radius))
    scene.add(activity)
    knowledgeOrbs.push({ mesh: activity, zone: id as ZoneId, quiz, collected: false })
  })
})

addRamp(-5, -18, 0.35)
addRamp(7, 18, -0.25)
addRamp(18, 4, 1.35)
;[[-22, -20, 0xd9b06f], [-18, 14, 0xe9a66b], [20, -18, 0xffd166], [23, 15, 0xc1d9a3], [-25, 4, 0xf2c2a0], [25, -2, 0x9bc6d8], [-12, -24, 0xc9d7b4], [12, 23, 0xf4cfa0]].forEach(([x, z, color]) => addSmallHouse(x, z, color))
addSignpost(0, -11, 'Village Path', 0x2f7d5c, 0)
addBench(-3.8, -9.4, 0.35)
addBench(4.1, -9.2, -0.35)
addFlowerBed(-6.6, -8.6, 0xf2a0b8)
addFlowerBed(6.8, -8.4, 0xffd166)

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
let audioContext: AudioContext | null = null
let songTimer = 0
const clock = new THREE.Clock()
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
  leftArm.rotation.x = 0
  rightArm.rotation.x = 0
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function updateVehicle(dt: number) {
  if (!gameStarted || pausedForQuiz) return
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
  body.position.y = 0.95 + Math.sin(clock.elapsedTime * 9) * Math.min(Math.abs(speed) / 40, 0.08)

  const direction = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y))
  car.position.addScaledVector(direction, speed * dt)
  colliders.forEach((collider) => {
    const dx = car.position.x - collider.center.x
    const dz = car.position.z - collider.center.z
    const distance = Math.hypot(dx, dz) || 0.0001
    const minDistance = collider.radius + 0.72
    if (distance < minDistance) {
      const push = (minDistance - distance)
      car.position.x += (dx / distance) * push
      car.position.z += (dz / distance) * push
      speed *= 0.35
    }
  })
  car.position.x = THREE.MathUtils.clamp(car.position.x, -31, 31)
  car.position.z = THREE.MathUtils.clamp(car.position.z, -31, 31)
  leftLeg.rotation.x = Math.sin(clock.elapsedTime * 9) * Math.min(Math.abs(speed) / 16, 0.55)
  rightLeg.rotation.x = -leftLeg.rotation.x
  leftArm.rotation.x = -leftLeg.rotation.x * 0.55
  rightArm.rotation.x = leftLeg.rotation.x * 0.55

  const currentZone = Object.values(zones).find((zone) => car.position.distanceTo(zone.position) < 6.5)
  currentZoneElement.textContent = currentZone ? currentZone.title.replace(' Courtyard', '').replace(' Library', '').replace(' Garden', '') : 'Village'
  lessonCard.textContent = currentZone ? `${currentZone.title}: ${zones[(Object.keys(zones) as ZoneId[]).find((id) => zones[id] === currentZone)!].lesson}` : 'Walk to activity circles. Each scene opens a short quest and a wisdom point.'
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
    if (orb.mesh.position.distanceTo(car.position) < 1.9) openQuiz(orb)
  })
}

function openQuiz(orb: KnowledgeOrb) {
  activeOrb = orb
  pausedForQuiz = true
  speed = 0
  quizZone.textContent = `${zones[orb.zone].title} · Activity with ${playerName}`
  quizQuestion.textContent = orb.quiz.question
  quizFeedback.textContent = ''
  quizSource.textContent = `Source: ${orb.quiz.source}`
  continueButton.disabled = true
  quizChoices.innerHTML = ''
  orb.quiz.choices.forEach((choice, index) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = choice
    button.addEventListener('click', () => answerQuiz(index))
    quizChoices.append(button)
  })
  quizModal.classList.remove('answered-correct', 'answered-wrong')
  quizModal.showModal()
  ;(quizChoices.querySelector('button') as HTMLButtonElement | null)?.focus()
}

function answerQuiz(index: number) {
  if (!activeOrb) return
  const correct = index === activeOrb.quiz.answer
  score += correct ? 100 : 25
  collected += 1
  activeOrb.collected = true
  activeOrb.mesh.visible = false
  burstAt(activeOrb.mesh.position, zones[activeOrb.zone].color)
  playPickupSound()
  quizFeedback.textContent = `${correct ? 'Correct!' : 'Good try.'} ${activeOrb.quiz.explanation}`
  quizFeedback.className = correct ? 'feedback correct' : 'feedback wrong'
  quizModal.classList.toggle('answered-correct', correct)
  quizModal.classList.toggle('answered-wrong', !correct)
  Array.from(quizChoices.children).forEach((child, childIndex) => {
    const button = child as HTMLButtonElement
    button.disabled = true
    if (childIndex === activeOrb?.quiz.answer) button.classList.add('right-answer')
  })
  scoreElement.textContent = String(score)
  scoreElement.classList.remove('score-bump')
  void scoreElement.offsetWidth
  scoreElement.classList.add('score-bump')
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


document.querySelectorAll<HTMLButtonElement>('.character-pick').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.character-pick').forEach((item) => { item.classList.remove('selected'); item.setAttribute('aria-pressed', 'false') })
    button.classList.add('selected')
    button.setAttribute('aria-pressed', 'true')
    document.querySelector('#character-preview')?.classList.toggle('boy-selected', button.dataset.character === 'boy')
    applyCharacterChoice((button.dataset.character as CharacterChoice) || 'girl')
  })
})

startGameButton.addEventListener('click', () => {
  playerName = playerNameInput.value.trim() || (selectedCharacter === 'girl' ? 'Aisyah' : 'Raihan')
  playerLabel.textContent = playerName
  startScreen.hidden = true
  gameStarted = true
  lessonCard.textContent = `${playerName}, walk to an activity circle to begin your first quest.`
  initAudio()
})

function initAudio() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') audioContext.resume()
  audioToggle.textContent = 'Sound On'
}

audioToggle.addEventListener('click', () => {
  if (!audioContext) initAudio()
  else if (audioContext.state === 'running') { audioContext.suspend(); audioToggle.textContent = 'Sound Off' }
  else { audioContext.resume(); audioToggle.textContent = 'Sound On' }
})

function playTone(frequency: number, duration = 0.16, gainValue = 0.045) {
  if (!audioContext || audioContext.state !== 'running') return
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0, audioContext.currentTime)
  gain.gain.linearRampToValueAtTime(gainValue, audioContext.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration)
  osc.connect(gain).connect(audioContext.destination)
  osc.start()
  osc.stop(audioContext.currentTime + duration)
}

function playPickupSound() {
  playTone(660, 0.12, 0.05)
  window.setTimeout(() => playTone(880, 0.16, 0.04), 90)
}

function updateAmbientSong(dt: number) {
  if (!audioContext || audioContext.state !== 'running' || !gameStarted || pausedForQuiz) return
  songTimer -= dt
  if (songTimer <= 0) {
    const notes = [392, 440, 494, 587, 494, 440]
    playTone(notes[Math.floor(clock.elapsedTime * 1.4) % notes.length], 0.28, 0.018)
    songTimer = 0.58
  }
}

applyCharacterChoice('girl')

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
  updateAmbientSong(dt)
  knowledgeOrbs.forEach((orb, index) => {
    if (orb.collected) return
    if (!reducedMotion) orb.mesh.rotation.y += dt * 0.45
    const distance = orb.mesh.position.distanceTo(car.position)
    const near = distance < 5
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * (near ? 5 : 2.5) + index) * (near ? 0.11 : 0.04)
    orb.mesh.scale.setScalar(near ? pulse * 1.08 : pulse)
    orb.mesh.position.y = reducedMotion ? 0.8 : 0.8 + Math.sin(clock.elapsedTime * 1.8 + index) * 0.10
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
