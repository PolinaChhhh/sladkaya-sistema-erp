
import React from 'react';
import { DocumentGenerationData } from '../../types';

interface UPDFooterProps {
  data: DocumentGenerationData;
  formatDate: (dateString: string) => string;
}

const UPDFooter: React.FC<UPDFooterProps> = ({ data, formatDate }) => {
  const { shipping, buyer } = data;
  
  return (
    <div className="upd-footer">
      <div className="upd-foundation">
        <p>Основание передачи (сдачи) / получения (приемки)</p>
        <p className="upd-foundation-value">Без документа-основания</p>
        <p className="upd-reference">(8)</p>
      </div>
      
      <div className="upd-transportation">
        <p>Данные о транспортировке и грузе</p>
        <p className="upd-transportation-value">—</p>
        <p className="upd-reference">(9)</p>
      </div>

      <div className="upd-transfer-receive">
        <div className="upd-transfer">
          <h3>Товар (груз) передал / услуги, результаты работ, права сдал</h3>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Должность</span>
            <span className="upd-transfer-value">{data.extendedData?.signer?.position || "Генеральный директор"}</span>
            <span className="upd-transfer-signature-placeholder">ФИО</span>
            <span className="upd-reference">(10)</span>
          </div>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Дата отгрузки, передачи (сдачи)</span>
            <span className="upd-transfer-value">{formatDate(shipping.date)}</span>
            <span className="upd-reference">(11)</span>
          </div>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Иные сведения</span>
            <span className="upd-transfer-value">—</span>
            <span className="upd-reference">(12)</span>
          </div>
          
          <div className="upd-responsible">
            <p>Ответственный за правильность оформления факта хозяйственной жизни</p>
            
            <div className="upd-transfer-row">
              <span className="upd-transfer-label">Должность</span>
              <span className="upd-transfer-signature-placeholder">Электронная подпись</span>
              <span className="upd-transfer-value">{
                data.extendedData?.signer 
                  ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
                  : "Иванов И.И."
              }</span>
              <span className="upd-reference">(13)</span>
            </div>
          </div>
          
          <div className="upd-entity">
            <p>Наименование экономического субъекта — составителя документа (в т.ч. комиссионера/агента)</p>
            
            <div className="upd-transfer-row">
              <span className="upd-transfer-value">{buyer.tin || ""} / {buyer.kpp || ""}</span>
              <span className="upd-reference">(14)</span>
            </div>
            <div className="upd-transfer-row">
              <span className="upd-transfer-description">Может не заполняться при проставлении печати в М.П., может быть указан ИНН/КПП</span>
            </div>
          </div>
        </div>
        
        <div className="upd-receive">
          <h3>Результаты приемки</h3>
          
          <div className="upd-receive-title">
            <p>Товар (груз) получил / услуги, результаты работ, права принял</p>
            <span className="upd-reference">(15)</span>
          </div>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Должность</span>
            <span className="upd-transfer-signature-placeholder">ФИО</span>
            <span className="upd-reference">(16)</span>
          </div>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Дата получения (приемки)</span>
            <span className="upd-transfer-value"></span>
            <span className="upd-reference">(17)</span>
          </div>
          
          <div className="upd-transfer-row">
            <span className="upd-transfer-label">Иные сведения</span>
            <span className="upd-transfer-value"></span>
          </div>
          
          <div className="upd-responsible">
            <p>Ответственный за правильность оформления факта хозяйственной жизни</p>
            
            <div className="upd-transfer-row">
              <span className="upd-transfer-label">Должность</span>
              <span className="upd-transfer-signature-placeholder">Электронная подпись</span>
              <span className="upd-transfer-value">{
                data.extendedData?.signer 
                  ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
                  : "Иванов И.И."
              }</span>
              <span className="upd-reference">(18)</span>
            </div>
          </div>
          
          <div className="upd-entity">
            <p>Наименование экономического субъекта — составителя документа</p>
            
            <div className="upd-transfer-row">
              <span className="upd-transfer-value">{buyer.tin || ""} / {buyer.kpp || ""}</span>
              <span className="upd-reference">(19)</span>
            </div>
            <div className="upd-transfer-row">
              <span className="upd-transfer-description">Может не заполняться при проставлении печати в М.П., может быть указан ИНН/КПП</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPDFooter;
