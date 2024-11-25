import React, { useState } from 'react';
import { Form, Input, Table, Row, Col, Skeleton, Modal, Select, Image, Popconfirm } from 'antd';
import { motion } from 'framer-motion';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditTwoTone, DeleteTwoTone, QuestionCircleTwoTone } from '@ant-design/icons';
import "../../assets/css/Conducteur.css";
import male from "../../assets/images/man.ico";
import female from "../../assets/images/woman.ico";
import * as XLSX from 'xlsx'; // Importer xlsx;
import excel from "../../assets/images/excel.ico";
import CameraScanner from '../CameraScanner';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const GET_CONDUCTORS = gql`
  query GetConductors {
    drivers {
      id_driver
      licence_number
      driver_name
      sex
      age
      address
      phone
     
    }
  }
`;

const ADD_CONDUCTOR = gql`
  mutation CreateDriver($id_driver: String!, $licence_number: String!, $driver_name: String!, $sex: String!, $age: Int!, $address: String!, $phone: String!) {
    createDriver(id_driver: $id_driver, licence_number: $licence_number, driver_name: $driver_name, sex: $sex, age: $age, address: $address, phone: $phone) {
      id_driver
      licence_number
      driver_name
      sex
      age
      address
      phone
   
    }
  }
`;

const UPDATE_CONDUCTOR = gql`
  mutation UpdateDriver($id_driver: ID!, $licence_number: String!, $driver_name: String!, $sex: String!, $age: Float!, $address: String!, $phone: String!) {
    updateDriver(id_driver: $id_driver, licence_number: $licence_number, driver_name: $driver_name, sex: $sex, age: $age, address: $address, phone: $phone) {
      id_driver
      licence_number
      driver_name
      sex
      age
      address
      phone
    }
  }
`;

