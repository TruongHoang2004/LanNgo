'use client';

import React, { JSX, useEffect, useRef } from 'react';

// Định nghĩa interfaces cho dữ liệu
interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  glowRadius: number;
  glowDirection: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function CosmicBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation cho background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Thiết lập kích thước canvas
    const handleResize = (): void => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Tạo mảng stars
    const stars: Star[] = [];
    const planets: Planet[] = [];
    const shootingStars: ShootingStar[] = [];
    
    // Tạo các ngôi sao
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05,
      });
    }
    
    // Tạo các hành tinh
    const planetColors: string[] = [
      '#FF9D00', // Mercury
      '#FFCC00', // Venus
      '#00AAFF', // Earth
      '#FF5500', // Mars 
      '#FFAA00', // Jupiter
      '#FFD700', // Saturn
      '#B0E0E6', // Uranus
      '#4169E1', // Neptune
      '#800080'  // Pluto
    ];
    
    for (let i = 0; i < 5; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 3 + Math.random() * 5,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        glowRadius: 0,
        glowDirection: 1
      });
    }
    
    // Tạo sao băng
    const createShootingStar = (): void => {
      if (shootingStars.length < 3 && Math.random() < 0.005) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * (canvas.height / 3);
        shootingStars.push({
          x: startX,
          y: startY,
          length: 50 + Math.random() * 70,
          speedX: 5 + Math.random() * 7,
          speedY: 5 + Math.random() * 7,
          opacity: 1
        });
      }
    };
    
    // Vẽ background gradient
    const drawBackground = (): void => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0b0033');
      gradient.addColorStop(0.3, '#150050');
      gradient.addColorStop(0.6, '#3500d3');
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    // Vẽ các ngôi sao
    const drawStars = (): void => {
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Điều chỉnh opacity để tạo hiệu ứng nhấp nháy
        star.opacity += star.speed * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
      });
    };
    
    // Vẽ các hành tinh
    const drawPlanets = (): void => {
      planets.forEach(planet => {
        // Vẽ hiệu ứng glow
        const gradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.radius + planet.glowRadius
        );
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius + planet.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Vẽ hành tinh
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
        
        // Di chuyển hành tinh
        planet.x += planet.speedX;
        planet.y += planet.speedY;
        
        // Đổi hướng nếu chạm cạnh
        if (planet.x < planet.radius || planet.x > canvas.width - planet.radius) {
          planet.speedX *= -1;
        }
        if (planet.y < planet.radius || planet.y > canvas.height - planet.radius) {
          planet.speedY *= -1;
        }
        
        // Hiệu ứng glow
        planet.glowRadius += 0.03 * planet.glowDirection;
        if (planet.glowRadius > 5 || planet.glowRadius < 0) {
          planet.glowDirection *= -1;
        }
      });
    };
    
    // Vẽ sao băng
    const drawShootingStars = (): void => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y - star.length);
        
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.length, star.y - star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Di chuyển sao băng
        star.x += star.speedX;
        star.y += star.speedY;
        star.opacity -= 0.02;
        
        // Xóa sao băng khi ra khỏi màn hình hoặc mờ đi
        if (star.x > canvas.width || star.y > canvas.height || star.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }
    };
    
    // Animation loop
    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBackground();
      drawStars();
      drawPlanets();
      createShootingStar();
      drawShootingStars();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-[-1]"
    />
  );
}