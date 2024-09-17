import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Form, Input, Table, Row, Col, Modal, DatePicker, Select, Divider, message, Spin } from 'antd';
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
import QRCodeWithDownload from '../QrCode';
import rep from "../../assets/images/rep.png";
import rep1 from "../../../public/Logo.png";
import { ScaleLoader } from 'react-spinners';

const { Option } = Select;
const GET_VIOLATIONS = gql`
  query Violations {
    violations {
      id_violations
      violation_type
      driver_id
      officer_id
      vehicle_id
      desc
      date
      localisation
      amende
    }
  }
`;


const CREATE_VIOLATION = gql`
  mutation CreateViolation(
    $id_violations: String!,
    $driver_id: String!,
    $officer_id: String!,
    $vehicle_id: String!,
    $violation_type: [String!]!,
    $desc: String!,
    $date: DateTime!,
    $localisation: String!
     $amende : Float!
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
      amende : $amende
    ) {
      id_violations
      driver_id
      officer_id
      vehicle_id
      violation_type
      desc
      date
      localisation
      amende
    }
  }
`;


const UPDATE_VIOLATION = gql`
  mutation UpdateViolation(
    $id_violations: String!,
    $driver_id: String!,
    $officer_id: String!,
    $vehicle_id: String!,
    $violation_type:[String!]!,
    $desc: String!,
    $date: DateTime!,
    $localisation: String!
    $amende : Float!
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
      amende: $amende
    ) {
      id_violations
      driver_id
      officer_id
      vehicle_id
      violation_type
      desc
      date
      localisation
      amende
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
let infractionsList = [
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

const Violations = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingViolation, setEditingViolation] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const [viewViolation, setViewViolation] = useState(null);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [amende, setAmende] = useState(0);
  const { data: violationsData, refetch, loading, error } = useQuery(GET_VIOLATIONS);
  const { data: vehiclesData } = useQuery(GET_VEHICLES);
  const { data: driversData } = useQuery(GET_DRIVERS);
  const { data: agentsData } = useQuery(GET_AGENTS);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [load, setLoading] = useState(false); 

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOpenLocationModal = (location) => {
    setSelectedLocation(location);
    setLocationModalVisible(true);
  };
 

  useEffect(() => {
    setLoading(true); 
    const totalFine = calculateTotalFine();
    setAmende(totalFine);
    setLoading(false); // Désactive le chargement après avoir calculé l'amende
  }, [selectedViolations]); // Dépendance pour recalculer lorsque selectedViolations change
  const handleInfractionChange = (value) => {
    console.log("Infraction sélectionnée:", value);
    const selectedInfraction = infractionsList.find(
      (inf) => inf.title === value
    );

    if (selectedInfraction) {
      console.log("Amende trouvée:", selectedInfraction.fineAmount);
      setAmende(selectedInfraction.fineAmount);
    } else {
      console.log("Aucune infraction correspondante trouvée");
    }
    setSelectedViolations(value);
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
  const convertToNumber = (value) => {
    if (!value || typeof value !== 'string') {
      return NaN;
    }
    const cleanedValue = value.replace(/[^0-9.-]+/g, '');
    return isNaN(parseFloat(cleanedValue)) ? NaN : parseFloat(cleanedValue);
  };
  let amendeNumber = convertToNumber(amende);

  const calculateTotalFine = () => {

    if (!Array.isArray(selectedViolations)) {
      console.error('selectedViolations n\'est pas un tableau:', selectedViolations);
      return 0;
    }
  
    const total = selectedViolations.reduce((total, violation) => {
      const infraction = infractionsList.find((item) => item.title === violation);
      return infraction ? total + convertToNumber(infraction.fineAmount) : total;
    }, 0);
  

  
    return total;
  };
  
 
  let totalFine = calculateTotalFine();
  let totalFineFMG = totalFine * 5;

  const handleAddViolation = () => {
    form.validateFields().then(values => {
      console.log('Valeurs avant envoi:', values);
    
      if (isNaN(totalFine)) {
        Report.failure('Erreur', 'L\'amende concernant le type d\'infraction n\'est pas valide .', 'OK');
        return;
      }
  
      // Met à jour values.amende avec la valeur convertie
      values.amende = totalFine;
      values.violation_type = selectedViolations || '';
  
      // Vérifiez les autres champs requis
      if (!values.id_violations || !values.driver_id || !values.officer_id || !values.vehicle_id || !values.violation_type || !values.date || !values.localisation) {
        Report.failure('Erreur', 'Veuillez remplir tous les champs requis.', 'OK');
        return;
      }

      Loading.hourglass("Ajout en cours . . .");
  
      // Appel à la mutation
      createViolation({
        variables: {
          id_violations: values.id_violations,
          driver_id: values.driver_id,
          officer_id: values.officer_id,
          vehicle_id: values.vehicle_id,
          violation_type: values.violation_type,
          desc: values.desc,
          date: values.date,
          localisation: values.localisation,
          amende: values.amende,
        }
      }).then(() => {
        Loading.remove();
        Report.success('Succès', 'La violation a été enregistrée', 'OK');
        refetch();
        setIsModalVisible(false);
      }).catch(error => {
        Loading.remove();
        Report.failure('Erreur', `Erreur lors de l'ajout: ${error.message}`, 'OK');
      });

      form.resetFields();
    }).catch(error => {
      Report.failure('Erreur', `Erreur lors de la validation: ${error.message}`, 'OK');
    });
  };
  
  
  const handleUpdateViolation = async () => {
    try {
     
      if (isNaN(totalFine)) {
        Report.failure('Erreur', 'L\'amende concernant le type d\'infraction n\'est pas valide.', 'OK');
        return;
      }
     
      const values = await form.validateFields();
  
      
      if (!values.id_violations || !values.driver_id || !values.officer_id || !values.vehicle_id || !values.violation_type || !values.date || !values.localisation) {
        Report.failure('Erreur', 'Veuillez remplir tous les champs requis.', 'OK');
        return;
      }
      values.amende = totalFine;
      values.violation_type = selectedViolations || '';
      Loading.hourglass("Modification en cours...");
      await updateViolation({
        variables: {
          id_violations: values.id_violations,
          driver_id: values.driver_id,
          officer_id: values.officer_id,
          vehicle_id: values.vehicle_id,
          violation_type: values.violation_type,
          desc: values.desc,
          date: values.date,
          localisation: values.localisation,
          amende: values.amende,
        }
      });

      form.resetFields();
      Loading.remove();
      Report.success('Succès', 'La violation a été modifiée', 'OK');
      refetch();
      setIsModalVisible(false);
  
    } catch (error) {
      Loading.remove();
      Report.failure('Erreur', `Erreur lors de la modification: ${error.message}`, 'OK');
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
    Loading.hourglass('Chargement des données . . .');
    return null;
  }
  else {
    Loading.remove();
  }
  if (error) {
    Report.failure('erreur du chargement', error + message, 'OK');
    return null;
  }


  const columns = [
    {
      title: 'ID Violation',
      dataIndex: 'id_violations',
      key: 'id_violations',
      sorter: (a, b) => a.id_violations - b.id_violations,
      sortDirections: ['ascend', 'descend'],
      width: 100, // Ajustez la largeur si nécessaire
    },
    {
      title: 'Conducteur',
      dataIndex: 'driver_id',
      key: 'driver_id',
      width: 150,
    },
    {
      title: 'Agents',
      dataIndex: 'officer_id',
      key: 'officer_id',
      width: 150,
    },
    {
      title: 'Véhicule',
      dataIndex: 'vehicle_id',
      key: 'vehicle_id',
      width: 150,
    },
    {
      title: 'Infraction',
      dataIndex: 'violation_type',
      key: 'violation_type',
      render: (violation_type) => {
        if (Array.isArray(violation_type)) {
          return violation_type.join(' - ');
        }
        return violation_type;
      },
      width: 150, // Ajustez la largeur selon vos besoins
      ellipsis: true, // Active la troncature du texte
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text.split("T")[0],
      width: 150,
    },
    {
      title: 'Localisation',
      dataIndex: 'localisation',
      key: 'localisation',
      render: (text) => (
        <a
          onClick={() => handleOpenLocationModal(text)}
          style={{ color: 'skyblue', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
        >
          {text}
        </a>
      ),
      width: 150, // Ajustez la largeur selon vos besoins
    },
    {
      title: 'Amende',
      dataIndex: 'amende',
      key: 'amende',
      render: (text, record) => {  
        if (!record || !record.amende) {  
          return <span style={{ color: 'red' }}>Non défini</span>;
        } 
        return <span style={{ color: 'blue' }}>{record.amende} Ar</span>;
      },
      width: 150,
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
      ),
      width : 150
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
  let violationTypes = viewViolation && Array.isArray(viewViolation.violation_type)
  ? viewViolation.violation_type
  : [viewViolation?.violation_type || 'Inconnu'];


  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=1000,width=1000');
  
    if (!printWindow) {
      alert('Impossible d\'ouvrir une nouvelle fenêtre pour l\'impression.');
      return;
    }
  
    const TVA = 0.2; 
    let total = 0;
    const extractNumber = (text) => {
      const match = text.match(/\d+/);
      return match ? parseInt(match[0], 10)*100 : 0;
    };
         const amendes = violationTypes.map(violationType => {
    
        const infraction = infractionsList.find(item => item.title === violationType);
        return infraction ? extractNumber(infraction.fineAmount) : 0;
      });
  
    violationTypes.forEach((_, index) => {
      total += amendes[index] || 0;
    });
  
    const totalFarany = amendes.reduce((sum, amende) => sum + amende, 0);
    const result = totalFarany + totalFarany * TVA;
  
    // Commencer à écrire dans la fenêtre d'impression
    printWindow.document.write('<html>');
    printWindow.document.write('<head>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Calibri, sans-serif; margin: 0; padding: 0; }');
    printWindow.document.write('.container { padding: 20px; position: relative; }');
    printWindow.document.write('.header-img { width: 150px; height: auto; }');
    printWindow.document.write('.left-img { position: absolute; top: 20px; left: 28rem; }');
    printWindow.document.write('.right-img { position: absolute; top: 20px; right: 28rem; }');
    printWindow.document.write('.content { text-align: center; margin-top: 170px; }');
    printWindow.document.write('.content p { margin: 10px 0; }');
    printWindow.document.write('.signature-container { position: absolute; bottom: 20px; margin-top: 50px; text-align: center; width: 200px; }');
    printWindow.document.write('.footer-container { display: flex; justify-content: space-between; align-items: center; margin-top: 50px; width: 50%; margin-left: auto; margin-right: auto; }');
    printWindow.document.write('.footer-left, .footer-right { font-size: 20px; }');
    printWindow.document.write('.table-container { margin-top: 50px; width: 50%; text-align: center; margin-left: auto; margin-right: auto; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('table, th, td { border: 2px solid black; padding: 10px; text-align: center; }');
    printWindow.document.write('th { background-color: #d6e0df; }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
  
    // Ajouter les images en haut à gauche et à droite
    printWindow.document.write('<div class="container">');
    printWindow.document.write(`<img src="${rep}" class="header-img left-img" alt="Rep Image"/>`);
    printWindow.document.write(`<img src="${rep1}" class="header-img right-img" alt="Rep Image"/>`);
  
    // Ajouter le contenu de l'infraction
    printWindow.document.write('<div class="content">');
    printWindow.document.write('<h2><strong>Loi N° 2017-002</strong><br/></h2>');
    printWindow.document.write('<h2><strong>portant le code de la route à Madagascar</strong></h2>');
    printWindow.document.write('<h2>DETAILS DE L\'INFRACTION</h2>');
    printWindow.document.write(`<p>Cette infraction a été effectuée par ${viewViolation.driver_id}, conduisant le véhicule N° ${viewViolation.vehicle_id}, signalée par l'agent ${viewViolation.officer_id}.</p>`);
    printWindow.document.write(`<p><strong>Type de Violation:</strong> ${violationTypes.join(' - ')}</p>`);
    printWindow.document.write(`<p><strong>Description:</strong> ${viewViolation.desc || 'Aucune description disponible'}</p>`);
    printWindow.document.write(`<p><strong>Date:</strong> ${moment(viewViolation.date).format('DD/MM/YYYY')}</p>`);
    printWindow.document.write(`<p><strong>Localisation:</strong> ${viewViolation.localisation}</p>`);
  
    // Tableau avec les informations de l'amende
    printWindow.document.write('<div class="table-container">');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr><th><strong>Type de Violation</strong></th><th><strong>Amende à Payer</strong></th></tr></thead>');
    printWindow.document.write('<tbody>');
  
    violationTypes.forEach((violation, index) => {
      const amende = amendes[index] || 0;
      printWindow.document.write(`<tr><td><strong>${violation}</strong></td><td><strong>${amende} Ariary</strong></td></tr>`);
    });

    printWindow.document.write('</tbody>');
    printWindow.document.write('<tfoot>');
    printWindow.document.write(`<tr><td><strong>T O T A L : </strong></td><td><strong>${totalFarany} Ariary</strong></td></tr>`);
    printWindow.document.write(`<tr><td><h3><strong>NET A PAYER (avec TVA) : </strong></h3></td><td><h3><strong style="color: red;">${result} Ariary</strong></h3></td></tr>`);
    printWindow.document.write('</tfoot>');
    printWindow.document.write('</table>');
    printWindow.document.write('</div>');
  
    // Ajouter la section avec "Cachet" et "Signature" côte à côte
    printWindow.document.write('<div class="footer-container">');
    printWindow.document.write('<div class="footer-left"><strong>Cachet </strong></div>');
    printWindow.document.write('<div class="footer-right"><strong>Signature du chef de service :</strong></div>');
    printWindow.document.write('</div>');
  
    printWindow.document.write('</div>'); // Fin du contenu principal
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  
    // Utiliser un délai avant d'imprimer pour s'assurer que le contenu est complètement chargé
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000); // Délai en millisecondes, ajustez si nécessaire
  };
  
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(violationsData.violations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Infractions');
    XLSX.writeFile(wb, 'Listes_des_derniers_infractions.xlsx');
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <div className="tooltip"><img onClick={exportToExcel} src={excel} style={{ margin: 0, marginBottom: 10 }} />
        <span className="tooltiptext">Exporter en excel</span>
      </div>
      <br />
      <button className='custom-button' onClick={showModal}>
        Ajouter une Violation
      </button>
      <LocationModal
        visible={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        onSelectLocation={handleLocationSelect}
        onUpdateAddress={(address) => form.setFieldsValue({ localisation: address })}
      />
      <Divider />
      <div className="table-container">
      <Table
        dataSource={violationsData ? violationsData.violations : []}
        columns={columns}
        rowKey="id_violations"
        pagination={{ pageSize: 5 }}
      />
    </div>

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
                  {driversData && driversData.drivers.map(driver => {
                    // Déterminez le préfixe basé sur le sexe
                    const prefix = driver.sex === 'Femme' ? 'Mme. ' : 'Mr. ';

                    return (
                      <Option key={driver.id_driver} value={driver.driver_name}>
                        {prefix} {driver.driver_name}
                      </Option>
                    );
                  })}
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
                    <Option key={officer.badge_number} value={officer.police_name}>
                      {officer.rank} {officer.police_name}
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
                    <Option key={vehicle.id_vehicles} value={vehicle.licence_plate}>
                      Véhicule N° {vehicle.licence_plate}
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
                rules={[{ required: true, message: 'Veuillez entrer le type d\'infracion!' }]}
              >
                <Select placeholder="Sélectionnez le type d'infraction'comis"   mode="multiple" onChange={handleInfractionChange} >
                  {infractionsList.map((item, index) => (
                    <Select.Option key={index} value={item.title}>
                      {item.title}
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
            <Form.Item
              label="AMENDE"
              name="amende"
            >
              <p style={{ margin: '0', fontSize: '1.2em' }}>
              <strong>
                {load ? (
                  <ScaleLoader color='#3a9188' />
                ) : (totalFine === 0 ? '0 AR ou 0 FMG' : `${totalFine} AR ou ${totalFineFMG} FMG`)}
              </strong>
              </p>
            </Form.Item>

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
            <QRCodeWithDownload
              id_violations={viewViolation.id_violations}
              driver_id={viewViolation.driver_id}
              vehicle_id={viewViolation.vehicle_id}
              officer_id={viewViolation.officer_id}
              violation_type={viewViolation.violation_type}
              desc={viewViolation.desc}
              fineAmount={viewViolation.amende}
              date={viewViolation.date}
              localisation={viewViolation.localisation}
            />
            <p>
              Cette violation a été effectuée par <strong>{viewViolation.driver_id}</strong>,
              conduisant le véhicule <strong>{viewViolation.vehicle_id}</strong>,
              signalée par l'agent <strong>{viewViolation.officer_id}</strong>.
            </p>
            <p><strong>Type de Violation:</strong> {violationTypes.join(' - ') || 'Inconnu'}</p>
            <p><strong>Description:</strong> {viewViolation.desc || 'Aucune description disponible'}</p>
            <p><strong>Montant de l'Amende:</strong> <strong>{viewViolation.amende|| 'Non défini'}  Ar</strong></p>
            <p><strong>Date:</strong> {moment(viewViolation.date).format('DD/MM/YYYY')}</p>
            <p><strong>Localisation:</strong> {viewViolation.localisation}</p>
          </>
        )}

      </Modal>

    </motion.div>
  );
};

export default Violations;

