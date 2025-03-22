
import React from 'react';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument } from '@/store/types/shipping';
import './UPDTemplate.css';

interface UPDTemplateProps {
  shipping: ShippingDocument;
}

const UPDTemplate: React.FC<UPDTemplateProps> = ({ shipping }) => {
  const { company } = useStore();
  
  return (
    <div className="upd-container">
      <div className="upd-header">
        <div className="upd-header-top">
          <div className="upd-header-title">
            <div className="upd-title">УПД</div>
          </div>
          <div className="upd-invoice-info">
            <table className="upd-invoice-table">
              <tbody>
                <tr>
                  <td colSpan={2}>Счёт-фактура № {shipping.shipmentNumber} от {shipping.date}</td>
                </tr>
                <tr>
                  <td colSpan={2}>Исправление № -- от --</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="upd-appendix">
            <div className="upd-appendix-number">Приложение № 1</div>
            <div className="upd-appendix-text">к постановлению Правительства Российской Федерации от 26 декабря 2011 г. № 1137</div>
          </div>
        </div>
        
        <div className="upd-status-section">
          <div className="upd-status-title">Статус:</div>
          <div className="upd-status-box">
            <div className="upd-status-checkbox">
              <div className="upd-checkbox checked"></div>
              <div className="upd-status-text">1 - счет-фактура и передаточный документ (акт)</div>
            </div>
            <div className="upd-status-checkbox">
              <div className="upd-checkbox"></div>
              <div className="upd-status-text">2 - передаточный документ (акт)</div>
            </div>
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
              <td className="upd-label">ИНН/КПП продавца:</td>
              <td className="upd-value">{company?.tin || ''}</td>
              <td className="upd-reference">(2a)</td>
            </tr>
            <tr>
              <td className="upd-label">Юридический адрес:</td>
              <td className="upd-value">{company?.legalAddress || ''}</td>
              <td className="upd-reference">(2б)</td>
            </tr>
            <tr>
              <td className="upd-label">Фактический адрес:</td>
              <td className="upd-value">{company?.physicalAddress || ''}</td>
              <td className="upd-reference">(2в)</td>
            </tr>
            <tr>
              <td className="upd-label">Грузоотправитель и его адрес:</td>
              <td className="upd-value">{company?.name || 'Ваша компания'}</td>
              <td className="upd-reference">(3)</td>
            </tr>
            <tr>
              <td className="upd-label">Грузополучатель и его адрес:</td>
              <td className="upd-value">{shipping.buyerName}</td>
              <td className="upd-reference">(4)</td>
            </tr>
            <tr>
              <td className="upd-label">К платежно-расчетному документу:</td>
              <td className="upd-value">№ от</td>
              <td className="upd-reference">(5)</td>
            </tr>
            <tr>
              <td className="upd-label">Покупатель:</td>
              <td className="upd-value">{shipping.buyerName}</td>
              <td className="upd-reference">(6)</td>
            </tr>
            <tr>
              <td className="upd-label">ИНН/КПП покупателя:</td>
              <td className="upd-value"></td>
              <td className="upd-reference">(6a)</td>
            </tr>
            <tr>
              <td className="upd-label">Юридический адрес:</td>
              <td className="upd-value"></td>
              <td className="upd-reference">(6б)</td>
            </tr>
            <tr>
              <td className="upd-label">Фактический адрес:</td>
              <td className="upd-value"></td>
              <td className="upd-reference">(6в)</td>
            </tr>
            <tr>
              <td className="upd-label">Валюта: наименование, код:</td>
              <td className="upd-value">Российский рубль, 643</td>
              <td className="upd-reference">(7)</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="upd-table-section">
        <table className="upd-items-table">
          <thead>
            <tr>
              <th rowSpan={2}>№</th>
              <th rowSpan={2}>Наименование товара (описание выполненных работ, оказанных услуг), имущественного права</th>
              <th rowSpan={2}>Код вида товара</th>
              <th colSpan={2}>Единица измерения</th>
              <th rowSpan={2}>Количество (объем)</th>
              <th rowSpan={2}>Цена (тариф) за единицу измерения</th>
              <th rowSpan={2}>Стоимость товаров (работ, услуг), имущественных прав без налога - всего</th>
              <th rowSpan={2}>Налоговая ставка</th>
              <th rowSpan={2}>Сумма налога, предъявляемая покупателю</th>
              <th rowSpan={2}>Стоимость товаров (работ, услуг), имущественных прав с налогом - всего</th>
              <th colSpan={2}>Страна происхождения товара</th>
              <th rowSpan={2}>Регистрационный номер таможенной декларации</th>
            </tr>
            <tr>
              <th>код</th>
              <th>условное обозначение</th>
              <th>цифровой код</th>
              <th>краткое наименование</th>
            </tr>
            <tr className="upd-column-indices">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
              <td>11</td>
              <td>12</td>
              <td>13</td>
              <td>14</td>
            </tr>
          </thead>
          <tbody>
            {shipping.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td></td>
                <td>796</td>
                <td>шт</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
                <td>{item.vatRate}%</td>
                <td>{(item.price * item.quantity * (item.vatRate / 100)).toFixed(2)}</td>
                <td>{(item.price * item.quantity * (1 + item.vatRate / 100)).toFixed(2)}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="upd-total-row">
              <td colSpan={7}>Всего к оплате</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</td>
              <td>X</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity * (item.vatRate / 100), 0).toFixed(2)}</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity * (1 + item.vatRate / 100), 0).toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="upd-footer">
        <div className="upd-signatures-section">
          <table className="upd-signatures-table">
            <tbody>
              <tr>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Руководитель организации или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <div className="upd-signature-placeholder"></div>
                    <div className="upd-signature-name">{company?.contactPerson || ''}</div>
                  </div>
                  <div className="upd-signature-caption">
                    <span>подпись</span>
                    <span>ФИО</span>
                  </div>
                </td>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Главный бухгалтер или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <div className="upd-signature-placeholder"></div>
                    <div className="upd-signature-name">{company?.contactPerson || ''}</div>
                  </div>
                  <div className="upd-signature-caption">
                    <span>подпись</span>
                    <span>ФИО</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UPDTemplate;
