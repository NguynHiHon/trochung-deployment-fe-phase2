import React, { useState, useEffect } from "react";
import "./HomeLanding.css";
import {
    heroSlides,
    areaSuggestions
} from "../../data/homeData";
import { fetchHomeData } from "../../services/api/postApi";

const Placeholder = ({ children }) => (
    <div className="ph" role="img" aria-label="placeholder">
        {children}
    </div>
);

/* --- HERO CAROUSEL (có nút next/prev + auto slide) --- */
const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const total = heroSlides.length;

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % total);
        }, 4000); // tự động trượt mỗi 4s
        return () => clearInterval(interval);
    }, [total]);

    return (
        <section className="hero">
            <div className="hero-slider-wrapper">
                <button className="nav prev" onClick={handlePrev}>‹</button>

                <div
                    className="hero-slider"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {heroSlides.map((s) => (
                        <div key={s.id} className="hero-slide">
                            <img
                                src={s.imageUrl}
                                alt={s.title}
                                className="hero-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="ph hero-fallback" style={{ display: 'none' }}>
                                <h1>{s.title}</h1>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="nav next" onClick={handleNext}>›</button>
            </div>

            <div className="dots">
                {heroSlides.map((s, idx) => (
                    <span
                        key={s.id}
                        className={`dot ${idx === index ? "active" : ""}`}
                        onClick={() => setIndex(idx)}
                    />
                ))}
            </div>
        </section>
    );
};

/* --- POST CARD --- */
/* --- POST CARD --- */
const PostCard = ({ post, onViewDetails }) => (
    <article className="card">
        {post.thumbnail ? (
            <img
                src={post.thumbnail}
                alt={post.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                    // Nếu ảnh lỗi, ẩn ảnh và hiển thị placeholder thay thế
                    e.target.style.display = 'none';
                    const placeholder = e.target.parentNode.querySelector('.ph');
                    if (placeholder) placeholder.style.display = 'flex';
                }}
            />
        ) : (
            <div className="ph" role="img" aria-label="placeholder">
                <span>No Image</span>
            </div>
        )}

        <div className="card-body">
            <h3>{post.title}</h3>
            <button className="btn" onClick={() => onViewDetails(post)}>
                Xem chi tiết
            </button>
        </div>
    </article>
);


/* --- POSTS SECTION --- */
const PostsSection = ({ title, items, onViewDetails }) => (
    <section className="row-section">
        <h3 className="section-title">{title}</h3>
        <div className="grid-3">
            {items.map((p) => (
                <PostCard key={p.id} post={p} onViewDetails={onViewDetails} />
            ))}
        </div>
    </section>
);

/* --- POST DETAIL MODAL --- */
const PostDetailModal = ({ post, isOpen, onClose }) => {
    if (!isOpen || !post) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{post.title}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {post.thumbnail && (
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                        />
                    )}
                    <div className="post-meta">
                        <span><strong>Tác giả:</strong> {post.author || "Tên người đăng"}</span>
                        <span><strong>Ngày đăng:</strong> {post.date || "1/1/2024"}</span>
                    </div>
                    {post.description && (
                        <div className="post-description">
                            <h4>Mô tả:</h4>
                            <p>{post.description}</p>
                        </div>
                    )}
                    {post.address && (
                        <div className="post-address">
                            <h4>Địa chỉ:</h4>
                            <p>📍 {post.address}, {post.district}, {post.province}</p>
                        </div>
                    )}
                    <div className="post-details">
                        {post.area && (
                            <div className="detail-item">
                                <strong>Diện tích:</strong> 📐 {post.area}m²
                            </div>
                        )}
                        {post.roomType && (
                            <div className="detail-item">
                                <strong>Loại phòng:</strong> 🏠 {post.roomType}
                            </div>
                        )}
                        {post.price && (
                            <div className="detail-item">
                                <strong>Giá thuê:</strong> {post.price}
                            </div>
                        )}
                    </div>
                    {post.utilities && post.utilities.length > 0 && (
                        <div className="post-utilities">
                            <h4>Tiện ích:</h4>
                            <div className="utilities-list">
                                {post.utilities.map((utility, index) => (
                                    <span key={index} className="utility-tag">
                                        {utility}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    {/* <button className="btn btn-primary" onClick={() => window.location.href = post.contactUrl || '#'}>
                        Liên hệ
                    </button> */}
                    <button className="btn btn-secondary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
const AreaCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900) {
                setVisibleCount(1);
            } else {
                setVisibleCount(4);
            }
        };

        handleResize(); // chạy ngay khi load
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? areaSuggestions.length - visibleCount : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev + visibleCount >= areaSuggestions.length ? 0 : prev + 1
        );
    };

    return (
        <section className="areas">
            <h3 className="section-title">Gợi ý khu vực</h3>
            <div className="areas-container">
                <button className="nav prev" onClick={handlePrev}>‹</button>
                <div className="areas-track-wrapper">
                    <div
                        className="areas-track"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                        }}
                    >
                        {areaSuggestions.map((a) => (
                            <div key={a.id} className="area-item">
                                {a.imageUrl ? (
                                    <img
                                        src={a.imageUrl}
                                        alt={a.name}
                                        className="area-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="ph area-fallback" style={{ display: a.imageUrl ? 'none' : 'flex' }}>
                                    <span className="badge">{a.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="nav next" onClick={handleNext}>›</button>
            </div>
        </section>
    );
};


/* --- MAIN PAGE --- */
const HomeLanding = () => {
    const [homeData, setHomeData] = useState({
        featuredPosts: [],
        latestPosts: [],
        emergencySharing: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                const data = await fetchHomeData();
                setHomeData(data);
                setError(null);
            } catch (err) {
                console.error('Error loading home data:', err);
                setError('Không thể tải dữ liệu trang chủ');
                // Fallback to empty data
                setHomeData({
                    featuredPosts: [],
                    latestPosts: [],
                    emergencySharing: []
                });
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    if (loading) {
        return (
            <main className="home-landing">
                <div className="container">
                    <div className="page-header">
                        <h2>Tìm kiếm chỗ thuê giá tốt</h2>
                        <div className="searchbar">
                            <input placeholder="Search for..." />
                        </div>
                        <p className="subtitle">
                            Công cụ tìm kiếm phòng trọ, nhà nguyên căn, căn hộ cho thuê, tìm người ở
                            ghép nhanh chóng, hiệu quả hơn!
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="home-landing">
                <div className="container">
                    <div className="page-header">
                        <h2>Tìm kiếm chỗ thuê giá tốt</h2>
                        <div className="searchbar">
                            <input placeholder="Search for..." />
                        </div>
                        <p className="subtitle">
                            Công cụ tìm kiếm phòng trọ, nhà nguyên căn, căn hộ cho thuê, tìm người ở
                            ghép nhanh chóng, hiệu quả hơn!
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="home-landing">
            <div className="container">
                <div className="page-header">
                    <h2>Tìm kiếm chỗ thuê giá tốt</h2>
                    <div className="searchbar">
                        <input placeholder="Search for..." />
                    </div>
                    <p className="subtitle">
                        Công cụ tìm kiếm phòng trọ, nhà nguyên căn, căn hộ cho thuê, tìm người ở
                        ghép nhanh chóng, hiệu quả hơn!
                    </p>
                </div>

                <HeroCarousel />

                {/* --- Tin nổi bật: 3 phòng, to hơn --- */}
                <section className="featured">
                    <h3 className="section-title">Tin nổi bật</h3>
                    <div className="grid-featured">
                        {homeData.featuredPosts.slice(0, 3).map((p) => (
                            <PostCard key={p.id} post={p} onViewDetails={handleViewDetails} />
                        ))}
                    </div>
                </section>

                {/* --- Vừa mới đăng: 4 phòng, nhỏ hơn --- */}
                <section className="latest">
                    <h3 className="section-title">Vừa mới đăng</h3>
                    <div className="grid-small">
                        {homeData.latestPosts.slice(0, 4).map((p) => (
                            <PostCard key={p.id} post={p} onViewDetails={handleViewDetails} />
                        ))}
                    </div>
                </section>

                {/* --- Ở ghép khẩn cấp: 4 phòng, nhỏ hơn --- */}
                <section className="emergency">
                    <h3 className="section-title">Ở ghép khẩn cấp</h3>
                    <div className="grid-small">
                        {homeData.emergencySharing.slice(0, 4).map((p) => (
                            <PostCard key={p.id} post={p} onViewDetails={handleViewDetails} />
                        ))}
                    </div>
                </section>

                <AreaCarousel />
            </div>

            {/* Post Detail Modal */}
            <PostDetailModal
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </main>
    );
};

export default HomeLanding;
