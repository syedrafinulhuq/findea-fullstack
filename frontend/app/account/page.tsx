"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';

import {
  FiSearch, FiUser, FiHeart, FiShoppingCart,
  FiChevronDown, FiX, FiMenu
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});


const DashboardPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setProfileLoading(false); return; }
    fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      })
      .catch(() => setProfileError("Failed to load profile."))
      .finally(() => setProfileLoading(false));
  }, []);

  const handleUpdateProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    const token = localStorage.getItem("accessToken");
    if (!token) { setProfileError("You are not logged in."); return; }
    setProfileSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName: firstName || undefined, lastName: lastName || undefined, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) setProfileError(data?.message ?? "Update failed.");
      else setProfileSuccess("Profile updated successfully.");
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  }, [firstName, lastName, phone]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setPwError("You are not logged in.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data?.message ?? "Failed to update password.");
      } else {
        setPwSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  useEffect(() => {
    if (!profileSuccess) return;
    const t = setTimeout(() => setProfileSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [profileSuccess]);

  useEffect(() => {
    if (!pwSuccess) return;
    const t = setTimeout(() => setPwSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [pwSuccess]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }, [router]);

  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [nlMessage, setNlMessage] = useState('');

  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setNlStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNlStatus('success');
        setNlMessage('Thank you for subscribing!');
        setNlEmail('');
      } else {
        setNlStatus('error');
        setNlMessage(data.message ?? 'Something went wrong.');
      }
    } catch {
      setNlStatus('error');
      setNlMessage('Unable to subscribe. Please try again.');
    }
  }, [nlEmail]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  return (
    <div className={`w-full bg-[#fdfaf5] min-h-screen font-serif text-black pb-0 ${playfair.className}`}>

      {/* --- MOBILE HAMBURGER MENU --- */}
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
              className="w-full bg-white py-2 px-4 pr-10 text-sm focus:outline-none rounded-none italic"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>

          <nav className="flex flex-col gap-5 text-gray-800 tracking-widest text-[14px]">
            <Link href="/" className="uppercase">HOME</Link>
            <Link href="/about" className="uppercase">ABOUT</Link>

            <div>
              <button type="button" onClick={() => toggleDropdown('products')} className="w-full flex justify-between items-center uppercase">
                PRODUCTS <FiChevronDown className={openDropdown === 'products' ? 'rotate-180' : ''} />
              </button>
              {openDropdown === 'products' && (
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700">
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
                <ul className="pl-5 mt-3 space-y-3 text-[13px] italic text-gray-700">
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


      {/* --- 1. TOP BAR --- */}
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

      {/* --- 2. MAIN HEADER --- */}
      <div className="bg-white px-4 md:px-12 py-5 flex items-center justify-between border-b md:border-b-0 border-gray-100">
        <div className="md:hidden">
          <FiMenu size={24} className="text-black cursor-pointer" onClick={() => setIsMenuOpen(true)} />
        </div>
        <div className="hidden md:block w-1/4">
          <FiSearch size={20} className="text-gray-600 cursor-pointer hover:text-black" />
        </div>
        <div className="flex-1 md:w-2/4 flex justify-center">
          <Image src="/findea1.png" alt="FINDEA Logo" width={120} height={40} className="object-contain" priority />
        </div>
        <div className="flex md:w-1/4 justify-end gap-4 md:gap-5 items-center">
          <FiSearch size={22} className="md:hidden text-black cursor-pointer" />
          <Link href="/login"><FiUser size={20} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" /></Link>
          <FiHeart size={20} className="hidden md:block text-gray-600 cursor-pointer hover:text-black" />
          <FiShoppingCart size={22} className="text-black md:text-gray-600 cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* --- 3. DESKTOP NAVIGATION --- */}
      <nav className="hidden md:block bg-white border-t border-b border-gray-200 py-3 font-serif">
        <ul className="flex justify-center gap-8 text-[11px] font-semibold tracking-[0.18em] text-gray-700 uppercase">
          <li className="hover:text-black cursor-pointer transition-all"><Link href="/">Accueil</Link></li>
          <li className="hover:text-black cursor-pointer transition-all"><Link href="/about">À propos</Link></li>
          <li className="hover:text-black cursor-pointer transition-all"><Link href="/products">Produits</Link></li>
          <li className="hover:text-black cursor-pointer flex items-center gap-1">Listes <FiChevronDown size={14} /></li>
          <li className="hover:text-black cursor-pointer flex items-center gap-1">Services <FiChevronDown size={14} /></li>
          <li className="hover:text-black cursor-pointer transition-all">Boutiques</li>
        </ul>
      </nav>

      {/* --- TRAPEZOID SECTION (Desktop) --- */}
      <section className="hidden md:flex relative w-full justify-center mb-2">
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <div
            className="bg-[#e2ddd3] md:w-[45%] h-28"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)' }}
          ></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-28 text-[#1a1a1a] px-4">
          <h1 className="text-2xl font-serif font-bold tracking-[0.15em] uppercase text-center leading-tight">
            Mon compte
          </h1>
        </div>
      </section>

      {/* --- TRAPEZOID SECTION (Mobile) --- */}
      <section className="md:hidden relative w-full flex justify-center mb-2">
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <div
            className="bg-[#e2ddd3] w-[85%] h-20"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)' }}
          ></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-20 text-[#1a1a1a] px-4">
          <h1 className="text-lg font-serif font-bold tracking-[0.1em] uppercase text-center leading-tight">
            Mon compte
          </h1>
        </div>
      </section>

      {/* --- MOBILE HORIZONTAL MENU --- */}
      <div className="md:hidden w-full overflow-x-auto flex gap-3 px-4 py-8 bg-transparent custom-scrollbar">
        {['Personal Info', 'My Orders', 'My Registries', 'Manage Address', 'Payment', 'Logout'].map((tab) => (
          <button key={tab} onClick={tab === 'Logout' ? handleLogout : undefined} className={`flex-shrink-0 px-6 py-4 text-[13px] uppercase font-bold whitespace-nowrap ${tab === 'Personal Info' ? 'bg-[#f2e6cf] border border-[#d3c7ad]' : 'bg-[#d1cbc1]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-10 md:py-20 flex flex-col md:flex-row gap-12">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-full md:w-1/4 space-y-3 font-serif">
          <button className="w-full bg-[#f2e6cf] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#d3c7ad]">
            Personal Information
          </button>
          {["My Orders", "My Registries", "Manage Address", "Payment Method", "Logout"].map((item) => (
            <button key={item} onClick={item === 'Logout' ? handleLogout : undefined} className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">
              {item}
            </button>
          ))}
        </aside>

        {/* FORM SECTION */}
        <section className="w-full md:w-3/4">
          {profileLoading ? (
            <p className="text-[14px] font-serif text-gray-500">Chargement du profil…</p>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-serif font-bold text-black tracking-tight">Prénom</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-serif font-bold text-black tracking-tight">Nom</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-serif font-bold text-black tracking-tight">E-mail</label>
                <input type="email" value={email} readOnly className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black opacity-60 cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-serif font-bold text-black tracking-tight">Téléphone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black" />
              </div>

              {profileError && <p className="text-red-600 text-[14px] font-serif">{profileError}</p>}
              {profileSuccess && <p className="text-green-700 text-[14px] font-serif">{profileSuccess}</p>}

              <button type="submit" disabled={profileSaving} className="w-full md:w-auto bg-[#f2e6cf] text-black font-serif font-bold py-5 px-16 text-[15px] border border-[#d3c7ad] shadow-sm transition-all hover:bg-[#e9dab9] disabled:opacity-50">
                {profileSaving ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </form>
          )}

          <h2 className="text-[24px] font-serif font-bold mb-8 mt-16 tracking-wider text-black">Changer le mot de passe</h2>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-serif font-bold text-black tracking-tight">Mot de passe actuel*</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-serif font-bold text-black tracking-tight">Nouveau mot de passe*</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-serif font-bold text-black tracking-tight">Confirmer le mot de passe*</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black"
              />
            </div>

            {pwError && <p className="text-red-600 text-[14px] font-serif">{pwError}</p>}
            {pwSuccess && <p className="text-green-700 text-[14px] font-serif">{pwSuccess}</p>}

            <button
              type="submit"
              disabled={pwLoading}
              className="w-full md:w-auto bg-[#f2e6cf] text-black font-serif font-bold py-5 px-16 text-[15px] border border-[#d3c7ad] mt-4 shadow-sm transition-all hover:bg-[#e9dab9] disabled:opacity-50"
            >
              {pwLoading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; display: block; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; margin: 0 16px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cfc7b9; border-radius: 10px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cfc7b9 #f1f1f1; }
      `}</style>

      {/* --- NEWSLETTER SECTION (Mobile) --- */}
      <section className="md:hidden relative w-full h-[450px] flex items-center justify-center mt-10">
        <Image src="/newsletter.png" alt="Newsletter" fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-6 w-full max-w-lg">
          <h2 className="text-white text-3xl font-serif tracking-[0.1em] uppercase mb-4 leading-tight">ENTREZ DANS NOTRE UNIVERS</h2>
          <p className="text-white text-[15px] font-serif italic mb-10 leading-relaxed tracking-wide">Découvrez En Avant-Première Nos Nouvelles Collections Et Nos Trésors Exclusifs.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex items-stretch justify-center gap-3 w-full h-[56px]">
            <input
              type="email"
              placeholder="Your Email"
              value={nlEmail}
              onChange={(e) => setNlEmail(e.target.value)}
              required
              disabled={nlStatus === 'loading'}
              className="flex-grow min-w-0 bg-transparent border border-white px-5 text-white placeholder:text-white/60 focus:outline-none text-base"
            />
            <button type="submit" disabled={nlStatus === 'loading'} className="flex-shrink-0 px-6 h-full bg-[#f2e6cf] text-black font-bold uppercase tracking-widest text-[12px] transition-all hover:bg-[#e9dab9] whitespace-nowrap font-serif disabled:opacity-60">
              {nlStatus === 'loading' ? '…' : "S'abonner"}
            </button>
          </form>
          {nlMessage && (
            <p className={`mt-3 text-sm font-serif ${nlStatus === 'success' ? 'text-[#f2e6cf]' : 'text-red-300'}`}>{nlMessage}</p>
          )}
        </div>
      </section>

      {/* --- MOBILE FOOTER --- */}
      <footer className="md:hidden bg-[#f3f0ea] px-6 py-12 text-black">
        <div className="flex flex-col gap-10">
          <div className="space-y-6">
            <Image src="/findea1.png" alt="Footer Logo" width={110} height={30} className="object-contain" />
            <p className="text-[15px] leading-relaxed font-serif text-gray-800">
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
            <h3 className="font-serif font-bold text-[17px] uppercase tracking-widest">Entreprise</h3>
            <ul className="space-y-4 text-[15px] font-serif text-gray-700">
              <li className="cursor-pointer">À propos</li>
              <li className="cursor-pointer">Politique de confidentialité</li>
              <li className="cursor-pointer">Politique de retour et de remboursement</li>
              <li className="cursor-pointer">Conditions générales</li>
              <li className="cursor-pointer">Contactez-nous</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-[17px] uppercase tracking-widest">Services</h3>
            <ul className="space-y-4 text-[15px] font-serif text-gray-700">
              <li className="cursor-pointer">Liste de naissance</li>
              <li className="cursor-pointer">Liste de mariage</li>
              <li className="cursor-pointer">Proposer un service</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-[17px] uppercase tracking-widest">Contacts</h3>
            <div className="space-y-4 font-serif">
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

      <div className="md:hidden bg-[#ccc7bc] py-5 flex justify-center items-center border-t border-gray-300 px-2">
        <p className="text-[2.8vw] min-[400px]:text-[10px] text-gray-700 font-serif tracking-widest uppercase whitespace-nowrap">
          Copyright © 2026 Findea. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
