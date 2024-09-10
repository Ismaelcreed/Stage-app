import React, { useState } from 'react';
import { Form, Input, Select, Table, Row, Col, Divider, Button } from 'antd';
import "../../assets/css/Agents.css";
import { motion } from 'framer-motion';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import * as XLSX from 'xlsx'; // Importer xlsx;
import excel from "../../assets/images/excel.ico"
import { useTranslation } from 'react-i18next';

const GET_AGENTS = gql`
  query GetAgents {
    polices {
      badge_number
      police_name
      rank
    }
  }
`;

const ADD_AGENT = gql`
  mutation CreatePolice($police_name: String!, $badge_number: String!, $rank: String!) {
    createPolice(police_name: $police_name, badge_number: $badge_number, rank: $rank) {
      badge_number
      police_name
      rank
    }
  }
`;

const UPDATE_AGENT = gql`
  mutation UpdatePolice($police_name: String!, $badge_number: String!, $rank: String!) {
    updatePolice(police_name: $police_name, badge_number: $badge_number, rank: $rank) {
      badge_number
      police_name
      rank
    }
  }
`;

const DELETE_AGENT = gql`
  mutation DeletePolice($badge_number: String!) {
    deletePolice(badge_number: $badge_number) {
      badge_number
    }
  }
`;

const AGENT_RANKS = [
  { value: 'Agent', label: 'Agent' },
  { value: 'Sous-Officier', label: 'Sous-Officier' },
  { value: 'Inspecteur', label: 'Inspecteur' },
  { value: 'Commandant', label: 'Commandant' }
];

const Agents = () => {
  const [form] = Form.useForm();
  const {t} = useTranslation();
  const { loading, error, data, refetch } = useQuery(GET_AGENTS, {
    onCompleted: () => Loading.remove(),
    onError: () => Loading.remove(),
  });

  const [createPolice] = useMutation(ADD_AGENT, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('agents.succès_ajout'), t('agents.succès_ajout'), 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('agents.erreur_ajout'), `${t('agents.erreur_ajout')}: ${err.message}`, 'OK');
    }
  });

  const [updatePolice] = useMutation(UPDATE_AGENT, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('agents.succès_mise_a_jour'), t('agents.succès_mise_a_jour'), 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('agents.erreur_mise_a_jour'), `${t('agents.erreur_mise_a_jour')}: ${err.message}`, 'OK');
    }
  });

  const [deletePolice] = useMutation(DELETE_AGENT, {
    onCompleted: () => {
      Loading.remove();
      Report.success(t('agents.succès_suppression'), t('agents.succès_suppression'), 'OK');
      refetch();
    },
    onError: (err) => {
      Loading.remove();
      Report.failure(t('agents.erreur_suppression'), `${t('agents.erreur_suppression')}: ${err.message}`, 'OK');
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  

  const handleAddAgent = () => {
    form.validateFields().then(values => {
      Loading.hourglass(t('Ajout en cours '));
      createPolice({ variables: values });
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleEditAgent = (agent) => {
    setIsEditing(true);
    setCurrentAgent(agent);
    form.setFieldsValue(agent);
  };

  const handleUpdateAgent = () => {
    form.validateFields().then(values => {
      Loading.hourglass(t('agents.mise_a_jour_en_cours'));
      updatePolice({ variables: values });
      form.resetFields();
      setIsEditing(false);
      setCurrentAgent(null);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDeleteAgent = (badge_number) => {
    oading.hourglass(t('agents.suppression_en_cours'));
    deletePolice({ variables: { badge_number } });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.polices);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agents');
    XLSX.writeFile(wb, 'Listes_des_derniers_agents.xlsx');
  };

  if (loading) {
    Loading.hourglass(t('agents.chargement'));
    return null;
  }

  if (error) {
    Report.failure(t('agents.erreur_chargement'), t('agents.erreur_chargement'), 'OK');
    return null;
  }

  const columns = [
    {
      title: t('agents.numéro'),
      dataIndex: 'badge_number',
      key: 'badge_number',
      sorter: (a, b) => a.badge_number - b.badge_number, 
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: t('agents.nom_agent'),
      dataIndex: 'police_name',
      key: 'police_name',
    },
    {
      title: t('agents.grade'),
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <EditTwoTone onClick={() => handleEditAgent(record)} style={{ marginRight: 16 }} />
          <DeleteTwoTone onClick={() => handleDeleteAgent(record.badge_number)} />
        </span>
      ),
    },
  ];


  return (
    <motion.div
    initial={{ opacity: 0, y: 300 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="container"
  >
    <Row gutter={32}>
      <Col span={11}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="badge_number"
            label={t('agents.numéro')}
            rules={[{ required: true, message: t('Veuillez entrer le numéro') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="police_name"
            label={t('agents.nom_agent')}
            rules={[{ required: true, message: t('Veuillez entrer le nom') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rank"
            label={t('agents.grade')}
            rules={[{ required: true, message: t('Veuillez entrer le grade') }]}
          >
            <Select>
              {AGENT_RANKS.map(rank => (
                <Select.Option key={rank.value} value={rank.value}>
                  {rank.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            {isEditing ? (
              <button className='custom-button' onClick={handleUpdateAgent}>
                {t('agents.mettre_a_jour')}
              </button>
            ) : (
              <button className='custom-button' onClick={handleAddAgent}>
                {t('agents.soumettre')}
              </button>
            )}
          </Form.Item>
        </Form>
      </Col>
      <Col span={1}>
        <Divider type="vertical" className="divider" />
      </Col>
      <Col span={11}>
        <img onClick={exportToExcel} src={excel} style={{ margin : 0,marginBottom: 10 }} />
        <Table dataSource={data.polices} columns={columns} rowKey={(record) => record.badge_number} pagination={{ pageSize: 5 }} />
      </Col>
    </Row>
  </motion.div>
  );
};

export default Agents;
