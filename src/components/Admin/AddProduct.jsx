import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Admin.css';

function AddProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    specifications: '',
    videoUrl: '',
    discount: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [errors, setErrors] = useState({});

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            price: data.price || '',
            description: data.description || '',
            category: data.category || '',
            specifications: data.specifications || '',
            videoUrl: data.videoUrl || '',
            discount: data.discount || ''
          });
          setExistingImages(data.imageUrls || []);
        } else {
          alert('Product not found');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error fetching product data');
        navigate('/admin');
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const validateFiles = (files) => {
    const newErrors = {};
    
    if (files.length > MAX_FILES) {
      newErrors.files = `Maximum ${MAX_FILES} images allowed`;
      return newErrors;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.files = 'Only JPEG, JPG, PNG, and WebP images are allowed';
        break;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        newErrors.files = `Each image must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        break;
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileErrors = validateFiles(files);
    
    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors);
      e.target.value = '';
      return;
    }

    setImageFiles(files);
    setUploadProgress(new Array(files.length).fill(0));
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const uploadImages = async () => {
    const uploadPromises = imageFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const fileName = `${Date.now()}-${index}-${file.name}`;
        const storageRef = ref(storage, `product-images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = progress;
              return newProgress;
            });
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const removeExistingImage = async (imageUrl, index) => {
    try {
      // Remove from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      
      // Remove from state
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from state even if storage deletion fails
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    if (existingImages.length === 0 && imageFiles.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let newImageUrls = [];
      
      if (imageFiles.length > 0) {
        newImageUrls = await uploadImages();
      }

      const allImageUrls = [...existingImages, ...newImageUrls];
      
      const priceFloat = parseFloat(formData.price);
      const discountFloat = parseFloat(formData.discount) || 0;
      const discountedPrice = discountFloat > 0 ? 
        priceFloat - (priceFloat * discountFloat / 100) : priceFloat;

      const productData = {
        name: formData.name.trim(),
        price: priceFloat,
        description: formData.description.trim(),
        category: formData.category.trim(),
        specifications: formData.specifications.trim(),
        videoUrl: formData.videoUrl.trim(),
        discount: discountFloat,
        discountedPrice,
        imageUrls: allImageUrls,
        updatedAt: new Date(),
      };

      if (productId) {
        await updateDoc(doc(db, 'products', productId), productData);
        alert('Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date(),
        });
        alert('Product added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        specifications: '',
        videoUrl: '',
        discount: ''
      });
      setImageFiles([]);
      setExistingImages([]);
      setUploadProgress([]);
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="form-header">
        <h3>{productId ? 'Edit Product' : 'Add New Product'}</h3>
        <button type="button" onClick={() => navigate('/admin')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select Category</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizers">Fertilizers</option>
              <option value="equipment">Equipment</option>
              <option value="tools">Tools</option>
              <option value="pesticides">Pesticides</option>
              <option value="irrigation">Irrigation</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Specifications</label>
          <textarea
            name="specifications"
            value={formData.specifications}
            onChange={handleInputChange}
            placeholder="Enter product specifications (optional)"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Product Video URL</label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="form-group">
          <label>Product Images * (Max {MAX_FILES} images, 5MB each)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            className={errors.files || errors.images ? 'error' : ''}
          />
          <small>Supported formats: JPEG, JPG, PNG, WebP</small>
          {errors.files && <span className="error-text">{errors.files}</span>}
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {/* Existing Images Preview */}
        {existingImages.length > 0 && (
          <div className="existing-images">
            <h4>Current Images:</h4>
            <div className="image-preview-grid">
              {existingImages.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Product ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url, index)}
                    className="remove-image-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images Preview */}
        {imageFiles.length > 0 && (
          <div className="new-images">
            <h4>New Images:</h4>
            <div className="image-preview-grid">
              {imageFiles.map((file, index) => (
                <div key={index} className="image-preview">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`New ${index + 1}`} 
                  />
                  <div className="upload-progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${uploadProgress[index] || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              productId ? 'Updating...' : 'Adding...'
            ) : (
              productId ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
