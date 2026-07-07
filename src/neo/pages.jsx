import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import axiosInstance from "../api/api";
import { addToCart, deleteAllFromCart, getCartItems } from "../redux/actions/cartActions";
import { getWishlist, addToWishlist, deleteFromWishlist } from "../redux/actions/wishlistActions";
import { submitReview } from "../redux/actions/reviewActions";
import {
  BlogCard,
  CartLine,
  CartSummary,
  CatalogToolbar,
  EmptyState,
  HeroPanel,
  LoadingScreen,
  MetricCard,
  Pagination,
  ProductCard,
  ProductQuickPanel,
  SectionHeader,
  Shell,
  FAQSection
} from "./ui";
import {
  calculateCartTotal,
  categoryName,
  createCartItemFromProduct,
  formatCurrency,
  formatDate,
  getBasePrice,
  getFinalPrice,
  getOrderItems,
  getOrderStatus,
  isArabic,
  parseVariations,
  pickTranslation,
  productName,
  stripHtml,
  t
} from "./lib";

const useLang = () => useSelector((state) => state?.multilanguage?.currentLanguageCode || "ar");

const usePublicBootstrap = () => {
  const [data, setData] = useState({ settings: null, categories: [], items: [], offers: [], blogs: [], features: [], faqs: [], banners: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      axiosInstance.get("/settings"),
      axiosInstance.get("/cafes"),
      axiosInstance.get("/items"),
      axiosInstance.get("/offers"),
      axios.get("https://admin.omdacoffee.com/api/blogs"),
      axiosInstance.get("/features"),
      axiosInstance.get("/faqs"),
      axiosInstance.get("/offers-banner")
    ]).then(([settingsRes, cafesRes, itemsRes, offersRes, blogsRes, featuresRes, faqsRes, bannersRes]) => {
      if (!active) return;
      console.log("Categories response:", cafesRes.data);
      setData({
        settings: settingsRes.data?.settings || null,
        categories: cafesRes.data || [],
        items: Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data?.data || [],
        offers: offersRes.data?.data || offersRes.data || [],
        blogs: blogsRes.data || [],
        features: featuresRes.data || [],
        faqs: Array.isArray(faqsRes.data) ? faqsRes.data : (faqsRes.data ? [faqsRes.data] : []),
        banners: bannersRes.data || []
      });
    }).catch(() => {
      if (!active) return;
      setData({ settings: null, categories: [], items: [], offers: [], blogs: [], features: [], faqs: [], banners: [] });
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading };
};

export const HomePage = () => {
  const lang = useLang();
  const { settings, categories, items, offers, blogs, features, faqs, banners, loading } = usePublicBootstrap();
  if (loading) return <Shell><LoadingScreen label="Loading homepage" /></Shell>;

  return (
    <Shell>
      <div className="ng-page ng-home-page" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px' }}>
        <HeroPanel settings={settings} banners={banners} />

        {features.length > 0 && (
          <section className="ng-surface" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
            <div className="ng-section-head center" style={{ gridTemplateColumns: '1fr' }}>
              <div className="ng-section-head-content">
                <span className="ng-eyebrow">{isArabic(lang) ? "لماذا ألفا ميلك" : "Why Alfa Milk"}</span>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--ng-secondary)' }}>{t(lang, "premiumMetrics")}</h2>
              </div>
            </div>
            <div className="ng-panel-grid ng-metrics-layout" style={{ gap: '24px' }}>
              <MetricCard title={t(lang, "analyticsOne")} value="100%" note={t(lang, "dashboardSummary")} />
              <MetricCard title={t(lang, "analyticsTwo")} value={`${categories.length}+`} note={t(lang, "categories")} />
              <MetricCard title={t(lang, "analyticsThree")} value={`${items.length}+`} note={t(lang, "allProducts")} />
            </div>
          </section>
        )}

        <section className="ng-surface" style={{ background: 'var(--ng-bg-soft)', border: 'none' }}>
          <SectionHeader eyebrow={isArabic(lang) ? "التصنيفات" : "Categories"} title={t(lang, "categories")} text={t(lang, "filterByCategory")} action={<Link to="/shop" className="ng-inline-link">{t(lang, "allProducts")}</Link>} />
          <div className="ng-category-grid">
            {categories.slice(0, 6).map((category) => (
              <Link to={`/shop?category=${category.slug}`} className="ng-category-card" key={category.id} style={{ borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                <img src={category.logo_path} alt={categoryName(category, lang)} />
                <div style={{ flex: 1 }}>
                  <strong>{categoryName(category, lang)}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--ng-primary)', fontWeight: 'bold' }}>{isArabic(lang) ? "تصفح" : "Browse"} <span style={{ fontSize: '18px' }}>→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="ng-surface" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <SectionHeader eyebrow={isArabic(lang) ? "المنتجات" : "Products"} title={t(lang, "featuredProducts")} text={isArabic(lang) ? "في 'العمدة'، نختار حبوبنا بعناية من أفضل المصادر ونحمصها بطريقة تحافظ على نكهتها الأصلية، لنقدم لك كوب قهوة متوازن... من أول رشفة لآخر رشفة." : (settings?.services_meta_description || t(lang, "heroText"))} action={<Link to="/shop" className="ng-inline-link">{t(lang, "primaryCta")}</Link>} />
          <div className="ng-product-grid">{items.slice(0, 8).map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>

        {offers.length > 0 && (
          <section className="ng-surface" style={{ background: 'linear-gradient(135deg, #1A3C6B, #111)', color: '#fff', border: 'none', borderRadius: '40px' }}>
            <SectionHeader eyebrow={isArabic(lang) ? "عروض خاصة" : "Special Offers"} title={t(lang, "latestOffers")} text={isArabic(lang) ? "شحن مجاني للطلبات بقيمة 500 جنيه" : "Free shipping on orders of 500 EGP or more"} dark={true} action={<Link to="/offers" className="ng-inline-link" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px' }}>{t(lang, "allOffers")}</Link>} />
            <div className="ng-product-grid compact-grid">{offers.slice(0, 4).map((item) => <div style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))' }} key={item.id}><ProductCard product={item} compact /></div>)}</div>
          </section>
        )}

        {blogs.length > 0 && (
          <section className="ng-surface" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
            <SectionHeader eyebrow={isArabic(lang) ? "مقالات ونصائح" : "Health Magazine"} title={t(lang, "latestStories")} text={isArabic(lang) ? "مقالات مميزة ونصائح مفيدة حول اختيار القهوة المثالية وطرق تحضيرها لتستمتع بأفضل تجربة في كل كوب." : (settings?.about_us?.slice(0, 180) || "Healthy articles and useful information about dairy products.")} action={<Link to="/blog" className="ng-inline-link">{t(lang, "navStories")}</Link>} />
            <div className="ng-blog-grid">{blogs.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}</div>
          </section>
        )}

        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}

        <section className="ng-surface" style={{ textAlign: 'center', background: 'var(--ng-primary)', color: '#fff', border: 'none', borderRadius: '40px', padding: '80px 40px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', marginBottom: '24px', fontWeight: '800', lineHeight: '1.2' }}>{isArabic(lang) ? "ابدأ تسوق منتجات ألفا ميلك الآن" : "Start shopping Alfa Milk now"}</h2>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8' }}>{isArabic(lang) ? "جرب الطعم الأصلي للطبيعة مع منتجاتنا الطازجة عالية الجودة." : "Experience the original taste of nature with our fresh, high-quality products."}</p>
          <Link to="/shop" className="ng-primary-button" style={{ background: '#fff', color: 'var(--ng-primary)', padding: '20px 40px', fontSize: '20px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>{isArabic(lang) ? "تسوق الآن" : "Shop Now"}</Link>
        </section>

      </div>
    </Shell>
  );
};

const filterProducts = (items, query, activeCategory, sort, lang) => {
  let result = [...items];
  if (activeCategory) {
    result = result.filter((item) => (item?.category?.slug || item?.cafe?.slug) === activeCategory || item?.cafe_id === activeCategory);
  }
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter((item) => {
      const haystack = [
        productName(item, lang),
        categoryName(item?.category || item?.cafe, lang),
        item?.slug,
        item?.country_origin,
        stripHtml(item?.description || "")
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }
  if (sort === "high-to-low") result.sort((a, b) => getFinalPrice(b, getBasePrice(b)) - getFinalPrice(a, getBasePrice(a)));
  if (sort === "low-to-high") result.sort((a, b) => getFinalPrice(a, getBasePrice(a)) - getFinalPrice(b, getBasePrice(b)));
  return result;
};

export const ShopPage = () => {
  const lang = useLang();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [activeCategory, setActiveCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
    setActiveCategory(params.get("category") || "");
  }, [location.search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([axiosInstance.get("/items"), axiosInstance.get("/cafes")]).then(([itemsRes, catsRes]) => {
      if (!active) return;
      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data?.data || []);
      setCategories(catsRes.data || []);
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => filterProducts(items, query, activeCategory, sort, lang), [items, query, activeCategory, sort, lang]);
  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentSlice = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [query, activeCategory, sort]);

  return (
    <Shell>
      <div className="ng-page">
        <SectionHeader eyebrow={isArabic(lang) ? "الكتالوج" : "Catalog"} title={t(lang, "navCatalog")} text={`${t(lang, "showing")} ${filtered.length} ${t(lang, "results")}`} />
        <CatalogToolbar
          categories={categories}
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        {loading ? <LoadingScreen label="Loading catalog" /> : currentSlice.length ? <div className="ng-product-grid">{currentSlice.map((item) => <ProductCard key={item.id} product={item} />)}</div> : <EmptyState title={t(lang, "emptyTitle")} text={t(lang, "emptyText")} action={<Link className="ng-primary-button ghost" to="/shop">{t(lang, "allProducts")}</Link>} />}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </Shell>
  );
};

export const OffersPage = () => {
  const lang = useLang();
  const [state, setState] = useState({ data: [], currentPage: 1, totalPages: 1, loading: true });

  useEffect(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true }));
    axiosInstance.get(`/offers?page=${state.currentPage}`).then((res) => {
      if (!active) return;
      setState((prev) => ({
        ...prev,
        data: res.data?.data || [],
        totalPages: res.data?.last_page || 1,
        loading: false
      }));
    }).catch(() => active && setState((prev) => ({ ...prev, data: [], loading: false })));
    return () => { active = false; };
  }, [state.currentPage]);

  return (
    <Shell>
      <div className="ng-page">
        <SectionHeader eyebrow={isArabic(lang) ? "العروض" : "Offers"} title={t(lang, "latestOffers")} text={t(lang, "allOffers")} />
        {state.loading ? <LoadingScreen label="Loading offers" /> : <div className="ng-product-grid">{state.data.map((item) => <ProductCard key={item.id} product={item} />)}</div>}
        <Pagination currentPage={state.currentPage} totalPages={state.totalPages} onPageChange={(currentPage) => setState((prev) => ({ ...prev, currentPage }))} />
      </div>
    </Shell>
  );
};

export const ProductPage = () => {
  const lang = useLang();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [review, setReview] = useState({ review: "", rate: 5 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    axiosInstance.get(`/item/${slug}`).then((res) => {
      const item = res.data?.item || null;
      const rel = res.data?.related || [];
      setProduct(item);
      setRelated(rel);
      const firstVariation = parseVariations(item?.variations)[0] || null;
      setSelectedVariation(firstVariation);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduct(); }, [slug]);
  useEffect(() => {
    if (!localStorage.getItem("authToken")) return;
    axiosInstance.get("/user").then((res) => setUser(res.data?.user || null)).catch(() => setUser(null));
  }, []);

  const matchingOrderId = useMemo(() => {
    const orders = user?.orders || [];
    const matched = orders.find((order) => getOrderItems(order).some((item) => Number(item?.id || item?.item_id || item?.pivot?.item_id) === Number(product?.id)));
    return matched?.id || matched?.order_id || "";
  }, [user, product?.id]);

  const handleAdd = () => {
    const variations = parseVariations(product?.variations);
    if (variations.length > 0 && !selectedVariation) {
      addToast(t(lang, "chooseOption"), { appearance: "warning", autoDismiss: true });
      return;
    }
    dispatch(addToCart(createCartItemFromProduct(product, selectedVariation), related, addToast, 1));
    addToast(t(lang, "addedToCart"), { appearance: "success", autoDismiss: true });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("authToken")) {
      addToast(t(lang, "loginRequired"), { appearance: "warning", autoDismiss: true });
      return;
    }
    if (!matchingOrderId) {
      addToast(t(lang, "reviewPurchasedOnly"), { appearance: "warning", autoDismiss: true });
      return;
    }
    setSubmittingReview(true);
    try {
      await dispatch(submitReview({ item_id: product.id, review: review.review, rate: review.rate, order_id: matchingOrderId }, lang));
      setReview({ review: "", rate: 5 });
      addToast(t(lang, "successMessage"), { appearance: "success", autoDismiss: true });
      fetchProduct();
    } catch (error) {
      addToast(error?.message || t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Shell><LoadingScreen label="Loading product" /></Shell>;
  if (!product) return <Shell><EmptyState title={t(lang, "emptyTitle")} text={t(lang, "emptyText")} action={<Link className="ng-primary-button ghost" to="/shop">{t(lang, "backHome")}</Link>} /></Shell>;

  const reviews = product?.reviews_item || product?.reviews || [];
  return (
    <Shell>
      <div className="ng-page ng-product-page">
        <div className="ng-product-layout">
          <div className="ng-product-gallery">
            <div className="ng-product-hero-image"><img src={product?.image_path} alt={productName(product, lang)} /></div>
            <div className="ng-product-mini-info">
              <div>
                <span>{t(lang, "overview")}</span>
                <div 
                  className="ng-product-html-content"
                  dangerouslySetInnerHTML={{ __html: product?.description || pickTranslation(product?.translations, lang, "description") || productName(product, lang) }} 
                />
              </div>
            </div>
          </div>
          <ProductQuickPanel product={product} selectedVariation={selectedVariation} onSelectVariation={setSelectedVariation} onAdd={handleAdd} />
        </div>

        <section className="ng-surface">
          <SectionHeader title={t(lang, "reviewTitle")} text={`${reviews.length} ${t(lang, "results")}`} />
          <div className="ng-reviews-grid">
            <div className="ng-review-list">
              {reviews.length ? reviews.map((entry, idx) => (
                <article className="ng-review-card" key={entry.id || idx}>
                  <div className="ng-review-head">
                    <strong>{entry?.user?.fname || entry?.user?.name || "User"}</strong>
                    <span>{formatDate(entry.created_at, lang)}</span>
                  </div>
                  <div className="ng-rating-row">{"★".repeat(Number(entry.rate) || 0)}</div>
                  <p>{entry.review}</p>
                </article>
              )) : <EmptyState title={t(lang, "reviewTitle")} text={t(lang, "emptyText")} />}
            </div>
            <form className="ng-review-form" onSubmit={handleReviewSubmit}>
              <h3>{t(lang, "writeReview")}</h3>
              <select value={review.rate} onChange={(e) => setReview((prev) => ({ ...prev, rate: Number(e.target.value) }))}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <textarea value={review.review} onChange={(e) => setReview((prev) => ({ ...prev, review: e.target.value }))} placeholder={t(lang, "message")} />
              <button className="ng-primary-button" type="submit" disabled={submittingReview}>{t(lang, "submitReview")}</button>
            </form>
          </div>
        </section>

        <section className="ng-surface">
          <SectionHeader title={t(lang, "relatedProducts")} />
          <div className="ng-product-grid compact-grid">{related.slice(0, 4).map((item) => <ProductCard key={item.id} product={item} compact />)}</div>
        </section>
      </div>
    </Shell>
  );
};

export const BlogPage = () => {
  const lang = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("https://admin.omdacoffee.com/api/blogs").then((res) => setPosts(res.data || [])).finally(() => setLoading(false));
  }, []);
  return <Shell><div className="ng-page"><SectionHeader eyebrow={isArabic(lang) ? "المدونة" : "Blog"} title={t(lang, "navStories")} text={t(lang, "latestStories")} />{loading ? <LoadingScreen /> : <div className="ng-blog-grid">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div>}</div></Shell>;
};

export const BlogDetailPage = () => {
  const lang = useLang();
  const { postId: routeId } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = routeId || new URLSearchParams(location.search).get("postId");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`https://admin.omdacoffee.com/api/blog/${id}`).then((res) => setPost(res.data?.item || res.data?.post || res.data?.item || res.data)).finally(() => setLoading(false));
  }, [id]);
  const title = pickTranslation(post?.translations, lang, "title") || post?.title;
  const html = pickTranslation(post?.translations, lang, "content") || post?.content || "";
  return <Shell><div className="ng-page">{loading ? <LoadingScreen /> : <article className="ng-article-shell"><img src={post?.image_path} alt={title} /><span className="ng-eyebrow">{formatDate(post?.created_at, lang)}</span><h1>{title}</h1><div className="ng-article-content" dangerouslySetInnerHTML={{ __html: html }} /></article>}</div></Shell>;
};

export const AboutPage = () => {
  const lang = useLang();
  const [about, setAbout] = useState(null);
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    Promise.all([axiosInstance.get("/about"), axiosInstance.get("/settings")]).then(([aboutRes, settingsRes]) => {
      setAbout(aboutRes.data || null);
      setSettings(settingsRes.data?.settings || null);
    });
  }, []);
  const resolveVal = (val) => typeof val === "object" && val !== null ? val[lang] || val.en || val.ar || "" : val || "";

  const aboutEn = `
    <p><strong>Welcome to Al Omda</strong></p>
    <p>“Al Omda” isn’t just coffee… It’s a name with weight — a presence you feel before it’s even spoken.</p>
    <p>From the heart of old Egyptian stories, the name “Al Omda” emerged as a symbol of trust, prestige, and a word that truly matters. And that’s exactly what we deliver in every cup. We carefully select our beans from the finest origins around the world — from rich Brazilian, to authentic Yemeni, to balanced Colombian… all the way to expertly crafted espresso blends for those seeking a stronger experience.</p>
    <p>But the real value isn’t just in the origin… The value is in the selection, the roasting, and the small details that make all the difference.</p>
    <p>At “Al Omda,” every cup is made to:</p>
    <ul style="list-style: none; padding: 0; margin: 16px 0;">
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">Preserve an authentic taste</span></li>
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">Deliver consistent quality</span></li>
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">Turn coffee into a meaningful experience… not just a habit</span></li>
    </ul>
    <p>We believe coffee is more than just a drink… It’s a mood, a state of mind, and a daily companion many people start their day with.</p>
    <p>That’s why our goal isn’t just to sell coffee… Our goal is to be the first choice for anyone seeking authentic taste, trusted quality, and a name that carries value.</p>
  `;

  const aboutAr = `
    <p><strong>مرحباً بك في العمدة</strong></p>
    <p>"العمدة" ليست مجرد قهوة... إنه اسم له وزن - حضور تشعر به قبل حتى أن يُنطق.</p>
    <p>من قلب القصص المصرية القديمة، برز اسم "العمدة" كرمز للثقة، والهيبة، والكلمة التي تعني الكثير حقاً. وهذا بالضبط ما نقدمه في كل كوب. نحن نختار حبوبنا بعناية من أفضل المصادر حول العالم — من البرازيلي الغني، إلى اليمني الأصيل، إلى الكولومبي المتوازن... وصولاً إلى خلطات الإسبريسو المصنوعة بخبرة لمن يبحثون عن تجربة أقوى.</p>
    <p>لكن القيمة الحقيقية ليست فقط في المصدر... القيمة تكمن في الاختيار، والتحميص، والتفاصيل الصغيرة التي تصنع كل الفرق.</p>
    <p>في "العمدة"، يُصنع كل كوب من أجل:</p>
    <ul style="list-style: none; padding: 0; margin: 16px 0;">
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">الحفاظ على المذاق الأصيل</span></li>
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">تقديم جودة ثابتة ومستقرة</span></li>
      <li style="margin-bottom: 8px; color: var(--ng-primary);">✔ <span style="color: var(--ng-secondary);">تحويل القهوة إلى تجربة ذات معنى... وليست مجرد عادة</span></li>
    </ul>
    <p>نحن نؤمن أن القهوة أكثر من مجرد مشروب... إنها مزاج، وحالة ذهنية، ورفيق يومي يبدأ به الكثيرون يومهم.</p>
    <p>لذلك، هدفنا ليس مجرد بيع القهوة... هدفنا هو أن نكون الخيار الأول لمن يبحث عن المذاق الأصيل، والجودة الموثوقة، والاسم الذي يحمل قيمة حقيقية.</p>
  `;

  const aboutHtml = pickTranslation(settings?.translations, lang, "about_us") || resolveVal(settings?.about_us) || resolveVal(about?.about_us) || (lang === "en" ? aboutEn : aboutAr);

  return (
    <Shell>
      <div className="ng-page">
        <SectionHeader eyebrow={isArabic(lang) ? "من نحن" : "About"} title={t(lang, "navAbout")} text={isArabic(lang) ? "العمدة للصناعات الغذائية" : (resolveVal(settings?.description) || "Alomda Food Industries")} />
        <section className="ng-surface ng-about-layout">
          <div>
            <h2>{resolveVal(settings?.title) || t(lang, "brandName")}</h2>
            <div dangerouslySetInnerHTML={{ __html: aboutHtml }} className="ng-about-content-html" />
          </div>
          <div className="ng-story-card">
            <strong>{isArabic(lang) ? "جميع الحقوق محفوظة لمحمصة العمدة ©" : (resolveVal(settings?.copyright) || "All rights reserved to Alomda ©")}</strong>
            <p>{isArabic(lang) ? "نسعى لأن يكون 'العمدة' من الأسماء الرائدة في عالم القهوة— علامة تجارية مصرية بهوية أصيلة وجودة ثابتة قادرة على المنافسة عالمياً." : (resolveVal(settings?.home_meta_description) || "We strive for \"Al Omda\" to be one of the leading names in the coffee world— an Egyptian brand with an authentic identity and consistent quality that can compete on a global level.")}</p>
          </div>
        </section>
      </div>
    </Shell>
  );
};

export const ContactPage = () => {
  const lang = useLang();
  const { addToast } = useToasts();
  const [meta, setMeta] = useState({ email: "", mobiles: [], socials: [], address: "" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    Promise.all([axiosInstance.get("/emails"), axiosInstance.get("/mobiles"), axiosInstance.get("/socails"), axiosInstance.get("/addresse")]).then(([emailRes, mobileRes, socialRes, addressRes]) => {
      setMeta({
        email: emailRes.data?.[0]?.email || "",
        mobiles: mobileRes.data || [],
        socials: socialRes.data || [],
        address: addressRes.data || ""
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/contact", form);
      addToast(t(lang, "successMessage"), { appearance: "success", autoDismiss: true });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  return (
    <Shell>
      <div className="ng-page ng-contact-layout">
        <section className="ng-surface">
          <SectionHeader eyebrow={isArabic(lang) ? "تواصل معنا" : "Connect"} title={t(lang, "contactUs")} text={t(lang, "contactInfo")} />
          <div className="ng-contact-grid">
            <div className="ng-contact-card">
              <h3>{t(lang, "contactInfo")}</h3>
              <p>{meta.address}</p>
              <p>{meta.email}</p>
              {meta.mobiles.map((mobile) => <p key={mobile.id}>{mobile.mobile}</p>)}
              <div className="ng-social-row">{meta.socials.map((social) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><img src={`https://admin.omdacoffee.com/images/${social.icon}`} alt="social" /></a>)}</div>
            </div>
            <form className="ng-contact-form" onSubmit={handleSubmit}>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder={t(lang, "firstName")} />
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder={t(lang, "email")} />
              <input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} placeholder={t(lang, "subject")} />
              <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder={t(lang, "message")} />
              <button className="ng-primary-button" type="submit">{t(lang, "sendMessage")}</button>
            </form>
          </div>
        </section>
      </div>
    </Shell>
  );
};

export const AuthPage = () => {
  const lang = useLang();
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const [mode, setMode] = useState("login");
  const [registerData, setRegisterData] = useState({ fname: "", lname: "", phone: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ phone: "", password: "" });

  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/register", registerData);
      addToast(t(lang, "successMessage"), { appearance: "success", autoDismiss: true });
      setMode("login");
    } catch (error) {
      addToast(error?.response?.data?.message || t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", loginData);
      if (res.data?.token) localStorage.setItem("authToken", res.data.token);
      dispatch(getWishlist());
      dispatch(getCartItems());
      history.push("/my-account");
    } catch (error) {
      addToast(error?.response?.data?.message || t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  return (
    <Shell>
      <div className="ng-page ng-auth-shell">
        <div className="ng-auth-panel">
          <div className="ng-auth-switch"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>{t(lang, "login")}</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>{t(lang, "register")}</button></div>
          {mode === "login" ? (
            <form className="ng-auth-form" onSubmit={submitLogin}>
              <input value={loginData.phone} onChange={(e) => setLoginData((p) => ({ ...p, phone: e.target.value }))} placeholder={t(lang, "phone")} />
              <input type="password" value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} placeholder={t(lang, "password")} />
              <button className="ng-primary-button" type="submit">{t(lang, "login")}</button>
            </form>
          ) : (
            <form className="ng-auth-form" onSubmit={submitRegister}>
              <input value={registerData.fname} onChange={(e) => setRegisterData((p) => ({ ...p, fname: e.target.value }))} placeholder={t(lang, "firstName")} />
              <input value={registerData.lname} onChange={(e) => setRegisterData((p) => ({ ...p, lname: e.target.value }))} placeholder={t(lang, "lastName")} />
              <input value={registerData.phone} onChange={(e) => setRegisterData((p) => ({ ...p, phone: e.target.value }))} placeholder={t(lang, "phone")} />
              <input value={registerData.email} onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))} placeholder={t(lang, "email")} />
              <input type="password" value={registerData.password} onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))} placeholder={t(lang, "password")} />
              <button className="ng-primary-button" type="submit">{t(lang, "register")}</button>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
};

export const CartPage = () => {
  const lang = useLang();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state?.cartData?.items || []);
  const { addToast } = useToasts();
  return (
    <Shell>
      <div className="ng-page ng-cart-layout">
        <SectionHeader eyebrow="Cart" title={t(lang, "navCart")} text={`${cartItems.length} ${t(lang, "results")}`} />
        {cartItems.length ? (
          <div className="ng-cart-grid">
            <div className="ng-surface">{cartItems.map((item) => <CartLine key={item.cartItemId || item.id} item={item} />)}</div>
            <div>
              <CartSummary items={cartItems}>
                <Link to="/checkout" className="ng-primary-button block" style={{ marginBottom: "12px" }}>{t(lang, "proceedCheckout")}</Link>
                <button className="ng-secondary-button block" onClick={() => dispatch(deleteAllFromCart(addToast))}>{t(lang, "clearCart")}</button>
              </CartSummary>
            </div>
          </div>
        ) : <EmptyState title={t(lang, "emptyCart")} text={t(lang, "emptyText")} action={<Link className="ng-primary-button ghost" to="/shop">{t(lang, "continueShopping")}</Link>} />}
      </div>
    </Shell>
  );
};

export const WishlistPage = () => {
  const lang = useLang();
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const wishlistItems = useSelector((state) => state?.wishlistData || []);
  return (
    <Shell>
      <div className="ng-page">
        <SectionHeader eyebrow="Wishlist" title={t(lang, "navWishlist")} text={`${wishlistItems.length} ${t(lang, "results")}`} />
        {wishlistItems.length ? <div className="ng-product-grid">{wishlistItems.map((product) => <div key={product.id} className="ng-wishlist-wrap"><ProductCard product={product} /><button className="ng-text-button danger block" style={{ background: "rgba(255, 59, 48, 0.1)", borderRadius: "16px", padding: "12px", marginTop: "8px" }} onClick={() => dispatch(deleteFromWishlist(product, addToast))}>{t(lang, "removeWishlist")}</button></div>)}</div> : <EmptyState title={t(lang, "emptyWishlist")} text={t(lang, "emptyText")} action={<Link className="ng-primary-button ghost" to="/shop">{t(lang, "continueShopping")}</Link>} />}
      </div>
    </Shell>
  );
};

export const CheckoutPage = () => {
  const lang = useLang();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const cartItems = useSelector((state) => state?.cartData?.items || []);
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentType, setPaymentType] = useState("cod");
  const [addressForm, setAddressForm] = useState({ fName: "", lName: "", email: "", phone: "", country: "", address_id: "", zip: "", street: "", notes: "" });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      axiosInstance.get("/user").then((res) => { setUser(res.data?.user || null); setSelectedAddress(res.data?.user?.addresses?.[0]?.id || ""); }).catch(() => setUser(null));
    }
    axiosInstance.get("/cities").then((res) => setCities(res.data || [])).catch(() => setCities([]));
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/user/addresses/add", {
        f_name: addressForm.fName,
        l_name: addressForm.lName,
        email: addressForm.email,
        phone: addressForm.phone,
        country: addressForm.country,
        address_id: addressForm.address_id,
        city: addressForm.address_id,
        zip: addressForm.zip,
        street: addressForm.street,
        notes: addressForm.notes,
        type: "cod"
      });
      setUser((prev) => ({ ...prev, addresses: [...(prev?.addresses || []), res.data.address] }));
      setSelectedAddress(res.data?.address?.id);
      addToast(t(lang, "successMessage"), { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  const handleCheckout = async () => {
    const isGuest = !localStorage.getItem("authToken");

    if (!isGuest && !selectedAddress) {
      addToast(t(lang, "addressRequired"), { appearance: "error", autoDismiss: true });
      return;
    }

    if (isGuest && (!addressForm.fName || !addressForm.phone || !addressForm.street)) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
      return;
    }

    try {
      let checkoutData = {};
      if (isGuest) {
        checkoutData = {
          f_name: addressForm.fName,
          l_name: addressForm.lName,
          email: addressForm.email,
          phone: addressForm.phone,
          country: addressForm.country,
          city: String(addressForm.address_id),
          zip: addressForm.zip,
          street: addressForm.street,
          notes: notes,
          type: paymentType,
          cart: cartItems.map(item => ({ item_id: item.item_id || item.id, qty: item.qty, size: item.size || null }))
        };
      } else {
        checkoutData = {
          address_id: selectedAddress,
          type: paymentType,
          notes
        };
      }

      await axiosInstance.post("/checkout", checkoutData);
      dispatch(deleteAllFromCart(addToast));
      addToast(t(lang, "orderPlaced"), { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  return (
    <Shell>
      <div className="ng-page ng-checkout-grid">
        <section className="ng-surface">
          <SectionHeader title={t(lang, "billingDetails")} text={t(lang, "dashboardSummary")} />
          
          {localStorage.getItem("authToken") ? (
            <>
              {user?.addresses?.length > 0 && (
                <div className="ng-address-list">{(user?.addresses || []).map((address) => <label key={address.id} className={`ng-address-card ${selectedAddress === address.id ? "active" : ""}`}><input type="radio" checked={selectedAddress === address.id} onChange={() => setSelectedAddress(address.id)} /> <span>{address.f_name} {address.l_name}</span><small>{address.street}, {address.country}</small></label>)}</div>
              )}
              <form className="ng-form-grid" onSubmit={handleAddAddress}>
                <input value={addressForm.fName} onChange={(e) => setAddressForm((p) => ({ ...p, fName: e.target.value }))} placeholder={t(lang, "firstName")} required />
                <input value={addressForm.lName} onChange={(e) => setAddressForm((p) => ({ ...p, lName: e.target.value }))} placeholder={t(lang, "lastName")} required />
                <input value={addressForm.email} onChange={(e) => setAddressForm((p) => ({ ...p, email: e.target.value }))} placeholder={t(lang, "email")} />
                <input value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t(lang, "phone")} required />
                <input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} placeholder={t(lang, "country")} />
                <select value={addressForm.address_id} onChange={(e) => setAddressForm((p) => ({ ...p, address_id: e.target.value }))} required><option value="">{t(lang, "city")}</option>{cities.map((city) => <option key={city.id} value={city.id}>{pickTranslation(city.translations, lang, "name") || city.name}</option>)}</select>
                <input value={addressForm.zip} onChange={(e) => setAddressForm((p) => ({ ...p, zip: e.target.value }))} placeholder={t(lang, "zip")} />
                <input value={addressForm.street} onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))} placeholder={t(lang, "street")} required />
                <button className="ng-secondary-button" type="submit">{t(lang, "addAddress")}</button>
              </form>
            </>
          ) : (
            <div className="ng-form-grid">
              <input value={addressForm.fName} onChange={(e) => setAddressForm((p) => ({ ...p, fName: e.target.value }))} placeholder={t(lang, "firstName")} required />
              <input value={addressForm.lName} onChange={(e) => setAddressForm((p) => ({ ...p, lName: e.target.value }))} placeholder={t(lang, "lastName")} required />
              <input value={addressForm.email} onChange={(e) => setAddressForm((p) => ({ ...p, email: e.target.value }))} placeholder={t(lang, "email")} />
              <input value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} placeholder={t(lang, "phone")} required />
              <input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} placeholder={t(lang, "country")} />
              <select value={addressForm.address_id} onChange={(e) => setAddressForm((p) => ({ ...p, address_id: e.target.value }))} required><option value="">{t(lang, "city")}</option>{cities.map((city) => <option key={city.id} value={city.id}>{pickTranslation(city.translations, lang, "name") || city.name}</option>)}</select>
              <input value={addressForm.zip} onChange={(e) => setAddressForm((p) => ({ ...p, zip: e.target.value }))} placeholder={t(lang, "zip")} />
              <input value={addressForm.street} onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))} placeholder={t(lang, "street")} required />
            </div>
          )}
          
          <div className="ng-payment-row"><label><input type="radio" checked={paymentType === "cod"} onChange={() => setPaymentType("cod")} /> {t(lang, "cashOnDelivery")}</label></div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t(lang, "notes")} />
        </section>
        <div>
          <CartSummary items={cartItems}>
            <button className="ng-primary-button block" onClick={handleCheckout}>{t(lang, "placeOrder")}</button>
          </CartSummary>
        </div>
      </div>
    </Shell>
  );
};

