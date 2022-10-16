import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Timeline,
  Divider,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getAllExecuteOrder } from "pages/api/orderAPI";
import moment from "moment";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalAddOrder from "components/Modal/ModalAddOrder";
import { openNotification } from "utils/notification";

import { OrderNotRequestDetail } from "../OrderNotRequestDetail";
const { Title } = Typography;

function OrderNotRequestTable({}) {
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { orderId } = router.query;
  const [loading, setLoading] = useState(false);

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchGlobal(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = () => {
    setSearchText("");
    setSearchGlobal("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onSearch={(value) => setSearchText(value)}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              handleReset();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSuccessCreateOrder = async () => {
    handleGetorders();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 70,
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Mã",
      dataIndex: "orderCode",
      key: "orderCode",

      render: (orderCode) => <a style={{ color: "blue" }}>{orderCode}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.orderCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.carLicensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.totalEstimateTime)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    // {
    //   title: "Dịch vụ",
    //   dataIndex: "services",
    //   key: "services",
    // },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("statusName"),
    },
    {
      title: "Biên số",
      dataIndex: "carLicensePlate",
      key: "carLicensePlate",
      ...getColumnSearchProps("statusName"),
    },
    {
      title: "Thời gian xử lý",
      dataIndex: "totalEstimateTime",
      key: "totalEstimateTime",
      ...getColumnSearchProps("statusName"),
      render: (totalEstimateTime) => {
        return (
          <div>
            {totalEstimateTime} phút
          </div> 
        );
      }
    },

    {
      title: "Thời gian tạo",
      dataIndex: "createDate",
      key: "createDate",
      ...getColumnSearchProps("statusName"),
      render: (text, record, dataIndex) => {
        return <div>{moment(record.createDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      ...getColumnSearchProps("statusName"),
      render: (text, record, dataIndex) => {
        return (
          <div>
            <Tag color="green">{record.statusName}</Tag>
          </div>
        );
      },
    },
  ];

  const handleGetorders = async () => {
    setLoading(true);
    try {
      const res = await getAllExecuteOrder();
      if (res.status === 200) {
        setOrders(res.data.Data);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Lỗi", "Không thể lấy dữ liệu");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetorders();
  }, []);

  const columnService = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 70,
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian xử lí",
      dataIndex: "estimateTime",
      key: "estimateTime",
      render:(text,record,dataIndex)=>{
        return <div>{record.estimateTime} phút</div>
      }
    },
    {
      title: "Giá",
      dataIndex: "servicePrice",
      key: "servicePrice",
      render: (servicePrice) => {
        return (
          <>
            {servicePrice === null ? (
              <Tag color={"red"}>{"Chưa có giá"}</Tag>
            ) : (
              <div>{formatMoney(servicePrice.price)}</div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      {orderId ? (
        <OrderNotRequestDetail
          orderId={orderId}
          onUpdateOrders={handleGetorders}
        />
      ) : (
        <div>
          <Table
            rowKey="id"
            bordered
            title={() => (
              <>
                <Row>
                  <Col span={8} style={{ marginRight: "10px" }}>
                    <Input.Search
                      placeholder="Tìm kiếm khách hàng/xe/dịch vụ"
                      onChange={(e) => setSearchGlobal(e.target.value)}
                      onSearch={(value) => setSearchGlobal(value)}
                      value={searchGlobal}
                    />
                  </Col>
                  <Col span={4}>
                    <Button
                      onClick={() => setSearchGlobal("")}
                      icon={<ClearOutlined />}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={orders}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 450,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <Row gutter={4}>
                  <Col span={12}>
                    <Table
                      bordered
                      title={() => "Dịch vụ"}
                      dataSource={record.services}
                      columns={columnService}
                      pagination={false}
                    ></Table>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <Row gutter={32}>
                        <Col
                          style={{ borderRight: "solid LightGray 1px" }}
                          span={11}
                        >
                          <Title style={{ textAlign: "center" }} level={4}>
                            Khách hàng
                          </Title>
                          <Divider />
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>
                              Tên: {record?.customerName}
                            </Timeline.Item>
                            <Timeline.Item>
                              Số điện thoại: {record?.customerPhoneNumber}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                        <Col span={12}>
                          <Title style={{ textAlign: "center" }} level={4}>
                            Xe
                          </Title>
                          <Divider />
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>Xe: {record?.carName}</Timeline.Item>
                            <Timeline.Item>
                              Biển số: {record?.carLicensePlate}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?orderId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddOrder
        show={modalOrder}
        handleCancel={() => setModalOrder(false)}
        onSuccess={(data) => handleSuccessCreateOrder(data)}
      />

      <Loading loading={loading} />
    </>
  );
}

export default OrderNotRequestTable;
