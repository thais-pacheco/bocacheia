import React, { useState } from 'react';
import { X, CreditCard, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { state: cartState, clearCart } = useCart();
  const { state: authState } = useAuth();
  const { createOrder } = useOrders();
  
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(authState.user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('credit');

  if (!isOpen) return null;

  const restaurant = cartState.items[0]?.food.restaurantId 
    ? { id: cartState.items[0].food.restaurantId, name: 'Restaurante', deliveryFee: 5.00 } as any
    : null;

  const subtotal = cartState.total;
  const deliveryFee = restaurant?.deliveryFee || 5.00;
  const total = subtotal + deliveryFee;

  const handleFinishOrder = async () => {
    if (!authState.isAuthenticated) {
      alert('Você precisa estar logado para finalizar o pedido');
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Por favor, informe o endereço de entrega');
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder(
        cartState.items,
        restaurant || { id: 1, name: 'Restaurante', deliveryFee: 5.00 } as any,
        deliveryAddress,
        paymentMethod
      );
      
      setOrderId(order.id);
      setOrderCreated(true);
      clearCart();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-4">Seu pedido #{orderId} foi recebido com sucesso.</p>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <p className="text-purple-800 font-medium">Tempo estimado de entrega:</p>
            <p className="text-purple-600">30-45 minutos</p>
          </div>
          <button
            onClick={() => {
              setOrderCreated(false);
              onClose();
            }}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Acompanhar Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Finalizar Pedido</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumo do pedido */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
            <div className="space-y-2">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {item.quantity}x {item.food.name}
                  </span>
                  <span className="font-semibold">R$ {(item.food.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Taxa de entrega</span>
                  <span className="font-semibold">R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-purple-600 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço de entrega */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Endereço de Entrega
            </h3>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Digite seu endereço completo..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows={3}
              required
            />
          </div>

          {/* Método de pagamento */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Método de Pagamento
            </h3>
            <div className="space-y-2">
              {[
                { id: 'credit', label: 'Cartão de Crédito', icon: '💳' },
                { id: 'debit', label: 'Cartão de Débito', icon: '💳' },
                { id: 'pix', label: 'PIX', icon: '📱' },
                { id: 'cash', label: 'Dinheiro', icon: '💵' }
              ].map((method) => (
                <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-purple-600"
                  />
                  <span className="mr-3 text-xl">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tempo estimado */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center text-purple-800">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Tempo estimado: 30-45 minutos</span>
            </div>
          </div>

          <button
            onClick={handleFinishOrder}
            disabled={loading || !deliveryAddress.trim()}
            className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : `Confirmar Pedido - R$ ${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};