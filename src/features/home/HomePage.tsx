import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Tractor,
} from 'lucide-react';
import { productService } from '../products/product.service';
import { Product, Category } from '../products/product.types';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../../components/common/Button';
import './home.css';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-container">
          <div className="home-hero-pill">
            <span className="home-hero-dot" />
            <span>Pilot Live in Nashik & Pune District Corridors</span>
          </div>

          <h1 className="home-hero-title">
            Fresh Produce Straight From Maharashtra Farms to Your Door.
          </h1>

          <p className="home-hero-desc">
            Direct farmer connection with 0% middleman deduction. 100% fair producer pricing and verified harvest dates.
          </p>

          <div className="home-hero-actions">
            <Link to="/products">
              <Button variant="accent" size="lg">
                Explore Marketplace <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/farmer/register">
              <Button variant="outline" size="lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                <Tractor size={16} /> Sell As Producer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <div className="page-container">
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="home-feature-title">Verified Farmers</div>
            <div className="home-feature-desc">
              Direct verification with Mahabhulekh 7/12 land records.
            </div>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Truck size={24} />
            </div>
            <div className="home-feature-title">Harvest in 24 Hrs</div>
            <div className="home-feature-desc">
              Dispatched from the field directly to your doorstep in hours.
            </div>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon">
              <HeartHandshake size={24} />
            </div>
            <div className="home-feature-title">Fair Direct Pricing</div>
            <div className="home-feature-desc">
              Farmers keep 100% of harvest sales. Zero middleman commission.
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <section className="mb-8">
          <h2 className="heading-3 mb-3">Browse by Category</h2>
          <div className="category-pill-row">
            <Link to="/products" className="category-pill-item">
              All Produce
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="category-pill-item"
              >
                {c.name} ({c.name_hi})
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Harvests */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="heading-2">Today's Fresh Harvests</h2>
              <p className="text-muted text-sm">Harvested within 24–48 hours across local sheds</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm">
                View All <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid-products">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Farmer Join Callout */}
        <div className="home-farmer-banner">
          <div>
            <h2 className="heading-2 text-white mb-2">Are you an agricultural producer?</h2>
            <p className="text-sm text-white/90 max-w-lg">
              List your crop harvests directly to thousands of households in Maharashtra with instant payment guarantees.
            </p>
          </div>
          <Link to="/farmer/register">
            <Button variant="primary" size="lg" style={{ backgroundColor: '#ffffff', color: '#78350f' }}>
              Register Farm Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
