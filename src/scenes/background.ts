// ─────────────────────────────────────────
//  BACKGROUND  —  src/scenes/background.ts
//  Three.js low-poly scene.
//  Hover → shape stops + grows.
//  Click → easter egg popup.
// ─────────────────────────────────────────

import * as THREE from 'three'
import { BG_SHAPES } from '@/data'
import type { LowPolyShapeConfig } from '@/types'

interface ShapeUserData {
  phase:number; rotX:number; rotY:number; rotZ:number;
  baseY:number; floatSpd:number; driftX:number; driftZ:number;
  baseOp:number; baseScale:number; hovered:boolean;
}
interface ShapeMesh extends THREE.Mesh { userData: ShapeUserData }

interface ParticleVel { x:number; y:number; phase:number; speed:number }

const EASTER_EGGS = [
  { title:'// fun fact',   text:'seCADviews розпізнає типи розрізів\nточніше ніж більшість джунів.\nАвтор — Veronika.' },
  { title:'// secret',     text:'Цей сайт написаний з нуля.\nБез шаблонів, без готових тем.\nТільки код і кава.' },
  { title:'// про мене',   text:'Я будую інструменти які\nроблять складне — простим.\nІ красивим.' },
  { title:'// технологія', text:'Three.js + TypeScript + Vite.\nКожна сфера — окремий об\'єкт\nз унікальною траєкторією.' },
  { title:'// easter egg',  text:'Ти знайшла це. Значить\nтобі не байдуже до деталей.\nМені теж.' },
]

export class BackgroundScene {
  private renderer: THREE.WebGLRenderer
  private scene:    THREE.Scene
  private camera:   THREE.PerspectiveCamera
  private shapes:   ShapeMesh[] = []
  private particles!: THREE.Points
  private pPos!:    Float32Array
  private pVel:     ParticleVel[] = []
  private mouse   = { x:0, y:0, tx:0, ty:0, cx:0, cy:0 }
  private mouse2d = new THREE.Vector2()
  private raycaster = new THREE.Raycaster()
  private hovered:  ShapeMesh | null = null
  private clock   = new THREE.Clock()
  private raf     = 0
  private _v3     = new THREE.Vector3()
  private eggTimer = 0