export const AccountPage = () => {
  const lang = useLang();
  const history = useHistory();
  const { addToast } = useToasts();
  const [tab, setTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login-register");
      return;
    }
    Promise.all([axiosInstance.get("/user"), axiosInstance.get("/cities")]).then(([userRes, citiesRes]) => {
      setUser(userRes.data?.user || null);
      setCities(citiesRes.data || []);
    }).catch(() => history.push("/login-register"));
  }, [history]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/user/edit_profile", user);
      addToast(t(lang, "updated"), { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  const updatePasswordHandler = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
      return;
    }
    try {
      const res = await axiosInstance.post("/user/password", { password: passwords.password });
      if (res.data?.token) localStorage.setItem("authToken", res.data.token);
      addToast(t(lang, "updated"), { appearance: "success", autoDismiss: true });
      setPasswords({ password: "", confirmPassword: "" });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  const saveAddress = async (index) => {
    const address = user.addresses[index];
    try {
      await axiosInstance.post(`/user/addresses/edit/${address.id}`, address);
      addToast(t(lang, "updated"), { appearance: "success", autoDismiss: true });
    } catch (error) {
      addToast(t(lang, "formErrors"), { appearance: "error", autoDismiss: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("redux_localstorage_simple");
    localStorage.removeItem("authToken");
    history.push("/");
  };

  if (!user) return <Shell><LoadingScreen label="Loading account" /></Shell>;

  return (
    <Shell>
      <div className="ng-page ng-account-layout">
        <aside className="ng-account-sidebar">
          <span className="ng-eyebrow">{t(lang, "accountWelcome")}</span>
          <h2>{user.fname} {user.lname}</h2>
          <p>{t(lang, "dashboardSummary")}</p>
          <div className="ng-account-tabs">
            {["profile", "orders", "addresses", "security"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{t(lang, item)}</button>)}
          </div>
          <button className="ng-text-button danger" onClick={logout}>{t(lang, "logout")}</button>
        </aside>
        <section className="ng-surface">
          {tab === "profile" ? (
            <form className="ng-form-grid" onSubmit={updateProfile}>
              <MetricCard title={t(lang, "points")} value={user.points || 0} note={t(lang, "accountWelcome")} />
              <input value={user.fname || ""} onChange={(e) => setUser((p) => ({ ...p, fname: e.target.value }))} placeholder={t(lang, "firstName")} />
              <input value={user.lname || ""} onChange={(e) => setUser((p) => ({ ...p, lname: e.target.value }))} placeholder={t(lang, "lastName")} />
              <input value={user.email || ""} onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))} placeholder={t(lang, "email")} />
              <input value={user.phone || ""} onChange={(e) => setUser((p) => ({ ...p, phone: e.target.value }))} placeholder={t(lang, "phone")} />
              <button className="ng-primary-button" type="submit">{t(lang, "save")}</button>
            </form>
          ) : null}

          {tab === "orders" ? (
            <div className="ng-order-stack">
              {(user.orders || []).length ? user.orders.map((order) => (
                <article className="ng-order-card" key={order.id}>
                  <div className="ng-order-head"><strong>#{order.id}</strong><span>{formatDate(order.created_at, lang)}</span><b>{getOrderStatus(order, lang)}</b><strong>{formatCurrency(order.totalCost || order.total || 0, lang)}</strong></div>
                  <div className="ng-order-items">{getOrderItems(order).map((item, idx) => <div key={`${order.id}-${idx}`} className="ng-order-item"><span>{pickTranslation(item.translations, lang, "name") || item.name}</span><small>x{item?.pivot?.qty || item?.qty || 1}</small></div>)}</div>
                </article>
              )) : <EmptyState title={t(lang, "noOrders")} text={t(lang, "dashboardSummary")} />}
            </div>
          ) : null}

          {tab === "addresses" ? (
            <div className="ng-address-editor">{(user.addresses || []).length ? user.addresses.map((address, index) => <div key={address.id} className="ng-address-edit-card"><input value={address.f_name || ""} onChange={(e) => setUser((prev) => ({ ...prev, addresses: prev.addresses.map((entry, i) => i === index ? { ...entry, f_name: e.target.value } : entry) }))} placeholder={t(lang, "firstName")} /><input value={address.l_name || ""} onChange={(e) => setUser((prev) => ({ ...prev, addresses: prev.addresses.map((entry, i) => i === index ? { ...entry, l_name: e.target.value } : entry) }))} placeholder={t(lang, "lastName")} /><select value={address.city || ""} onChange={(e) => setUser((prev) => ({ ...prev, addresses: prev.addresses.map((entry, i) => i === index ? { ...entry, city: e.target.value, address_id: e.target.value } : entry) }))}>{cities.map((city) => <option key={city.id} value={city.id}>{pickTranslation(city.translations, lang, "name") || city.name}</option>)}</select><input value={address.street || ""} onChange={(e) => setUser((prev) => ({ ...prev, addresses: prev.addresses.map((entry, i) => i === index ? { ...entry, street: e.target.value } : entry) }))} placeholder={t(lang, "street")} /><button className="ng-secondary-button" onClick={() => saveAddress(index)}>{t(lang, "save")}</button></div>) : <EmptyState title={t(lang, "noAddresses")} text={t(lang, "addAddress")} />}</div>
          ) : null}

          {tab === "security" ? (
            <form className="ng-form-grid" onSubmit={updatePasswordHandler}>
              <input type="password" value={passwords.password} onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))} placeholder={t(lang, "password")} />
              <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder={t(lang, "passwordConfirm")} />
              <button className="ng-primary-button" type="submit">{t(lang, "updatePassword")}</button>
            </form>
          ) : null}
        </section>
      </div>
    </Shell>
  );
};

export const NotFoundPage = () => {
  const lang = useLang();
  return <Shell><div className="ng-page"><EmptyState title={t(lang, "notFoundTitle")} text={t(lang, "dashboardSummary")} action={<Link className="ng-primary-button" to="/">{t(lang, "backHome")}</Link>} /></div></Shell>;
};
