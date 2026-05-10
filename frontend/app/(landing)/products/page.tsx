"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../_components/Navbar";
import LandingTopAnnouncementBar from "../_components/LandingTopAnnouncementBar";
import BreadcrumbHero from "./_components/BreadcrumbHero";
import ProductGrid from "./_components/ProductGrid";
import FilterSidebar from "./_components/FilterSidebar";
import SortBar from "./_components/SortBar";
import Pagination from "./_components/Pagination";
import Container from "@/components/shared/Container";
import { Product, Category } from "@/types/product";
import { Filter, X } from "lucide-react";

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  category: { id: string; name: string; slug: string } | null;
};

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
};

function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category?.name ?? "",
    description: p.description ?? "",
    price: `$${Number(p.price).toFixed(2)}`,
    image: p.imageUrl ?? "/placeholder-product.jpg",
    hasGiftCard: false,
  };
}

function mapCategory(c: ApiCategory): Category {
  return { name: c.name, slug: c.slug };
}

const ProductsPage = () => {
  const [activeSort, setActiveSort] = useState("Default Sorting");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["FINDÉA COLLECTION"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products/categories")
      .then((r) => r.json())
      .then((data: ApiCategory[]) => {
        if (Array.isArray(data)) setCategories(data.map(mapCategory));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const url = new URL("/api/products", window.location.origin);
    if (selectedCategory) url.searchParams.set("category", selectedCategory);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data: ApiProduct[]) => {
        if (Array.isArray(data)) setRawProducts(data.map(mapProduct));
        else setError("Unexpected response from server.");
      })
      .catch(() => setError("Impossible de charger les produits."))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const products = useMemo(() => {
    const sorted = [...rawProducts];
    if (activeSort === "Price: Low to High") {
      sorted.sort((a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")));
    } else if (activeSort === "Price: High to Low") {
      sorted.sort((a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")));
    }
    return sorted;
  }, [rawProducts, activeSort]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filterSidebarProps = {
    categories,
    expandedFilters,
    toggleFilter,
    selectedCategory,
    onSelectCategory: (slug: string | null) => {
      setSelectedCategory(slug);
      setIsFilterOpen(false);
    },
  };

  return (
    <main className="min-h-screen bg-white relative">
      <LandingTopAnnouncementBar />
      <Navbar />
      <BreadcrumbHero />

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-[#999999] p-3 text-white shadow-lg flex items-center justify-center hover:bg-black transition-colors"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Mobile Filter Overlay/Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-[300px] bg-[#DEDAD2] transform transition-transform duration-300 overflow-y-auto ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            <FilterSidebar {...filterSidebarProps} />
          </div>
        </div>
      </div>

      <div className="bg-background pt-16 pb-24">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <FilterSidebar {...filterSidebarProps} />
            </div>

            <main className="flex-grow">
              <SortBar
                activeSort={activeSort}
                setActiveSort={setActiveSort}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {loading && (
                <div className="text-[14px] text-gray-500 font-playfair py-16 text-center">
                  Chargement des produits…
                </div>
              )}
              {error && (
                <div className="text-[14px] text-red-600 font-playfair py-16 text-center">
                  {error}
                </div>
              )}
              {!loading && !error && products.length === 0 && (
                <div className="text-[14px] text-gray-500 font-playfair py-16 text-center">
                  Aucun produit trouvé.
                </div>
              )}
              {!loading && !error && products.length > 0 && (
                <ProductGrid products={products} viewMode={viewMode} />
              )}

              {!loading && products.length > 0 && (
                <Pagination currentPage={1} totalPages={1} />
              )}
            </main>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default ProductsPage;
