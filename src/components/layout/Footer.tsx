import React, { JSX } from 'react';
import Link from 'next/link';

export default function Footer(): JSX.Element {
  return (
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
  );
}