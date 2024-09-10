import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input, Table, Row, Col, Modal, DatePicker, Select , Button, message } from 'antd';
import { motion } from 'framer-motion';
import { EditTwoTone, DeleteTwoTone, EyeTwoTone } from '@ant-design/icons';
import { FaLocationArrow } from 'react-icons/fa';
import moment from 'moment';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import "../../assets/css/Violations.css";
import * as XLSX from 'xlsx'; // Importer xlsx;
import excel from "../../assets/images/excel.ico";
import LocationModal from './LocationModal';
import QRCode from 'qrcode.react';
import SignatureComponent from '../Signature';
import fond from "../../assets/images/font.png"
import rep from "../../assets/images/rep.png";
import rep1 from "../../../public/Logo.png"

const { Option } = Select;
const GET_VIOLATIONS = gql`
 query Violations {
    violations {
        id_violations
        violation_type
        desc
        date
        localisation
    }
}


`;

const CREATE_VIOLATION = gql`
  mutation CreateViolation(
    $id_violations: String!,
    $driver_id: String!,
    $officer_id: String!,
    $vehicle_id: String!,
    $violation_type: String!,
    $desc: String!,
    $date: DateTime!,
    $localisation: String!
  ) {
    createViolation(
      id_violations: $id_violations,
      driver_id: $driver_id,
      officer_id: $officer_id,
      vehicle_id: $vehicle_id,
      violation_type: $violation_type,
      desc: $desc,
      date: $date,
      localisation: $localisation
    ) {
      id_violations 
      violation_type
      desc
      date
      localisation
    }
  }
`;

const UPDATE_VIOLATION = gql`
  mutation UpdateViolation(
    $id_violations: String!,
    $driver_id: String!,
    $officer_id: String!,
    $vehicle_id: String!,
    $violation_type: String!,
    $desc: String!,
    $date: String!,
    $localisation: String!
  ) {
    updateViolation(
      id_violations: $id_violations,
      driver_id: $driver_id,
      officer_id: $officer_id,
      vehicle_id: $vehicle_id,
      violation_type: $violation_type,
      desc: $desc,
      date: $date,
      localisation: $localisation
    ) {
      id_violations
      violation_type
      desc
      date
      localisation
    }
  }
`;

const DELETE_VIOLATION = gql`
 mutation DeleteViolation($id_violations: String!) {
  deleteViolation(id_violations: $id_violations) {
    id_violations
  }
}

`;

const GET_AGENTS = gql`
 query GetAgents {
    polices {
      badge_number
      police_name
      rank
    }
  }
`;

