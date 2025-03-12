'use client';

import React, { JSX, useState } from 'react';
import Link from 'next/link';

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="relative z-10">
      <nav className="container mx-auto pt-6 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          COSMOS NUMEROLOGY
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-purple-300 transition">Trang chủ</Link>
          <Link href="/about" className="hover:text-purple-300 transition">Giới thiệu</Link>
          <Link href="/calculator" className="hover:text-purple-300 transition">Tra cứu</Link>
          <Link href="/blog" className="hover:text-purple-300 transition">Blog</Link>
          <Link href="/contact" className="hover:text-purple-300 transition">Liên hệ</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        {/* Mobile Menu Dropdown - Only shown when isMenuOpen is true */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md p-4 flex flex-col space-y-4 md:hidden">
            <Link href="/" className="hover:text-purple-300 transition">Trang chủ</Link>
            <Link href="/about" className="hover:text-purple-300 transition">Giới thiệu</Link>
            <Link href="/calculator" className="hover:text-purple-300 transition">Tra cứu</Link>
            <Link href="/blog" className="hover:text-purple-300 transition">Blog</Link>
            <Link href="/contact" className="hover:text-purple-300 transition">Liên hệ</Link>
          </div>
        )}
      </nav>
    </header>
  );
}