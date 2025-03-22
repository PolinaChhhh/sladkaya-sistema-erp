
import React from 'react';
import { useStore } from '@/store/recipeStore';

const UPDSignatures: React.FC = () => {
  const { company } = useStore();

  return (
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
  );
};

export default UPDSignatures;
