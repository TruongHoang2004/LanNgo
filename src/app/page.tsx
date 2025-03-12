'use client';

import React, { JSX } from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import CosmicBackground from '../components/background/CosmicBackground';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen text-white">
      <Head>
        <title>Thần Số Học - Khám phá bản thân qua những con số</title>
        <meta name="description" content="Khám phá bản thân và vận mệnh của bạn thông qua thần số học" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated Background */}
      <CosmicBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <HeroSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}