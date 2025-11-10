import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaBox, FaGamepad, FaFilm, FaTv } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPlatform, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedPlatform) params.append('platform', selectedPlatform);
      if (sortBy) params.append('sort', sortBy);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await axios.get(`/api/products?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const getCategoryIcon = (index) => {
    const icons = [FaFilm, FaTv, FaGamepad, FaBox];
    return icons[index % icons.length];
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>En Kaliteli Ürünler Burada</h1>
            <p>Filmler, diziler, oyunlar ve daha fazlası en uygun fiyatlarla</p>

            <form onSubmit={handleSearch} className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Ara
              </button>
            </form>
          </div>
        </div>
      </section>

      {!selectedCategory && !searchTerm && (
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Kategoriler</h2>
            <div className="categories-grid">
              {categories.map((cat, index) => {
                const IconComponent = getCategoryIcon(index);
                return (
                  <Link
                    key={cat._id}
                    to={`/?category=${cat._id}`}
                    className="category-card"
                    onClick={() => setSelectedCategory(cat._id)}
                  >
                    <div className="category-icon">
                      <IconComponent />
                    </div>
                    <h3>{cat.name}</h3>
                    {cat.description && <p>{cat.description}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="products-section">
        <div className="container">
          <div className="filters-bar">
            <div className="filter-item">
              <FaFilter className="filter-icon" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
                <option value="">Tüm Platformlar</option>
                <option value="PS3">PS3</option>
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
                <option value="Xbox">Xbox</option>
                <option value="Other">Diğer</option>
              </select>
            </div>

            <div className="filter-item">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">En Yeni</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <FaBox className="no-products-icon" />
              <h3>Ürün bulunamadı</h3>
              <p>Farklı filtreler deneyebilirsiniz</p>
            </div>
          ) : (
            <>
              <div className="products-header">
                <h2>{products.length} ürün bulundu</h2>
              </div>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
