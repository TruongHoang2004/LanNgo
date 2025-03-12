'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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

export default function Home(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Xử lý form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Xử lý form - có thể chuyển hướng đến trang kết quả
    console.log('Form submitted:', { name, birthdate });
    // router.push('/result?name=' + encodeURIComponent(name) + '&birthdate=' + encodeURIComponent(birthdate));
  };

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
    <div className="min-h-screen text-white">
      <Head>
        <title>Thần Số Học - Khám phá bản thân qua những con số</title>
        <meta name="description" content="Khám phá bản thân và vận mệnh của bạn thông qua thần số học" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-[-1]"
      />

      <header className="relative z-10">
        <nav className="container mx-auto pt-6 px-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            COSMOS NUMEROLOGY
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-purple-300 transition">Trang chủ</Link>
            <Link href="/about" className="hover:text-purple-300 transition">Giới thiệu</Link>
            <Link href="/calculator" className="hover:text-purple-300 transition">Tra cứu</Link>
            <Link href="/blog" className="hover:text-purple-300 transition">Blog</Link>
            <Link href="/contact" className="hover:text-purple-300 transition">Liên hệ</Link>
          </div>
          <button className="md:hidden text-xl">☰</button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Khám phá <span className="text-purple-400">vận mệnh</span> của bạn qua những con số
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Thần số học - nghệ thuật cổ xưa giúp bạn hiểu rõ hơn về bản thân, 
              tiềm năng và con đường đời của bạn thông qua những con số.
            </p>
            <div className="flex space-x-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition">
                Tìm hiểu thêm
              </button>
              <button className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black font-bold py-3 px-6 rounded-full transition">
                Xem dịch vụ
              </button>
            </div>
          </div>

          <div className="md:w-1/2 bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-purple-600/30 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Tra cứu thần số học</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-purple-300">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-indigo-900/50 border border-indigo-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="birthdate" className="block mb-2 text-purple-300">Ngày sinh</label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full bg-indigo-900/50 border border-indigo-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Khám phá số mệnh
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Khám phá những <span className="text-purple-400">bí ẩn</span> của thần số học</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/40 hover:border-purple-500/50 transition">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Số chủ đạo</h3>
              <p className="text-gray-300">
                Khám phá con số quan trọng nhất trong biểu đồ thần số học của bạn, 
                tiết lộ sứ mệnh và con đường đời của bạn.
              </p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/40 hover:border-purple-500/50 transition">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🔮</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Biểu đồ ngày sinh</h3>
              <p className="text-gray-300">
                Phân tích chi tiết các con số trong ngày sinh của bạn để 
                tiết lộ tài năng tiềm ẩn và thách thức.
              </p>
            </div>
            
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-xl border border-indigo-800/40 hover:border-purple-500/50 transition">
              <div className="bg-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🌌</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Dự báo tương lai</h3>
              <p className="text-gray-300">
                Khám phá các chu kỳ cuộc đời, năm cá nhân và dự báo 
                những thời điểm thuận lợi cho các kế hoạch của bạn.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <span className="inline-block animate-pulse">✨</span>
          <h2 className="text-2xl font-bold my-4">Sẵn sàng khám phá bản thân?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Thần số học mở ra cánh cửa kỳ diệu giúp bạn hiểu rõ hơn về bản thân và vận mệnh của mình.
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition">
            Bắt đầu hành trình
          </button>
        </div>
      </main>

      <footer className="mt-24 bg-black/50 backdrop-blur-sm border-t border-purple-900/30 py-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-10 md:mb-0">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                COSMOS NUMEROLOGY
              </div>
              <p className="text-gray-400 max-w-md">
                Khám phá bản thân và vận mệnh của bạn thông qua thần số học - 
                nghệ thuật cổ xưa giúp bạn kết nối với vũ trụ.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-lg font-bold mb-4 text-purple-300">Liên kết</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-purple-300 transition">Giới thiệu</Link></li>
                  <li><Link href="/services" className="hover:text-purple-300 transition">Dịch vụ</Link></li>
                  <li><Link href="/blog" className="hover:text-purple-300 transition">Blog</Link></li>
                  <li><Link href="/contact" className="hover:text-purple-300 transition">Liên hệ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4 text-purple-300">Dịch vụ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/service/life-path" className="hover:text-purple-300 transition">Số chủ đạo</Link></li>
                  <li><Link href="/service/compatibility" className="hover:text-purple-300 transition">Tương hợp</Link></li>
                  <li><Link href="/service/forecast" className="hover:text-purple-300 transition">Dự báo tương lai</Link></li>
                  <li><Link href="/service/consultation" className="hover:text-purple-300 transition">Tư vấn cá nhân</Link></li>
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-lg font-bold mb-4 text-purple-300">Liên hệ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Email: info@cosmosnumerology.com</li>
                  <li>Điện thoại: +84 123 456 789</li>
                  <li className="flex space-x-4 mt-4">
                    <a href="#" className="text-gray-400 hover:text-purple-300 transition">FB</a>
                    <a href="#" className="text-gray-400 hover:text-purple-300 transition">IG</a>
                    <a href="#" className="text-gray-400 hover:text-purple-300 transition">YT</a>
                    <a href="#" className="text-gray-400 hover:text-purple-300 transition">TT</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-purple-900/30 text-center text-gray-500">
            <p>© 2025 Cosmos Numerology. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}