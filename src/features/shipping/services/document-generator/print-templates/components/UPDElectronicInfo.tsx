
import React from 'react';
import { DocumentGenerationData } from '../../types';

interface UPDElectronicInfoProps {
  data: DocumentGenerationData;
}

const UPDElectronicInfo: React.FC<UPDElectronicInfoProps> = ({ data }) => {
  return (
    <div className="upd-edo-section">
      <p className="upd-doc-id">Идентификатор документа 25ad22a-811c-41cd-bd01-8e49ed736fc6</p>
      <div className="upd-edo-info">
        <p className="upd-edo-title">Документ подписан и передан через оператора ЭДО АО «ТП «СКБ Контур»</p>
        
        <div className="upd-edo-grid">
          <div className="upd-edo-row">
            <div className="upd-edo-label">Владелец сертификата: организация, сотрудник</div>
            <div className="upd-edo-value"><span className="upd-edo-cert-icon">🔒</span> {data.extendedData?.signer?.lastName || "Иванова"} {data.extendedData?.signer?.firstName || "Лидия"} {data.extendedData?.signer?.middleName || "Андреевна"}</div>
          </div>
          
          <div className="upd-edo-row">
            <div className="upd-edo-label">Сертификат: серийный номер, период действия</div>
            <div className="upd-edo-value">01F51B84DF2A6D7904D0883386A54FD71<br />с 26.01.2023 13:49 по 08.10.2021 13:49 GMT+03:00</div>
          </div>
          
          <div className="upd-edo-row">
            <div className="upd-edo-label">Дата и время подписания</div>
            <div className="upd-edo-value">01.07.2021 19:44 GMT+03:00<br />Подпись соответствует файлу документа</div>
          </div>
          
          <div className="upd-edo-row">
            <div className="upd-edo-label">Подпись отправителя</div>
            <div className="upd-edo-value"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPDElectronicInfo;
