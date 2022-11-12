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
  Popconfirm,
  Cascader,
} from "antd";
import { useRouter } from "next/router";
import { openNotification, openNotificationWarning } from "utils/notification";
import { updateUserById, uploadImagesUser } from "pages/api/userAPI";
import { getCustomerByCode, updateCustomer } from "pages/api/customerAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import moment from "moment";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import {
  CarOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Loading from "components/Loading";
import JsonData from "data/address-vn.json";
import DrawerCar from "components/Drawer/DrawerCar";

const formatDate = "DD/MM/YYYY";

function CustomerDetail({ customerId, onUpdateCustomer }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [customerDetail, setCustomerDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [addressData, setAddressData] = useState(JsonData);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [imageS3, setImageS3] = useState(null);
  const [loading, setLoading] = useState(false);

  const [provinceSelected, setProvinceSelected] = useState("");
  const [districtSelected, setDistrictSelected] = useState("");
  const [wardSelected, setWardSelected] = useState("");
  const [provinceSelectedCode, setProvinceSelectedCode] = useState("");
  const [districtSelectedCode, setDistrictSelectedCode] = useState("");
  const [wardSelectedCode, setWardSelectedCode] = useState("");

  const [carDrawer, setCarDrawer] = useState(false);

  const fetchcustomerDetail = async () => {
    setLoading(true);
    try {
      const response = await getCustomerByCode(customerId);
      setCustomerDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        customerCode: response.data.Data.customerCode,
        phoneNumber: response.data.Data.phoneNumber,
        email: response.data.Data.email,
        gender: response.data.Data.gender,
        nationality: response.data.Data.nationality,
        identityNumber: response.data.Data.identityNumber,
        statusName: response.data.Data.statusName,
        dateOfBirth: moment(moment(response.data.Data.dateOfBirth), formatDate),
        address: response.data.Data.address,
        addressvn: [
          response.data.Data.provinceCode,
          response.data.Data.districtCode,
          response.data.Data.wardCode,
        ],
        image: response.data.Data.image,
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchcustomerDetail();
    }
  }, [customerId]);

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    if (selectedOptions) {
      setProvinceSelected(selectedOptions[0]?.label);
      setDistrictSelected(selectedOptions[1]?.label);
      setWardSelected(selectedOptions[2]?.label);
      setProvinceSelectedCode(selectedOptions[0]?.value);
      setDistrictSelectedCode(selectedOptions[1]?.value);
      setWardSelectedCode(selectedOptions[2]?.value);
    }
  };
  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );

  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        email: values.email,
        address: values.address,
        district: districtSelected,
        province: provinceSelected,
        ward: wardSelected,
        districtCode: districtSelectedCode,
        provinceCode: provinceSelectedCode,
        wardCode: wardSelectedCode,
        status: values.status,
        // image: imageS3 || customerDetail?.image,
        dateOfBirth: values.dateOfBirth,
        phoneNumber: values.phoneNumber,
        identityNumber: values.identityNumber,
        gender: values.gender,
        nationality: values.nationality,
      };
      const res = await updateCustomer(customerDetail.id, body);
      setCustomerDetail(res.data.Data);
      openNotification("Cập nhật khách hàng thành công!", "");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
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
  const handleUpdateImage = async (imageUpload) => {
    let body = {
      image: imageUpload
    };
    try {
      const res = await updateCustomer(customerDetail.id,body);
      openNotification("Thành công!", "Cập nhật ảnh đại diện thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  }

  const handleUploadImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });
      const response = await uploadImagesUser(formData);
      setImageS3(response.data.Data[0]);
      setCustomerDetail((prevState) => {
        return { ...prevState, image: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      handleUpdateImage(response.data.Data[0]);
      openNotification("Thành công", "Tải ảnh lên thành công");
      setModalUpload(false);
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <br />
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Image width={300} height={250} src={customerDetail.image} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Upload
              onChange={(info) => handleFileChosen(info)}
             
              showUploadList={false}
              fileList={listFiles.imageBlob}
              maxCount={1}
              listType="picture"
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
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
            <Row gutter={[32]}>
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
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Mã khách hàng"
                  name="customerCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Xe Khách hàng">
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    icon={<CarOutlined />}
                    onClick={() => {
                      setCarDrawer(true);
                    }}
                  >
                    Xem xe
                  </Button>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ngày sinh" name="dateOfBirth">
                  <DatePicker
                    disabledDate={(d) => !d || d.isSameOrAfter(moment())}
                    format={formatDate}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Nhóm khách hàng" name="statusName">
                  <Select>
                    <Select.Option value="0">Thông thường</Select.Option>
                    <Select.Option value="2">Thân thiết</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Giới tính" name="gender">
                  <Select>
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Quốc tịch" name="nationality">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                      required: true,
                      message:
                        "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                    },
                  ]}
                >
                  <Input
                    minLength={10}
                    maxLength={10}
                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                    placeholder="số điện thoại"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp("[0-9]{12}"),
                      message:
                        "Số CMND/CCCD không hợp lệ!, Số CMND/CCCD bao gồm 12 ký tự số",
                    },
                  ]}
                  name="identityNumber"
                  label="Số CMND"
                >
                  <Input maxLength={12} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  rules={[
                    {
                      pattern: new RegExp(
                        "^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$"
                      ),
                      message: "Email không hợp lệ!",
                    },
                  ]}
                  name="email"
                  label="Email"
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="addressvn"
                  label="Tỉnh/Thành phố - Quận - Huyện"
                >
                  <Cascader
                    options={addressData}
                    onChange={onChange}
                    placeholder="Tỉnh/Thành phố - Quận - Huyện"
                    showSearch={{
                      filter,
                    }}
                    onSearch={(value) => console.log(value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Địa chỉ chi tiết" name="address">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div style={{ marginRight: "20px" }}>
                  <Button
                    onClick={() => {
                      fetchcustomerDetail();
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
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <DrawerCar
        show={carDrawer}
        handleCancel={() => setCarDrawer(false)}
        id={customerDetail?.id}
      />
      <Loading loading={loading} />
    </>
  );
}

export default CustomerDetail;
