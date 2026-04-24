import { Trash2 } from 'lucide-react';
import CartLineItem from './CartLineItem';

export default function CartItemsPanel({ cart, onRemoveItem, onUpdateQuantity, onClearAll }) {
  return (
    <div className='cart__panel'>
      <div className='cart__table-head-row cart__item-grid' role='row'>
        <div className='cart__table-head-cell cart__item-cell--product'>Product</div>
        <div className='cart__table-head-cell cart__table-head-cell--center cart__item-cell--price'>
          Price
        </div>
        <div className='cart__table-head-cell cart__table-head-cell--center cart__item-cell--qty'>
          Qty
        </div>
        <div className='cart__table-head-cell cart__table-head-cell--center cart__item-cell--total'>
          Total
        </div>
        <div className='cart__table-head-cell cart__item-cell--remove' />
      </div>

      <div className='cart__divide'>
        {cart.map((item) => (
          <CartLineItem
            key={item.id}
            item={item}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>

      <div className='cart__panel-foot'>
        <button type='button' className='cart__clear' onClick={onClearAll}>
          <Trash2 className='icon' strokeWidth={2} aria-hidden />
          Clear all items
        </button>
      </div>
    </div>
  );
}
