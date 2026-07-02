import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { changeLanguage } from "redux-multilanguage";
import axiosInstance from "../api/api";
import { addToCart, deleteFromCart, updateQuantity } from "../redux/actions/cartActions";
import { addToWishlist, deleteFromWishlist } from "../redux/actions/wishlistActions";
import {
  StarRow,
  calculateCartTotal,
  categoryName,
  createCartItemFromProduct,
  formatCurrency,
  formatWeight,
  getBasePrice,
  getCartQty,
  getFinalPrice,
  isArabic,
  parseVariations,
  pickTranslation,
  productName,
  t
} from "./lib";

export const useCurrentLanguage = () =>
  useSelector((state) => state?.multilanguage?.currentLanguageCode || "ar");

export const LoadingScreen = ({ label = "Loading" }) => (
  <div className="ng-loading-shell">
    <div className="ng-loading-orb" />
    <p>{label}</p>
  </div>
);

export const EmptyState = ({ title, text, action }) => (
  <div className="ng-empty-state">
    <div className="ng-empty-icon">◌</div>
    <h3>{title}</h3>
    <p>{text}</p>
    {action}
  </div>
);

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let p = start; p <= end; p += 1) pages.push(p);
  return (
    <div className="ng-pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
    </div>
  );
};

export const SectionHeader = ({ eyebrow, title, text, action, dark }) => (
  <div className={`ng-section-head ${dark ? 'dark' : ''}`}>
    <div className="ng-section-head-content">
      {eyebrow ? <span className="ng-eyebrow" style={dark ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : {}}>{eyebrow}</span> : null}
      <h2 style={dark ? { color: "#fff" } : {}}>{title}</h2>
      {text ? <p style={dark ? { color: "rgba(255,255,255,0.8)" } : {}}>{text}</p> : null}
    </div>
    {action ? <div className="ng-section-action">{action}</div> : null}
  </div>
);

export const MetricCard = ({ title, value, note }) => (
  <div className="ng-metric-card">
    <span>{title}</span>
    <strong>{value}</strong>
    <p>{note}</p>
  </div>
);

