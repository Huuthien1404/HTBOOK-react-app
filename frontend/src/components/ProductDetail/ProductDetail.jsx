import { useEffect, useState, useRef } from "react";
import "./productdetail.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socketIOClient from "socket.io-client";

const ProductDetail = () => {
    const navigate = useNavigate();
    const [checkVote, setCheckVote] = useState("");
    const [evaluate, setEvaluate] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function checkLoggedInDetails() {
            const res = await axios({
                url: "/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInDetails().then(res => {
            if (res.data.message_logged_in === "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ" || res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                navigate("/sign-in");
            }
        })
            .catch(err => console.log(err))
    }, [navigate]);
    if (!JSON.parse(localStorage.getItem("item_details"))) {
        window.location = "/homepage";
    }
    const itemDetail = JSON.parse(localStorage.getItem("item_details"));
    const [message, setMessage] = useState();
    const socketRef = useRef();
    const [mess, setMess] = useState([]);
    useEffect(() => {
        socketRef.current = socketIOClient.connect("", {
            withCredentials: true,
        });
        socketRef.current.on('sendDataServer', dataGot => {
            setMess(oldMsgs => [...oldMsgs, dataGot])
        }) // mỗi khi có tin nhắn thì mess sẽ được render thêm 
        async function getCommentByProduct() {
            const res = await axios({
                url: "/api/comment/v1/show-all-comment-by-product",
                withCredentials: true,
                method: "POST",
                data: {
                    product_id: JSON.parse(localStorage.getItem("item_details")).ProductID
                }
            })
            return res;
        }
        getCommentByProduct().then(res => {
            setMess(res.data.data)
        })
            .catch(err => console.log(err));
        return () => {
            socketRef.current.disconnect();
        }
    }, []);
    useEffect(() => {
        async function getEvaluateDashboard() {
            const res = await axios({
                url: "/api/comment/v1/show-evaluate-by-product",
                method: "POST",
                data: {
                    product_id: JSON.parse(localStorage.getItem("item_details")).ProductID
                },
                withCredentials: true
            })
            return res;
        }
        getEvaluateDashboard().then(res => {
            setEvaluate(res.data.data);
        })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
            })
    }, [mess]);
    const [countProduct, setCountProduct] = useState(1);
    const [subTotal, setSubTotal] = useState(itemDetail.Price);
    useEffect(() => {
        setSubTotal(countProduct * Number(itemDetail.Price));
    }, [countProduct, itemDetail.Price])
    const handleClickAddToCart = () => {
        async function addToCart() {
            const res = await axios({
                url: "/api/order/v1/add-to-cart",
                method: "POST",
                withCredentials: true,
                data: {
                    productID: itemDetail.ProductID,
                    username: localStorage.getItem("username"),
                    number: Number(countProduct),
                    price: Number(itemDetail.Price.replace(".00", ""))
                }
            })
            return res;
        }
        addToCart().then(res => {
            alert(res.data.data);
        })
            .catch(err => console.log(err));
    }
    const handleSendComment = () => {
        if (message !== null && message !== '' && message !== undefined) {
            let ischeck = false;
            let elementChecked = null;
            for (let i of document.querySelectorAll(".choose-star-content")) {
                if (i.checked === true) {
                    ischeck = true;
                    elementChecked = i;
                    break;
                }
            }
            if (ischeck === true) {
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var date1 = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date + ' ' + time;
                var timeDate = time + ', ' + date1;
                const msg = {
                    content: message,
                    product_id: JSON.parse(localStorage.getItem("item_details")).ProductID,
                    username: localStorage.username,
                    post_date: `${dateTime}`,
                    date_post: `${timeDate}`,
                    star_vote: Number(elementChecked.value)
                }
                socketRef.current.emit('sendDataClient', msg)
                elementChecked.checked = false;
                setMessage('');
                setCheckVote("");
            }
            else setCheckVote("Vui lòng bình chọn số sao cho sản phẩm và nhập bình luận của bạn!")
        }
        else setCheckVote("Vui lòng bình chọn số sao cho sản phẩm và nhập bình luận của bạn!")
    }
    if (loading) {
        return (
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
    }
    return (
        <div className="product-detail-page-container">
            <div className="product-detail-container">
                <div className="product-detail-left">
                    <div className="product-detail-image">
                        <img loading="lazy" src={itemDetail.ImgUrl} alt="" />
                    </div>
                    {itemDetail.KeyFeatures.length > 0 && <div className="product-detail-keyFeatures">Đặc điểm nổi bật</div>}
                    {itemDetail.KeyFeatures.substring(0, itemDetail.KeyFeatures.length - 1).split(".").map((it, index) => {
                        return (
                            <div key={index} className="product-detail-keyFeatures-item">
                                {it && <i className="fa-solid fa-circle-check"></i>}
                                <span>{it}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="product-detail-content">
                    <div className="product-detail-center">
                        <div className="product-detail-author">
                            <div className="product-detail-authentic">
                                <img src="https://salt.tikicdn.com/ts/upload/d7/56/04/b93b8c666e13f49971483596ef14800f.png" alt="" />
                            </div>
                            {itemDetail.Author && <span>Tác giả:
                                <span className="product-detail-name-author"> {itemDetail.Author}</span>
                            </span>}
                        </div>
                        <div className="product-detail-name">{itemDetail.ProductName}</div>
                        <div className="product-detail-sold">
                            <span className="avg-star-item-header">{
                                isNaN((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1))
                                    ? (0) : ((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1))}</span>
                            <div className="product-detail-sold-start">
                                {
                                    isNaN((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1)) ? (
                                        <i className="fa-solid fa-star"></i>

                                    ) : (
                                        new Array(Math.ceil(evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0))).fill(null).map((idd, iddd) => {
                                            return (
                                                <i key={iddd} className="fa-solid fa-star"></i>
                                            )
                                        })
                                    )
                                }
                            </div>
                            <span className="evaluate-item-header">({evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)})</span>
                            <span className="sold-item-header">Đã bán {itemDetail.Sold > 5000 ? ("5000+") : (itemDetail.Sold)}</span>
                        </div>
                        <div className="product-detail-price">
                            <span>{itemDetail.Price.replace(".00", "").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                            <span className="product-detail-price-currency">₫</span>
                        </div>
                    </div>
                    <div className="product-detail-right">
                        <div className="product-detail-quantity">Số lượng</div>
                        <div className="count-buy">
                            {countProduct === 1 ? (
                                <button className="decrease-count" disabled>-</button>
                            ) : (
                                <button className="decrease-count" onClick={e => setCountProduct(prev => prev - 1)}>-</button>
                            )}
                            <input type="number" className="config-count-product" value={countProduct} onChange={e => setCountProduct(e.target.value)} />
                            <button className="increase-count" onClick={e => setCountProduct(prev => prev + 1)}>+</button>
                        </div>
                        <div className="product-detail-subtotal-title">Tạm tính</div>
                        <div className="product-detail-subtotal">
                            {Number(subTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫
                        </div>
                        <button className="add-to-cart-btn" onClick={handleClickAddToCart}>Thêm vào giỏ</button>
                    </div>
                </div>
                <div className="product-detail-back-homepage" onClick={e => navigate("/homepage")}>
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                    <span>Quay trở lại shop</span>
                </div>
                <div className="evaluate-customer-container">
                    <div className="evaluate-customer-title">Khách hàng đánh giá</div>
                    <div className="evaluate-customer-overview">Tổng quan</div>
                    <div className="star-avg-container">
                        <div className="star-avg-score">{
                            isNaN((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1))
                                ? (0) : ((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1))}</div>
                        <div className="star-avg-icon">
                            {
                                isNaN((evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)).toFixed(1)) ? (
                                    <></>

                                ) : (
                                    new Array(Math.ceil(evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count) * currentValue.StarVote, 0) / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0))).fill(null).map((idd, iddd) => {
                                        return (
                                            <i key={iddd} className="fa-solid fa-star"></i>
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                    <div className="evaluate-total">({evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0)} đánh giá)</div>
                    <div className="statistical-one-star">
                        <div className="statistical-one-star-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                        </div>
                        <div className="one-evaluate-percent-container">
                            <div className="one-evaluate-percent-real" style={{
                                width: `calc(${evaluate[0].count / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0) * 100}%)`,
                            }}></div>
                        </div>
                        <div className="one-evaluate-number">{evaluate[0].count}</div>
                    </div>
                    <div className="statistical-two-star">
                        <div className="statistical-two-star-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                        </div>
                        <div className="two-evaluate-percent-container">
                            <div className="two-evaluate-percent-real" style={{
                                width: `calc(${evaluate[1].count / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0) * 100}%)`,
                            }}></div>
                        </div>
                        <div className="two-evaluate-number">{evaluate[1].count}</div>
                    </div>
                    <div className="statistical-three-star">
                        <div className="statistical-three-star-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                        </div>
                        <div className="three-evaluate-percent-container">
                            <div className="three-evaluate-percent-real" style={{
                                width: `calc(${evaluate[2].count / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0) * 100}%)`,
                            }}></div>
                        </div>
                        <div className="three-evaluate-number">{evaluate[2].count}</div>
                    </div>
                    <div className="statistical-four-star">
                        <div className="statistical-four-star-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star gray-star"></i>
                        </div>
                        <div className="four-evaluate-percent-container">
                            <div className="four-evaluate-percent-real" style={{
                                width: `calc(${evaluate[3].count / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0) * 100}%)`,
                            }}></div>
                        </div>
                        <div className="four-evaluate-number">{evaluate[3].count}</div>
                    </div>
                    <div className="statistical-five-star">
                        <div className="statistical-five-star-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="five-evaluate-percent-container">
                            <div className="five-evaluate-percent-real" style={{
                                width: `calc(${evaluate[4].count / evaluate.reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0) * 100}%)`,
                            }}></div>
                        </div>
                        <div className="five-evaluate-number">{evaluate[4].count}</div>
                    </div>
                </div>
                <div className="comments-container">
                    <div className="comments-title">Bình luận ({mess.length})</div>
                    {mess.map((item, index) => {
                        return (
                            <div key={index} className="comment-item">
                                <div className="comment-user">
                                    <i className="fa-solid fa-circle-user"></i>
                                </div>
                                <div className="comment-detail">
                                    <div className="comment-detail-username-postdate">
                                        <div className="comment-detail-username">{item.Username}</div>
                                        <div className="container-star-user">
                                            {(new Array(item.StarVote).fill(null).map((x, y) => {
                                                return (
                                                    <i key={y} className="fa-solid fa-star"></i>
                                                )
                                            }))}
                                        </div>
                                        <div className="comment-detail-postdate">
                                            <i className="fa-regular fa-clock"></i>
                                            <span>{item.PostDate}</span>
                                        </div>
                                    </div>
                                    <p className="comment-detail-content">{item.Content}</p>
                                </div>
                            </div>
                        )
                    })}
                    <textarea className="write-comment" value={message} onChange={e => setMessage(e.target.value)} spellCheck="false" autoComplete="off" placeholder="Viết bình luận"></textarea>
                    <p className="choose-star-title">
                        Bình chọn số sao: <span>{checkVote}</span>
                    </p>
                    <div className="container-vote">
                        <label htmlFor="choose-star-one"><span>1 </span><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="choose-star-one" className="choose-star-content" name="star_rate" value="1" required />
                    </div>
                    <div className="container-vote">
                        <label htmlFor="choose-star-two"><span>2 </span> <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="choose-star-two" className="choose-star-content" name="star_rate" value="2" required />
                    </div>
                    <div className="container-vote">
                        <label htmlFor="choose-star-three"><span>3 </span> <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="choose-star-three" className="choose-star-content" name="star_rate" value="3" required />
                    </div>
                    <div className="container-vote">
                        <label htmlFor="choose-star-four"><span>4 </span> <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="choose-star-four" className="choose-star-content" name="star_rate" value="4" required />
                    </div>
                    <div className="container-vote">
                        <label htmlFor="choose-star-five"><span>5 </span> <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></label>
                        <input type="radio" id="choose-star-five" className="choose-star-content" name="star_rate" value="5" required />
                    </div>
                    <button className="send-comment" onClick={handleSendComment}>Gửi</button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;