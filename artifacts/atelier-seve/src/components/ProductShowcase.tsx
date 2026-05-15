import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function ThreeBottle({ rotationY }: { rotationY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Smoothly interpolate rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationY * (Math.PI / 180),
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Bottle Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 2.4, 32]} />
        <meshPhysicalMaterial
          color="#1a0e0a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Gold Band */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.1, 32]} />
        <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.2} />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.78, 1.4, 32]} />
        <meshPhysicalMaterial
          color="#b8956a"
          metalness={1}
          roughness={0.15}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Brand Text on Body */}
      <mesh position={[0, 1.2, 0.81]}>
        <planeGeometry args={[1, 0.4]} />
        <meshBasicMaterial color="#C9A06E" transparent opacity={0.8} depthWrite={false}>
          {/* We would use Text from drei, but keeping it simple to avoid missing font issues */}
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

function RotatingBottle({ rotationDeg }: { rotationDeg: number }) {
  return (
    <Canvas className="w-full h-full" shadows>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <Environment preset="studio" />
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <ThreeBottle rotationY={rotationDeg} />
      </Float>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
    </Canvas>
  );
}

function SwatchCard({ swatch, delay }: { swatch: { name: string; hex: string }; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{
          width: hovered ? "90px" : "64px",
          height: hovered ? "130px" : "64px",
          backgroundColor: swatch.hex,
          boxShadow: hovered ? `0 20px 40px ${swatch.hex}88` : `0 4px 12px ${swatch.hex}44`,
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />
        {hovered && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/60 bg-white/20" />
          </div>
        )}
      </div>
      <span
        className="font-sans text-xs uppercase tracking-widest text-center transition-all duration-300"
        style={{
          color: "#9E7B7B",
          maxWidth: "80px",
          opacity: hovered ? 1 : 0.7,
        }}
      >
        {swatch.name}
      </span>
    </div>
  );
}

export function ProductShowcase() {
  const { t } = useLanguage();
  const ps = t.productShowcase;
  const containerRef = useRef<HTMLDivElement>(null);
  const lipstickRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => { setRotation(self.progress * 360); },
      });

      gsap.fromTo(lipstickRef.current, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
      });
    });

    return () => ctx.revert();
  }, [t]);

  return (
    <section
      ref={containerRef}
      className="w-full py-32 px-6 md:px-12 lg:px-24 overflow-hidden relative"
      style={{ backgroundColor: "#F9F4EE" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,196,184,0.35) 0%, transparent 70%)" }}
      />

      <div className="text-center mb-20 relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl italic mb-4" style={{ color: "#1C1210" }}>
          {ps.heading}
        </h2>
        <p className="font-sans text-lg" style={{ color: "#9E7B7B" }}>{ps.subheading}</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10">
        <div ref={lipstickRef} className="flex flex-col items-center gap-6 opacity-0">
          <div
            className="relative"
            style={{
              width: "140px",
              height: "380px",
              filter: `drop-shadow(0 40px 80px rgba(201,160,110,0.4))`,
            }}
          >
            <RotatingBottle rotationDeg={rotation} />
          </div>
          <span className="font-sans text-xs uppercase tracking-widest" style={{ color: "#9E7B7B" }}>
            {ps.rotateHint}
          </span>
        </div>

        <div className="flex flex-col gap-16">
          <div
            className="relative p-8 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(201,160,110,0.12) 0%, rgba(232,196,184,0.08) 100%)",
              border: "1px solid rgba(201,160,110,0.25)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 40%, transparent 80%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full mb-4" style={{ background: "linear-gradient(135deg, #C9A06E, #E8C4B8)", boxShadow: "0 0 20px rgba(201,160,110,0.4)" }} />
              <h3 className="font-serif italic text-2xl mb-2" style={{ color: "#1C1210" }}>{ps.liquidLabel}</h3>
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 rounded-full flex-1" style={{ backgroundColor: `rgba(201,160,110,${0.3 + i * 0.25})` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {ps.swatches.map((sw, i) => (
              <SwatchCard key={sw.name} swatch={sw} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
