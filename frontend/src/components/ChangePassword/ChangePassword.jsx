import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./changepassword.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
const ChangePassword = () => {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkLoggedInChangePassword() {
            const res = await axios({
                url: "/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInChangePassword().then(res => {
            if (res.data.message_logged_in === "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ") {
                navigate("/sign-in");
            }
        })
            .catch(err => console.log(err))

    }, [navigate]);
    const formik = useFormik({
        initialValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            current_password: Yup.string().required("Bắt buộc"),
            new_password: Yup.string().required("Bắt buộc").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/, "Mật khẩu phải có độ dài từ 7-19 ký tự, có ít nhất một ký tự thường, một ký tự số và một ký tự đặc biệt"),
            confirm_password: Yup.string().required("Bắt buộc").oneOf([Yup.ref("new_password"), null], "Mật khẩu không khớp"),
        }),
        onSubmit: (values) => {
            async function handleChangePassword() {
                const res = await axios({
                    url: "/api/auth/v1/change-password",
                    method: "POST",
                    withCredentials: true,
                    data: {
                        username: localStorage.username,
                        ...values
                    }
                })
                return res;
            }
            handleChangePassword().then(res => {
                alert(res.data.data);
                if (res.data.data === "Thay đổi mật khẩu thành công") navigate("/homepage");
            })
                .catch(err => console.log(err));
        }
    });
    return (
        <div className="change-password-page-container">
            <form className="change-password-form" onSubmit={formik.handleSubmit}>
                <div className="change-password-title">Thay đổi mật khẩu</div>
                <div className="current-password-container">
                    <label htmlFor="current-password">Mật khẩu hiện tại</label>
                    <input type="password" id="current_password" className="current_password" spellCheck="false" autoComplete="off" placeholder="Nhập mật khẩu hiện tại" onChange={formik.handleChange} value={formik.values.current_password} />
                    {formik.errors.current_password && <p className="current-password-err">{formik.errors.current_password}</p>}
                </div>
                <div className="new-password-container">
                    <label htmlFor="new-password">Mật khẩu mới</label>
                    <input type="password" id="new_password" className="new_password" value={formik.values.new_password} onChange={formik.handleChange} autoComplete="off" spellCheck="false" placeholder="Nhập mật khẩu mới" />
                    {formik.errors.new_password && <p className="new-password-err">{formik.errors.new_password}</p>}
                </div>
                <div className="confirm-password-container">
                    <label htmlFor="confirm-new-password">Xác nhận lại mật khẩu mới</label>
                    <input type="password" id="confirm_password" className="confirm_password" value={formik.values.confirm_password} onChange={formik.handleChange} autoComplete="off" spellCheck="false" placeholder="Xác nhận lại mật khẩu mới" />
                    {formik.errors.confirm_password && <p className="confirm-password-err">{formik.errors.confirm_password}</p>}
                </div>
                <button type="submit" className="change-password-btn">Thay đổi</button>
                <i className="fa-solid fa-rotate-left" onClick={e => navigate("/homepage")}></i>
            </form>
        </div>
    );
}

export default ChangePassword;