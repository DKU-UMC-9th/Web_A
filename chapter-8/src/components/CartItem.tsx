import React from 'react';
import type { CartItem as ItemType } from '../constants/cartItems';

type Props = {
  item: ItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

const CartItem: React.FC<Props> = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img src={item.img} alt={item.title} className="flex-shrink-0 w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.singer}</p>
        <p className="mt-2 font-semibold">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(item.id)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <div className="w-8 text-center">{item.amount}</div>
        <button
          onClick={() => onIncrease(item.id)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>
      <div className="ml-4">
        <button onClick={() => onRemove(item.id)} className="text-sm text-red-500">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
