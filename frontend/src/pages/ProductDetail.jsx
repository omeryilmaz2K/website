import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp, FaPhone, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const phoneNumber = '905XXXXXXXXX';
  const whatsappNumber = '905XXXXXXXXX';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Ürün yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Ürün bulunamadı</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          <FaArrowLeft /> Anasayfaya Dön
        </Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Merhaba, ${product.name} hakkında bilgi almak istiyorum. Fiyat: ${product.price} ₺`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const imageUrl = product.images && product.images.length > 0
    ? product.images[selectedImage]
    : 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Geri Dön
        </Link>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>

            {product.category && (
              <p className="category-badge">{product.category.name}</p>
            )}

            {product.platform && (
              <p className="platform-badge">{product.platform}</p>
            )}

            <div className="price-section">
              <span className="price">{product.price.toLocaleString('tr-TR')} ₺</span>
              {product.condition && (
                <span className="condition">{product.condition}</span>
              )}
            </div>

            <div className="description">
              <h3>Ürün Açıklaması</h3>
              <p>{product.description}</p>
            </div>

            {product.brand && (
              <div className="product-info-item">
                <strong>Marka:</strong> {product.brand}
              </div>
            )}

            {product.stock !== undefined && (
              <div className="product-info-item">
                <strong>Stok Durumu:</strong>{' '}
                <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                  {product.stock > 0 ? `${product.stock} adet mevcut` : 'Stokta yok'}
                </span>
              </div>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="specifications">
                <h3>Özellikler</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="contact-buttons">
              <button onClick={handleWhatsApp} className="btn btn-whatsapp">
                <FaWhatsapp /> WhatsApp ile İletişime Geç
              </button>
              <button onClick={handleCall} className="btn btn-primary">
                <FaPhone /> Hemen Ara
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
