import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'}
        />
        {product.platform && (
          <span className="product-badge">{product.platform}</span>
        )}
      </Link>

      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {product.category && (
          <p className="product-category">{product.category.name}</p>
        )}

        <div className="product-footer">
          <span className="product-price">{product.price.toLocaleString('tr-TR')} ₺</span>
          <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm">
            <FaShoppingCart /> Detay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
