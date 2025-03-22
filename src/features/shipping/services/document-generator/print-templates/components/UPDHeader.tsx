
import React from 'react';
import { DocumentGenerationData } from '../../types';

interface UPDHeaderProps {
  data: DocumentGenerationData;
  formatDate: (dateString: string) => string;
}

const UPDHeader: React.FC<UPDHeaderProps> = ({ data, formatDate }) => {
  const { shipping, buyer } = data;
  
  return (
    <div className="upd-header">
      <div className="upd-title-container">
        <div className="upd-title-section">
          <h1 className="upd-title">УПД</h1>
          <div className="upd-status">
            <p>Статус:</p>
            <p>Счет-фактура и<br />передаточный<br />документ № 1</p>
          </div>
        </div>
        <div className="upd-document-number">
          <h2>Счет-фактура № {shipping.shipmentNumber} от {formatDate(shipping.date)}</h2>
          <p className="upd-correction">Исправление № — от —</p>
        </div>
        <div className="upd-reference-numbers">
          <p>(1)</p>
          <p>(1a)</p>
        </div>
      </div>

      <div className="upd-info-section">
        <div className="upd-info-row">
          <div className="upd-label">Продавец:</div>
          <div className="upd-value">{data.extendedData?.company?.name || "ООО \"Ваша компания\""}</div>
          <div className="upd-reference">(2)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Адрес:</div>
          <div className="upd-value">
            {data.extendedData?.company?.address?.index || "123456"}, 
            {data.extendedData?.company?.address?.regionName || "г. Москва"}, 
            {data.extendedData?.company?.address?.city || "Москва"}, 
            {data.extendedData?.company?.address?.street || "ул. Примерная"}, 
            {data.extendedData?.company?.address?.house || "1"}
          </div>
          <div className="upd-reference">(2a)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">ИНН/КПП:</div>
          <div className="upd-value">
            {data.extendedData?.company?.inn || "1234567890"} / 
            {data.extendedData?.company?.kpp || "123456789"}
          </div>
          <div className="upd-reference">(2б)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Грузоотправитель и его адрес:</div>
          <div className="upd-value">{data.extendedData?.company?.name || "ООО \"Ваша компания\""}, {data.extendedData?.company?.address?.city || "Москва"}</div>
          <div className="upd-reference">(3)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Грузополучатель и его адрес:</div>
          <div className="upd-value">{buyer.name}, {buyer.physicalAddress || buyer.legalAddress || buyer.address || ""}</div>
          <div className="upd-reference">(4)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">К платежно-расчетному документу:</div>
          <div className="upd-value">—</div>
          <div className="upd-reference">(5)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Документ об отгрузке:</div>
          <div className="upd-value">№ {shipping.shipmentNumber} от {formatDate(shipping.date)}</div>
          <div className="upd-reference">(5a)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Покупатель:</div>
          <div className="upd-value">{buyer.name}</div>
          <div className="upd-reference">(6)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Адрес:</div>
          <div className="upd-value">{buyer.legalAddress || buyer.address || ""}</div>
          <div className="upd-reference">(6a)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Юридический адрес:</div>
          <div className="upd-value">{buyer.legalAddress || ""}</div>
          <div className="upd-reference">(6a-1)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Фактический адрес:</div>
          <div className="upd-value">{buyer.physicalAddress || ""}</div>
          <div className="upd-reference">(6a-2)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">ИНН/КПП:</div>
          <div className="upd-value">{buyer.tin || ""} / {buyer.kpp || ""}</div>
          <div className="upd-reference">(6б)</div>
        </div>
        
        <div className="upd-info-row">
          <div className="upd-label">Валюта: наименование, код:</div>
          <div className="upd-value">Российский рубль, 643</div>
          <div className="upd-reference">(7)</div>
        </div>
      </div>
    </div>
  );
};

export default UPDHeader;
