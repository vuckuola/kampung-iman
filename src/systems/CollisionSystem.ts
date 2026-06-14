import * as THREE from 'three'

export type ColliderType = 'circle' | 'box' | 'boundary'

export interface BaseCollider {
  type: ColliderType
  label: string
  center: THREE.Vector3
  halfExtents?: THREE.Vector3
  radius?: number
  isStatic?: boolean
}

export interface CircleCollider extends BaseCollider {
  type: 'circle'
  radius: number
}

export interface BoxCollider extends BaseCollider {
  type: 'box'
  halfExtents: THREE.Vector3
}

export interface BoundaryCollider extends BaseCollider {
  type: 'boundary'
  halfExtents: THREE.Vector3
}

export type Collider = CircleCollider | BoxCollider | BoundaryCollider

function isCircle(c: Collider): c is CircleCollider { return c.type === 'circle' && c.radius !== undefined }
function isBox(c: Collider): c is BoxCollider { return c.type === 'box' && c.halfExtents !== undefined }
function isBoundary(c: Collider): c is BoundaryCollider { return c.type === 'boundary' && c.halfExtents !== undefined }

export class CollisionSystem {
  private colliders: Collider[] = []
  private playerRadius: number

  constructor(playerRadius = 0.72) {
    this.playerRadius = playerRadius
  }

  setPlayerRadius(radius: number) {
    this.playerRadius = radius
  }

  add(collider: Collider) {
    this.colliders.push(collider)
  }

  addCircle(center: THREE.Vector3, radius: number, label: string, isStatic = true) {
    this.colliders.push({
      type: 'circle',
      center: center.clone(),
      radius,
      label,
      isStatic,
    })
  }

  addBox(center: THREE.Vector3, halfExtents: THREE.Vector3, label: string, isStatic = true) {
    this.colliders.push({
      type: 'box',
      center: center.clone(),
      halfExtents: halfExtents.clone(),
      label,
      isStatic,
    })
  }

  addBoundary(center: THREE.Vector3, halfExtents: THREE.Vector3, label: string) {
    this.colliders.push({
      type: 'boundary',
      center: center.clone(),
      halfExtents: halfExtents.clone(),
      label,
      isStatic: true,
    })
  }

  clear() {
    this.colliders = []
  }

  getAll(): Collider[] {
    return [...this.colliders]
  }

  getByLabel(label: string): Collider | undefined {
    return this.colliders.find(c => c.label === label)
  }

  removeByLabel(label: string): boolean {
    const idx = this.colliders.findIndex(c => c.label === label)
    if (idx >= 0) {
      this.colliders.splice(idx, 1)
      return true
    }
    return false
  }

  checkCollision(position: THREE.Vector3): Collider | null {
    for (const c of this.colliders) {
      if (isCircle(c)) {
        const dx = position.x - c.center.x
        const dz = position.z - c.center.z
        const distance = Math.hypot(dx, dz) || 0.0001
        if (distance < c.radius + this.playerRadius) return c
      } else if (isBox(c)) {
        const hx = c.halfExtents!.x + this.playerRadius
        const hz = c.halfExtents!.z + this.playerRadius
        if (
          Math.abs(position.x - c.center.x) < hx &&
          Math.abs(position.z - c.center.z) < hz
        ) return c
      } else if (isBoundary(c)) {
        const hx = c.halfExtents!.x
        const hz = c.halfExtents!.z
        if (
          position.x < c.center.x - hx ||
          position.x > c.center.x + hx ||
          position.z < c.center.z - hz ||
          position.z > c.center.z + hz
        ) return c
      }
    }
    return null
  }

  resolveCollisions(position: THREE.Vector3, speed: number): { position: THREE.Vector3; speed: number } {
    let newPos = position.clone()
    let newSpeed = speed
    let iterations = 0
    const maxIterations = 3

    while (iterations < maxIterations) {
      let hit = false
      for (const c of this.colliders) {
        if (isCircle(c)) {
          const dx = newPos.x - c.center.x
          const dz = newPos.z - c.center.z
          const distance = Math.hypot(dx, dz) || 0.0001
          const minDist = c.radius + this.playerRadius
          if (distance < minDist) {
            const push = minDist - distance
            newPos.x += (dx / distance) * push
            newPos.z += (dz / distance) * push
            newSpeed *= 0.35
            hit = true
          }
        } else if (isBox(c)) {
          const hx = c.halfExtents!.x + this.playerRadius
          const hz = c.halfExtents!.z + this.playerRadius
          const dx = newPos.x - c.center.x
          const dz = newPos.z - c.center.z
          if (Math.abs(dx) < hx && Math.abs(dz) < hz) {
            const overlapX = hx - Math.abs(dx)
            const overlapZ = hz - Math.abs(dz)
            if (overlapX < overlapZ) {
              newPos.x += dx >= 0 ? overlapX : -overlapX
            } else {
              newPos.z += dz >= 0 ? overlapZ : -overlapZ
            }
            newSpeed *= 0.4
            hit = true
          }
        } else if (isBoundary(c)) {
          const hx = c.halfExtents!.x
          const hz = c.halfExtents!.z
          let pushed = false
          if (newPos.x < c.center.x - hx + this.playerRadius) {
            newPos.x = c.center.x - hx + this.playerRadius
            pushed = true
          } else if (newPos.x > c.center.x + hx - this.playerRadius) {
            newPos.x = c.center.x + hx - this.playerRadius
            pushed = true
          }
          if (newPos.z < c.center.z - hz + this.playerRadius) {
            newPos.z = c.center.z - hz + this.playerRadius
            pushed = true
          } else if (newPos.z > c.center.z + hz - this.playerRadius) {
            newPos.z = c.center.z + hz - this.playerRadius
            pushed = true
          }
          if (pushed) {
            newSpeed *= 0.5
            hit = true
          }
        }
      }
      if (!hit) break
      iterations++
    }

    return { position: newPos, speed: newSpeed }
  }

  debugDraw(_scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group()
    const circleGeo = new THREE.RingGeometry(0.05, 0.06, 16)
    const boxGeo = new THREE.BoxGeometry(1, 0.02, 1)
    const matOk = new THREE.MeshBasicMaterial({ color: 0x44ff44, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })

    for (const c of this.colliders) {
      if (isCircle(c)) {
        const mesh = new THREE.Mesh(circleGeo, matOk)
        mesh.position.set(c.center.x, 0.1, c.center.z)
        mesh.rotation.x = -Math.PI / 2
        mesh.scale.setScalar(c.radius * 2)
        group.add(mesh)
      } else if (isBox(c)) {
        const mesh = new THREE.Mesh(boxGeo, matOk)
        mesh.position.set(c.center.x, 0.1, c.center.z)
        mesh.scale.set(c.halfExtents!.x * 2, 1, c.halfExtents!.z * 2)
        group.add(mesh)
      } else if (isBoundary(c)) {
        const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(c.halfExtents!.x * 2, 0.1, c.halfExtents!.z * 2))
        const mesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 }))
        mesh.position.set(c.center.x, 0.05, c.center.z)
        group.add(mesh)
      }
    }
    return group
  }
}