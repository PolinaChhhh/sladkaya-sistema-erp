
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';
import { useStore } from '@/store/recipeStore';

interface UPDHeaderProps {
  shipping: ShippingDocument;
}

const UPDHeader: React.FC<UPDHeaderProps> = ({ shipping }) => {
  const { company } = useStore();

  return (
    <div className="upd-header">
      <div className="upd-header-top">
        <div className="upd-header-title">
          <div className="upd-title">Универсальный передаточный документ</div>
          <div className="upd-status-box">
            <div className="upd-status-title">Статус:</div>
            <div className="upd-checkbox-container">
              <div className="upd-checkbox checked"></div>
              <div className="upd-status-text">1 - счет-фактура и передаточный документ (акт)</div>
            </div>
            <div className="upd-checkbox-container">
              <div className="upd-checkbox"></div>
              <div className="upd-status-text">2 - передаточный документ (акт)</div>
            </div>
          </div>
        </div>
        <div className="upd-invoice-info">
          <table className="upd-invoice-table">
            <tbody>
              <tr>
                <td colSpan={2}>Счёт-фактура № {shipping.shipmentNumber} от {shipping.date}</td>
                <td className="upd-reference">(1)</td>
              </tr>
              <tr>
                <td colSpan={2}>Исправление № от</td>
                <td className="upd-reference">(1a)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="upd-appendix">
          <div className="upd-appendix-text">к постановлению Правительства РФ от 26.12.2011 № 1137</div>
          <div className="upd-appendix-text">(в редакции постановления Правительства РФ от 16.01.2024 n 1637)</div>
        </div>
      </div>

      <table className="upd-info-table">
        <tbody>
          <tr>
            <td className="upd-label">Продавец:</td>
            <td className="upd-value">{company?.name || 'Ваша компания'}</td>
            <td className="upd-reference">(2)</td>
          </tr>
          <tr>
            <td className="upd-label">Адрес:</td>
            <td className="upd-value">{company?.legalAddress || ''}</td>
            <td className="upd-reference">(2a)</td>
          </tr>
          <tr>
            <td className="upd-label">ИНН/КПП продавца:</td>
            <td className="upd-value">{company?.tin || ''}</td>
            <td className="upd-reference">(2б)</td>
          </tr>
          <tr>
            <td className="upd-label">Грузоотправитель и его адрес:</td>
            <td className="upd-value">он же</td>
            <td className="upd-reference">(3)</td>
          </tr>
          <tr>
            <td className="upd-label">Грузополучатель и его адрес:</td>
            <td className="upd-value">{shipping.buyerName} {shipping.buyerPhysicalAddress}</td>
            <td className="upd-reference">(4)</td>
          </tr>
          <tr>
            <td className="upd-label">К платежно-расчетному документу:</td>
            <td className="upd-value">№ _______________ от _______________</td>
            <td className="upd-reference">(5)</td>
          </tr>
          <tr>
            <td className="upd-label">Документ об отгрузке: наименование:</td>
            <td className="upd-value">№ {shipping.shipmentNumber} от {shipping.date}</td>
            <td className="upd-reference">(5a)</td>
          </tr>
          <tr>
            <td className="upd-label">Покупатель:</td>
            <td className="upd-value">{shipping.buyerName}</td>
            <td className="upd-reference">(6)</td>
          </tr>
          <tr>
            <td className="upd-label">Адрес:</td>
            <td className="upd-value">{shipping.buyerPhysicalAddress || ''}</td>
            <td className="upd-reference">(6a)</td>
          </tr>
          <tr>
            <td className="upd-label">ИНН/КПП покупателя:</td>
            <td className="upd-value">{shipping.buyerTin || ''}</td>
            <td className="upd-reference">(6б)</td>
          </tr>
          <tr>
            <td className="upd-label">Валюта: наименование, код:</td>
            <td className="upd-value">российский рубль, 643</td>
            <td className="upd-reference">(7)</td>
          </tr>
          <tr>
            <td className="upd-label">Идентификатор государственного контракта, договора (соглашения) (при наличии):</td>
            <td className="upd-value"></td>
            <td className="upd-reference">(8)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UPDHeader;
