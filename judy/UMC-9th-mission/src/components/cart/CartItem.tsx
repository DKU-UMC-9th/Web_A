import { useAppDispatch } from '../../store/hooks';
import { increase, decrease, removeItem } from '../../features/cart/cartSlice';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface CartItemProps {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

const CartItem = ({ id, title, singer, price, img, amount }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const handleIncrease = () => {
    dispatch(increase(id));
  };

  const handleDecrease = () => {
    dispatch(decrease(id));
  };

  const handleRemove = () => {
    dispatch(removeItem(id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center gap-4">
      {/* 앨범 이미지 */}
      <div className="flex-shrink-0">
        <img
          src={img}
          alt={title}
          className="w-24 h-24 object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=Album';
          }}
        />
      </div>

      {/* 음반 정보 */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{singer}</p>
        <p className="text-lg font-bold text-blue-600">
          ₩{Number(price).toLocaleString()}
        </p>
      </div>

      {/* 수량 조절 버튼 */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleIncrease}
          className="p-1 hover:bg-blue-100 rounded transition-colors"
          aria-label="수량 증가"
        >
          <ChevronUp className="w-6 h-6 text-blue-600" />
        </button>

        <span className="text-xl font-semibold text-gray-800 min-w-[2rem] text-center">
          {amount}
        </span>

        <button
          onClick={handleDecrease}
          className="p-1 hover:bg-blue-100 rounded transition-colors"
          aria-label="수량 감소"
        >
          <ChevronDown className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* 삭제 버튼 */}
      <button
        onClick={handleRemove}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
      >
        삭제
      </button>
    </div>
  );
};

export default CartItem;
