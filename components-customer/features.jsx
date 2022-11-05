import { useState } from "react";
import Cookies from "js-cookie";
import { Row, Col, Card, Typography } from "antd";
import Image from "next/image";
import feature_1 from "public/images/user-default.png";
import feature_2 from "public/images/16.svg";
import feature_3 from "public/images/17.svg";
import feature_4 from "public/images/18.svg";
import { useRouter } from "next/router";
export const Features = (props) => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));

  return (
    <div id="features" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Tiện ích</h2>
        </div>
        <Row gutter={20}>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={6}
            xl={6}
            onClick={() => {
              accessToken
                ? router.push(`/customer/order`)
                : router.push("/login");
            }}
          >
            <Card
              style={{
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                height: "270px",
                transition: "all 0.3s ease",
              }}
              hoverable
              cover={
                <Image
                  width={270}
                  height={270}
                  src={feature_4}
                  alt="feature_1"
                />
              }
            />

            <Typography.Title level={3}>
              Xem trạng thái dịch vụ đang sử dụng
            </Typography.Title>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={12}
            lg={6}
            xl={6}
            onClick={() => {
              accessToken
                ? router.push(`/customer/order`)
                : router.push("/login");
            }}
          >
            <Card
              style={{
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                height: "270px",
                transition: "all 0.3s ease",
              }}
              hoverable
              cover={
                <Image
                  width={270}
                  height={270}
                  src={feature_3}
                  alt="feature_1"
                />
              }
            />

            <Typography.Title level={3}>Đơn hàng của bạn</Typography.Title>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={6}
            xl={6}
            onClick={() => {
              accessToken
                ? router.push(`/customer/bill`)
                : router.push("/login");
            }}
          >
            {" "}
            <Card
              style={{
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                height: "270px",
                transition: "all 0.3s ease",
              }}
              hoverable
              cover={
                <Image
                  width={270}
                  height={270}
                  src={feature_2}
                  alt="feature_1"
                />
              }
            ></Card>
            <Typography.Title level={3}>Hóa đơn của bạn </Typography.Title>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={6}
            xl={6}
            onClick={() => {
              accessToken
                ? router.push(`/customer/profile`)
                : router.push("/login");
            }}
          >
            <Card
              style={{
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                height: "270px",
                transition: "all 0.3s ease",
              }}
              hoverable
              cover={
                <Image
                  width={270}
                  height={270}
                  src={feature_1}
                  alt="feature_1"
                />
              }
            />

            <Typography.Title level={3}>Thông tin của bạn</Typography.Title>
          </Col>
        </Row>
      </div>
    </div>
  );
};
