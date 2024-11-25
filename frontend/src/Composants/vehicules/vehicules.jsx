import React, { useState, useEffect } from 'react';
import { Form, Input, Table, Row, Col, Skeleton, Modal, Select, notification } from 'antd';
import { motion } from 'framer-motion';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import "../../assets/css/Vehicules.css";
import * as XLSX from 'xlsx';
import excel from "../../assets/images/excel.ico";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const GET_VEHICLES_AND_DRIVERS = gql`
  query GetVehiclesAndDrivers {
    vehicles {
      id_vehicles
      licence_plate
      mark
      modele
      year
      color
      owner_id 
    }
  }
`;

const ADD_VEHICLE = gql`
  mutation CreateVehicle(
   $id_vehicles: String!, 
   $licence_plate: String!, 
   $mark: String!, 
   $modele: String!, 
   $year: String!, 
   $color: String!, 
   $owner_id: String!
 ) {
   createVehicle(
     id_vehicles: $id_vehicles, 
     licence_plate: $licence_plate, 
     mark: $mark, 
     modele: $modele, 
     year: $year, 
     color: $color, 
     owner_id: $owner_id
   ) {
     id_vehicles
     licence_plate
     mark
     modele
     year
     color
     owner_id 
   }
 }
`;

const UPDATE_VEHICLE = gql`
 mutation UpdateVehicle($id_vehicles: String!, $licence_plate: String!, $mark: String!, $modele: String!, $year: String!, $color: String!, $owner_id: String!) {
  updateVehicle(id_vehicles: $id_vehicles, licence_plate: $licence_plate, mark: $mark, modele: $modele, year: $year, color: $color, owner_id: $owner_id) {
    id_vehicles
    licence_plate
    mark
    modele
    year
    color
    owner_id 
  }
}
`;

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id_vehicles: String!) {
    deleteVehicle(id_vehicles: $id_vehicles) {
      id_vehicles
    }
  }
`;

const GET_DRIVERS = gql`
  query GetDrivers {
    drivers {
      id_driver
      driver_name
    }
  }
