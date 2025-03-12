'use client';

import { calculateAll } from '@/utils/calculate';
import React, { JSX, useState } from 'react';

export default function HeroSection(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  

  // Xử lý form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Xử lý form - có thể chuyển hướng đến trang kết quả
    console.log('Form submitted:', { name, birthdate });
    const res = calculateAll(name, birthdate);
    console.log(res);
    // router.push('/result?name=' + encodeURIComponent(name) + '&birthdate=' + encodeURIComponent(birthdate));
  };

  return (
    <main className="container mx-auto px-4 py-16 relative z-10">
      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* CTA Section */}
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
  );
}