
import React from 'react';
import { DocumentGenerationData } from '../../../services/document-generator/types';
import './UPDTemplate.css';

interface UPDTemplateProps {
  data: DocumentGenerationData;
}

const UPDTemplate: React.FC<UPDTemplateProps> = ({ data }) => {
  const { shipping, buyer, items, totalWithoutVat, totalVatAmount, totalWithVat } = data;
  
  // Форматирование числа с разделителем тысяч и двумя десятичными
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  // Форматирование даты в формате дд.мм.гггг
  const formatDate = (dateString: string): string => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateString;
  };

  return (
    <div className="upd-container">
      <div className="upd-header">
        <div className="upd-title">Универсальный передаточный документ</div>
        
        <table className="upd-info-table">
          <tbody>
            <tr>
              <td className="upd-label">Счет-фактура №</td>
              <td className="upd-value">{shipping.shipmentNumber}</td>
              <td className="upd-label">от</td>
              <td className="upd-value">{formatDate(shipping.date)}</td>
              <td className="upd-reference">(1)</td>
            </tr>
            <tr>
              <td className="upd-label">Исправление №</td>
              <td className="upd-value">—</td>
              <td className="upd-label">от</td>
              <td className="upd-value">—</td>
              <td className="upd-reference">(1a)</td>
            </tr>
          </tbody>
        </table>

        <div className="upd-status-box">
          <div className="upd-status-title">Статус:</div>
          <div className="upd-status-checkbox">
            <div className="upd-checkbox checked"></div>
            <div className="upd-status-text">1 - счет-фактура и передаточный документ (акт)</div>
          </div>
          <div className="upd-status-checkbox">
            <div className="upd-checkbox"></div>
            <div className="upd-status-text">2 - передаточный документ (акт)</div>
          </div>
        </div>
        
        <table className="upd-info-table">
          <tbody>
            <tr>
              <td className="upd-label">Продавец:</td>
              <td className="upd-value">{data.extendedData?.company?.name || "ООО \"Ваша компания\""}</td>
              <td className="upd-reference">(2)</td>
            </tr>
            <tr>
              <td className="upd-label">Адрес:</td>
              <td className="upd-value">{data.extendedData?.company?.legalAddress || "г. Москва, ул. Примерная, д. 1"}</td>
              <td className="upd-reference">(2a)</td>
            </tr>
            <tr>
              <td className="upd-label">ИНН/КПП продавца:</td>
              <td className="upd-value">{data.extendedData?.company?.tin || "1234567890"}</td>
              <td className="upd-reference">(2б)</td>
            </tr>
            <tr>
              <td className="upd-label">Грузоотправитель и его адрес:</td>
              <td className="upd-value">он же</td>
              <td className="upd-reference">(3)</td>
            </tr>
            <tr>
              <td className="upd-label">Грузополучатель и его адрес:</td>
              <td className="upd-value">
                {buyer.name}, {buyer.tin}, {buyer.legalAddress}, {buyer.physicalAddress}
              </td>
              <td className="upd-reference">(4)</td>
            </tr>
            <tr>
              <td className="upd-label">К платежно-расчетному документу:</td>
              <td className="upd-value">№ — от —</td>
              <td className="upd-reference">(5)</td>
            </tr>
            <tr>
              <td className="upd-label">Документ об отгрузке: наименование,</td>
              <td className="upd-value">№ {shipping.shipmentNumber} от {formatDate(shipping.date)}</td>
              <td className="upd-reference">(5a)</td>
            </tr>
            <tr>
              <td className="upd-label">Покупатель:</td>
              <td className="upd-value">{buyer.name}</td>
              <td className="upd-reference">(6)</td>
            </tr>
            <tr>
              <td className="upd-label">Адрес:</td>
              <td className="upd-value">{buyer.physicalAddress || buyer.legalAddress || ""}</td>
              <td className="upd-reference">(6a)</td>
            </tr>
            <tr>
              <td className="upd-label">ИНН/КПП покупателя:</td>
              <td className="upd-value">{buyer.tin}</td>
              <td className="upd-reference">(6б)</td>
            </tr>
            <tr>
              <td className="upd-label">Валюта: наименование, код:</td>
              <td className="upd-value">российский рубль, 643</td>
              <td className="upd-reference">(7)</td>
            </tr>
          </tbody>
        </table>

        <table className="upd-contract-table">
          <tbody>
            <tr>
              <td className="upd-label">Идентификатор государственного контракта, договора (соглашения) (при наличии):</td>
              <td className="upd-value">—</td>
              <td className="upd-reference">(8)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="upd-table-section">
        <table className="upd-items-table">
          <thead>
            <tr>
              <th rowSpan={2}>Код товара/ работ, услуг</th>
              <th rowSpan={2}>№ п/п</th>
              <th rowSpan={2} className="upd-wide-col">
                Наименование товара (описание выполненных работ, оказанных услуг), имущественного права
              </th>
              <th rowSpan={2}>Код вида товара</th>
              <th colSpan={2}>Единица измерения</th>
              <th rowSpan={2}>Количество (объем)</th>
              <th rowSpan={2}>Цена (тариф) за единицу измерения</th>
              <th rowSpan={2}>Стоимость товаров (работ, услуг), имущественных прав без налога - всего</th>
              <th rowSpan={2}>В том числе сумма акциза</th>
              <th rowSpan={2}>Налоговая ставка</th>
              <th rowSpan={2}>Сумма налога, предъявляемая покупателю</th>
              <th rowSpan={2}>Стоимость товаров (работ, услуг), имущественных прав с налогом - всего</th>
              <th colSpan={2}>Страна происхождения товара</th>
              <th rowSpan={2}>Регистрационный номер декларации на товары или регистрационный номер партии товара, подлежащего прослеживаемости</th>
            </tr>
            <tr>
              <th>код</th>
              <th>условное обозначение (национальное)</th>
              <th>цифровой код</th>
              <th>краткое наименование</th>
            </tr>
            <tr className="upd-column-indices">
              <td>A</td>
              <td>1</td>
              <td>1a</td>
              <td>1б</td>
              <td>2</td>
              <td>2a</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
              <td>10a</td>
              <td>11</td>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>—</td>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>—</td>
                <td>796</td>
                <td>шт</td>
                <td>{item.quantity}</td>
                <td>{formatNumber(item.priceWithoutVat)}</td>
                <td>{formatNumber(item.priceWithoutVat * item.quantity)}</td>
                <td>без акциза</td>
                <td>{item.vatRate}%</td>
                <td>{formatNumber(item.vatAmount)}</td>
                <td>{formatNumber(item.totalAmount)}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            ))}
            <tr className="upd-total-row">
              <td colSpan={8}>Всего к оплате (9)</td>
              <td>{formatNumber(totalWithoutVat)}</td>
              <td>X</td>
              <td>{items[0]?.vatRate || "20"}%</td>
              <td>{formatNumber(totalVatAmount)}</td>
              <td>{formatNumber(totalWithVat)}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
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
                    <span className="upd-signature-placeholder"></span>
                    <span className="upd-signature-name">{
                      data.extendedData?.signer 
                        ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
                        : "Иванов И.И."
                    }</span>
                  </div>
                  <div className="upd-signature-caption">
                    <span>подпись</span>
                    <span>ФИО</span>
                  </div>
                </td>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Главный бухгалтер или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <span className="upd-signature-placeholder"></span>
                    <span className="upd-signature-name">{
                      data.extendedData?.accountant 
                        ? `${data.extendedData.accountant.lastName} ${data.extendedData.accountant.firstName[0]}.${data.extendedData.accountant.middleName[0]}.` 
                        : "Петрова П.П."
                    }</span>
                  </div>
                  <div className="upd-signature-caption">
                    <span>подпись</span>
                    <span>ФИО</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="upd-ip-signature">
                  <div className="upd-signature-title">Индивидуальный предприниматель или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <span className="upd-signature-placeholder"></span>
                    <span className="upd-signature-name"></span>
                    <span className="upd-signature-registration"></span>
                  </div>
                  <div className="upd-signature-caption">
                    <span>подпись</span>
                    <span>ФИО</span>
                    <span>реквизиты свидетельства о государственной регистрации индивидуального предпринимателя</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="upd-foundation-section">
          <table className="upd-foundation-table">
            <tbody>
              <tr>
                <td className="upd-label">Основание передачи (сдачи) / получения (приемки)</td>
                <td className="upd-value">Договор поставки</td>
                <td className="upd-reference">(10)</td>
              </tr>
              <tr>
                <td className="upd-label">Данные о транспортировке и грузе</td>
                <td className="upd-value">—</td>
                <td className="upd-reference">(11)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="upd-transfer-receive-section">
          <div className="upd-transfer-section">
            <div className="upd-section-title">Товар (груз) передал / услуги, результаты работ, права сдал</div>
            
            <table className="upd-transfer-table">
              <tbody>
                <tr>
                  <td className="upd-label">Должность</td>
                  <td className="upd-signature-line">
                    <span className="upd-signature-placeholder"></span>
                    <span className="upd-signature-name">{
                      data.extendedData?.signer 
                        ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
                        : "Иванов И.И."
                    }</span>
                  </td>
                  <td className="upd-reference">(12)</td>
                </tr>
                <tr>
                  <td className="upd-label">Дата отгрузки, передачи (сдачи)</td>
                  <td className="upd-value">{formatDate(shipping.date)}</td>
                  <td className="upd-reference">(13)</td>
                </tr>
                <tr>
                  <td className="upd-label">Иные сведения об отгрузке, передаче</td>
                  <td className="upd-value">—</td>
                  <td className="upd-reference">(14)</td>
                </tr>
              </tbody>
            </table>
            
            <div className="upd-responsible-section">
              <div className="upd-section-title">Ответственный за правильность оформления факта хозяйственной жизни</div>
              
              <table className="upd-responsible-table">
                <tbody>
                  <tr>
                    <td className="upd-label">Должность</td>
                    <td className="upd-signature-line">
                      <span className="upd-signature-placeholder"></span>
                      <span className="upd-signature-name">{
                        data.extendedData?.signer 
                          ? `${data.extendedData.signer.lastName} ${data.extendedData.signer.firstName[0]}.${data.extendedData.signer.middleName[0]}.` 
                          : "Иванов И.И."
                      }</span>
                    </td>
                    <td className="upd-reference">(15)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="upd-entity-section">
              <div className="upd-section-title">Наименование экономического субъекта – составителя документа (в т.ч. комиссионера / агента)</div>
              
              <table className="upd-entity-table">
                <tbody>
                  <tr>
                    <td className="upd-value">{data.extendedData?.company?.name || "ООО \"Ваша компания\""}</td>
                    <td className="upd-reference">(16)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="upd-receive-section">
            <div className="upd-section-title">Товар (груз) получил / услуги, результаты работ, права принял</div>
            
            <table className="upd-receive-table">
              <tbody>
                <tr>
                  <td className="upd-label">Должность</td>
                  <td className="upd-signature-line">
                    <span className="upd-signature-placeholder"></span>
                    <span className="upd-signature-name"></span>
                  </td>
                  <td className="upd-reference">(17)</td>
                </tr>
                <tr>
                  <td className="upd-label">Дата получения (приемки)</td>
                  <td className="upd-value">«_____» _______________ 20___ г.</td>
                  <td className="upd-reference">(18)</td>
                </tr>
                <tr>
                  <td className="upd-label">Иные сведения о получении, приемке</td>
                  <td className="upd-value">—</td>
                  <td className="upd-reference">(19)</td>
                </tr>
              </tbody>
            </table>
            
            <div className="upd-responsible-section">
              <div className="upd-section-title">Ответственный за правильность оформления факта хозяйственной жизни</div>
              
              <table className="upd-responsible-table">
                <tbody>
                  <tr>
                    <td className="upd-label">Должность</td>
                    <td className="upd-signature-line">
                      <span className="upd-signature-placeholder"></span>
                      <span className="upd-signature-name"></span>
                    </td>
                    <td className="upd-reference">(20)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="upd-entity-section">
              <div className="upd-section-title">Наименование экономического субъекта – составителя документа</div>
              
              <table className="upd-entity-table">
                <tbody>
                  <tr>
                    <td className="upd-value">{buyer.name}</td>
                    <td className="upd-reference">(21)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPDTemplate;
