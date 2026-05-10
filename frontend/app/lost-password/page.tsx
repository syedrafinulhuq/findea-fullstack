"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

const LostPasswordPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  return (
    <div className={`${playfair.className} w-full bg-[#fdfaf5] min-h-screen relative overflow-x-hidden`}>

      {/* --- MOBILE HAMBURGER MENU OVERLAY --- */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/20" onClick={() => setIsMenuOpen(false)}></div>

        <div className={`relative w-[280px] h-full bg-[#d3cec4] shadow-xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } p-6 overflow-y-auto`}>

          <div className="flex justify-between items-center mb-6">
            <Image src="/findea1.png" alt="Logo" width={90} height={30} className="object-contain" />
            <FiX size={24} className="text-gray-700 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Type here..."
              className="w-full bg-white py-2 px-4 pr-10 text-sm focus:outline-none rounded-none italic border-none"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          <nav className="flex flex-col gap-5 text-gray-800 tracking-widest text-[14px] uppercase">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>HOME</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>ABOUT</Link>

            <div>
              <button type="button" onClick={() => toggleDropdown('products')} className="w-full flex justify-between items-center uppercase">
                PRODUCTS <FiChevronDown className={openDropdown === 'products' ? 'rotate-180' : ''} />
              </button>
              {openDropdown === 'products' && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700 normal-case">
                  <li><Link href="/products">Featured</Link></li>
                  <li><Link href="/products">New Arrivals</Link></li>
                  <li><Link href="/products">Best Sellers</Link></li>
                  <li><Link href="/products">Collection</Link></li>
                </ul>
              )}
            </div>

            <div>
              <button type="button" onClick={() => toggleDropdown('registries')} className="w-full flex justify-between items-center uppercase">
                REGISTRIES <FiChevronDown className={openDropdown === 'registries' ? 'rotate-180' : ''} />
              </button>
              {openDropdown === 'registries' && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700 normal-case">
                  <li><Link href="#">Wedding Registry</Link></li>
                  <li><Link href="#">Baby Registry</Link></li>
                  <li><Link href="#">Find a Registry</Link></li>
                </ul>
              )}
            </div>

            <div>
              <button type="button" onClick={() => toggleDropdown('services')} className="w-full flex justify-between items-center uppercase">
                SERVICES <FiChevronDown className={openDropdown === 'services' ? 'rotate-180' : ''} />
              </button>
              {openDropdown === 'services' && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700 normal-case">
                  <li><Link href="#">Wedding Services</Link></li>
                  <li><Link href="#">Baby & Family</Link></li>
                  <li><Link href="#">Home & Lifestyle</Link></li>
                  <li><Link href="#">Wellness & Beauty</Link></li>
                  <li><Link href="#">Photography</Link></li>
                </ul>
              )}
            </div>

            <Link href="/boutiques" onClick={() => setIsMenuOpen(false)}>BOUTIQUES</Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="mt-2">Sign Up</Link>
          </nav>
        </div>
      </div>

      {/* --- 1. TOP BAR (Web Only) --- */}
      <div className="hidden md:flex bg-white border-b border-gray-100 py-2 px-12 justify-between items-center text-[10px] tracking-[0.15em] uppercase text-gray-500">
        <div className="flex-1"></div>
        <div className="flex-2 text-center font-medium">Livraison gratuite pour toute commande de plus de 250 $</div>
        <div className="flex-1 flex justify-end gap-4">
          <FaFacebookF className="cursor-pointer hover:text-black transition-colors" />
          <FaInstagram className="cursor-pointer hover:text-black transition-colors" />
          <RiTwitterXFill className="cursor-pointer hover:text-black transition-colors" />
          <FaYoutube className="cursor-pointer hover:text-black transition-colors" />
        </div>
      </div>

      {/* --- 2. MAIN LOGO SECTION --- */}
      <div className="bg-white px-4 md:px-12 py-4 md:py-5 flex items-center justify-between sticky top-0 z-50 shadow-sm md:shadow-none">
        <div className="w-1/4">
          <FiMenu size={24} className="md:hidden text-gray-700 cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <FiSearch size={20} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" />
        </div>

        <div className="w-2/4 flex justify-center">
          <Image src="/findea1.png" alt="FINDEA Logo" width={110} height={35} className="object-contain md:w-[140px]" priority />
        </div>

        <div className="w-1/4 flex justify-end gap-4 items-center">
          <FiSearch size={22} className="md:hidden text-gray-700 cursor-pointer" />
          <Link href="/login"><FiUser size={20} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" /></Link>
          <FiHeart size={20} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" />
          <FiShoppingCart size={22} className="text-gray-700 md:text-gray-600 cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* --- 3. NAVIGATION (Web Only) --- */}
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

      {/* --- 4. TRAPEZOID SECTION --- */}
      <section className="relative w-full flex justify-center mb-2">
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <div
            className="bg-[#e2ddd3] w-[85%] md:w-[45%] h-20 md:h-28"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)' }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex items-center justify-center h-20 md:h-28">
          <div className="absolute left-1/2 -translate-x-1/2 text-[#1a1a1a] flex flex-col items-center gap-1">
            <Link href="/" className="text-xs md:hidden text-neutral-500 hover:text-[#1a1a1a] transition-colors">
              Accueil ❯
            </Link>
            <h1 className="text-md md:text-xl font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase text-center leading-tight">
              Mot de passe oublié
            </h1>
          </div>

          <div className="ml-auto hidden md:block">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] hover:opacity-70 transition-all"
            >
              <span className="text-[10px]">❮</span> Retour à la page précédente
            </button>
          </div>
        </div>
      </section>

      {/* --- 5. LOST PASSWORD MAIN CONTENT --- */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        <div className="max-w-2xl text-center mb-10 md:mb-12">
          <p className="text-[#666] md:text-[#85827B] text-[14px] md:text-[16px] leading-[1.8] font-medium">
            {step === 1
              ? "Mot de passe oublié ? Saisissez votre adresse e-mail et nous vous enverrons un code de vérification."
              : `Un code à 6 chiffres a été envoyé à ${email}. Saisissez-le ci-dessous avec votre nouveau mot de passe.`}
          </p>
        </div>

        {success ? (
          <div className="w-full max-w-[420px] text-center space-y-6">
            <p className="text-green-700 text-[15px] font-medium">
              Mot de passe mis à jour avec succès !
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#f2e6cf] hover:bg-[#e9dab9] text-black font-bold py-4 text-[16px] tracking-[0.08em] transition-all border border-[#d3c7ad] shadow-sm text-center"
            >
              Se connecter
            </Link>
          </div>
        ) : step === 1 ? (
          <form className="w-full max-w-[420px] space-y-6 md:space-y-7" onSubmit={handleRequestOtp}>
            <div className="space-y-3">
              <label className="block text-[15px] md:text-[13px] font-bold text-black tracking-wide">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#e5e1da] border border-[#cfcbc4] py-4 px-5 focus:outline-none focus:border-gray-500 transition-all text-gray-800"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f2e6cf] hover:bg-[#e9dab9] text-black font-bold py-4 text-[16px] md:text-[17px] tracking-[0.08em] transition-all border border-[#d3c7ad] shadow-sm disabled:opacity-60"
              >
                {loading ? "Envoi..." : "Envoyer le code"}
              </button>
            </div>
          </form>
        ) : (
          <form className="w-full max-w-[420px] space-y-6 md:space-y-7" onSubmit={handleResetPassword}>
            <div className="space-y-3">
              <label className="block text-[15px] md:text-[13px] font-bold text-black tracking-wide">
                Code de vérification (6 chiffres) *
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                placeholder="000000"
                className="w-full bg-[#e5e1da] border border-[#cfcbc4] py-4 px-5 focus:outline-none focus:border-gray-500 transition-all text-gray-800 tracking-[0.3em] text-center text-[20px]"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[15px] md:text-[13px] font-bold text-black tracking-wide">
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#e5e1da] border border-[#cfcbc4] py-4 px-5 focus:outline-none focus:border-gray-500 transition-all text-gray-800"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[15px] md:text-[13px] font-bold text-black tracking-wide">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#e5e1da] border border-[#cfcbc4] py-4 px-5 focus:outline-none focus:border-gray-500 transition-all text-gray-800"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f2e6cf] hover:bg-[#e9dab9] text-black font-bold py-4 text-[16px] md:text-[17px] tracking-[0.08em] transition-all border border-[#d3c7ad] shadow-sm disabled:opacity-60"
              >
                {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setNewPassword(""); setConfirmPassword(""); setError(""); }}
                className="w-full text-[13px] text-gray-500 hover:text-black transition-colors underline"
              >
                Changer d&apos;adresse e-mail
              </button>
            </div>
          </form>
        )}
      </main>

      {/* --- 6. NEWSLETTER SECTION (Mobile) --- */}
      <section className="md:hidden relative w-full h-[450px] flex items-center justify-center mt-10">
        <Image src="/newsletter.png" alt="Newsletter" fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-6 w-full max-w-lg">
          <h2 className="text-white text-3xl tracking-[0.1em] uppercase mb-4 leading-tight">ENTREZ DANS NOTRE UNIVERS</h2>
          <p className="text-white text-[15px] italic mb-10 leading-relaxed tracking-wide">Découvrez En Avant-Première Nos Nouvelles Collections Et Nos Trésors Exclusifs.</p>
          <div className="flex items-stretch justify-center gap-3 w-full h-[56px]">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-grow min-w-0 bg-transparent border border-white px-5 text-white placeholder:text-white/60 focus:outline-none text-base"
            />
            <button className="flex-shrink-0 px-6 h-full bg-[#f2e6cf] text-black font-bold uppercase tracking-widest text-[12px] transition-all hover:bg-[#e9dab9] whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
        </div>
      </section>

      {/* --- 7. MOBILE FOOTER SECTION --- */}
      <footer className="md:hidden bg-[#f3f0ea] px-6 py-12 text-black">
        <div className="flex flex-col gap-10">
          <div className="space-y-6">
            <Image src="/findea1.png" alt="Footer Logo" width={110} height={30} className="object-contain" />
            <p className="text-[15px] leading-relaxed text-gray-800 italic">
              Etiam nulla nunc, aliquet vel metus nec, scelerisque tempus enim. Sed eget blandit lectus.
            </p>
            <div className="flex gap-6 text-xl text-gray-900">
              <FaFacebookF className="cursor-pointer" />
              <FaInstagram className="cursor-pointer" />
              <RiTwitterXFill className="cursor-pointer" />
              <FaYoutube className="cursor-pointer" />
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="font-bold text-[17px] uppercase tracking-widest">Company</h3>
            <ul className="space-y-4 text-[15px] text-gray-700">
              <li className="cursor-pointer">À propos</li>
              <li className="cursor-pointer">Politique de confidentialité</li>
              <li className="cursor-pointer">Politique de retour et de remboursement</li>
              <li className="cursor-pointer">Conditions générales</li>
              <li className="cursor-pointer">Contactez-nous</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h3 className="font-bold text-[17px] uppercase tracking-widest">Services</h3>
            <ul className="space-y-4 text-[15px] text-gray-700">
              <li className="cursor-pointer">Liste de naissance</li>
              <li className="cursor-pointer">Liste de mariage</li>
              <li className="cursor-pointer">Proposer un service</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h3 className="font-bold text-[17px] uppercase tracking-widest">Contacts</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[15px]">E-mail :</p>
                <p className="text-gray-700">test@test.com</p>
              </div>
              <div>
                <p className="font-bold text-[15px]">Téléphone :</p>
                <p className="text-gray-700">0 000 000 000</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* --- 8. COPYRIGHT BAR --- */}
      <div className="md:hidden bg-[#ccc7bc] py-5 flex justify-center items-center border-t border-gray-300 px-2">
        <p className="text-[2.8vw] min-[400px]:text-[10px] text-gray-700 tracking-widest uppercase whitespace-nowrap">
          Copyright © 2026 Findea. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default LostPasswordPage;
