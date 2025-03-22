
import React from 'react';
import { DocumentGenerationData } from '../../types';

interface UPDSignaturesProps {
  data: DocumentGenerationData;
}

const UPDSignatures: React.FC<UPDSignaturesProps> = ({ data }) => {
  return (
    <div className="upd-signatures">
      <div className="upd-signature-section">
        <p>Руководитель организации или иное уполномоченное лицо</p>
        <div className="upd-signature-line">
          <span className="upd-signature-placeholder">Электронная подпись</span>
          <span className="upd-signature-name">{
            data.extendedData?.signer 
              ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
              : "Иванов И.И."
          }</span>
        </div>
        <div className="upd-signature-description">
          <span>Подпись</span>
          <span>ФИО</span>
        </div>
      </div>
    </div>
  );
};

export default UPDSignatures;
