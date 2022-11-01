import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  DatePicker,
  Upload,
  Layout,
  Tabs,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import { openNotification } from "utils/notification";
import {
  getUserByPhone,
  updateUserById,
  uploadImagesUser,
} from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import moment from "moment";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import { UploadOutlined } from "@ant-design/icons";
import Loading from "components/Loading";
const formatDate = "DD/MM/YYYY";
import MyHeader from "components/Header";
import { UserOutlined, LockOutlined, ClearOutlined } from "@ant-design/icons";
import ChangePassword from "components-customer/ChangePassword/index.js";
import Cookies from "js-cookie";
const{Footer}=Layout;

const UserProfile = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [userDetail, setUserDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [modalQuestion, setModalQuestion] = useState(false);
  const [imageS3, setImageS3] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await getUserByPhone();
      console.log("response:", response);
      setUserDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        phone: response.data.Data.phone,
        email: response.data.Data.email,
        birthDay: moment(moment(response.data.Data.birthDay), formatDate),
        address: response.data.Data.address,
        image: response.data.Data.image,
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      openNotification(error.message);
    }
  };




  useEffect(() => {
    fetchUserDetail();
  }, []);
  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        email: values.email,
        address: values.address,
        status: values.status,
        image: imageS3 || userDetail?.image,
        birthDay: values.birthDay,
      };

      const res = await updateUserById(body, userDetail?.id);
      setUserDetail(res.data.Data);
      openNotification("Thành công!", "Cập nhật người dùng thành công");
    } catch (error) {
      openNotification(error.response.data.message[0]);
    }
  };
  // handle upload image

  const handleFileChosen = (info) => {
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUploadImages = async () => {
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });
      const response = await uploadImage(formData);
      setImageS3(response.data.Data[0]);
      setUserDetail((prevState) => {
        return { ...prevState, image: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      openNotification(error.response.data.message[0]);
    }
  };

  return (
    <>
      <Layout>
        <MyHeader />
        <Layout.Content className="content">
          <Row className="content-white">
            <Col span={24}>
              <Button
                type="link"
                size="small"
                onClick={() => router.push("/admin")}
              >
                Trở lại
              </Button>
              <br />
              <br />
              <Tabs>
                <Tabs.items tab="Thông tin người dùng" key="1">
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <Image width={300} height={250} src={userDetail.image} />
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Upload
                          onChange={(info) => handleFileChosen(info)}
                          multiple
                          showUploadList={false}
                          fileList={listFiles.imageBlob}
                        >
                          <Button icon={<UploadOutlined />}>
                            Thay đổi ảnh đại diện
                          </Button>
                        </Upload>
                      </div>
                    </Col>
                    <Col span={18}>
                      <Form
                        form={form}
                        layout="vertical"
                        autoComplete="off"
                        validateMessages={validateMessages}
                      >
                        <Row gutter={[32, 32]}>
                          <Col span={12}>
                            <Form.Item
                              label="Tên"
                              name="name"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              label="Ngày sinh"
                              name="birthDay"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <DatePicker format={formatDate} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              label="Trạng thái"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                              name="status"
                            >
                              <Select>
                                <Select.Option value="ACTIVE">
                                  Hoạt động
                                </Select.Option>
                                <Select.Option value="INACTIVE">
                                  Không hoạt động
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Email"
                              name="email"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Số điện thoại"
                              name="phone"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Input disabled="true" />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              label="Địa chỉ"
                              name="address"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <TextArea rows={4} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row className="PullRight">
                          <div
                            style={{
                              bottom: "0",
                              right: "20px",
                              margin: "10px",
                            }}
                            className="service-action"
                          >
                            <div style={{ marginRight: "20px" }}>
                              <Button
                                onClick={() => {
                                  fetchUserDetail();
                                }}
                              >
                                Đặt lại
                              </Button>
                            </div>
                            <div>
                              <Popconfirm
                                title="Xác nhận?"
                                placement="topLeft"
                                okText="Đồng ý"
                                cancelText="Hủy"
                                onConfirm={() => {
                                  form
                                    .validateFields()
                                    .then((values) => {
                                      onFinish(values);
                                    })
                                    .catch((info) => {
                                      console.log("Validate Failed:", info);
                                    });
                                }}
                              >
                                <Button type="primary">Cập nhật</Button>
                              </Popconfirm>
                            </div>
                          </div>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </Tabs.items>
                <Tabs.items tab="Thay đổi mật khẩu" key="2">
                  <ChangePassword/>
                  </Tabs.items>
              </Tabs>
            </Col>
          </Row>
        </Layout.Content>
        <Footer style={{ backgroundColor: "white", textAlign: "center" }}>
            <Row justify="center">©2022 Coppy right by VL-CARCARE</Row>
          </Footer>
      </Layout>

      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <Loading loading={loading} />
    </>
  );
};

export default UserProfile;