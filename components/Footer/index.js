import React from "react";
// import "./style.scss";
import { Col, Divider, Row, Space } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
  GithubOutlined,
} from "@ant-design/icons";
import Link  from "next/link";

import logo from "public/images/logo.jpg";

export default function Footer() {

  return (
    <div className="footer">
      <Divider style={{ marginTop: "0px" }} />
      <Row gutter={[0, 16]}>
        <Col xl={{ span: 10 }} xs={{ span: 24 }} sm={{ span: 24 }}>
          <div className="footer_left">
            <Link href="/">
              <div className="footer_left-logo-page">
                <img src={logo} alt="LV-OTO" />
              </div>
            </Link>

            <div className="footer_left-intro">
              Website quản lý trung tâm chăm sóc xe
            </div>

            <div className="footer_left-contact">
              <a href="#" className="footer_left-contact--logo-branch">
                <FacebookFilled />
              </a>
              <a href="#" className="footer_left-contact--logo-branch">
                <TwitterSquareFilled />
              </a>
              <a href="#" className="footer_left-contact--logo-branch">
                <InstagramFilled />
              </a>
            </div>
          </div>
        </Col>

        <Col xl={{ span: 14 }} xs={{ span: 24 }} sm={{ span: 24 }}>
          <div className="footer_right">
            <Row gutter={[8, 8]}>
              <Col xl={{ span: 8 }} xs={{ span: 24 }} sm={{ span: 8 }}>
                <ul className="footer_right-title">
                  <span>Hỗ trợ</span>

                  <li className="footer_right-list">
                    <Link href="/usermanual">Hướng dẫn sử dụng</Link>
                  </li>
                  <li className="footer_right-list">
                    <Link href="/">Cộng đồng</Link>
                  </li>
                  <li className="footer_right-list">
                    <Link href="/">Báo cáo lạm dụng</Link>
                  </li>
                </ul>
              </Col>
              <Col xl={{ span: 8 }} xs={{ span: 24 }} sm={{ span: 8 }}>
                <ul className="footer_right-title">
                  <span>Khám phá</span>

                  <li className="footer_right-list">
                    <Link href="/">Trang chủ</Link>
                  </li>
                  <li className="footer_right-list">
                    <Link href="/exams">Thuê xe</Link>
                  </li>
                  <li className="footer_right-list">
                    <Link href="/translate">Cho thuê xe</Link>
                  </li>
                </ul>
              </Col>
              <Col xl={{ span: 8 }} xs={{ span: 24 }} sm={{ span: 8 }}>
                <ul className="footer_right-title">
                  <span>Creators</span>
                  <li className="footer_right-list">
                    <a href="https://github.com/s2taaa" target="_blank">
                      <GithubOutlined /> Tran Pham Gia Long
                    </a>
                  </li>
                  <li className="footer_right-list">
                    <a
                      href="https://github.com/VanVuong-Github"
                      target="_blank"
                    >
                      <GithubOutlined /> Lai Van Vuong{" "}
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col span={24}>
                <div className="footer_right-copyright">
                  © Copyright by VLOTO, 2022
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

;
