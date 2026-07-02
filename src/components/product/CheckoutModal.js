import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import { deleteAllFromCart } from "../../redux/actions/cartActions";

function CheckoutModal({
  quantityCount,
  currentLanguageCode,
  show,
  onHide,
  strings,
  products,
}) {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    zip: "",
    street: "",
    notes: "",
  });

  const [cities, setCities] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState(0);
  const [freeDeliveryAt, setFreeDeliveryAt] = useState(null);

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch cities on component load
  useEffect(() => {
    axiosInstance
      .get("/cities")
      .then((res) => {
        setCities(res.data);
      })
      .catch((error) => {
        console.error("Error fetching cities", error);
        setCities([]);
      });
  }, []);

  // ✅ جلب free_delivery_at من الـ settings
  useEffect(() => {
    axiosInstance
      .get("/settings")
      .then((res) => {
        const val = res.data?.settings?.free_delivery_at ?? null;
        if (val !== null) setFreeDeliveryAt(parseFloat(val));
      })
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);

  // Fetch user addresses if logged in
  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("authToken")) {
        try {
          const response = await axiosInstance.get("/user");
          setUser(response.data.user);
          const userAddresses = response.data.user.addresses || [];
          setAddresses(userAddresses);
          if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchData();
  }, []);

  // Update delivery fees when selected address changes
  useEffect(() => {
    if (selectedAddress && cities.length > 0 && addresses.length > 0) {
      const selectedAddr = addresses.find((a) => a.id === selectedAddress);
      if (selectedAddr) {
        const selectedCity = cities.find(
          (c) => c.id === parseInt(selectedAddr.city)
        );
        if (selectedCity) {
          setDeliveryFees(selectedCity.delivery_tax);
        }
      }
    }
  }, [selectedAddress, cities, addresses]);

  // ✅ حساب إجمالي السلة
  const cartTotalPrice =
    products?.reduce((total, product) => {
      const qty =
        product?.cartQuantity ||
        product?.quantity ||
        product?.pivot?.qty ||
        product?.qty ||
        quantityCount ||
        1;
      const price = parseFloat(product?.price) || 0;
      const discount = parseFloat(product?.discount) || 0;
      return total + (price - (price * discount) / 100) * qty;
    }, 0) || 0;

  // ✅ هل الشحن مجاني؟
  const isFreeShipping =
    freeDeliveryAt !== null && cartTotalPrice >= freeDeliveryAt;
  const lastTax = isFreeShipping ? 0 : parseFloat(deliveryFees || 0);

  // Handle city change and calculate delivery fees
  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(
      (city) => city.id === parseInt(selectedCityId)
    );

    setFormData((prevData) => ({
      ...prevData,
      city: selectedCity ? selectedCity.id : "",
    }));

    setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
  };

  const handleAddressSelect = (value) => {
    if (value === "new") {
      setSelectedAddress(null);
      const selectedCity = cities.find((city) => city.id === parseInt(formData.city));
      setDeliveryFees(selectedCity ? selectedCity.delivery_tax : 0);
      return;
    }
    const numericValue = parseInt(value, 10);
    setSelectedAddress(numericValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cartData = products.map((product) => {
      const itemQty =
        product?.cartQuantity ||
        product?.quantity ||
        product?.pivot?.qty ||
        product?.qty ||
        quantityCount ||
        1;
      return {
        item_id: product.id,
        qty: itemQty,
        size:
          product.size ||
          product.weight ||
          product.selectedProductSize ||
          product?.selectedVariation?.weight,
      };
    });

    // ✅ مزامنة المنتجات مع سلة الباك إند قبل الـ checkout
    // عشان لو المستخدم ضغط "اطلب الآن" من غير ما يضيف للسلة الأول
    // أو لو السلة اتمسحت بعد طلب سابق
    if (localStorage.getItem("authToken")) {
      try {
        // أول حاجة نمسح السلة القديمة عشان نتجنب تكرار المنتجات
        await axiosInstance.post("/remove-all-cart");

        // نضيف كل المنتجات لسلة الباك إند
        for (const item of cartData) {
          await axiosInstance.post("/add-to-cart", {
            item_id: item.item_id,
            qty: item.qty,
            size: item.size,
          });
        }
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
        // نكمل الـ checkout حتى لو فشلت المزامنة - الباك إند ممكن يقبل inline cart
      }
    }

    let finalAddressId = selectedAddress;

    // If user is logged in and wants a new address, try to create it
    if (user && !selectedAddress) {
      if (!formData.fName || !formData.phone || !formData.city || !formData.street) {
        addToast(strings["fill_required_fields"] || "الرجاء ملء جميع الحقول المطلوبة", { appearance: "error" });
        return;
      }
      
      try {
        const addressResponse = await axiosInstance.post("/user/addresses/add", {
          f_name: formData.fName,
          l_name: formData.lName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          zip: formData.zip || "00000", // ✅ قيمة افتراضية لو المستخدم مكتبش رمز بريدي
          street: formData.street,
          notes: formData.notes,
          type: "cod",
        });

        if (addressResponse.data.status === "success") {
          finalAddressId = addressResponse.data.address.id;
          setAddresses((prev) => [...prev, addressResponse.data.address]);
          setSelectedAddress(finalAddressId);
        } else {
          // ✅ لو فشل إنشاء العنوان، نكمل الـ checkout ببيانات العنوان inline
          console.warn("Address creation returned non-success, proceeding with inline address data");
          finalAddressId = null;
        }
      } catch (error) {
        console.error("Failed to add new address:", error);
        // ✅ بدل ما نوقف الـ checkout، نكمل ببيانات العنوان inline (زي الـ guest)
        console.warn("Address creation failed, falling back to inline address checkout");
        finalAddressId = null;
      }
    }

    const checkoutData = finalAddressId ? {
      address_id: finalAddressId,
      type: "cod",
      notes: formData.notes,
      cart: cartData,
    } : {
      f_name: formData.fName,
      l_name: formData.lName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: String(formData.city),
      zip: formData.zip,
      street: formData.street,
      notes: formData.notes,
      type: "cod",
      cart: cartData,
    };

    try {
      const response = await axiosInstance.post("/checkout", checkoutData);
      if (response.data.status === "success") {
        const successMsg =
          strings["Checkoutsuccessful"] ||
          "تم إتمام الطلب بنجاح! | Order placed successfully!";
        addToast(successMsg, { appearance: "success" });
        dispatch(deleteAllFromCart()); // بدون toast عشان مش عايزين رسالة "تم إفراغ السلة" بعد نجاح الطلب
        onHide();
      } else {
        const errorMsg =
          strings["Checkoutwasnotsuccessful"] ||
          "حدث خطأ أثناء الطلب | Checkout failed";
        addToast(errorMsg, { appearance: "error" });
      }
    } catch (error) {
      console.error("Checkout failed", error);
      const catchMsg =
        strings["Checkoutfailed"] ||
        "فشل الاتصال بالسيرفر | Server error";
      addToast(catchMsg, { appearance: "error" });
    }
  };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>{strings["checkout_title"]}</Modal.Title>
        </Modal.Header>
        <div className="modal-body p-0">
          <div className="d-flex justify-content-start align-items-center gap-3 p-1">
            {products?.map((el) => {
              const displayQty =
                el?.cartQuantity ||
                el?.quantity ||
                el?.pivot?.qty ||
                el?.qty ||
                quantityCount ||
                1;
              return (
                <div
                  className="d-flex gap-3 align-items-center"
                  key={el.cartItemId || el.id}
                >
                  <img
                    src={el?.image_path}
                    alt="el Images"
                    width={100}
                    height={100}
                    className="rounded"
                  />
                  <p>
                    {currentLanguageCode === "ar"
                      ? el.translations[0]?.name
                      : el.translations[1].name}
                    <br />
                    {parseFloat(el.price).toFixed(2)} X {displayQty}
                  </p>
                </div>
              );
            })}
          </div>
          <form>
            <Modal.Body className="p-0">
              <div className="checkout-modal-content p-3">
                {user && addresses.length > 0 && (
                  <div className="mb-4">
                    <p className="fw-bold mb-3">{strings["chose_address"] || "اختر عنوان"}</p>
                    {addresses.map((address) => (
                      <div className="address-item mb-2 d-flex align-items-center" key={address.id}>
                        <input
                          type="radio"
                          name="address_id"
                          id={`modal-address-${address.id}`}
                          className="address-radio"
                          value={address.id}
                          onChange={(e) => handleAddressSelect(e.target.value)}
                          checked={selectedAddress === address.id}
                        />
                        <label
                          htmlFor={`modal-address-${address.id}`}
                          className="address-label mb-0"
                          style={{ marginInlineStart: '8px' }}
                        >
                          {address.f_name} {address.l_name} - {address.street}, {address.city}, {address.country}
                        </label>
                      </div>
                    ))}
                    <div className="address-item mb-2 d-flex align-items-center mt-3">
                      <input
                        type="radio"
                        name="address_id"
                        id="modal-address-new"
                        className="address-radio"
                        value="new"
                        onChange={(e) => handleAddressSelect(e.target.value)}
                        checked={selectedAddress === null}
                      />
                      <label
                        htmlFor="modal-address-new"
                        className="address-label mb-0 fw-bold"
                        style={{ marginInlineStart: '8px' }}
                      >
                        {strings["add_new_address"] || "إضافة عنوان جديد"}
                      </label>
                    </div>
                  </div>
                )}

                {(!user || addresses.length === 0 || selectedAddress === null) && (
                  <>
                    {/* Contact Information */}
                    <div className="mb-4">
                      <p className="fw-bold mb-3">{strings["contact_info"]}</p>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="fName"
                          value={formData.fName}
                          onChange={handleInputChange}
                          placeholder={strings["first_name"]}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="lName"
                          value={formData.lName}
                          onChange={handleInputChange}
                          placeholder={strings["last_name"]}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={strings["email_optional"]}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={strings["phone"]}
                        />
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mb-4">
                      <p className="fw-bold mb-3">{strings["shipping_info"]}</p>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          placeholder={strings["street"]}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder={strings["country"]}
                        />
                      </div>
                      <div className="mb-3">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleCityChange}
                        >
                          <option value="">{strings["select_city"]}</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {currentLanguageCode === "ar"
                                ? city.translations[0]?.name
                                : city.translations[1]?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder={strings["zip_code"]}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <p className="fw-bold mb-3">{strings["order_notes"] || "ملاحظات الطلب"}</p>
                  <div className="mb-3">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={strings["notes"]}
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", outline: "none" }}
                    />
                  </div>
                </div>

                {/* Pricing Summary */}
                <div>
                  <p className="fw-bold mb-3">{strings["shipping_cost"]}</p>
                  <div className="d-flex justify-content-between">
                    <span>{strings["shipping_price"]}</span>
                    <span>
                      {isFreeShipping ? (
                        <span style={{ color: "#2d7a2d", fontWeight: "bold" }}>
                          {strings["free_shipping"] || "شحن مجاني 🎉"}
                        </span>
                      ) : (
                        <>
                          {lastTax} {strings["EG"]}
                        </>
                      )}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>{strings["total"]}</span>
                    <span
                      style={{
                        direction:
                          currentLanguageCode === "en" ? "ltr" : "rtl",
                      }}
                    >
                      {(cartTotalPrice + lastTax).toFixed(2)} {strings["EG"]}
                    </span>
                  </div>
                  <p className="text-muted mt-1">{strings["tax_included"]}</p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex flex-column gap-2">
              <button onClick={handleSubmit} className="btn btn-primary w-100">
                {strings["pay_on_delivery"]}
              </button>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
}

export default multilanguage(CheckoutModal);