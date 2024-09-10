import React, { useState  } from 'react';
import { Form, Input, Table, Row, Col, Divider, Modal, Select, Upload, Image, Popconfirm } from 'antd';
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
      profile
    }
  }
`;

const ADD_CONDUCTOR = gql`
  mutation CreateDriver($id_driver: String!, $licence_number: String!, $driver_name: String!, $sex: String!, $age: Int!, $address: String!, $phone: String!, $profile: Upload) {
    createDriver(id_driver: $id_driver, licence_number: $licence_number, driver_name: $driver_name, sex: $sex, age: $age, address: $address, phone: $phone, profile: $profile) {
      id_driver
      licence_number
      driver_name
      sex
      age
      address
      phone
      profile
    }
  }
`;

const UPDATE_CONDUCTOR = gql`
  mutation UpdateDriver($id_driver: ID!, $licence_number: String!, $driver_name: String!, $sex: String!, $age: Int!, $address: String!, $phone: String!, $profile: Upload) {
    updateDriver(id_driver: $id_driver, licence_number: $licence_number, driver_name: $driver_name, sex: $sex, age: $age, address: $address, phone: $phone, profile: $profile) {
      id_driver
      licence_number
      driver_name
      sex
      age
      address
      phone
      profile
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

const Conducteurs = () => {
  const [form] = Form.useForm();
  const { loading, error, data, refetch } = useQuery(GET_CONDUCTORS);
  const [licenceNumber, setLicenceNumber] = useState('');


  const [createConductor] = useMutation(ADD_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success('Succès', 'Conducteur ajouté avec succès', 'OK');
      refetch();
      setIsAddModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de l'ajout: ${err.message}`, 'OK');
    }
  });
  const [updateConductor] = useMutation(UPDATE_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success('Succès', 'Conducteur mis à jour avec succès', 'OK');
      refetch();
      setIsAddModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de la mise à jour: ${err.message}`, 'OK');
    }
  });
  const [deleteConductor] = useMutation(DELETE_CONDUCTOR, {
    onCompleted: () => {
      Loading.remove();
      Report.success('Succès', 'Conducteur supprimé avec succès', 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de la suppression: ${err.message}`, 'OK');
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
    setPermis(''); // Définir le numéro de permis de conduire extrait ici
    setOcrData({ licence_number: '' }); // Exemple de données OCR

    setIsCameraModalVisible(false);
    setIsAddModalVisible(true); // Ouvrir le modal d'ajout après la capture
  };


  const handleAddConductor = () => {
    form.validateFields().then(values => {
      const age = parseInt(values.age, 10);
      Loading.hourglass('Ajout en cours...');
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
      Loading.hourglass('Mise à jour en cours...');
      updateConductor({
        variables: {
          id_driver: values.id_driver,
          licence_number: values.licence_number,
          driver_name: values.driver_name,
          sex: values.sex,
          age: age,
          address: values.address,
          phone: values.phone,
          profile: values.profile,
        }
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDeleteConductor = (id_driver) => {
    Loading.hourglass("Suppression en cours ...")
    deleteConductor({ variables: { id_driver } })
  };

  if (loading) {
    Loading.hourglass('Chargement des données . . .');
    return null;
  }

  if (error) {
    Report.failure("Erreur de chargement", "Vérifiez votre connexion", "OK");
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
      title: 'ID',
      dataIndex: 'id_driver',
      key: 'id_driver',
      sorter: (a, b) => a.id_driver - b.id_driver, 
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Numéro de Permis',
      dataIndex: 'licence_number',
      key: 'licence_number',
    },
    {
      title: 'Nom',
      dataIndex: 'driver_name',
      key: 'driver_name',
    },
    {
      title: 'Sexe',
      dataIndex: 'sex',
      key: 'sex',
      render: text => (
        <span className={text === 'Homme' ? 'text-red' : text === 'Femme' ? 'text-green' : ''}>
          {text}
        </span>
      ),
    },
    {
      title: 'Âge',
      dataIndex: 'age',
      key: 'age',
      render: text => (
        text + " ans"
      )
    },
    {
      title: 'Adresse',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Avatar',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <Row gutter={32}>
        <Col span={24}>
          <img onClick={exportToExcel} src={excel} style={{ margin: 0, marginBottom: 15 }} />
          <button className='submit-button' onClick={openVerificationModal}>
            Ajouter un Conducteur
          </button>
          <Divider />
          <Table dataSource={data.drivers} columns={columns} rowKey={(record) => record.id_driver} pagination={{ pageSize: 5 }} />
        </Col>
      </Row>
      <Modal
        title={isEditing ? 'Modifier le Conducteur' : 'Ajouter un Conducteur'}
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={[
          <button key="submit" className='custom-button' onClick={isEditing ? handleUpdateConductor : handleAddConductor}>
            {isEditing ? 'Mettre à jour' : 'Soumettre'}
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
                 <Input value={permis} onChange={(e) => setPermis(e.target.value)} />
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
        title="Vérification du Permis de Conduire"
        open={isVerificationModalVisible}
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={[
          <button key="confirm" className='custom-button' onClick={() => handleVerification(true)}>
            Confirmer
          </button>,
        ]}
      >
        <p>Veuillez vérifier les informations du permis de conduire avant de continuer.</p>
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
