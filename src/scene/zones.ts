import * as THREE from 'three'
import { zoneLessons, type ZoneId } from '../content/lessons'

export const zones: Record<ZoneId, { title: string; color: number; position: THREE.Vector3; lesson: string }> = {
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
