
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';

interface UPDFooterProps {
  shipping: ShippingDocument;
}

const UPDFooter: React.FC<UPDFooterProps> = ({ shipping }) => {
  return (
    <div className="upd-footer">
      <div className="upd-document-info">
        <div className="upd-document-row">
          <span>Документ составлен на</span>
          <span className="upd-document-pages">листах</span>
        </div>
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
  );
};

export default UPDFooter;
