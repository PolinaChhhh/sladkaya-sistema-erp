import React from 'react';
import { useStore } from '@/store/recipeStore';
import { ShippingDocument } from '@/store/types/shipping';
import '../styles/upd/index.css';

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
      
      <div className="upd-table-section">
        <table className="upd-items-table">
          <thead>
            <tr>
              <th rowSpan={2}>№ п/п</th>
              <th rowSpan={2}>Наименование товара (описание выполненных работ, оказанных услуг), имущественного права</th>
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
              <td>1</td>
              <td>1а</td>
              <td>1б</td>
              <td>2</td>
              <td>2а</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
              <td>10а</td>
              <td>11</td>
            </tr>
          </thead>
          <tbody>
            {shipping.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>-</td>
                <td>796</td>
                <td>шт</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
                <td>без акциза</td>
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
              <td colSpan={7}>Всего к оплате (9)</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</td>
              <td>X</td>
              <td>X</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity * (item.vatRate / 100), 0).toFixed(2)}</td>
              <td>{shipping.items.reduce((sum, item) => sum + item.price * item.quantity * (1 + item.vatRate / 100), 0).toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="upd-footer">
        <div className="upd-document-info">
          <div className="upd-document-row">
            <span>Документ составлен на</span>
            <span className="upd-document-pages">листах</span>
          </div>
        </div>
        
        <div className="upd-signatures-section">
          <table className="upd-signatures-table">
            <tbody>
              <tr>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Руководитель организации или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <div className="upd-signature-placeholder">(подпись)</div>
                    <div className="upd-signature-name">{company?.contactPerson || ''}</div>
                  </div>
                  <div className="upd-signature-caption">
                    <span></span>
                    <span>(Ф.И.О.)</span>
                  </div>
                </td>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Главный бухгалтер или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <div className="upd-signature-placeholder">(подпись)</div>
                    <div className="upd-signature-name"></div>
                  </div>
                  <div className="upd-signature-caption">
                    <span></span>
                    <span>(Ф.И.О.)</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="upd-signature-cell">
                  <div className="upd-signature-title">Индивидуальный предприниматель или иное уполномоченное лицо</div>
                  <div className="upd-signature-line">
                    <div className="upd-signature-placeholder">(подпись)</div>
                    <div className="upd-signature-name"></div>
                  </div>
                  <div className="upd-signature-caption">
                    <span></span>
                    <span>(Ф.И.О.)</span>
                  </div>
                </td>
                <td className="upd-signature-cell">
                  <div className="upd-signature-extra">(реквизиты свидетельства о государственной регистрации индивидуального предпринимателя)</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="upd-transfer-receive-section">
          <div className="upd-foundation">
            <div className="upd-foundation-label">Основание передачи (сдачи) / получения (приемки)</div>
            <div className="upd-foundation-value">(договор, доверенность и др.)</div>
            <div className="upd-reference">(10)</div>
          </div>
          
          <div className="upd-transportation">
            <div className="upd-transportation-label">Данные о транспортировке и грузе</div>
            <div className="upd-transportation-value">(транспортная накладная, поручение экспедитору, экспедиторская / складская расписка и др., масса нетто / брутто груза, если не приведены ссылки на транспортные документы, содержащие эти сведения)</div>
            <div className="upd-reference">(11)</div>
          </div>
          
          <div className="upd-transfer-receive-grid">
            <div className="upd-transfer">
              <div className="upd-transfer-title">
                <span>Товар (груз) передал / услуги, результаты работ, права сдал</span>
                <span className="upd-reference">(12)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">(должность)</span>
                <span className="upd-transfer-signature">(подпись)</span>
                <span className="upd-transfer-name">(Ф.И.О.)</span>
                <span className="upd-reference">(13)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">Дата отгрузки, передачи (сдачи)</span>
                <span className="upd-transfer-date">«     »                         20     г.</span>
                <span className="upd-reference">(14)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">Иные сведения об отгрузке, передаче</span>
                <span className="upd-transfer-value">(ссылки на неотъемлемые приложения, сопутствующие документы, иные документы и т.п.)</span>
                <span className="upd-reference">(15)</span>
              </div>
              
              <div className="upd-responsible">
                <div className="upd-responsible-title">
                  <span>Ответственный за правильность оформления факта хозяйственной жизни</span>
                </div>
                
                <div className="upd-transfer-row">
                  <span className="upd-transfer-label">(должность)</span>
                  <span className="upd-transfer-signature">(подпись)</span>
                  <span className="upd-transfer-name">(Ф.И.О.)</span>
                  <span className="upd-reference">(16)</span>
                </div>
              </div>
              
              <div className="upd-entity">
                <span>Наименование экономического субъекта – составителя документа (в т.ч. комиссионера / агента)</span>
                <div className="upd-entity-value">(может не заполняться при проставлении печати в М.П., может быть указан ИНН / КПП)</div>
                <div className="upd-entity-stamp">М.П.</div>
              </div>
            </div>
            
            <div className="upd-receive">
              <div className="upd-receive-title">
                <span>Товар (груз) получил / услуги, результаты работ, права принял</span>
                <span className="upd-reference">(17)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">(должность)</span>
                <span className="upd-transfer-signature">(подпись)</span>
                <span className="upd-transfer-name">(Ф.И.О.)</span>
                <span className="upd-reference">(18)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">Дата получения (приемки)</span>
                <span className="upd-transfer-date">«     »                         20     г.</span>
                <span className="upd-reference">(19)</span>
              </div>
              
              <div className="upd-transfer-row">
                <span className="upd-transfer-label">Иные сведения о получении, приемке</span>
                <span className="upd-transfer-value">(информация о наличии/отсутствии претензии; ссылки на неотъемлемые приложения и другие документы и т.п.)</span>
                <span className="upd-reference">(20)</span>
              </div>
              
              <div className="upd-responsible">
                <div className="upd-responsible-title">
                  <span>Ответственный за правильность оформления факта хозяйственной жизни</span>
                </div>
                
                <div className="upd-transfer-row">
                  <span className="upd-transfer-label">(должность)</span>
                  <span className="upd-transfer-signature">(подпись)</span>
                  <span className="upd-transfer-name">(Ф.И.О.)</span>
                  <span className="upd-reference">(21)</span>
                </div>
              </div>
              
              <div className="upd-entity">
                <span>Наименование экономического субъекта – составителя документа</span>
                <div className="upd-entity-value">(может не заполняться при проставлении печати в М.П., может быть указан ИНН / КПП)</div>
                <div className="upd-entity-stamp">М.П.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPDTemplate;
