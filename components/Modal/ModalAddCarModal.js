import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Form, Input, Select, InputNumber } from "antd";
import { createCarModel } from "pages/api/carModel";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";

const ModalAddCarModel = ({ brand ,show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([
    "Toyota",
    "VinFast",
    "Nissan",
    "Suzuki",
    "Subaru",
    "Lexus",
    "Audi",
    "Volkswagen",
    "Honda",
    "Volvo",
    "Hyundai",
    "Mazda",
    "KIA",
    "Mitsubishi",
    "Maserati",
    "Chevrolet",
    "Ford",
    "Mercedes-Benz",
    "BMW",
  ]);
  const onFinish = async (values) => {
    try {
      const res = await createCarModel(values);
      openNotification("Tạo mẫu xe thành công thành công!", "");
      handleCancel();
      onSuccess(res.data.Data);
      form.resetFields();
    } catch (error) {
      if (error?.response?.data?.message[0]) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại","Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };
  console.log(brand);


  useEffect(() => {
    if (brand) {
     form.setFieldsValue({ brand: brand });
    }
  }, [brand]);

  return (
    <>
      <Modal
        title="Thêm mẫu xe mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Model"
                name="model"
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
                label="Thương hiệu"
                name="brand"
                initialValue={brand}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {brands.map((brand) => (
                    <Option key={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số nghế ngồi"
                name="seats"
                initialValue={4}
              >
                <InputNumber min={1} max={16} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Năm sản xuất"
                name="year"
                
              >
                <InputNumber min={1900} max={moment().year()} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Đông cơ"
                name="engine"
                
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Truyền động"
                name="transmission"
               
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Nhiên liệu"
                name="fuel"
               initialValue={"Xăng"}
              >
                <Select
                  showSearch
                  placeholder="Chọn nhiên liệu"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  <Option value="Xăng">Xăng</Option>
                  <Option value="Dầu">Dầu</Option>
                  <Option value="Điện">Điện</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCarModel;
