
import React from 'react';
import { ShippingDocument } from '@/store/types/shipping';

interface UPDTableProps {
  shipping: ShippingDocument;
}

const UPDTable: React.FC<UPDTableProps> = ({ shipping }) => {
  return (
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
  );
};

export default UPDTable;
