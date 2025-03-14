import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ValentineCardProps {
  recipientName?: string;
  message?: string;
}

const ValentineCard: React.FC<ValentineCardProps> = ({
  recipientName = "My Love a.k.a. Lan Ngo ",
  message = "Every moment with you feels like magic. Will you be my Valentine today and forever?",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const heartModelRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current || !isOpen) return;

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(128, 128);
    threeContainerRef.current.innerHTML = "";
    threeContainerRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Create heart shape
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;

    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo(x - 1, y - 1.5, x - 3, y + 1, x, y + 3);
    heartShape.bezierCurveTo(x + 3, y + 1, x + 1, y - 1.5, x, y);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff3b69,
      metalness: 0.3,
      roughness: 0.5,
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.8, 0.8, 0.5);
    heart.rotation.z = Math.PI;

    // Create group for easier manipulation
    const group = new THREE.Group();
    group.add(heart);
    scene.add(group);
    heartModelRef.current = group;

    // Position camera
    camera.position.z = 5;

    // Create particles (small floating hearts)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 30;

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
      scales[i] = Math.random() * 0.2 + 0.1;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff89a9,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      if (!threeContainerRef.current) {
        cancelAnimationFrame(animationId);
        return;
      }

      if (heartModelRef.current) {
        heartModelRef.current.rotation.y += 0.01;
        heartModelRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      }

      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += 0.01 * scales[i] * 2;

        // Reset position if particle moves too far
        if (positions[i3 + 1] > 1.5) {
          positions[i3] = (Math.random() - 0.5) * 3;
          positions[i3 + 1] = -1.5;
          positions[i3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [isOpen, threeContainerRef]);

  useEffect(() => {
    // Auto-open the card after a short delay
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Initial heart button to open card */}
      {!isOpen && (
        <motion.button
          className="text-5xl bg-transparent border-none outline-none cursor-pointer"
          onClick={() => setIsOpen(true)}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          💖
        </motion.button>
      )}

      {/* Main content (visible after swipe) */}
      <div className="w-full max-w-md z-10">
        {/* Background starry effect */}
        {isOpen && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array(50)
              .fill(null)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: 1 + Math.random() * 2,
                    height: 1 + Math.random() * 2,
                    opacity: 0.4 + Math.random() * 0.6,
                  }}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 3,
                  }}
                />
              ))}
          </div>
        )}

        {/* Card */}
        {isOpen && (
          <motion.div
            className="bg-gradient-to-br from-rose-900/80 via-pink-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col items-center"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", delay: 1 }}
          >
            <div className="relative w-32 h-32 mb-6">
              <div ref={threeContainerRef} className="w-32 h-32" />
            </div>

            {/* Valentine Message Content */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <h2 className="text-2xl font-dancing-script font-bold text-rose-200 mb-4">
                {recipientName}
              </h2>

              <p className="text-rose-100 font-dancing-script text-lg mb-6 leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className="text-rose-200 text-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ❤️
                </motion.div>

                <motion.button
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => {
                    const roseImages = [
                      "/rose1.png",
                      "/rose2.png",
                      "/rose3.png",
                      "/rose4.png",
                    ]; // Danh sách ảnh
                    const numRoses = 100; // Số bông hoa xuất hiện mỗi lần click

                    for (let i = 0; i < numRoses; i++) {
                      const rose = document.createElement("img");
                      rose.src =
                        roseImages[
                          Math.floor(Math.random() * roseImages.length)
                        ]; // Chọn ảnh ngẫu nhiên
                      rose.style.position = "absolute";
                      rose.style.width = `${Math.random() * 40 + 30}px`; // Kích thước ngẫu nhiên
                      rose.style.left = `${
                        Math.random() * window.innerWidth
                      }px`;
                      rose.style.top = `${
                        Math.random() * window.innerHeight
                      }px`;
                      rose.style.opacity = "0";
                      rose.style.transition =
                        "opacity 1s ease-in-out, transform 1s ease-in-out";
                      rose.style.pointerEvents = "none";

                      document.body.appendChild(rose);

                      requestAnimationFrame(() => {
                        rose.style.opacity = "1";
                        rose.style.transform = `scale(${
                          Math.random() * 1.5 + 0.5
                        })`;
                      });

                      setTimeout(() => {
                        rose.style.opacity = "0";
                        setTimeout(() => {
                          document.body.removeChild(rose);
                        }, 1000);
                      }, 2000);
                    }
                  }}
                >
                  Yes, I Will
                </motion.button>
              </div>

              <motion.div
                className="mt-8 text-rose-300/70 text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <p>From the depths of my heart to yours</p>
                <div className="mt-3 flex justify-center space-x-3">
                  {["✨", "💕", "✨"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ValentineCard;