const DELETE_CONDUCTOR = gql`
  mutation DeleteDriver($id_driver: ID!) {
    deleteDriver(id_driver: $id_driver) {
      id_driver
    }
  }
`;
const { Search } = Input;
const Conducteurs = () => {
  const [form] = Form.useForm();
  const { loading, error, data, refetch } = useQuery(GET_CONDUCTORS);
  const [licenceNumber, setLicenceNumber] = useState('');
  const [searchText, setSearchText] = useState('');
  const {t} = useTranslation();

  const handleSearch = (value) => {
    setSearchText(value);
  };
  const [createConductor] = useMutation(ADD_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('conducteur.succès_ajout'), t('conducteur.succès_ajout'), 'OK');
      refetch();
      setIsAddModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('conducteur.erreur_ajout'), `${t('conducteur.erreur_ajout')}: ${err.message}`, 'OK');
    }
  });
  const [updateConductor] = useMutation(UPDATE_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('conducteur.succès_mise_a_jour'), t('conducteur.succès_mise_a_jour'), 'OK');
      refetch();
      setIsAddModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('conducteur.erreur_mise_a_jour'), `${t('conducteur.erreur_mise_a_jour')}: ${err.message}`, 'OK');
     
    }
  });
  const [deleteConductor] = useMutation(DELETE_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('conducteur.succès_suppression'), t('conducteur.succès_suppression'), 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('conducteur.erreur_suppression'), `${t('conducteur.erreur_suppression')}: ${err.message}`, 'OK');
    }
  });

  // Renommage des variables d'état
  const [isEditing, setIsEditing] = useState(false);
  const [currentConductor, setCurrentConductor] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [permis, setPermis] = useState('');
  const [ocrData, setOcrData] = useState({});


  const handleVerification = (isConfirmed) => {
    setIsVerificationModalVisible(false);
    if (isConfirmed) {
      setIsCameraModalVisible(true); // Ouvrir le modal de la caméra
    }
  };

  const openVerificationModal = () => {
    setIsVerificationModalVisible(true);
  };

  const handleCameraCapture = (image) => {
    // Mettre à jour l'état du numéro de permis et des données OCR
    setLicenceNumber(''); // Définir le numéro de permis de conduire extrait ici
    setOcrData({ licence_number: image }); // Exemple de données OCR

    setIsCameraModalVisible(false);
    setIsAddModalVisible(true); // Ouvrir le modal d'ajout après la capture
  };


  const handleAddConductor = () => {
    form.validateFields().then(values => {
      const age = parseInt(values.age, 10);
      Loading.hourglass(t('conducteur.ajout_en_cours '));
      createConductor({
        variables: {
          id_driver: values.id_driver,
          licence_number: values.licence_number,
          driver_name: values.driver_name,
          sex: values.sex,
          age: age,
          address: values.address,
          phone: values.phone,

        }
      });
      form.resetFields();
    }).catch(error => {
      console.log('Validation en échec :', error);
    });
  };

  const handleEditConductor = (conductor) => {
    setIsEditing(true);
    setCurrentConductor(conductor);
    form.setFieldsValue(conductor);
    setIsAddModalVisible(true);
  };

  const handleUpdateConductor = () => {
    form.validateFields().then(values => {
      const age = parseInt(values.age, 10);
      Loading.hourglass(t('conducteur.mise_a_jour_en_cours'));
      updateConductor({
        variables: {
          id_driver: values.id_driver,
          licence_number: values.licence_number,
          driver_name: values.driver_name,
          sex: values.sex,
          age: age,
          address: values.address,
          phone: values.phone,
        }
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDeleteConductor = (id_driver) => {
    Loading.hourglass(t('conducteur.suppression_en_cours'))
    deleteConductor({ variables: { id_driver } })
  };

  if (loading) {
    Loading.hourglass(t('conducteur.chargement'));
    return null;
  }
  else {
    Loading.remove();
  }
  if (error) {
    Report.failure(t('conducteur.erreur_chargement'), t('conducteur.erreur_chargement'), 'OK');
    return null;
  }

  const getProfileImage = (profile, sex) => {
    if (profile) {
      return profile;
    }
    return sex === 'Homme' ? male : female;
  };

  const columns = [
    {
      title: t('conducteur.id'),
      dataIndex: 'id_driver',
      key: 'id_driver',
      sorter: (a, b) => a.id_driver - b.id_driver,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: t('conducteur.permis'),
      dataIndex: 'licence_number',
      key: 'licence_number',
    },
    {
      title: t('conducteur.nom'),
      dataIndex: 'driver_name',
      key: 'driver_name',
    },
    {
      title: t('conducteur.sexe'),
      dataIndex: 'sex',
      key: 'sex',
      render: text => (
        <span className={text === 'Homme' ? 'text-red' : text === 'Femme' ? 'text-green' : ''}>
          {text}
        </span>
      ),
    },
    {
      title: t('conducteur.age'),
      dataIndex: 'age',
      key: 'age',
      render: text => (
        text + " ans"
      )
    },
    {
      title: t('conducteur.adresse'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('conducteur.telephone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('conducteur.avatar'),
      dataIndex: 'profile',
      key: 'profile',
      render: (text, record) => {
        const imageUrl = getProfileImage(text, record.sex);
        return (
          <Image width={30} src={imageUrl} />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <EditTwoTone onClick={() => handleEditConductor(record)} style={{ marginRight: 16 }} />
          <Popconfirm
            title="Suppression"
            description="Êtes-vous sûr de vouloir supprimer cette personne?"
            onConfirm={() => handleDeleteConductor(record.id_driver)}
            okText="Oui"
            className='custom-popconfirm'
            icon={<QuestionCircleTwoTone style={{ color: 'red' }} />}
          >
            <a><DeleteTwoTone /></a>
          </Popconfirm>
        </span>
      ),
    },
  ];


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.drivers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Conducteurs');
    XLSX.writeFile(wb, 'Listes_des_derniers_conducteurs.xlsx');
  };
  const filteredData = searchText
  ? data?.drivers?.filter(item =>
      item.driver_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.licence_number.toLowerCase().includes(searchText) || 
      item.sex.toLowerCase().includes(searchText.toLowerCase()) ||
      item.age.toString().includes(searchText.toLowerCase()) ||
      item.address.toLowerCase().includes(searchText.toLowerCase()) || 
      item.phone.toLowerCase().includes(searchText.toLowerCase()) 
    ) || []
  : data?.drivers || [];

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
        style={{ width: 500  , marginBottom : 0 , marginRight : 10}}
      />
      <div className="tooltip"><img onClick={exportToExcel} src={excel} style={{ marginLeft: 10, marginBottom: 10 }} />
        <span className="tooltiptext">Exporter en excel</span>
      </div>
      <button className='submit-button' onClick={openVerificationModal}>
        {t('conducteur.ajouter')}
      </button>
      
      <Row gutter={32}>
        <Col span={24}>
        {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          dataSource={filteredData.length > 0 ? filteredData : []}
          columns={columns}
          rowKey="id_driver"
          pagination={{ pageSize: 5 }}
        />
      )}
        </Col>
      </Row>
      <Modal
        title={isEditing ? 'Modifier le Conducteur' : 'Ajouter un Conducteur'}
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={[
          <button key="submit" className='custom-button' onClick={isEditing ? handleUpdateConductor : handleAddConductor}>
            {isEditing ? t('conducteur.mettre_a_jour') : t('conducteur.soumettre')}
          </button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ licence_number: licenceNumber, ...(isEditing ? currentConductor : ocrData || {}) }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_driver"
                label="ID du Conducteur"
                rules={[{ required: true, message: 'ID du conducteur requis' }]}
              >
                <Input disabled={isEditing} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="licence_number"
                label="Numéro de Permis"
                rules={[{ required: true, message: 'Numéro de permis requis' }]}
              >
                <Input value={licenceNumber} onChange={(e) => setLicenceNumber(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="driver_name"
                label="Nom"
                rules={[{ required: true, message: 'Nom requis' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sex"
                label="Sexe"
                rules={[{ required: true, message: 'Sexe requis' }]}
              >
                <Select placeholder="Sélectionnez le sexe">
                  <Option value="Homme">Homme</Option>
                  <Option value="Femme">Femme</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Âge"
                rules={[{ required: true, message: 'Âge requis' }, { type: 'number', message: 'Veuillez entrer un nombre entier', transform: value => Number(value), pattern: /^\d+$/ }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Adresse"
                rules={[{ required: true, message: 'Adresse requise' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Téléphone"
                rules={[{ required: true, message: 'Téléphone requis' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <Image alt="Profil" src={previewImage} />
      </Modal>
      <Modal
        title={t('conducteur.vf')}
        open={isVerificationModalVisible}
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={[
          <button key="confirm" className='custom-button' onClick={() => handleVerification(true)}>
            {t('conducteur.confirmation')}
          </button>,
        ]}
      >
        <p>{t('conducteur.verification')}.</p>
      </Modal>
      <CameraScanner
        visible={isCameraModalVisible}
        onClose={() => setIsCameraModalVisible(false)}
        onCapture={handleCameraCapture}
      />
    </motion.div>
  );
};

export default Conducteurs;
