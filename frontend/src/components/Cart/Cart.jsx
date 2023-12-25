import { useNavigate } from "react-router-dom";
import "./cart.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Homepage/loading.css";
const Cart = () => {
    const navigate = useNavigate();
    const [orderItem, setOrderItem] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPurchased, setPurchased] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function checkLoggedInCart() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInCart().then(res => {
            if (res.data.message_logged_in === "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ" || res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                navigate("/sign-in");
            }
        }).catch(err => console.log(err))
        async function getCart() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/order/v1/show-cart",
                method: "POST",
                data: {
                    username: localStorage.username
                },
                withCredentials: true
            })
            return res;
        }
        getCart().then(res => {
            setOrderItem(res.data.data)
            setLoading(false);
        })
            .catch(err => console.log(err))
    }, [navigate])
    const handleClickCartToHomepage = () => {
        navigate("/homepage");
    }
    const handleClickPurchase = (e) => {
        let itemList = []
        for (let i of e.target.parentNode.parentNode.parentNode.querySelectorAll(".cart-item-check")) {
            if (i.checked === true) {
                let newItem = {
                    productName: i.parentNode.querySelector(".cart-item-name").innerHTML,
                    number: Number(i.parentNode.querySelector(".cart-item-number-view").innerHTML),
                    price: Number(i.parentNode.querySelector(".cart-item-total").innerHTML.replace("₫", "").replace(".", ""))
                }
                itemList.push(newItem);
            }
        }
        async function checkOut() {
            const res = await axios({
                url: "https://htbook-server-qx4d.onrender.com/api/order/v1/check-out",
                method: "POST",
                withCredentials: true,
                data: {
                    username: localStorage.username,
                    items: itemList
                }
            })
            return res;
        }
        checkOut().then(res => {
            alert((res.data.data));
            navigate("/homepage");
        })
            .catch(err => console.log(err));
    }
    if (loading) {
        return (
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
    }
    return (
        <div className="cart-page-container">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="cart-title">Giỏ hàng</div>
                    <div className="cart-total-items">{totalItem} sản phẩm</div>
                </div>
                {orderItem.map((it, index) => {
                    return (
                        <div key={index} className="cart-item">
                            <div className="cart-item-image">
                                <img src={it.ImgUrl} alt={it.ProductName} />
                            </div>
                            <div className="cart-item-name">
                                {it.ProductName}
                            </div>
                            <div className="cart-item-number">
                                <button className="cart-item-number-decrease-btn" onClick={e => {
                                    let count = Number(e.target.parentNode.querySelector(".cart-item-number-view").innerHTML);
                                    if (count > 1) {
                                        count = count - 1;
                                        e.target.parentNode.querySelector(".cart-item-number-view").innerHTML = count.toString();
                                    }
                                    else {
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "none";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "0.65";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "not-allowed";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "none";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "none";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "alpha(opacity=65)";
                                    }
                                }}>-</button>
                                <div className="cart-item-number-view">{it.NumberOfProducts}</div>
                                <button className="cart-item-number-increase-btn" onClick={e => {
                                    let count = Number(e.target.parentNode.querySelector(".cart-item-number-view").innerHTML);
                                    count = count + 1;
                                    e.target.parentNode.querySelector(".cart-item-number-view").innerHTML = count.toString();
                                    if (count > 1) {
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "";
                                        e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "";
                                    }
                                }}>+</button>
                            </div>
                            <div className="cart-item-total">
                                {it.Price.replace(".00", "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫
                            </div>
                            <input type="checkbox" className="cart-item-check" onChange={e => {
                                let count = Number(e.target.parentNode.querySelector(".cart-item-number-view").innerHTML);
                                let price = Number(e.target.parentNode.querySelector(".cart-item-total").innerHTML.replace("₫", "").replace(".", ""));
                                if (e.target.checked === true) {
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "0.65";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "not-allowed";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "alpha(opacity=65)";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.pointerEvents = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.opacity = "0.65";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.cursor = "not-allowed";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.boxShadow = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.webkitBoxShadow = "none";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.filter = "alpha(opacity=65)";
                                    setTotalItem(prev => prev + count);
                                    setTotalPrice(prev => {
                                        if (prev + count * price > 0) setPurchased(true);
                                        else setPurchased(false);
                                        return (prev + count * price)
                                    });
                                }
                                else {
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "";
                                    e.target.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.pointerEvents = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.opacity = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.cursor = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.boxShadow = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.webkitBoxShadow = "";
                                    e.target.parentNode.querySelector(".cart-item-number-increase-btn").style.filter = "";
                                    setTotalItem(prev => prev - count);
                                    setTotalPrice(prev => {
                                        if (prev - count * price > 0) setPurchased(true);
                                        else setPurchased(false);
                                        return (prev - count * price)
                                    });
                                }
                            }} />
                        </div>
                    )
                })}
                <div className="cart-checkout">
                    <div className="cart-check-all">
                        <input type="checkbox" className="cart-check-all-items" onChange={e => {
                            if (e.target.checked === true) {
                                setTotalItem(0);
                                setTotalPrice(0);
                                setPurchased(false);
                                let count = 0;
                                let price = 0;
                                for (let i of e.target.parentNode.parentNode.parentNode.querySelectorAll(".cart-item-check")) {
                                    i.checked = true;
                                    i.disabled = true;
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "none";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "0.65";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "not-allowed";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "none";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "none";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "alpha(opacity=65)";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.pointerEvents = "none";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.opacity = "0.65";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.cursor = "not-allowed";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.boxShadow = "none";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.webkitBoxShadow = "none";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.filter = "alpha(opacity=65)";
                                    count += Number(i.parentNode.querySelector(".cart-item-number-view").innerHTML);
                                    price += Number(i.parentNode.querySelector(".cart-item-number-view").innerHTML) * Number(i.parentNode.querySelector(".cart-item-total").innerHTML.replace("₫", "").replace(".", ""));
                                }
                                setTotalItem(prev => prev + count);
                                setTotalPrice(prev => {
                                    if (prev + price > 0) setPurchased(true);
                                    else setPurchased(false);
                                    return prev + price;
                                });
                            }
                            else {
                                let count = 0;
                                let price = 0;
                                for (let i of e.target.parentNode.parentNode.parentNode.querySelectorAll(".cart-item-check")) {
                                    i.checked = false;
                                    i.disabled = false;
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.pointerEvents = "";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.opacity = "";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.cursor = "";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.boxShadow = "";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.webkitBoxShadow = "";
                                    i.parentNode.querySelector(".cart-item-number-decrease-btn").style.filter = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.pointerEvents = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.opacity = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.cursor = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.boxShadow = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.webkitBoxShadow = "";
                                    i.parentNode.querySelector(".cart-item-number-increase-btn").style.filter = "";
                                    count += Number(i.parentNode.querySelector(".cart-item-number-view").innerHTML);
                                    price += Number(i.parentNode.querySelector(".cart-item-number-view").innerHTML) * Number(i.parentNode.querySelector(".cart-item-total").innerHTML.replace("₫", "").replace(".", ""));
                                }
                                setTotalItem(prev => prev - count);
                                setTotalPrice(prev => {
                                    if (prev - price > 0) setPurchased(true);
                                    else setPurchased(false);
                                    return prev - price;
                                });
                            }
                        }} />
                        <span>Tất cả</span>
                    </div>
                    <div className="cart-payment">
                        <div className="payment-total">Tổng tiền: ₫{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                        {isPurchased ? (
                            <div className="cart-purchase" onClick={handleClickPurchase}>Thanh toán</div>
                        ) : (
                            <div className="cart-purchase-disabled">Thanh toán</div>
                        )}
                    </div>
                </div>
                <div className="cart-to-homepage" >
                    <i className="fa-solid fa-left-long"></i>
                    <span onClick={handleClickCartToHomepage}>Quay trở lại shop</span>
                </div>
            </div>
        </div>
    );
}

export default Cart;