import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, ContactShadows, Environment, OrbitControls } from "@react-three/drei"
import { proxy, useSnapshot } from "valtio"
import { animated, useSpring } from "@react-spring/three"

const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
})

function Shoe() {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("shoe-draco.glb")

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 12

    if (t > 1) {
      console.log(t)
      ref.current.rotation.set(Math.PI * 2.04, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    }
  })

  const spring = useSpring({
    from: {
      rotation: [Math.PI * 0.52, 0, 0]
    },
    to: {
      rotation: [Math.PI * 2.04, Math.sin(1 / 4) / 8, -0.2 - (1 + Math.sin(1 / 1.5)) / 20]
    },
  })

  return (
    <animated.group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
      position={[0,0,0]}
      {...spring}
    >
      <mesh receiveShadow castShadow geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
      <mesh receiveShadow castShadow geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
    </animated.group>
  )
}

const AnimatedGroup = ({ children }) => {
  const focusPoint ={
    from: [0, 0, -14],
    to: [0, 0, 0],
  }
  
  const { position } = useSpring({
    position: focusPoint.to,
    from: { position: focusPoint.from },
  })

  const newPosition = position

  return (
    <animated.group position={newPosition}>
      {children}
    </animated.group>
  )
}

export default function App() {
  return (
    <>
      <div className="left">
        <div className="container">
          <h1>
            Refresh your collection with fast shoes
          </h1>
          <p>
            Make the new year your year with apparel and footwear to bring out your very best.
          </p>
          <a href="#">
            Buy Now
          </a>
        </div>
      </div>
      <div className="right">
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.7} />
          {/* <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow /> */}
          <AnimatedGroup>
            <Shoe />
          </AnimatedGroup>

          <Environment preset="city" />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
          <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </>
  )
}
