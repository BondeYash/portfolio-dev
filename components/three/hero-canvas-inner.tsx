"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme-provider";

const NODE_COUNT = 26;
const NEIGHBORS = 3;
const PACKET_COUNT = 18;

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

type Graph = {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  curves: THREE.QuadraticBezierCurve3[];
};

function buildGraph(): Graph {
  const nodes: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const angle = (i / NODE_COUNT) * Math.PI * 2 + hash(i) * 0.4;
    const radius = 1.55 + hash(i + 11) * 2.35;
    nodes.push(
      new THREE.Vector3(
        Math.cos(angle) * radius * 1.28,
        (hash(i + 23) - 0.5) * 2.55,
        Math.sin(angle) * radius * 0.95 + (hash(i + 41) - 0.5) * 0.9,
      ),
    );
  }

  const edges: [number, number][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const nearest = nodes
      .map((point, j) => ({ j, d: nodes[i].distanceTo(point) }))
      .filter((item) => item.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBORS);

    for (const item of nearest) {
      const a = Math.min(i, item.j);
      const b = Math.max(i, item.j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }

  const curves = edges.map(([a, b], index) => {
    const start = nodes[a];
    const end = nodes[b];
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const sideways = new THREE.Vector3()
      .subVectors(end, start)
      .cross(new THREE.Vector3(0, 1, 0));
    if (sideways.lengthSq() < 0.001) {
      sideways.set(0.2, 0.4, 0);
    }
    sideways.normalize().multiplyScalar(((index % 3) - 1) * 0.32);
    mid.add(sideways);
    mid.y += 0.12 + hash(index + 7) * 0.22;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  });

  return { nodes, edges, curves };
}

function Computer({
  position,
  dark,
  hub,
}: {
  position: THREE.Vector3;
  dark: boolean;
  hub: boolean;
}) {
  const scale = hub ? 1.35 : 0.85 + hash(position.x * 10) * 0.35;

  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[0.22, 0.15, 0.16]} />
        <meshStandardMaterial
          color={dark ? "#16181e" : "#ece7de"}
          metalness={0.35}
          roughness={0.42}
        />
      </mesh>
      <mesh position={[0, 0.012, 0.083]}>
        <planeGeometry args={[0.155, 0.09]} />
        <meshBasicMaterial color={dark ? "#79b0ff" : "#2563eb"} />
      </mesh>
      <mesh position={[0, -0.095, 0.02]}>
        <boxGeometry args={[0.26, 0.018, 0.16]} />
        <meshStandardMaterial
          color={dark ? "#0f1116" : "#d7d1c7"}
          metalness={0.2}
          roughness={0.55}
        />
      </mesh>
      {hub ? (
        <pointLight
          intensity={0.7}
          distance={2.4}
          color={dark ? "#7eb0ff" : "#60a5fa"}
        />
      ) : null}
    </group>
  );
}

function Cables({ curves, dark }: { curves: THREE.QuadraticBezierCurve3[]; dark: boolean }) {
  const positions = useMemo(() => {
    const segments = 18;
    const data: number[] = [];
    curves.forEach((curve) => {
      const pts = curve.getPoints(segments);
      for (let i = 0; i < pts.length - 1; i += 1) {
        data.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      }
    });
    return new Float32Array(data);
  }, [curves]);

  const lineRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity = dark
      ? 0.28 + Math.sin(state.clock.elapsedTime * 1.4) * 0.08
      : 0.22 + Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={dark ? "#8fb8ff" : "#3b82f6"}
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function Packets({
  curves,
  dark,
}: {
  curves: THREE.QuadraticBezierCurve3[];
  dark: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const traffic = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, (_, i) => ({
        curve: curves[i % curves.length],
        offset: hash(i + 3),
        speed: 0.12 + hash(i + 19) * 0.22,
        reverse: hash(i + 31) > 0.5,
      })),
    [curves],
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    traffic.forEach((packet, i) => {
      let u = (packet.offset + t * packet.speed) % 1;
      if (packet.reverse) u = 1 - u;
      const point = packet.curve.getPoint(u);
      dummy.position.copy(point);
      dummy.scale.setScalar(0.045 + (i % 3) * 0.01);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, PACKET_COUNT]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial
        color={dark ? "#d7e7ff" : "#1d4ed8"}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Network({ dark }: { dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const graph = useMemo(() => buildGraph(), []);
  const hubIndex = 0;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.065 + state.pointer.x * 0.28;
    group.current.rotation.x = -0.14 + state.pointer.y * -0.14;
  });

  return (
    <group ref={group}>
      {graph.nodes.map((position, i) => (
        <Computer key={i} position={position} dark={dark} hub={i === hubIndex} />
      ))}
      <Cables curves={graph.curves} dark={dark} />
      <Packets curves={graph.curves} dark={dark} />
    </group>
  );
}

function Scene({ dark }: { dark: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.28 : 0.72} />
      <directionalLight position={[5, 4, 6]} intensity={dark ? 1.05 : 0.9} />
      <pointLight
        position={[0, 1.2, 3]}
        intensity={1.1}
        color={dark ? "#4d8bff" : "#93c5fd"}
      />
      <Network dark={dark} />
    </>
  );
}

export function HeroCanvasInner() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <Canvas
      camera={{ position: [0, 0.15, 6.4], fov: 42 }}
      dpr={1}
      resize={{ scroll: false }}
      style={{ width: "100%", height: "100%", display: "block" }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <Scene dark={dark} />
    </Canvas>
  );
}
