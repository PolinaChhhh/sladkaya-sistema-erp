
import React from 'react';
import { DocumentGenerationData } from '../types';
import './UPDPrintTemplate.css';

interface UPDPrintTemplateProps {
  data: DocumentGenerationData;
}

/**
 * Печатная форма УПД (Универсальный передаточный документ)
 * Соответствует формату, утвержденному Постановлением Правительства РФ
 */
const UPDPrintTemplate: React.FC<UPDPrintTemplateProps> = ({ data }) => {
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
    <div className="upd-print-container">
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
            <div className="upd-value">{buyer.name}, {buyer.legalAddress || buyer.address || ""}</div>
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

      <div className="upd-table-section">
        <table className="upd-table">
          <thead>
            <tr>
              <th rowSpan={2}>№ п/п</th>
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
              <th colSpan={2}>Регистрационный номер декларации на товары или регистрационный номер партии товара, подлежащего прослеживаемости</th>
              <th colSpan={2}>Количественная единица измерения товара, используемая в целях прослеживаемости</th>
              <th rowSpan={2}>Количество товара, подлежащего прослеживаемости, в количественной единице измерения</th>
            </tr>
            <tr className="upd-table-header-row2">
              <th>код</th>
              <th>условное обозначение (национальное)</th>
              <th>цифровой код</th>
              <th>краткое наименование</th>
              <th>Рег. номер</th>
              <th>Код</th>
              <th>Условное обозначение</th>
              <th>Код</th>
            </tr>
            <tr className="upd-column-indices">
              <td>А</td>
              <td>1</td>
              <td>1a</td>
              <td>1б</td>
              <td>2</td>
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
              <td>12</td>
              <td>12a</td>
              <td>13</td>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{data.extendedData?.products?.[item.productName]?.code || ""}</td>
                <td>796</td>
                <td>шт</td>
                <td>{item.quantity}</td>
                <td>{formatNumber(item.priceWithoutVat)}</td>
                <td>{formatNumber(item.priceWithoutVat * item.quantity)}</td>
                <td>{item.vatRate}%</td>
                <td>{formatNumber(item.vatAmount)}</td>
                <td>{formatNumber(item.totalAmount)}</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="upd-total-label">Всего к оплате</td>
              <td>{formatNumber(totalWithoutVat)}</td>
              <td>X</td>
              <td>{formatNumber(totalVatAmount)}</td>
              <td>{formatNumber(totalWithVat)}</td>
              <td colSpan={7}></td>
            </tr>
          </tfoot>
        </table>
      </div>

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
    </div>
  );
};

export default UPDPrintTemplate;