const GET_DRIVERS = gql`
  query GetDrivers {
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

const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id_vehicles
      licence_plate
      mark
      modele
      year
      color
    }
  }
`;
const infraction = [
  {
    title: 'Excès de Vitesse',
    fineAmount: '600 000 MGA'
  },
  {
    title: 'Stationnement Illégal',
    fineAmount: '300 000 MGA'
  },
  {
    title: 'Non-respect des Signaux',
    fineAmount: '400 000 MGA'
  },
  {
    title: 'Conduite Sous Influence',
    fineAmount: '2 000 000 MGA'
  },
  {
    title: 'Infractions-spécifiques',
    fineAmount: '20 000 MGA'
  },
  {
    title: 'Infractions liées au véhicule',
    fineAmount: '30 000 MGA'
  },
];
const infractions = {
  speeding: {
    title: "Excès de Vitesse",
    description: "Dépassement de la vitesse autorisée",
    fineAmount: "600 000 MGA"
  },
  illegalParking: {
    title: "Stationnement Illégal",
    description: "Stationnement dans une zone interdite",
    fineAmount: "300 000 MGA"
  },
  signalViolation: {
    title: "Non-respect des Signaux",
    description: "Ignorer les signaux de circulation",
    fineAmount: "400 000 MGA"
  },
  drivingUnderInfluence: {
    title: "Conduite Sous Influence",
    description: "Conduite en état d'ivresse ou sous influence de drogues",
    fineAmount: "2 000 000 MGA"
  },
  specificInfractions: {
    title: "Infractions-spécifiques",
    description: "Transport de passagers au-delà de la capacité autorisée",
    fineAmount: "20 000 MGA"
  },
  vehicleRelatedInfractions: {
    title: "Infractions liées au véhicule",
    description: "Non-respect des normes de pollution",
    fineAmount: "30 000 MGA"
  }
};
const Violations = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingViolation, setEditingViolation] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const [viewViolation, setViewViolation] = useState(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [signature, setSignature] = useState(null);
  const [showSignatureComponent, setShowSignatureComponent] = useState(false);


  const { data: violationsData, refetch , loading, error} = useQuery(GET_VIOLATIONS);
  const { data: vehiclesData } = useQuery(GET_VEHICLES);
  const { data: driversData } = useQuery(GET_DRIVERS);
  const { data: agentsData } = useQuery(GET_AGENTS);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOpenLocationModal = (location) => {
    setSelectedLocation(location);
    setLocationModalVisible(true);
  };

  const [createViolation] = useMutation(CREATE_VIOLATION, {
    onCompleted: () => {
      Loading.remove();
      Report.success('Succès', 'La violation a été enregistrer', 'OK');
      refetch();
      setIsModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de l'ajout: ${err.message}`, 'OK');
    }
  });
  const [updateViolation] = useMutation(UPDATE_VIOLATION);
  const [deleteViolation] = useMutation(DELETE_VIOLATION, {
    onCompleted: () => {
      Loading.remove();
      Report.success('Succès', 'La violation a été supprimer', 'OK');
      refetch();
      setIsModalVisible(false);
    },
    onError: (err) => {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de la supperssion: ${err.message}`, 'OK');
    }
  });
  const vehicles = vehiclesData?.vehicles || [];
  const handleAddViolation = () => {

    form.validateFields().then(values => {
      Loading.hourglass("Ajout en cours . . .")
      createViolation({   variables: values })
      form.resetFields();
    }).catch(error => {
      Report.failure('Erreur', `Erreur lors de l'ajout: ${error.message}`, 'OK')
    })

  };

  const handleUpdateViolation = async () => {
    try {
      const values = await form.validateFields();
      await updateViolation({ variables: { ...values, date: values.date.toDate() } });
      Report.success('Violation modifiée avec succès');
      refetch();
      form.resetFields();
      setIsModalVisible(false);
      setEditingViolation(null);
    } catch (error) {
      Report.failure(`Erreur lors de la modification de la violation:', ${error.message}`);
    }
  };

  const handleDeleteViolation = async (id_violations) => {
    try {
      await deleteViolation({ variables: { id_violations } });
      Report.success('Violation supprimée avec succès');
      refetch();
    } catch (error) {
      Report.info('Erreur lors de la suppression de la violation:', error);
      Report.failure('Erreur lors de la suppression de la violation');
    }
  };
  const handleViewViolation = (violation) => {
    setViewViolation(violation);
    setPrintModalVisible(true);
  };

  if (loading) {
    Loading.hourglass('Chargement des données');
    return null;
  }

  if (error) {
    Report.failure('erreur du chargement', error + message, 'OK');
    return null;
  }

  const handlePrint = () => {
    Modal.confirm({
      title: '',
      content: 'Souhaitez-vous ajouter une signature numérique avant d\'imprimer ?',
      okText: 'Oui',
      cancelText: 'Non', 
      onOk: () => {
        setSignatureModalVisible(true);
      },
      onCancel: () => {
        printWithoutSignature();
      }
    });
  };
  const printWithoutSignature = () => {
    const printWindow = window.open('', '', 'height=1000,width=1000');
    
    if (!printWindow) {
        alert('Impossible d\'ouvrir une nouvelle fenêtre pour l\'impression.');
        return;
    }

    printWindow.document.write('<html>');
    printWindow.document.write('<head>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Calibri, sans-serif; margin: 0; padding: 0; }');
    printWindow.document.write('.container { padding: 20px; position: relative; }');
    printWindow.document.write('.header-img { width: 150px; height: auto; }');
    printWindow.document.write('.left-img { position: absolute; top: 20px; left: 30rem; }');
    printWindow.document.write('.right-img { position: absolute; top: 20px; right: 30rem; }');
    printWindow.document.write('.content { text-align: center; margin-top: 170px; }'); 
    printWindow.document.write('.content p { margin: 10px 0; }');
    printWindow.document.write('.signature-container { position: absolute; bottom: 20px; margin-right: 5rem ;margin-top : 50px text-align: center; width: 200px; }');
    printWindow.document.write('.signature-text { font-size: 15px; margin-bottom: 5px; }');
    printWindow.document.write('.signature-img { width: 60px; height: auto; position: relative; top: 0; }'); 
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    
    // Ajouter les images en haut à gauche et à droite
    printWindow.document.write('<div class="container">');
    printWindow.document.write(`<img src="${rep}" class="header-img left-img" alt="Rep Image"/>`);
    printWindow.document.write(`<img src="${rep1}" class="header-img right-img" alt="Rep Image"/>`);
    
    // Ajouter le contenu de la violation
    printWindow.document.write('<div class="content">');
    printWindow.document.write('<h3>Détails de l\'infraction</h3>');
    printWindow.document.write(`<p>Cette violation a été effectuée par ${viewViolation.driver_name}, conduisant le véhicule ${viewViolation.licence_plate}, signalée par l'agent ${viewViolation.police_name}.</p>`);
    printWindow.document.write(`<p><strong>Type de Violation:</strong> ${viewViolation.violation_type || 'Inconnu'}</p>`);
    printWindow.document.write(`<p><strong>Description:</strong> ${viewViolation.desc || 'Aucune description disponible'}</p>`);
    printWindow.document.write(`<p><strong>Montant de l'Amende: </strong> <strong>${viewViolation.fineAmount || 'Non défini'}</strong></p>`);
    printWindow.document.write(`<p><strong>Date:</strong> ${moment(viewViolation.date).format('DD/MM/YYYY')}</p>`);
    printWindow.document.write(`<p><strong>Localisation: </strong> ${viewViolation.localisation}</p>`);
    
    
    // Ajouter la signature avec un paragraphe
    if (signature) {
        // Ajouter un paramètre unique à l'URL de la signature pour éviter le cache
        const signatureURL = `${signature}?t=${new Date().getTime()}`;
        printWindow.document.write('<div class="signature-container">');
        printWindow.document.write('<div class="signature-text"><strong>Signature:</strong></div>');
        printWindow.document.write(`<img src="${signature}" alt="Signature" class="signature-img" />`);
        printWindow.document.write('</div>');
    }
  
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Utiliser un délai avant d'imprimer pour s'assurer que le contenu est complètement chargé
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 1000); // Délai en millisecondes, ajustez si nécessaire
};





  const handleSignature = (signatureData) => {
    setSignature(signatureData);
    setSignatureModalVisible(false);
    printWithoutSignature();
  };

  const columns = [
    { title: 'ID Violation', 
      dataIndex: 'id_violations',
       key: 'id_violations' ,
       sorter: (a, b) => a.id_violations - b.id_violations, 
       sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Conducteur',
      dataIndex: 'driver_id',
      key: 'driver_id',
      render: (text) => {
        const driver = driversData.drivers.find((driver) => driver.id_driver === text);
        return driver ? driver.driver_name : <span style={{ color: 'blue' ,fontSize : '20px'}}>?</span>;
      },
    },
    {
      title: 'Officier',
      dataIndex: 'officer_id',
      key: 'officer_id',
      render: (text) => {
        const officer = agentsData.polices.find((officer) => officer.badge_number === text);
        return officer ? officer.officer_name : <span style={{ color: 'blue',fontSize : '20px' }}>?</span>;
      },
    },
    {
      title: 'Véhicule',
      dataIndex: 'vehicle_id',
      key: 'vehicle_id',
      render: (text) => {
        const vehicle = vehicles.find((vehicle) => vehicle.licence_plate=== text);
        return vehicle ? vehicle.vehicle_name : <span style={{ color: 'blue' ,fontSize : '20px' }}>?</span>;
      },
    },
    { title: 'Type de Violation', dataIndex: 'violation_type', key: 'violation_type' },
    { title: 'Description', dataIndex: 'desc', key: 'desc' },
    {
      title: 'Date', dataIndex: 'date', key: 'date',
      render: (text) => {
        return text.split("T")[0]
      }
    },
    {
      title: 'Localisation',
      dataIndex: 'localisation',
      key: 'localisation',
      render: (text) => (
        <a 
          onClick={() => handleOpenLocationModal(text)}
          style={{ color: 'skyblue', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <EditTwoTone onClick={() => handleEditViolation(record)} style={{ marginRight: 16 }} />
          <DeleteTwoTone onClick={() => handleDeleteViolation(record.id_violations)} />
          <EyeTwoTone onClick={() => handleViewViolation(record)} style={{ marginLeft: 16 }} />
        </>
      )
    }
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingViolation(null);
  };

  const handleEditViolation = (violation) => {
    form.setFieldsValue({
      ...violation,
      date: moment(violation.date),
    });
    setEditingViolation(violation);
    setIsModalVisible(true);
  };

  const handleSelectLocation = (location) => {
    setPosition(location);
    form.setFieldsValue({ localisation: location });
    setLocationModalVisible(false);
  };
  const handleLocationSelect = (location) => {
    form.setFieldsValue({ localisation: location });
    setLocationModalVisible(false);
  };
  const handleUpdateAddress = (address) => {
    form.setFieldsValue({ localisation: address });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(violationsData.violations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Infractions');
    XLSX.writeFile(wb, 'Listes_des_derniers_infractions.xlsx');
  };
  
  
  const ViolationDetails = viewViolation?.violation_type ? infractions[viewViolation.violation_type] || {} : {};



  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <img onClick={exportToExcel} src={excel} style={{ margin: 0, marginBottom: 15 }} />
      <button className='custom-button' onClick={showModal}>
        Ajouter une Violation
      </button>
      <LocationModal
        visible={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        onSelectLocation={handleLocationSelect}
        onUpdateAddress={(address) => form.setFieldsValue({ localisation: address })}
      />
      <Table
        dataSource={violationsData ? violationsData.violations : []}
        columns={columns}
        rowKey="id_violations"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingViolation ? 'Modifier la Violation' : 'Ajouter une Violation'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingViolation ? handleUpdateViolation : handleAddViolation}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ID Violation"
                name="id_violations"
                rules={[{ required: true, message: 'Veuillez saisir l\'ID de la violation!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Conducteur"
                name="driver_id"
                rules={[{ required: true, message: 'Veuillez entrer le conducteur!' }]}
              >
                <Select>
                  {driversData && driversData.drivers.map(driver => (
                    <Option key={driver.id_driver} value={driver.id_driver}>
                      {driver.driver_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Officier"
                name="officer_id"
                rules={[{ required: true, message: 'Veuillez entrer l\'officier!' }]}
              >
                <Select>
                  {agentsData && agentsData.polices.map(officer => (
                    <Option key={officer.badge_number} value={officer.badge_number}>
                      {officer.police_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Véhicule"
                name="vehicle_id"
                rules={[{ required: true, message: 'Veuillez entrer le véhicule!' }]}
              >
                <Select>
                  {vehiclesData && vehiclesData.vehicles.map(vehicle => (
                    <Option key={vehicle.id_vehicles} value={vehicle.id_vehicles}>
                      {vehicle.licence_plate}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Type de Violation"
                name="violation_type"
                rules={[{ required: true, message: 'Veuillez entrer le type de violation!' }]}
              >
                <Select placeholder="Sélectionnez le type de violation comis">
                  {infraction.map((item, index) => (
                    <Select.Option key={index} value={item.title}>
                      {item.title} - {item.fineAmount}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Description"
                name="desc"
                rules={[{ required: true, message: 'Veuillez saisir la description!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Veuillez sélectionner la date!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>

              <Form.Item name="localisation" label="Localisation">
                <Input
                  readOnly
                  suffix={
                    <FaLocationArrow
                      style={{ cursor: 'pointer' }}
                      onClick={() => setLocationModalVisible(true)}
                    />
                  }
                />
              </Form.Item>

              <LocationModal
                visible={locationModalVisible}
                onCancel={() => setLocationModalVisible(false)}
                onUpdateAddress={handleUpdateAddress}
              />
            </Col>
          </Row>
          <Form.Item>
            <button className="custom-button" type="submit" block={true}>
              {editingViolation ? 'Mettre à jour' : 'Soumettre'}
            </button>
          </Form.Item>
        </Form>
      </Modal>
      
      <LocationModal
        visible={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        onSelectLocation={handleSelectLocation}
      />
       <Modal
        title="Détails de la Violation"
        open={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        footer={[
          <button key="print" className='custom-button' onClick={handlePrint}>
            Imprimer
          </button>,
        ]}
      >
        {viewViolation && (
          <>
            <QRCode value={`Numéro de cette infraction: ${viewViolation.id_violations}`} download />
            <p>Cette violation a été effectuée par {viewViolation.driver_name}, conduisant le véhicule {viewViolation.licence_plate}, signalée par l'agent {viewViolation.police_name}.</p>
            <p><strong>Type de Violation:</strong>  {viewViolation.violation_type || 'Inconnu'}</p>
            <p><strong>Description:</strong> {viewViolation.desc || 'Aucune description disponible'}</p>
            <p><strong>Montant de l'Amende: </strong> <strong>{viewViolation.fineAmount|| 'Non défini'}</strong></p>
            <p><strong>Date:</strong> {moment(viewViolation.date).format('DD/MM/YYYY')}</p>
            <p><strong>Localisation:</strong> {viewViolation.localisation}</p>
            </>
          )}
      </Modal>
      <Modal
          title="Votre signature s'il vous plaît"
          open={signatureModalVisible}
          onCancel={() => setSignatureModalVisible(false)}
          footer={null}
          className="custom-modal"
          style={{ backgroundImage : `url(${fond})`  , backgroundRepeat : 'no-repeat' ,  backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
          <SignatureComponent onSignature={handleSignature} />
        </Modal>
    </motion.div>
  );
};

export default Violations;

