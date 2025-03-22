
import React from 'react';
import { DocumentGenerationData } from '../../types';

interface UPDTableProps {
  data: DocumentGenerationData;
  formatNumber: (num: number) => string;
}

const UPDTable: React.FC<UPDTableProps> = ({ data, formatNumber }) => {
  const { items, totalWithoutVat, totalVatAmount, totalWithVat } = data;
  
  return (
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
  );
};

export default UPDTable;
