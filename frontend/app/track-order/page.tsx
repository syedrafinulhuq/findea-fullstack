"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
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

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  product: { name: string; imageUrl: string | null };
};
type TrackedOrder = {
  id: string;
  orderNumber: string;
  total: string;
  status: string;
  createdAt: string;
  shippingLine1: string;
  shippingCity: string;
  shippingCountry: string;
  payment: { status: string; provider: string } | null;
  items: OrderItem[];
};

const statusLabel: Record<string, string> = {
  PENDING: "En attente", PAID: "Payé", PROCESSING: "En traitement",
  SHIPPED: "Expédié", DELIVERED: "Livré", CANCELLED: "Annulé", REFUNDED: "Remboursé",
};

const TrackOrderPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotFound(false);
    setOrder(null);
    setLoading(true);
    try {
      const url = `/api/orders/track/${encodeURIComponent(orderNumber)}${email ? `?email=${encodeURIComponent(email)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) { setError("Une erreur s'est produite."); return; }
      const data = await res.json();
      if (!data) { setNotFound(true); return; }
      setOrder(data);
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  }, [orderNumber, email]);

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
      <section className="relative w-full flex justify-center mb-6 md:mb-10 px-4">
        <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
          <div
            className="bg-[#e2ddd3] w-full sm:w-[85%] md:w-[50%] lg:w-[40%] h-24 md:h-32"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)' }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl flex items-center justify-center min-h-[6rem] md:min-h-[8rem]">
          <div className="flex flex-col items-center text-center px-2">
            <Link
              href="/"
              className="flex items-center gap-1 text-[10px] md:text-xs text-neutral-600 hover:text-black transition-colors mb-1"
            >
              <span>Accueil</span>
              <IoIosArrowForward className="text-[8px]" />
            </Link>

            <h1 className="text-lg sm:text-xl md:text-3xl font-serif text-[#1a1a1a] tracking-tight md:tracking-wider uppercase break-words">
              Suivre ma commande
            </h1>
          </div>

          <div className="absolute right-0 hidden lg:block">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-xs md:text-sm font-medium text-[#1a1a1a] hover:opacity-60 transition-all"
            >
              <IoIosArrowBack className="text-[10px]" />
              <span>Retour à la page précédente</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- TRACK ORDER FORM SECTION --- */}
      <section className="w-full py-8 md:py-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex justify-start">
          <div className="w-full max-w-xl text-left">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] mb-4 leading-tight">
              Restez toujours informé de l&apos;état de votre commande
            </h2>

            <div className="w-full h-[1px] bg-neutral-600 mb-6"></div>

            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed mb-8 font-light">
              Pour suivre votre commande, veuillez saisir votre numéro de commande dans la case ci-dessous et appuyer sur le bouton « Suivre ». Celui-ci vous a été communiqué sur votre reçu et dans l&apos;e-mail de confirmation que vous avez dû recevoir.
            </p>

            <form className="space-y-5 md:space-y-6" onSubmit={handleTrack}>
              <div>
                <label className="block text-sm font-serif text-[#1a1a1a] mb-2">
                  Numéro de commande *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Trouvé dans votre e-mail de confirmation."
                  className="w-full bg-[#e2ddd3] border-none py-3 px-4 focus:ring-1 focus:ring-neutral-400 outline-none transition-all placeholder:text-neutral-400/60 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-serif text-[#1a1a1a] mb-2">
                  E-mail de facturation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail utilisé lors de votre commande."
                  className="w-full bg-[#e2ddd3] border-none py-3 px-4 focus:ring-1 focus:ring-neutral-400 outline-none transition-all placeholder:text-neutral-400/60 text-sm"
                />
              </div>

              {error && <p className="text-red-600 text-sm font-serif">{error}</p>}
              {notFound && <p className="text-amber-700 text-sm font-serif">Aucune commande trouvée avec ce numéro.</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#efe1cc] text-[#1a1a1a] px-10 py-3 font-serif text-lg hover:bg-[#e2ddd3] transition-colors duration-300 disabled:opacity-60"
              >
                {loading ? "Recherche…" : "Suivre"}
              </button>
            </form>

            {order && (
              <div className="mt-10 bg-[#f1eeea] border border-[#e2dfd9] p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-5">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-600 mb-1">N° de commande</p>
                    <p className="text-[15px] font-bold text-black">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-600 mb-1">Statut</p>
                    <p className="text-[15px] font-bold text-black">{statusLabel[order.status] ?? order.status}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-600 mb-1">Total</p>
                    <p className="text-[15px] font-bold text-black">${Number(order.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-600 mb-1">Date</p>
                    <p className="text-[15px] font-bold text-black">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] uppercase font-bold text-gray-600 mb-1">Adresse de livraison</p>
                    <p className="text-[14px] font-bold text-black">{order.shippingLine1}, {order.shippingCity}, {order.shippingCountry}</p>
                  </div>
                </div>

                <hr className="border-[#e2dfd9]" />

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-[#e5e1da] border border-[#d8d5ce] p-3 items-center">
                      <div className="w-16 h-16 bg-white overflow-hidden flex-shrink-0 relative">
                        <Image src={item.product.imageUrl ?? "/robert.png"} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-black">{item.product.name}</p>
                        <p className="text-[12px] text-gray-600 uppercase">Qté : {item.quantity} | ${Number(item.unitPrice).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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

export default TrackOrderPage;
