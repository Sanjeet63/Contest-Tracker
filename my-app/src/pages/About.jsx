import React from "react";
import Hero from "../assets/Hero.jpg";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import avatarImg from "../assets/Vikram.jpg";
import avatarImg1 from "../assets/Devesh.jpg";
import avatarImg2 from "../assets/Priyansh.jpg"; 
import {
  FaCalendarCheck,
  FaTachometerAlt,
  FaGoogle,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Vikram Pandit",
    role: "Competitive Programmer",
    feedback:
      "CP Hub helped me stay updated and organized all contests seamlessly!",
    avatar: avatarImg,
  },
  {
    name: "Devesh",
    role: "CS Student",
    feedback:
      "The dashboard is super intuitive and Google Auth is flawless. Highly recommend!",
    avatar: avatarImg1,
  },
  {
    name: "Priyansh Sharma",
    role: "Competitive Programmer",
    feedback:
      "With CP Hub, tracking contests and my progress became so much easier. Great job!",
    avatar: avatarImg2, 
    },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
      <section className="relative z-10 py-20 text-center overflow-hidden px-6 md:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30 blur-3xl opacity-25"></div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 relative z-10 mt-20"
        >
          About CP Hub 🚀
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 text-lg text-gray-300 max-w-xl mx-auto relative z-10"
        >
          Your ultimate competitive programming companion to track, plan, and
          level up your CP journey.
        </motion.p>
      </section>

      <section className="relative z-10 container mx-auto py-16 grid md:grid-cols-3 gap-8 px-6 md:px-0">
        {[
          {
            title: "Unified Contest Tracker",
            desc: "Track contests from Codeforces, LeetCode, CodeChef, and more.",
            icon: (
              <FaCalendarCheck size={32} className="text-pink-400 mb-3" />
            ),
          },
          {
            title: "Your CP Dashboard",
            desc: "Bookmark contests, set reminders, and monitor your performance.",
            icon: (
              <FaTachometerAlt size={32} className="text-pink-400 mb-3" />
            ),
          },
          {
            title: "Google Authentication",
            desc: "Sign in securely with Google and sync your CP journey effortlessly.",
            icon: <FaGoogle size={32} className="text-pink-400 mb-3" />,
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mb-2 text-white">
              {item.title}
            </h3>
            <p className="text-gray-300">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="relative z-10 max-w-5xl mx-auto py-12 px-6 md:px-0">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Meet the Creator
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-pink-500/20 gap-6 md:gap-10">
          <motion.img
            src={Hero}
            alt="Creator"
            className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-cover flex-shrink-0"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <div className="text-center md:text-left space-y-2 md:space-y-3 max-w-xl">
            <h3 className="text-2xl font-semibold text-white">Sanjeet Patel</h3>
            <p className="text-gray-300 text-lg font-medium">
              Developer • CP Enthusiast
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              I built CP Hub to simplify your contest tracking and boost your
              performance in competitive programming. Join me on this journey!
            </p>
            <div className="flex justify-center md:justify-start gap-6 mt-4">
              <a
                href="https://github.com/sanjeet"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub className="text-2xl text-gray-300 hover:text-pink-400 transition" />
              </a>
              <a
                href="https://linkedin.com/in/sanjeet"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-2xl text-gray-300 hover:text-pink-400 transition" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-20 pb-10 px-6 border-t border-white/10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          What Our Users Say <span className="text-pink-400">💬</span>
        </motion.h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map(({ name, role, feedback, avatar }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 text-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <img
                src={avatar}
                alt={`${name} avatar`}
                className="w-12 h-12 rounded-full mx-auto mb-3 border-2 border-pink-400 shadow-sm object-cover"
              />
              <p className="italic text-sm text-gray-300 mb-3 leading-relaxed text-center">
                “{feedback}”
              </p>
              <h4 className="text-base font-semibold text-white text-center">
                {name}
              </h4>
              <p className="text-xs text-pink-400 text-center">{role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
