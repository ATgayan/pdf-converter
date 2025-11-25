"use client";

import { FaLinkedin, FaFacebook, FaInstagram, FaGithub, FaYoutube, FaMedium, FaTiktok } from "react-icons/fa";
import Navbar from "../components/nav";
export default function AboutPage() {
  return (
    <div>
        <Navbar />
    <div className="animate-fadeIn min-h-screen w-full  px-6 py-12 flex justify-center">
      <div className="max-w-4xl w-full bg-white  rounded-2xl p-10 flex flex-col items-center text-center">

        {/* Profile Image */}
        <img
          src="/images/profile_image.png"
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-indigo-500"
        />

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6">
          Hey, I'm <span className="text-indigo-600">Thushitha Athukorale </span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-2xl">
          I’m an undergraduate ICT student at Uva Wellassa University, one of the most beautiful universities in Sri Lanka.
I’m also the creator of this PDF Converter app.I love building cool web apps, learning new tech, and sharing what I create with others.
Follow me on social media to see more of my projects and what I’m working on next! 
        </p>

        {/* Social Media Section */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-3xl text-gray-700">

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/thushitha-athukorale-848765248/"
            target="_blank"
            className="hover:text-indigo-600 transition"
          >
            <FaLinkedin />
          </a>

          {/* Facebook */}
          <a
            href="https://web.facebook.com/ATgayan"
            target="_blank"
            className="hover:text-blue-600 transition"
          >
            <FaFacebook />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/@A_T_GAYAN"
            target="_blank"
            className="hover:text-pink-500 transition"
          >
            <FaInstagram />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@chilldayswithme?_r=1&_t=ZS-91h27wHT3MC"
            target="_blank"
            className="hover:text-black transition"
          >
            <FaTiktok />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/ATgayan"
            target="_blank"
            className="hover:text-gray-900 transition"
          >
            <FaGithub />
          </a>

          {/* Medium */}
          <a
            href="https://medium.com/@thusitha.personal"
            target="_blank"
            className="hover:text-green-600 transition"
          >
            <FaMedium />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/"
            target="_blank"
            className="hover:text-red-600 transition"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}
