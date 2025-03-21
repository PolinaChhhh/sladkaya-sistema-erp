
import { Receipt } from '../../types';

/**
 * Get receipt items for an ingredient sorted by date (FIFO)
 */
export const getFifoReceiptItems = (
  ingredientId: string,
  receipts: Receipt[]
) => {
  return receipts
    .flatMap(receipt => receipt.items
      .filter(item => item.ingredientId === ingredientId && item.remainingQuantity > 0)
      .map(item => ({
        ...item,
        receiptId: receipt.id,
        receiptDate: receipt.date,
        referenceNumber: receipt.referenceNumber
      }))
    )
    .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
};
