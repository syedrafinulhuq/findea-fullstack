'use client';

import Image from 'next/image';
import { useState, FormEvent } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to subscribe. Please try again.');
    }
  };

  return (
    <section className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/social-img/cta (1).png"
          alt="Newsletter Background"
          fill
          className="object-cover"
          sizes="100vw"
          draggable={false}
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
        <h2 className="text-3xl md:text-[40px] font-semibold font-playfair uppercase text-[#F5F3EE] tracking-widest mb-4">
          ENTREZ DANS NOTRE UNIVERS
        </h2>

        <p className="text-[19px] md:text-[22px] font-playfair mb-10 font-regular">
          Découvrez en avant-première nos nouvelles collections et nos trésors exclusifs.
        </p>

        {/* Subscription Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-row items-center justify-center gap-2 md:gap-4 mx-auto w-full max-w-sm md:max-w-none"
        >
          <div className="flex-1 md:w-96 md:flex-none">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-[#F5F3EE] py-2 md:py-3 px-3 md:px-4 text-white placeholder:text-white/70 focus:outline-none focus:border-[#F5F3EE] transition-colors font-manrope text-sm md:text-base"
              required
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#F1E1C2] text-black px-5 md:px-10 py-2 md:py-3 md:text-[19px] text-sm font-bold hover:bg-[#e5d8c1] transition-all tracking-wide shadow-lg font-playfair whitespace-nowrap disabled:opacity-60"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm font-playfair ${status === 'success' ? 'text-[#F1E1C2]' : 'text-red-300'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
