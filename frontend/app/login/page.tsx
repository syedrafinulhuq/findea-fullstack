"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

const MyAccountPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [error, setError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      window.location.href = "/account";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegisterSuccess("Account created successfully. You can now log in.");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (err: unknown) {
      setRegisterError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className={`${playfair.className} w-full bg-[#f3f0ea] min-h-screen relative overflow-x-hidden`}>
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/20" onClick={() => setIsMenuOpen(false)} />

        <div
          className={`relative w-[280px] h-full bg-[#d3cec4] shadow-xl transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } p-6 overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-6">
            <Image src="/findea1.png" alt="Logo" width={90} height={30} className="object-contain" />
            <FiX size={24} className="text-gray-700 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Type here..."
              className="w-full bg-white py-2 px-4 pr-10 text-sm focus:outline-none rounded-none italic"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          <nav className="flex flex-col gap-5 text-gray-800 tracking-widest text-[14px]">
            <Link href="/" className="uppercase">HOME</Link>
            <Link href="/about" className="uppercase">ABOUT</Link>

            <div>
              <button type="button" onClick={() => toggleDropdown("products")} className="w-full flex justify-between items-center uppercase">
                PRODUCTS <FiChevronDown className={openDropdown === "products" ? "rotate-180" : ""} />
              </button>
              {openDropdown === "products" && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700">
                  <li><Link href="/products">Featured</Link></li>
                  <li><Link href="/products">New Arrivals</Link></li>
                  <li><Link href="/products">Best Sellers</Link></li>
                  <li><Link href="/products">Collection</Link></li>
                </ul>
              )}
            </div>

            <div>
              <button type="button" onClick={() => toggleDropdown("registries")} className="w-full flex justify-between items-center uppercase">
                REGISTRIES <FiChevronDown className={openDropdown === "registries" ? "rotate-180" : ""} />
              </button>
              {openDropdown === "registries" && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700">
                  <li><Link href="#">Wedding Registry</Link></li>
                  <li><Link href="#">Baby Registry</Link></li>
                  <li><Link href="#">Find a Registry</Link></li>
                </ul>
              )}
            </div>

            <div>
              <button type="button" onClick={() => toggleDropdown("services")} className="w-full flex justify-between items-center uppercase">
                SERVICES <FiChevronDown className={openDropdown === "services" ? "rotate-180" : ""} />
              </button>
              {openDropdown === "services" && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700">
                  <li><Link href="#">Wedding Services</Link></li>
                  <li><Link href="#">Baby & Family</Link></li>
                  <li><Link href="#">Home & Lifestyle</Link></li>
                  <li><Link href="#">Wellness & Beauty</Link></li>
                  <li><Link href="#">Photography</Link></li>
                </ul>
              )}
            </div>

            <Link href="/boutiques" className="uppercase">BOUTIQUES</Link>
            <Link href="/login" className="uppercase mt-2">Sign Up</Link>
          </nav>
        </div>
      </div>

      <div className="hidden md:flex bg-white border-b border-gray-100 py-2 px-12 justify-between items-center text-[10px] tracking-[0.15em] uppercase text-gray-500">
        <div className="flex-1" />
        <div className="flex-2 text-center">Livraison gratuite pour toute commande de plus de 250$</div>
        <div className="flex-1 flex justify-end gap-4">
          <FaFacebookF className="cursor-pointer hover:text-black" />
          <FaInstagram className="cursor-pointer hover:text-black" />
          <RiTwitterXFill className="cursor-pointer hover:text-black" />
          <FaYoutube className="cursor-pointer hover:text-black" />
        </div>
      </div>

      <div className="bg-white px-4 md:px-12 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center w-1/4">
          <FiMenu size={24} className="md:hidden text-gray-600 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <FiSearch size={22} className="hidden md:block text-gray-600 cursor-pointer" />
        </div>
        <div className="flex justify-center w-2/4">
          <Image src="/findea1.png" alt="Logo" width={120} height={35} className="object-contain md:w-[150px]" priority />
        </div>
        <div className="flex justify-end gap-3 md:gap-6 items-center w-1/4">
          <FiSearch size={24} className="md:hidden text-gray-600 cursor-pointer" />
          <Link href="/account"><FiUser size={22} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" /></Link>
          <FiHeart size={22} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" />
          <FiShoppingCart size={24} className="text-gray-600 cursor-pointer hover:text-black" />
        </div>
      </div>

      <nav className="hidden md:block bg-white border-t border-b border-gray-200 py-3">
        <ul className="flex justify-center gap-8 text-[11px] font-semibold tracking-[0.18em] text-gray-700 uppercase">
          <li className="hover:text-black cursor-pointer"><Link href="/">Accueil</Link></li>
          <li className="hover:text-black cursor-pointer"><Link href="/about">À propos</Link></li>
          <li className="hover:text-black cursor-pointer"><Link href="/products">Produits</Link></li>
          <li className="hover:text-black cursor-pointer flex items-center gap-1">Registres <FiChevronDown size={14} /></li>
          <li className="hover:text-black cursor-pointer flex items-center gap-1">Services <FiChevronDown size={14} /></li>
          <li className="hover:text-black cursor-pointer">Boutiques</li>
        </ul>
      </nav>

      <section className="relative w-full flex justify-center mb-2">
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <div
            className="bg-[#e2ddd3] w-[85%] md:w-[45%] h-20 md:h-28"
            style={{ clipPath: "polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex items-center justify-center h-20 md:h-28">
          <div className="absolute left-1/2 -translate-x-1/2 text-[#1a1a1a] flex flex-col items-center gap-1">
            <Link href="/" className="text-xs md:hidden text-neutral-500 hover:text-[#1a1a1a]">Accueil ❯</Link>
            <h1 className="text-md md:text-xl font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase text-center leading-tight">
              Mon compte
            </h1>
          </div>
        </div>
      </section>

      <main className="max-w-[480px] md:max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-12 text-black">
        <div className="bg-[#e1ddd4] border border-[#ccc7bc] p-8 md:p-14">
          <h2 className="text-xl md:text-3xl font-bold mb-8 tracking-widest uppercase">Se connecter</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[14px] italic mb-2 text-gray-800">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#ccc7bc] border border-[#b8b3a9] py-3 px-4 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[14px] italic mb-2 text-gray-800">
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#ccc7bc] border border-[#b8b3a9] py-3 px-4 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-[12px] py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-black w-3 h-3" />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/lost-password" className="italic cursor-pointer hover:underline text-gray-900">
                Mot de passe oublié ?
              </Link>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f2e6cf] hover:bg-[#e9dab9] py-4 text-[13px] font-bold uppercase tracking-[0.2em] border border-[#d3c7ad] disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-[#b8b3a9]" />
            <span className="flex-shrink mx-3 text-[10px] italic text-gray-500 uppercase tracking-tight">
              Ou connectez-vous with un réseau social
            </span>
            <div className="flex-grow border-t border-[#b8b3a9]" />
          </div>

          <button className="w-full bg-[#f2e6cf] hover:bg-[#e9dab9] py-4 text-[13px] font-bold uppercase tracking-[0.2em] border border-[#d3c7ad]">
            Facebook
          </button>
        </div>

        <div className="bg-[#e1ddd4] border border-[#ccc7bc] p-8 md:p-14">
          <h2 className="text-xl md:text-3xl font-bold mb-8 tracking-widest uppercase">S&apos;inscrire</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-[14px] italic mb-2 text-gray-800">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                className="w-full bg-[#ccc7bc] border border-[#b8b3a9] py-3 px-4 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[14px] italic mb-2 text-gray-800">
                Mot de passe *
              </label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                className="w-full bg-[#ccc7bc] border border-[#b8b3a9] py-3 px-4 focus:outline-none"
              />
            </div>

            {registerError && <p className="text-red-600 text-sm">{registerError}</p>}
            {registerSuccess && <p className="text-green-700 text-sm">{registerSuccess}</p>}

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-[#f2e6cf] hover:bg-[#e9dab9] py-4 text-[13px] font-bold uppercase tracking-[0.2em] border border-[#d3c7ad] mt-4 disabled:opacity-60"
            >
              {registerLoading ? "Création..." : "S'inscrire"}
            </button>
          </form>
        </div>
      </main>

      <section className="md:hidden relative w-full h-[450px] flex items-center justify-center mt-10">
        <Image src="/newsletter.png" alt="Newsletter" fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-6 w-full max-w-lg">
          <h2 className="text-white text-3xl tracking-[0.1em] uppercase mb-4 leading-tight">
            ENTREZ DANS NOTRE UNIVERS
          </h2>
          <p className="text-white text-[15px] italic mb-10 leading-relaxed tracking-wide">
            Découvrez En Avant-Première Nos Nouvelles Collections Et Nos Trésors Exclusifs.
          </p>
          <div className="flex items-stretch justify-center gap-3 w-full h-[56px]">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-grow min-w-0 bg-transparent border border-white px-5 text-white placeholder:text-white/60 focus:outline-none text-base"
            />
            <button className="flex-shrink-0 px-6 h-full bg-[#f2e6cf] text-black font-bold uppercase tracking-widest text-[12px] transition-all hover:bg-[#e9dab9] whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer className="md:hidden bg-[#f3f0ea] pt-16 pb-10 px-6 border-t border-gray-200 text-black">
        <div className="flex flex-col gap-12 text-left">
          <div className="space-y-6">
            <Image src="/findea1.png" alt="Footer Logo" width={130} height={35} className="object-contain" />
            <p className="text-gray-800 text-[15px] leading-relaxed">
              Etiam nulla nunc, aliquet vel metus nec, scelerisque tempus enim. Sed eget blandit lectus.
            </p>
            <div className="flex gap-6 text-xl py-2">
              <FaFacebookF className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <RiTwitterXFill className="cursor-pointer" />
              <FaYoutube className="cursor-pointer" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-widest uppercase">Société</h3>
            <ul className="space-y-3 text-[14px] text-gray-700">
              <li>À propos</li>
              <li>Politique de confidentialité</li>
              <li>Politique de retour et de remboursement</li>
              <li>Conditions Générales de Vente</li>
              <li>Contactez-nous</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="md:hidden bg-[#ccc7bc] py-5 flex justify-center items-center border-t border-gray-300 px-2">
        <p className="text-[2.8vw] min-[400px]:text-[10px] text-gray-700 tracking-widest uppercase whitespace-nowrap">
          Copyright © 2026 Findea. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default MyAccountPage;
