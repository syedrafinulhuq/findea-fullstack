"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import {
  FiSearch, FiUser, FiHeart, FiShoppingCart,
  FiChevronDown, FiMenu, FiX
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
type Order = {
  id: string;
  orderNumber: string;
  total: string;
  subtotal: string;
  status: string;
  createdAt: string;
  payment: { status: string; provider: string } | null;
  items: OrderItem[];
};

const CANCELLABLE = ["PENDING", "PAID", "PROCESSING"];

const statusLabel: Record<string, string> = {
  PENDING: "En attente", PAID: "Payé", PROCESSING: "En traitement",
  SHIPPED: "Expédié", DELIVERED: "Livré", CANCELLED: "Annulé", REFUNDED: "Remboursé",
};

const MyOrdersPage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setOrdersError("Veuillez vous connecter pour voir vos commandes."); setOrdersLoading(false); return; }
    fetch("/api/orders/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); })
      .catch(() => setOrdersError("Impossible de charger les commandes."))
      .finally(() => setOrdersLoading(false));
  }, []);

  const handleCancel = useCallback(async (orderNumber: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const reason = window.prompt("Motif d'annulation (optionnel) :") ?? "Demande client";
    setCancellingId(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.orderNumber === orderNumber ? { ...o, status: "CANCELLED" } : o));
      }
    } finally {
      setCancellingId(null);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }, [router]);

  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [nlMessage, setNlMessage] = useState('');

  const handleNewsletterSubmit = useCallback(async (e: FormEvent) => {
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
    <div className={`w-full bg-[#fdfaf5] min-h-screen pb-0 ${playfair.className}`}>

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

      {/* WEB VIEW */}
      <div className="hidden md:block">
        <div className="bg-white border-b border-gray-100 py-2 px-12 flex justify-between items-center text-[10px] tracking-[0.15em] uppercase text-gray-500">
          <div className="flex-1"></div>
          <div className="flex-2 text-center font-medium">Livraison gratuite pour toute commande de plus de 250 $</div>
          <div className="flex-1 flex justify-end gap-4">
            <FaFacebookF className="cursor-pointer hover:text-black transition-colors" />
            <FaInstagram className="cursor-pointer hover:text-black transition-colors" />
            <RiTwitterXFill className="cursor-pointer hover:text-black transition-colors" />
            <FaYoutube className="cursor-pointer hover:text-black transition-colors" />
          </div>
        </div>

        <div className="bg-white px-12 py-5 flex items-center justify-between">
          <div className="w-1/4">
            <FiSearch size={20} className="text-gray-600 cursor-pointer hover:text-black" />
          </div>
          <div className="w-2/4 flex justify-center">
            <Image src="/findea1.png" alt="FINDEA Logo" width={140} height={40} className="object-contain" />
          </div>
          <div className="w-1/4 flex justify-end gap-5 items-center">
            <Link href="/login"><FiUser size={20} className="text-gray-600 cursor-pointer hover:text-black" /></Link>
            <FiHeart size={20} className="text-gray-600 cursor-pointer hover:text-black" />
            <FiShoppingCart size={20} className="text-gray-600 cursor-pointer hover:text-black" />
          </div>
        </div>

        <nav className="bg-white border-t border-b border-gray-200 py-3">
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
              style={{ clipPath: 'polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)' }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-20 md:h-28 text-[#1a1a1a] px-4">
            <h1 className="text-lg md:text-2xl font-bold tracking-[0.1em] md:tracking-[0.15em] uppercase text-center leading-tight">
              Mon compte
            </h1>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-10">
          <aside className="w-full md:w-1/4 space-y-3">
            <button className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">
              <Link href="/account">Informations personnelles</Link>
            </button>
            <button className="w-full bg-[#f2e6cf] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#d3c7ad]">Mes commandes</button>
            <button className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">Mes listes</button>
            <button className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">Gérer les adresses</button>
            <button className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">Modes de paiement</button>
            <button onClick={handleLogout} className="w-full bg-[#e5e1da] text-black font-bold py-4 px-6 text-[13px] uppercase tracking-wider text-left border border-[#cfcbc4]">Déconnexion</button>
          </aside>

          <section className="w-full md:w-3/4 space-y-10">
            {ordersLoading && <p className="text-[14px] font-serif text-gray-500">Chargement des commandes…</p>}
            {ordersError && <p className="text-[14px] font-serif text-red-600">{ordersError}</p>}
            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p className="text-[15px] font-serif text-gray-600">Vous n&apos;avez pas encore de commandes.</p>
            )}
            {orders.map((order) => (
              <div key={order.id} className="bg-[#f1eeea] border border-[#e2dfd9] p-8">
                <div className="grid grid-cols-3 gap-y-8 mb-12">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">N° de commande</p>
                    <p className="text-[15px] font-bold text-black tracking-tight">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">Total</p>
                    <p className="text-[15px] font-bold text-black tracking-tight">${Number(order.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">Statut</p>
                    <p className="text-[15px] font-bold text-black tracking-tight">{statusLabel[order.status] ?? order.status}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">Paiement</p>
                    <p className="text-[15px] font-bold text-black tracking-tight">{order.payment ? statusLabel[order.payment.status] ?? order.payment.status : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">Mode de paiement</p>
                    <p className="text-[15px] font-bold text-black tracking-tight capitalize">{order.payment?.provider ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-gray-700 mb-1">Date</p>
                    <p className="text-[15px] font-bold text-black tracking-tight">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <hr className="border-[#e2dfd9] mb-8" />

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6 bg-[#e5e1da] border border-[#d8d5ce] p-4">
                      <div className="w-20 h-20 bg-white overflow-hidden flex-shrink-0 relative">
                        <Image src={item.product.imageUrl ?? "/robert.png"} alt={item.product.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[14px] font-bold text-black mb-1">{item.product.name}</p>
                        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter">Qté : {item.quantity} | Prix : ${Number(item.unitPrice).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#e2dfd9]">
                  <Link href="/track-order">
                    <button className="bg-[#f2e6cf] border border-[#d3c7ad] px-10 py-3 text-[13px] font-bold uppercase tracking-[0.15em]">Suivre la commande</button>
                  </Link>
                  {CANCELLABLE.includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order.orderNumber)}
                      disabled={cancellingId === order.orderNumber}
                      className="bg-transparent border border-black px-10 py-3 text-[13px] font-bold uppercase tracking-[0.15em] disabled:opacity-50"
                    >
                      {cancellingId === order.orderNumber ? "Annulation…" : "Demande d'annulation"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden pb-0">
        <header className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <FiMenu size={24} className="text-black cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <div className="flex-1 flex justify-center translate-x-3">
            <Image src="/findea1.png" alt="Logo" width={100} height={35} className="object-contain" priority />
          </div>
          <div className="flex gap-4">
            <FiSearch size={22} className="text-black cursor-pointer" />
            <FiShoppingCart size={22} className="text-black cursor-pointer" />
          </div>
        </header>

        <section className="relative w-full flex justify-center mb-2">
          <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
            <div
              className="bg-[#e2ddd3] w-[85%] h-20"
              style={{ clipPath: 'polygon(10% 0%, 90% 0%, 82% 100%, 18% 100%)' }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-20 text-[#1a1a1a] px-4">
            <h1 className="text-lg font-bold tracking-[0.1em] uppercase text-center leading-tight">
              Mon compte
            </h1>
          </div>
        </section>

        <div className="w-full overflow-x-auto flex gap-3 px-4 py-8 bg-transparent custom-scrollbar">
          <button className="flex-shrink-0 bg-[#d1cbc1] text-black px-6 py-4 text-[13px] uppercase font-bold tracking-tight whitespace-nowrap">
            <Link href="/account">Infos personnelles</Link>
          </button>
          <button className="flex-shrink-0 bg-[#f2e6cf] text-black px-8 py-4 text-[13px] uppercase font-bold tracking-tight whitespace-nowrap border border-[#d3c7ad]">
            Mes commandes
          </button>
          <button className="flex-shrink-0 bg-[#d1cbc1] text-black px-6 py-4 text-[13px] uppercase font-bold tracking-tight whitespace-nowrap">
            Mes listes
          </button>
          <button className="flex-shrink-0 bg-[#d1cbc1] text-black px-6 py-4 text-[13px] uppercase font-bold tracking-tight whitespace-nowrap">
            Gérer les adresses
          </button>
        </div>

        <div className="px-4 mt-8 space-y-10">
          {ordersLoading && <p className="text-[14px] font-serif text-gray-500 px-2">Chargement…</p>}
          {ordersError && <p className="text-[14px] font-serif text-red-600 px-2">{ordersError}</p>}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <p className="text-[15px] font-serif text-gray-600 px-2">Vous n&apos;avez pas encore de commandes.</p>
          )}
          {orders.map((order) => (
            <div key={order.id}>
              <div className="bg-[#fdfaf5] border border-gray-100 overflow-hidden shadow-sm">
                <div className="bg-[#d1cbc1] px-5 py-4">
                  <h2 className="text-[17px] text-black tracking-wide">{order.orderNumber}</h2>
                </div>
                <div className="px-5 py-2">
                  {[
                    { label: "Total", value: `$${Number(order.total).toFixed(2)}` },
                    { label: "Paiement", value: order.payment ? (statusLabel[order.payment.status] ?? order.payment.status) : "—" },
                    { label: "Mode de paiement", value: order.payment?.provider ?? "—" },
                    { label: "Statut", value: statusLabel[order.status] ?? order.status },
                    { label: "Date", value: new Date(order.createdAt).toLocaleDateString("fr-FR") },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-5 border-b border-gray-200 last:border-0">
                      <span className="text-[15px] text-gray-800 font-medium">{item.label}</span>
                      <span className="text-[15px] text-black capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[#e5e1da] border border-[#d8d5ce] p-4 items-center">
                    <div className="w-24 h-24 bg-white overflow-hidden flex-shrink-0 relative">
                      <Image src={item.product.imageUrl ?? "/robert.png"} alt={item.product.name} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[16px] font-bold text-black mb-1 leading-tight">{item.product.name}</p>
                      <p className="text-[13px] font-medium text-gray-700 uppercase tracking-tighter">Qté : {item.quantity} | ${Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 pb-4">
                <Link href="/track-order">
                  <button className="w-full bg-[#f2e6cf] border border-[#d3c7ad] py-5 text-[15px] font-bold uppercase tracking-[0.15em] text-black shadow-sm">
                    Suivre la commande
                  </button>
                </Link>
                {CANCELLABLE.includes(order.status) && (
                  <button
                    onClick={() => handleCancel(order.orderNumber)}
                    disabled={cancellingId === order.orderNumber}
                    className="w-full bg-white border border-black py-5 text-[15px] font-bold uppercase tracking-[0.15em] text-black disabled:opacity-50"
                  >
                    {cancellingId === order.orderNumber ? "Annulation…" : "Demande d'annulation"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <section className="relative w-full h-[450px] flex items-center justify-center mt-10">
          <Image src="/newsletter.png" alt="Newsletter" fill className="object-cover brightness-75" priority />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 text-center px-6 w-full max-w-lg">
            <h2 className="text-white text-3xl tracking-[0.1em] uppercase mb-4 leading-tight">ENTREZ DANS NOTRE UNIVERS</h2>
            <p className="text-white text-[15px] italic mb-10 leading-relaxed tracking-wide">Découvrez En Avant-Première Nos Nouvelles Collections Et Nos Trésors Exclusifs.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-stretch justify-center gap-3 w-full h-[56px]">
              <input type="email" placeholder="Your Email" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} required disabled={nlStatus === 'loading'} className="flex-grow min-w-0 bg-transparent border border-white px-5 text-white placeholder:text-white/60 focus:outline-none text-base" />
              <button type="submit" disabled={nlStatus === 'loading'} className="flex-shrink-0 px-6 h-full bg-[#f2e6cf] text-black font-bold uppercase tracking-widest text-[12px] transition-all hover:bg-[#e9dab9] whitespace-nowrap disabled:opacity-60">{nlStatus === 'loading' ? '…' : "S'abonner"}</button>
            </form>
            {nlMessage && <p className={`mt-3 text-sm ${nlStatus === 'success' ? 'text-[#f2e6cf]' : 'text-red-300'}`}>{nlMessage}</p>}
          </div>
        </section>

        <footer className="bg-[#f3f0ea] px-6 py-12 text-black">
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <Image src="/findea1.png" alt="Footer Logo" width={110} height={30} className="object-contain" />
              <p className="text-[15px] leading-relaxed text-gray-800">
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
              <h3 className="text-[18px] font-bold tracking-widest uppercase text-black">Company</h3>
              <ul className="space-y-4 text-[16px] text-gray-800 font-medium">
                <li className="cursor-pointer hover:text-black">About</li>
                <li className="cursor-pointer hover:text-black">Privacy Policy</li>
                <li className="cursor-pointer hover:text-black">Return & Refund Policy</li>
                <li className="cursor-pointer hover:text-black">Terms & Conditions</li>
                <li className="cursor-pointer hover:text-black">Contact Us</li>
              </ul>
            </div>
            <div className="space-y-5">
              <h3 className="text-[18px] font-bold tracking-widest uppercase text-black">Services</h3>
              <ul className="space-y-4 text-[16px] text-gray-800 font-medium">
                <li className="cursor-pointer hover:text-black">Baby Registry</li>
                <li className="cursor-pointer hover:text-black">Wedding List</li>
                <li className="cursor-pointer hover:text-black">Offer A Service</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold tracking-widest uppercase text-black">Contacts</h3>
              <div className="space-y-1">
                <p className="text-[16px] font-bold text-black">Email:</p>
                <p className="text-[16px] text-gray-800">test@test.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-[16px] font-bold text-black">Phone</p>
                <p className="text-[16px] text-gray-800">0 000 000 000</p>
              </div>
            </div>
          </div>
        </footer>

        <div className="bg-[#ccc7bc] py-5 flex justify-center items-center border-t border-gray-300 px-2">
          <p className="text-[2.5vw] text-gray-700 tracking-wider uppercase whitespace-nowrap">
            Copyright © 2026 Findea. Tous droits réservés.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; display: block; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; margin: 0 16px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cfc7b9; border-radius: 10px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cfc7b9 #f1f1f1; }
      `}</style>
    </div>
  );
};

export default MyOrdersPage;
