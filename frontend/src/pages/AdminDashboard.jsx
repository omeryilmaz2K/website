import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaBox,
  FaList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTachometerAlt,
  FaTags
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <Link
            to="/admin"
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link
            to="/admin/products"
            className={location.pathname.includes('/admin/products') ? 'active' : ''}
          >
            <FaBox /> Ürünler
          </Link>
          <Link
            to="/admin/categories"
            className={location.pathname.includes('/admin/categories') ? 'active' : ''}
          >
            <FaTags /> Kategoriler
          </Link>
        </nav>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
        </Routes>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setStats({
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length
      });
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <FaBox className="stat-icon" />
          <div>
            <h3>Toplam Ürün</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaTags className="stat-icon" />
          <div>
            <h3>Toplam Kategori</h3>
            <p className="stat-number">{stats.totalCategories}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    platform: '',
    condition: 'Yeni',
    stock: 0,
    tags: '',
    featured: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(t => t.trim())) : JSON.stringify([])
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, submitData);
        setMessage({ type: 'success', text: 'Ürün başarıyla güncellendi!' });
      } else {
        await axios.post('/api/products', submitData);
        setMessage({ type: 'success', text: 'Ürün başarıyla eklendi!' });
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Bir hata oluştu'
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      brand: product.brand || '',
      platform: product.platform || '',
      condition: product.condition || 'Yeni',
      stock: product.stock || 0,
      tags: product.tags ? product.tags.join(', ') : '',
      featured: product.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setMessage({ type: 'success', text: 'Ürün başarıyla silindi!' });
      fetchProducts();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Silme işlemi başarısız'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      platform: '',
      condition: 'Yeni',
      stock: 0,
      tags: '',
      featured: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="products-management">
      <div className="page-header">
        <h1>Ürün Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <FaPlus /> {showForm ? 'Formu Kapat' : 'Yeni Ürün Ekle'}
        </button>
      </div>

      {message.text && (
        <div className={message.type}>{message.text}</div>
      )}

      {showForm && (
        <div className="form-container card">
          <h2>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Ürün Adı *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fiyat (₺) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Açıklama *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="PS3">PS3</option>
                  <option value="PS4">PS4</option>
                  <option value="PS5">PS5</option>
                  <option value="Xbox">Xbox</option>
                  <option value="Other">Diğer</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Marka</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Durum</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="Yeni">Yeni</option>
                  <option value="İkinci El">İkinci El</option>
                  <option value="Sıfır Kutusunda">Sıfır Kutusunda</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stok</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Etiketler (virgülle ayırın)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="aksiyon, macera, yeni"
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  style={{ width: 'auto' }}
                />
                Öne Çıkan Ürün
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table">
        <h2>Mevcut Ürünler ({products.length})</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Platform</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.platform || '-'}</td>
                  <td>{product.price.toLocaleString('tr-TR')} ₺</td>
                  <td>{product.stock}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-icon btn-edit"
                      title="Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-icon btn-delete"
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !editingCategory ? { slug: value.toLowerCase().replace(/\s+/g, '-') } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, formData);
        setMessage({ type: 'success', text: 'Kategori başarıyla güncellendi!' });
      } else {
        await axios.post('/api/categories', formData);
        setMessage({ type: 'success', text: 'Kategori başarıyla eklendi!' });
      }

      fetchCategories();
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Bir hata oluştu'
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      setMessage({ type: 'success', text: 'Kategori başarıyla silindi!' });
      fetchCategories();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Silme işlemi başarısız'
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="categories-management">
      <div className="page-header">
        <h1>Kategori Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <FaPlus /> {showForm ? 'Formu Kapat' : 'Yeni Kategori Ekle'}
        </button>
      </div>

      {message.text && (
        <div className={message.type}>{message.text}</div>
      )}

      {showForm && (
        <div className="form-container card">
          <h2>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Kategori Adı *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Açıklama</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-table">
        <h2>Mevcut Kategoriler ({categories.length})</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Kategori Adı</th>
                <th>Slug</th>
                <th>Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category.description || '-'}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn-icon btn-edit"
                      title="Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="btn-icon btn-delete"
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