const useBranding = () => {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.all([
      axiosInstance.get("/settings"),
      axiosInstance.get("/emails"),
      axiosInstance.get("/mobiles"),
      axiosInstance.get("/socails")
    ]).then(([settingsRes, emailRes, mobileRes, socialRes]) => {
      if (active) {
        const s = settingsRes.data?.settings || {};
        s.supportEmail = emailRes.data?.[0]?.email || "";
        s.supportPhone = mobileRes.data?.[0]?.mobile || "";
        s.socialLinks = socialRes.data || [];
        setSettings(s);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return settings;
};

export const MobileBottomBar = () => {
  const lang = useCurrentLanguage();
  const cartItems = useSelector((state) => state?.cartData?.items || []);
  const wishlistItems = useSelector((state) => state?.wishlistData || []);
  
  return (
    <nav className="ng-mobile-bottom-bar">
      <NavLink exact to="/" className="ng-bottom-item" activeClassName="active">
        <span>🏠</span>
        <small>{t(lang, "navHome")}</small>
      </NavLink>
      <NavLink to="/shop" className="ng-bottom-item" activeClassName="active">
        <span>🔍</span>
        <small>{t(lang, "navCatalog")}</small>
      </NavLink>
      <NavLink to="/cart" className="ng-bottom-item" activeClassName="active">
        <span style={{position:'relative'}}>
          🛒
          {cartItems.length > 0 && <span className="ng-badge">{cartItems.length}</span>}
        </span>
        <small>{t(lang, "navCart")}</small>
      </NavLink>
      <NavLink to="/wishlist" className="ng-bottom-item" activeClassName="active">
        <span style={{position:'relative'}}>
          ♡
          {wishlistItems.length > 0 && <span className="ng-badge">{wishlistItems.length}</span>}
        </span>
        <small>{isArabic(lang) ? "المفضلة" : "Wishlist"}</small>
      </NavLink>
      <NavLink to="/my-account" className="ng-bottom-item" activeClassName="active">
        <span>👤</span>
        <small>{t(lang, "navAccount")}</small>
      </NavLink>
    </nav>
  );
};

export const Shell = ({ children }) => {
  const lang = useCurrentLanguage();
  const settings = useBranding();
  return (
    <div className={`ng-app ${isArabic(lang) ? "rtl" : "ltr"}`} dir={isArabic(lang) ? "rtl" : "ltr"}>
      <TopNavigation settings={settings} />
      <main className="ng-main">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
      <MobileBottomBar />
    </div>
  );
};

export const TopNavigation = ({ settings }) => {
  const lang = useCurrentLanguage();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const cartItems = useSelector((state) => state?.cartData?.items || []);
  const wishlistItems = useSelector((state) => state?.wishlistData || []);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    history.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header className="ng-topbar">
      <div className="ng-topbar-backdrop" />
      <div className="ng-topbar-inner">
        <button className="ng-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
        <Link to="/" className="ng-brandmark">
          {settings?.image_logo_path ? <img src={settings.image_logo_path} alt="brand" /> : <div className="ng-brandmark-dot" />}
        </Link>

        <nav className="ng-navlinks">
          <NavLink exact to="/">{t(lang, "navHome")}</NavLink>
          <NavLink to="/shop">{t(lang, "navCatalog")}</NavLink>
          <NavLink to="/offers">{t(lang, "navOffers")}</NavLink>
          <NavLink to="/blog">{t(lang, "navStories")}</NavLink>
          <NavLink to="/about">{t(lang, "navAbout")}</NavLink>
          <NavLink to="/contact">{t(lang, "navContact")}</NavLink>
        </nav>

        <div className="ng-navtools">
          <form className="ng-searchbar" onSubmit={handleSearch}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t(lang, "searchPlaceholder")} />
            <button type="submit">⌕</button>
          </form>
          <button className="ng-lang-button" onClick={() => dispatch(changeLanguage(isArabic(lang) ? "en" : "ar"))}>
            {t(lang, "language")}
          </button>
          <Link className="ng-iconlink" to="/wishlist">♡<span>{wishlistItems.length}</span></Link>
          <Link className="ng-iconlink" to="/cart">🛒<span>{cartItems.length}</span></Link>
          <Link className="ng-account-pill" to="/my-account">{t(lang, "navAccount")}</Link>
        </div>
      </div>

      {mobileMenuOpen && <div className="ng-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <nav className={`ng-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="ng-mobile-nav-header">
          <strong>{t(lang, "brandName")}</strong>
          <button onClick={() => setMobileMenuOpen(false)}>×</button>
        </div>
        <NavLink exact to="/" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navHome")}</NavLink>
        <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navCatalog")}</NavLink>
        <NavLink to="/offers" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navOffers")}</NavLink>
        <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navStories")}</NavLink>
        <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navAbout")}</NavLink>
        <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>{t(lang, "navContact")}</NavLink>
      </nav>
    </header>
  );
};

export const Footer = ({ settings }) => {
  const lang = useCurrentLanguage();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { addToast } = useToasts();

  const getSocialUrl = (keyword) => {
    const link = settings?.socialLinks?.find(s => s.name?.toLowerCase().includes(keyword) || s.url?.toLowerCase().includes(keyword));
    return link?.url || "#";
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await axiosInstance.post("/subscriptions", { email });
      setDone(true);
      setEmail("");
      addToast(t(lang, "successMessage"), { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  return (
    <footer className="ng-footer">
      <div className="ng-footer-grid">
        <div className="ng-footer-brand">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px', textDecoration: 'none' }}>
            <div style={{ fontSize: '40px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>☕</div>
            <h3 style={{ margin: 0, fontSize: '28px' }}>{settings?.title || t(lang, "brandName")}</h3>
          </Link>
          <p>{t(lang, "footerText")}</p>
          <div className="ng-footer-socials" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <a href={getSocialUrl("facebook")} aria-label="Facebook" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href={getSocialUrl("twitter")} aria-label="Twitter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
              <a href={getSocialUrl("instagram")} aria-label="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          </div>
        </div>

        <div className="ng-footer-links">
          <h4>{isArabic(lang) ? "روابط سريعة" : "Quick Links"}</h4>
          <Link to="/">{t(lang, "navHome")}</Link>
          <Link to="/shop">{t(lang, "navCatalog")}</Link>
          <Link to="/offers">{t(lang, "navOffers")}</Link>
          <Link to="/blog">{t(lang, "navStories")}</Link>
          <Link to="/about">{t(lang, "navAbout")}</Link>
        </div>

        <div className="ng-footer-links">
          <h4>{isArabic(lang) ? "خدمة العملاء" : "Customer Service"}</h4>
          <Link to="/my-account">{t(lang, "navAccount")}</Link>
          <Link to="/cart">{t(lang, "navCart")}</Link>
          <Link to="/wishlist">{t(lang, "navWishlist")}</Link>
          <Link to="/contact">{t(lang, "contactUs")}</Link>
        </div>

        <div className="ng-footer-newsletter">
          <h4>{t(lang, "newsletter")}</h4>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>{isArabic(lang) ? "اشترك للحصول على أحدث العروض والمنتجات." : "Subscribe to get the latest offers and products."}</p>
          <form className="ng-footer-subscribe" onSubmit={handleSubscribe}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, "email")} />
            <button type="submit">{done ? "✓" : t(lang, "subscribe")}</button>
          </form>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
             {settings?.supportEmail && <span>📧 {settings.supportEmail}</span>}
             {settings?.supportPhone && <span>📞 <span dir="ltr">{settings.supportPhone}</span></span>}
          </div>
        </div>
      </div>
      
      <div className="ng-footer-bottom">
        <p>© {new Date().getFullYear()} {settings?.title || t(lang, "brandName")}. {isArabic(lang) ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        <div className="ng-footer-legal">
           <Link to="/">{isArabic(lang) ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
           <Link to="/">{isArabic(lang) ? "الشروط والأحكام" : "Terms & Conditions"}</Link>
        </div>
      </div>
    </footer>
  );
};

export const ProductCard = ({ product, compact = false }) => {
  const lang = useCurrentLanguage();
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const wishlistItems = useSelector((state) => state?.wishlistData || []);
  const variations = parseVariations(product?.variations);
  const wishlisted = useMemo(
    () => wishlistItems.some((item) => Number(item?.id) === Number(product?.id)),
    [wishlistItems, product?.id]
  );
  const basePrice = getBasePrice(product);
  const finalPrice = getFinalPrice(product, basePrice);

  const handleCart = () => {
    if (variations.length > 0) {
      history.push(`/product/${product.slug}`);
      return;
    }
    dispatch(addToCart(product, [], addToast, 1));
    addToast(t(lang, "addedToCart"), { appearance: "success", autoDismiss: true });
  };

  const handleWishlist = () => {
    if (wishlisted) {
      dispatch(deleteFromWishlist(product, addToast));
    } else {
      dispatch(addToWishlist(product, addToast));
    }
  };

  return (
    <article className={`ng-product-card ${compact ? "compact" : ""}`}>
      <button className={`ng-wishlist-toggle ${wishlisted ? "active" : ""}`} onClick={handleWishlist}>
        {wishlisted ? "♥" : "♡"}
      </button>
      <Link to={`/product/${product.slug}`} className="ng-product-media">
        <img src={product?.image_path || product?.cover_path || "/deal.png"} alt={productName(product, lang)} />
      </Link>
      <div className="ng-product-body">
        <span className="ng-product-category">{categoryName(product?.category || product?.cafe, lang)}</span>
        <Link to={`/product/${product.slug}`} className="ng-product-title">{productName(product, lang)}</Link>
        <div className="ng-product-meta">
          <StarRow rating={product?.reviews?.length ? 5 : 4} />
          {product?.discount ? (
            <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
              {isArabic(lang) ? `خصم ${product.discount}%` : `${product.discount}% OFF`}
            </span>
          ) : (
            <span style={{ fontSize: '12px' }}>{t(lang, product?.is_available ? "stockAvailable" : "unavailable")}</span>
          )}
        </div>
        <div className="ng-product-price-row">
          <div>
            <strong>{formatCurrency(finalPrice, lang)}</strong>
            {variations.length > 0 ? <small>{t(lang, "multipleWeights")}</small> : null}
          </div>
          <button className="ng-primary-button ghost" onClick={handleCart}>
            {variations.length > 0 ? t(lang, "chooseOption") : t(lang, "addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
};

export const BlogCard = ({ post }) => {
  const lang = useCurrentLanguage();
  const title = productName({ translations: post?.translations, name: post?.title }, lang);
  const excerpt = (post?.translations?.find((item) => item.locale === (isArabic(lang) ? "ar" : "en"))?.content || post?.content || "").replace(/<[^>]*>/g, " ").slice(0, 160);
  return (
    <article className="ng-blog-card">
      <img src={post?.image_path} alt={title} />
      <div>
        <span>{t(lang, "minutesRead")} · 4</span>
        <h3>{title}</h3>
        <p>{excerpt}</p>
        <Link to={`/post?postId=${post.id}`}>{t(lang, "readMore")}</Link>
      </div>
    </article>
  );
};

const MiniCartItem = ({ item }) => {
  const lang = useCurrentLanguage();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const qty = getCartQty(item);
  const total = getFinalPrice(item, Number(item?.price) || getBasePrice(item)) * qty;

  return (
    <div className="ng-mini-cart-item">
      <img src={item?.image_path || "/deal.png"} alt={productName(item, lang)} />
      <div className="ng-mini-cart-item-info">
        <strong>{productName(item, lang)}</strong>
        <div className="ng-mini-cart-item-price-row">
          <span>{formatCurrency(total, lang)}</span>
          {item?.weight || item?.size ? <small className="muted">{formatWeight(item?.weight || item?.size, lang)}</small> : null}
        </div>
      </div>
      <div className="ng-qty-box small">
        <button disabled={qty <= 1} onClick={() => dispatch(updateQuantity(item, addToast, qty - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => dispatch(updateQuantity(item, addToast, qty + 1))}>+</button>
      </div>
    </div>
  );
};

const MiniCartRelatedItem = ({ product }) => {
  const lang = useCurrentLanguage();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  
  const handleAdd = () => {
    dispatch(addToCart(product, [], addToast, 1));
  };

  return (
    <div className="ng-mini-cart-item related">
      <img src={product?.image_path || "/deal.png"} alt={productName(product, lang)} />
      <div className="ng-mini-cart-item-info">
        <strong>{productName(product, lang)}</strong>
        <span>{formatCurrency(getFinalPrice(product), lang)}</span>
      </div>
      <button className="ng-mini-cart-add-btn" onClick={handleAdd}>+</button>
    </div>
  );
};

export const CartDrawer = () => {
  const lang = useCurrentLanguage();
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((store) => store?.cartAddedSidebar || {});
  const cartItems = useSelector((store) => store?.cartData?.items || []);
  const total = calculateCartTotal(cartItems);

  if (!state?.show || !state?.addedProduct) return null;

  return (
    <div className="ng-cart-drawer-overlay" onClick={() => dispatch({ type: "HIDE_CART_ADDED_SIDEBAR" })}>
      <aside className="ng-cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ng-drawer-header-top">
          <span className="success-text">✓ {t(lang, "addedToCart")}</span>
          <button className="ng-drawer-close" onClick={() => dispatch({ type: "HIDE_CART_ADDED_SIDEBAR" })}>×</button>
        </div>
        
        <div className="ng-mini-cart-body">
          <div className="ng-mini-cart-section-title">
            {t(lang, "navCart")} <span className="badge">{cartItems.length}</span>
          </div>
          <div className="ng-mini-cart-items-wrap">
            {cartItems.map(item => <MiniCartItem key={item.cartItemId || item.id} item={item} />)}
          </div>
          <div className="ng-mini-cart-total">
            <span>{t(lang, "total")}:</span>
            <strong>{formatCurrency(total, lang)}</strong>
          </div>
        </div>

        {state.relatedProducts && state.relatedProducts.length > 0 && (
          <div className="ng-mini-cart-related-sec">
            <div className="ng-mini-cart-section-title muted">{t(lang, "relatedProducts")}:</div>
            <div className="ng-mini-cart-items-wrap">
              {state.relatedProducts.slice(0, 3).map(product => <MiniCartRelatedItem key={product.id} product={product} />)}
            </div>
          </div>
        )}

        <button className="ng-primary-button block" onClick={() => { dispatch({ type: "HIDE_CART_ADDED_SIDEBAR" }); history.push("/cart"); }}>
          {t(lang, "navCart")}
        </button>
      </aside>
    </div>
  );
};

export const CartLine = ({ item }) => {
  const lang = useCurrentLanguage();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const qty = getCartQty(item);
  const total = getFinalPrice(item, Number(item?.price) || getBasePrice(item)) * qty;
  return (
    <div className="ng-cart-line">
      <img src={item?.image_path || "/deal.png"} alt={productName(item, lang)} />
      <div>
        <strong>{productName(item, lang)}</strong>
        <span>{formatWeight(item?.size || item?.weight || "", lang)}</span>
      </div>
      <div className="ng-qty-box">
        <button disabled={qty <= 1} onClick={() => dispatch(updateQuantity(item, addToast, qty - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => dispatch(updateQuantity(item, addToast, qty + 1))}>+</button>
      </div>
      <strong>{formatCurrency(total, lang)}</strong>
      <button className="ng-text-button danger" onClick={() => dispatch(deleteFromCart(item, addToast))}>×</button>
    </div>
  );
};

export const CartSummary = ({ items, children }) => {
  const lang = useCurrentLanguage();
  const total = calculateCartTotal(items);
  return (
    <div className="ng-summary-card">
      <h3>{t(lang, "total")}</h3>
      <div className="ng-summary-row"><span>{t(lang, "subtotal")}</span><strong>{formatCurrency(total, lang)}</strong></div>
      <div className="ng-summary-row muted"><span>{t(lang, "freeShipping")}</span><strong>-</strong></div>
      {children}
    </div>
  );
};

export const HeroPanel = ({ settings, banners = [] }) => {
  const lang = useCurrentLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  if (banners && banners.length > 0) {
    return (
      <section style={{ position: 'relative', width: '100%', height: 'clamp(300px, 50vh, 560px)', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}>
        {banners.map((banner, index) => (
          <Link key={banner.id || index} to={banner.url ? `/product/${banner.url.split('/').filter(Boolean).pop()}` : '#'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: index === currentIndex ? 1 : 0, transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: index === currentIndex ? 'auto' : 'none' }}>
            <img src={banner.image_path} alt={banner.title || "Banner"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Link>
        ))}
        {banners.length > 1 && (
          <>
            <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 }}>
              {banners.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} style={{ width: index === currentIndex ? '32px' : '12px', height: '12px', borderRadius: '6px', background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease' }} />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <div className="ng-hero-grid" style={{
      background: "linear-gradient(135deg, #009B4D, #1A3C6B)",
      borderRadius: "40px",
      minHeight: "600px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ padding: "80px" }}>
        <h1 style={{ color: "#fff", fontSize: "48px" }}>{settings?.title || t(lang, "brandName")}</h1>
      </div>
    </div>
  );
};

export const CatalogToolbar = ({ categories = [], query, setQuery, sort, setSort, activeCategory, setActiveCategory }) => {
  const lang = useCurrentLanguage();
  return (
    <div className="ng-toolbar">
      <div className="ng-toolbar-main">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t(lang, "searchPlaceholder")} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">{t(lang, "sortDefault")}</option>
          <option value="high-to-low">{t(lang, "sortHigh")}</option>
          <option value="low-to-high">{t(lang, "sortLow")}</option>
        </select>
      </div>
      <div className="ng-chip-row">
        <button className={!activeCategory ? "active" : ""} onClick={() => setActiveCategory("")}>{t(lang, "allProducts")}</button>
        {categories.map((cat) => (
          <button key={cat.id} className={activeCategory === cat.slug ? "active" : ""} onClick={() => setActiveCategory(cat.slug)}>
            {categoryName(cat, lang)}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ProductQuickPanel = ({ product, selectedVariation, onSelectVariation, onAdd }) => {
  const lang = useCurrentLanguage();
  const variations = parseVariations(product?.variations);
  return (
    <div className="ng-product-quickpanel">
      <div>
        <span className="ng-product-category">{categoryName(product?.category || product?.cafe, lang)}</span>
        <h1>{productName(product, lang)}</h1>
        <div 
          className="ng-product-html-content"
          dangerouslySetInnerHTML={{ __html: product?.description || product?.translations?.find((x) => x.locale === (isArabic(lang) ? "ar" : "en"))?.description || "" }} 
        />
      </div>
      <div className="ng-spec-grid">
        <div><span>{t(lang, "origin")}</span><strong>{product?.translations?.find((x) => x.locale === (isArabic(lang) ? "ar" : "en"))?.country_origin || product?.country_origin || "—"}</strong></div>
        <div><span>{t(lang, "weight")}</span><strong>{formatWeight(selectedVariation?.weight || product?.weight, lang) || "—"}</strong></div>
        <div><span>{t(lang, "category")}</span><strong>{categoryName(product?.category || product?.cafe, lang)}</strong></div>
        <div><span>{t(lang, "total")}</span><strong>{formatCurrency(getFinalPrice(product, Number(selectedVariation?.price) || Number(product?.price) || getBasePrice(product)), lang)}</strong></div>
      </div>
      {variations.length > 0 ? (
        <div className="ng-variation-row">
          {variations.map((variation) => (
            <button
              key={variation.weight}
              className={selectedVariation?.weight === variation.weight ? "active" : ""}
              onClick={() => onSelectVariation(variation)}>
              <strong>{formatWeight(variation.weight, lang)}</strong>
              <span>{formatCurrency(variation.price, lang)}</span>
            </button>
          ))}
        </div>
      ) : null}
      <button className="ng-primary-button" onClick={onAdd}>{t(lang, variations.length ? "chooseOption" : "addToCart")}</button>
    </div>
  );
};

export const AppPromo = () => {
  const lang = useCurrentLanguage();
  return (
    <section className="ng-surface" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', background: 'linear-gradient(135deg, rgba(0,155,77,0.05), rgba(26,60,107,0.05))', border: 'none' }}>
      <div style={{ padding: '20px' }}>
        <span className="ng-eyebrow">{isArabic(lang) ? "تطبيق الموبايل" : "Mobile App"}</span>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800', color: 'var(--ng-secondary)', marginBottom: '16px', lineHeight: '1.2' }}>{isArabic(lang) ? "ألفا ميلك في جيبك" : "Alfa Milk in your pocket"}</h2>
        <p style={{ fontSize: '18px', color: 'var(--ng-text-soft)', marginBottom: '32px', lineHeight: '1.8' }}>{isArabic(lang) ? "حمل التطبيق الآن واستمتع بتجربة تسوق أسرع وعروض حصرية تصلك مباشرة على هاتفك." : "Download the app now and enjoy a faster shopping experience and exclusive offers delivered directly to your phone."}</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="ng-primary-button" style={{ background: '#000', color: '#fff', borderRadius: '16px', padding: '14px 24px' }}>App Store</button>
          <button className="ng-primary-button" style={{ background: '#000', color: '#fff', borderRadius: '16px', padding: '14px 24px' }}>Google Play</button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '280px', height: '580px', background: '#fff', borderRadius: '48px', border: '14px solid #111', boxShadow: '0 32px 64px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, width: '120px', height: '24px', background: '#111', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}></div>
          <span style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>📱</span>
          <div style={{ position: 'absolute', bottom: '40px', background: 'var(--ng-primary)', color: '#fff', padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold' }}>{isArabic(lang) ? "تطبيق ألفا ميلك" : "Alfa Milk App"}</div>
        </div>
      </div>
    </section>
  );
};

export const FAQSection = ({ faqs }) => {
  const lang = useCurrentLanguage();
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="ng-surface" style={{ display: 'flex', flexDirection: 'column', gap: '32px', border: 'none', background: 'transparent', padding: '100px 0' }}>
      {faqs.map((faq) => {
        const title = pickTranslation(faq.translations, lang, "title") || faq.title;
        const content = pickTranslation(faq.translations, lang, "content") || faq.content;
        return (
          <div key={faq.id}>
            <div className="ng-section-head center" style={{ marginBottom: '16px', gridTemplateColumns: '1fr' }}>
              <div className="ng-section-head-content">
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>{title}</h2>
                <p style={{ margin: '0' }}>{content}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '40px auto 0', width: '100%' }}>
              {faq.features?.map((feature, i) => {
                const featureText = pickTranslation(feature.translations, lang, "feature_text") || feature.feature_text;
                return (
                  <div key={feature.id || i} className="ng-feature-card" style={{ padding: '32px', background: '#fff', borderRadius: '24px', border: '1px solid var(--ng-line)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 4px 24px rgba(26,60,107,0.04)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,60,107,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,60,107,0.04)'; }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--ng-primary-soft), rgba(0,155,77,0.15))', color: 'var(--ng-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>0{i + 1}</div>
                    <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--ng-secondary)', lineHeight: '1.4' }}>
                      {featureText}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};
