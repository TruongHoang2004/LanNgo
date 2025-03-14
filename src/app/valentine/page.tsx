"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Heart, Gift, ChevronUp, Music, Stars } from "lucide-react";
import * as THREE from "three";
import ValentineCard from "@/components/valentine/Card";

const RomanticValentine = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [giftGiven, setGiftGiven] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);

  // Refs
  const dragConstraintsRef = useRef(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Motion values
  const dragY = useMotionValue(0);
  const controls = useAnimation();
  const swipeOpacity = useTransform(dragY, [0, -200], [1, 0]);
  const swipeScale = useTransform(dragY, [0, -200], [1, 0.9]);

  // Handle swipe release
  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y < -100) {
      setIsOpen(true);
      controls.start({
        y: -1000,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      });
    } else {
      controls.start({
        y: 0,
        transition: {
          duration: 0.5,
          type: "spring",
          stiffness: 300,
          damping: 25,
        },
      });
    }
  };

  // Toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (playingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlayingMusic(!playingMusic);
    }
  };

  // Initialize Three.js scene for 3D rose
  useEffect(() => {
    if (!threeContainerRef.current || !isOpen) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 8;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(250, 250);
    rendererRef.current = renderer;

    // Only append if empty
    if (threeContainerRef.current.childNodes.length === 0) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }

    // Create a flower bouquet
    const bouquetGroup = new THREE.Group();

    // Function to create a rose
    const createRose = (
      posX: number,
      posY: number,
      posZ: number,
      scale: number,
      color: number
    ) => {
      const roseGroup = new THREE.Group();

      // Create flower head with overlapping petal layers
      const createPetalLayer = (
        radius: number,
        height: number,
        segments: number,
        color: number,
        yPos: number
      ) => {
        const petalGeometry = new THREE.SphereGeometry(
          radius,
          segments,
          segments,
          0,
          Math.PI * 2,
          0,
          Math.PI / 2
        );
        const petalMaterial = new THREE.MeshBasicMaterial({ color: color });
        const petalLayer = new THREE.Mesh(petalGeometry, petalMaterial);
        petalLayer.position.y = yPos;
        petalLayer.scale.y = height;
        return petalLayer;
      };

      // Create several petal layers
      const layers = [
        { radius: 1.0, height: 1.4, segments: 32, color: color, yPos: 0 },
        { radius: 0.9, height: 1.3, segments: 24, color: color, yPos: 0.2 },
        { radius: 0.7, height: 1.2, segments: 16, color: color, yPos: 0.4 },
        { radius: 0.5, height: 1.0, segments: 12, color: color, yPos: 0.6 },
      ];

      layers.forEach((layer) => {
        roseGroup.add(
          createPetalLayer(
            layer.radius,
            layer.height,
            layer.segments,
            layer.color,
            layer.yPos
          )
        );
      });

      // Create stem
      const stemGeometry = new THREE.CylinderGeometry(0.08, 0.12, 5, 12);
      const stemMaterial = new THREE.MeshBasicMaterial({ color: 0x2e8b57 });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = -2.8;
      roseGroup.add(stem);

      // Add some leaves
      const leafGeometry = new THREE.ConeGeometry(0.3, 1.2, 8);
      const leafMaterial = new THREE.MeshBasicMaterial({ color: 0x3cb371 });

      const positions = [
        { y: -1.5, rotX: Math.PI / 2, rotZ: 0 },
        { y: -2.2, rotX: Math.PI / 2, rotZ: Math.PI / 1.5 },
      ];

      positions.forEach((pos) => {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.y = pos.y;
        leaf.rotation.x = pos.rotX;
        leaf.rotation.z = pos.rotZ;
        leaf.position.x = 0.3;
        roseGroup.add(leaf);
      });

      // Position the rose
      roseGroup.position.set(posX, posY, posZ);
      roseGroup.scale.set(scale, scale, scale);

      return roseGroup;
    };

    // Create multiple roses in a bouquet
    const roses = [
      { x: 0, y: 0, z: 0, scale: 0.7, color: 0xff3366 }, // Center
      { x: 1.0, y: -0.3, z: 0.5, scale: 0.6, color: 0xffb3c6 }, // Right
      { x: -1.0, y: -0.2, z: 0.3, scale: 0.6, color: 0xff0044 }, // Left
      { x: 0.5, y: 0.2, z: -0.5, scale: 0.55, color: 0xff99aa }, // Front right
      { x: -0.5, y: 0.3, z: -0.4, scale: 0.55, color: 0xff6680 }, // Front left
      { x: 0.7, y: -0.4, z: -0.6, scale: 0.5, color: 0xff0044 }, // Bottom right
      { x: -0.7, y: -0.5, z: -0.5, scale: 0.5, color: 0xffb3c6 }, // Bottom left
    ];

    roses.forEach((rose) => {
      bouquetGroup.add(
        createRose(rose.x, rose.y, rose.z, rose.scale, rose.color)
      );
    });

    // Add some decorative elements
    const ribbonGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8, 2, 3);
    const ribbonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon.position.y = -3.5;
    bouquetGroup.add(ribbon);

    // Wrap the bouquet with paper
    const wrapperGeometry = new THREE.CylinderGeometry(1.5, 2, 3, 32, 1, true);
    const wrapperMaterial = new THREE.MeshBasicMaterial({
      color: 0xfaffde,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const wrapper = new THREE.Mesh(wrapperGeometry, wrapperMaterial);
    wrapper.position.y = -2.5;
    bouquetGroup.add(wrapper);

    // Initially hide and store reference
    bouquetGroup.visible = false;
    flowerGroupRef.current = bouquetGroup;
    scene.add(bouquetGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (flowerGroupRef.current && flowerGroupRef.current.visible) {
        flowerGroupRef.current.rotation.y += 0.005;
        flowerGroupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isOpen]);

  // Handle gift giving action
  const handleGiveGift = () => {
    setGiftGiven(true);

    // Show the 3D bouquet
    if (flowerGroupRef.current) {
      flowerGroupRef.current.visible = true;
    }

    // Play music automatically if not already playing
    if (audioRef.current && !playingMusic) {
      audioRef.current
        .play()
        .catch((e) => console.log("Autoplay prevented:", e));
      setPlayingMusic(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array(30)
          .fill(null)
          .map((_, i) => {
            const [randomValues, setRandomValues] = useState({
              opacity: 0.1,
              x: 0,
              y: 0,
              scale: 0.3,
              duration: 15,
              delay: 0,
              size: 10,
            });

            useEffect(() => {
              setRandomValues({
                opacity: 0.1 + Math.random() * 0.3,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: 0.3 + Math.random() * 0.7,
                duration: 15 + Math.random() * 20,
                delay: Math.random() * 10,
                size: 10 + Math.floor(Math.random() * 30),
              });
            }, []);

            return (
              <motion.div
                key={i}
                className="absolute text-pink-200"
                style={{
                  opacity: randomValues.opacity,
                  filter: "blur(0.5px)",
                }}
                initial={{
                  x: randomValues.x,
                  y: randomValues.y,
                  scale: randomValues.scale,
                }}
                animate={{
                  y: -100,
                  rotate: [-5, 5, -5, 5, 0],
                }}
                transition={{
                  duration: randomValues.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: randomValues.delay,
                }}
              >
                <Heart
                  size={randomValues.size}
                  fill="rgba(255,182,193,0.4)"
                />
              </motion.div>
            );
          })}
      </div>

      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        loop
        src="/api/placeholder/400/320" // Placeholder for audio
      />

      {/* Swipe-up cover */}
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 flex flex-col items-center justify-end"
        style={{ opacity: swipeOpacity, scale: swipeScale }}
        animate={controls}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
          >
            <Heart size={120} fill="#fff" className="text-pink-100 mb-6" />
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Happy Valentine's Day
          </motion.h1>

          <motion.p
            className="text-xl text-pink-100 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            14/3
          </motion.p>
        </div>

        <motion.div
          className="mb-16 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <p className="text-pink-100 mb-2">Swipe up to open</p>
          <ChevronUp size={24} className="text-pink-100" />
        </motion.div>
      </motion.div>

      {/* Main content (visible after swipe) */}
      <ValentineCard
        // isOpen={isOpen}
        // dragConstraintsRef={dragConstraintsRef}
        // threeContainerRef={threeContainerRef}
        // handleGiveGift={handleGiveGift}
        // giftGiven={giftGiven}
        // toggleMusic={toggleMusic}
      />
    </div>
  );
};

export default RomanticValentine;
