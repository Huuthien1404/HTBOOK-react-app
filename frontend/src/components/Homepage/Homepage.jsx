import { useEffect, useState } from "react";
import "./homepage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./loading.css";
const Homepage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [searchContent, setSearchContent] = useState("");
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [products, setProducts] = useState([]);
    const [containProduct, setContainProduct] = useState(false);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestFind, setShowSuggestFind] = useState(true);
    const [showSuggestHeader, setShowSuggestHeader] = useState("Gợi ý hôm nay");
    //const [currentNewItems, setCurrentNewItems] = useState([ ]);
    const itemsPerPage = 28;
    useEffect(() => {
        localStorage.removeItem("item_details");
        async function checkLoggedIn() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedIn().then(res => {
            if (res.data.message_logged_in === "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ" || res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                navigate("/sign-in");
            }
            else if (res.data.message_logged_in === "Đã đăng nhập với vai trò user") {
                localStorage.setItem("username", res.data.message_username);
                setUsername(res.data.message_username);
            }

        }).catch(err => console.log(err))

        async function getPopularProduct() {
            setLoading(true);
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/show-popular-products",
                withCredentials: true,
                method: "GET",
            });
            return res;
        }
        getPopularProduct()
            .then((res) => setPopularProducts(res.data.data))
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            })

        async function getProduct() {
            setLoading(true);
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/show-all-products",
                withCredentials: true,
                method: "GET",
            });
            return res;
        }
        getProduct()
            .then((res) => {
                setProducts(res.data.data)
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            })

        async function checkProductInCart() {
            setLoading(true);
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/contain-product-in-cart",
                withCredentials: true,
                method: "POST",
                data: {
                    username: localStorage.username
                }
            });
            return res;
        }
        checkProductInCart()
            .then((res) => {
                if (res.data.data === "contain product") setContainProduct(true);
                else setContainProduct(false);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            })
    }, [navigate]);
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(products.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(products.length / itemsPerPage));
    }, [itemOffset, products]);

    useEffect(() => {
        setLoading(false);
    }, [currentItems])

    const handleClickSearchProduct = async () => {
        setLoading(true);
        try {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/filter-product-by-name",
                method: "POST",
                withCredentials: true,
                data: {
                    filter_product_by_name: searchContent
                }
            });
            setShowSuggestFind(false);
            setShowSuggestHeader("Kết quả tìm kiếm");
            setProducts(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
    };
    const handleClickLogOut = () => {
        async function userLogOut() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/auth/v1/log-out",
                method: "GET",
                withCredentials: true
            })
            return res;
        }
        userLogOut().then(res => {
            navigate("/sign-in");
        })
    }
    const handleClickProduct = (e) => {
        let itemName = e.target.querySelector(".homepage-item-name").innerHTML;
        let getItem = currentItems.find(item => item.ProductName === itemName);
        localStorage.setItem("item_details", JSON.stringify(getItem));
        async function addPopularProduct() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/add-to-popular-product",
                method: "POST",
                withCredentials: true,
                data: {
                    product_name: getItem
                }
            })
            return res;
        }
        addPopularProduct().then(res => console.log(res.data.data))
            .catch(err => console.log(err));
        navigate("/product-detail");
    }
    const handleClickCart = () => {
        navigate("/cart");
    }
    const handleClickPopularProduct = (e) => {
        let itemName = e.target.querySelector(".best-find-item-name").innerHTML;
        async function getPopularProductByName() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/product/v1/get-popular-product-by-name",
                method: "POST",
                withCredentials: true,
                data: {
                    product_name: itemName
                }
            })
            return res;
        }
        getPopularProductByName().then(res => {
            localStorage.setItem("item_details", JSON.stringify(res.data))
            navigate("/product-detail");
        })
            .catch(err => console.log(err));
    }
    if (loading) {
        return (
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
    }
    return (
        <div className="homepage-container">
            <div className="homepage-header">
                <img loading="lazy" src="https://htbook-server-qx4d.onrender.com/logo.PNG" alt="" className="logo-homepage" onClick={e => {
                    window.location = "/homepage";
                }} />
                <div className="homepage-header-list">
                    <form id="homepage-header-search" className="homepage-header-search">
                        <input type="text" className="homepage-search-text" value={searchContent} spellCheck="false" autoComplete="off" placeholder="Tìm sản phẩm" onChange={e => setSearchContent(e.target.value)} />
                        <i className="fa-solid fa-magnifying-glass homepage-search-submit" onClick={handleClickSearchProduct}></i>
                    </form>
                    <div className="list-icon-header">
                        <i className="fa-solid fa-house homepage-reload-icon" onClick={e => {
                            window.location = "/homepage";
                        }}></i>
                        <i className="fa-solid fa-cart-shopping homepage-cart-icon" onClick={handleClickCart}>
                            {containProduct && <i className="fa-solid fa-bell homepage-bell-icon"></i>}
                        </i>
                        <i className="fa-solid fa-user homepage-user-icon" onClick={e => navigate("/change-password")}></i>
                        <i className="fa-solid fa-right-from-bracket homepage-logout" onClick={handleClickLogOut}></i>
                    </div>
                </div>
                <div className="homepage-username">Xin chào {username}</div>
            </div>
            {showSuggestFind && <div className="best-seller-product">
                <div className="best-find-product">TOP 50 SẢN PHẨM ĐƯỢC TÌM KIẾM GẦN ĐÂY</div>
                <button className="custom_next">
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
                <button className="custom_prev">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <Swiper
                    // install Swiper modules
                    modules={[Navigation, Pagination, A11y, Autoplay]}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false
                    }}
                    slidesPerGroup={4}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".custom_next",
                        prevEl: ".custom_prev"
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={
                        {
                            640: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },

                        }
                    }
                >
                    {popularProducts.map((it, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <div className="sample-slider" onClick={handleClickPopularProduct}>
                                    <div className="best-find-item-img">
                                        <img loading="lazy" src={it.ImgUrl} alt={it.ProductName} />
                                    </div>
                                    <p className="best-find-item-name">{it.ProductName}</p>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>}
            <div className="today-suggestion-header">
                <p>{showSuggestHeader}</p>
            </div>
            <div className="homepage-list-item">
                {!loading && currentItems.map((item, index) => {
                    return (
                        <div key={index} className="homepage-item" onClick={handleClickProduct}>
                            <div className="homepage-item-image">
                                <img loading="lazy" src={item.ImgUrl} alt={item.ProductName} />
                            </div>
                            <p className="homepage-item-name">{item.ProductName}</p>
                            <div className="homepage-item-sold">
                                <i className="fa-solid fa-star homepage-item-star"></i>
                                <i className="fa-solid fa-star homepage-item-star"></i>
                                <i className="fa-solid fa-star homepage-item-star"></i>
                                <i className="fa-solid fa-star homepage-item-star"></i>
                                <i className="fa-solid fa-star homepage-item-star"></i>
                                <p className="homepage-item-sold-number">Đã bán {item.Sold > 5000 ? '5000+' : item.Sold}</p>
                            </div>
                            <div className="homepage-item-price">{item.Price.replace(".00", "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫</div>
                        </div>
                    )
                })}
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
            />
            <div className="footer-container">
                <div className="about-me">
                    <div className="about-me-title">Về chúng tôi</div>
                    <div className="about-me-content">HTBOOK là một cửa hàng sách đa dạng và phong cách, chú trọng đến chất lượng và đa dạng về thể loại sách. Cửa hàng tạo ra không gian thân thiện và sáng tạo để khách hàng có thể thoải mái đọc sách và tham gia vào cộng đồng yêu sách sôi động. Đội ngũ nhân viên tận tâm và đam mê sẽ hỗ trợ bạn tìm kiếm sách phù hợp. HTBOOK thường xuyên tổ chức các sự kiện và khuyến mãi đặc biệt để tạo trải nghiệm thú vị cho khách hàng.</div>
                    <div className="about-me-phone">
                        <div className="about-me-phone-icon">
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        <div className="about-me-phone-content">0838322501</div>
                    </div>
                    <div className="about-me-email">
                        <div className="about-me-email-icon">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="about-me-email-content">
                            thie1232135@gmail.com
                        </div>
                    </div>
                    <form className="send-email-container">
                        <input type="text" className="email-text" placeholder="Nhập email của bạn" autoComplete="off" spellCheck="false" />
                        <button className="email-btn">Gửi</button>
                    </form>
                </div>
                <div className="policy-container">
                    <div className="policy-title">Các chính sách</div>
                    <ul className="policy">
                        <li>Chính sách trả hàng và đổi sản phẩm: HTBOOK có thể cung cấp chính sách linh hoạt cho việc đổi hoặc trả sản phẩm, đảm bảo sự hài lòng của khách hàng đối với mua sắm của họ.</li>
                        <li>Ưu đãi và giảm giá: Cửa hàng có thể có các chính sách ưu đãi và giảm giá đặc biệt cho các nhóm khách hàng, ví dụ: học sinh, sinh viên, hoặc các chương trình khách hàng thân thiết.</li>
                        <li>Chính sách bảo mật thông tin cá nhân: HTBOOK cam kết bảo vệ thông tin cá nhân của khách hàng và có thể có các biện pháp bảo mật để đảm bảo an toàn thông tin.</li>
                        <li>Chính sách vận chuyển và giao hàng: Cửa hàng có thể cung cấp thông tin về cách vận chuyển sản phẩm, thời gian giao hàng và phí vận chuyển.</li>
                        <li>Chính sách về sự kiện và khuyến mãi: HTBOOK thường xuyên tổ chức các sự kiện và khuyến mãi đặc biệt, và có thể có chính sách riêng về tham gia và điều kiện áp dụng.</li>
                        <li>Chính sách về đặt hàng và thanh toán: Cửa hàng có thể có quy định về cách đặt hàng, cách thanh toán, và các phương thức thanh toán được chấp nhận.</li>
                        <li>Chính sách về việc làm và cộng đồng: HTBOOK có thể có chính sách về việc làm, đạo đức doanh nghiệp và cam kết tham gia vào cộng đồng.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Homepage;