`;
const {Search} = Input;
const Vehicules = () => {
  const [form] = Form.useForm();
  const { loading, error, data, refetch } = useQuery(GET_VEHICLES_AND_DRIVERS);
  const { loading: driversLoading, error: driversError, data: driversData } = useQuery(GET_DRIVERS);
  const [driversMap, setDriversMap] = useState({});
  const [searchText, setSearchText] = useState('');
  const {t} = useTranslation();

  const handleSearch = (value) => {
    setSearchText(value);
  };

  useEffect(() => {
    if (data && data.drivers) {
      const map = data.drivers.reduce((acc, driver) => {
        acc[driver.id_driver] = driver.driver_name;
        return acc;
      }, {});
      setDriversMap(map);
    }
  }, [data]);

  const [createVehicle] = useMutation(ADD_VEHICLE, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('vehicule.succès_ajout'), t('vehicule.succès_ajout'), 'OK');
      refetch();
      setIsModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('vehicule.erreur_ajout'), `${t('vehicule.erreur_ajout')}: ${err.message}`, 'OK');
    }
  });
  
  const [updateVehicle] = useMutation(UPDATE_VEHICLE, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('vehicule.succès_mise_a_jour'), t('vehicule.succès_mise_a_jour'), 'OK');
      refetch();
      setIsModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('vehicule.erreur_mise_a_jour'), `${t('vehicule.erreur_mise_a_jour')}: ${err.message}`, 'OK');
    }
  });
  
  const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('vehicule.succès_suppression'), t('agents.succès_suppression'), 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('vehicule.erreur_suppression'), `${t('vehicule.erreur_suppression')}: ${err.message}`, 'OK');
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddVehicle = () => {
    form.validateFields().then(values => {
      const { owner_id } = values;
      if (!owner_id) {
        notification.error('Erreur', 'Le propriétaire ou le conducteur doit être sélectionné', 'OK');
        return;
      }
  
      Loading.hourglass(t('vehicule.ajout_en_cours '));
      createVehicle({
        variables: { 
          id_vehicles: values.id_vehicles,
          licence_plate: values.licence_plate,
          mark: values.mark,
          modele: values.modele,
          year: values.year,
          color: values.color,
          owner_id: owner_id 
        }
      });
      form.resetFields();
    }).catch(error => {
      console.log('Validation en échec :', error);
    });
  };
  
  const handleEditVehicle = (vehicle) => {
    setIsEditing(true);
    setCurrentVehicle(vehicle);
    form.setFieldsValue(vehicle);
    setIsModalVisible(true);
  };

  const handleUpdateVehicle = () => {
    form.validateFields().then(values => {
      const { owner_id } = values;
      if (!owner_id) {
        notification.error('Erreur', 'Le propriétaire ou le conducteur doit être sélectionné', 'OK');
        return;
      }
  
      Loading.hourglass(t('vehicule.mise_a_jour_en_cours'));
      updateVehicle({
        variables: { 
          id_vehicles: values.id_vehicles,
          licence_plate: values.licence_plate,
          mark: values.mark,
          modele: values.modele,
          year: values.year,
          color: values.color,
          owner_id: owner_id 
        }
      });
    }).catch(info => {
      console.log('Validation échouée:', info);
    });
  };

  const handleDeleteVehicle = (id_vehicles) => {
    Loading.hourglass(t('vehicule.suppression_en_cours'));
    deleteVehicle({ variables: { id_vehicles } });
  };
  
  if (loading || driversLoading) {
    Loading.hourglass(t('vehicule.chargement'));
    return null;
  } else {
    Loading.remove();
  }

  if (error || driversError) {
    Report.failure(t('vehicule.erreur_chargement'), t('vehicule.erreur_chargement'), 'OK');
    return null;
  }
  
  const drivers = driversData?.drivers || [];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.vehicles);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Véhicules');
    XLSX.writeFile(wb, 'Listes_des_derniers_véhicules.xlsx');
  };

  const columns = [
    {
      title: t('vehicule.id'),
      dataIndex: 'id_vehicles',
      key: 'id_vehicles',
      sorter: (a, b) => a.id_vehicles - b.id_vehicles, 
      sortDirections: ['ascend', 'descend'],
    },
    {
      title:  t('vehicule.immatriculation'),
      dataIndex: 'licence_plate',
      key: 'licence_plate',
    },
    {
      title:  t('vehicule.marque'),
      dataIndex: 'mark',
      key: 'mark',
    },
    {
      title:  t('vehicule.modele'),
      dataIndex: 'modele',
      key: 'modele',
    },
    {
      title:  t('vehicule.annee'),
      dataIndex: 'year',
      key: 'year',
    },
    {
      title:  t('vehicule.couleur'),
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div style={{
          width: '50px',
          height: '20px',
          backgroundColor: color,
          borderRadius: '4px',
        }} />
      ),
    },
    {
      title:  t('vehicule.conducteur'),
      dataIndex: 'owner_id',
      key: 'owner_id',
      render: (owner) => {
        if (!owner) {
          return <span style={{ color: 'red', marginLeft: '35px' }}>Non défini</span>;
        }
        return (
          <span style={{ color: 'blue' }}>{t('vehicule.num_conduct')} {owner}</span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <EditTwoTone onClick={() => handleEditVehicle(record)} style={{ marginRight: 16 }} />
          <DeleteTwoTone onClick={() => handleDeleteVehicle(record.id_vehicles)} />
        </span>
      ),
    },
  ];
  const filteredData = searchText
  ? data?.vehicles?.filter(item =>
      item.licence_plate.toLowerCase().includes(searchText.toLowerCase()) ||
      item.mark.toLowerCase().includes(searchText) || 
      item.modele.toLowerCase().includes(searchText.toLowerCase()) ||
      item.year.toString().includes(searchText.toLowerCase()) ||
      item.color.toLowerCase().includes(searchText.toLowerCase()) || 
      item.owner_id.toLowerCase().includes(searchText.toLowerCase()) 
    ) || []
  : data?.vehicles || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <Search
        placeholder="Rechercher ..."
        onSearch={handleSearch}
        style={{ marginBottom: 10 ,marginRight : 10 , width : 400 }}
      />
      <div className="tooltip">
        <img onClick={exportToExcel} src={excel} style={{ margin: 0, marginBottom: 10 }} />
        <span className="tooltiptext">Exporter en excel</span>
      </div>
      <button className='custom-button' onClick={() => { setIsEditing(false); setCurrentVehicle(null); setIsModalVisible(true); }}>
        {t('vehicule.ajouter')}
      </button>
      <Row gutter={32}>
        <Col span={24}>
        {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          dataSource={filteredData.length > 0 ? filteredData : []}
          columns={columns}
          rowKey="id_vehicles"
          pagination={{ pageSize: 5 }}
        />
      )}
        </Col>
      </Row>
      <Modal
        title={isEditing ? t('vehicule.mettre_a_jour') : t('vehicule.soumettre')}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <button key="submit" className='submit-button' onClick={isEditing ? handleUpdateVehicle : handleAddVehicle}>
            {isEditing ? t('vehicule.mettre_a_jour') : t('vehicule.soumettre')}
          </button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={isEditing ? currentVehicle : {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_vehicles"
                label="ID Véhicule"
                rules={[{ required: true, message: 'ID du véhicule requis' }]}
              >
                <Input disabled={isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="licence_plate"
                label="Plaque d'immatriculation"
                rules={[{ required: true, message: 'Plaque d\'immatriculation requise' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mark"
                label="Marque"
                rules={[{ required: true, message: 'Marque requise' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="modele"
                label="Modèle"
                rules={[{ required: true, message: 'Modèle requis' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="year"
                label="Année"
                rules={[{ required: true, message: 'Année requise' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Couleur"
                rules={[{ required: true, message: 'Couleur requise' }]}
              >
                <Input type='color' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="owner_id"
                label="Propriétaire"
                rules={[{ required: false, message: 'Propriétaire requis' }]}
              >
                <Select>
                  {drivers.map(driver => (
                    <Option key={driver.id_driver} value={driver.id_driver}>
                      {driver.driver_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Vehicules;