  private getCamZ():number {
    if(innerWidth>1400) return 10
    if(innerWidth>860)  return 13
    return 22
  }

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    this.renderer.setSize(innerWidth,innerHeight)
    this.renderer.setClearColor(0x000000,0)
    this.scene  = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,130)
    this.camera.position.set(0,2,this.getCamZ())
    this.addLights()
    this.addShapes()
    this.addParticles()
    this.bindEvents()
  }

  private addLights():void {
    this.scene.add(new THREE.AmbientLight(0xffffff,0.55))
    const d1=new THREE.DirectionalLight(0xc0d8e8,1.1); d1.position.set(7,12,6); this.scene.add(d1)
    const d2=new THREE.DirectionalLight(0xecd0d8,0.65); d2.position.set(-9,-6,4); this.scene.add(d2)
    const d3=new THREE.DirectionalLight(0xd8e8f0,0.35); d3.position.set(0,0,10); this.scene.add(d3)
  }

  private createShape(cfg:LowPolyShapeConfig):ShapeMesh {
    let geo:THREE.BufferGeometry
    switch(cfg.type){
      case 'icosahedron': geo=new THREE.IcosahedronGeometry(1,cfg.detail); break
      case 'octahedron':  geo=new THREE.OctahedronGeometry(1,cfg.detail);  break
      case 'tetrahedron': geo=new THREE.TetrahedronGeometry(1,cfg.detail); break
    }
    const pos=geo.attributes.position
    for(let i=0;i<pos.count;i++){
      pos.setXYZ(i,pos.getX(i)+(Math.random()-.5)*.14,
                   pos.getY(i)+(Math.random()-.5)*.14,
                   pos.getZ(i)+(Math.random()-.5)*.14)
    }
    geo.computeVertexNormals()
    const mat=new THREE.MeshPhongMaterial({color:cfg.color,flatShading:true,transparent:true,opacity:cfg.opacity,shininess:25})
    const m=new THREE.Mesh(geo,mat) as ShapeMesh
    m.position.set(cfg.x,cfg.y,cfg.z); m.scale.setScalar(cfg.scale)
    m.userData={ phase:Math.random()*Math.PI*2, rotX:(Math.random()-.5)*.005,
      rotY:(Math.random()-.5)*.007, rotZ:(Math.random()-.5)*.003,
      baseY:cfg.y, floatSpd:.22+Math.random()*.28,
      driftX:(Math.random()-.5)*.0008, driftZ:(Math.random()-.5)*.0005,
      baseOp:cfg.opacity, baseScale:cfg.scale, hovered:false,
      baseColor:cfg.color }
    return m
  }

  private addShapes():void {
    BG_SHAPES.forEach(cfg=>{ const m=this.createShape(cfg); this.scene.add(m); this.shapes.push(m) })
  }

  private addParticles():void {
    const N=1800
    this.pPos=new Float32Array(N*3)
    const col=new Float32Array(N*3)
    const palette=[[0.70,0.78,0.85],[0.82,0.71,0.76],[0.83,0.86,0.90],[0.75,0.80,0.87]]
    for(let i=0;i<N;i++){
      this.pPos[i*3]=(Math.random()-.5)*46; this.pPos[i*3+1]=(Math.random()-.5)*24; this.pPos[i*3+2]=(Math.random()-.5)*24-3
      const c=palette[i%4]; col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2]
      this.pVel.push({ x:(Math.random()-.5)*.004, y:(Math.random()-.5)*.003, phase:Math.random()*Math.PI*2, speed:.5+Math.random()*.8 })
    }
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position',new THREE.BufferAttribute(this.pPos,3))
    geo.setAttribute('color',new THREE.BufferAttribute(col,3))
    this.particles=new THREE.Points(geo,new THREE.PointsMaterial({size:.065,vertexColors:true,transparent:true,opacity:.45,sizeAttenuation:true}))
    this.scene.add(this.particles)
  }

  private bindEvents():void {
    document.addEventListener('mousemove',this.onMouse)
    // canvas has pointer-events:none — listen on document instead
    document.addEventListener('click',this.onClick)
    window.addEventListener('resize',this.onResize)
  }

  private onMouse=(e:MouseEvent):void=>{
    this.mouse.tx=(e.clientX/innerWidth-.5)*2.4
    this.mouse.ty=-(e.clientY/innerHeight-.5)*1.5
    this.mouse2d.x=(e.clientX/innerWidth)*2-1
    this.mouse2d.y=-(e.clientY/innerHeight)*2+1
    this.mouse.cx=e.clientX
    this.mouse.cy=e.clientY
    const tip=document.getElementById('shape-tooltip')
    if(tip){
      tip.style.left=(e.clientX+14)+'px'
      tip.style.top=(e.clientY-28)+'px'
    }
  }

  private onClick=(e:MouseEvent):void=>{
    const onUI=(e.target as Element).closest('button,a,.glass,.nav-pill,.side-nav-item,.lightbox-btn,.lightbox-close,#easter-egg')
    if(onUI) return
    if(this.hovered) this.showEgg()
    else this.hideEgg()
  }

  private onResize=():void=>{
    this.camera.aspect=innerWidth/innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth,innerHeight)
    this.camera.position.z=this.getCamZ()
  }

  private showEgg():void {
    const msg=EASTER_EGGS[Math.floor(Math.random()*EASTER_EGGS.length)]
    let el=document.getElementById('easter-egg') as HTMLElement
    if(!el){
      el=document.createElement('div'); el.id='easter-egg'
      el.style.cssText='position:fixed;z-index:400;'+
        'background:var(--glass2);border:1px solid var(--border);border-radius:20px;padding:24px 30px;'+
        'backdrop-filter:blur(28px);max-width:260px;width:88vw;text-align:center;'+
        'opacity:0;transform:scale(0.9);transition:opacity .4s,transform .4s;pointer-events:all;cursor:pointer;'
      document.body.appendChild(el)
      el.addEventListener('click',()=>this.hideEgg())
    }
    // Position near cursor, clamped to viewport
    const pw=Math.min(260, innerWidth*.88), ph=140
    let lx=this.mouse.cx+22, ly=this.mouse.cy-ph/2
    if(lx+pw>innerWidth-12) lx=this.mouse.cx-pw-22
    if(lx<12) lx=12
    if(ly<12) ly=12
    if(ly+ph>innerHeight-12) ly=innerHeight-ph-12
    el.style.left=lx+'px'; el.style.top=ly+'px'
    el.style.opacity='0'; el.style.transform='scale(0.9)'
    el.innerHTML=`<div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.3em;text-transform:uppercase;color:var(--blue);margin-bottom:12px;">${msg.title}</div>
      <div style="font-family:var(--font-serif);font-size:16px;font-weight:300;color:var(--text);line-height:1.6;white-space:pre-line;">${msg.text}</div>
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.2em;color:var(--text4);margin-top:14px;">· click to close ·</div>`
    requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='scale(1)' })
    clearTimeout(this.eggTimer)
    this.eggTimer=window.setTimeout(()=>this.hideEgg(),6500)
  }

  private hideEgg():void {
    const el=document.getElementById('easter-egg'); if(!el)return
    el.style.opacity='0'; el.style.transform='scale(0.92)'
  }

  start():void {
    const pMat=this.particles.material as THREE.PointsMaterial
    const loop=():void=>{
      this.raf=requestAnimationFrame(loop)
      const t=this.clock.getElapsedTime()
      this.mouse.x+=(this.mouse.tx-this.mouse.x)*.04
      this.mouse.y+=(this.mouse.ty-this.mouse.y)*.04
      this.camera.position.x=this.mouse.x*1.5+Math.sin(t*.07)*.4
      this.camera.position.y=2+this.mouse.y+Math.cos(t*.09)*.26
      this.camera.lookAt(this.mouse.x*.14,this.mouse.y*.09,0)

      // Raycast
      this.raycaster.setFromCamera(this.mouse2d,this.camera)
      const hit=this.raycaster.intersectObjects(this.shapes)
      const top=hit.length?(hit[0].object as ShapeMesh):null
      if(top!==this.hovered){
        if(this.hovered){ this.hovered.userData.hovered=false; document.getElementById('bg-canvas')!.style.cursor='' }
        this.hovered=top
        const tip=document.getElementById('shape-tooltip')
        if(this.hovered){
          this.hovered.userData.hovered=true
          document.getElementById('bg-canvas')!.style.cursor='pointer'
          if(tip) tip.classList.add('show')
        } else {
          if(tip) tip.classList.remove('show')
        }
      }

      const isDark=document.documentElement.getAttribute('data-theme')==='dark'
      pMat.opacity=isDark?.38:.28

      this.shapes.forEach(s=>{
        const hov=s.userData.hovered
        if(!hov){ s.rotation.x+=s.userData.rotX; s.rotation.y+=s.userData.rotY; s.rotation.z+=s.userData.rotZ }
        if(!hov) s.position.y=s.userData.baseY+Math.sin(t*s.userData.floatSpd+s.userData.phase)*.65
        s.position.x+=s.userData.driftX; s.position.z+=s.userData.driftZ
        if(Math.abs(s.position.x)>13) s.userData.driftX*=-1
        if(Math.abs(s.position.z+10)>6) s.userData.driftZ*=-1
        const ts=hov?s.userData.baseScale*1.6:s.userData.baseScale
        this._v3.set(ts,ts,ts); s.scale.lerp(this._v3,.09)
        const base=isDark?s.userData.baseOp:s.userData.baseOp*0.85
        const to=hov?Math.min(base*1.8,.95):base
        const mat=s.material as THREE.MeshPhongMaterial
        mat.opacity+=(to-mat.opacity)*.1
        const c=s.userData.baseColor as number
        const factor=isDark?1:0.68
        mat.color.setRGB(((c>>16)&0xff)/255*factor,((c>>8)&0xff)/255*factor,(c&0xff)/255*factor)
      })

      const p=this.pPos
      for(let i=0;i<this.pVel.length;i++){
        const v=this.pVel[i]
        p[i*3]+=v.x+Math.sin(t*.18*v.speed+v.phase)*.0006
        p[i*3+1]+=v.y+Math.cos(t*.14*v.speed+v.phase)*.0005
        if(Math.abs(p[i*3])>23)v.x*=-1
        if(Math.abs(p[i*3+1])>12)v.y*=-1
      }
      ;(this.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate=true
      this.renderer.render(this.scene,this.camera)
    }
    loop()
  }

  stop():void {
    cancelAnimationFrame(this.raf)
    document.removeEventListener('mousemove',this.onMouse)
    document.removeEventListener('click',this.onClick)
    window.removeEventListener('resize',this.onResize)
  }
}
